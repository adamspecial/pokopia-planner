#!/usr/bin/env python3
"""Copies the item pictures into the app (pics/) so they show offline, and makes the map's floor tiles from them.

Run from anywhere:  python3 tools/pictures.py
Needs Pillow (pip install pillow). GitHub runs this for you: see .github/workflows/pictures.yml.

1. Pictures. For every item in data.json with a picture ("im": 1 = Serebii names the file after the item,
   or a string = Serebii's own file name), it downloads the PNG once from Serebii, shrinks it to at most
   256 px and saves it as pics/<key>.webp. <key> is the file name with only a-z, 0-9 and - kept, so a
   Serebii name such as "stylishwall(upper)" is saved as "stylishwallupper". Pictures already in pics/
   are not downloaded again. Pictures that failed are retried each run.

2. Floor tiles. Floors, terrain and rugs cover the map one square at a time, so they need a flat,
   top-down picture rather than the game's 3D icon. Nearly all of their pictures are the same cube drawn
   from the same angle, so one calibrated set of corners (TOP_FACE) unwarps the top face of every one of
   them in a single batch; water-like pictures and rugs are cropped instead. The tiles go in
   pics/top/<key>.webp. They are made from the pictures already here, without downloading anything, and
   only remade when their picture changes or TILE_V goes up.

Everything is recorded in pics/index.json:
  { "v": 1, "pics": { key: short hash }, "missing": { key: reason },
    "tv": TILE_V, "top": { key: [tile hash, "#rrggbb" average colour, picture hash] } }
"""
import concurrent.futures as cf
import hashlib
import io
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request

from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PICS = os.path.join(ROOT, 'pics')
TOP = os.path.join(PICS, 'top')
SOURCE = os.environ.get('PIC_SOURCE', 'https://www.serebii.net/pokemonpokopia/items/')
MAX_SIDE = 256
UA = 'Mozilla/5.0 (compatible; pokopia-planner picture sync; +https://github.com/adamspecial/pokopia-planner)'

TILE_V = 1      # raise to remake every floor tile
TILE = 96       # floor tile size in px
# The shared cube picture (200 x 200, drawn inside 24,24 - 177,182). Its top face's corners are about
# (37,32) (65,72) (172,60) (129,25); TOP_FACE is the middle of that face, well inside the outline and the
# light bevel along its edges (which would show as stripes once tiles sit side by side), in the order
# Pillow's QUAD transform wants: upper-left, lower-left, lower-right, upper-right.
CUBE_BOX = (24, 24, 177, 182)
TOP_FACE = (64, 44, 78, 62, 145, 55, 126, 38)
LIQUID = (12, 30, 68, 62)                 # water, lava etc. (80 x 80): the body below the wavy surface
CROP = {'waterfall': (26, 18, 54, 62)}    # just the falling water, not the cliff either side


def slug(name):
    """Same as picSlug() in index.html."""
    s = unicodedata.normalize('NFD', name)
    s = re.sub('[̀-ͯ]', '', s).lower()
    return re.sub('[^a-z0-9]', '', s)


def pic_key(remote):
    """Same as picKey() in index.html: the saved file's name."""
    return re.sub('[^a-z0-9-]', '', remote)


def wanted():
    """{key: Serebii file name} for every picture, and the keys of ground items (which also get a floor tile)."""
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        items = json.load(f)['items']
    remote, ground = {}, set()
    for it in items:
        im = it.get('im')
        if not im:
            continue
        r = slug(it['n']) if im == 1 else str(im)
        k = pic_key(r)
        if remote.setdefault(k, r) != r:
            raise SystemExit('Two pictures would both be saved as %s: %s and %s' % (k, remote[k], r))
        if it.get('L') == 'g':
            ground.add(k)
    return remote, ground


def fetch(url):
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'image/png,image/*;q=0.9'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise
            last = e
        except Exception as e:  # network hiccup: wait and try again
            last = e
        time.sleep(1.5 * (attempt + 1))
    raise last


def encode(im):
    best = None
    for opts in ({'lossless': True, 'method': 6}, {'quality': 90, 'method': 6}):
        buf = io.BytesIO()
        im.save(buf, 'WEBP', **opts)
        if best is None or buf.tell() < len(best):
            best = buf.getvalue()
    return best


def to_webp(png):
    im = Image.open(io.BytesIO(png))
    im.load()
    im = im.convert('RGBA')
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return encode(im)


def short_hash(data):
    return hashlib.sha1(data).hexdigest()[:8]


def get_one(job):
    key, remote = job
    path = os.path.join(PICS, key + '.webp')
    try:
        data = to_webp(fetch(SOURCE + urllib.request.quote(remote) + '.png'))
    except urllib.error.HTTPError as e:
        return key, None, 'HTTP %d' % e.code
    except Exception as e:
        return key, None, (type(e).__name__ + ': ' + str(e))[:120]
    with open(path, 'wb') as f:
        f.write(data)
    return key, short_hash(data), None


def is_cube(im):
    return im.size == (200, 200) and all(abs(a - b) <= 4 for a, b in zip(im.getbbox() or (0, 0, 0, 0), CUBE_BOX))


def inner_box(im, outline=7):
    """The largest box, centred on the picture and shaped like it, that lies wholly inside it once its outline is shaved off."""
    x0, y0, x1, y1 = im.getbbox() or (0, 0) + im.size
    inside = im.getchannel('A').point(lambda a: 255 if a > 200 else 0).filter(ImageFilter.MinFilter(2 * outline + 1))
    cx, cy, hw, hh = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2

    def box(f):
        return (round(cx - hw * f), round(cy - hh * f), round(cx + hw * f), round(cy + hh * f))

    def fits(f):
        b = inside.crop(box(f))
        return b.getextrema()[0] == 255

    lo, hi = 0.1, 1.0
    if not fits(lo):
        return box(0.4)
    for _ in range(12):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if fits(mid) else (lo, mid)
    return box(lo)


def make_tile(key, path):
    """A flat, opaque, top-down tile for a ground item, and its average colour."""
    im = Image.open(path).convert('RGBA')
    if key in CROP:
        t = im.crop(CROP[key]).resize((TILE, TILE), Image.LANCZOS)
    elif is_cube(im):
        t = im.transform((TILE, TILE), Image.QUAD, TOP_FACE, Image.BICUBIC)
    elif im.size == (80, 80):
        t = im.crop(LIQUID).resize((TILE, TILE), Image.LANCZOS)
    else:  # rugs and anything else: the biggest middle part that stays inside the outline
        t = im.crop(inner_box(im)).resize((TILE, TILE), Image.LANCZOS)
    # fill any see-through corners (round rugs) with the tile's own colour, so it covers its square
    b = t.tobytes()
    px = [b[i:i + 4] for i in range(0, len(b), 4)]
    solid = [p for p in px if p[3] > 200] or px
    avg = tuple(round(sum(p[i] for p in solid) / len(solid)) for i in range(3))
    back = Image.new('RGBA', t.size, avg + (255,))
    back.alpha_composite(t)
    return encode(back.convert('RGB')), '#%02x%02x%02x' % avg


def main():
    os.makedirs(PICS, exist_ok=True)
    os.makedirs(TOP, exist_ok=True)
    index_path = os.path.join(PICS, 'index.json')
    try:
        with open(index_path, encoding='utf-8') as f:
            index = json.load(f)
    except (OSError, ValueError):
        index = {}
    have = index.get('pics', {})
    remote, ground = wanted()

    pics, missing, todo = {}, {}, []
    for k in sorted(remote):
        path = os.path.join(PICS, k + '.webp')
        if k in have and os.path.exists(path):
            pics[k] = have[k]
        elif os.path.exists(path):  # a file added by hand
            with open(path, 'rb') as f:
                pics[k] = short_hash(f.read())
        else:
            todo.append((k, remote[k]))

    print('%d pictures wanted, %d already here, %d to download' % (len(remote), len(pics), len(todo)))
    with cf.ThreadPoolExecutor(max_workers=6) as pool:
        for n, (k, h, err) in enumerate(pool.map(get_one, todo), 1):
            if h:
                pics[k] = h
            else:
                missing[k] = err
            if n % 100 == 0:
                print('  %d / %d' % (n, len(todo)))

    # floor tiles, all in one batch, from the pictures now here
    old_top = index.get('top', {}) if index.get('tv') == TILE_V else {}
    top, made = {}, 0
    for k in sorted(ground & set(pics)):
        tpath = os.path.join(TOP, k + '.webp')
        o = old_top.get(k)
        if o and o[2] == pics[k] and os.path.exists(tpath):
            top[k] = o
            continue
        data, col = make_tile(k, os.path.join(PICS, k + '.webp'))
        with open(tpath, 'wb') as f:
            f.write(data)
        top[k] = [short_hash(data), col, pics[k]]
        made += 1

    # pictures and tiles no item uses any more
    for folder, keep in ((PICS, pics), (TOP, top)):
        for name in os.listdir(folder):
            if name.endswith('.webp') and name[:-5] not in keep:
                os.remove(os.path.join(folder, name))

    size = sum(os.path.getsize(os.path.join(PICS, k + '.webp')) for k in pics)
    tsize = sum(os.path.getsize(os.path.join(TOP, k + '.webp')) for k in top)
    out = {'v': 1, 'source': SOURCE, 'bytes': size + tsize, 'pics': dict(sorted(pics.items())), 'missing': dict(sorted(missing.items())),
           'tv': TILE_V, 'top': dict(sorted(top.items()))}
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, separators=(',', ':'), ensure_ascii=False)
        f.write('\n')
    print('%d pictures in pics/ (%.1f MB), %d missing' % (len(pics), size / 1e6, len(missing)))
    print('%d floor tiles in pics/top/ (%.2f MB), %d made this run' % (len(top), tsize / 1e6, made))
    reasons = {}
    for r in missing.values():
        reasons[r] = reasons.get(r, 0) + 1
    for r, c in sorted(reasons.items(), key=lambda x: -x[1])[:8]:
        print('  missing because %s: %d' % (r, c))
    # fail the run (the index is still written, so the reasons can be read in it) if there are no pictures at all
    return 1 if remote and not pics else 0


if __name__ == '__main__':
    sys.exit(main())

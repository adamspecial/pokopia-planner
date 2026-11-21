#!/usr/bin/env python3
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

from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PICS = os.path.join(ROOT, 'pics')
TOP = os.path.join(PICS, 'top')
SOURCE = os.environ.get('PIC_SOURCE', 'https://www.serebii.net/pokemonpokopia/items/')
PK_DIR = os.path.join(PICS, 'pk')
PK_SOURCE = os.environ.get('PK_SOURCE', 'https://www.serebii.net/pokemonpokopia/pokemon/')
FRAME_V = 1
MAX_SIDE = 256
UA = 'Mozilla/5.0 (compatible; pokopia-planner picture sync; +https://github.com/adamspecial/pokopia-planner)'

TILE_V = 1
TILE = 96
CUBE_BOX = (24, 24, 177, 182)
TOP_FACE = (64, 44, 78, 62, 145, 55, 126, 38)
LIQUID = (12, 30, 68, 62)
CROP = {'waterfall': (26, 18, 54, 62)}


def slug(name):
    s = unicodedata.normalize('NFD', name)
    s = re.sub('[̀-ͯ]', '', s).lower()
    return re.sub('[^a-z0-9]', '', s)


def pic_key(remote):
    return re.sub('[^a-z0-9-]', '', remote)


def wanted():
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        items = json.load(f)['items']
    remote, ground, rugs = {}, set(), set()
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
        if it.get('c') == 'Rug':
            rugs.add(k)
    return remote, ground, rugs


def wanted_pokemon():
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        mons = json.load(f)['pokemon']
    remote = {}
    for p in mons:
        im = p.get('im')
        if not im:
            continue
        r = str(im)
        k = pic_key(r)
        if remote.setdefault(k, r) != r:
            raise SystemExit('Two Pokémon pictures would both be saved as %s: %s and %s' % (k, remote[k], r))
    return remote


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
        except Exception as e:
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


def photo_webp(png):
    im = Image.open(io.BytesIO(png))
    im.load()
    im = im.convert('RGBA')
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=90, method=6)
    return buf.getvalue()


def get_pokemon(job):
    key, remote = job
    try:
        data = photo_webp(fetch(PK_SOURCE + urllib.request.quote(remote) + '.png'))
    except urllib.error.HTTPError as e:
        return key, None, 'HTTP %d' % e.code
    except Exception as e:
        return key, None, (type(e).__name__ + ': ' + str(e))[:120]
    with open(os.path.join(PK_DIR, key + '.webp'), 'wb') as f:
        f.write(data)
    return key, short_hash(data), None


def framing(path, k=0.68, eye_weight=3, bias=0.45, win=0.34):
    im = Image.open(path).convert('RGBA')
    W, H = im.size
    a = im.getchannel('A')
    sil = a.point(lambda v: 255 if v > 60 else 0)
    box = sil.getbbox()
    if not box:
        return [500, 500, 1000]
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    side = max(bw, bh)
    S = min(W, max(k * side, 0.44 * W))
    inner = a.point(lambda v: 255 if v > 220 else 0).filter(ImageFilter.MinFilter(7))
    lum = Image.new('RGB', im.size, (128, 128, 128))
    lum.paste(im.convert('RGB'), mask=a)
    lum = lum.convert('L')
    blur = lum.filter(ImageFilter.GaussianBlur(4))
    det = ImageChops.multiply(ImageChops.difference(lum, blur).point(lambda v: 255 if v > 34 else 0), inner).load()
    dark = lum.point(lambda v: 255 if v < 75 else 0)
    bright = lum.point(lambda v: 255 if v > 215 else 0).filter(ImageFilter.MaxFilter(7))
    eyes = ImageChops.multiply(ImageChops.multiply(dark, bright), inner).load()
    t = [[0] * (W + 1) for _ in range(H + 1)]
    for y in range(H):
        row = 0
        ir, ip = t[y + 1], t[y]
        for x in range(W):
            row += (1 if det[x, y] else 0) + (eye_weight if eyes[x, y] else 0)
            ir[x + 1] = ip[x + 1] + row
    w = max(16, int(win * side))
    best, at = 0, None
    for cy in range(y0 + w // 2, max(y0 + w // 2 + 1, y1 - w // 2 + 1), 3):
        f = 1.0 - bias * (cy - y0) / max(1, bh)
        ay, by = cy - w // 2, cy - w // 2 + w
        for cx in range(x0 + w // 2, max(x0 + w // 2 + 1, x1 - w // 2 + 1), 3):
            ax, bx = cx - w // 2, cx - w // 2 + w
            v = (t[by][bx] - t[ay][bx] - t[by][ax] + t[ay][ax]) * f
            if v > best:
                best, at = v, (cx, cy)
    if at and best > 0.004 * w * w:
        fx, fy = at
    else:
        px = sil.load()
        lim = y0 + max(1, int(0.45 * bh))
        sx = n = 0
        for y in range(y0, lim):
            for x in range(x0, x1):
                if px[x, y]:
                    sx += x
                    n += 1
        fx = sx / n if n else (x0 + x1) / 2
        fy = y0 + 0.4 * S
    cx, cy = fx, fy + 0.04 * S
    cx = min(max(cx, x0 + S / 2 - 0.08 * S), x1 - S / 2 + 0.08 * S) if bw > S else (x0 + x1) / 2
    cy = min(max(cy, y0 + S / 2 - 0.1 * S), y1 - S / 2 + 0.08 * S) if bh > S else (y0 + y1) / 2
    return [round(cx / W * 1000), round(cy / H * 1000), round(S / W * 1000)]


def pokemon_pictures(index):
    os.makedirs(PK_DIR, exist_ok=True)
    remote = wanted_pokemon()
    old = index.get('pk', {}) if index.get('fv') == FRAME_V else {}
    have = index.get('pk', {})
    pk, missing, todo = {}, {}, []
    for k in sorted(remote):
        path = os.path.join(PK_DIR, k + '.webp')
        if os.path.exists(path):
            if k in have:
                pk[k] = have[k][0]
            else:
                with open(path, 'rb') as f:
                    pk[k] = short_hash(f.read())
        else:
            todo.append((k, remote[k]))
    print('%d Pokémon pictures wanted, %d already here, %d to download' % (len(remote), len(pk), len(todo)))
    with cf.ThreadPoolExecutor(max_workers=4) as pool:
        for k, h, err in pool.map(get_pokemon, todo):
            if h:
                pk[k] = h
            else:
                missing[k] = err
    out, framed = {}, 0
    for k in sorted(pk):
        o = old.get(k)
        if o and o[0] == pk[k]:
            out[k] = o
            continue
        out[k] = [pk[k]] + framing(os.path.join(PK_DIR, k + '.webp'))
        framed += 1
    for name in os.listdir(PK_DIR):
        if name.endswith('.webp') and name[:-5] not in out:
            os.remove(os.path.join(PK_DIR, name))
    size = sum(os.path.getsize(os.path.join(PK_DIR, k + '.webp')) for k in out)
    print('%d Pokémon pictures in pics/pk/ (%.1f MB), %d missing, %d portraits framed this run' % (len(out), size / 1e6, len(missing), framed))
    return out, missing, size


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
    im = Image.open(path).convert('RGBA')
    if key in CROP:
        t = im.crop(CROP[key]).resize((TILE, TILE), Image.LANCZOS)
    elif is_cube(im):
        t = im.transform((TILE, TILE), Image.QUAD, TOP_FACE, Image.BICUBIC)
    elif im.size == (80, 80):
        t = im.crop(LIQUID).resize((TILE, TILE), Image.LANCZOS)
    else:
        t = im.crop(inner_box(im)).resize((TILE, TILE), Image.LANCZOS)
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
    remote, ground, rugs = wanted()

    pics, missing, todo = {}, {}, []
    for k in sorted(remote):
        path = os.path.join(PICS, k + '.webp')
        if k in have and os.path.exists(path):
            pics[k] = have[k]
        elif os.path.exists(path):
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

    old_top = index.get('top', {}) if index.get('tv') == TILE_V else {}
    top, made = {}, 0
    for k in sorted(ground & set(pics)):
        tpath = os.path.join(TOP, k + '.webp')
        o = old_top.get(k)
        if o and o[2] == pics[k] and (o[0] == '' if k in rugs else o[0] and os.path.exists(tpath)):
            top[k] = o
            continue
        data, col = make_tile(k, os.path.join(PICS, k + '.webp'))
        if k in rugs:
            top[k] = ['', col, pics[k]]
            continue
        with open(tpath, 'wb') as f:
            f.write(data)
        top[k] = [short_hash(data), col, pics[k]]
        made += 1

    for folder, keep in ((PICS, pics), (TOP, {k for k, t in top.items() if t[0]})):
        for name in os.listdir(folder):
            if name.endswith('.webp') and name[:-5] not in keep:
                os.remove(os.path.join(folder, name))

    pk, pk_missing, pksize = pokemon_pictures(index)
    size = sum(os.path.getsize(os.path.join(PICS, k + '.webp')) for k in pics)
    tsize = sum(os.path.getsize(os.path.join(TOP, k + '.webp')) for k, t in top.items() if t[0])
    out = {'v': 1, 'source': SOURCE, 'bytes': size + tsize + pksize, 'pics': dict(sorted(pics.items())), 'missing': dict(sorted(missing.items())),
           'tv': TILE_V, 'top': dict(sorted(top.items())), 'fv': FRAME_V, 'pk': pk, 'pkmissing': dict(sorted(pk_missing.items()))}
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, separators=(',', ':'), ensure_ascii=False)
        f.write('\n')
    print('%d pictures in pics/ (%.1f MB), %d missing' % (len(pics), size / 1e6, len(missing)))
    print('%d floor tiles in pics/top/ (%.2f MB), %d made this run' % (sum(1 for t in top.values() if t[0]), tsize / 1e6, made))
    reasons = {}
    for r in missing.values():
        reasons[r] = reasons.get(r, 0) + 1
    for r, c in sorted(reasons.items(), key=lambda x: -x[1])[:8]:
        print('  missing because %s: %d' % (r, c))
    return 1 if remote and not pics else 0


if __name__ == '__main__':
    sys.exit(main())

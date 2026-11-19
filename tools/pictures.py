#!/usr/bin/env python3
"""Copies the item pictures into the app (pics/) so they show offline.

Run from anywhere:  python3 tools/pictures.py
Needs Pillow (pip install pillow). GitHub runs this for you: see .github/workflows/pictures.yml.

For every item in data.json with a picture ("im"), it downloads the PNG once from Serebii,
shrinks it to at most 256 px, saves it as pics/<slug>.webp and records it in pics/index.json:
  { "v": 1, "pics": { slug: short content hash }, "missing": { slug: reason } }
Pictures already in pics/ are not downloaded again. Pictures that failed are retried each run.
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

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PICS = os.path.join(ROOT, 'pics')
SOURCE = os.environ.get('PIC_SOURCE', 'https://www.serebii.net/pokemonpokopia/items/')
MAX_SIDE = 256
UA = 'Mozilla/5.0 (compatible; pokopia-planner picture sync; +https://github.com/adamspecial/pokopia-planner)'


def slug(name):
    """Same as picSlug() in index.html."""
    s = unicodedata.normalize('NFD', name)
    s = re.sub('[̀-ͯ]', '', s).lower()
    return re.sub('[^a-z0-9]', '', s)


def wanted_slugs():
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        items = json.load(f)['items']
    out = set()
    for it in items:
        im = it.get('im')
        if im:
            out.add(slug(it['n']) if im == 1 else str(im))
    return sorted(out)


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


def to_webp(png):
    im = Image.open(io.BytesIO(png))
    im.load()
    im = im.convert('RGBA')
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    best = None
    for opts in ({'lossless': True, 'method': 6}, {'quality': 90, 'method': 6}):
        buf = io.BytesIO()
        im.save(buf, 'WEBP', **opts)
        if best is None or buf.tell() < len(best):
            best = buf.getvalue()
    return best


def short_hash(data):
    return hashlib.sha1(data).hexdigest()[:8]


def get_one(s):
    path = os.path.join(PICS, s + '.webp')
    try:
        data = to_webp(fetch(SOURCE + s + '.png'))
    except urllib.error.HTTPError as e:
        return s, None, 'HTTP %d' % e.code
    except Exception as e:
        return s, None, (type(e).__name__ + ': ' + str(e))[:120]
    with open(path, 'wb') as f:
        f.write(data)
    return s, short_hash(data), None


def main():
    os.makedirs(PICS, exist_ok=True)
    index_path = os.path.join(PICS, 'index.json')
    try:
        with open(index_path, encoding='utf-8') as f:
            index = json.load(f)
    except (OSError, ValueError):
        index = {}
    have = index.get('pics', {})
    want = wanted_slugs()
    wanted = set(want)

    pics, missing, todo = {}, {}, []
    for s in want:
        path = os.path.join(PICS, s + '.webp')
        if s in have and os.path.exists(path):
            pics[s] = have[s]
        elif os.path.exists(path):  # a file added by hand
            with open(path, 'rb') as f:
                pics[s] = short_hash(f.read())
        else:
            todo.append(s)

    print('%d pictures wanted, %d already here, %d to download' % (len(want), len(pics), len(todo)))
    with cf.ThreadPoolExecutor(max_workers=6) as pool:
        for n, (s, h, err) in enumerate(pool.map(get_one, todo), 1):
            if h:
                pics[s] = h
            else:
                missing[s] = err
            if n % 100 == 0:
                print('  %d / %d' % (n, len(todo)))

    # pictures no item uses any more
    for name in os.listdir(PICS):
        if name.endswith('.webp') and name[:-5] not in wanted:
            os.remove(os.path.join(PICS, name))

    out = {'v': 1, 'source': SOURCE, 'pics': dict(sorted(pics.items())), 'missing': dict(sorted(missing.items()))}
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, separators=(',', ':'), ensure_ascii=False)
        f.write('\n')
    size = sum(os.path.getsize(os.path.join(PICS, s + '.webp')) for s in pics)
    print('%d pictures in pics/ (%.1f MB), %d missing' % (len(pics), size / 1e6, len(missing)))
    reasons = {}
    for r in missing.values():
        reasons[r] = reasons.get(r, 0) + 1
    for r, c in sorted(reasons.items(), key=lambda x: -x[1])[:8]:
        print('  missing because %s: %d' % (r, c))
    # fail the run (the index is still written, so the reasons can be read in it) if there are no pictures at all
    return 1 if want and not pics else 0


if __name__ == '__main__':
    sys.exit(main())

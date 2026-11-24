import io
import json
import os
import sys
import tempfile
import time
import urllib.request
from collections import Counter, deque

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'towns')
SRC = 'https://www.serebii.net/pokemonpokopia/locations/{}/tile_2-{}-{}.png'
CELL = 8
BASE = -2

SEA = ('Ocean water', -1, 'Ocean rock')
LAKE = ('Water', -1, 'Ordinary soil')
VOID = None

TOWNS = [
    {
        'slug': 'witheredwastelands', 'file': 'withered-wasteland', 'area': 'Withered Wasteland', 'grid': (68.35, 65.0, 68.49, 64.5, 30),
        'kit': 'Wasteland Pokémon Center kit', 'fill': 'Ordinary soil',
        'classes': {
            'deep': [(36, 132, 228)], 'sea': [(36, 156, 228), (60, 180, 228)], 'oob': [(204, 180, 204), (228, 228, 228)],
            'grass': [(156, 228, 132), (156, 204, 132)], 'soil': [(252, 180, 108)], 'sand': [(228, 204, 156)],
            'rock': [(156, 156, 156), (132, 156, 132), (132, 132, 132)], 'road': [(84, 84, 84), (72, 72, 88), (60, 60, 60)],
            'plate': [(108, 108, 108)], 'wood': [(108, 84, 60), (132, 108, 84)], 'darkwood': [(84, 60, 60)], 'brick': [(180, 132, 132), (180, 156, 132)],
        },
        'map': {
            'deep': SEA, 'sea': SEA, 'oob': VOID, 'grass': ('Field grass', 0, None), 'soil': ('Ordinary soil', 0, None), 'sand': ('Ordinary sand', 0, None),
            'rock': ('White rock', 4, 'Cliff rock'), 'road': ('Iron tiling', 0, None), 'plate': ('Iron-plate flooring', 0, None),
            'wood': ('Wooden flooring', 0, None), 'darkwood': ('Crisscross wooden flooring', 0, None), 'brick': ('Arched tiling', 0, None),
        },
        'trees': [('Leppa tree', lambda r, g, b: (g > 150) & (r < 136) & (b < 80) & (g - r > 50))],
        'labels': [('Road to Palette Town', 'exit')],
    },
    {
        'slug': 'bleakbeach', 'file': 'bleak-beach', 'area': 'Bleak Beach', 'grid': (60.39, 56.5, 60.45, 56.0, 34),
        'kit': 'Beach Pokémon Center kit', 'fill': 'Beach sand',
        'classes': {
            'deep': [(36, 132, 228)], 'sea': [(36, 156, 228)], 'lake': [(108, 180, 228)], 'oob': [(204, 180, 204), (228, 228, 228)],
            'grass': [(180, 228, 84)], 'sand': [(228, 204, 156)], 'brick': [(180, 156, 132)], 'clay': [(252, 180, 108), (180, 132, 84)],
            'plate': [(108, 108, 108)], 'road': [(84, 108, 108), (84, 84, 84)], 'wood': [(108, 84, 60), (132, 108, 84)], 'darkwood': [(84, 60, 60), (108, 84, 84)],
            'yellow': [(204, 228, 60)],
        },
        'map': {
            'deep': SEA, 'sea': SEA, 'lake': LAKE, 'oob': VOID, 'grass': ('Seashore grass', 0, None), 'sand': ('Beach sand', 0, None),
            'brick': ('Brick flooring', 0, None), 'clay': ('Clay', 0, None), 'plate': ('Iron-plate flooring', 0, None), 'road': ('Asphalt road', 0, None),
            'wood': ('Wooden flooring', 0, None), 'darkwood': ('Crisscross wooden flooring', 0, None), 'yellow': ('Bumpy beach sand', 0, None),
        },
        'trees': [('Large palm tree', lambda r, g, b: (g > 96) & (g < 168) & (r < 104) & (b < 56))],
        'labels': [('S.S. Anne', 'ship')],
    },
    {
        'slug': 'rockyridges', 'file': 'rocky-ridges', 'area': 'Rocky Ridges', 'grid': (60.37, 57.5, 60.49, 55.5, 34),
        'kit': 'Ridge Pokémon Center kit', 'fill': 'Cave rock',
        'classes': {
            'mass': [(108, 108, 108)], 'oob': [(204, 180, 204), (228, 228, 228)], 'grass': [(60, 180, 36), (60, 156, 36)],
            'cave': [(84, 84, 84)], 'peak': [(60, 60, 84), (36, 36, 60), (60, 60, 60)], 'pale': [(156, 156, 156)], 'soil': [(252, 180, 108)],
            'farm': [(132, 108, 84), (108, 84, 60)], 'lake': [(108, 180, 228), (84, 156, 228)],
        },
        'map': {
            'mass': ('Black cliff rock', 6, 'Black cliff rock'), 'oob': VOID, 'grass': ('Alpine grass', 0, None), 'cave': ('Volcanic ash', 0, None),
            'peak': ('Black rock', 9, 'Volcanic rock'), 'pale': ('White rock', 4, 'White rock'), 'soil': ('Striped soil', 0, None),
            'farm': ('Farm soil', 0, None), 'lake': LAKE,
        },
        'trees': [('Pointy tree', lambda r, g, b: (r < 72) & (g > 80) & (g < 136) & (b > 56) & (b < 120)), ('Leppa tree', lambda r, g, b: (g > 170) & (r > 90) & (r < 150) & (b < 90))],
        'labels': [],
    },
    {
        'slug': 'sparklingskylands', 'file': 'sparkling-skylands', 'area': 'Sparkling Skylands', 'grid': (46.72, 42.0, 46.68, 44.0, 44),
        'kit': 'Skyland Pokémon Center kit', 'fill': 'Skyland cliff rock',
        'classes': {
            'sky': [(252, 252, 252), (228, 252, 252), (228, 228, 252), (240, 240, 248)], 'grass': [(108, 180, 156), (108, 180, 180)],
            'cliff': [(228, 204, 228)], 'road': [(84, 84, 84), (108, 108, 132)], 'sand': [(252, 180, 108)], 'mount': [(156, 156, 156), (132, 132, 132)],
            'seagrass': [(180, 228, 84)], 'alpine': [(60, 180, 36), (60, 180, 12)], 'plate': [(108, 108, 108)], 'brick': [(180, 156, 132)],
            'lake': [(108, 180, 228)],
        },
        'map': {
            'sky': VOID, 'grass': ('Sky-high grass', 0, None), 'cliff': ('Skyland cliff rock', 3, 'Skyland cliff rock'), 'road': ('Asphalt road', 0, None),
            'sand': ('Skyland sand', 0, None), 'mount': ('Coarse rock', 6, 'Coarse rock'), 'seagrass': ('Seashore grass', 0, None),
            'alpine': ('Alpine grass', 0, None), 'plate': ('Iron-plate flooring', 0, None), 'brick': ('Brick flooring', 0, None), 'lake': LAKE,
        },
        'trees': [('Pointy tree', lambda r, g, b: (r < 72) & (g > 80) & (g < 136) & (b > 70) & (b < 130)), ('Leppa tree', lambda r, g, b: (g > 165) & (r > 80) & (r < 150) & (b < 100))],
        'labels': [],
    },
    {
        'slug': 'palettetown', 'file': 'palette-town', 'area': 'Palette Town', 'grid': (42.77, 38.5, 42.95, 35.5, 48),
        'kit': 'Wasteland Pokémon Center kit', 'fill': 'Ordinary soil',
        'classes': {
            'deep': [(36, 132, 228)], 'sea': [(36, 156, 228)], 'oob': [(204, 180, 204), (228, 228, 228)], 'grass': [(156, 228, 132)],
            'sand': [(228, 204, 156)], 'dry': [(204, 204, 108)], 'soil': [(204, 156, 84)], 'lake': [(108, 180, 228)], 'cave': [(84, 84, 84)],
            'stone': [(156, 156, 156)],
        },
        'map': {
            'deep': SEA, 'sea': SEA, 'oob': VOID, 'grass': ('Field grass', 0, None), 'sand': ('Beach sand', 0, None), 'dry': ('Dry field grass', 0, None),
            'soil': ('Striped soil', 0, None), 'lake': LAKE, 'cave': ('Black rock', 5, 'Cave rock'), 'stone': ('White rock', 0, None),
        },
        'trees': [('Large palm tree', lambda r, g, b: (g > 96) & (g < 168) & (r < 104) & (b < 56)), ('Leppa tree', lambda r, g, b: (g > 150) & (r < 136) & (b < 80) & (g - r > 50))],
        'labels': [('Road to Withered Wasteland', 'exit')],
    },
]


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'pokopia-planner-tools'})
    for n in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception:
            time.sleep(2 * (n + 1))
    raise RuntimeError('Could not download ' + url)


def stitch(slug, cache):
    path = os.path.join(cache, slug + '.png')
    if os.path.exists(path):
        return np.array(Image.open(path).convert('RGB'))
    im = Image.new('RGB', (2048, 2048))
    for x in range(8):
        for y in range(8):
            im.paste(Image.open(io.BytesIO(fetch(SRC.format(slug, x, y)))).convert('RGB'), (x * 256, y * 256))
    im.save(path)
    return np.array(im)


def cell_box(grid, i, j, inset):
    px, ox, py, oy, n = grid
    x0, y0 = ox - px + i * px, oy - py + j * py
    xa, xb = int(x0 + px * inset), int(x0 + px * (1 - inset))
    ya, yb = int(y0 + py * inset), int(y0 + py * (1 - inset))
    return max(0, xa), max(0, ya), min(2048, xb), min(2048, yb)


def classify(a, town):
    n = town['grid'][4]
    refs = [(k, np.array(c, float)) for k, cs in town['classes'].items() for c in cs]
    cls = [[None] * n for _ in range(n)]
    for j in range(n):
        for i in range(n):
            xa, ya, xb, yb = cell_box(town['grid'], i, j, 0.22)
            if xb <= xa or yb <= ya:
                continue
            px = a[ya:yb, xa:xb].reshape(-1, 3).astype(float)
            votes = Counter()
            d = np.stack([np.abs(px - c).sum(1) for _, c in refs], 1)
            best = d.argmin(1)
            ok = d[np.arange(len(px)), best] < 46
            for b in best[ok]:
                votes[refs[b][0]] += 1
            if votes:
                k, v = votes.most_common(1)[0]
                if v >= len(px) * 0.4:
                    cls[j][i] = k
    for _ in range(n * 2):
        miss = [(i, j) for j in range(n) for i in range(n) if cls[j][i] is None]
        if not miss:
            break
        upd = {}
        for i, j in miss:
            nb = Counter(cls[y][x] for x, y in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)) if 0 <= x < n and 0 <= y < n and cls[y][x])
            if nb:
                upd[(i, j)] = nb.most_common(1)[0][0]
        for (i, j), k in upd.items():
            cls[j][i] = k
    return cls


def blobs(mask, minpx):
    h, w = mask.shape
    seen = np.zeros_like(mask, bool)
    out = []
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)])
        seen[y0, x0] = True
        pts = []
        while q:
            y, x = q.popleft()
            pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not seen[yy, xx]:
                    seen[yy, xx] = True
                    q.append((yy, xx))
        if len(pts) >= minpx:
            p = np.array(pts)
            out.append((p[:, 1].mean(), p[:, 0].mean(), len(pts), p[:, 1].min(), p[:, 0].min(), p[:, 1].max(), p[:, 0].max()))
    return out


def to_block(town, x, y):
    px, ox, py, oy, n = town['grid']
    return (x - (ox - px)) / px * CELL, (y - (oy - py)) / py * CELL


def b36(v):
    v = int(v)
    if v < 0:
        return '-' + b36(-v)
    s = '0123456789abcdefghijklmnopqrstuvwxyz'
    out = ''
    while True:
        out = s[v % 36] + out
        v //= 36
        if not v:
            return out


def rle(arr):
    out, prev, n = [], arr[0], 0
    for v in arr:
        if v == prev:
            n += 1
        else:
            out.append(b36(prev) + ('*' + b36(n) if n > 1 else ''))
            prev, n = v, 1
    out.append(b36(prev) + ('*' + b36(n) if n > 1 else ''))
    return ','.join(out)


def build(town, a, cls):
    n = town['grid'][4]
    W = H = n * CELL
    layers = {}
    top = np.full((H, W), -999, int)
    names = []

    def ref(name):
        if name not in names:
            names.append(name)
        return names.index(name) + 1

    def put(x, y, z, name):
        if z not in layers:
            layers[z] = np.zeros((H, W), int)
        layers[z][y, x] = ref(name)
        top[y, x] = max(top[y, x], z)

    def column(x, y, spec):
        if spec is None:
            return
        surf, tz, under = spec
        for z in range(BASE, tz):
            put(x, y, z, under or town['fill'])
        put(x, y, tz, surf)

    for j in range(n):
        for i in range(n):
            spec = town['map'][cls[j][i]]
            for y in range(j * CELL, (j + 1) * CELL):
                for x in range(i * CELL, (i + 1) * CELL):
                    column(x, y, spec)

    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    objs, zones = [], []

    def clear_col(x, y):
        for z, L in layers.items():
            L[y, x] = 0
        top[y, x] = -999

    def flat(x0, y0, w, h, spec):
        for y in range(max(0, y0), min(H, y0 + h)):
            for x in range(max(0, x0), min(W, x0 + w)):
                clear_col(x, y)
                column(x, y, spec)

    ground = None
    for k, spec in town['map'].items():
        if spec and spec[1] == 0 and spec[0] not in ('Ocean water', 'Water'):
            cnt = sum(1 for row in cls for c in row if c == k)
            if ground is None or cnt > ground[1]:
                ground = (spec, cnt)
    ground = ground[0]

    red = (r > 220) & (g < 110) & (b < 80)
    pc = blobs(red[::2, ::2], 12)
    pc.sort(key=lambda t: -t[2])
    kit = None
    if pc:
        cx, cy = to_block(town, pc[0][0] * 2, pc[0][1] * 2)
        kx, ky = int(round(cx - 5)), int(round(cy - 5))
        flat(kx - 1, ky - 1, 12, 12, ground)
        kit = (kx, ky)
        objs.append((town['kit'], kx, ky, 10, 10, 1, 5))
    pink = (r > 215) & (g > 140) & (g < 205) & (b > 215)
    hs = blobs(pink[::2, ::2], 12)
    hs.sort(key=lambda t: -t[2])
    if hs:
        cx, cy = to_block(town, hs[0][0] * 2, hs[0][1] * 2)
        hx, hy = int(round(cx - 3)), int(round(cy - 3))
        if kit and hx < kit[0] + 10 and hx + 6 > kit[0] and hy < kit[1] + 10 and hy + 6 > kit[1]:
            hx = kit[0] - 7 if cx < kit[0] + 5 else kit[0] + 11
        flat(hx, hy, 6, 6, ground)
        zones.append(('Your house', hx, hy, 6, 6))

    for name, kind in town['labels']:
        if kind == 'exit':
            m = (r > 225) & (g > 225) & (b > 225)
            cand = blobs(m[::2, ::2], 20)
            best = None
            for c in cand:
                bx, by = to_block(town, c[0] * 2, c[1] * 2)
                if 0 <= bx < W and 0 <= by < H:
                    edge = min(bx, by, W - bx, H - by)
                    gx, gy = int(bx // CELL), int(by // CELL)
                    near = any(cls[yy][xx] in ('oob',) for xx in range(max(0, gx - 2), min(n, gx + 3)) for yy in range(max(0, gy - 2), min(n, gy + 3)))
                    if near and (best is None or edge < best[0]):
                        best = (edge, bx, by)
            if best:
                zones.append((name, int(best[1]) - 4, int(best[2]) - 4, 8, 8))
        if kind == 'ship':
            ks = [(i, j) for j in range(n) for i in range(n) if cls[j][i] in ('plate', 'wood') and j > n * 0.7]
            if ks:
                xs = [i for i, _ in ks]
                ys = [j for _, j in ks]
                zones.append((name, min(xs) * CELL, min(ys) * CELL, (max(xs) - min(xs) + 1) * CELL, (max(ys) - min(ys) + 1) * CELL))

    used = set()
    if kit:
        for y in range(kit[1] - 1, kit[1] + 11):
            for x in range(kit[0] - 1, kit[0] + 11):
                used.add((x, y))
    for zn in zones:
        for y in range(zn[2], zn[2] + zn[4]):
            for x in range(zn[1], zn[1] + zn[3]):
                used.add((x, y))
    for name, fn in town['trees']:
        m = fn(r, g, b)
        for c in blobs(m[::2, ::2], 10):
            bx, by = to_block(town, c[0] * 2, c[1] * 2)
            x, y = int(bx), int(by)
            if not (0 <= x < W and 0 <= y < H) or (x, y) in used:
                continue
            t = top[y, x]
            if t == -999 or t > 0:
                continue
            surf = names[layers[t][y, x] - 1]
            if surf in ('Ocean water', 'Water') or 'flooring' in surf or 'tiling' in surf or 'road' in surf:
                continue
            spots = [(x, y)] if c[2] < 40 else [(x - 1, y), (x + 1, y)]
            for sx, sy in spots:
                if 0 <= sx < W and 0 <= sy < H and (sx, sy) not in used and top[sy, sx] == t:
                    objs.append((name, sx, sy, 1, 1, t + 1, 3))
                    for yy in range(sy - 1, sy + 2):
                        for xx in range(sx - 1, sx + 2):
                            used.add((xx, yy))

    g_out = []
    for z in sorted(layers):
        g_out.append([z, rle(layers[z].reshape(-1).tolist())])
    o_out = []
    for name, x, y, w, h, z, t in objs:
        vals = [ref(name), x, y, w, h] + ([z, t] if t != 1 else [z] if z else [])
        o_out.append('.'.join(b36(v) for v in vals))
    zjs = [{'id': 'town-' + town['file'] + '-' + str(k), 'kind': 'label', 'x': x, 'y': y, 'w': w, 'h': h, 'name': nm, 'target': None} for k, (nm, x, y, w, h) in enumerate(zones)]
    return {
        'v': 3, 'ints': '{}', 'id': 'town-' + town['file'], 'name': town['area'], 'area': town['area'], 'w': W, 'h': H, 'dict': names, 'g': g_out,
        'o': ';'.join(o_out), 'u': '', 'z': json.dumps(zjs, ensure_ascii=False, separators=(',', ':')), 'invs': '{}', 'res': '[]', 'rf': '[]', 'pool': '[]',
        'isz': '{}', 'wx': None, 'hg': '', 'src': '[]', 'updated': 0,
    }, cls


def preview(town, cls, path):
    pal = {}
    n = len(cls)
    img = np.zeros((n, n, 3), np.uint8)
    for j in range(n):
        for i in range(n):
            k = cls[j][i]
            if k not in pal:
                pal[k] = town['classes'][k][0] if k in town['classes'] else (255, 0, 255)
            img[j, i] = pal[k]
    Image.fromarray(img).resize((n * 12, n * 12), Image.NEAREST).save(path)


def main():
    cache = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), 'pokopia-towns')
    os.makedirs(cache, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    for town in TOWNS:
        a = stitch(town['slug'], cache)
        cls = classify(a, town)
        plan, cls = build(town, a, cls)
        preview(town, cls, os.path.join(cache, town['file'] + '-cells.png'))
        with open(os.path.join(OUT, town['file'] + '.json'), 'w', encoding='utf-8') as f:
            f.write(json.dumps(plan, ensure_ascii=False, separators=(',', ':')))
        print(town['area'], plan['w'], 'x', plan['h'], len(plan['o'].split(';')) if plan['o'] else 0, 'objects', os.path.getsize(os.path.join(OUT, town['file'] + '.json')), 'bytes')


if __name__ == '__main__':
    main()

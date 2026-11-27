import concurrent.futures as cf
import datetime
import html
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('SEREBII', 'https://www.serebii.net/pokemonpokopia/')
UA = 'Mozilla/5.0 (compatible; pokopia-planner data check; +https://github.com/adamspecial/pokopia-planner)'
OUT = os.path.join(ROOT, 'reports', 'Data check.md')
DEXES = [('Main', 'availablepokemon.shtml'), ('Event', 'eventpokedex.shtml'), ('Basin', 'basinpokedex.shtml')]
ALIAS = {
    'shelloswestsea': 'Shellos (West Sea)', 'shellos': 'Shellos (West Sea)', 'shelloseastsea': 'Shellos (East Sea)',
    'gastrodonwestsea': 'Gastrodon (West Sea)', 'gastrodon': 'Gastrodon (West Sea)', 'gastrodoneastsea': 'Gastrodon (East Sea)',
    'paldeanwooper': 'Wooper (Paldean)', 'wooperpaldean': 'Wooper (Paldean)',
    'frillishmaleform': 'Frillish', 'frillishfemaleform': 'Frillish', 'jellicentmaleform': 'Jellicent', 'jellicentfemaleform': 'Jellicent',
}


def norm(s):
    s = unicodedata.normalize('NFD', html.unescape(s or ''))
    s = re.sub('[̀-ͯ]', '', s).lower()
    return re.sub('[^a-z0-9]', '', s)


SYN = {'tree': 'largetree', 'windmill': 'windmillkit', 'waterwheel': 'waterwheelkit', 'furnace': 'furnacekit', 'bike': 'bicycle', 'strengthrock': 'strengthboulder',
       'canvas': 'blankcanvas', 'garbagebin': 'wastebin', 'vegetables': 'vegetablefield', 'lostreliclarge': 'largelostrelic', 'post': 'barrier', 'plaincloset': 'closet',
       'woodenpartition': 'partition', 'seatwidde': 'seatwide', 'professorstreasuretrove': 'professorstreasure', 'tallgrassany': 'tallgrass'}
IMPLIED = {'highuplocation'}
KEPT = {
    'recipe:007': 'Game8 lists Lighting (any) ×1; Serebii\'s ×10 looks like a typo',
    'recipe:010': 'Game8 lists the 2 water too',
    'recipe:019': 'Game8 lists Seat (any), Table (any) and Plated food; Serebii shows examples',
    'recipe:033': 'Game8 lists the plated food too',
    'recipe:047': 'Game8 lists the Naptime bed too',
    'recipe:091': 'Game8 lists 2 tables',
    'recipe:113': 'Game8 lists 2 hot-spring water',
    'recipe:170': 'Game8 lists the science experiment too',
    'recipe:183': 'Game8 lists the Pop art table too',
    'recipe:187': 'Game8 lists the hot-spring water too',
    'recipe:209': 'Game8 lists the ribbon cake too',
    'recipe:B012': 'Game8 lists 4 sea moss',
    'spec:Drednaw': 'Game8 and Dexerto give Crush and Bulldoze; Serebii and The Game Haus give Chop and Bulldoze',
}


def bare(s):
    k = norm(re.sub(r'\s*\(any\)\s*$', '', s or '', flags=re.I))
    return SYN.get(k, k)


def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', '', s or ''))).strip()


def fetch(path):
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(BASE + path, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            last = e
        except Exception as e:
            last = e
        time.sleep(2 * (attempt + 1))
    raise last


SKIP = ('food', 'keyitems')
IGNORE = re.compile(r'seeds?\b|sapling|sprout|stump|^dry |\(grow\)|^small .*(tree|plant)$|^blooming |^ripe |shoots$|^broken |^damaged |^rusted |^muddy |^barren |debris|fragments?$|^worn |deposit|^grubby rags$|\(outdoors?\)$|^strength rock$|^mud$|mysterious (slate|stone)|lost (sunken )?relic|feather$|wish note|^farm soil \(|relocation kit|demolition kit|rebuild kit|crystal cluster|^broken timber$', re.I)
ITEM_ALIAS = {'altarofflamekit': 'Altar of the Flame kit'}


def serebii_items():
    t = fetch('items.shtml') or ''
    marks = [(m.start(), m.group(1)) for m in re.finditer(r'<a name="([^"]+)"></a>List of', t)]
    out = []
    for m in re.finditer(r'<tr><td class="cen"><a href="items/([^"]+)\.shtml">(.*?)</tr>', t, re.S):
        sec = ''
        for pos, name in marks:
            if m.start() > pos:
                sec = name
        if sec in SKIP:
            continue
        cells = re.findall(r'<td[^>]*>(.*?)</td>', m.group(2), re.S)
        name = clean(re.search(r'<u>(.*?)</u>', m.group(2), re.S).group(1)) if '<u>' in m.group(2) else ''
        desc = clean(cells[1]) if len(cells) > 1 else ''
        tag = clean(cells[2]) if len(cells) > 2 else ''
        if name:
            out.append({'slug': m.group(1), 'n': name, 'sec': sec, 'cd': desc.startswith('Music CD'), 'tg': tag if tag in ('Toy', 'Decoration', 'Relaxation', 'Road') else ''})
    return out


def serebii_dex():
    out = []
    for dex, page in DEXES:
        t = fetch(page) or ''
        for m in re.finditer(r'<td class="cen">#(\d+)</td>(.*?)</tr>\s*(?=<tr>|</table>)', t, re.S):
            body = m.group(2)
            link = re.search(r'pokedex/([^"/]+)\.shtml"><u>(.*?)</u>', body, re.S)
            if not link:
                continue
            spec = [clean(s) for s in re.findall(r'specialty/[^"]+\.shtml"><u>(.*?)</u>', body, re.S)]
            out.append({'dex': dex, 'no': m.group(1), 'slug': link.group(1), 'n': clean(link.group(2)), 's': spec})
    return out


def serebii_pokemon(slug):
    t = fetch('pokedex/' + slug + '.shtml')
    if not t:
        return None
    i = t.find('<a name="general">')
    t = t[i:] if i >= 0 else t
    j = t.find('Habitats &amp; Locations') if 'Habitats &amp; Locations' in t else t.find('Habitats & Locations')
    head = t[:j] if j > 0 else t
    types = re.findall(r'/type/icon/[^"]+"\s+alt="([^"]+)"', head)
    spec = [clean(s) for s in re.findall(r'specialty/[^"]+\.shtml"><u>(.*?)</u>', head, re.S)]
    ideal = [clean(s) for s in re.findall(r'idealhabitat/[^"]+\.shtml"><u>(.*?)</u>', head, re.S)]
    favs = [f for f in (clean(s) for s in re.findall(r'/favorites/[^"]+\.shtml"><u>(.*?)</u>', head, re.S)) if f.lower() != 'none']
    flav = [clean(s) for s in re.findall(r'flavors\.shtml"><u>(.*?)</u>', head, re.S)]
    return {'t': types, 's': spec, 'ideal': ideal[0] if ideal else '', 'fv': favs, 'fl': flav[0] if flav else ''}


def serebii_habitats():
    t = fetch('habitats.shtml') or ''
    marks = sorted((t.find('<a name="%s">' % g), g) for g in ('main', 'basin', 'event') if t.find('<a name="%s">' % g) >= 0)
    out = []
    for m in re.finditer(r'<td class="cen">#(\d+)</td>\s*<td class="cen"><a href="habitatdex/([^"]+)\.shtml">.*?<u>(.*?)</u>', t, re.S):
        g = 'main'
        for pos, name in marks:
            if m.start() > pos:
                g = name
        out.append({'g': g, 'no': m.group(1), 'slug': m.group(2), 'n': clean(m.group(3))})
    return out


def serebii_habitat(slug):
    t = fetch('habitatdex/' + slug + '.shtml')
    if not t:
        return None
    i = t.find('<h2>Requirements')
    j = t.find('Available Pok', i)
    req = []
    for m in re.finditer(r'<td class="fooinfo">(.*?)</td>\s*<td class="fooinfo">\s*(\d+)\s*</td>', t[i:j] if i >= 0 else '', re.S):
        req.append((clean(m.group(1)), int(m.group(2))))
    k = t.find('Game Names', j)
    pks = []
    for n in re.findall(r'<td class="fooevo"><a href="/pokemonpokopia/pokedex/[^"]+\.shtml">(.*?)</a>', t[j:k] if j >= 0 else ''):
        n = clean(n)
        if n not in pks:
            pks.append(n)
    return {'r': req, 'p': pks}


def many(fn, keys, workers=3):
    res = {}
    with cf.ThreadPoolExecutor(workers) as ex:
        futs = {ex.submit(slow, fn, k): k for k in keys}
        for f in cf.as_completed(futs):
            res[futs[f]] = f.result()
    return res


def slow(fn, k):
    time.sleep(0.3)
    return fn(k)


def data_name(n, names):
    k = norm(n)
    if k in ALIAS:
        return ALIAS[k]
    if k in names:
        return names[k]
    m = re.match(r'^(.*?) ([\w-]+(?: [\w-]+)?) Form$', n)
    if m and norm(m.group(1) + m.group(2)) in names:
        return names[norm(m.group(1) + m.group(2))]
    return names.get('swap:' + k) or names.get('base:' + k)


def check(quick=False):
    with open(os.path.join(ROOT, 'data.json'), encoding='utf-8') as f:
        d = json.load(f)
    favs = d['favs']
    out = {'items': {}, 'pokemon': {}, 'habitats': {}, 'materials': {}}

    s_all = serebii_items()
    s_mats, s_items = [x for x in s_all if x['sec'] == 'materials'], [x for x in s_all if x['sec'] != 'materials']
    mats = {norm(m['n']) for m in d['materials']}
    out['materials'] = {'serebii': len(s_mats), 'ours': len(d['materials']), 'new': [x['n'] for x in s_mats if norm(x['n']) not in mats and norm(x['n']) not in {norm(i['n']) for i in d['items']} and not re.search(r'\(outdoors?\)$', x['n'])]}
    by, byim = {}, {}
    for it in d['items']:
        by.setdefault(norm(it['n']), it)
        if isinstance(it.get('im'), str):
            byim.setdefault(norm(it['im']), it)
    seen, skipped = set(), 0
    new, tagd = [], []
    for si in s_items:
        k = norm(si['n'])
        it = by.get(k) or (by.get(norm(ITEM_ALIAS[k])) if k in ITEM_ALIAS else None) or byim.get(norm(si['slug']))
        if not it:
            base = re.sub(r'\s*\([^)]*\)$', '', si['n'])
            if si['cd'] or IGNORE.search(si['n']) or (base != si['n'] and (norm(base) in by or norm(base) + 's' in by)):
                skipped += 1
                continue
            new.append(si['n'] + ' (' + ', '.join(filter(None, [si['sec'].replace('.', ''), si['tg']])) + ')')
            continue
        seen.add(it['n'])
        if si['tg'] and (it.get('tg') or '') != si['tg'] and not (si['tg'] == 'Road' and not it.get('tg')):
            tagd.append('%s: %s here, %s on Serebii' % (it['n'], it.get('tg') or 'no tag', si['tg']))
    gone = sorted(it['n'] for it in d['items'] if it['n'] not in seen and it.get('c') != 'Terrain')
    out['items'] = {'serebii': len(s_items), 'ours': len(d['items']), 'new': new, 'tag': tagd, 'gone': gone, 'skipped': skipped}

    dex = serebii_dex()
    pnames = {norm(p['n']): p['n'] for p in d['pokemon']}
    bases = {}
    for p in d['pokemon']:
        m = re.match(r'^(.*) \((.*)\)$', p['n'])
        if m:
            pnames.setdefault('swap:' + norm(m.group(2) + m.group(1)), p['n'])
            bases.setdefault(norm(m.group(1)), []).append(p['n'])
    for b, ns in bases.items():
        if len(ns) == 1 and b not in pnames:
            pnames['base:' + b] = ns[0]
    pk = {p['n']: p for p in d['pokemon']}
    newp, specd, matched, kept = [], [], {}, []
    for e in dex:
        n = data_name(e['n'], pnames)
        if not n:
            newp.append('%s (%s #%s)' % (e['n'], e['dex'], e['no']))
            continue
        matched.setdefault(n, e)
        p = pk[n]
        if e['s'] and set(e['s']) != set(p.get('s') or []):
            if 'spec:' + n in KEPT:
                kept.append(n + ': ' + KEPT['spec:' + n])
            else:
                specd.append('%s: %s here, %s on Serebii' % (n, ', '.join(p.get('s') or []) or 'none', ', '.join(e['s'])))
    gonep = sorted(n for n in pk if n not in matched)
    fieldd = []
    if not quick:
        pages = many(serebii_pokemon, sorted({e['slug'] for e in matched.values()}))
        for n, e in sorted(matched.items()):
            sp = pages.get(e['slug'])
            if not sp:
                continue
            p = pk[n]
            diffs = []
            if sp['t'] and set(sp['t']) != set(p.get('t') or []):
                diffs.append('types %s, Serebii %s' % ('/'.join(p.get('t') or []), '/'.join(sp['t'])))
            if sp['ideal'] and sp['ideal'] != p.get('ideal'):
                diffs.append('ideal habitat %s, Serebii %s' % (p.get('ideal'), sp['ideal']))
            mine = [favs[i] for i in p.get('fv') or []]
            if sp['fv'] and set(map(norm, sp['fv'])) != set(map(norm, mine)):
                diffs.append('favourites %s, Serebii %s' % (', '.join(mine), ', '.join(sp['fv'])))
            if sp['fl'] and norm(sp['fl']) != norm(p.get('fl') or ''):
                diffs.append('flavour %s, Serebii %s' % (p.get('fl'), sp['fl']))
            if diffs:
                fieldd.append(n + ': ' + '; '.join(diffs))
    out['pokemon'] = {'serebii': len(dex), 'ours': len(d['pokemon']), 'new': newp, 'spec': specd, 'gone': gonep, 'fields': fieldd}

    hs = serebii_habitats()
    pre = {'main': '', 'basin': 'B', 'event': 'E'}
    hb = {h['id']: h for h in d['habitats']}
    newh, named, recd, pkd, seenh = [], [], [], [], set()
    pages = {} if quick else many(serebii_habitat, [h['slug'] for h in hs])
    for e in hs:
        hid = pre[e['g']] + e['no'].zfill(3)
        h = hb.get(hid)
        if not h:
            newh.append('%s %s' % (hid, e['n']))
            continue
        seenh.add(hid)
        if norm(h['n']) != norm(e['n']):
            named.append('%s: %s here, %s on Serebii' % (hid, h['n'], e['n']))
        sp = pages.get(e['slug'])
        if not sp:
            continue
        mine = sorted((bare(t), q) for t, q in h['r'] if bare(t) not in IMPLIED)
        theirs = sorted((bare(t), q) for t, q in sp['r'] if bare(t) not in IMPLIED)
        if sp['r'] and mine != theirs and 'recipe:' + hid in KEPT:
            kept.append('%s %s: %s' % (hid, h['n'], KEPT['recipe:' + hid]))
        elif sp['r'] and mine != theirs:
            recd.append('%s %s: %s here, %s on Serebii' % (hid, h['n'], ', '.join('%s ×%d' % (t, q) for t, q in h['r']), ', '.join('%s ×%d' % (t, q) for t, q in sp['r'])))
        mp = set(norm(x) for x in h['p'])
        tp = set(norm(data_name(x, pnames) or x) for x in sp['p'])
        if sp['p'] and mp != tp:
            add = sorted(x for x in sp['p'] if norm(data_name(x, pnames) or x) not in mp)
            drop = sorted(x for x in h['p'] if norm(x) not in tp)
            pkd.append('%s %s: %s' % (hid, h['n'], '; '.join(filter(None, ['Serebii adds ' + ', '.join(add) if add else '', 'Serebii lacks ' + ', '.join(drop) if drop else '']))))
    goneh = sorted(hid + ' ' + hb[hid]['n'] for hid in hb if hid not in seenh)
    out['habitats'] = {'serebii': len(hs), 'ours': len(d['habitats']), 'new': newh, 'name': named, 'recipe': recd, 'pokemon': pkd, 'gone': goneh}
    out['kept'] = kept
    return out


def section(title, rows, limit=200):
    if not rows:
        return ''
    body = '\n'.join('- ' + r for r in rows[:limit])
    more = '\n- …and %d more' % (len(rows) - limit) if len(rows) > limit else ''
    return '\n### %s (%d)\n\n%s%s\n' % (title, len(rows), body, more)


def report(r, quick):
    it, pk, hb, mt = r['items'], r['pokemon'], r['habitats'], r['materials']
    lines = ['# Data check', '',
             'Compares `data.json` with Serebii\'s lists, so new and changed game data shows up. `tools/data_check.py` writes it, and GitHub runs it every week.', '',
             'Checked on %s%s.' % (datetime.date.today().isoformat(), ', lists only' if quick else ''), '',
             '| | Serebii | data.json | New on Serebii | Different |', '|---|---|---|---|---|',
             '| Items | %d | %d | %d | %d |' % (it['serebii'], it['ours'], len(it['new']), len(it['tag'])),
             '| Materials | %d | %d | %d | |' % (mt['serebii'], mt['ours'], len(mt['new'])),
             '| Pokémon | %d | %d | %d | %d |' % (pk['serebii'], pk['ours'], len(pk['new']), len(pk['spec']) + len(pk['fields'])),
             '| Habitats | %d | %d | %d | %d |' % (hb['serebii'], hb['ours'], len(hb['new']), len(hb['name']) + len(hb['recipe']) + len(hb['pokemon'])), '']
    body = ''.join([
        '\n## Items\n', '\nNot compared: %d music CDs, relics, slates, seeds, growth stages, dry or colour variants of items already here, and world clutter such as debris and deposits.\n' % it['skipped'],
        section('On Serebii, not in data.json', it['new']), section('Tag differs', it['tag']),
        section('Materials on Serebii, not in data.json', mt['new']),
        section('In data.json, not in Serebii\'s list', it['gone']),
        '\n## Pokémon\n', section('On Serebii, not in data.json', pk['new']), section('Specialty differs', pk['spec']),
        section('Other fields differ', pk['fields']), section('In data.json, not in Serebii\'s lists', pk['gone']),
        '\n## Habitats\n', section('On Serebii, not in data.json', hb['new']), section('Name differs', hb['name']),
        section('Recipe differs', hb['recipe']), section('Pokémon differ', hb['pokemon']), section('In data.json, not in Serebii\'s list', hb['gone']),
        '\n## Checked and kept\n\nDifferences already checked against another source, where data.json stays as it is.\n' if r['kept'] else '', section('Kept', r['kept']),
    ])
    return '\n'.join(lines) + body


def main():
    quick = '--quick' in sys.argv
    r = check(quick)
    text = report(r, quick)
    old = ''
    if os.path.exists(OUT):
        with open(OUT, encoding='utf-8') as f:
            old = f.read()
    strip = lambda s: re.sub(r'Checked on [0-9-]+', '', s)
    if strip(old) != strip(text):
        with open(OUT, 'w', encoding='utf-8') as f:
            f.write(text)
        print('Wrote', os.path.relpath(OUT, ROOT))
    else:
        print('No change')
    print('Items new %d, Pokémon new %d, habitats new %d' % (len(r['items']['new']), len(r['pokemon']['new']), len(r['habitats']['new'])))


if __name__ == '__main__':
    main()

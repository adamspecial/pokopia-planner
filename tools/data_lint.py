import json
import os
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPECIAL = {'High-up location'}


def lint(d):
    bad = []
    favs, items, mons, habs, mats = d['favs'], d['items'], d['pokemon'], d['habitats'], d['materials']
    item_names = [i['n'] for i in items]
    names = set(item_names)
    aliases = {a: i['n'] for i in items for a in i.get('al') or []}
    mat_names = {m['n'] for m in mats}
    mon_names = [p['n'] for p in mons]
    groups, terr = d['groups'], d['terrainReq']

    def dupes(what, seq):
        for n, k in Counter(seq).items():
            if k > 1:
                bad.append('%s %s appears %d times' % (what, n, k))

    dupes('Item', item_names)
    dupes('Material', [m['n'] for m in mats])
    dupes('Pokémon', mon_names)
    dupes('Habitat', [h['id'] for h in habs])
    for a, n in aliases.items():
        if a in names:
            bad.append('Item %s has the old name %s, which is also an item' % (n, a))

    def favs_ok(what, fv):
        for f in fv or []:
            if not isinstance(f, int) or not 0 <= f < len(favs):
                bad.append('%s has favourite %r, which is not a known kind' % (what, f))
        for f, k in Counter(fv or []).items():
            if k > 1:
                bad.append('%s lists favourite %s twice' % (what, favs[f] if isinstance(f, int) and 0 <= f < len(favs) else f))

    for it in items:
        favs_ok('Item ' + it['n'], it.get('fv'))
        for m in it.get('m') or []:
            if not (isinstance(m, list) and len(m) == 2 and isinstance(m[1], (int, float)) and m[1] > 0):
                bad.append('Item %s has a recipe line %r that is not [material, amount]' % (it['n'], m))
            elif m[0] not in mat_names and m[0] not in names:
                bad.append('Item %s needs %s, which is neither a material nor an item' % (it['n'], m[0]))

    spec = set(d['specialties'])
    for p in mons:
        favs_ok('Pokémon ' + p['n'], p.get('fv'))
        for s in p.get('s') or []:
            if s not in spec:
                bad.append('Pokémon %s has specialty %s, which has no description' % (p['n'], s))
    mon_set = set(mon_names)

    for h in habs:
        what = 'Habitat %s %s' % (h['id'], h['n'])
        if not h.get('r'):
            bad.append(what + ' has no recipe')
        for tok, q in h.get('r') or []:
            if not (isinstance(q, int) and q > 0):
                bad.append('%s needs %r of %s' % (what, q, tok))
            if tok not in groups and tok not in terr and tok not in names and tok not in aliases and tok not in SPECIAL:
                bad.append('%s needs %s, which is not an item, a group or a terrain' % (what, tok))
        for n in h.get('p') or []:
            if n not in mon_set:
                bad.append('%s attracts %s, who is not in the Pokédex' % (what, n))

    for g, members in groups.items():
        if not members:
            bad.append('Group %s is empty' % g)
        for n in members:
            if n not in names:
                bad.append('Group %s lists %s, which is not an item' % (g, n))
    for g, n in d['defaults'].items():
        if g not in groups:
            bad.append('Default for %s, which is not a group' % g)
        elif n not in groups[g]:
            bad.append('Default for %s is %s, which is not in the group' % (g, n))
    for t, n in terr.items():
        if n not in names:
            bad.append('Terrain %s is %s, which is not an item' % (t, n))
    for out, rule in d['process'].items():
        for n in [rule[0]] + (rule[2] if len(rule) > 2 else []):
            if n not in mat_names:
                bad.append('Processing %s takes %s, which is not a material' % (out, n))
        if out not in mat_names:
            bad.append('Processing makes %s, which is not a material' % out)
    return bad


def main():
    d = json.load(open(os.path.join(ROOT, 'data.json'), encoding='utf-8'))
    bad = lint(d)
    for b in bad:
        print(b)
    print('%d problems' % len(bad) if bad else 'data.json is consistent')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()

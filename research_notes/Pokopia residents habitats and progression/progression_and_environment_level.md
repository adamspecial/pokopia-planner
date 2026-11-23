# Pokopia progression: environment level, story and area unlocks, recipe and feature unlocks

(Research in progress, started 2026-11-23. Sections filled as sources are read.)

## Environment level: point sources, thresholds, cap, decay

### Takeaway
(pending)

### Cited Findings
- [guide] Environment level (環境レベル) of a town is set by the total of the comfort (すみごこち) of the Pokémon living in that town: "環境レベルは街に住んでいるポケモン達の「すみごこち」の合計で決まります" — [Game8 JP, 環境レベルの効率的な上げ方](https://game8.jp/pocoapokemon/767551)
- [guide] Listed ways to raise it: build habitats and befriend Pokémon; solve requests (おねがいごと); ask "すみごこち どう？" and do what the Pokémon wants (furniture, darkening the area, etc.); give a dish of the Pokémon's favourite flavour via "これ見て！"; level the path to the Pokémon Center (fill holes, add stairs) so Pokémon can go out; befriend Mythical/Legendary Pokémon, which "have a larger effect on environment level than other Pokémon"; move Pokémon into high-grade houses (shop "◯◯のりっぱなキット" kits) where comfort tends to max out — [Game8 JP](https://game8.jp/pocoapokemon/767551)
- [guide] Each area has its own Environment Level, from 1 up to 10 — [Serebii, Environment Level & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] Serebii: raise it by making as many Pokémon in the area happy (Comfy Level); completing Requests also raises it "such as Restoring the Pokémon Center"; "If you add buildings and other kits, it will also help raise it even if a Pokémon doesn't immediately live there"; a Legendary or Mythical Pokémon with raised Comfy Level makes it rise quicker — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] Comfy Level: a Pokémon with no habitat or home counts as 0; five tiers Awesome, Great, Nice, Average, Iffy; a Pokémon in a built house rises faster than one only in a habitat; disliked things near the habitat lower it; with Bubbly Basin (Expansion Pass Part 1) a Pokémon with the Scrub specialty following you cleans encountered Pokémon, raising their comfy level and friendship — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] It can fall. Game8 JP lists three causes: leaving a comfort-raising item or object broken; taking a Pokémon to another map (the town total changes); rain putting out outdoor fires (bonfires) — roof them over — [Game8 JP](https://game8.jp/pocoapokemon/767551)
- [guide] When it falls, the shop lineup added by that level reverts until the level is regained (Game8 JP); Serebii: "all unpurchased items that unlock at that level in the shop are locked again and any challenges from that level are locked once more" — [Game8 JP](https://game8.jp/pocoapokemon/767551); [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [community-tested] ぼってぃ's in-game test (note.com, 16 March 2026, i.e. version 1.0.x): environment level is the sum of each resident's comfort points (すみごこちpt, the tester's own unofficial name). Points per comfort rank: 最高 (Awesome) 10, めちゃイイ感じ (Great) 5, ちょっといい感じ (Nice) 2, ふつう (Average) 1; びみょう (Iffy) and すみかなし (no home) treated as 0. Derived by solving two towns that showed the same meter: Rocky Ridges 4 Awesome + 5 Great + 13 Nice + 2 Average and Sparkling Skylands 2 Awesome + 8 Great + 15 Nice + 3 Average both total 93 — [ぼってぃ, ぽこあポケモン 環境レベルを検証する](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested] Cumulative comfort points needed (same test, Rocky Ridges reset to Lv. 1 then rebuilt): Lv. 2 = 3 (estimated from the meter being about 1/3 full after one Average resident), Lv. 3 = 12, Lv. 4 = 26, Lv. 5 = 52, Lv. 6 = 77, Lv. 7 = 100, Lv. 8 = 120, Lv. 9 = 140, Lv. 10 = 160. So 16 Awesome residents are the minimum for Lv. 10 — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested] Hysteresis: when the total falls below a level's threshold the level is kept for a margin, e.g. Lv. 5 (52 pt) was still held at about 50 pt; a meter at 0 is therefore not necessarily the boundary — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440). A calculator crediting Reddit user u/mogsetsu says the level drops only below about 75% progress of that level, and that the progress bar is a linear interpolation between the current and next threshold (unverified; read only via search snippets, site blocked from this session) — [PokoTraqr Environment Level Calculator](https://www.pokotraqr.com/paradise/env-calculator)
- [community-tested, second source] The u/mogsetsu scoring (r/Pokopia, via PokoTraqr and translated on X by あみにし and linked from ぽこポケ学会) gives regular Pokémon and Ditto 10 / 5 / 2 / 1 for Awesome / Great / Nice / Average, the same as ぼってぃ, and Legendary/Mythical Pokémon double: 20 / 10 / 4 / 2; its example path to Lv. 10 totals 160 points — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator); [ぽこポケ学会 家と住み心地 (link list)](https://kyu49.github.io/Pokopia/house/); [あみにし on X](https://x.com/aminisi/status/2034427479033827747)
- [unverified, conflicting] Pokopia Island's calculator describes a different model: 0-8 points per Pokémon, total divided by 8 for the base level, plus a habitat-variety bonus and +5 per Legendary. No test is cited; it disagrees with both tested sources — [Pokopia Island Environment Level Calculator](https://pokopiaisland.com/tools/environment-calculator) (seen only in search snippets)
- [community-tested] Ditto's own house (メタモンの家) has a comfort rating and counts toward environment level; it maxes with 13 kinds of furniture, and only 5 kinds each of toy / rest / decoration are evaluated — [ぽこポケ学会, 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- [community-tested] Comfort changes only register when the Pokémon notices the change (on-screen, or after you lead it there, or after a town reload); breaking a house did not drop the level at once — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested, hypothesis] ぼってぃ's comfort model: rest item 0-2 (needed), favourite-flavour food 0-2 (probably needed), toys and decorations 0-6 combined, liked environment 0 or 2 (optional); a total of 9 or more gives Awesome, 6-8 Great, 4-5 Nice, 0-3 Average. Feeding a favourite food for 7 days alone only reached Nice. Blocking the path to the Pokémon Center did not change comfort in this test — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested] ぽこポケ学会's order of comfort factors (roughly by importance): no disliked environment within range; liked environment met; not hungry; rest, toy and decoration all in range; some favourite items in range (duplicates add little or nothing); kit house > built house > habitat (hypothesis); path to the Pokémon Center connected. The "すみごこちどう？" request comes once a day — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [official patch notes via guide] Version 2.0.0 (5 August 2026): a Pokémon whose habitat is destroyed moves back in if the same habitat is rebuilt nearby; Pokémon made sad by removed furniture notice its replacement more quickly — [Serebii, Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)

### Inferences

### Gaps

## What each environment level unlocks per area

### Takeaway
(pending)

### Cited Findings
- [guide] Each level adds new challenges in the PC (チャレンジ, the only source of Life Coins per Game8 JP) and more shop stock, different per area; new requests from residents open with each level; Lv. 5 gives a special gift of items and Lv. 10 gives recipes — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [Game8 JP](https://game8.jp/pocoapokemon/767551)
- [guide] Pokémon Center rebuilding kit (ポケセンたてなおしキット) unlocks at Lv. 3 in every town — [Game8 JP](https://game8.jp/pocoapokemon/767551)
- [guide] Lv. 5 rewards from the "さらに環境レベルを上げよう！" request that follows each town's story request: Withered Wastelands Cracker (クラッカー, needed for Team Initiation Challenge EX), Rocky Ridges Refrigerator (れいぞうこ), Bleak Beach Washing machine (せんたくき), Sparkling Skylands Game Boy (ゲームボーイ), the last three needed for Team Initiation Challenge part 7 — [Game8 JP](https://game8.jp/pocoapokemon/767551)
- [guide] Serebii's full per-area shop-unlock list (items and recipes by level, Lv. 2-10 for Withered Wastelands, Bleak Beach, Rocky Ridges, Sparkling Skylands, Palette Town and Bubbly Basin; Lv. 1-10 for Cloud Island, whose purchases stay on Cloud Island). Counts parsed: Withered Wastelands 28 items + 37 recipes, Bleak Beach 25 + 41, Rocky Ridges 23 + 27, Sparkling Skylands 18 + 38, Palette Town 24 + 33, Bubbly Basin 26 + 45, Cloud Island 159 items — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] Kits by level (Serebii): Withered Wastelands Leaf hut Lv.2, Leaf den Lv.3, Leaf cottage Lv.4, Leaf house and Pink hut Lv.5, Relaxing park Lv.8; Bleak Beach Sand den Lv.2, Sand hut Lv.3, Sand cottage and Pikachu fountain Lv.4, Sand house and Orange hut Lv.5, Stylish café Lv.8, Beach and Wasteland Pokémon Center kits Lv.10; Rocky Ridges Stone hut Lv.2, Stone den and Moonlight dance statue Lv.3, Stone cottage Lv.4, Stone house and Gray hut Lv.5, Concert stage Lv.8, Ridge Pokémon Center Lv.10; Sparkling Skylands Pokémart Lv.3, Yellow hut Lv.5, Small office Lv.8, Skyland Pokémon Center Lv.10; Palette Town Fountain plaza Lv.8; Bubbly Basin Submarine Lv.2, Clock tower and Aqua cottage Lv.3, Imperial cottage and Laboratory Lv.4, Imperial house and Supermarket Lv.5, Basin Pokémon Center kit recipe Lv.10 — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] Materials by level (Serebii): Pokémetal at Lv.6 and Rare Pokémetal at Lv.7 in every story town (Rare Pokémetal also Bubbly Basin Lv.7); PP Up at Withered Wastelands Lv.4; Handy bag at Withered Wastelands Lv.3; Twine Rocky Ridges Lv.2; Fluff and Fresh water Rocky Ridges Lv.3; eight paints Palette Town Lv.5; Dowsing Machine recipe Palette Town Lv.2; Portal pod recipe Palette Town Lv.8 — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- [guide] Multiplayer unlocks when Withered Wastelands reaches environment level 2 (about an hour in) — [Game8 JP, マルチプレイのやり方と解放条件](https://game8.jp/pocoapokemon/767437)
- [guide] The story asks for Lv. 3 in each story town (Professor Tangrowth sends you to check it at the PC); reaching Lv. 3 starts the important request "ポケモンセンターを直そう！" (Fix the Pokémon Center) and puts the Pokémon Center kit in that town's shop. Bubbly Basin's "Build the Beautiful Building" also starts after Bubbly Basin reaches Lv. 3 — [Game8 JP story chart](https://game8.jp/pocoapokemon/767282); [Serebii Pokémon Center](https://www.serebii.net/pokemonpokopia/pokemoncenter.shtml); [Serebii Important Requests](https://www.serebii.net/pokemonpokopia/importantrequests.shtml)
- [guide] Pokémon Center rebuild materials (all need 8 Pokémon and Build, Bulldoze and Chop helpers): Withered Wastelands 10 Lumber, 20 Stone, 10 Leaves, 10 Vines; Bleak Beach 10 Twine, 30 Bricks, 10 Sea Glass, 5 Iron Ore; Rocky Ridges 25 Stone, 25 Iron Ingot, 25 Copper Ingot, 5 Crystal Fragments; Sparkling Skylands 25 Pokémetal Ingot, 25 Concrete, 25 Glass, 25 Gold; Bubbly Basin 25 Star-spotted rock, 5 Shiny pearl, 10 Seashell, 10 Sea glass fragments — [Serebii Pokémon Center](https://www.serebii.net/pokemonpokopia/pokemoncenter.shtml)
- [guide] Lv. 5 in all four story towns is needed for the ending: Team Initiation Challenge 7 needs the Washing Machine, Refrigerator and Game Boy (Lv. 5 rewards of Bleak Beach, Rocky Ridges, Sparkling Skylands) and challenge 9 needs 2 Party Poppers (Lv. 5 in Withered Wastelands) — [Serebii Team Initiation Challenge](https://www.serebii.net/pokemonpokopia/teaminitiationchallenge.shtml)
- [guide] Daily "本日限り" shop specials refresh at 5:00 every morning and their lineup grows with environment level; Shop Days sell limited items on irregular days — [Game8 JP ショップ](https://game8.jp/pocoapokemon/767357)

### Inferences

### Gaps

## Story order and area unlocks; post-game

### Takeaway
(pending)

### Cited Findings
- [guide] Story loop: arrive in a new town, clear its important request (大事なおねがいごと), Trainer Rank rises, the gate to the next town opens. Requests with a yellow speech bubble are story or feature-unlock requests — [Game8 JP トレーナーランクの上げ方](https://game8.jp/pocoapokemon/768203); [Game8 JP story chart](https://game8.jp/pocoapokemon/767282)
- [guide] Trainer Rank (トレーナーランク) steps and gates: スーパー (Super) on clearing Withered Wastelands' "あくびで雨をふらせよう！" (Yawn Up A Storm); opens the Wastelands north-west gate to Rocky Ridges and the east gate to Bleak Beach. ハイパー (Hyper) on clearing both Rocky Ridges' "パーティーを開こう！" (Time To Party) and Bleak Beach's "街を明るくしよう！" (Brighten Things Up); opens the north gates of Rocky Ridges and of Bleak Beach to Sparkling Skylands (not reachable from the Wastelands). マスター (Master) on clearing Sparkling Skylands' "巨大ビルを建築しよう！" (Rebuild the Huge Building); opens the Skylands east-island gate back to the north of the Wastelands — [Game8 JP トレーナーランク](https://game8.jp/pocoapokemon/768203)
- [guide] Rocky Ridges and Bleak Beach can be done in either order; Super comes when you meet Kyogre, so the next towns can open before the Wastelands Pokémon Center is rebuilt; there are almost no missable elements and you can return to old towns at any time — [Game8 JP 次のエリアはいつ行くべき？](https://game8.jp/pocoapokemon/767510)
- [guide] Game8 JP's chart order: 1 Withered Wastelands, 2 Rocky Ridges, 3 Bleak Beach, 4 Sparkling Skylands, then the Team Initiation Challenge (in the Withered Wastelands); clearing all nine challenges plays the ending — [Game8 JP story chart](https://game8.jp/pocoapokemon/767282)
- [guide] Withered Wastelands opening steps (condensed): Tangrowth (モジャンボはかせ) gives the Pokédex; Squirtle teaches Water Gun; watering a 2x2 patch of grass spawns Bulbasaur; watering 10 dry grass tiles for Bulbasaur teaches Leafage; 4 Leafage grass tiles become Squirtle's habitat; Leppa Berries for both, a chair, then the workbench and "simple wood recipes"; a bonfire lit by Charmander; the PC opens Challenges (3 starter challenges, then daily challenges) and the Shop; buy the Leaf hut kit (はっぱのおへやキット: 3 sticks, 3 leaves, 2 Pokémon incl. Timburr, 15 real-time minutes), place 3 furniture, plant Ditto's flag on the roof, and Tangrowth starts "ポケモンセンターを直そう"; Hitmonchan's request teaches Rock Smash and, continued, unlocks Dowsing; Diglett's request teaches Till (たがやす); Drifloon's requests unlock Dream Islands — [Game8 JP story chart](https://game8.jp/pocoapokemon/767282)
- [guide] Story requests per town (Serebii): Yawn Up A Storm (raise Withered Wastelands humidity to 100 for Slowpoke's Yawn; Kyogre then brings rain); Brighten Things Up (Bleak Beach, light the town; Peakychu's Illuminate; Raikou wakes Mosslax); Time To Party (Rocky Ridges, mood to 100 with DJ Rotom, Lost Relics, Hype Pokémon like Ludicolo, 5 Party Platters, then 15 Leppa, 15 Wheat, 15 Beans, 5 Honey and 5 Pokémon incl. Chef Dente; Volcanion appears); Rebuild the Huge Building (Sparkling Skylands; 2F 25 Concrete, 10 Glass, 5 Pokémetal, 10 Iron Ingot, 6 Pokémon incl. Tangrowth; 3F 25 Concrete, 10 Glass, 10 Glowing Stone, 15 Copper Ingot, 10 Pokémon with Chef Dente; 4F 40 Concrete, 15 Glass, 10 Paper, 10 Brick, 20 Lumber, 15 Pokémon with Peakychu; Mewtwo on the roof); Build the Beautiful Building (Bubbly Basin, after Lv. 3; Ocean Temple: 50 Star-spotted rock, 30 Stone, 25 Seashell, 10 Shiny Pearl, 10 Seashell Fencing, 2 Ocean Doors plus Corsola, Mareanie, Corphish, Totodile, Barboach, Frillish; Manaphy appears). Each completion raises Trainer Rank; each town also has a "rebuild the Pokémon Center" important request — [Serebii Important Requests](https://www.serebii.net/pokemonpokopia/importantrequests.shtml)
- [guide] Team Initiation Challenge (the strange building on the Wastelands coast; nine stages, one badge each): 1) 5 Leppa Berry; 2) 10 Beans, 10 Tomatoes, 10 Wheat; 3) 20 Lumber, 5 Fluff, 10 Paper; 4) 40 Bricks, 20 Gold Ingots, 50 Concrete; 5) 50 Electricity, 10 Crystal Fragments, 5 Tinkagears; 6) 4 Industrial Beds, 4 Resort Lights, 4 Office Desks; 7) Washing Machine, Refrigerator, Game Boy; 8) a Cherished Photo; 9) 2 Party Poppers. Finale: the building is a rocket that launches; a hideout opens beneath it — [Serebii Team Initiation Challenge](https://www.serebii.net/pokemonpokopia/teaminitiationchallenge.shtml)
- [guide] Post-game: Magnet Rise (でんじふゆう), the last transformation, from Magnemite in the big hole under the rocket site after you complete its habitat "工場の物置き"; Mew appears when the mural north of the Wastelands is completed (27 pieces, found with Dowsing etc.); collection goals: Pokédex 300, Habitat Dex 219, recipes 714, items 1195, lost relics 105, Human Records 114, Best Shots 44 (Game8 JP counts, after Expansion Pass Part 1) — [Game8 JP クリア後のやりこみ要素](https://game8.jp/pocoapokemon/767901)
- [guide] Full Pokédex (300): craft the Neo Dowsing Machine (300-registration reward), take a Search Pokémon to the north-western island of Sparkling Skylands, dig to a scanner gate; inside is the Celadon developer room with Printer, Shutter and Card reader recipes; the Printer prints a Diploma — [Serebii Pokédex Completion](https://www.serebii.net/pokemonpokopia/pokedexcompletion.shtml)
- [guide] Palette Town (まっさらな街) has no story and no unlock condition: it is reached from the start along the road across the sea west of the Withered Wastelands (bridge broken roads with blocks). It is the only map where multiplayer guests can build (other towns are visit-only "見学モード") and the only one for GameShare (おすそわけ通信). Exclusive Pokémon include Eevee and its evolutions, which come from eight Special Challenges after befriending Eevee at the Pokémon Center (12 flower kinds from seed → Vaporeon; 50 crops growing at once → Leafeon; 10 resident Pokémon → Sylveon; a Pokémon living in your house → Espeon; 15 buildings → Flareon; 300 road blocks → Umbreon; 50 machines powered → Jolteon; 10 lift platforms → Glaceon). Three special kits on its altars call Moltres (50 Copper ingot, 50 Gold ingot, 50 Magma rock, 10 Pokémetal), Articuno (50 Stone, 50 Ice, 10 Crystal fragment, 10 Pokémetal) and Zapdos (50 Copper ingot, 50 Iron ingot, 50 Sea glass fragment, 50 Brick, 10 Pokémetal); meeting all three gives the Tidal Bell (うみなりのかね) recipe for Lugia — [Game8 JP まっさらな街](https://game8.jp/pocoapokemon/767586); [Serebii Palette Town](https://www.serebii.net/pokemonpokopia/locations/palettetown.shtml)
- data.json describes Palette Town as "Post-story town"; Game8 JP says it is open from the start with no conditions — [Game8 JP まっさらな街](https://game8.jp/pocoapokemon/767586)

### Inferences

### Gaps

## Recipe and item unlock routes; completeness of the planner's "s" field

### Takeaway
(pending)

### Cited Findings
- data.json (queried 2026-11-23): 1,252 items; 273 have no "s" (94 Special, 66 Nature, 57 Terrain, 56 Kits); 298 "Daily shop special / sparkling ripples"; 95 "Shop bundle / Sparkling ripples"; 44 "Register N Pokémon" milestones (6, 20, 25 ... 100 in steps of 5, then 110 ... 300 in steps of 10); 6 "Basin Pokédex - N Registered" (5, 10, 15, 25, 35, 50); "Shop - <area> Lv. N" for levels 2-10 in Withered Wastelands, Bleak Beach, Rocky Ridges, Sparkling Skylands, Palette Town and Bubbly Basin.

### Inferences

### Gaps

## Ground restoration

### Takeaway
(pending)

### Cited Findings

### Inferences

### Gaps

## Area-specific rules; town vs area

### Takeaway
(pending)

### Cited Findings

### Inferences

### Gaps

## Town-wide score, rank or rating

### Takeaway
(pending)

### Cited Findings
- [guide] The only progression rank beyond per-town environment level is the player's Trainer Rank (トレーナーランク), raised by clearing story important requests (Super, Hyper, Master); its effect is opening area gates. Serebii: "With each completion, your Trainer Rank will increased further" — [Game8 JP トレーナーランク](https://game8.jp/pocoapokemon/768203); [Serebii Important Requests](https://www.serebii.net/pokemonpokopia/importantrequests.shtml)

### Inferences

### Gaps

# Follow-up on the open and contested Pokopia mechanics questions (checked 2026-11-23)

Scope: the 13 open questions in "Open questions that need an in-game test" (reports/Pokopia height and stacking rules.md), the 15 contested rules in "Per-area caps are firm, but fifteen rules remain contested" and the gaps named in the Conclusion (reports/Pokopia liquids sensors and crops.md), and any patch since the reports.

Evidence labels: **official** (Nintendo or in-game text, including patch notes), **datamined**, **community-tested** (someone measured it in game), **guide** (stated by a guide site without a published test), **unverified** (one post or anecdote).

How this check was done, and its main limit: I re-read the guide pages the reports cited (checking each page's last-updated date and whether its figure changed), cloned the ぽこポケ学会 (kyu49) site source to see every change since the reports, listed ccopedia's note.com articles, listed every 攻略大百科 article modified since 20 Oct 2026, and read Serebii's patch, electricity, water, vegetables, flowers and habitat pages. **x.com, Reddit, YouTube, Yahoo知恵袋, Bulbapedia, Altema, pokopiaguide.com, dittobase.com, thegameswiki.com and pocketmonsters.net could not be opened from this session** (blocked or refused), so for those sources I could see only search-result snippets. Most Japanese testers publish on X first, so "no new evidence" below means "none found on the sources reachable here", not "nobody has tested it".

## Did any patch since the reports change these rules?

### Takeaway
No. The newest version is **Ver.2.0.1 (8 Sep 2026)**, and it only fixes bugs. The reports were written in November 2026, after 2.0.0 and 2.0.1, so no patch has come out since them. However, two **official** lines in the 2.0.0 and 1.1.0 notes bear on open questions and the height report did not use them: items can now be placed on top of しかくいうえ木 (square hedges), and two-storey houses let you pick a resident's floor from inside. The next content drop, DLC wave 2 「どきどきデコレーション」, is scheduled for **9 Dec 2026** and adds furniture, so rules could change then.

| Version | Date | Relevant to the open questions? |
|---|---|---|
| 2.0.1 | 8 Sep 2026 | No (bug fixes only) |
| 2.0.0 | 5 Aug 2026 | Yes: items on square hedges; some roof items now block water; depth fine-tuning for windows and doors; generators 64 → 128 |
| 1.1.1 | 19 Jun 2026 | No (fix for areas over item limits) |
| 1.1.0 | 9/10 Jun 2026 | Yes: the laser sensor shows its detection range while being placed; choose the destination floor in two-storey houses; powered items 512 → 1,024 |

### Cited Findings
- Ver.2.0.1 went out on 8 Sep 2026 and fixes six bugs: Ho-Oh and Lugia falling and reappearing in a loop, Pokédex search failing to find a Pokémon, relocation kits that cannot be picked up, a looping sound effect, game freezes and stuck loading screens. It changes no rules (official, relayed) — [Game8 アップデート最新情報](https://game8.jp/pocoapokemon/771132); [攻略大百科 最新アプデ・過去の履歴](https://gamepedia.jp/pocoapokemon/archives/3507) (the latter states "現在の最新バージョンは 2026年9月8日 配信の「Ver2.0.1」").
- Serebii's patch page still lists 2.0.0 (5 Aug 2026) as its newest entry, so it has not added 2.0.1 (official, relayed) — [Serebii Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml).
- 2.0.0 (official): 「しかくいうえ木」の上にアイテムを配置できるようにしました (Serebii's English: "Items can now be placed on top of square plants") — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548); [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- 2.0.0 (official): 特定の屋根のアイテムが、水を通さないようにしました ("Certain roof items now block water") — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548).
- 2.0.0 (official): 窓やドアなどのアイテムを配置する時に、奥行きを微調整できる機能を追加 (fine depth adjustment when placing windows, doors and similar items) — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548).
- 2.0.0 (official): a Pokémon whose habitat is destroyed moves back in if the same habitat is rebuilt "within a certain area"; Pokémon upset by removed furniture notice its replacement sooner; Tidal Bell and Clear Bell can be triggered by laser sensors and switches; when released, stored water now matches the level of nearby water — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- 1.1.0 (official): "The laser sensor item now displays its detection range when being placed"; "When moving Pokémon into a two-storey house, players can now choose the destination floor while indoors" — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml). The liquids report already cites the sensor-range display via 攻略大百科 Ver.1.1.0.
- DLC wave 2 「どきどきデコレーション」 is due on 9 Dec 2026, with accessories, "新たな家具" (new furniture) and new Pokémon; wave 3 (a new town) is due in 2027 (official announcement, relayed) — [攻略大百科 DLC第2弾](https://gamepedia.jp/pocoapokemon/archives/7922); [Game8](https://game8.jp/pocoapokemon/771132).
- The ぽこポケ学会 (kyu49) site's source repository was last changed on 2026-07-24 (a rewrite of its circuit pages). Its house, water, harvest, tree and limits pages were last changed in May and June 2026, so the site has added nothing since the reports — [github.com/kyu49/pokopia](https://github.com/kyu49/pokopia) (commit history read on 2026-11-23).
- ccopedia's newest Pokopia article is dated 2026-10-14 (the humidity test), and the height report already cites all five of its October tests — [ccopedia on note.com](https://note.com/ccopedia/n/n48ddc4e1afbd).

### Inferences
- The 2.0.0 square-hedge change partly answers height question 5. The report said no source covered items on cube hedges, but this is an official patch line from August, before the report was written.
- Because the 9 Dec DLC adds furniture, the planner's rules for item kinds and stacking should be re-checked once it is out.

### Gaps
- I could not open Nintendo's own patch-note page (www.nintendo.co.jp was unreachable), so the patch lines come through Serebii, Game8 and 攻略大百科.
- I found no datamine of Pokopia's parameter tables. Searches in English and Japanese returned nothing, so no rule can be labelled datamined.

## The 13 height and stacking questions: is there now a test?

### Takeaway
None of the 13 has a new community test on the sources I could reach. Question 5 is now partly answered by an official patch line (items can sit on square hedges since 2.0.0). Questions 6 and 8 have official changes nearby, but those changes do not settle them.

| # | Question | Verdict | New evidence |
|---|---|---|---|
| 1 | Furniture at h = +4 counts in a block house? | No new evidence | ccopedia has posted nothing since 2026-10-14; the kyu49 house page has not changed since 2026-05-17 |
| 2 | Wall-top items count toward the 3 kinds, favourites or the trio? | No new evidence | Searches (JP and EN) found no test |
| 3 | A block at h = +1 is a roof? | No new evidence | — |
| 4 | Items on a table when it is picked up | No new evidence | — |
| 5 | Items on fences, cube hedges, counters, shelves; several per tile; item on an item | **Partly resolved (official):** items can be placed on しかくいうえ木 since 2.0.0. Fences, counters, shelves, several per tile and item-on-item: no new evidence | 2.0.0 patch notes |
| 6 | Which cell a wall mount scores in; does an outer-face mount count? | No new evidence | 2.0.0 added depth fine-tuning for windows and doors (official), which may move a wall item between cells; untested |
| 7 | Tile outside the door counts for the environment? | No new evidence | ccopedia's earlier test shows water *under* the door tile counts (already in the report); the tile in front of the door is still untested |
| 8 | Two-floor kits judged per floor? | No new evidence on scoring | 1.1.0 lets you choose a resident's floor from inside (official), which confirms floors are separate assignments |
| 9 | Height tolerance of habitat recipe parts | No new evidence | — |
| 10 | Stacked block houses sharing blocks; upper walking layer as the lower house's +4 | No new evidence | — |
| 11 | Glass, ice, fences or other see-through blocks as roofs | No new evidence | Guides still describe darkness as a full roof with no windows (guide); 2.0.0's "roof items block water" concerns water, not light |
| 12 | Taller walls or 2- and 3-high doors shift the box upward | No new evidence | — |
| 13 | A raised floor tile inside the ring stays part of the house | No new evidence | — |

### Cited Findings
- Official, 2.0.0: 「しかくいうえ木」の上にアイテムを配置できるようにしました — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548); English "Items can now be placed on top of square plants" — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- Official, 2.0.0: "Added the ability to fine-tune depth placement when placing windows, doors, and similar items" — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- Official, 1.1.0: in two-storey houses, players "can now choose the destination floor while indoors" — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- Official, 2.0.0: 「メタモンのはた」などのアイテムを家の屋根や壁にくっつけていても、「かいちく」できることを分かりやすくしました (it is now clearer that a house can be remodelled with items such as the Ditto Flag attached to its roof or walls) — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548).
- Community-tested, already in the reports: in ccopedia's humidity test, water under the door tile counts toward a block house (ドアの下はカウントされる), while water under the walls and items on top of the walls do not — [ccopedia うるおい検証, 2026-10-14](https://note.com/ccopedia/n/n48ddc4e1afbd).
- Guide: Game8 says a dark habitat is made by building a house with a full roof and no windows, at least 3 blocks high inside; it says nothing about glass — [Game8 (EN) How to Make a Habitat Darker](https://game8.co/games/Pokemon-Pokopia/archives/585570) (search snippet; page not opened).
- Guide, a conflict the report noted: some Game8 articles say a house needs walls at least 1 high and no roof, while another says a building without a roof fails a dark move-in. This is unchanged — [Game8 ぽこあポケモン](https://game8.jp/pocoapokemon/767806) (search-result summary).
- Searches for wall-top furniture counting, two-storey favourites and glass roofs (in Japanese and English) returned no test page — [Game8 search hits](https://game8.jp/pocoapokemon/775377); [gameranbu 家具](https://gameranbu.jp/pocoapokemon/b4d5600e91087e3eba87).

### Inferences
- しかくいうえ木 is very probably the item the height report calls the "cube hedge" (Serebii renders it "square plants"). If so, the planner's `acceptsOnTop` flag can be set to true for it, labelled official since 2.0.0. The match between the two names is my inference, not checked against an in-game English item list.
- Depth fine-tuning for windows and doors (2.0.0) means a door or window can sit at different depths within its wall tile. That may matter for question 6 (which cell a wall item scores in) and for question 12 (doors shifting the box), but nobody has tested either effect.
- The 1.1.0 floor picker shows that the game stores each resident's floor in two-storey houses. That makes per-floor scoring (question 8) more plausible, but it does not prove it.

### Gaps
- All 13 questions still need the in-game tests the report proposed. X posts by the testers the reports rely on (じお @echelon52a2, ばっしー @Bashii1646, ccopedia, @aminisi) could not be read from this session and may hold answers.

## The 15 contested liquid, sensor and crop rules: which reading does newer evidence support?

### Takeaway
One rule now has a clear majority: **training waterfall water is 2**, since GameWith (updated 2026-11-23) now agrees with Serebii. A second leans further toward one reading: **generator to transmitter is 10**, since Bulbapedia agrees with Rokina and only GameWith still says 7. **Smooth Rock reach gained a third reading** (Altema, 5 tiles). **Tree growth also gained a third reading** (RankedBoost, one day for large trees). Every other guide page I re-checked, many updated 18–23 Nov 2026, repeats its old figure, and I found no new test for any of the 15.

| Rule | Verdict | Readings now on record (label, date) | Suggested default |
|---|---|---|---|
| Sensor detection depth | Still contested, leaning 2 | 2 tiles straight ahead, works through an item in between: GameWith (guide, updated 2026-11-19) and 攻略大百科 (guide, 2026-03-19). 1 tile: kyu49 circuit notation page (2026-07-24). Since 1.1.0 the game draws the range while you place the sensor (official), but no source reports what it shows | 2, flagged |
| Sprinkler coverage | No new evidence | Radius 5 diamond, 11×11, 61 tiles, needs water inside the range **at the same height**: GameWith (guide, 2026-11-19). Radius 5 diamond, stops 5+ tiles from water: Game8 (guide, 2026-09-29). Up to 60 squares: Serebii (guide). Reaches 5 tiles but 41 cells, "see Smooth Rock": kyu49 (community-tested, unchanged) | radius 5 |
| Smooth Rock reach | Still contested, **3 readings** | 41 tiles, +1/−2: kyu49 (community-tested). Radius 6, ±2: GameWith (guide, 2026-11-22). **5 tiles: Altema (guide, new reading, search snippet)** | radius 4 (41 cells), flagged |
| Smooth Rock and planters | No new evidence | Unaffected: kyu49. Dried: X @aminisi. GameWith planter page (2026-11-19) says nothing | unaffected, flagged |
| Generator → transmitter | Still contested, **leaning 10** | 10, vertical ≤ 5: **Bulbapedia (guide, new, search snippet)** and Rokina. 7: GameWith (guide, 2026-11-19, unchanged) | 10 |
| Transmitter cap | No new evidence | 252: kyu49 (community-tested, revised 2026-06-10 for 1.1.0). 256: Serebii (guide, unchanged) | warn at 252 |
| Waterfall height for a habitat | Still contested | 1 level: GameWith (guide, 2026-11-23). At least 5: 攻略大百科 (guide, 2026-10-30) | warn below 5 |
| Training waterfall water | **Resolved by guide consensus: 2** | 2: Serebii and **GameWith (2026-11-23: イス×1, みず×2, たき×1)**. 1: planner data from Vandal only | 2 |
| Marsh fishing spot mud | Still contested | 1: Serebii (guide). 2: GameWith (guide, 2026-11-23: つりざお×1, イス×1, どろみず×2) | 1, flagged |
| Liquid flow priority | No new evidence | muddy > ocean > hot spring > water: kyu49 (unchanged; the editor says they are unsure). Serebii adds only that ocean water overwrites fresh water and that no liquid overwrites a source | as given, flagged |
| Water Gun on lava | No new evidence | くろいいわ / Black Rock: Serebii (guide, unchanged). マグマいわ: blog | くろいいわ |
| Tree growth | Still contested, **3 readings** | 3 days: GameWith (guide, 2026-11-18). 4 days: Serebii (guide, unchanged). **A full in-game day for large trees: RankedBoost (guide, search snippet)** | 3 |
| Bean refruit yield | No new evidence | 1–2 per stage: Game8 (guide, updated 2026-11-23). 3: gamesradar (unverified) | 1–2 |
| How long Generate lasts | No new evidence | Until 05:00 the next day: 攻略大百科 (guide, 2026-08-21). "Fades after a set time": a guide snippet whose source page I could not confirm. While the Pokémon is near: RankedBoost (unverified) | until 05:00 |
| Night start | Still contested, leaning 19:00 | Evening 17:00–18:59, night 19:00–04:59: Game8 (guide, 2026-08-06). Night 19:00–05:00: GameWith (guide, 2026-11-23). 18:00: X @shin_magokoro (unverified) | 19:00 |

### Cited Findings
- Sensor, guide: センサーには、向きが存在します。赤くなっている部分からまっすぐ2マスまで動きを感知する…センサーが反応する2マス以内であれば、アイテムを挟んでも反応してくれます; it also sends its signal to the 11 surrounding cells (周囲11マス) (updated 2026-11-19) — [GameWith センサー](https://gamewith.jp/pocoapokemon/549488).
- Sensor, guide: it detects within 2 blocks of the red part (page updated 2026-03-19) — [攻略大百科 回路向きのアイテム](https://gamepedia.jp/pocoapokemon/archives/3447).
- Sensor, kyu49: 矢印マス自身がセンサー本体です。矢印の先端方向1マスを監視します (the arrow cell is the sensor; it watches 1 cell in the arrow's direction). The page defines the arrow symbol used in the site's circuit diagrams (回路図鑑, added 2026-07-24) — [kyu49 センサー矢印の仕様](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/sensor-arrow/).
- Sensor, official: since 1.1.0 the range is drawn while the sensor is placed — [Serebii](https://www.serebii.net/pokemonpokopia/patch.shtml).
- Sprinkler, guide: 中心から上下左右に5マスずつ広がるひし形…縦11マス×横11マス…合計で61マス… 稼働させるにはこの効果範囲内に水がある必要があります… 水が効果範囲内にあっても、スプリンクラーと高さが違う場所にあると機能しません (water at a different height from the sprinkler does not work) (updated 2026-11-19) — [GameWith スプリンクラー](https://gamewith.jp/pocoapokemon/548144).
- Sprinkler, guide: 水のあるブロックから5マス以上離れると動かなくなります; 半径5マスでひし形 (updated 2026-09-29) — [Game8 スプリンクラー](https://game8.jp/pocoapokemon/769157).
- Sprinkler, guide: "a diamond which reaches out 5 squares horizontally and vertically… covering up to 60 blocks" — [Serebii vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml).
- Sprinkler, community-tested (unchanged): 上方向にも判定があるため、地下に埋めることが可能; スプリンクラーを中心に、5マス分まで水が届く; より詳しい範囲はさらさらいわの仕様を参照 — [kyu49 畑の仕様](https://kyu49.github.io/Pokopia/harvest/).
- Smooth Rock, community-tested (unchanged): 5秒に1回、41マスの中から10マスが選ばれて乾燥する; 上下+1～-2マス; プランターの場合は影響しない — [kyu49 畑の仕様](https://kyu49.github.io/Pokopia/harvest/).
- Smooth Rock, guide: 「さらさらいわ」を中心に半径6マス以内かつ上下2マスの範囲に影響 (updated 2026-11-22) — [GameWith きのみ自動化](https://gamewith.jp/pocoapokemon/549091).
- Smooth Rock, guide (new third reading): さらさらいわを置くと、置いた場所から5マスの土が徐々に乾燥します — [Altema 乾燥地帯](https://altema.jp/pocoapokemon/kansou) (search snippet; Altema refused direct fetch).
- Smooth Rock and planters: GameWith's planter page (updated 2026-11-19) covers only how to get planters and says nothing about Smooth Rock — [GameWith プランター](https://gamewith.jp/pocoapokemon/549153).
- Generator to pole, guide (unchanged): 発電マシンから電柱までは7マス、電柱から街灯などのアイテムまでは10マス、電柱から電柱までは15マス (updated 2026-11-19) — [GameWith でんちゅう](https://gamewith.jp/pocoapokemon/548211).
- Generator to pole, guide (newly found): "Utility poles must be placed within ten block units of the power source (with maximum vertical distance of five block units)"; poles connect to each other up to 15 units and power devices up to 10 — [Bulbapedia Utility pole](https://bulbapedia.bulbagarden.net/wiki/Utility_pole) (search snippet; Bulbapedia refused direct fetch).
- Electricity, guide (unchanged): distances are 3D Manhattan; power "cannot go more than 5 vertical blocks up or down"; "When you have placed over 256 transmitters in an area, any subsequently placed transmitter… will no longer work" — [Serebii electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml).
- Transmitter cap, community-tested: でんちゅう・むせんそうでんき系 合計252, page revised on 2026-06-10 for the 1.1.0 limit changes, with the limit tests credited to X testers — [kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/).
- Waterfall height, guide: 滝は、1マス以上の高低差がある場所から水を流すと作れます (updated 2026-11-23) — [GameWith 滝](https://gamewith.jp/pocoapokemon/549075).
- Waterfall height, guide: 「滝」と判定されるには最低5マス分の高さが必要です (updated 2026-10-30) — [攻略大百科 生息地づくりのコツ](https://gamepedia.jp/pocoapokemon/archives/4039).
- Waterfall, community-tested (already in the reports): in ccopedia's humidity test, a fall present at +3 that lands at +2 counts as 2 cells of 滝 and water, at 20 humidity per cell — [ccopedia うるおい検証](https://note.com/ccopedia/n/n48ddc4e1afbd).
- Training waterfall, guide: 修行の滝 = イス(なんでも)×1, みず×2, たき×1 (updated 2026-11-23) — [GameWith 滝](https://gamewith.jp/pocoapokemon/549075); Seat 1, Water 2, Waterfall 1 — [Serebii Training waterfall](https://www.serebii.net/pokemonpokopia/habitatdex/trainingwaterfall.shtml).
- Marsh fishing, guide: 沼釣り = つりざお×1, イス(なんでも)×1, どろみず×2 (updated 2026-11-23) — [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909); Fishing Rod 1, Seat 1, Muddy water 1 — [Serebii Marsh fishing spot](https://www.serebii.net/pokemonpokopia/habitatdex/marshfishingspot.shtml).
- Flow priority, kyu49 (unchanged): 編集者がよく分かってないけど、泥水 > 海水 > 温泉 > 水らしい — [kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/).
- Flow priority, guide: "if you put Ocean Water on a cliff above Fresh Water, it will overwrite some of the Fresh Water… However, you cannot directly overwrite water sources with any other water" — [Serebii water](https://www.serebii.net/pokemonpokopia/water.shtml).
- Water Gun on lava, guide (unchanged): "Use Water Gun on the Lava to turn it into Black Rock" — [Serebii water](https://www.serebii.net/pokemonpokopia/water.shtml).
- Tree growth, guide: 木は植えてから完全に成長するまで3日かかります; Grow on the planting day and the next day finishes it the next day (updated 2026-11-18) — [GameWith 木](https://gamewith.jp/pocoapokemon/548662).
- Tree growth, guide: "A tree would take 4 days as standard to grow, or shorter with a Pokémon" with Grow — [Serebii flowers](https://www.serebii.net/pokemonpokopia/flowers.shtml).
- Tree growth, guide (third reading): Large Trees take a full in-game day to reach full size — [RankedBoost How to Grow Trees](https://rankedboost.com/pokopia/guides/how-to-grow-trees/) (search snippet; not opened). Bulbapedia says a pointy-tree sapling is "a few days" from full size — [Bulbapedia Pointy tree](https://bulbapedia.bulbagarden.net/wiki/Pointy_tree) (search snippet).
- Bean yield, guide (unchanged): 「マメ」は初めて収穫してから次の成長まで1段階で実を1〜2個程度付けます (updated 2026-11-23) — [Game8 さいばい](https://game8.jp/pocoapokemon/767639).
- Generate duration, guide (unchanged): この方法で通した電気は、翌日5時を過ぎると途絶えてしまう (updated 2026-08-21) — [攻略大百科 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588).
- Night, guide: 昼 8:00～16:59, 夕 17:00～18:59, 夜 19:00〜4:59, read from the Switch clock (updated 2026-08-06) — [Game8 朝・夜は何時から](https://game8.jp/pocoapokemon/769153); 19時から5時まで夜 (updated 2026-11-23) — [GameWith 夜は何時から](https://gamewith.jp/pocoapokemon/548015).

### Inferences
- The "1 tile" sensor reading may be an artefact of notation rather than a measurement. The kyu49 page defines how an arrow cell behaves in its own top-down circuit diagrams: a → arrow watches the right and sends to left, up and down, where "up and down" are the two sides of the sensor in plan view. That is a diagram convention, while GameWith's "2マス…アイテムを挟んでも反応" describes a concrete in-game behaviour. This leans toward 2, but nobody has published what the 1.1.0 range display shows. One look at that display would settle it.
- Sprinkler: "61" and "60" are the same diamond counted with and without the sprinkler's own tile (2·5·6 + 1 = 61). The real conflict is a radius-5 diamond against kyu49's 41 cells, which is a radius-4 diamond (2·4·5 + 1 = 41) borrowed from its Smooth Rock test. GameWith's same-height rule for the water source is a detail the liquids report may not have had. It is guide-level and worth adding as a warning.
- Waterfall: ccopedia's measured 1-cell fall counting as 滝 for humidity suggests the game marks even a short fall as waterfall cells, which agrees with GameWith's "1 level". 攻略大百科's "5" may instead be a threshold for the habitat recipe's waterfall part, or a plain over-estimate. That is an inference, not a test.
- Generate: Game8 and Altema give no end time. 攻略大百科's "until 05:00 the next day" matches the 05:00 daily rollover that Game8 also gives, so it is the most coherent reading.

### Gaps
- No new in-game test was found for any of the 15. X posts (including @aminisi's planter post and @shin_magokoro's 18:00 post), Reddit threads and YouTube tests could not be opened, so I could not check whether their authors later corrected or confirmed them.
- I found no source that reports what the 1.1.0 sensor-range display actually shows.

## The named gaps: specialty ranges, ocean water, lava's flow priority, non-water falls

### Takeaway
All four gaps remain without a test. Guides still describe Burn, Grow, Water and Generate as acting on "nearby" things, with no tile count. Serebii's liquid table flags only muddy water and lava as not hydrating, which suggests (by omission) that ocean water hydrates. Nothing new places lava in the flow order or says whether lava, mud or ocean falls count as waterfalls for habitats.

| Gap | Verdict | Best available reading |
|---|---|---|
| Working range of Burn, Grow, Water, Generate | No new evidence | "Nearby" only (guide); Generate's power lasts until 05:00 the next day (guide) |
| Ocean water's humidity and whether it waters crops | No new evidence | Serebii marks muddy water and lava "Does not hydrate the area" but not ocean or hot-spring water (guide, by omission); ccopedia tested only fresh water and waterfalls |
| Lava's place in the flow priority | No new evidence | No source places it; kyu49's order omits lava |
| Lava, mud or ocean falls as waterfalls | No new evidence | kyu49 shows falls of other liquids lift items (community-tested), which says nothing about habitat recognition |

### Cited Findings
- Specialties, guide: Grow "help[s] nearby plants mature faster", Water uses "nearby water basins… to water surrounding plants", Burn ignites "nearby flammable objects", Generate powers "nearby machines". No radius is given — [Nintendo Life specialties guide](https://nintendolife.com/guides/pokemon-pokopia-all-pokemon-specialties-and-abilities); [RankedBoost specialties](https://rankedboost.com/pokopia/specialties/) (search-result summary of both).
- Generate, guide: はつでんが得意なポケモンは、近くにある機械に電気を流してくれます, and Pokémon-supplied power disappears after a set time (一定時間の経過で消えてしまいます); a temporary supply still meets a habitat's condition. These came from a search summary of [Altema はつでん](https://altema.jp/pocoapokemon/tokui/25) and [Game8](https://game8.jp/pocoapokemon/769328); I could not open either page, so which guide says which is unconfirmed.
- Generate, guide: power lasts until 05:00 the next day — [攻略大百科 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588).
- Ocean water, guide: Serebii's list of liquids gives "Ocean Water: Sparkling sea water. Ripples cannot appear here", "Muddy Water… Does not hydrate the area", "Lava… Does not hydrate the area" — [Serebii water](https://www.serebii.net/pokemonpokopia/water.shtml).
- Ocean water, community-tested: ccopedia's humidity test scores fresh water and waterfalls at 20 per cell and humidity furniture at 20 or 100; it does not test ocean water — [ccopedia うるおい検証](https://note.com/ccopedia/n/n48ddc4e1afbd).
- Lava and falls, community-tested (unchanged): lava reaches 12 tiles, and 6 at a lowered level; a liquid at a lower level flows at half strength, so the liquid in an item-lifting fall "does not have to be lava" (滝の液体はマグマでなくても良い); items rise at most 14 tiles per fall — [kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/).
- Lava, guide: lava "goes half the distance and move[s] a lot slower" and behaves differently at cliffs — [Serebii water](https://www.serebii.net/pokemonpokopia/water.shtml).

### Inferences
- Serebii flags non-hydrating liquids one by one and leaves ocean water unflagged, so the planner can default ocean water to "hydrates crops", labelled guide and untested. Its humidity value is still unknown, and 20 per cell like fresh water is only a guess.
- Lava's place in the priority remains unknown. The planner should keep it outside the ordered list and refuse to predict lava meeting other liquids.

### Gaps
- No tile range for Burn, Grow or Water was found in any source. The Generate range is also undocumented beyond "nearby".
- Whether lava, mud or ocean falls satisfy a habitat's waterfall part is untested on every source I could reach.

# How Pokopia recognises player-built houses: height, walls and items placed on or inside walls

Source access note:
- Read in full with curl through the session proxy:
  - The ぽこポケ学会 (kyu49) pages: [家と住み心地](https://kyu49.github.io/Pokopia/house/) (source: [docs/house.md](https://github.com/kyu49/pokopia/blob/main/docs/house.md)), [色々な上限](https://kyu49.github.io/Pokopia/limitation/), [その他](https://kyu49.github.io/Pokopia/others/), [天井抜けグリッチ](https://kyu49.github.io/Pokopia/warp/), [デザイン](https://kyu49.github.io/Pokopia/design/) and [Future Plan](https://kyu49.github.io/Pokopia/future_plan/).
  - Five ccopedia verification articles on note.com (September–October 2026), listed below.
- The other three pages that WebFetch could not reach (altema.jp, gameranbu.jp, game8.jp), plus X posts, gamemos, Yahoo!知恵袋 and the English guides, are cited from **search summaries only**. Those claims are marked "(search summary)".

ccopedia articles (each tested with in-game screenshots):
- [完全版「あかるい」「くらい」の仕様解説](https://note.com/ccopedia/n/ndadc82daf39f), 2026-10-09. This supersedes the 09-30 article.
- [「くらい」の判定検証](https://note.com/ccopedia/n/n4691e64139b0), 2026-09-30.
- [明かりによる「あかるい」の判定検証](https://note.com/ccopedia/n/n489ac4eb3252), 2026-10-01.
- [「あたたかい」「すずしい」の判定検証](https://note.com/ccopedia/n/n4b1e798887df), 2026-10-05.
- [「うるおっている」「乾そうしている」の判定検証](https://note.com/ccopedia/n/n48ddc4e1afbd), 2026-10-14.

Labels:
- **Confirmed**: official patch-note text, or in-game text and messages shown in testers' screenshots.
- **Community-tested**: a named tester describes a test. ぽこポケ学会 and ccopedia are the strongest.
- **Guide claim**: a strategy site states it with no test shown.
- **Unverified / Contradicted**: one weak source only, or sources disagree.

Coordinate convention used in these notes, following ccopedia:
- **Height 0** is the walkable interior space at door level. The cell the door stands in counts as "floor".
- **−1** is the layer of floor blocks.
- **+1, +2…** are the cells above the walking level.

## 1. Basic recognition rules (enclosure, door, size, furniture, residents): checking the planner's assumptions

### Takeaway
The planner's model is confirmed by community testing:
- An enclosure with at least one door, a door that is not blocked from outside, an interior of 2×2 up to 90 tiles (9×10 or 10×9), 3 different furniture kinds when a Pokémon moves in, and up to 4 residents regardless of their size.
- ぽこポケ学会 adds some surprising extras: no floor is needed, houses can be stacked, and walls can be shared but doors cannot.
- Houses built from kits that are made of ordinary blocks and a door (for example the log house kit) follow the same block-house rules.

### Cited Findings
- [Community-tested] ぽこポケ学会 lists the house conditions:
  - a space enclosed by walls containing 1 or more doors ("1つ以上の扉を含む、壁で囲まれた空間がある");
  - walls 1 high are enough ("壁は高さ1で十分");
  - 2-tile doors are OK;
  - floor area 2×2 or more (1×4 not allowed);
  - "9x10マス以上の床面積は不可";
  - "扉の真正面(外側)にブロックがあると、家と見なされない" (a block directly in front of the door, outside, means it is not a house);
  - "(引っ越し時のみ)3種類の異なる家具が存在する" (3 different furniture kinds, required only at move-in).

  — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] ccopedia says **90 tiles is the upper limit of a block house's interior**. It tested a 9×10-interior house, whose total size including walls is 11×12 = 132. So ぽこポケ学会's "9x10以上…不可" must mean *larger than* 9×10. — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] A separate test also gives a maximum of 90 tiles (9×10 or 10×9). — [ラプチュウ on X](https://x.com/abuzoad_dive/status/2035092286279942478) (search summary)
- [Community-tested] Wall-inclusive figures match this. ccopedia's 9×10 interior is **11×12 with walls**, which matches [Serebii](https://serebii.net/pokemonpokopia/building.shtml) ("larger than 11×12 is not a house", search summary) and [ねくすと on X](https://x.com/Next_gamer/status/2031298987429605435) ("12×11 enclosure", search summary). The outliers are 10×10 ([Nintendo Life](https://www.nintendolife.com/news/2026/03/video-how-to-build-a-real-house-in-pokemon-pokopia), [gameranbu](https://gameranbu.jp/pocoapokemon/eefb6571b7b8a7bdbaa2)) and 72 tiles ([lushgreengame](https://lushgreengame.com/pocopoke-kensyou-ookisa/)), all from search summaries.
- [Community-tested] ccopedia defines a block house as blocks or fences joined all the way round with a door somewhere. "ゲームの仕様上は「ぐるっと一周した高さ1のブロック+それと同じ高さに設置したドア」がこの家を家たらしめる要素" (in game terms, a full ring of height-1 blocks plus a door at the same height is what makes it a house). The minimum is 4 floor tiles. Houses built with kits made of existing blocks and furniture, such as the "ログハウスキット" (log house kit), are block houses. Only kit houses that load a separate interior map are a different type. — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Community-tested] Residents: "キットの家と異なり、ポケモンの大きさを問わず、1つの家に4匹まで住むことができます" (unlike kit houses, up to 4 Pokémon of any size can live in one house). A habitat built *inside* a house also creates a dwelling. Example: a 2×2 house containing two small habitats houses 4 + 2 Pokémon. — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Rules that are looser than you might expect, all from ぽこポケ学会:
  - No floor at all is needed. You can even break the block under the door after placing it.
  - The house can be submerged in water or magma.
  - Walls may be "きのさく" (wooden fence) or "ガラスまど" (glass window).
  - A ceiling with only 1 cell of gap above the floor is fine.
  - It can be packed so full of furniture that nobody can enter.
  - "上にもう一個家があっても、両方家判定される" (another house on top: both count).
  - Multiple doors are fine, and even all-doors with no walls counts.
  - "建物間で扉の共有はできないが、壁は共有しても良い" (doors can't be shared between buildings, walls can).

  — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] "「木のさくのトビラ」は設置時に地面が必要だが、「もんトビラ」は空中でも設置が可能" (the wooden-fence door needs ground under it when placed; the gate door can be placed in mid-air). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Diagonally placed blocks are not "connected", so diagonal corners break the enclosure. Meeting the conditions plays the same effect as completing a habitat. — [しばす on X](https://x.com/ShowBuyS/status/2030845662322131082) (search summary)
- [Confirmed, in-game text] "ちかくの生息地あきや" shows near a recognised, empty house. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181) (search summary)
- [Community-tested] Kit-house cap is 40, but a house with an internal map switch (such as 立派な家) counts as 2. Up to 14 builds can be under construction at once. — [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/)

### Inferences
- The planner's interior limits (2×2 to 9×10 or 10×9) and its 4-resident cap are both supported by testing.
- The planner should also check that the tile directly outside each door is free of blocks. It should treat diagonal-only joins as gaps.
- "3 kinds of furniture" is a move-in condition. ぽこポケ学会 marks it "(引っ越し時のみ)", which suggests removing furniture later does not un-make the house. That is not stated outright.

### Gaps
- Where the 3 move-in furniture pieces must be (strictly inside, or anywhere in the range) is not stated by any source.
- No test of non-rectangular interiors near the 90-tile limit.

## 2. Wall height, what counts as a wall, and roofs

### Takeaway
- **Walls only need to be 1 block high.** Fences, wooden fences and glass windows work, and so does "all doors". No roof is needed for recognition.
- **ccopedia's tested definition of a "roof" matches the planner's** "any block 2 or more above the floor". A block counts as a roof if it sits at height 2 or more above the floor (one empty cell between them). It has no upper height limit, even at the build-height ceiling. A block placed directly on the floor is not a roof. A solid 4-high column from the floor also counts as shaded.
- Roofs only matter for the bright/dark environment, which works on proportion, not full coverage.

### Cited Findings
- [Community-tested] "壁は高さ1で十分" (1-high walls are enough); "壁は「きのさく」や「ガラスまど」などでも問題ない"; "全て扉にして壁がない状態でも家判定される". — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] A block house is a ring of "ブロックや柵など" (blocks, fences, etc.) with a door. — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Contradicted] English guides claim "4 walls, 2 blocks high" and "single-block walls are treated as fences". The testers above refute both. — [pokopiahabitats](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide); [RankedBoost](https://rankedboost.com/pokopia/guides/how-to-build-houses/); [Antberry](https://antberry.com/do-houses-need-furniture-in-pokopia-crafting-house-guide/) (search summaries)
- [Contradicted] gemukan says houses without a ceiling may not be recognised. This is refuted. — [gemukan](https://www.gemukan.com/pokoa-building-033/) (search summary)
- [Community-tested] **Roof definition**: "生息地やブロック家の地面・床を高さ0として、高さ2マス以上の位置にブロックを置けば屋根として機能します" (with the habitat's ground or the block house's floor as height 0, a block placed at height 2 or more works as a roof).
  - "屋根の高さに恐らく上限はありません" (there is probably no upper limit on roof height). A single block at the build-height limit still worked.
  - The test that confirms it: leave the cell 1 above the floor empty and put a block 2 above it. The game showed "すみか　快適にしたよ".
  - "床に直接ブロックを置いた場合は屋根として機能しません" (a block placed directly on the floor is not a roof).

  — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Community-tested] Filled space counts as shaded: "地面や床から高さ4まで隙間なくブロックを置いた場合、そのマスには入光されません". In tests, a 4-high stack blocked light but a 3-high stack did not. Non-block items stacked 4 or more high (a barrel and a desk on top of a 2-high block) did not count as filling. — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Community-tested] In block houses, natural light reaches only the "床" cells: the interior plus the door cell. Walls never receive it.
  - Natural-light brightness = 90 × (unroofed 床 cells) / (total house area *including walls*).
  - Example: 9×10 interior, no roof: 90 × 91/132 ≈ 62. That is neither bright (≥100) nor dark (≤60); 4 roof tiles made it "dark".
  - Example: 2×3 interior (4×5 with walls), no roof: 90 × 7/20 = 31.5, so "dark" automatically.
  - A roof over the door cell counts.

  — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] Thresholds:
  - Block houses and habitats: "明るくなった" (brighter) at ≥100 points, "暗くなった" (darker) at ≤60.
  - Kit houses: ≥40 bright and "40以下" dark, as written.
  - Electric lights are about 80 points each, with lists of items at 20, 40 and 80. Beach parasol is −40.

  — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] Earlier ccopedia figure, now superseded: natural light was given as "床面積1%につき0.5" (max 50). It was replaced by the formula above. — [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0) vs [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] To darken, "家の床部分の上部に天井をつければ良い" (put a ceiling over the floor part); "どの高さまで暗さ判定に影響するかは未検証" (untested how high). ccopedia later settled the height question: no limit. — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Walls made entirely of natural stone or terrain register inconsistently. — [GameFAQs](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81119471) (search summary)
- [Community-tested] Roofs over the wider *range* outside a block house had no effect on its brightness ("上のあおいわの屋根はあっても無くても関係無かった"). — [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252)

### Inferences
- The planner's "roof = any block 2 or more above the floor" matches ccopedia, if "floor" means the walking level at height 0 and the roof block sits with at least one empty cell beneath it. A block in the cell directly above the floor is not a roof (it is an obstacle, or part of a filled column).
- Roof coverage is proportional, not all-or-nothing. Only roof over 床 cells (interior plus door cell) matters for a block house. Roof over walls or over the outer range does nothing.
- Pillars and hedges are not tested by name, but anything that is a block or fence in a connected 1-high ring should work.

### Gaps
- Hedges and pillar items are not named in any source.
- Why natural-stone walls are inconsistent is unknown.

## 3. Items placed on top of wall blocks

### Takeaway
- **Environment: tested.** Light, humidity and temperature items placed on top of (or below) wall blocks are **not counted** for a block house. The one exception is the door column, because the door's cell counts as floor.
- **Enclosure: effectively tested.** ccopedia's test houses had many items on their wall tops and stayed houses. ぽこポケ学会 also shows that blocks or houses directly on top are fine.
- **3-kind count and favourites/comfort: untested.** Whether a wall-top item counts toward the 3-kind requirement or the favourites/comfort trio is not tested.

### Cited Findings
- [Community-tested] For a block house, environment items count only in the 床 and from −1 to +3 above and below it. Definitions:
  - "床：ブロックとドアで囲まれた領域の内側の空間、およびドアが存在する空間" (floor: the space inside the blocks-and-door enclosure, plus the door's space);
  - "壁：家を構成するブロックが存在する空間" (wall: the space the house's blocks occupy);
  - "壁の上下方向の空間に、明るさポイントを持つアイテムを置いた場合もカウントされません" (light items placed in the space above or below a wall are not counted).
  - Items above or below the door *are* counted.

  — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] Light tests:
  - "家を構成する壁や壁上に光源を置くのはNG。無反応" (light sources in or on the house's walls: no effect).
  - "ドアの上だけはOK" (only above the door is OK).
  - Screenshot: Monster Ball lamps on the wall top, enough to make the house bright, gave no reaction.
  - With block-light walls, only the block above the door counted.
  - ccopedia suggests a design trick: build a decorative outer wall and put lamps on the real wall's top to look bright while staying "dark".

  — [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252)
- [Community-tested] Humidity: humidity items on the wall top and water running under the wall were "全てカウントされていない" (none counted). Water under the door did count. — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Community-tested] Temperature: hot rocks on the wall top, magma under the wall and magma-rock wall blocks are all ignored ("屋外、壁、壁の上下方向は全部無意味"). A hot rock above the door is counted. Ice under the door counted. — [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)
- [Community-tested] Summary from the dark article: "家を構成する壁、その壁の上、高さ4マスの位置に置いた光源は光源として認識されない" (light sources in the walls, on top of the walls, or at height 4 are not recognised as light sources). — [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Community-tested] On the enclosure: "天井と床の間に1マスしか隙間がなくても良い" and "上にもう一個家があっても、両方家判定される". A block or another house directly above does not break recognition. — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] On furniture: "ポケモンがアクセス不可能だと、住心地に影響を与えない" (if Pokémon can't access it, it doesn't affect comfort). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)

### Inferences
- **Enclosure stays intact.** ccopedia ran its humidity, temperature and light checks on houses with items stacked on the wall tops, and the houses kept working (residents still reacted to indoor changes). So an item on a wall block does not stop the wall counting. This is strong indirect evidence.
- **Environment.** Wall-top items should be excluded from bright, humid, warm, cool and dark calculations, except in the door's column.
- **3 kinds, favourites, comfort trio.** A wall top at about +1 is inside the house's ±4 range. Range alone would include it, but the reachability rule could exclude it. The planner should treat wall-top items as **"in range, but counts only if reachable: unverified"** for favourites and comfort, and should not count them toward the move-in 3 kinds.

### Gaps
- No direct test of wall-top items for the 3-kind move-in check, for favourites, or for the rest/toy/decoration trio.

## 4. Items on tables, shelves or counters, stacking, and how "kinds" are counted

### Takeaway
Items stacked on other items **do count for the environment** if they are within −1 to +3. A candle on top of a block light counted. Furniture and favourites use the wider house range (up to about +4), so tabletop and shelf items should count the same as floor items. That is not tested directly. "Kind" counting is murky. Same-furniture duplicates add nothing, or very little, for favourites. One single report says different beds counted as one kind.

### Cited Findings
- [Community-tested] Stacked items count: "床の上に置いたブロックライトとほそながキャンドルは明るさにカウントされている" (the block light on the floor and the thin candle on top of it both counted). — [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252); same set-up in [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Community-tested] Items can be stacked on items, for example a barrel and a desk on a block. — [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Community-tested] Favourites: "好きなものの内いくつかが認識可能範囲にある(同じ家具は加算されない or 効果が著しく薄れる？)" (some favourites in range; the same furniture doesn't add up, or its effect drops sharply?). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Furniture can be shared between houses, including furniture inside another house (two houses both recognised the same bookshelf). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Ditto's house: comfort maxes out at 13 kinds; "おもちゃ・きゅうけい・かざりつけはそれぞれ5種類までしか評価されない" (toy, rest and decoration are each counted up to only 5 kinds). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Guide claim / player report] Two different beds counted as one piece of furniture; rugs and wall mirrors seem not to count; small potted items are inconsistent. — [goccha-journal](https://goccha-journal.com/8814) (search summary)
- [Community report] A table, basket and chair turned into the "ピクニックな食卓" habitat and stopped counting as furniture. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181) (search summary)
- [Community-tested] Photos shown on tablets and similar: up to 10 kinds, and identical photos count as 1. — [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Community-tested] Rugs and posters are capped at 100 each. — [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/)

### Inferences
- The planner can treat items on tables, shelves or counters like floor items as long as their cell is within the height windows (section 6). For favourites, count each distinct item once.
- Ditto's per-category cap of 5 hints that comfort counts distinct kinds within each category (rest, toy, decoration). This is only documented for Ditto's house.

### Gaps
- No direct test of tabletop or shelf items toward the 3-kind move-in rule.
- The exact definition of a "kind" (item ID or category) is not documented.

## 5. Upper storeys, mezzanines and multi-storey built houses

### Takeaway
- **Stacked houses are separate houses.** A house built on top of another is recognised as its own house, and both count. ぽこポケ学会's "most efficient" design is stackable ("積層可能").
- **Range is limited vertically.** Within one house, only about the bottom few levels count: environment from −1 to +3, furniture and favourites up to about +4. Items on a high mezzanine or a second floor inside the same enclosure fall out of range.
- **Official support is for kit houses at least.** Ver.1.1.0 lets you pick the destination floor when moving a Pokémon into a two-storey house.

### Cited Findings
- [Community-tested] "上にもう一個家があっても、両方家判定される"; the max-capacity house is "積層可能" (stackable), needs no floor, and "地上5マス目までに扉があれば、家具が認識される" (if the door is within the 5th cell above ground, furniture is recognised). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Items at height 4 are recognised as placed furniture but not for the environment:
  - A lamp at height 4 drew "あっ、○○のランプ～！" (oh, a … lamp!) but no brightness.
  - "ここに辿り着けるように階段などを作っても無反応" (even building stairs up to it made no difference).
  - An air conditioner 4 above the floor was noticed as furniture but did not cool; lowered to +3, it worked.

  — [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)
- [Community-tested] Ceiling lamps: the "ポップなランプ" (pop lamp) hangs 2 cells below the ceiling, so its light is at +3 and counts. "ミラーボール" (mirror ball) and "けいこうとう" (fluorescent light) hang 1 below, so they sit at +4 and do not count. The house in that test had its ceiling at height 5. — [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252); [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] Kit houses (separate interior map) have no height limit for light, so hanging lamps always count. — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Confirmed, official patch note] Ver.1.1.0 (2026-06-10): "ポケモンを2階建ての家に引っ越しさせる時に、室内でも引っ越し先のフロアを選べるようになった". — [gamepedia Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597); [pocoapokemon.jp news/89](https://www.pocoapokemon.jp/ja/news/89/); [op.gg translation](https://op.gg/fi/pokemon-pokopia/news/89) (search summaries)
- [Community-tested] The registerable area may be only about 3 blocks high. — [GameFAQs](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81119471) (search summary)

### Inferences
- For a block-built two-storey design, the planner should treat each storey as **its own house**: its own ring of walls, its own door, and its own 3 kinds and 4 residents. Inside a single house, "inside" vertically means from −1 to +3 (environment) and up to about +4 (furniture and favourites), counted from the door's walking level.
- The Ver.1.1.0 floor picker most likely refers to kit houses with an interior map ("立派な家" style). The notes don't say whether it covers block-built houses.

### Gaps
- No source says whether the official floor picker applies to stacked block houses.

## 6. Vertical and horizontal limits of the active area, and how height is measured

### Takeaway
- **Horizontal: confirmed.** The range extends **4 tiles past the house on every side** (tested by ccopedia). gamemos adds that a non-rectangular room is first expanded to its bounding rectangle.
- **Lower limit: agreed.** Everyone agrees on **−4 below the door/walking level**.
- **Upper limit: sources disagree by one level.** ぽこポケ学会 says **+3** above the door. ccopedia shows Pokémon reacting to furniture at **+4** in block houses.
- **Environment uses a tighter window.** Effects (light, humidity, temperature, dark) count only from −1 to +3, and only inside or in the door column.
- The planner's "4 below to 3 above the door" is supported but may be one level short at the top for furniture and favourites.

### Cited Findings
- [Community-tested] ぽこポケ学会:
  - "地表から5マス目までに扉があれば、地表上のアイテムは認識される" (if the door is within the 5th cell above the ground surface, items on the surface are recognised).
  - "扉と同じ高さを0として、3マス上のアイテムまで認識される" (with the door's height as 0, items up to 3 above are recognised).
  - "→ 扉から-4マス～+3マスまでが認識範囲（家がひとつしかない場合、左上の住人表示がでる範囲）" (the recognition range is −4 to +3 from the door; with only one house, this is where the top-left resident display appears).

  Both rules are footnoted to KYU's X posts ([1](https://x.com/kyuphd/status/2033077025381204315), [2](https://x.com/kyuphd/status/2030243575401984440)). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] ccopedia: "生息地やブロック家の範囲から、前後左右上下それぞれ+4マス先までがすみかの範囲となる" (the range extends 4 cells beyond the habitat or block house in all six directions). For habitats it tested ±4 (items 4 above or below react, items 5 away don't). For block houses, items at height 4 are "recognised as placed furniture". — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0); [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252)
- [Community-tested] Environment window for block houses:
  - "床」とその上下-1～+3マスまでの範囲" (the floor and from −1 to +3 above and below it).
  - Digging 1 into the floor and placing items there is OK. 2 down is ignored, which prevents hiding items under the floor.
  - Habitats use the same −1 to +3 height rule for temperature and no indoor/outdoor rule. For light and humidity in habitats, the whole ±4 range counts.

  — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Community-tested] ぽこポケ学会 says environment items (光源など, light sources and similar) use a different range from normal furniture: "家の中とドアの上下のみ。床面-1～+3マス" (inside the house and above/below the door only; floor −1 to +3), with "おそらく扉の正面も認識されるはず" (probably in front of the door too; marked 検証不十分, insufficiently tested). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] gamemos (search summary only): comfort vertical Y=−3 to +4 with the floor *block* at Y=0. That equals −4 to +3 from the walking level, which matches ぽこポケ学会. Horizontal +4 from the walls, with non-rectangular rooms expanded to a bounding rectangle. — [gamemos](https://gamemos.net/2026/04/10/post-140083/)
- [Community-tested] Outdoor items have no effect on a block house's environment ("家の外をいくら明るくしたり暗くしたりしても無意味", lighting or darkening outside the house makes no difference). — [ccopedia 完全版](https://note.com/ccopedia/n/ndadc82daf39f)
- [Community-tested] Map height limits: 97 up and 30 down. — [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/)

### Inferences
- How height is measured: everything is relative to the door's walking level (height 0). The floor-block layer is −1.
- Furniture and favourites: −4 is agreed. The top is +3 according to ぽこポケ学会 and gamemos, or +4 according to ccopedia's later screenshot tests. The planner could keep +3 as "definitely counts" and flag +4 as "probably counts (ccopedia)".
- Environment: inside cells plus the door column, from −1 to +3. This is stricter than the planner's current "anywhere in the area".
- The planner's "favourites and furniture count anywhere in it, even outside the walls, if reachable" holds for furniture and favourites, and fits ぽこポケ学会's shared-furniture example. It does **not** hold for environment effects.

### Gaps
- The +3 vs +4 top-limit conflict for furniture is unresolved. It needs an in-game test with an item at exactly +4 in a block house.
- No source says whether taller walls (2 or more high) raise the house's vertical extent and so the range above it.

## 7. Does the game show the active area? In-game text

### Takeaway
Yes. Pressing the right stick near a home draws its range as a **white dotted line**. ぽこポケ学会 says this needs a resident, and the line may not draw when the surrounding ground height differs a lot from the floor. In-game feedback text includes "すみか　快適にしたよ" and the Pokémon's environment comments.

### Cited Findings
- [Community-tested] "住心地に影響する範囲は、住んでいるポケモンがいる状態でRスティックを押し込むと、白い点線で表示される。周囲の高さが家の床と著しく異なる場合は表示されないことがある。" (the comfort range shows as a white dotted line when you press the R stick with a resident living there; it may not show if the surrounding height differs a lot from the floor). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] ccopedia uses "Rスティックを押し込むと表示される白い点線の範囲" (the white dotted range shown when pressing the R stick) as the definition of すみかの範囲. — [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0)
- [Confirmed, in-game text in screenshots] Messages seen in testing:
  - "すみか　快適にしたよ" pop-up after a change;
  - "もっと暗く" / "もっと明るく" requests;
  - "暗くなった✅" / "明るくなった✅" check marks;
  - "ちょっとマブしいかも…" (a bit too bright…);
  - "あっ、○○のランプ～！" when a lamp is placed.

  — [ccopedia くらい](https://note.com/ccopedia/n/n4691e64139b0); [ccopedia 明かり](https://note.com/ccopedia/n/n489ac4eb3252)
- [Community-tested] "すみごこちどう？" (how's your home?) gives a request only once per day. Feed the Pokémon first, because hungry Pokémon ask for food. — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Confirmed, in-game text] "ちかくの生息地あきや". — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181) (search summary)

### Inferences
- The planner's dotted-line overlay mirrors the in-game display. Since ccopedia says the range is ±4 in every direction, a 3D box drawn 4 tiles past the house would match.

### Gaps
- No official help-text wording for the range was found.

## 8. The comfort trio (rest / toy / decoration) and favourites

### Takeaway
ぽこポケ学会 tested and lists the planner's comfort trio: having "きゅうけい/おもちゃ/かざりつけ" (rest/toy/decoration) **all within the recognition range** raises comfort. It ranks below avoiding disliked environments, meeting the liked environment, and not being hungry, but above favourites.

### Cited Findings
- [Community-tested] Factors for maximum comfort, roughly in order of importance (marked "未解明な部分が多い", much still unknown):
  1. no disliked environment in range (for example fire near a grass Pokémon);
  2. favourite environment satisfied;
  3. not hungry;
  4. "きゅうけい/おもちゃ/かざりつけの3つが全て認識可能範囲にある" (all three of rest/toy/decoration are within the recognition range);
  5. some favourites in range (duplicates don't add, or add little);
  6. hypothesis: kit house > house > habitat;
  7. a road connects to the Pokémon Center.

  — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Pokémon don't reflect new furniture until they notice it. If no request comes, time passing or changing area often turns comfort to "最高" (best). — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [Confirmed, official patch note] Ver.1.1.0 fixed the comfort settings for "ふろばのいす" (bath chair) and "いしのだんろ" (stone fireplace). — [gamepedia Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597) (search summary)
- [Guide claim] Relaxation items, toys and decorations raise comfort; requested items matter more. — [pokopia.center](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/); [pokopiahabitats](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide) (search summaries)

### Inferences
- The planner's comfort rule ("rest + toy + decoration nearby") is supported. "Nearby" should mean the ±4 furniture range and reachable, not the stricter environment window.

### Gaps
- Exact comfort weights are unknown; ぽこポケ学会 says many parts are unexplained.

## 9. Patches and versions

### Takeaway
No patch changes house-recognition rules. The ccopedia tests (September–October 2026) were run after Ver.2.0.0 (August 2026). So the range, roof and wall-top findings apply to the current game. ぽこポケ学会's core rules date from March 2026 and still match the later tests, except for the +3 vs +4 top limit.

### Cited Findings
- [Confirmed] Ver.1.1.0 (2026-06-10): two-storey floor choice; comfort fixes for ふろばのいす and いしのだんろ; electric item cap 512 to 1024. Ver.1.1.1 came out 2026-06-19. — [gamepedia](https://gamepedia.jp/pocoapokemon/archives/5597) (search summary); the cap change is also recorded at [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/) ("511 -> 1024 (ver. 1.1.0以降)")
- [Guide claim citing official notes] Ver.2.0.0 (August 2026): if you break a habitat and rebuild the same one within a set range, residents return. — [gamemos Ver.2.0.0](https://gamemos.net/2026/08/07/post-146324/) (search summary)
- [Community-tested] Dates of the ccopedia articles: 2026-09-30 to 2026-10-14. — [ccopedia articles](https://note.com/ccopedia/n/ndadc82daf39f)

### Inferences
- The tested rules above should hold for the current version, since nothing later than Ver.2.0.0 changing them was found.

### Gaps
- The full Ver.2.0.0 notes were not read.

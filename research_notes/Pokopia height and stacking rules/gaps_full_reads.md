# Pokopia stacking, kit interiors and habitat height: open gaps checked against full-page reads

How to read this file:
- **[Confirmed]**: in-game item text, quoted word for word by a guide page I read in full.
- **[Community-tested]**: a player test or guide statement taken from a page I read in full. Where the guide shows no test (plain editorial advice), the finding says "guide editorial".
- **[Unverified]**: an inference, a single unclear statement, or sources that disagree.

Method: every page cited here was fetched in full with `curl` and converted to text locally; none of these claims come from search snippets. What could and could not be reached:
- Read in full: kyu49.github.io/Pokopia (index, sitemap, design, limitation, others, warp, future_plan, circuit/items; the house page was left to the other researchers), game8.jp, game8.co, gamewith.jp, gamepedia.jp, note.com (two posts), altema.jp/pocoapokemon/kaguhukusei.
- Refused or blocked: **gamemos.net** (the proxy refused the connection, HTTP 403), so none of its posts, including post-140083, could be read. Also blocked: the note.com search API (403); altema.jp moyougae and iehantei (403); game-tier.com, rusted-coil.hateblo.jp, lushgreengame.com, pon-threetree.com, all0kay.com, kengomon.com, nomanoma-web.com, gemukan.com and Yahoo!知恵袋 (connections refused); thegameswiki.com (429); x.com tweet endpoints (refused); the GitHub API and web (403). raw.githubusercontent.com does work.
- Late in the session, WebSearch hit a usage limit, so two final searches (items left floating after a table is removed) did not run.

Version context: kyu49's limits page notes one Ver.1.1.0 change (the cap on lights and vending machines rose from 511 to 1024). The GameWith pages read were updated 17–20 Nov 2026, and the gamepedia pages mention DLC2 and Ver.2.0, so these pages reflect the game after Ver.2.0.0. None of them ties a placement or stacking rule to a version change.

## 1. What can sit on what: surfaces, items per tile, and removing the support

### Takeaway
Full reads support a short list of surfaces: tables and large tables (small items on top), the washing machine, big storage boxes (they stack 2+ high, and a block can go on top of one), the wireless transmitter (dolls, potted plants and flowers on top), and pillars (a utility pole raised one step on an iron pillar). Floating weed is a footing that furniture can't go on. No page I could read covers furniture on top of walls, fences or cube hedges, more than one item per tile, or what happens to items on a table when the table is picked up.

### Cited Findings
- [Community-tested, guide editorial] Tables and large tables: "You may also place other small items on top of it to display them!" — [Game8 EN: List of All Tables](https://game8.co/games/Pokemon-Pokopia/archives/586275); [Game8 EN: List of Large Tables](https://game8.co/games/Pokemon-Pokopia/archives/586293). This upgrades the snippet-based claim in placement_and_stacking.md §1.
- [Community-tested] Washing machine (せんたくき): 「上にものを乗せることができる」 ("you can put things on top"). — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/) (full read; upgrades the same claim in placement_and_stacking.md §1)
- [Community-tested] Floating weed (うきくさ) on water 2+ tiles deep stays in midair when the water is drained with ちょすい: it drops 1 tile and then stays put. It has footing, so it can be used as an aerial walkway. It behaves like 1-tile furniture whose height follows the water within its own tile, so it can't float more than 1 tile up even if the water is raised. Furniture cannot be put on it; dropped items do rest on it but can be carried off by water flow. — [ぽこポケ学会: デザイン](https://kyu49.github.io/Pokopia/design/) (full read. This kyu49 design page holds only this section plus a Smeargle-patterns and an emotes section. It has nothing else on stacking.)
- [Community-tested, guide editorial] Big storage boxes (ビッグ収納ボックス) can be stacked 2 or more high to save floor space, but GameWith doesn't recommend it because selecting the upper or lower box gets hard. Frames (がくぶち) can be stuck straight onto a big storage box's side. GameWith also describes placing a block on top of a storage box and sticking a frame to it, which looks stylish but isn't recommended because the frame captures the interaction prompt. That implies a block can be placed on top of a storage box. — [GameWith: 建築テクニックまとめ](https://gamewith.jp/pocoapokemon/548273)
- [Community-tested, guide editorial] Wireless transmitter (むせんそうでんき) as a plinth: surround it with 木のしきり・まっすぐ (straight wooden partitions) and place flowers on top, and it looks like a flowerpot. The flowers are grown ones collected with たがやす. — [GameWith: 建築テクニックまとめ](https://gamewith.jp/pocoapokemon/548273). Gamepedia adds that 木のしきり・まっすぐ fits tightly around the transmitter, and that dolls (にんぎょう), potted plants (植木) or flowers on top make a stand or flower bed. — [攻略大百科: すぐ使える建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested, guide editorial] A utility pole (電柱) can be raised one step by standing it on an iron pillar (てつのはしら), so a pillar works as a base for furniture. Items placed between two poles before the poles go up stop the wire from being strung. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested] The mirror ball (ミラーボール) can be placed with no ground beneath it, as long as there is a ceiling (「天井があれば、地面がなくても設置可能」). — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- [Confirmed, in-game text quoted by GameWith] Ceiling items: a pulley "天井につけられる滑車。飾りやヒモをぶらさげるのにピッタリ" (a pulley you fix to the ceiling, for hanging decorations or string), and a wire "天井から家具を吊り下げるのにピッタリ" (for hanging furniture from the ceiling). — [GameWith: 建物・建築キット一覧](https://gamewith.jp/pocoapokemon/545874)
- [Community-tested, guide editorial] Game8 JP says there are no restrictions on where furniture goes, in kit houses and block houses alike, as long as there is space for it (「家具を置けるスペースさえあれば家具配置に制限はない」). — [Game8 JP: 模様替えのやり方と注意点](https://game8.jp/pocoapokemon/769142)
- [Community-tested, guide editorial] Placement height: while placing, ZL + D-pad Up/Down moves the placement position vertically only, choosing from **2 below to 2 above, 5 positions in all**. The same control sets the height of a water source; ZL + D-pad Left/Right sets the water level. Mouse mode places items about 6 tiles away. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested] Frameless glass: place a glass window one tile wider than needed, then break its outer frame. — [ぽこポケ学会: その他マイナー知識](https://kyu49.github.io/Pokopia/others/)

### Inferences
- The planner can keep a per-item `acceptsOnTop` flag. Full reads support true for tables, large tables, washing machine, big storage box, wireless transmitter and pillars, and false for floating weed. Everything else stays unknown.
- The ±2 vertical placement offset means one placement can put an item at most 2 levels above or below the targeted tile. Taller stacks need support blocks or several steps.
- The mirror ball, pulley and wire show a ceiling-attach class besides floor and wall. A ceiling item needs a block above it, not below.

### Gaps
- Whether ordinary furniture or small items can sit on top of walls, fences, cube hedges, counters or shelves (as opposed to block tops). No page I could read covers it. game-tier and rusted-coil were refused, and the kyu49 design page has nothing on it.
- More than one item on a single tile, or an item on an item on a table. No source.
- What happens to items on a table or block when it is removed. The block case (they float) stays as in placement_and_stacking.md §3/§6, from snippets. The table/furniture case has no source, and the searches for it did not run because of the usage limit.

## 2. Items on walls and the house enclosure; what counts toward the 3 kinds, favourites and environment

### Takeaway
The enclosure check is about the floor: any blocks or fences enclosing a rectangle count as walls, even 1 block high, and no roof is needed. Once a room is recognised, digging out its floor does not cancel it. Game8 JP recommends 1-tile furniture or wall-hung decorations for a 2×2 house's 3 kinds, so wall hangings count toward the kinds. Furniture in a shared house counts for every habitat inside it. No page tests whether an item placed on top of a wall breaks the enclosure.

### Cited Findings
- [Community-tested, guide editorial] Walls can be blocks or fences. "The game recognizes any series of blocks or fences enclosing a rectangle, square, or rectangular-shaped area as walls, even if they're only one block high." The house then sparkles, and it sparkles again once it has 3 furniture pieces. — [Game8 EN: How to Build Houses and Structures](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Community-tested, guide editorial] Block-house conditions: floor from 2×2 to 10×9; walls at least 1 block high; roof optional; a door or gate on one side; any block type, fences included. A door missing or set at the wrong height (設置する高さがずれている) means no house. Then "完成した家の中に、種類の異なる家具やかざりつけを3つ以上設置": place 3+ *different* furniture or decoration items. For a minimum 2×2 house it recommends 1-tile furniture or wall-hung decorations (「1マスの家具や壁掛けのかざりつけを置くのがおすすめ」). — [Game8 JP: 家判定の条件とブロックの家の作り方](https://game8.jp/pocoapokemon/768198)
- [Community-tested] Once a room is recognised as a room, it stays one even if the floor is dug out afterwards (「一度部屋判定になったら、その後床をくり抜いても部屋のまま」). Gamepedia uses this to make a littering (ちらかす) Pokémon scatter items only in front of its house. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested] An automatic door (じどうドア) still counts as the house's door without power, and with no power it stays shut. — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested, guide editorial] Removing the door of a block house cancels the house judgement, and its residents must be reassigned. Put a door somewhere else first. — [GameWith: 模様替えのやり方](https://gamewith.jp/pocoapokemon/549794)
- [Community-tested, guide editorial] Within a block house, decorations and furniture count toward the comfort of all Pokémon from the different habitats sharing the space. Habitats can be built inside a block house; each holds one Pokémon and does not count against the house's 4-resident cap. Some habitats are made of furniture alone (e.g. the picnic set habitat). — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Community-tested, guide editorial] Houses can be stacked into multi-room buildings. To be able to walk inside, keep the indoor space at least 3 blocks high, with the 4th block acting as the lower room's ceiling and the upper room's floor. — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Unverified: sources disagree on the maximum] Gamepedia's own table: 2×1 no, 2×2 yes, 2×10 yes, 2×11 no, 9×10 yes, 10×10 no. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901). The same site writes "10×9マスが最大" in one guide ([攻略大百科: 建築ガイド](https://gamepedia.jp/pocoapokemon/archives/1611)) and "10×10マス以下" on its kit list ([攻略大百科: 家(建築キット)一覧](https://gamepedia.jp/pocoapokemon/archives/3442)). GameWith says the house must stay under 10×10, and 10×10 or more fails ([GameWith: 模様替え](https://gamewith.jp/pocoapokemon/549794)). Game8 JP says 10×9 ([Game8 JP](https://game8.jp/pocoapokemon/768198)). The figures agree on 9×10 (equivalently 10×9) as the largest valid floor; "10×10以下" looks like loose wording.

### Inferences
- Since the enclosure is judged on a floor ring at least 1 block high, an item resting on top of a wall probably doesn't break it, as long as the ring and the door stay. This is not tested by any source I read; the planner should not warn on it, but shouldn't promise it either.
- Wall-hung decorations should count as one of the 3 kinds in the planner (Game8 JP recommends them for exactly that purpose).

### Gaps
- Whether an item on top of a wall counts as inside the house for kinds, favourites or environment. No source.
- Whether a wall hanging counts as a favourite kind (rest, toy, decoration). Not stated anywhere I could read.

## 3. Kit interiors: half tiles, shelves, wall items, wallpaper, heights and the two floors

### Takeaway
A second full-read source confirms half-block furniture placement in fixed (interior) kits. Interior kits are separate, self-contained rooms. Wallpaper works only in kit houses that aren't block-built, and its in-game text says it is for big houses. kyu49 counts each two-floor りっぱな kit as 2 houses towards the 40-house cap, because entering the upper floor switches map. That hints the floors are separate maps but doesn't settle how comfort is judged across them. Interior heights and items on shelves inside kits remain unsourced.

### Cited Findings
- [Community-tested, guide editorial] Fixed houses "tend to be bigger inside compared to outside and furniture can be placed at half-block spaces, allowing you more precision when decorating. Fixed houses can also be easily moved or demolished." — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771). This independently supports the kyu49 house-page 0.5マス rule cited in kit_houses.md §2.
- [Community-tested, guide editorial] Inside, a house built with a room kit or building kit is "そのエリアとは別の 完全に独立した一室" (a completely independent room, separate from the area). It works as a home once at least 3 furniture are placed. — [攻略大百科: 建築ガイド](https://gamepedia.jp/pocoapokemon/archives/1611)
- [Community-tested] Kit houses are capped at 40 per area. Houses whose inside switches map, like the りっぱな (two-floor) house, count as 2. At most 14 builds can be under construction at once, windmills and the like included. — [ぽこポケ学会: 色々な上限](https://kyu49.github.io/Pokopia/limitation/) (credited there to @komomonaka and @Laioxy)
- [Community-tested] Rugs and posters are capped at 100 each, frames (がくぶち) at 256, and storage furniture at 256 in total (the list includes the wall storage box かべかけしゅうのうボックス and the shelves オフィスのたな and かくばりたな). At most 10 photo kinds can be displayed on tablets and similar. — [ぽこポケ学会: 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Confirmed, in-game text quoted by GameWith] ポップなカベ (wallpaper): "大きな家で使えるカベ紙。部屋のカベや床、天井に貼れる。" (wallpaper for big houses; applies to a room's walls, floor and ceiling). — [GameWith: ポップなカベ(壁紙)](https://gamewith.jp/pocoapokemon/571288)
- [Community-tested, guide editorial] Wallpaper items used inside a house change the patterns of the walls, floor and ceiling, but only in houses that are made with a building kit *and* are not block houses (「建築キットで作れるかつ、ブロック家でないものが対象」). — [GameWith: 模様替えのやり方](https://gamewith.jp/pocoapokemon/549794). This refines placement_and_stacking.md §4, which had "not in small houses or block houses" from a snippet.
- [Community-tested, guide editorial] Remodelling: a kit house can only be rebuilt into a *larger* kit, by placing the new kit in front of it. The furniture inside is carried over, and materials the two kits share are deducted from the cost. Residents must be taken outside first. Kit houses cannot be extended; block houses can be extended by hand. — [GameWith: 家の改築のやり方と増築方法](https://gamewith.jp/pocoapokemon/547921); [攻略大百科: 建築ガイド](https://gamepedia.jp/pocoapokemon/archives/1611)
- [Community-tested, guide editorial] The おへや series is narrow inside and holds little furniture; bigger houses hold more. If furniture drops below 3 during redecorating, the building stops counting as a house. — [Game8 JP: 模様替えのやり方と注意点](https://game8.jp/pocoapokemon/769142)
- [Community-tested, guide editorial] Small kit houses can be built inside a building you've made (「設置した建物内に小さな家を建てることもできます」), and leaf den kits can sit in a garden as small rooms. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Confirmed, in-game text quoted by GameWith] A partition: "シンプルなたてながのしきり。家の中に簡単なお部屋が作れちゃう" (a simple tall partition that makes a simple room inside a house), listed with the source 「りっぱなキット系の室内で入手」 (found inside りっぱな kits). — [GameWith: 建物・建築キット一覧](https://gamewith.jp/pocoapokemon/545874). The item name was not in the text I extracted. It is probably the "house partition (big)" that kit_houses.md lists for the City house.

### Inferences
- The 2-house count for りっぱな kits suggests each floor is its own loaded map. That fits the "2 per floor" capacity, but it does not prove comfort is judged per floor. The one Yahoo observation in kit_houses.md §4 says the floors share a judgement, so this stays open.
- In a whole-tile top-down planner, kit interiors need a half-tile grid (or a "half-tile allowed" flag) to show real density.

### Gaps
- Interior heights (ceiling) for each kit tier: no new source. The only figures are the Bulbapedia ones in kit_houses.md (City cottage 4, Poké Ball house 3), which I could not re-check (Bulbapedia 403).
- Whether small items can go on tables or shelves *inside* kit interiors, and whether those count toward the 3 kinds. No source.
- Whether wallpaper, posters, clocks or mirrors count as furniture kinds or favourites. No source. Wallpaper is applied as a room pattern, not a placed item, so it probably doesn't count, but that is unverified.

## 4. Which kits are block-built and which load an interior scene

### Takeaway
This is now well settled. Pink, Orange, Grey and Yellow huts and cottages, the Log house, the Small office (and probably the DLC Light-blue cottage) build real block houses in the world. They hold 4 Pokémon regardless of size, come fully furnished, and can be extended with blocks; you can tell them by the background shown in the kit's picture. Leaf, Sand, Stone and City dens, huts, cottages and two-floor houses, plus the Ball house and the Tent, are fixed houses with separate interiors.

### Cited Findings
- [Community-tested, guide editorial] There are two kinds of building kit. Kits whose picture shows a background (背景が写っている) produce a **block house**; kits without a background produce a non-block house. A block house from a kit can then be freely remodelled and extended with blocks. — [Game8 JP: 建築のコツと建築キャンセル](https://game8.jp/pocoapokemon/771730)
- [Community-tested, guide editorial] Capacity groups: 1 (small Pokémon only): Leaf, Sand, Stone and City den kits, Ball house, Tent. 1 (large Pokémon OK): Leaf, Sand, Stone and City hut kits. 2: Leaf, Sand, Stone and City cottage (いえ) kits. 4 (2 on each floor): Leaf, Sand, Stone and City りっぱな kits. 4: Pink hut, Pink cottage, Orange hut, Orange cottage, Grey hut, Grey cottage, Yellow hut, Yellow cottage, Log house, Small office (ちいさなオフィス). Gamepedia also says houses made of blocks, whether generated by a kit such as the Pink hut or built by hand, "どんなサイズであっても必ず4匹" (always take 4 Pokémon, whatever the size). — [攻略大百科: 家(建築キット)一覧](https://gamepedia.jp/pocoapokemon/archives/3442)
- [Community-tested, guide editorial] Game8 EN's kit-type table: Hut (Fixed) holds 1 with a 3×3 build and 6×5 interior; Hut (Blocks) holds 4, size varies, ready the next day; Cottage (Fixed) holds 2 with a 5×4 build and 10×8 interior; Cottage (Blocks) holds 4, size varies. "The huts and cottages have two different types as well—one that makes a fixed house … and one that makes a block house." Block-house sizes (marked work in progress), as construction / exterior / interior: Pink Hut 8×8 / 6×6 / 4×3; Orange Hut 8×8 / 7×6 / 4×3; Gray Hut 10×8 / 8×6 / 6×3; Yellow Hut 8×8 / 6×6 / 4×3; Pink Cottage 12×12 / 10×10 / 6×6. "Block houses can all house four Pokemon each. They come fully-furnished upon being built, and all blocks and furniture items from them can be added to your inventory." — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Community-tested, guide editorial] Game8 JP kit pages give capacity 4 for every block-type kit (Orange hut and cottage, Yellow hut and cottage, Grey hut and cottage, Pink hut and cottage, Log house, and the DLC Light-blue cottage みずいろのいえ). Each lists the furniture you get from the finished house. Log house: wooden table, wooden stool, hay bed, wooden box, mushroom lamp. Orange cottage: natural chest, resort table, resort chair, resort hammock, natural lamp. Yellow cottage: a floating-island flower, natural chest, kitchen table, bath stool, big mirror, sink, stove, toilet, wall towel (カベかけタオル), shower, bathtub, antique clock, planter, big ventilation fan, natural lamp, pop lamp, wooden ladder, wooden handrail, wooden screen. Light-blue cottage: marine sofa, chest, dresser, chair and table, a tall potted plant, shell lamp, modern door, sash window. The fixed kits checked, Leaf den and Ball house, give 1; the Leaf りっぱな gives 4. — [Game8 JP: ログハウスキット](https://game8.jp/pocoapokemon/771906); [オレンジのいえキット](https://game8.jp/pocoapokemon/771905); [オレンジのこやキット](https://game8.jp/pocoapokemon/771918); [きいろいいえキット](https://game8.jp/pocoapokemon/771922); [きいろいこやキット](https://game8.jp/pocoapokemon/771921); [グレーのいえキット](https://game8.jp/pocoapokemon/771920); [グレーのこやキット](https://game8.jp/pocoapokemon/771919); [ピンクのいえキット](https://game8.jp/pocoapokemon/771917); [ピンクのこやキット](https://game8.jp/pocoapokemon/771926); [みずいろのいえキット](https://game8.jp/pocoapokemon/805211); [はっぱのおへやキット](https://game8.jp/pocoapokemon/771931); [ボールのいえキット](https://game8.jp/pocoapokemon/771932); [はっぱのりっぱなキット](https://game8.jp/pocoapokemon/771911)
- [Community-tested, guide editorial] Kits for block houses are sold in the Pokémon Center shop. A good beginner method is to build one and then extend it with the same materials. — [GameWith: 建築テクニックまとめ](https://gamewith.jp/pocoapokemon/548273)
- [Community-tested, guide editorial] Block houses (hand-built) have no loading screen when leaving after a restart or a home fast-travel. They cannot be moved with a relocation kit or demolished with a demolition kit. — [Game8 JP: 家判定の条件とブロックの家の作り方](https://game8.jp/pocoapokemon/768198)

### Inferences
- This refines kit_houses.md §1 and §6. The Yellow cottage (きいろいいえ) is block-built: it is in the 4-Pokémon block group and comes with a ladder and handrail. The block-built list should also include the Pink, Grey and Yellow huts, the Pink and Grey cottages, the Orange cottage and the Small office. Naming: いえ = "cottage", こや = "hut", りっぱな = "house" (Game8 EN uses "Pink Cottage" for ピンクのいえ).
- The DLC Light-blue cottage is probably block-built too: it holds 4 and comes furnished, including a door and a window as furniture. No page says so outright.
- The planner should treat block-built kits as ordinary block houses: the floor-enclosure rule, the 4-resident cap, no wallpaper, and their bundled furniture placed as world items that count like any other furniture.

### Gaps
- No exterior or interior sizes found for the Orange, Grey and Yellow cottages, the Log house or the Small office. Game8 EN's table is incomplete.
- The DLC kits (Supermarket, Laboratory) and other non-house kits were not classified.

## 5. Habitats: vertical tolerance of recipe parts and the height of the dotted area

### Takeaway
No full-read source gives a vertical tolerance for habitat parts or the height of the dotted area. Full reads do settle two height thresholds the planner needs. A waterfall needs at least 5 tiles of drop (gamepedia). High ground starts at about 45 tiles above the map's unbreakable floor: 45 in Withered Wasteland, Bleak Beach and Palette Town, 47 in Rocky Ridges, and per island in Sparkling Skylands. Measured from the Pokémon Center, that is 3 to 12 tiles, and the sources differ by one tile in two towns.

### Cited Findings
- [Community-tested] High ground is judged at about 45 tiles or more above the lower limit (the blocks even powered-up Rock Smash can't break): 45 for パサパサこうや, ドンヨリうみべ and まっさら, 47 for ゴツゴツやま, varying by island in キラキラうきしま. Game8 shows screenshots at 44 and 45. In caves the wind effect doesn't appear, but the spot still counts as high ground if it is high enough. — [Game8 JP: 高台の作り方と条件](https://game8.jp/pocoapokemon/769075). This upgrades the "about 45+" figure that habitats_and_ranges.md had marked Unverified.
- [Community-tested; sources differ] Height above the Pokémon Center needed for high ground: Game8 JP gives パサパサ 5, ゴツゴツ 10, ドンヨリ 11, キラキラ 3 (varies by island), まっさら 11 ([Game8 JP](https://game8.jp/pocoapokemon/769075)). 攻略大百科's own test gives パサパサ 5, ドンヨリ 11, ゴツゴツ 9, キラキラ 3, まっさら 12 ([攻略大百科: 生息地づくりのコツ](https://gamepedia.jp/pocoapokemon/archives/4039)).
- [Community-tested, guide editorial] A waterfall needs at least 5 tiles of height (「最低5マス分の高さが必要」), so place the water source 5 or more tiles above the spot. — [攻略大百科: 生息地づくりのコツ](https://gamepedia.jp/pocoapokemon/archives/4039). This upgrades the snippet-based 5-tile figure in habitats_and_ranges.md; pokopia.center's 4 remains the outlier.
- [Community-tested, guide editorial] Habitats can be built inside a block house, and furniture-only habitats exist (e.g. the picnic set). — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Community-tested] For comparison, other range checks are documented as 3D cubes. A floor switch (ゆかつきスイッチ) affects everything in a 5×5×5 cube centred on its tile; a wall switch or card reader affects a 7×7×7 cube. A sensor reacts to things beside and behind it, on its own tile, and above and below those. — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)

### Inferences
- High ground is a fixed world height (about 45 above the map floor), not a height relative to nearby ground. The planner should treat it as a per-town absolute Z threshold, with the offsets above for players who measure from the Pokémon Center.
- With no tolerance documented, the strict model in habitats_and_ranges.md still stands: put recipe parts on the same surface level.

### Gaps
- Whether recipe parts on blocks, or on different levels, still combine. No full-read source; all0kay and kengomon, which held the "same plane" advice, were refused.
- How tall the habitat's white dotted area is, and what it is measured from. No source.

## 6. Heights in blocks for doors, poles, rooms and the build ceiling

### Takeaway
Exact heights found: iron door 3 high × 2 wide; utility-pole wire at height 3, the same as the iron door; big wooden door 2×2; wooden-fence gate 2 tiles; shutter 3×3; lift station 5×4×5. A room you can walk into needs 3 blocks of headroom. The build ceiling is about 97 blocks above the water surface (kyu49: 97 up, 30 down; GameWith: 100 from the sea floor). Placement can be offset ±2 levels. Heights for tables, walls, fences and counters remain unsourced.

### Cited Findings
- [Community-tested] Door sizes, from how many tiles each moves together: wooden-fence gate (木のさくのトビラ) 2 tiles; big wooden door (おおきな木のドア) 2×2; iron door (てつのドア) 3 high × 2 wide; shutter 3×3. The ground-set lidded window (フタつきまど・じめん) is treated as occupying the tile above it, whatever it looks like. The sash window (あげさげまど) when open has collision in the tile above. — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested, guide editorial] The utility pole's wire comes out 3 tiles above where the pole stands, the same height as the iron door. — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested] Lift: span 13 to 65 tiles, wire slope up to 50%; each station occupies 5×4×5; the car's swept cross-section is 3×5 when level and 3×6 on a slope. An obstacle in the path breaks the lift, but curtains don't, and running under water is fine. — [ぽこポケ学会: その他マイナー知識](https://kyu49.github.io/Pokopia/others/)
- [Community-tested] The ceiling fan's sensor area is 2×2×1. — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested, guide editorial] To walk inside a stacked house, give it at least 3 blocks of indoor height plus a 4th block as ceiling and next floor. — [Game8 EN: How to Build Houses](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Community-tested] The map height limit is 97 tiles up and 30 down; width and no-go areas differ by map. — [ぽこポケ学会: 色々な上限](https://kyu49.github.io/Pokopia/limitation/). Gamepedia measured that you can build up to 97 blocks above the water surface, and holes can go below it, so builds of over 100 blocks are possible ([攻略大百科: 建築ガイド](https://gamepedia.jp/pocoapokemon/archives/1611)). GameWith puts the cap at 100 blocks counted from the sea floor, and says falling from that height does no damage ([GameWith: 高さ制限はある？](https://gamewith.jp/pocoapokemon/545342)).
- [Community-tested, guide editorial] Placement height offset during placement is ±2 levels (5 positions). — [攻略大百科: 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)
- [Community-tested, guide editorial] The mini generator takes a 1×1 space. Burying it, and a wireless transmitter, 2 tiles below ground hides them completely. A wireless transmitter reaches items within 10 tiles horizontally and other transmitters within 15. — [GameWith: 建築テクニックまとめ](https://gamewith.jp/pocoapokemon/548273)

### Inferences
- The three build-ceiling figures fit together if the water surface sits about 3 blocks above the sea floor: 97 above water ≈ 100 from the sea floor. kyu49's "97 up / 30 down" most likely uses the water surface as zero too. The planner can cap Z at +97 over the water level, though not confirmed.
- A full-height door slot in a planner should reserve 3 levels for an iron door and 2 for a big wooden door.

### Gaps
- Heights in blocks of tables, counters, desks, shelves, walls (wall pieces), fences and cube hedges. No page I could read states them.
- Whether the "tallest placement" differs for furniture and blocks. Only the overall build ceiling was found.

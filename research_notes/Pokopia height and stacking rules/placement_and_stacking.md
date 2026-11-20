# Pokopia item placement and stacking (what goes on top of what, and how vertical placement works)

How to read this file:
- **[Confirmed]**: in-game item text or an official description, quoted on Serebii, Bulbapedia or Game8. I found no Nintendo/Pokémon official-site page that covers these placement rules.
- **[Community-tested]**: player tests on wikis, guide sites, X posts or Q&A threads.
- **[Unverified]**: a single low-quality or SEO-style guide with no visible testing, or a claim I could not check.

Method caveat: page fetching was blocked in this session. kyu49.github.io (ぽこポケ学会) and pokopiaguide.com failed DNS resolution because they are outside the session's allowed network domains, so I stopped fetching after that. Every finding below therefore comes from search-engine result text (titles, snippets and summaries of the cited pages). I did not open the full pages. Before the planner treats any of these as a hard rule, the full pages should be re-checked, kyu49.github.io/Pokopia/design/ and /house/ first. The Japanese title is ぽこ あ ポケモン (ぽこポケ). "Pokopia" is the English title.

## 1. Which items act as surfaces, and which small items can sit on them?

### Takeaway
Tables, stands, shelves and some appliances accept small items on top, confirmed by in-game text for some stands and by guide sites for tables in general. Sources do not settle whether ordinary furniture can sit directly on any building block top. In practice players build on block tops all the time, for example a rug on a pillar to make a table, or furniture standing on a support block. No complete list of "surface" items exists.

### Cited Findings
- [Confirmed, in-game description] Exhibition stand: the game suggests it "for displaying lots of different things on top". Plain stand: "a low table with a simple design, perfect for displaying items." The push cart is listed as a table-height surface for setting items on. — [Bulbapedia: items by category](https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_category_in_Pok%C3%A9mon_Pokopia); [Pokodex furniture](https://www.pokodexapp.com/items/categories/furniture)
- [Community-tested / editorial] Game8's table lists say you can also place other small items on top of tables to display them. The same note appears on the large-tables list. — [Game8: List of All Tables](https://game8.co/games/Pokemon-Pokopia/archives/586275); [Game8: List of Large Tables](https://game8.co/games/Pokemon-Pokopia/archives/586293)
- [Conflict] Fextralife describes the plain stand as a place to put food, while Bulbapedia and Pokodex describe it as a general display surface. — [Fextralife: All Items](https://pokopia.wiki.fextralife.com/All_Items_in_Pokemon_Pokopia) vs [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_category_in_Pok%C3%A9mon_Pokopia)
- [Community-tested] The washing machine (洗濯機) accepts items on top: 「上にものを乗せることができる」 ("you can put things on top"). — [ぽこポケ学会: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Floating weed (うきくさ) behaves like a one-tile piece of furniture. Its height follows the water in its tile, and furniture cannot be put on it (「家具などを乗せることはできない」), but dropped items do rest on it (「ドロップ状態のアイテムは乗る」). — [ぽこポケ学会: デザイン](https://kyu49.github.io/Pokopia/design/)
- [Community-tested] A small rug placed on top of a square pillar (角柱) makes a patterned "original table" (「角柱の上に小さなラグを乗せることで、柄付きのオリジナルテーブルを作れます」). Rugs can therefore sit on a block or pillar top. — [game-tier: 建築テクニック特集（アプデ後対応）](https://game-tier.com/pokopoke/pocoa-architecture/)
- [Community-tested] A player put a lamp on top of a low chest (背の低いチェストの上にランプ). Chests and cabinets can therefore act as surfaces for lamps. — [鈍無限の試行錯誤ログ (blog)](https://mugen-namakura.hatenablog.com/entry/2026/04/02/004745)
- [Community-tested] Players make sofas and chairs by combining partitions with tables and desks, for example 木のしきり x インダストリアルなデスク, 木のしきり x てつのテーブル, てつのハシゴ x インダストリアルなテーブル, and 木のしきり x 木のテーブル. A partition or ladder and a table can share space. — [ナナセ on X](https://x.com/nanase__game/status/2032420006810775648)
- [Unverified, SEO guide] "Furniture snaps to the floor grid by default but many items can be placed on tables, shelves, and walls by aiming at those surfaces." The same page says "Furniture cannot overlap other furniture or blocks." — [pokopia.center building guide](https://pokopia.center/posts/pokopia-building-guide-tips-2026/)
- [Community-tested] Some furniture cannot be stacked directly (「重ねられない家具」). Players stack it with a temporary support block instead: place a block, put the furniture on it, break the block, then place more furniture in the freed space, and repeat. Easy-to-break blocks such as sand are recommended. — [game-tier: 設置上限付き家具の調べ方](https://game-tier.com/pokopoke/pocoa-fur/)

### Inferences
- The game seems to have at least two classes of furniture: "surface" furniture whose top accepts items (tables, stands, push cart, washing machine, chests, shelves) and furniture whose top does not (うきくさ, and the 「重ねられない家具」 that need the support-block trick). The planner needs a per-item `acceptsOnTop` flag, defaulting to unknown.
- Furniture standing on a block top appears to work, since the support-block trick places furniture on a block. A block top can be treated as a valid floor for furniture.
- Small decorative items (lamps, potted plants, dolls, candles) are the usual things put on surfaces, but no source lists exactly which items count as "small" or placeable on a surface.

### Gaps
- No authoritative list of which furniture accepts items on top or which items can be placed on a surface. Bulbapedia, Serebii and Game8 category pages may hold the in-game text per item, but they could not be fetched.
- Whether ordinary furniture (not rugs) can be placed on top of walls, fences or cube hedges, and whether the result looks flush. No source found.
- Whether a surface item can hold more than one small item, or a second level (an item on an item on a table). No source found.
- Whether the game gives a visible "can't place" message for non-surface tops. Unknown.

## 2. Grid and snap system, whole versus half heights, and item heights in block units

### Takeaway
Placement is grid-based in whole "マス" (tiles or blocks). The D-pad raises and lowers height and rotates items. Community tests describe furniture heights and ranges in whole blocks ("height-1 furniture", door-relative ranges of -4 to +3). I found no source for half-block heights or exact heights of tables, walls or fences.

### Cited Findings
- [Community-tested] Controls during furniture placement: D-pad Up/Down adjusts height, D-pad Left/Right rotates, and A confirms. — [thegameswiki: Decorating](https://thegameswiki.com/pokopia/wiki/decorating); [Game8: Controller and Mouse Mode Controls](https://game8.co/games/Pokemon-Pokopia/archives/582981) (Game8 labels the Switch 2 binding "Spit Out: Adjust Height Up/Down")
- [Unverified] In Mouse Mode you can place and remove furniture at a distance by pointing at it, and change its orientation and height while moving it. The search summary credited this to a "game guide" without naming it. The likely source is [game-shinden furniture guide](https://game-shinden.com/pokemon-pokopia-furniture-guide-habitat-tips/). Mouse Mode controls are listed at [Game8 controls](https://game8.co/games/Pokemon-Pokopia/archives/582981).
- [Community-tested] Builders talk about furniture by its block height, for example 「高さ1の家具」 ("height-1 furniture"). One house trick digs a pit 2 deep, places a door and height-1 furniture, lays height-1 furniture across the floor so Pokémon don't sink, then fills the pit in. — [エアルの中の人 on X](https://x.com/heal08426/status/2031607195864080596)
- [Community-tested] The range in which furniture counts toward a house runs from -4 to +3 blocks vertically, measured from the door position (「扉の位置を基準にして-４～+３」). — [あめしこうR2 on X](https://x.com/Ameshikou_R2/status/2040302712747950405)
- [Community-tested, partly conflicting] ぽこポケ学会 says items are recognised up to 3 blocks above the door height (door height = 0). Another tester says request furniture (おねがいごと家具) counts up to the 4th block above or below. — [ぽこポケ学会: 家と住み心地](https://kyu49.github.io/Pokopia/house/); [リリィ on X](https://x.com/__ririmero/status/2029761931813474412)
- [Community-tested] Furniture placed lower than the door was not counted. Raising the floor to the door's height fixed it. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326875771) (as summarised in search results)
- [Unverified] "Furniture snaps to the floor grid by default." — [pokopia.center](https://pokopia.center/posts/pokopia-building-guide-tips-2026/)
- [Unverified] Rotating pieces slightly can avoid grid-overlap warnings on slopes. — [pokopia.center](https://pokopia.center/posts/pokopia-building-guide-tips-2026/). This is doubtful: the D-pad rotation described elsewhere is stepwise, and "slightly" is not explained.

### Inferences
- The vertical axis is in whole blocks (マス), and furniture has an integer height. A Z value in integer block levels fits what players describe.
- The D-pad height adjustment probably moves an item up or down one block per press, which is what makes "floating" placement possible (see section 3). This is not explicitly confirmed.
- An item placed on a table top probably sits on the table's visual surface, not at a full block above it, but no source confirms this. The planner may need to show "on top of X" as a relation rather than a numeric Z.

### Gaps
- Exact heights in blocks of walls, fences, tables, counters, desks, shelves and cube hedges. Not found.
- Whether half-height placement exists, for example slabs or items resting at a table's surface height. Not found.
- Rotation granularity (4 directions or 8). Not stated in the sources found.

## 3. Stacking blocks, and floating or multi-level item placement

### Takeaway
Blocks can be stacked and do not need support beneath them [Community-tested]. Furniture can be left floating by placing it on a temporary block and then breaking the block. Normally grass, flowers, shrubs and rugs cannot be placed in midair, but players have found a workaround. Wall blocks with lower, middle and upper sections are designed to be stacked [Confirmed].

### Cited Findings
- [Confirmed, in-game description] Some wall blocks come in matching lower, middle and upper sections meant to be stacked into one wall: Pop art wall, and Pokémon Center wall, which also has a trim section. The Stone-accent wall is described as being placed side by side to extend its pattern. — [Serebii: Items](https://www.serebii.net/pokemonpokopia/items.shtml); [Serebii: Pokémon Center wall (upper)](https://www.serebii.net/pokemonpokopia/items/pokemoncenterwall(upper).shtml)
- [Confirmed / editorial] Several walls are described as "perfect for stacking as well as making walls". — [Fextralife: Blocks](https://pokopia.wiki.fextralife.com/Blocks); [Game8: List of All Blocks](https://game8.co/games/Pokemon-Pokopia/archives/586478)
- [Community-tested] Blocks don't always need support: you can place blocks, build on top of them, and then remove the lower block to create floating structures. — [Pokémon GO Hub: Pokopia beginner tips](https://pokemongohub.net/post/guide/pokopia-beginner-tips/)
- [Community-tested] To place a block directly below your character (for stacking upward or escaping holes), look straight down and press A. — [thegameswiki: Advanced Building Techniques](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)
- [Community-tested] Temporary pillar method: build a short support column, put the furniture on top, then break the column's blocks, and the item remains floating in midair. The wiki says this works for security cameras, lights, signs and most furniture. — [thegameswiki: Advanced Building Techniques](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)
- [Community-tested] Floating security cameras: build blocks under yourself to the height you want, set the camera on a block, then destroy the block under the camera. — [TheGamer: tips for advanced players](https://www.thegamer.com/pokemon-pokopia-pro-tips-tricks/)
- [Community-tested] Furniture that can't be stacked can still be "floated and stacked" with sand as a support block: place, set the furniture, break, then place the next item. — [game-tier](https://game-tier.com/pokopoke/pocoa-fur/)
- [Community-tested] Flowers, shrubs and rugs normally cannot be placed in midair. A newer technique floats them anyway; it was credited to a player named おかゆ, and the video shows 8 build ideas. — [YouTube: 草花やラグを空中に浮かせる新技](https://www.youtube.com/watch?v=fP4MAnNBkVs)
- [Community-tested] A block placed directly above habitat grass still counted as a habitat. — [リリィ on X](https://x.com/__ririmero/status/2029761931813474412)
- [Unverified, postgame] Transforming into Magnemite (Magnet Rise) lets you float while building: R/B float up, L down. While floating, D-pad Up cycles terrain placement between 1, 4 and 9 blocks. Furniture is still placed one at a time. — [pokopia.center: Magnet Rise guide](https://pokopia.center/posts/pokopia-magnet-rise-postgame-guide-2026/)

### Inferences
- In practice there is no "must rest on something" rule for furniture once it is placed. Items keep their Z when the support is removed. The planner should allow any integer Z for blocks and furniture, perhaps with a "floating" warning, rather than enforcing support.
- Rugs, grass and flowers are the exception: they normally need a surface below them at placement time.
- No source gives a maximum build height.

### Gaps
- Maximum stack or build height (world ceiling). Not found.
- Whether any furniture refuses to float. The wiki only says "most furniture".
- Whether game-tier's 「アプデ後対応」 (updated after a patch) means a patch changed stacking behaviour. The version and changes are unknown.

## 4. Wall-mounted items (wall lights, frames, corkboards, mirrors, clocks, wallpaper)

### Takeaway
Wall-mounted items attach to the side face of a block or wall [Confirmed by item text such as "can be fixed to a wall"]. Thin partitions (しきり) attach only to block side faces, and wall items stick only to a partition's back face. Players use temporary blocks to mount items on partitions and to leave frames "floating in midair". Wallpaper can be applied to walls, floors and ceilings, but not in small houses or block houses.

### Cited Findings
- [Confirmed, in-game description] Wall light: an item that "can be fixed to a wall". It is crafted from 1 Pokémetal. — [Serebii: Wall light](https://www.serebii.net/pokemonpokopia/items/walllight.shtml); [Game8: How to Get Wall Lights](https://game8.co/games/Pokemon-Pokopia/archives/589219)
- [Confirmed, in-game description] Surface light: "embeddable in ceilings and walls". It is crafted from 1 Glass. — [Game8: How to Get Surface Lights](https://game8.co/games/Pokemon-Pokopia/archives/590124)
- [Confirmed, in-game description] Decoration items include a wall photo frame, corkboard, wall-mounted flowers, a frame "for hanging items on a wall", and a card reader "mounted to a wall". — [Serebii: Decoration Items](https://www.serebii.net/pokemonpokopia/items/decoration.shtml)
- [Confirmed / editorial] Game8 describes the Miscellaneous category as mostly decorative items that go on a wall, ceiling or floor and mostly can't be interacted with. — [Game8: List of All Items](https://game8.co/games/Pokemon-Pokopia/archives/584741)
- [Confirmed, in-game description] Wallpapers (Plaster, Stately, Ornate, Painted wall) can be applied to walls, floors and even ceilings. — [Serebii: Plaster wall (wallpaper)](https://www.serebii.net/pokemonpokopia/items/plasterwall(wallpaper).shtml); [Serebii: Stately wall](https://www.serebii.net/pokemonpokopia/items/statelywall(wallpaper).shtml); [Serebii: Ornate wall](https://www.serebii.net/pokemonpokopia/items/ornatewall(wallpaper).shtml); [Serebii: Painted wall](https://www.serebii.net/pokemonpokopia/items/paintedwall(wallpaper).shtml)
- [Community-tested] Wallpaper items change the pattern of a building's walls, floor and ceiling, but cannot be applied in small houses or block-built houses. — [GameWith: 模様替えのやり方](https://gamewith.jp/pocoapokemon/549794)
- [Community-tested] Wallpaper can only be changed all at once (no per-wall choice). One interior guide therefore keeps the walls and ceiling default white and changes only the floor. — [東方錆恋録: 建物内装テンプレート考察](https://rusted-coil.hateblo.jp/entry/2026/04/04/151815)
- [Community-tested] Partitions (木のしきり) can only be placed on the side face of a block, and items can only be stuck to a partition's back face. Method: place a temporary block where you want the item, put the partition on that block's far side, break the block, then place the corkboard in the gap. Another answer in the same thread says items attach to 木のしきり・まっすぐ normally without any trick. — [Yahoo!知恵袋: 木のしきりに壁付けアイテム](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13328796263)
- [Community-tested] Partitions cannot be stuck directly onto items. Stick the partition to a sand block first, break only the block, then put the desk or table in its place. — [ナナセ on X](https://x.com/nanase__game/status/2032420006810775648)
- [Community-tested] 木のしきり and さんばしのいた count as walls. A hidden room you walk through via a wall hanging was built with them, and frames (がくぶち) can be hung in midair with no collision. — [真冬 on X](https://x.com/winter8636/status/2038923276848918822)
- [Community-tested] Wall-hung furniture on the back wall raises room density without blocking the view. — [東方錆恋録](https://rusted-coil.hateblo.jp/entry/2026/04/04/151815)
- [Unverified] "Wall-mounted items (lamps, shelves, clocks) need a wall surface behind them", and wall items do not take floor space. — [pokopia.center building guide](https://pokopia.center/posts/pokopia-building-guide-tips-2026/); [pokopia.center furniture catalog](https://pokopia.center/posts/pokopia-furniture-catalog-complete-2026/)
- [Community-tested] One wall item, the Wall Storage Box, is catalogued separately. — [pokopia.town: Wall Storage Box](https://pokopia.town/items/furniture/wall-storage-box)

### Inferences
- Wall items are anchored to a block face, meaning a block cell plus a side (N/E/S/W), at the height of that block. The planner can model them as a face attachment on a specific (x, y, z, side) and not as a floor footprint.
- Since wall items attach to block faces generally, they likely attach to any solid building block, not only "wall" blocks. This is not explicitly confirmed. For fences and cube hedges, no source was found.
- Wall items appear to keep their position after the block behind them is removed (the temp-block and midair-frame tricks), the same as floor furniture.

### Gaps
- Whether wall items attach to fences, cube hedges, pillars or furniture sides. Not found.
- The vertical height at which a wall item hangs within its block face, and whether D-pad height steps apply. Not found.
- Mirrors, wall clocks, wall shelves, windows and posters: no item-specific placement text found.

## 5. Rugs and floor items under furniture, and ceiling items

### Takeaway
Rugs are floor-layer items: furniture stands on them, and rugs can also go on pillar tops [Community-tested]. Ceiling items exist (ceiling fan, hanging lamps, chandelier, party ball, surface light) with in-game text saying they hang from or embed in the ceiling. I found no description of how ceiling placement works.

### Cited Findings
- [Community-tested] Common layouts put a large rug in the centre of the living room with a table and chairs on it, or a small rug with a one-person table. — [東方錆恋録](https://rusted-coil.hateblo.jp/entry/2026/04/04/151815)
- [Unverified] "Rugs and floor decorations go on the floor layer beneath other furniture." — [pokopia.center](https://pokopia.center/posts/pokopia-building-guide-tips-2026/)
- [Community-tested] A small rug on a square pillar top works as a tabletop. — [game-tier](https://game-tier.com/pokopoke/pocoa-architecture/)
- [Community-tested] Rugs, like flowers and shrubs, normally cannot be placed in midair, but a workaround exists. — [YouTube fP4MAnNBkVs](https://www.youtube.com/watch?v=fP4MAnNBkVs)
- [Confirmed, in-game description] Ceiling decorations include a ceiling fan, a berry hanging lamp, an antique chandelier ("hanging from the ceiling") and a party ball ("suspended from" the ceiling). — [Serebii: Decoration Items](https://www.serebii.net/pokemonpokopia/items/decoration.shtml)
- [Confirmed, in-game description] Surface light is "embeddable in ceilings and walls". — [Game8: Surface Lights](https://game8.co/games/Pokemon-Pokopia/archives/590124)
- [Community-tested] A house does not need a ceiling. One test found: floor at least 4 tiles, no ceiling OK, door required, walls only need to be 1 block high if they enclose the space. — [リリィ on X](https://x.com/__ririmero/status/2029761931813474412)

### Inferences
- A rug and a piece of furniture can share the same (x, y) tile, so the planner needs a separate "floor covering" layer under furniture.
- Ceiling items most likely attach to the underside of a block, the mirror case of a wall item attaching to a side face. This is not confirmed.

### Gaps
- How ceiling items are placed (aim at a block's underside or at a ceiling height), and whether they need a block above. Not found.
- Whether a rug can go under every furniture type, and whether rugs can overlap each other. Not found.

## 6. What happens to items on top when the supporting block or table is removed or moved?

### Takeaway
For blocks, the item stays where it was and floats [Community-tested by several sources; this is the basis of the floating trick]. For an item sitting on a table or other furniture when that furniture is picked up, I found no source.

### Cited Findings
- [Community-tested] Breaking the support column under furniture leaves the item floating in midair. — [thegameswiki: Advanced Building Techniques](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)
- [Community-tested] Removing the lower block under built blocks leaves floating structures, since blocks don't always need support. — [Pokémon GO Hub](https://pokemongohub.net/post/guide/pokopia-beginner-tips/)
- [Community-tested] The support-block-then-break method relies on the furniture staying put after its block is gone. — [game-tier](https://game-tier.com/pokopoke/pocoa-fur/); [TheGamer](https://www.thegamer.com/pokemon-pokopia-pro-tips-tricks/)
- [Community-tested] Partitions and wall items stay in place after the temporary block they were attached to is broken. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13328796263); [ナナセ on X](https://x.com/nanase__game/status/2032420006810775648)
- [Community-tested] Redecorating works by picking furniture up and placing it again. In block houses, take care not to remove the door, because the building stops counting as a house. — [GameWith: 模様替えのやり方](https://gamewith.jp/pocoapokemon/549794)

### Inferences
- The planner should not cascade-delete or drop items when a block below is removed. Keep their Z and optionally flag them as "floating".

### Gaps
- What happens to small items on a table or shelf when that furniture is picked up: do they drop, get picked up too, float, or is pickup blocked? No source found.

## 7. Limits: items per tile, footprint, rotation, and "can't place here" rules near doors

### Takeaway
Confirmed limits are few. Community tests show: no blocks or items on the tile directly in front of a kit house entrance or on the tile one block above it; house interiors must be 2x2 to 10x9 tiles; furniture must be at door height or within a door-relative vertical range to count; and furniture groups have placement caps, past which extra functional pieces stop working.

### Cited Findings
- [Community-tested] For kit houses, no blocks or items can be placed on the tile directly in front of the entrance or on the tile one block above it. — [ぽこポケ学会: 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- [Community-tested] Before a kit house is finished, something can be placed 1 block above, but once the build is complete and that object is broken, it cannot be placed again. — [GameWith: ブロックの家が家判定になる条件](https://gamewith.jp/pocoapokemon/547952) (as summarised in search results; the context is ambiguous)
- [Community-tested] Block-house conditions: an area from 2x2 up to 10x9 tiles enclosed by blocks, with a door. The 2x2 minimum is the inside, not counting the door. Making it a Pokémon home also needs 3 types of furniture. — [GameWith: ブロックの家が家判定になる条件](https://gamewith.jp/pocoapokemon/547952)
- [Community-tested] A step or height change inside the door can stop that part from counting as the house. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326875771)
- [Community-tested] Furniture groups have placement caps. Past the cap, the game says 「これ以上置いても意味がなさそうだ」 ("there seems to be no point placing more"), and extra functional furniture becomes decoration only. A piece that has stopped functioning does not start working again. — [game-tier: 設置上限付き家具の調べ方](https://game-tier.com/pokopoke/pocoa-fur/)
- [Unverified] "Furniture cannot overlap other furniture or blocks." Partition and table combinations show that at least partitions can share space with furniture. — [pokopia.center](https://pokopia.center/posts/pokopia-building-guide-tips-2026/) vs [ナナセ on X](https://x.com/nanase__game/status/2032420006810775648)
- [Community-tested] Rotation uses D-pad Left/Right during placement. — [thegameswiki: Decorating](https://thegameswiki.com/pokopia/wiki/decorating)

### Inferences
- The planner can enforce or warn: (a) keep the entrance tile and the tile above it clear for kit houses; (b) furniture outside the door's vertical range (about -4 to +3, per testers) does not count toward the house; (c) caps per furniture group.
- Footprint rule: furniture with an N-tile footprint probably occupies those tiles at its Z level, and other furniture can't overlap it except partitions, rugs and wall items. This is a working model, not confirmed.

### Gaps
- The exact number of items per tile, and whether two small items can share one table tile. Not found.
- The full list of placement caps by furniture group. The game-tier page explains how to find them, but the list was not visible.
- Official (Nintendo/Pokémon site) documentation of any of these rules. None found. All door and height rules come from player testing.
- Patch history: no source tied a placement rule change to a specific game version, although game-tier's architecture page says it was updated after a patch (「アプデ後対応」).

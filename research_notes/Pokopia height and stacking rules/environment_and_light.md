# Pokopia home environment (light / warmth / humidity / daylight): vertical rules

> Sources and how they were read. All three ccopedia posts were read in full: light, the 「完全版」 (complete edition) dated 2026-10-09; warmth, 2026-10-05; humidity, 2026-10-14. The ぽこポケ学会 house page was also read in full. Those posts are dated after Ver. 2.0.0 (4 Aug 2026), so they describe the current game. Game8 JP, Bulbapedia and gamemos.net could not be fetched; claims from those sites come from search snippets and are marked as such. Labels: **Confirmed** = official / Nintendo patch notes; **Community-tested** = a player shows an in-game test; **Unverified** = wiki or guide claim with no test, or a search snippet only. No height or range rule is Confirmed by Nintendo; the in-game tests are ccopedia's and KYU's.
>
> **Height convention used below (from ccopedia).** Height 0 is the "floor" space: the air layer inside the enclosure, at the same level as the 1-high wall ring and the door, where furniture normally stands. Height −1 is the ground/floor block under it. Height +3 is three layers above the standing layer.

## 1. Which space counts for a block-built house (the base vertical range)

### Takeaway
The planner's rule is right, and it now has full community tests behind it for light, warmth and humidity alike. Only cells in "floor" columns count: the interior plus the door cell(s), from height −1 (the floor block itself and anything sunk one deep) to +3. Outside, the walls, and anything above or below the walls never count. Furniture recognition for comfort and favourites is a separate, wider range.

### Cited Findings
- **Community-tested:** ccopedia defines three terms for a block house. 床 (floor) is "ブロックとドアで囲まれた領域の内側の空間、およびドアが存在する空間": the space inside the blocks and door, plus the door's own space. 壁 (wall) is a space where a house block exists. 屋外 (outside) is everything beyond the enclosure. Light counts for 「床」とその上下-1～+3マスまでの範囲 (the floor and −1 to +3 above and below it) — [ccopedia 完全版「あかるい」「くらい」 (2026-10-09)](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** the same placement rule covers warmth and humidity. Warmth counts 屋内 / 床および床の上下-1～+3マスの範囲 / ※壁および壁の上下はNG (indoors, floor −1 to +3, walls and above/below walls not allowed) — [ccopedia 「あたたかい」「すずしい」 (2026-10-05)](https://note.com/ccopedia/n/n4b1e798887df). Humidity uses the same wording — [ccopedia 「うるおっている」「乾そうしている」 (2026-10-14)](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested: height −1 is the floor block layer.** "床を1マス掘って何かアイテムを置いたり、マグマを流したりするのはOK" (dig the floor one deep and place an item or pour magma: OK). Two deep does not count, so magma or items cannot be hidden under the floor blocks — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df). In the humidity side view, the vase at −1 and "屋内の地面を構成する芝生ブロック" (the grass blocks forming the indoor ground) both count — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** light sources at −1 count and at −2 do not; a Seedot lamp (タネボーランプ) at +4 does not count — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: the door cell is floor.** Magma rock (あついいわ) placed on top of the door is counted. Replacing the block directly under the door with ice pleased Articuno and upset Drifblim. Water under the door counts toward humidity — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** ぽこポケ学会 independently states that for light sources and other environment items, "家の中とドアの上下のみ。床面-1～+3マス" (inside the house and above/below the door only, floor −1 to +3), marked 検証不十分 (not fully verified). It adds "おそらく扉の正面も認識されるはず" (probably the tile in front of the door counts too); ccopedia does not support this — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- **Community-tested: furniture recognition is a different, wider range.** The white dotted range shown with the R stick reaches +4 in every direction from the habitat or block house — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f). Items at −2 or +4 are inside that range, so Pokémon react to them as placed furniture, but they add no environment points — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested, conflicts slightly:** ぽこポケ学会 gives the furniture recognition range as "扉から-4マス～+3マス" (−4 to +3 from the door; footnoted to KYU). It also says furniture can be shared between houses — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/). ccopedia saw a lamp and an air conditioner at +4 recognised as furniture. This needs a re-test.
- **Community-tested: house validity.** A house needs:
  - walls 1 high, enclosing a space with at least one door (2-tile doors are fine);
  - a floor of 2×2 or more (1×4 is not enough);
  - no block directly in front of the door on the outside;
  - 3 different furniture types, checked only at move-in.

  Walls can be wooden fences or glass windows. No floor is needed. Houses may share walls but not doors. A house may sit underwater or in magma, have only 1 cell between floor and ceiling, or be stacked on another house, which then also counts — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Conflict on the maximum size:** ぽこポケ学会 says "9x10マス以上の床面積は不可" (a floor of 9×10 or more is not allowed) — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/). ccopedia built and tested a 9×10 interior and calls 90 tiles the upper limit — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** some build kits produce block houses, not kit houses. The ログハウスキット is one, and the 小さなオフィスキット follows block-house height rules, so block-house rules apply to them — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested (April, snippet only):** gamemos reached the same rule earlier: inside the house plus above/below the door, floor −1 to +3, and nothing counts above or below the house frame — [gamemos.net (2026-04-10)](https://gamemos.net/2026/04/10/post-140083/)

### Inferences
- **Planner rule.** An item counts for the environment when its cell is in a floor column and its height h is between −1 and +3, with 0 the standing layer. Floor columns are every interior tile plus every door tile.
- The h = −1 layer includes the floor blocks. Grass, dead-grass, ice and magma floor blocks therefore add humidity or warmth, and the planner must count the floor material.
- Furniture or favourites counting should use the wider dotted range, about ±4, which includes walls and outside cells. Environment counting should use the strict floor-column band.

### Gaps
- No test confirms whether the tile directly in front of the door counts for the environment. ぽこポケ学会 says "probably"; ccopedia does not list it.
- The +3 vs +4 discrepancy in furniture recognition is unresolved.

## 2. Items on top of walls and wall-mounted items (inside face vs outside face; clocks, mirrors, posters)

### Takeaway
On top of, inside, or under a wall: never counts, even for blocks that give off light, heat or moisture. A wall-mounted item on the inside face counts when its cell is at +3 or below. ccopedia tested this with an air conditioner (+4 no effect, +3 works) and with wall torches. Wall clocks, posters and mirrors have no environment points. They can still count as furniture or favourites anywhere in the wider recognition range, but how they score as decoration was not tested.

### Cited Findings
- **Community-tested:** walls built from light-giving blocks do not count: block lights, or neon floor tiles (ネオンなゆか, light 80) used as walls — "明るさにはカウントされません" — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** light items placed above or below the wall cells do not count, while the same items above or below the door do — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** none of these warmed the house at all: magma and hot springs one tile outside the wall, あついいわ on top of the wall, magma flowing in a trench under the wall, and part of the wall built from magma rock. Drifblim did not react to any of them — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested:** walls made of grass or dead-grass blocks change no humidity points. Water under the walls and humidity items on top of the walls are all ignored — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** lights embedded inside walls (壁の中に照明器具を埋めたり) do not count — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: inside-face wall items.** An air conditioner set 4 above the floor gave no cooling, though it was recognised as being indoors. Lowered one block to +3, it gave "涼しくなった✅". The author warns that air conditioners and ceiling fans are the items people tend to mount too high — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested: wall-mounted item values.** かべかけたいまつ (wall torch) has light 40 and warmth 60, and only works when lit. モンスターボールのかべ has light 40 — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested: wall items with zero points.**
  - Light: ほしぞらのカベ, and ネオンなゆか used as wallpaper (カベ紙) — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
  - Humidity: カベかけタオル, くさのカベかざり, かべかけフラワー, リース — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested: furniture beyond the walls still counts as furniture.** Furniture around a house also affects comfort; the range is the white dotted area. Pokémon that cannot reach an item are not affected by it, and furniture can be shared between houses — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Community-tested (snippet):** the gamemos test also found a wall light at floor +3 just inside the range, and one any higher had no effect — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)

### Inferences
- The rule works per cell, so the wall itself doesn't matter. A wall-mounted item on the inside face sits in an interior floor-column cell and counts if h ≤ 3. The same item on the outside face sits in an outside cell and never counts. The outside-face case has not been tested directly, but it follows from "屋外は完全に無関係" (outside is completely irrelevant) — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd).
- A torch or lamp standing on top of a wall is in a wall column and never counts, at any height.

### Gaps
- No test of wall clocks, mirrors or posters as "decoration" (かざりつけ) for comfort or favourites, or of whether a wall item hung on a wall's outer face still counts as furniture. It probably does if it is within the dotted range and the Pokémon can reach it, but that is untested.
- It has not been confirmed which cell the game assigns to a wall-mounted item: the cell in front of the wall, or the wall cell. The air conditioner result implies the cell in front.

## 3. Items on tables, shelves and counters inside the house

### Takeaway
The rule depends only on position: a cell in a floor column at height −1 to +3 counts, whatever the item rests on. An item on a table or counter therefore counts unless it ends up at +4 or higher. Nobody has tested tables specifically.

### Cited Findings
- **Community-tested:** a Castform charm (てるてるポワルン) at +3 inside a 2×2 house counts toward humidity — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** a waterfall at +3 and the splash where it lands at +2 both count, as 20 per cell. Placement is judged by cell height, not by what is underneath — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** in a block house, a waterfall from the sky down to deep underground only counts for 4 cells, 80 in total, because of the height limit — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** plants in vases (かびん系) count for humidity at 2.5 each, and so do potted trees (うえ木系) — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)

### Inferences
- Count an item on a table, shelf or counter by the height of its own cell. A 1-high table puts the item at h = 1; a 2-high shelf top puts it at h = 2. Both count.
- For a stacked item taller than one cell, the cell that matters is not established. For hanging lights, ccopedia says it is the light source's height (section 4). Planner default: test the item's own placement cell.

### Gaps
- No test of items sitting on furniture surfaces specifically, or of whether the planner's 2-high stacked furniture shifts the item to h = 2.

## 4. Ceiling lights, ceiling fans and ceiling height

### Takeaway
In block houses, ceiling-hung lights and fans follow the +3 cap. What counts is where the hanging item's light source sits, which differs by item. One example: the 小さなオフィスキット has 16 ceiling block lights at 5 above the ground and its brightness is 0. In kit houses there is no height limit, so ceiling lights, fans and air conditioners count at any height.

### Cited Findings
- **Community-tested:** ceiling-hung lights only work if the ceiling is lower than you'd expect: "天井からぶら下げるタイプの照明器具は、天井が思ってるより低めじゃないと明るさとしては機能しません". Each hanging light puts its source at a different height. In the example, of three hanging lights only the ポップなランプ, with its source at height 3, was counted — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** the office built by the 小さなオフィスキット has 16 block lights set in the ceiling at 5 above the ground. None of them count and the house's brightness is 0. Lights must be added to suit Pokémon that like bright homes — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** the ceiling fan (てんじょうせんぷうき) is warmth −60, and the air conditioner is −60 on cool or +60 on warm. Both need power and must be switched on, and both obey the +3 cap in block houses — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested, kit houses:** "高さの制限も無いので、天井からぶら下げる照明も普通に明るさとしてカウントされます" (no height limit, so hanging lights count normally). One ceiling グランドライト is enough for "明るくなった" — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f). In large kit houses a ceiling fan can only be fitted very high, and it still works; air conditioners also work at the highest position — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested (snippet):** gamemos found that with the ceiling at floor +5, a 1-block-tall ceiling light is out of range — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Unverified (rumour):** Gallade stays unsatisfied in tall rooms despite many lights — [ぽちぽちゲーム速報](https://note.com/game9820/n/n23c73d331ff3). This is explained by the +3 cap above.

### Inferences
- **Planner rule for block houses.** A ceiling light or fan counts only if its source cell is at h ≤ 3. For a 1-tall hanging item directly under the ceiling, the ceiling block must be at h ≤ 4. Longer pendants allow a higher ceiling, depending on the item.

### Gaps
- No per-item table of light-source height below the ceiling for hanging lights. Only ポップなランプ is named as reaching height 3 in the example.

## 5. Daylight: windows, open roof tiles, roof height, partial roofs, glass

### Takeaway
The formula is daylight = 90 × (floor cells open to the sky, door cells included) ÷ (total house footprint including walls). That gives 62.045 for a 9×10 interior; the 31.5 example is a 4×5 total footprint. Light only comes straight down. Windows, side openings, time of day and weather are all irrelevant. Any block at height ≥2 over a floor or door cell acts as a roof, and roof height has no upper limit. Nothing was found on glass blocks as a roof.

### Cited Findings
- **Community-tested: properties of natural light.**
  - Time of day and weather make no difference.
  - Light enters only from directly above: "真上から入光する（横方向は無関係）" (sideways irrelevant).
  - Shaded area subtracts in proportion.
  - Formula: 自然光の明るさ＝90×入光率＝90×入光している面積/すみかの範囲やブロック家の総面積 (90 × lit area ÷ total area).

  — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: block-house specifics.** The lit fraction is taken over the house's total area, walls included. Walls are never lit; only floor cells, the door cell included, receive light. For the 9×10 interior: total 11×12 = 132, lit floor = 90 + 1 door = 91, daylight = 90 × 91/132 = 62.045 — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** a block house of 4×5 total area has 13 wall tiles and only 7 floor tiles, so even with no roof its daylight is 90 × 7/20 = 31.5. It is "dark" with no work at all. Three roof tiles bring daylight to 18, so even a light-80 item cannot make it bright — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: what makes a roof.** "地面・床を高さ0として、高さ2マス以上の位置にブロックを置けば屋根として機能します". The photo caption shows a block with one empty cell between it and the floor working as a roof. A roof can also sit above the door cell — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: roof height has no upper limit.** A single block at the maximum build height still worked as a roof; breaking it raised brightness. "屋根に高さは関係ないと思われる" (roof height seems irrelevant). Structures high in the sky can therefore shade a house by accident — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: solid stacks.** A column filled solid with blocks up to height 4 gets no light. A 3-high stack made no difference; that spot was already lit. This was tested in a habitat range — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: windows.** "壁の窓も明るさや暗さには全くの無関係です" (wall windows are completely irrelevant to brightness or darkness). In kit houses, opening or closing the default curtains also has no effect — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** in habitats, walls and floors blocking a lamp's light visually is irrelevant: "壁や床でランプの光を遮光するとかは全く関係がありません". Any light in the range counts, including on top of a roof — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested, rounding quirk:** 3 roof tiles on the 9×10 house should give exactly 60, (91−3)/132 × 90, but "dark" needed 4 tiles. The author suspects float precision, noting that 88/132 in 32-bit float is 0.6666666865 — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Refuted / Unverified:** thegameswiki says interiors need walls at least 3 blocks high to block natural light, and that windows or gaps let light in. Game8 EN suggests adding windows for brightness. All of this conflicts with ccopedia's tests — [thegameswiki Brightness System](https://thegameswiki.com/pokopia/wiki/brightness-system); [Game8 EN Bright Habitat](https://game8.co/games/Pokemon-Pokopia/archives/585695)
- **Community-tested:** to make a house dark, put a ceiling over the floor; which heights affect the dark check had not been verified. The 2026-10 ccopedia tests later settled this — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)

### Inferences
- The planner's figures match: max 62 for a 9×10 interior, and 45 for a 5×4 interior (90 × 21/42). The planner must count the door cell as lit when nothing is above it, and walls in the denominator only.
- **Roof threshold, ambiguous.** The roof section seems to measure "2" from the ground block, given the one-empty-cell caption. The placement band uses the standing layer as 0. In standing-layer terms, a roof is probably any block at h ≥ 1 over a floor or door cell: a ceiling block one cell above the floor surface. This matches ぽこポケ学会's valid house with "only 1 cell between ceiling and floor".
- The solid-stack result (3-high lit, 4-high not) does not fit a simple "block at height ≥2" rule. It looks like a separate case for solid columns that the planner can ignore for normal floor tiles.
- A dark-preference check should use a strict threshold, or float32 arithmetic, because exact-60 daylight values can fail.

### Gaps
- Nothing found on glass, ice or other transparent blocks, fences, or slabs as roof material. ccopedia's roof tests used soil and sea rock (シマシマのつち, うみのいわ).
- Whether a roof over the wall cells matters is moot, since walls are never lit.

## 6. Second storey of a block-built house

### Takeaway
Stacked block houses are allowed, and each is recognised as its own house. For the lower house, an upper storey's items at h ≥ 4 don't count, and the upper floor's blocks act as a roof that removes daylight. Nobody tested whether items of a low upper house that fall inside the lower house's band count for it.

### Cited Findings
- **Community-tested:** "上にもう一個家があっても、両方家判定される" (a house on top of another: both count as houses). The page's most efficient housing design is "積層可能" (stackable). Only 1 cell is needed between floor and ceiling, and no floor is needed — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Community-tested:** for furniture, items at ground level are recognised if there is a door within 5 cells of the ground surface: "地表から5マス目までに扉があれば、地表上のアイテムは認識される" — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Community-tested:** environment items at +4 or higher do not count, and roofs at any height above floor cells shade them — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested, habitats:** habitats count humidity across ±4 vertically, so layered habitats can pick up unintended humidity from other levels — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)

### Inferences
- In the planner, each storey that has its own wall ring and door is a separate house. The upper storey's floor blocks are roof cells for the lower house's daylight. Items count for whichever house's floor-column band, −1 to +3, contains them.
- An upper house's floor blocks are at its own h = −1. If they sit within the lower house's band, at lower h ≤ 3, they might count for both houses. That needs a test.

### Gaps
- No test of overlapping bands between stacked houses, or of whether furniture shared across stacked houses counts twice.

## 7. Kit houses with their own interior

### Takeaway
Confirmed by community test: everything indoors counts at any height, with no natural light. Windows, curtains, wallpaper and floor covering don't matter. Thresholds: light ≥40 bright and ≤40 dark, so both are met at exactly 40; humidity ≥40 moist and ≤60 dry; warmth ±60, the same as every other home type.

### Cited Findings
- **Community-tested:** a kit house is one with a loading screen into a separate map. "屋内ならどこに置いても大丈夫です" (anywhere indoors is fine), with no height limit and no natural light — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** light 40+ gives "明るくなった" and 40 or below gives "暗くなった". At exactly 40 both are met, so Pokémon that like bright and dark homes can share. The default curtains, wallpaper and floor (neon floor tiles tested) have no effect — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** kit-house humidity is 40+ for moist and 60 or below for dry, with no height limit, so 40–60 suits both. Blocks and water cannot be placed inside kit houses — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** warmth is calculated the same way in kit houses (±60) with no height limit. Magma, hot springs and blocks cannot be used inside — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested:** さらさらいわ keeps working inside a kit house during rain, but it sometimes stops working when plants are placed nearby — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** small kit houses cannot take power from outside, so electric lights need a ミニはつでんマシン indoors. A few items give light with no fire or power: pumpkin lanterns and the Trevenant street lamp (20), ちょうちん (40), and the mushroom lamp, mushroom street lamp and pearl street lamp (80) — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community (blog):** the りっぱなキット has 2 windows on the 1st floor and 4 on the 2nd, and a 14×10 interior — [東方錆恋録](https://rusted-coil.hateblo.jp/entry/2026/04/04/151815)
- **Unverified (snippet):** ぽこポケ学会 guesses that comfort ranks kit house > block house > habitat — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)

### Inferences
- "Anywhere indoors" with no height limit covers both floors of a two-storey kit. ccopedia did not single out the 2nd floor, so mark this as strongly implied, not explicitly tested.

### Gaps
- No explicit test of 2nd-floor items in a two-storey kit.

## 8. Thresholds and point values

### Takeaway
Block house and habitat: light ≥100 bright, ≤60 dark; humidity ≥100 moist, ≤30 dry. Kit house: light ≥40 / ≤40; humidity ≥40 / ≤60. Warmth everywhere: total ≥ +60 warm, ≤ −60 cool. Light items are worth 20, 40 or 80 (beach parasol −40), with daylight adding up to 90 × the lit fraction.

### Cited Findings
- **Community-tested:** light thresholds are 100+ / ≤60 for habitats and block houses, and 40+ / ≤40 for kit houses — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** light values.
  - 20: candles, gaming furniture, pumpkin lanterns.
  - 40: ブロックライト, いしのだんろ, たきび, かべかけたいまつ, かがりび, ちょうちん, ひかるキノコ.
  - 80: most lamps and street lights, けいこうとう, ネオンなゆか, キャンプファイヤー.
  - −40: ビーチパラソル.
  - No light: オイルランタン, テレビ, ほしぞらのカベ.

  The values are the author's own scale, fitted to the results, not internal data — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** warmth thresholds are +60 / −60 for every home type and size.
  - +10: candles, マグマいわ.
  - +30: おんせん, アツアツいわ.
  - +60: マグマ, たきび, かべかけたいまつ, いしのだんろ, エアコン on warm, あついいわ.
  - −10: こおり, つらら, かきごおり, クリームソーダ.
  - −60: refrigerators, せんぷうき, てんじょうせんぷうき, エアコン on cool, つめたいいわ.

  Fire items must be lit, and appliances must be powered and switched on. Two typos in the post: マグマいわ is "(30)" in its quiz but 10 in the list and the arithmetic, and the cold items are written "+10" in one sentence — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested:** warmth for habitats uses the same −1 to +3 height band. Light and humidity for habitats count the whole ±4 range — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** humidity thresholds are 100+ / ≤30 for habitats and block houses, and 40+ / ≤60 for kit houses.
  - 1: grass block.
  - 2.5: grass, flowers, crops at sprout stage or later, potted trees, vases with flowers.
  - 5: trees.
  - 20: water, muddy water, hot springs, waterfalls (per cell), sink, toilet, washbasin, shower.
  - 50: Castform charm, rain form.
  - 100: bathtub, humidifier, みずおけ, sprinkler, しめったいわ (working or filled).
  - −0.5: dead grass block.
  - −50: Castform charm, sun form.
  - −100: さらさらいわ, which becomes 0 in rain even under a roof.

  Rain itself does not change humidity — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested:** a block house of 30 floor tiles or fewer stays dry even with an all-grass floor, because grass is 1 per tile and dry is ≤30 — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Unverified, now refined:** GameWith says any light inside a roofed house breaks "dark" — [GameWith 暗くする方法](https://gamewith.jp/pocoapokemon/547918). Per ccopedia, a fully roofed block house stays dark up to 60 total, so three 20-point candles or one 40-point fireplace are fine — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)

### Inferences
- The planner's thresholds all match ccopedia. The block-house Bright threshold it left open is 100.

### Gaps
- None of the point values are official. ccopedia notes they are a fitted scale.

## 9. Patch changes

### Takeaway
No patch is known to have changed the vertical rules. The ccopedia tests (Oct 2026) come after Ver. 1.1.0 (June) and 2.0.0 (Aug), agree with the April gamemos findings, and so reflect the current game.

### Cited Findings
- **Confirmed (patch notes, reported):** Ver. 1.1.0 (9–10 June 2026):
  - changed the comfort settings of the waterproof seat and stone fireplace;
  - fixed comfort not rising after disliked items were removed;
  - fixed Pokémon saying it got darker or brighter when nothing changed;
  - made the Environment Level screen show which requests were met.

  — [Game8 EN 1.1.0](https://game8.co/games/Pokemon-Pokopia/archives/605000); [Nintendo Life](https://www.nintendolife.com/news/2026/06/pokemon-pokopia-updated-to-version-1-1-0-includes-improvements-and-fixes); [Pokémon portal notice](https://ph.portal-pokemon.com/topics/post-5960/)
- **Confirmed (reported):** Ver. 2.0.0 (4 Aug 2026, Bubbly Basin expansion) had no range or daylight change found — [Kotaku](https://kotaku.com/pokemon-pokopia-2-0-patch-notes-bubbly-basin-expansion-dlc-2000721906). The content of 2.0.1 is unknown — [PokeOS](https://www.pokeos.com/p/pokopia/patch-notes)
- **Community-tested:** the light post is a 「完全版」 (2026-10-09) that replaces an earlier, less certain version by the same author — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)

### Inferences
- The gamemos result (April, before 1.1.0) and the ccopedia results (October, after 2.0.0) agree on −1 to +3. That suggests no patch changed the band.

### Gaps
- Full official notes for 2.0.0 and 2.0.1 were not read, and nothing is known about later patches.

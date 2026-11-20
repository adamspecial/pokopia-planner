# Pokopia home environment (light / warmth / humidity / daylight): vertical rules

> How this was gathered: this session's network blocked page fetches for note.com, kyu49.github.io, game8.jp and bulbapedia.bulbagarden.net, so the primary ccopedia and ぽこポケ学会 pages could NOT be opened directly. Every finding below comes from web-search result snippets and the search tool's summaries of those pages. Japanese text in quotes is as the search tool returned it. Treat paraphrases as second-hand until someone reads the page itself. Labels: **Confirmed** = official / Nintendo patch notes; **Community-tested** = a player says they tested it; **Unverified** = wiki or blog claim with no test shown, or a search summary whose source is unclear. No height or range rule found here is Confirmed by Nintendo or The Pokémon Company.

## 1. Which space counts for a block-built house (the base vertical range)

### Takeaway
The planner's model ("inside the walls or on the door tile, from 1 below to 3 above the floor; walls, anything on or under the walls, and anything outside never count") matches the most detailed community test found (gamemos.net, 10 Apr 2026). That test's author admits the height counting may be inconsistent. A second community claim ("about 4 below to 3 above the door's height") is about whether furniture is recognised for the house itself, and it does not match on the lower bound.

### Cited Findings
- **Community-tested:** the range that affects the "favourite environment" of a self-built house is "inside the house plus above/below the door". Items placed outside the house, or above/below the house frame (家の枠の上下), have no effect — [gamemos.net 自作ハウスの"好きな環境"に影響する範囲 (2026-04-10)](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested:** the valid height, taken from the floor surface, is −1 to +3 (床面から-1〜+3段). The author's diagram puts the floor block at Y=0 — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested, with a caveat:** the same article says the author could not make the height counting consistent (高さの数え方が統一できていない) — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested, about house recognition rather than environment:** a home's furniture is recognised within about 4 blocks below to 3 blocks above the door's height, and a home needs at least 3 different furniture types. The search tool drew this from two pages and did not say which one said what — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/); [goccha-journal 家具は関係ある？](https://goccha-journal.com/8814)
- **Community-tested:** "おねがいごと家具は上下4マス目の距離までOK" (furniture for requests counts up to the 4th tile above/below). The same post says a house needs at least 4 ground tiles, no ceiling, a door, and walls 1 high are enough if they enclose the space — [X @__ririmero](https://x.com/__ririmero/status/2029761931813474412)
- **Community-tested:** a block house needs a floor of 2×2 or more (1×4 is not enough), walls at least 1 high, and at least one wall tile that is a door (two doors are fine). 2-tile doors, glass walls and even fences work as walls — [X @kyuphd (KYU, ぽこポケ学会 author)](https://x.com/kyuphd/status/2030234005325668475)
- **Unverified (guide sites):** the interior must be between 2×2 and 10×9 (or 9×10). Walls need to be at least 1 high, and a roof is optional: "高さは1段以上必要（屋根の有無は自由）". Other guides give 10×10 as the maximum — [Game8 JP 家判定の条件](https://game8.jp/pocoapokemon/768198); [GameWith ブロックの家](https://gamewith.jp/pocoapokemon/547952); [気ままなニュース 家判定](https://dokodeyomu.hatenadiary.com/entry/Pocoa_Pokemon_House_Determination)
- **Unverified:** Pokémon comfort only rises when the changes are made inside the house: "Such adjustments need to be made inside the house to affect the comfort levels of the Pokémon living there." The search tool surfaced this from Bulbapedia or thegameswiki and the exact page was not clear — [Bulbapedia Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level)

### Inferences
- If Y=0 is the floor block, then −1..+3 covers: the block under the floor (Y=−1), the floor block itself (Y=0), and the first three air layers above it (Y=1, 2, 3). A planner should test an item's base cell against Y ∈ [−1, 3] relative to the floor block, using only columns inside the walls plus the door column(s).
- The "4 below / 3 above the door" figure is about whether furniture counts for house status or requests. It may be a different check from the environment calculation, so it should not replace the −1..+3 environment range without a fresh test.

### Gaps
- No official statement on the range exists. I found no community test after the 1.1.0 / 2.0.0 patches that repeats the −1..+3 measurement.
- It is still unclear whether "−1" means items sunk into the floor layer (for example water or a light block used as a floor tile) or items under the floor block. The ccopedia pages that may answer this could not be opened.

## 2. Items on top of walls and wall-mounted items (inside face vs outside face; clocks, mirrors, posters)

### Takeaway
Items on top of the wall frame do not count (community-tested). A wall light on the inside of the house at floor +3 just counts; the same light any higher does not (community-tested). I found nothing on outside-face wall items, or on whether wall clocks, mirrors or posters count as furniture.

### Cited Findings
- **Community-tested:** items above or below the house frame (家の枠の上下), meaning the walls, have no effect on the environment — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested:** the test assumed a bed on the floor. One step above its canopy (floor +3) is the upper limit, so a wall light (ウォールライト) placed there is just inside the range, and one placed any higher has no effect — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested:** in the same test, one light source rated "まあまあ" (okay) and two rated "満足" (satisfied) — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Unverified (blog):** each block stops light, so one lamp cannot light a whole room, and adding lights high on the walls reduces shadows. This is about how the room looks, not the environment calculation, and the blog cites no test — [気ままなニュース ブロック建築が暗い時](https://dokodeyomu.hatenadiary.com/entry/Pokoa_Pokemon_Block_Building)
- **Unverified (fan wiki/guide):** the "Decoration" preference tag covers wall art, rugs, vases, shelving and ornamental items, so wall art and shelves share a tag. Nothing says whether wall art placed on a wall counts toward house furniture — [pokopia.center Furniture Categories](https://pokopia.center/posts/pokopia-furniture-categories-complete-2026/)

### Inferences
- A wall light on the INSIDE face sits in an interior cell next to the wall, so it counts when that cell is at Y ≤ 3. The gamemos result fits this.
- A wall light on the OUTSIDE face sits in an exterior cell, so under the "outside never counts" rule it should not count. Nobody has tested this directly.
- A lamp or torch standing on top of a wall block is "above the house frame", so it does not count, whatever its height.

### Gaps
- I found no test of outside-face wall lights or torches.
- I found no test of whether wall clocks, mirrors, posters or paintings count toward the 3-furniture rule, a Pokémon's favourites, or the environment. I also found no confirmation of whether the game's footprint for a wall item is the wall cell or the cell next to it.

## 3. Items on tables, shelves and counters inside the house

### Takeaway
I found no source that tests whether a light, candle or humidifying item placed ON a table or shelf counts. Under the community −1..+3 model, an item resting on a 1-high table (base at Y=2) is inside the range.

### Cited Findings
- **Community-tested:** the range is described as a vertical band (floor −1 to +3) inside the house, not as "floor tiles only" — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Community-tested:** the canopy-bed example measures the limit by the stack height of things on the floor ("天蓋の一段上 = 床+3"). This suggests the band is measured in block layers, not by what the item rests on — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)

### Inferences
- The planner should count an item on a table, shelf or counter if its base cell is within Y=1..3 (floor block at Y=0), and treat that as Community-inferred, not tested.
- Whether to use the item's base or its top cell for the +3 cut-off is not settled. The ceiling-light finding in section 4 suggests the occupied cell is what matters: a 1-tall item at Y=4 is out.

### Gaps
- I found no direct test of stacked items (on tables, shelves or counters) for light, warmth or humidity.
- It is unknown whether items placed on furniture "slots" are tracked separately from items on blocks.

## 4. Ceiling lights, ceiling fans and ceiling height

### Takeaway
A 1-block-tall ceiling light hung under a ceiling at floor +5 is out of range (community-tested), which fits a +3 cap. Reports of Gallade not being satisfied in tall rooms point the same way. I found no data on ceiling fans.

### Cited Findings
- **Community-tested:** "天井の位置が床+5だと、縦1ブロック分の大きさの天井照明は範囲外になる" — with the ceiling at floor +5, a ceiling light 1 block tall is out of range — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Unverified (rumour, as the source itself says):** some players place many lights and Gallade still is not satisfied. The source suggests ceiling height or light placement as the cause, and a high ceiling pushing lights out of range: "照明を大量に設置しても満足しないケースがあり、天井の高さや設置位置が影響している可能性が指摘されている" — [ぽちぽちゲーム速報 (note.com/game9820)](https://note.com/game9820/n/n23c73d331ff3)
- **Opinion (looks only, not mechanics):** a player is about 1.5 blocks tall; a 2-block ceiling feels low, 3 is a normal house, 4 a shop and 5 a big station — [X @gyonge](https://x.com/gyonge/status/2033355317443215576)

### Inferences
- With the floor block at Y=0, a ceiling block at Y=5 hangs a 1-tall light at Y=4, which is outside −1..+3. A ceiling at Y=4 hangs the light at Y=3, which counts. For a planner: a ceiling light counts only if the ceiling (roof) block above it is at Y ≤ 4, meaning 3 air layers at most. A 2-tall light would need the ceiling at Y ≤ 5 if its lowest cell is what's checked, but nobody has tested that.

### Gaps
- I found no data on ceiling fans, chandeliers taller than 1 block, or whether the top or bottom cell of a hanging light is checked.
- It is not clear whether a light hung from a ceiling counts as "on the floor inside the walls" when its column is inside the walls. The ceiling result suggests it does when Y ≤ 3.

## 5. Daylight: windows, open roof tiles, roof height, partial roofs, glass

### Takeaway
ccopedia's model (natural light = 90 × the share of the area that light reaches, falling to 0 under a full roof, and rising tile by tile as roof blocks come off) is the only formula found, and it is community-tested. Wiki and guide claims that windows or gaps let light in are unverified and do not fit a sky-open-tile model. I found no source on glass roofs, or on whether a roof 2 blocks up behaves differently from one 5 blocks up.

### Cited Findings
- **Community-tested (ccopedia, through a search snippet of the English-translated page):** natural light brightness = 90 × light entry rate. Each roof block removed restores light in proportion, and a fully covered roof gives natural light 0 — [note.com/ccopedia 「あかるい」「くらい」の仕様 完全ガイド](https://note.com/ccopedia/n/ndadc82daf39f?hl=en)
- **Community-tested (ccopedia, through a snippet):** if the total brightness of the placed furniture is 60 or less, the "くらくなった" (became dark) state can be kept — [note.com/ccopedia](https://note.com/ccopedia/n/ndadc82daf39f?hl=en)
- **Unverified (guide):** a roof works just by covering the sky above a habitat with blocks: "屋根は、ポケモンの生息地の上空をブロックで覆うだけで効果が出るので比較的簡単です" — [Game8 JP 暗くするやり方](https://game8.jp/pocoapokemon/768268)
- **Unverified (guide):** moving a Pokémon into a house with a roof also makes it dark, but a light inside the house cancels the dark judgement: "屋根のある家を建てて引っ越しさせることでも、暗くすることができます。ただし、家の中に照明があると暗い判定でなくなる" — [GameWith 暗くする方法](https://gamewith.jp/pocoapokemon/547918)
- **Unverified (fan wiki):** enclosed habitats with a roof and walls at least 3 blocks high inside block natural light. Outdoor habitats are bright by default, and any opening lets light in. For dark-loving Pokémon, it says not to add window blocks or leave gaps in walls — [thegameswiki Brightness System](https://thegameswiki.com/pokopia/wiki/brightness-system)
- **Unverified (guide):** "you can also add windows if your walls are high enough" (bright-habitat advice). Building outdoors is the easiest way to get a bright habitat, with streetlights for night — [Game8 EN How to Make a Bright Habitat](https://game8.co/games/Pokemon-Pokopia/archives/585695); [Game8 EN How to Make a Habitat Darker](https://game8.co/games/Pokemon-Pokopia/archives/585570)
- **Community-tested (not houses):** the brightness of an underground space, where no sunlight enters, is the same at any height or depth: "地下空間（日光が入らない場所）の明るさはどの高さ・深さにあっても変わりません". A reader comment adds that the same light seems to reach further when it shines from above — [hyperts.net 地下空間の明るさ](https://hyperts.net/pokopoke/underground/)
- **Unverified (guide):** roofs and light sources affect a home's brightness ("Roofs and light sources can affect the brightness of a home.") — [Bulbapedia Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level)

### Inferences
- The ccopedia formula fits the planner's model: daylight = 90 × floor tiles open to the sky ÷ every tile of the house. The "max 62 in a 9×10" and "45 in a 5×4" figures could not be checked from snippets, so I checked the arithmetic instead. Floor tiles alone in the numerator do not give them: 90 × 90/132 = 61.4 and 90 × 20/42 = 42.9 (interior plus a 1-wide wall ring with corners). Both figures come out exactly if the 1-tile door also counts as an open tile in the numerator: 90 × 91/132 = 62.05 → 62, and 90 × 21/42 = 45.0 → 45. So the planner's maxima fit: daylight = 90 × (open floor tiles + open door tiles) ÷ (interior + every wall tile, corners included). The planner should count the door tile as open sky when it has no roof above it.
- In the ccopedia model, windows (side openings) add nothing; only open sky above floor tiles counts. The thegameswiki and Game8 window claims may be loose generalisation or may describe outdoor habitats. Treat "windows add daylight" as Unverified and against the community test.
- The ccopedia snippet is about how much of the area light can reach. It does not mention roof height, so whether a roof 2 or 5 blocks up counts the same is open. The planner's rule (any block 2 or more above the floor is a roof) is not contradicted, but no snippet confirmed it.

### Gaps
- I found no source on glass, ice or other see-through blocks as roofing, or on fences, slabs or other partial blocks as a roof.
- I found no source on roof height (2 vs 5 blocks) making a difference. thegameswiki's "at least 3 blocks high internally" has no test behind it and conflicts with the planner's "a block 2 or more above the floor is a roof"; it needs checking against ccopedia directly.
- The exact denominator of the daylight formula (floor only, or floor plus walls) and the 62 / 45 maxima could not be checked without opening the ccopedia page.

## 6. Second storey of a block-built house

### Takeaway
I found no source on whether items on an upper storey of a block house count toward the ground floor's environment. Under the −1..+3 band, anything on a second floor at Y ≥ 4 is out of range for a ground-floor house.

### Cited Findings
- **Community-tested:** valid height is floor −1 to +3, and anything above that (a wall light above floor +3, a ceiling light at floor +4) has no effect — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)
- **Unverified (snippet, source unclear):** a house is still recognised with uneven heights, but not if the height or the distance needed to reach it is too great: "高さ or アクセスするための距離が離れすぎると、認識されない". This came up alongside the KYU thread on house recognition — [X @kyuphd](https://x.com/kyuphd/status/2030234005325668475)

### Inferences
- A second-storey floor laid at Y=4 with items on it at Y=5 and up would be outside the ground-floor house's band. A planner should exclude upper-storey items from the ground-floor house unless the upper floor is low enough to put items at Y ≤ 3, which is physically unlikely.
- The second-storey floor block also acts as a roof over the ground floor (it is at least 2 above the floor), so it would cut daylight for the tiles under it.

### Gaps
- I found no test of a two-storey block house: whether the upper level can be a separate house, or whether the game merges or rejects stacked houses.

## 7. Kit houses with their own interior

### Takeaway
Players report that kit houses are bright with no electricity at all, which fits the planner's "kit = its own interior" model. I found nothing on the planner's specific kit rules (everything inside counts on both floors at any height; no daylight; windows, curtains, wallpaper and floors don't count).

### Cited Findings
- **Community report:** a player asking how to house a dark-loving Pokémon says kit houses are bright even without electricity, and wonders whether they are forced bright: "キットで建てる家は強制的に明るくなるから無理だと思っています". The answer suggests leaving out lights to make it darker — [Yahoo!知恵袋 q10328110095](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10328110095)
- **Community report:** a player says the inside of a block-built house is dark even with several lamps, compared with a kit house — [Yahoo!知恵袋 q11326284081](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326284081)
- **Community (blog):** the りっぱなキット kit has 2 windows on the 1st floor and 4 on the 2nd, and the largest interior at 14×10. Wallpaper can only be changed for the whole house at once — [東方錆恋録 内装テンプレート考察](https://rusted-coil.hateblo.jp/entry/2026/04/04/151815)
- **Unverified (guide):** the small kits "〇〇のこや" and "〇〇のおへや" cannot change wallpaper, and block houses cannot change wallpaper at all — [Altema 模様替え](https://altema.jp/pocoapokemon/moyougae)
- **Unverified (guide, about Bulbapedia):** the larger the house, the more the comfort of the Pokémon living there increases — [Bulbapedia Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level)

### Inferences
- The "kit houses are bright with no lights" reports fit kit interiors having a fixed base brightness that does not come from daylight tiles. They do not show whether windows add to it.

### Gaps
- No source I could reach confirms that both floors of a kit house count, that there is no height limit inside a kit, or that windows, curtains, wallpaper and floors are excluded. These rest on the ccopedia and ぽこポケ学会 pages that could not be opened.

## 8. Thresholds and how warmth and humidity add up

### Takeaway
The only threshold number found in a snippet is ccopedia's "total furniture brightness ≤ 60 keeps a house dark". It conflicts with the planner's kit-house "dark ≤ 40" unless the two apply to different house types. I found no warmth or humidity threshold numbers, and nothing on height for warmth or humidity specifically.

### Cited Findings
- **Community-tested:** total brightness of placed furniture ≤ 60 keeps the "became dark" state — [note.com/ccopedia (light)](https://note.com/ccopedia/n/ndadc82daf39f?hl=en)
- **Unverified (guide):** lamps raise brightness but do nothing for temperature — [pokopia.center Comfort Level Guide](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/)
- **Unverified (fan wiki):** warmth comes mainly from fire items (campfires, candles). A roof stops them going out in the rain — [thegameswiki How to Make a Warm Habitat](https://thegameswiki.com/pokopia/wiki/how-to-make-a-warm-habitat)
- **Unverified (guide):** light-giving furniture includes candles and torches, which need a Pokémon with the Burn specialty to light, and electric lights, which need the Generate specialty — [Game8 EN How to Make a Bright Habitat](https://game8.co/games/Pokemon-Pokopia/archives/585695)
- **Unverified (guide):** humidity rises with water, hydrated plants, working fountains or sprinklers, a filled Water Basin, or Rain Dance — [thegameswiki Environment Level](https://thegameswiki.com/pokopia/wiki/environment-level); [Bulbapedia Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level)
- **Community (Q&A):** for habitats, lawn (しばふ) inside the habitat range makes it moist. Replace grass blocks with stone and keep ponds and rivers out to make it dry — [Yahoo!知恵袋 q10326340140](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10326340140)
- **Community (blog):** しめったいわ (damp rock) works for the moist condition, and さらさらいわ is suggested for dry — [piyo-piyo04 しめったいわ・つめたいいわの使い道](https://piyo-piyo04.com/2026/04/12/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%80%91%E3%81%97%E3%82%81%E3%81%A3%E3%81%9F%E3%81%84%E3%82%8F%E3%83%BB%E3%81%A4%E3%82%81%E3%81%9F%E3%81%84%E3%81%84%E3%82%8F/)
- **Community-tested:** the gamemos −1..+3 range is described for the "favourite environment" in general, not only light — [gamemos.net](https://gamemos.net/2026/04/10/post-140083/)

### Inferences
- Nothing suggests warmth or humidity use a different vertical band from light. The planner can apply the same −1..+3 band to all three, labelled as inferred.
- Grass or lawn blocks used as the floor (Y=0) may add humidity inside a block house, since Y=0 is in the band. This is untested for houses.

### Gaps
- The block-house Bright threshold, the kit Bright 40+ / dark ≤ 40 split, humid 100+ / dry ≤ 30 (block), 40+ / 60− (kit), and warm +60 / cool −60 could not be checked. They come from the ccopedia warmth and humidity pages and ぽこポケ学会, which could not be opened.

## 9. Patch changes

### Takeaway
No patch found changes the vertical range or daylight rules. Ver. 1.1.0 (June 2026) changed comfort values for two items and fixed bugs that made light comments and comfort readings unreliable. That may affect tests published before June 2026.

### Cited Findings
- **Confirmed (official notes, reported):** Ver. 1.1.0, released 9 June 2026 (some sources say 10 June), changed the comfort settings of the waterproof seat and stone fireplace "to feel more natural". It fixed comfort not rising after removing disliked items, made the Environment Level screen show which comfort requests were met that day, and fixed Pokémon commenting that it became darker or brighter when nothing changed — [Game8 EN 1.1.0 Patch Notes](https://game8.co/games/Pokemon-Pokopia/archives/605000); [Nintendo Life](https://www.nintendolife.com/news/2026/06/pokemon-pokopia-updated-to-version-1-1-0-includes-improvements-and-fixes); [Pokémon portal update notice](https://ph.portal-pokemon.com/topics/post-5960/)
- **Confirmed (reported):** Ver. 2.0.0 (4 August 2026, with the Bubbly Basin expansion) was mostly new content. The only environment-related change found was that recipes can be bought after raising Palette Town's environment level — [Kotaku 2.0 patch](https://kotaku.com/pokemon-pokopia-2-0-patch-notes-bubbly-basin-expansion-dlc-2000721906)
- **Unknown:** what Ver. 2.0.1 changed could not be pinned down from snippets — [PokeOS patch notes](https://www.pokeos.com/p/pokopia/patch-notes)

### Inferences
- The gamemos test (April 2026) and the ccopedia tests are from before 1.1.0. The fix for false "darker/brighter" comments means in-game remarks used as evidence before June 2026 may have been noisy, but the fix says nothing about the range changing.

### Gaps
- I found no post-2.0 re-test of the −1..+3 range, daylight formula or thresholds.
- I could not read the full official notes for 2.0.0 and 2.0.1.

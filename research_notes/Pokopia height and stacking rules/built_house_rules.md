# How Pokopia recognises player-built houses: height, walls and items placed on or inside walls

Source access note: the network for this session blocked direct page fetches from kyu49.github.io (ぽこポケ学会), altema.jp, gameranbu.jp and game8.jp. Findings from those sites, and from X posts, come from search-engine snippets and summaries of the pages, not from reading the full pages. Treat exact numbers from them as "reported by", and re-check them on the page once those hosts are allowed.

Labels used below:
- **Confirmed**: official Nintendo/The Pokémon Company text (patch notes) or in-game text/behaviour quoted by players.
- **Community-tested**: a named player or site that says it tested the rule.
- **Guide claim**: a strategy site states it without showing a test.
- **Unverified / Contradicted**: one weak source only, or sources disagree.

## 1. Basic recognition rules (enclosure, door, size, furniture, residents): checking the planner's assumptions

### Takeaway
The planner's core model is well supported: a house is an enclosed floor area of at least 2×2 with at least one door, and a Pokémon moves in once there are 3 or more different furniture kinds inside. The 9×10 / 10×9 (90-tile) interior maximum has the best direct test behind it, but other sites say 10×10, 72 tiles or 11×12/12×11. Some of these probably count the walls and some don't. "Up to 4 residents" for a built house did not get solid sourcing in this pass.

### Cited Findings
- [Community-tested] KYU, the author of ぽこポケ学会, gives the house conditions as: floor of 2×2 or more (1×4 does not count); enclosed by walls 1 block high or more; at least 1 tile of the wall is a door (2 doors OK); 2-tile doors OK; glass as the wall OK; "なんなら柵でもいい" ("even fences are fine"). — [KYU on X](https://x.com/kyuphd/status/2030234005325668475)
- [Community-tested] Another player defines a house as "最低1ブロックの高さの、ドアを含む繋がったブロックで囲まれている領域" ("an area enclosed by connected blocks at least 1 block high, including a door"). When the conditions are met, the same effect plays as when a habitat is completed. Blocks placed diagonally are not "connected", so diagonal corners break the enclosure. — [しばす on X](https://x.com/ShowBuyS/status/2030845662322131082)
- [Confirmed, in-game text reported by a player] When the player walks up to a recognised but empty built house, the game shows "ちかくの生息地あきや" ("nearby habitat: vacant house"). — [Yahoo!知恵袋 question](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181)
- [Confirmed, in-game message reported by a player] A player reports an in-game message saying Pokémon will not move in without 3 kinds of furniture, which appeared even after they had placed 3. — [Yahoo!知恵袋 question](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326601832)
- [Guide claim] To be lived in, a built house needs 3 or more *different* kinds of furniture; 3 copies of the same item do not count. — [gemukan](https://www.gemukan.com/pokoa-building-001/); [goccha-journal](https://goccha-journal.com/8814); [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/584771); [thegameswiki Dwellings and Houses](https://thegameswiki.com/pokopia/wiki/dwellings-and-houses)
- [Guide claim] The door must sit at the same level as the floor and connect to the interior space. — [gameranbu ブロック家の作り方](https://gameranbu.jp/pocoapokemon/14f93668b7e92ccf740d) (search summary)
- [Community-tested] Maximum floor area is 90 tiles (9×10 or 10×9); anything larger is not recognised as a house. — [ラプチュウ on X](https://x.com/abuzoad_dive/status/2035092286279942478); also stated by [altema](https://altema.jp/pocoapokemon/iehantei), [Game8 JP](https://game8.jp/pocoapokemon/768198) and [GameWith](https://gamewith.jp/pocoapokemon/547952) (10×9, "even 1 tile over is not a house")
- [Contradicted] Other maximums reported: 10×10 by [Nintendo Life](https://www.nintendolife.com/news/2026/03/video-how-to-build-a-real-house-in-pokemon-pokopia), [gameranbu](https://gameranbu.jp/pocoapokemon/eefb6571b7b8a7bdbaa2) and [game-shinden](https://game-shinden.com/pokoa-pokemon-house-building-guide-requirements/); "larger than 11×12 is not a house" by [Serebii building](https://serebii.net/pokemonpokopia/building.shtml); "probably a 12 wide × 11 deep enclosure" by [ねくすと on X](https://x.com/Next_gamer/status/2031298987429605435); a personal test giving 72 tiles by [lushgreengame](https://lushgreengame.com/pocopoke-kensyou-ookisa/) (search summary only).
- [Guide claim] To build bigger, split the interior into several rooms with internal walls. — [dokodeyomu](https://dokodeyomu.hatenadiary.com/entry/Pocoa_Pokemon_House_Determination)
- [Guide claim] Hand-built block houses do not count toward the area's 40-point building-kit limit. — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/584771) (search summary)
- [Unverified] One English guide says a custom house holds up to 4 Pokémon, but the search summary did not say which of [Vandal](https://vandal.elespanol.com/en/pokemon-pokopia/pokemon-pokopia-how-to-build-houses-and-buildings-and-invite-pokemon-to-move-in.html), [RankedBoost](https://rankedboost.com/pokopia/guides/how-to-build-houses/) or [Antberry](https://antberry.com/do-houses-need-furniture-in-pokopia-crafting-house-guide/) said it. lushgreengame has a page comparing resident counts ("住める人数") across house types, but the number could not be read. — [lushgreengame 家の比較](https://lushgreengame.com/pocopoke-house-hikaku/)

### Inferences
- The size limits probably agree once walls are counted. A 12×11 enclosure measured including the walls has a 10×9 interior, and "over 11×12" (Serebii) also fits a wall-inclusive count. So 9×10 / 10×9 interior (90 tiles) is the best-supported reading, and the planner's rule matches it. The 10×10 and 72-tile figures are outliers.
- Planner logic should treat diagonal-only corner joins as gaps in the enclosure.

### Gaps
- Built-house resident cap (planner says 4): no source could be read in full; needs ぽこポケ学会 or lushgreengame read directly.
- The exact in-game wording of the "3 kinds of furniture" message was not captured verbatim.

## 2. Wall height, what counts as a wall, and roofs

### Takeaway
Most sources, including the community testers, say walls only need to be **1 block high**, and **no roof is needed**: open-air houses work. Fences and glass count as walls, and natural terrain walls can work, though inconsistently. Several English guides say 2-block walls are required, but they show no test. No source defines a "roof" the way the planner does ("any block 2 or more above the floor"). Roofs matter for preferences (dark-loving Pokémon, rain putting out fires), not for being recognised as a house.

### Cited Findings
- [Community-tested] 1-block walls are enough; fences and glass work as walls; 2-tile doors work. — [KYU on X](https://x.com/kyuphd/status/2030234005325668475)
- [Community-tested] Definition: "最低1ブロックの高さ" ("at least 1 block high") enclosure with a door. — [しばす on X](https://x.com/ShowBuyS/status/2030845662322131082)
- [Guide claim] 1 block of wall height is enough, and the roof block is optional ("高さは1段以上必要（屋根の有無は自由）"). — [gameranbu](https://gameranbu.jp/pocoapokemon/14f93668b7e92ccf740d) (search summary)
- [Guide claim] Height and roof are not part of the conditions, so blocks and a door are all you need. Roofs and ceilings are only for looks. — [GameWith](https://gamewith.jp/pocoapokemon/547952); [Game8 JP](https://game8.jp/pocoapokemon/768198); [game-shinden](https://game-shinden.com/pokoa-pokemon-house-building-guide-requirements/) (search summary)
- [Guide claim] A building with no roof is still judged a house. — [altema](https://altema.jp/pocoapokemon/iehantei) (search summary)
- [Guide claim] Walls can be blocks or fences; 1 block high is enough; the space does not need to be closed overhead. — [Nintendo Life video article](https://www.nintendolife.com/news/2026/03/video-how-to-build-a-real-house-in-pokemon-pokopia); [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/584771)
- [Guide claim] A roof is only needed for Pokémon that like dark places; open-air houses are valid. — [thegameswiki Dwellings and Houses](https://thegameswiki.com/pokopia/wiki/dwellings-and-houses)
- [Contradicted] Claims that houses need "4 walls, 2 blocks high" and that "single-block walls are treated as fences, not house walls". — [pokopiahabitats comfort guide](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide); [RankedBoost](https://rankedboost.com/pokopia/guides/how-to-build-houses/); [Antberry](https://antberry.com/do-houses-need-furniture-in-pokopia-crafting-house-guide/). This conflicts with the tested 1-block rule and with KYU's "fences are fine".
- [Contradicted] One gemukan article says buildings without a ceiling may not be recognised and should be covered with roof blocks. It is a minority view that conflicts with the sources above. — [gemukan 屋根の作り方](https://www.gemukan.com/pokoa-building-033/) / [gemukan building guides](https://www.gemukan.com/pokoa-building-021/) (search summary)
- [Guide claim] Roofs help Pokémon that like dark habitats, and a roof stops rain putting out fires for Pokémon that like warmth. — [pokopiahabitats comfort guide](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide)
- [Guide claim] Roof items appear in the shop at environment level 5. — [GameWith 屋根の付け方](https://gamewith.jp/pocoapokemon/548162) (search summary)
- [Community-tested] Houses whose walls are all natural stone or terrain register inconsistently, and the player suspects the registerable area may be only 3 blocks high. — [GameFAQs "Open-Air Houses" thread](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81119471)
- [Community-tested] You can make a house from empty space: dig a pit 2 deep (its terrain walls act as walls), open a hole in the wall and place a door plus height-1 furniture ("家判定発生", house recognised), cover the floor with height-1 furniture, then fill it back in. — [エアルの中の人 on X](https://x.com/heal08426/status/2031607195864080596)

### Inferences
- The planner should accept 1-high walls, fences and glass as walls, and should not need a roof to recognise a house.
- The planner's "roof = any block 2 or more above the floor" is the planner's own convention, not a game rule anyone has documented. It would matter only for a "dark" or rain-shelter preference check, not for house recognition. No source says how much roof coverage counts as "dark".
- The buried-house trick suggests blocks directly above the interior, even at +1 over furniture, do not break recognition. So a "roof" at any height, or none at all, is fine for recognition.

### Gaps
- Pillars, hedges and windows were not covered by any source directly. Glass, from KYU, is the closest data point.
- No source defines the minimum roof coverage or roof height for the "dark" environment.
- Natural-terrain walls are only described as "inconsistent"; the cause is unknown.

## 3. Items placed on top of wall blocks

### Takeaway
**No source tests an item placed on top of a wall block directly.** One indirect data point matters: the tested range for favourite environment (light, humidity, warmth) excludes positions whose horizontal (XZ) square is a wall square. So a lamp on top of a wall probably does **not** count toward the room's environment. For furniture and favourites, the wider comfort area and the "Pokémon can reach it" rule apply, so wall-top items might count if they are reachable and within the height window. That is untested.

### Cited Findings
- [Community-tested] Favourite-environment range: with the floor block at Y=0, the effective range is Y=±0 to +3. It must be indoors, and "XZ座標が壁と重なる場合はダメ" ("not allowed where the XZ position overlaps a wall"). — [gamemos 自作ハウスの"好きな環境"に影響する範囲](https://gamemos.net/2026/04/10/post-140083/) (search summary)
- [Community-tested] Environment furniture such as light sources only counts within floor −1 to +3 and directly above and below the door. — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Community-tested] Furniture may be outside the house but must be accessible to the Pokémon. Height can differ from the house, but if the height or walking distance is too great, it is not recognised. — [KYU on X](https://x.com/kyuphd/status/2030234005325668475) (search summary)
- [Community-tested] Furniture the Pokémon cannot reach has no effect on comfort. — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Community-tested] A wall with a hole holding height-1 furniture plus a door still triggered house recognition (the buried-house method). — [エアルの中の人 on X](https://x.com/heal08426/status/2031607195864080596)
- [Guide claim] A Pokémon cannot use furniture smaller than itself. — [Yahoo!知恵袋 answer](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326601832) (search summary)

### Inferences
- Enclosure: nothing suggests that putting a decoration on a wall block makes the wall stop being a wall. Recognition only seems to check that a connected 1-high ring of blocks with a door exists, and blocks above (the buried-house trick) do not break it. Likely the wall stays valid. Untested.
- 3-furniture requirement: the requirement is "inside the house". An item on a wall top has its XZ square on the wall line, which gamemos says is not "indoors" for environment purposes. The safest rule for the planner is to **not count wall-top items toward the 3-kind requirement or the environment**, and to flag them as uncertain.
- Favourites and comfort: these use the wider area (4 tiles past the walls) plus reachability. A wall-top item could count if it is in the height window and a Pokémon can walk to it, which is unlikely on top of a wall unless steps lead up there. Mark as "may count if reachable".

### Gaps
- No source directly tests: (a) whether enclosure still holds with an item on a wall block; (b) whether a wall-top item counts toward the 3 kinds; (c) whether it counts for favourites or the comfort trio. All of this needs an in-game test or the full ぽこポケ学会 page.

## 4. Items on tables, shelves or counters, stacking, and how "kinds" are counted

### Takeaway
No source tests items placed on top of tables or shelves. Players report that small items (plant pots, storage-looking pieces) count only sometimes, that rugs and wall mirrors seem not to count as furniture, and that two different beds counted as one. That suggests "kind" may be a furniture category rather than a specific item. Furniture can also be "absorbed" when it forms a habitat (for example a picnic table set).

### Cited Findings
- [Guide claim / player reports] Duplicates of the same type are not counted; two kinds of bed were judged as one piece of furniture; rugs and wall-hung mirrors "apparently are not judged as furniture"; small items like plant pots and storage-looking items "sometimes pass, sometimes don't". — [goccha-journal 家扱いの意外な条件](https://goccha-journal.com/8814) (search summary)
- [Community report] A table, basket and chair together were recognised as the "ピクニックな食卓" (picnic table) habitat and stopped counting as furniture. Fix: re-place the furniture while the house is vacant. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181) (search summary)
- [Guide claim] The safest approach is 3 or more separate pieces such as a bed and a chair, then check that the room lights up (the recognition effect). — [goccha-journal](https://goccha-journal.com/8814) (search summary)
- [Guide claim] Pokémon take a while to notice newly placed furniture; comfort updates after time passes or after changing areas. — [Yahoo!知恵袋 answer](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326601832) (search summary)

### Inferences
- Vertical position inside the room should not matter as long as the item is within the indoor height window (see section 6). An item on a table is 1 to 2 levels above the floor, well inside +3. So by the tested height rules, a tabletop item should count the same as a floor item. It is not directly confirmed.
- Planner implication: count kinds by furniture category or tag, and be careful with rugs, wall-hung items and small potted decor in the 3-kind check. Furniture that forms a habitat set may be absorbed into that habitat.

### Gaps
- No direct test of tabletop or shelf items toward the 3 kinds or favourites.
- The goccha-journal rug/mirror and "two beds = one" claims are unverified single-source reports.
- How a "kind" is defined (exact item vs category or tag) is not documented officially.

## 5. Upper storeys, mezzanines and multi-storey built houses

### Takeaway
The game officially supports two-storey houses: Ver.1.1.0 added choosing the floor when moving a Pokémon in. One player reports that 2nd-floor furniture is judged the same as 1st-floor furniture. The tested height window, though, is only a few blocks: about 3 to 4 above the door or floor. Items 4 or more blocks above the floor of the room that has the door are probably outside the range. One player also reports a ~3-block-high registerable area.

### Cited Findings
- [Confirmed, official patch note] Ver.1.1.0 (10 June 2026): "ポケモンを2階建ての家に引っ越しさせる時に、室内でも引っ越し先のフロアを選べるようになった" ("when moving a Pokémon into a two-storey house, you can now choose the destination floor even indoors"). — [gamepedia Ver.1.1.0 summary](https://gamepedia.jp/pocoapokemon/archives/5597); official notice [pocoapokemon.jp news/89](https://www.pocoapokemon.jp/ja/news/89/); translation [op.gg news/89](https://op.gg/fi/pokemon-pokopia/news/89)
- [Community report] 2nd-floor furniture appears to be judged the same as 1st-floor furniture (Yahoo!知恵袋 answer; "not certain"). — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326049532) (search summary)
- [Community-tested] The registerable area of a house may only be 3 blocks high. — [GameFAQs thread](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81119471)
- [Community-tested] Lights on high ceilings tend to fall outside the top of the range and stop affecting the favourite environment. — [gamemos](https://gamemos.net/2026/04/10/post-140083/) (search summary)
- [Community report] Furniture placed lower than the door was not recognised; it was fixed by bringing the floor level up to the door. — [Yahoo!知恵袋 answer](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326601832) (search summary)

### Inferences
- For a built house with an upper floor or mezzanine, "inside" is decided by the height window relative to the door (section 6), not by "is it on a storey of the building". A mezzanine 2 to 3 levels above the door-level floor is probably counted; items 4+ above the floor are probably not. A true second storey would need its own enclosure and door to be a separate house. That is an inference, not tested.
- The Ver.1.1.0 floor picker suggests two-storey houses are tracked per floor. The patch notes do not say whether this means kit houses only or built ones too.

### Gaps
- No test found of a block-built two-storey house: whether each floor is its own house, or whether one door covers both floors.
- No source says whether the 2-storey floor picker applies to block-built houses.

## 6. Vertical and horizontal limits of the active area, and how height is measured

### Takeaway
The planner's "4 below to 3 above the door" matches ぽこポケ学会's tested rule (door height = 0, range −4 to +3). gamemos gives "Y=−3 to +4" with the floor block as Y=0, which is probably the same window measured from the floor block, one level below the door. The planner's "4 tiles past the walls" matches gamemos, which adds that a non-rectangular room is first expanded to its bounding rectangle. Favourite **environment** effects use a tighter window that must be indoors: Y=0 to +3 from the floor block, not over wall squares.

### Cited Findings
- [Community-tested] Furniture recognition: with the door's height as 0, items up to 3 above are reflected in comfort, and the recognised range is −4 to +3 from the door. — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Community-tested] If the door is within the 5th block from the ground surface, items on the ground surface are recognised ("地表から5マス目までに扉があれば、地表上のアイテムは認識される"). — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Community-tested] Comfort-affecting range: vertical Y=−3 to +4; horizontal +4 from the walls on all four sides. For non-rectangular rooms, expand to the bounding rectangle, then add +4. — [gamemos](https://gamemos.net/2026/04/10/post-140083/) (search summary)
- [Community-tested] Favourite-environment range: floor block Y=0, effective Y=±0 to +3, must be indoors, not where XZ overlaps a wall. A humidifier placed inside the frame but outside the door had no effect; moved inside, it worked. In environment terms there is no "light source strength". — [gamemos](https://gamemos.net/2026/04/10/post-140083/) (search summary)
- [Community-tested] Environment items (light sources etc.) only count within floor −1 to +3 and directly above and below the door. — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Guide claim] Items just outside the boundary line still count if the zones overlap. — [pokopia.center comfort guide](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/) / [pokopiahabitats comfort guide](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide) (search summary)
- [Guide claim] Each habitat has a fixed range where comfort changes apply; objects placed outside it have no effect. — [Game8 JP](https://game8.jp/pocoapokemon/768198) (search summary)

### Inferences
- **The two vertical figures likely agree.** gamemos puts Y=0 at the floor *block*, so the walking level and the door's base are at Y=+1. A door-relative window of −4 to +3 then equals a floor-block-relative window of −3 to +4. The planner's "4 below to 3 above the door" fits both, as long as "above the door" is counted from the door's bottom tile (the walking level).
- The planner's rule that favourites and furniture count anywhere in the area if reachable matches KYU and the comfort guides for furniture and favourites. It should be **refined for environment effects** (bright, humid, warm, cool, dark): those must be indoors, within about floor-block 0 to +3, and not on wall squares.
- The two environment windows differ slightly: gamemos says floor-block 0 to +3; ぽこポケ学会 says "floor −1 to +3", where "floor" may mean the walking surface. This may be a one-level difference in where each measures from. Without the full pages it cannot be settled.

### Gaps
- The full ぽこポケ学会 page could not be fetched, so the exact definitions of its "floor" and "door height" are not verified.
- The horizontal "+4 from walls" is from gamemos only. No second source was found, and ぽこポケ学会's horizontal number was not visible in snippets.

## 7. Does the game show the active area? In-game text

### Takeaway
Yes. Pressing the right stick (R) near a lived-in habitat or house shows its range as a white dotted line. This is a real in-game feature reported by several sites, but the outline may not appear where the ground height differs a lot from the house floor. Recognition itself gives visible feedback: the same effect as completing a habitat, and a "vacant house" (あきや) label.

### Cited Findings
- [Confirmed, in-game feature reported by guides] Press the R stick near a habitat to check the range; objects outside it have no effect. — [Game8 JP](https://game8.jp/pocoapokemon/768198) (search summary); also [Yahoo!知恵袋 answer](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12326601832) (search summary)
- [Community-tested] The comfort range shows as a white dotted line when you press the R stick while a resident lives there. It may not show if the surrounding height differs a lot from the house floor. — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/) (search summary)
- [Confirmed, in-game behaviour] Meeting the house conditions plays the same effect as completing a habitat. — [しばす on X](https://x.com/ShowBuyS/status/2030845662322131082)
- [Confirmed, in-game text] "ちかくの生息地あきや" shows near a recognised, empty house. — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11326926181)

### Inferences
- The planner's dotted-line overlay copies a real in-game display. The "may not display at big height differences" note suggests the in-game outline is drawn at about the floor's height.

### Gaps
- Exact in-game tutorial or help text describing the range was not found.

## 8. The comfort trio (rest / toy / decoration) and favourites

### Takeaway
Guides agree that relaxation (rest) items, toys and decorations raise comfort, and that items matching a Pokémon's favourites (shown in the Pokédex) matter most. No source confirms the planner's exact wording that a rest item, a toy and a decoration nearby make Pokémon "most comfortable". It is a reasonable summary of the guides, not a quoted rule.

### Cited Findings
- [Guide claim] Relaxation items (beds, chairs, sofas) directly boost comfort. Requested relaxation items, toys, decorations, food flavours or environment changes matter more than random furniture. Items matching Pokédex favourites raise comfort. — [pokopia.center](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/); [pokopiahabitats](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide); [thegameswiki Dwellings and Houses](https://thegameswiki.com/pokopia/wiki/dwellings-and-houses) (search summary)
- [Guide claim] A Pokémon whose habitat is in range of a recognised house gets a big comfort boost, often straight to 4 stars. — [pokopiahabitats](https://pokopiahabitats.com/guides/pokemon-pokopia-comfort-level-guide) (search summary)
- [Guide claim] Per-item comfort tags: Serebii's item list and PokoTraqr. Bulbapedia has a Comfort level article. — [Serebii items](https://www.serebii.net/pokemonpokopia/items.shtml); [PokoTraqr](https://www.pokotraqr.com/guides/decoration-furniture-guide); [Bulbapedia Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level)
- [Confirmed, official patch note] Ver.1.1.0 fixed the comfort settings for "ふろばのいす" (bath chair) and "いしのだんろ" (stone fireplace). — [gamepedia Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597)

### Inferences
- The planner should treat "rest + toy + decoration" as guide wisdom, not a hard rule. The tested range rules from section 6 decide which of those items are "nearby".

### Gaps
- The Bulbapedia and Serebii comfort pages were not read in full, so their exact wording on the trio was not captured.

## 9. Patches and versions

### Takeaway
No patch was found that changes house-recognition rules (walls, door, size, furniture count, range). Ver.1.1.0 (June 2026) added floor choice for two-storey houses and fixed comfort values. Ver.1.1.1 came out 19 June 2026. Ver.2.0.0 (August 2026) lets residents return if a broken habitat is rebuilt nearby.

### Cited Findings
- [Confirmed] Ver.1.1.0, 10 June 2026: floor choice when moving into two-storey houses; Pokémon prefer workstations near their home; comfort fixes for ふろばのいす and いしのだんろ; partner Pokémon share chairs and beds; electric item limit 512 to 1024. — [gamepedia](https://gamepedia.jp/pocoapokemon/archives/5597); [op.gg news/89](https://op.gg/fi/pokemon-pokopia/news/89)
- [Confirmed] Ver.1.1.1 released 19 June 2026. — [gamepedia](https://gamepedia.jp/pocoapokemon/archives/5597)
- [Guide claim citing official notes] Ver.2.0.0: if you break a habitat and rebuild the same one within a set range, residents move back in. — [gamemos Ver.2.0.0](https://gamemos.net/2026/08/07/post-146324/) (search summary)

### Inferences
- The community-tested house rules (mostly March to April 2026) have probably not been changed by later patches, but no source re-tested them after Ver.2.0.0.

### Gaps
- No post-Ver.2.0.0 re-test of the range or size rules was found. The full Ver.2.0.0 notes were not read.

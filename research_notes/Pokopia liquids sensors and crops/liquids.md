# Pokopia liquids: types, flow, interactions, environment values and placement rules

Scope and method. Researched 22 Nov 2026. The game is at Ver. 2.0.0 (5 Aug 2026; Bubbly Basin / ブクブクうみぞこ expansion and Dive). GameWith's liquid pages were updated 19–23 Nov 2026 and Game8 JP's water-source page on 22 Nov 2026, so they describe the current version. Pages read in full with curl: ぽこポケ学会 (kyu49) water, limits, circuit-items, harvest, house, design and misc pages; Serebii water, patch-notes, dive, habitats and habitat-dex pages; GameWith pages on water sources (水源), waterfalls (滝), hot springs (温泉), muddy water (泥水), lava (マグマ), Water Gun (みずでっぽう), black rock (くろいいわ), magma rock (マグマいわ) and the Ver. 2.0.0 notes; Game8 JP pages on water sources, humidity, sprinklers and underwater farming; Game8 EN humidity; and the ccopedia (note.com) humidity and warmth tests. These hosts could not be fetched (DNS block or proxy 403): wikipokopia.com, pokopiawiki.com, insider-gaming, rankedboost, thegameswiki (Vercel checkpoint), Bulbapedia, GameFAQs, Yahoo!知恵袋, hatenablog blogs, x.com, games.gg, siliconera, vandal, appmedia and dexerto. Claims from those come only from search-engine summaries and are marked "(search summary)".

Labels used: **Official** = Nintendo patch notes or in-game text; **Community-tested** = a named tester or a site's own measured test; **Guide** = a guide states it with no test shown; **Unverified** = search summary only, a single forum user, or an internally inconsistent page.

## 1. Which liquids exist, and how each is obtained, placed and removed

### Takeaway
There are **five placeable liquids**: Water (みず), Ocean water (うみのみず), Muddy water (どろみず), Hot-spring water (おんせん) and Lava (マグマ). **Waterfall (たき) is not a separate liquid.** It is the state of any liquid falling over a drop. The "4 liquids" the user mentions most likely means the four water-family liquids, which ぽこポケ学会 ranks against each other as 泥水 > 海水 > 温泉 > 水. Lava is handled separately: it has half the reach, no hydration, and it hurts Ditto. No honey, poison or oil liquid exists. Every liquid is collected and placed with Ditto's ちょすい (Suck / Stockpile Water), either from a natural pool or from a vending-machine drink. Removing the tile where the liquid was spat out (by sucking it up or covering it with a block) removes the whole flow.

### Cited Findings
- **Official (in-game list via Serebii):** "There are five different kinds of water in the game." Serebii's table lists each with its drink:
  - Water: "Standard water. Allows for Sparkling Ripples to appear". Drink: Fresh Water.
  - Ocean Water: "Sparkling sea water. Ripples cannot appear here". Drink: Soda Pop.
  - Muddy Water: "Ripples cannot appear here. Does not hydrate the area". Drink: Moomoo Milk Coffee.
  - Hot Spring Water: "Pokémon may enter pools of this to relax. Ripples cannot appear here". Drink: Roserade Tea.
  - Lava: "Does not hydrate the area. Damages Ditto if touched. Use Water Gun on the Lava to turn it into Black Rock". Drink: Chili Sauce.
  — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide:** the same five sources and drink mappings: おいしいみず→みず, サイコソーダ→うみのみず, モーモーミルクコーヒー→どろみず, ロズレイティー→おんせん, チリソース→マグマ. "5種類の水源はフィールド上で入手することができます" (the five liquids can be found in the field). — [GameWith 水源の作り方 (updated 2026-11-21)](https://gamewith.jp/pocoapokemon/547853)
- **Guide, natural locations by town:**
  - みず: Withered Wastelands (パサパサこうや), Rocky Ridges (ゴツゴツやま), Bleak Beach (ドンヨリうみべ), Sparkling Skylands (キラキラうきしま) and Palette Town (まっさらな街).
  - うみのみず: Withered Wastelands, Bleak Beach and Palette Town.
  - どろみず: Bleak Beach only, opposite the Pokémon Center.
  - おんせん: Rocky Ridges only, in the left-hand cave.
  - マグマ: Rocky Ridges only, in the central cave behind wire mesh that needs the powered-up Cut.
  — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208); [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909); [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922)
- **Community-tested:** four water-family liquids have a priority order, which the editor marks as uncertain: "編集者がよく分かってないけど、泥水 > 海水 > 温泉 > 水らしい" (the editor isn't sure, but apparently muddy > ocean > hot spring > water). Lava is not in this list. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Guide, waterfall as a state:** "水が上から下へ流れている場所が滝として扱われます" (a place where water flows from top to bottom counts as a waterfall). A waterfall "cannot be carried" and must be built in each area. — [GameWith 滝 (updated 2026-11-22)](https://gamewith.jp/pocoapokemon/549075)
- **Unverified (search summary of wikipokopia/rankedboost):** waterfalls can be made from any liquid type, including seawater, hot-spring water and lava. — [wikipokopia Water Mechanics](https://wikipokopia.com/guides/water) (search summary). This is consistent with ぽこポケ学会's lava-waterfall item lift (see section 6).
- **Guide, learning ちょすい:**
  1. Progress Piplup's (ポッチャマ) requests in Bleak Beach after its story.
  2. Build Marshy tall grass (沼地の草むら: きいろのくさ×4 + どろみず×2) with the muddy water near the waterfall.
  3. Befriend Paldean Wooper (パルデアウパー).
  4. Give it 3 tomatoes. The nearby field yields them once a wall is broken so that water reaches it.
  — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [Game8 JP 水源 (updated 2026-11-22)](https://game8.jp/pocoapokemon/768146)
- **Guide, controls:** hold Y (inhale) and press ZR while in or next to a liquid to store it. Press A to spit it out, which creates a source. ZL + D-pad adjusts the water level. B swallows the stored liquid and destroys it. Using a vending-machine drink stores its liquid instantly. You cannot change map (area) while holding a liquid. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [Game8 JP 水源](https://game8.jp/pocoapokemon/768146)
- **Guide:** you do not need to be inside the liquid. "Hold Y to suck in and press ZR and it will suck in any nearby water, sometimes even removing it." Once stored, "you get an infinite amount of spit outs." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Official, Ver. 2.0.0 (5 Aug 2026):**
  - "「ちょすい」する時に、短くわざボタンを押すと、水などの液体を取り除かず口に含められるようにしました" (a short press now holds the liquid in the mouth without removing it from the environment).
  - "「ちょすい」ではきだす時に調整できる水位を、自動的に周囲の水位に合わせるようにしました" (the adjustable water level now automatically matches the surrounding water level when spitting).
  — [GameWith Ver.2.0.0 notes](https://gamewith.jp/pocoapokemon/547086); English wording in [Serebii Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide, vending machines:** each powered machine gives one random drink per day. Withered Wastelands has 2 (by the windmill, top right). Bleak Beach has 2 by the waterwheel and 3 on the S.S. Anne. The shop sells 1. Sparkling Skylands has 3 in the big building (floors 1–3) once it is built. Machines run on a generator and utility poles. — [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208); [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922)
- **Guide, removal:**
  - "液体を吐き出した場所(マス)を再度吸い込むと消すことができます。一度作った水源は自然に消えることはありません" (suck up the tile where you spat the liquid to remove it; a created source never disappears on its own).
  - "液体を吐き出した場所(マス)に上書きするようにブロックを設置すると、水源が消えます" (placing a block over that tile also removes the source).
  — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Guide:** "大元となった水源を貯水で吸い込むと消せます…水源さえ消せば水を引かせることができます" (suck up the original source and the water recedes). — [Game8 JP 水源](https://game8.jp/pocoapokemon/768146)
- **Guide:** "Primary source: … Remove this and all the water will vanish." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide, filling holes:** if sucking leaves a hole, spitting the liquid back at the same spot repairs it. A pier lets you reach the sea surface to do this. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Guide, Water Gun (みずでっぽう) is not a liquid source.** It sprays a cross-shaped area of water. It revives dried soil and withered plants and flowers, puts out fires, and "マグマをみずでっぽうで冷やすことで、足場を作ることも可能です" (cools lava to make footing). Cooking (main ingredient おいしいみず) powers it up: ZR can be held to charge, which widens the area. — [GameWith みずでっぽう (updated 2026-11-19)](https://gamewith.jp/pocoapokemon/547665)
- **Guide:** "Lava. Does not hydrate the area. Damages Ditto if touched." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide:** touching lava makes Ditto recoil. Falling onto it fades the screen to black and returns Ditto to nearby footing. — [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922)
- **Unverified (search summary):** an English wiki says a 2×2 pit filled with liquid becomes "a permanent, self-replenishing water source that refills when scooped", and that smaller pools may drain permanently. — [thegameswiki Water Sources and Waterfalls](https://thegameswiki.com/pokopia/wiki/water-sources-and-waterfalls) (search summary). This reads like Minecraft's rule, and no Japanese source or Serebii supports it.

### Inferences
- The planner's six liquid terrains should become **five liquid types** plus a **falling flag**. "Waterfall" should be a derived state of any liquid tile that falls, not a material. One exception: habitats ask for "たき×1", so the planner still needs a "waterfall present" check, satisfied by any falling column. Whether lava, ocean or hot-spring falls satisfy a habitat's たき is untested (see Gaps).
- Since Ver. 2.0.0 the short press makes any liquid tile an **infinite source to copy from**. Before 2.0.0 every suck removed liquid. Vending drinks are effectively infinite per mouthful, per Serebii.
- A liquid's identity is its source tile. The planner can model each liquid body as one or more source tiles (where the player spat) plus derived flow tiles. Deleting a source deletes everything that depends on it.

### Gaps
- No source says whether one mouthful from a drink can be spat repeatedly, or whether each spit uses it up. Serebii says "infinite"; GameWith only warns that B swallows it.
- I found no limit on how many liquid sources can exist. ぽこポケ学会's limits page lists none for liquids. One guide says "水源の数に明確な制限はありません" (no clear limit on the number of sources) per a search summary of [gemukan](https://www.gemukan.com/pocoapokemon-kouryaku-002/).

## 2. Flow and spread: sources, distances, levels, cliffs, holes, draining

### Takeaway
Liquids spread from a **primary source**, the tile where you spat. They do not drain or evaporate. Fixed reach in tiles:

| Liquid and level | Along a 1-wide trench (source + flow) |
|---|---|
| Water-family, normal level | 25 |
| Water-family, low level | 12 |
| Lava, normal level | 12 |
| Lava, low level | 6 |

On open flat ground, liquid forms a rough circular puddle about 6 tiles in each direction. Wider channels shorten the reach: 2 wide reaches only 10. A drop (waterfall) resets the count, because the landing tile acts as a **secondary source**. A normal-level source within 4 tiles of a drop beelines to the drop in a straight 2-wide line instead of spreading. Low-level liquid never does this. Flow passes diagonal gaps between two blocks, so it moves in 8 directions.

### Cited Findings
- **Community-tested:**
  - "マグマ以外は25マスまで届く。水位を下げると、12マスまで届く。マグマは12マスまで届く。水位を下げたマグマは6マスまで届く。滝を作るとリセットされる" (everything except lava reaches 25 tiles; lowered level 12; lava 12; lowered lava 6; making a waterfall resets it).
  - A lowered-level liquid has half the flow strength of the original.
  — [ぽこポケ学会 水の仕様 (notes dated up to 2026-04-05)](https://kyu49.github.io/Pokopia/water/)
- **Guide:**
  - On flat open ground with no drops or walls nearby, water "will spread out in a puddle leading out in a circle in 6 tile directions."
  - "Lava … goes half the distance and move[s] a lot slower."
  - In a walled trench, "the distance it can go from one drop of water is basically 25 blocks along a trench, or 12 blocks for Lava. However, for each side that it goes off, it will decrease in length by two until it's around a 6x6 area."
  - "It can also go through small diagonal gaps when there is a diagonal gap between two bricks, meaning it can flow in all 8 directions as long as the adjacent tile is a gap off the same level as it."
  — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide, low level:** "when you drop down the water and lava, it will take up half the amount of space. This means the puddle for water will only be in a circle 7 blocks wide, or for Lava it will only be 5 blocks wide. When going through a trench, the furthest distance it will go is 12 blocks for water and 6 for lava." Low-level water "will never aim for the nearest cliff … it will spread out in a circle". Secondary sources below it are also low level. — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide, sources:**
  - "Primary source: This is from where all the water begins. Remove this and all the water will vanish."
  - "Secondary source: After a drop and the water hits the ground, it will act as a secondary source … removing it will not permanently remove the water. If a bit of water goes 23 blocks, hits a drop and then starts again, it will act fresh."
  — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide, cliffs:**
  - "If you place a water source within 4 spaces of a cliff, or a drop of any sort, rather than the water spreading out … the water will instead go towards that drop … take two blocks width to hit it. This causes a complete straight line with the water and it will not spread out."
  - "If there are multiple different drops equidistant to the water source, then it will go to all of the drops at the same time."
  - Lava instead "will start to go to the drop, but then on the second tile, it will start to spread out again … creating a small puddle", which "doesn't wrap back round to behind the primary source". Because of this, lava can reach more drops and surface than water despite its shorter range.
  — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Community-tested (guide's own measurement), channel width:**

  | Channel width | Distance on the level | Distance after a step down |
  |---|---|---|
  | 1 | 25 (source 1 + flow 24) | 24 |
  | 2 | 10 (source 1 + flow 9) | 9 |
  | 3 | not given | 9 (2 or more wide) |

  Trick: dig a 1-wide channel, let the water flow, then widen it; the wide channel keeps the 1-wide distance. Building the step before or after the water flows changes the side columns' reach by 1 tile. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Community-tested:** "水は埋め直すことで挙動が変わる" (refilling water changes its behaviour). This is the same order-dependence, stated tersely. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Unverified (search summary):** in one test, a 1-wide channel stopped at tile 24 and a 2-wide one at tile 9. Stepping the channel down at tile 24 carried the water to tile 48. — search summary of [ポケモナンザ](https://pokemonza.hatenablog.jp/entry/2026/03/12/014042) / [ゲーム乱舞](https://gameranbu.jp/pocoapokemon/a79796eb145044c10d29). The page could not be fetched.
- **Guide:** a waterfall forms from "1マス以上の高低差" (a height difference of 1 or more). — [GameWith 滝](https://gamewith.jp/pocoapokemon/549075). This contradicts gamepedia's "最低5マス分の高さが必要" (needs at least 5 tiles of height) for a habitat waterfall, recorded in this repo's `research_notes/Pokopia height and stacking rules/gaps_full_reads.md` from [攻略大百科](https://gamepedia.jp/pocoapokemon/archives/4039). The two may answer different questions: whether any fall renders, or whether a fall counts for a habitat.
- **Guide:** enclosing a source on all sides stops it spreading, so open one side as an outlet. Flow strength mostly happens at the moment of spreading; once filled, water behaves like a still pool, and items left there just float. — search summary of [ポケモナンザ](https://pokemonza.hatenablog.jp/entry/2026/03/12/014042) and [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10326952015) (Unverified)
- **Guide, no evaporation:** "一度作った水源は自然に消えることはありません" (a created source never disappears on its own). — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Unverified (search summary of a forum user):** lava makes a smaller puddle on flat ground, spreads more diagonally, and "will leak from cracks that normal water won't". — search summary citing [GameFAQs](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81126704)
- **Guide:** "When you place water down … it will need to be attached to something to start such as being next to a block or another bit of water." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)

### Inferences
- A simulator can treat spread as a breadth-first flood from each source with a **budget**. Same-level 1-wide steps cost 1 from a budget of 24 (water) or 11 (lava); low level halves both, to 11 and 5. Extra open sides shorten the reach by 2 per side, to a floor of about 6 tiles. The budget resets at each drop, where the landing tile becomes a new source of the same liquid and level. Serebii's 6-tile circle and GameWith's 2-wide 10-tile figure fit a budget that is shared or divided across the open frontier, not a pure Manhattan radius. Exact width behaviour is order-dependent, so the planner should validate ("this channel may stop at ~N tiles") rather than promise exact shapes.
- Cliff-seeking: within 4 tiles of a drop, a normal-level water source sends a straight 2-wide run to the nearest drop or drops and does not spread elsewhere. That is easy to flag in a planner.
- Water can leak through two blocks that touch only at a corner (sections 2 and 5), so a planner check for "watertight walls" must test the 8 neighbours, not 4.
- No source mentions a time to spread for water. Lava is "a lot slower" (Serebii). Liquids never drain, so time can be ignored for validation.

### Gaps
- No exact spread rate (tiles per second) for water or lava.
- No exact rule for how width cuts distance beyond 1-wide (25) and 2-wide (10). 3-wide on the level is blank in GameWith's table.
- No source gives how far a secondary source at the bottom of a waterfall spreads compared with the original. Serebii says "act fresh", meaning the full distance.
- The minimum waterfall height that counts for a habitat is disputed: 1 (GameWith) against 5 (gamepedia).

## 3. Interactions: liquid + liquid, + blocks, + plants, fire, Pokémon, player, items

### Takeaway
- **Water on lava** (Water Gun, and reportedly flowing water) solidifies it into a walkable rock block. Most sources call it くろいいわ (black rock); one blog says マグマいわ. The lava source keeps flowing, and can flow over the new rock, until the source itself is sucked up or covered.
- **Water flowing over mud-covered blocks** turns everything downstream into muddy water.
- **Liquid against liquid:** a flowing liquid overwrites another flowing liquid, with priority roughly muddy > ocean > hot spring > water. A source tile can never be overwritten by another liquid.
- Water puts out fire. Submerged plants stop growing. Items float and are carried by flow, and a waterfall lifts them up to 14 tiles. Lava hurts Ditto. No sources describe any other hot-spring creation recipe, freezing, or lava burning plants.

### Cited Findings
- **Guide:** "Use Water Gun on the Lava to turn it into Black Rock." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide:** Water Gun cools lava to make footing. — [GameWith みずでっぽう](https://gamewith.jp/pocoapokemon/547665)
- **Guide, a separate block conversion:** Water Gun on the block マグマいわ (magma rock) turns it into くろいいわ: "マグマいわに「みずでっぽう」を使ってしまうと「くろいいわ」という別のブロックに変化してしまうので注意しましょう". The くろいいわ description: "火山によくあるゴツゴツの岩。元々はアツアツのマグマだった。" (a craggy volcanic rock; it was originally hot magma). — [GameWith マグマいわ](https://gamewith.jp/pocoapokemon/548417); [GameWith くろいいわ](https://gamewith.jp/pocoapokemon/550903)
- **Unverified (search summary of a blog):** water skills or water blocks touching magma turn it into a black マグマいわ, and while the original lava source remains it keeps spreading slowly. — [ぶらりネット下車の旅](https://news.tcg-bloglife.com/entry/2026/04/24/120122) (search summary; this conflicts on the block name)
- **Unverified (search summary, X post):** splashing water carelessly lets lava flow over the solidified lava and flood the area again. — [@kanipan666 on X](https://x.com/kanipan666/status/2035220147460612557) (search summary)
- **Unverified (search summary, Yahoo!知恵袋):** "水かけましょう。固まって黒岩になります" (pour water and it hardens into black rock). Solidifying near the outflow point makes the downstream lava disappear too; another answer says to suck the lava up near its source. — [知恵袋 q13326798233](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13326798233); [知恵袋 q13327250828](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13327250828) (search summaries)
- **Unverified (search summary of a forum user):** lava "only turns to black rock if you remove the water source first". — search summary citing [GameFAQs](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81126704)
- **Unverified (search summary):** Water Spray turns lava into a solid block that Rock Smash can mine, and covering a whole lava area this way stops lava appearing there. Blocking the lava source stops it spreading. — [Insider Gaming](https://insider-gaming.com/pokemon-pokopia-make-lava/); [pokopiawiki](https://www.pokopiawiki.com/guides/how-to-make-lava-pools-and-streams) (search summaries)
- **Community-tested:** "泥がついたブロック, こんもりどろなどの上に水を通すと、その下流が泥水になる" (pass water over a mud-covered block or a mud mound and everything downstream becomes muddy water). こんもりどろ can't be picked up even with Magnet Rise, but the camera's object mode plus a 3D printer can make one. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Guide:** "Any water placed near other water that would flow after it replaces the water. For example if you put Ocean Water on a cliff above Fresh Water, it will overwrite some of the Fresh Water. If you then remove the Fresh Water, it will then take the area for the Ocean Water. However, you cannot directly overwrite water sources with any other water." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide:** "If a plant is submerged, it will no longer grow while under water. Fire will also be put out." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Guide:** a crop next to water grows without being watered. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Unverified (search summary):** one water tile near a vegetable field is enough, and a field beside water needs no watering for 2 rows. — search summary of [Game8 JP 農業](https://game8.jp/pocoapokemon/767639)
- **Community-tested:** items in flowing water move with it. Items sent from strong-flow water into weak-flow lava move into the lava. A waterfall moves items upward. "長い滝を作っても、アイテムは14マスまでしか浮かび上がらない" (however long the waterfall, items rise only 14 tiles); at 14 they can be handed to another waterfall. A low-level liquid has half the flow strength, so the waterfall need not be lava. Floating weed (うきくさ) also rises, carrying a Ditto standing on it. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Community-tested:** crops being washed along snag even on withered crops. — [ぽこポケ学会 畑](https://kyu49.github.io/Pokopia/harvest/)
- **Community-tested, floating weed and draining:** put floating weed on water 2 or more deep, then drain the water with ちょすい. The weed stays in mid-air with footing, which gives an aerial walkway. Its height follows the water only within its own tile, so it can never float more than 1 tile up. Furniture can't be put on it; dropped items can, but flow may carry them off. — [ぽこポケ学会 デザイン](https://kyu49.github.io/Pokopia/design/)
- **Community-tested, sensors:**
  - Sensors react to "全てのポケモン、メタモン、液体、一部の家具類" (all Pokémon, Ditto, liquids and some furniture).
  - When water passes through some doors or fences, sensors stop detecting it. When the water leaves the door, every sensor that had detected it fires at once. Sensors more than about 5×5 or 6×6 map cells away (1 map cell = 8×8 tiles) are left out of that burst.
  — [ぽこポケ学会 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/); [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Community-tested:** smooth rock (さらさらいわ) stops in rain or sprinkler spray and restarts at once when they end. It fails to restart near a clock circuit, because a liquid that is spreading (伸展) nearby prevents restart in nearby map cells. Unresolved as of 2026-04-05. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Guide, hot spring and Pokémon:** "Pokémon may enter pools of this to relax." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml). A blog says Pokémon do not enter a plain hot spring until a hot-spring spout (ゆぐち) is placed: "そのままではポケモンは入らない・「ゆぐち」を設置すると入ってくれる" — search summary of [ゲーム館](https://www.gemukan.com/pocoapokemon-kouryaku-002/) (Unverified).
- **Official, Ver. 1.1.0 fix (9 Jun 2026):** "Fixed an issue where Pokémon did not react to the hot spring in the hot-spring shower habitat." — [Serebii Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Official, Ver. 2.0.0 fix:** "Pokémon that dislike water may sometimes be unable to move across duckweed and flowering duckweed on the water's surface." Suicune and Gholdengo could not travel across water before. — [Serebii Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide:** Moss and Duckweed can be created on water (Duckweed on water) with Leafage. — [Serebii: Ditto's Abilities](https://www.serebii.net/pokemonpokopia/abilities.shtml)

### Inferences
- For a planner: a lava tile next to water should be flagged "will be turned to rock if Water Gun hits it, and may re-flood while its source exists". An automatic water+lava → rock conversion should not be simulated, because evidence that flowing water converts lava is weak.
- Mud is a contaminant: a water path crossing a mud block should turn the downstream tiles into Muddy water, which changes which habitats it satisfies.
- When liquids meet, keep both sources. The flowing tiles go to the higher-priority liquid: muddy > ocean > hot spring > water (uncertain). Lava's place in that order is unknown.

### Gaps
- No source on ice and water (freezing) or lava and ice; no source on lava burning grass, trees or wooden items. Searches in Japanese and English found nothing.
- No source on how lava and the four water-family liquids rank when their flows meet (only that Water Gun solidifies lava).
- Whether Water Gun on lava gives くろいいわ (Serebii) or マグマいわ (one blog) is unresolved.
- Whether water carries muddiness upstream, or whether muddy water can be cleaned, is unknown. Game8 EN's claim that ocean water cleans mud off beaches appeared only in an AI search summary and was not found on any page, so it is dropped.

## 4. Environment effects (humidity, warmth, light) and habitat requirements

### Takeaway
The planner's values are right for the tested liquids:

| Liquid tile | Humidity | Warmth |
|---|---|---|
| Water | +20 | 0 |
| Muddy water | +20 | 0 |
| Hot-spring water | +20 | +30 |
| Waterfall (per cell) | +20 | 0 |
| Lava | none | +60 |
| Ocean water | untested, "probably" +20 | — |

These were measured by ccopedia in Oct 2026, after 2.0.0. Liquids have **no radius**: each tile counts only if it sits inside the counted zone.
- Built house: floor columns from −1 to +3, door cells included, walls and outside excluded.
- Habitat: ±4 vertically for humidity, −1 to +3 for warmth.
- Kit house: liquids cannot be placed inside.

Serebii's "does not hydrate" for muddy water refers to watering ground and plants, not to these humidity points. Several habitat liquid counts differ between sources. Two of them conflict with the planner's data: Training waterfall needs Water ×2, and Marsh fishing spot needs Muddy water ×1 or ×2.

### Cited Findings
- **Community-tested (ccopedia, 2026-10-14):**
  - "うるおい20　※アイテムについては、動作しているかどうかは関係無い　みず　どろみず　おんせん　たき　シンク　トイレ　せんめんだい　シャワー" (humidity 20: water, muddy water, hot spring, waterfall, sink, toilet, washbasin, shower).
  - "調べてないけど恐らくうるおいポイントがあるであろうアイテム：うみのみず、ギャラドスふんすい、アシレーヌぞう" (not tested but probably have humidity: ocean water, Gyarados fountain, Primarina statue).
  - A hydro generator has no points itself; the flowing water tiles count as water.
  — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested (ccopedia):**
  - "滝も水と同様、1マスにつきうるおい20" (a waterfall counts 20 per cell, like water).
  - In a habitat (±4 vertical), a waterfall with a drop of 5 or more reaches 100 by itself. In a block house (−1 to +3) only 4 cells of a waterfall can count, so 80 at most.
  - The landing splash is an ordinary 20-point cell.
  - Water under the walls or outside doesn't count; water under the door does.
  - Water dug 1 below the floor counts; 2 or more deep doesn't.
  — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested (ccopedia, 2026-10-05):**
  - "温度30　おんせん　アツアツいわ" and "温度60　マグマ…" (warmth 30: hot spring, Heat Rock; warmth 60: magma).
  - "マグマは1マスで温度ポイント60を持つため、1マス存在するだけで「暖かくなった✅」" (one lava tile alone makes a home warm, since the threshold is +60).
  - Lava or hot springs one tile outside the wall, lava in a trench under the wall, and magma-rock wall blocks do not count.
  - "キット家の場合も…マグマや温泉、ブロック類は使用できない" (in kit houses lava, hot springs and blocks can't be used).
  — [ccopedia あたたかい・すずしい](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested (ccopedia):** in kit houses "ブロックや水などの自然現象を設置できない" (blocks and natural features such as water can't be placed). — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested (ccopedia):** the Slowpoke yawn humidity score (ヤドンのあくび) is not only these points. "ミニマップに描画される草地や水の総面積とかも関係あるらしい" (the total area of grass and water drawn on the minimap apparently matters). — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Guide:** "Whether it's fresh water, ocean water, hot-spring water, or muddy water, any water tiles should contribute to a more humid habitat." If humidity is stuck at 71 during the Slowpoke request, progress the quest by talking to the Pokémon involved. — [Game8 EN How to Raise Humidity](https://game8.co/games/Pokemon-Pokopia/archives/584829)
- **Guide:** muddy water and lava "Do[] not hydrate the area". — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml). This conflicts on its face with ccopedia's measured +20 for muddy water. Hydrating means wetting dry ground and plants, a different effect.
- **Community-tested:** ぽこポケ学会's house tip: "家の中にちょすいで水を直接入れてやると効率よく上がる" (pouring water straight into a house with ちょすい raises humidity efficiently). — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- **Guide, light:** Serebii's table says Water "Allows for Sparkling Ripples to appear". The other four liquids don't allow them. Sparkling ripples (水辺のキラキラ) drop items and recipes such as the sprinkler. — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml); [Game8 JP スプリンクラー](https://game8.jp/pocoapokemon/769157). No source gives light values for lava or any liquid; ccopedia's light list has no liquid.
- **Guide and Official data, habitats needing liquids:**

  | Habitat | Requirement | Source |
  |---|---|---|
  | 修行の滝 Training waterfall | Seat 1, Water **2**, Waterfall 1 | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/trainingwaterfall.shtml); [GameWith 滝](https://gamewith.jp/pocoapokemon/549075). Vandal lists Water ×1 (search summary) |
  | 水力はつでん所 Waterwheel spot | Hydro generator 1, Water 2, Waterfall 1; the generator goes on the water surface below the fall | [GameWith 滝](https://gamewith.jp/pocoapokemon/549075) |
  | 照らされた滝 Illuminated waterfall | Stepping stones 3, Torch 2, Water 3, Waterfall 1 | [GameWith 滝](https://gamewith.jp/pocoapokemon/549075) |
  | 温泉の洗い場 Hot-spring shower | Shower 1, Seat 1, Hot spring 2 | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
  | コケむす温泉 Mossy hot spring | Moss 4, Hot spring 2 | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
  | 露天風呂 Open-air bath | Hot-spring spout 1, Hot spring 2 | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
  | ととのう温泉 Harmonious hot spring | Spout 1, Water basin 1, Hot spring 2 | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
  | 温泉釣り Hot-spring fishing spot | Rod 1, Seat 1, Hot spring 1 | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
  | マグマでアツアツ Piping-hot lava | Heat Rock (アツアツいわ) 1, Lava 2 | [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922) |
  | マグマ釣り Magma fishing spot | Rod 1, Seat 1, Lava 1 | [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922); [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/magmafishingspot.shtml) |
  | 沼地の草むら Marshy tall grass | Yellow grass 4, Muddy 2 | [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
  | 沼釣り Marsh fishing spot | Rod 1, Seat 1, Muddy **2** | [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
  | 沼釣り Marsh fishing spot | Rod 1, Seat 1, Muddy **1** | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/marshfishingspot.shtml) |
  | たのしい泥遊び Muddy playtime | Windup Inkay 1, Towel rack 1, Floating logs 1, Muddy 2 | [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
  | どろんこスパ Muddy spa | Seat (long) 1, Gyarados fountain 1, Bath set 1, Muddy 2 | [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
  | Fishing pond | Rod 1, Seat 1, Water 1 | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/fishingpond.shtml) |
  | Ocean fishing spot | Rod 1, Seat 1, Ocean water 1 | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/oceanfishingspot.shtml) |

- **Planner data (`data.json`) vs sources:**
  - Training waterfall is stored as Water 1; Serebii and GameWith say Water 2.
  - Marsh fishing spot is stored as Muddy 1, which agrees with Serebii but not GameWith (2).
  - Illuminated waterfall (Water 3), Waterwheel spot (Water 2), the hot-spring habitats, Piping-hot lava and Muddy playtime/spa match GameWith.
  — compared against [Serebii habitat dex](https://www.serebii.net/pokemonpokopia/habitats.shtml) and the GameWith pages above.
- **Guide, which Pokémon:**
  - Hot-spring shower: Psyduck, Golduck. Mossy hot spring: Torkoal. Open-air bath: Raboot. Harmonious hot spring: Politoed. Hot-spring fishing: Lotad, Lombre.
  - Piping-hot lava: Charcadet, Volcarona. Magma fishing: Arcanine.
  - Marshy tall grass: Paldean Wooper, Clodsire. Marsh fishing: Grimer, Muk, Clodsire. Muddy playtime: Marshtomp, Barboach, Inkay. Muddy spa: Swampert.
  - Training waterfall: Tyrogue. Waterwheel spot: Prinplup, Empoleon. Illuminated waterfall: Gyarados (needs a Burn helper).
  — [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208); [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922); [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909); [GameWith 滝](https://gamewith.jp/pocoapokemon/549075)

### Inferences
- Planner `ENV_FX` liquid values hold:
  - `Water`, `Muddy water` and `Waterfall`: [0,0,20].
  - `Hot-spring water`: [0,30,20].
  - `Lava`: [0,60]. Lava gives no humidity, matching Serebii's "does not hydrate".
  - `Ocean water`: [0,0,20,'',1]. It is correctly flagged untested.
  - All are per cell inside the counted band; no range in tiles applies.
- Planner `data.json` should change Training waterfall to Water 2, and flag Marsh fishing spot as 1 (Serebii) or 2 (GameWith).
- Hydration (turning dry ground, grass and crops green) is a separate property: true for water, false for lava and muddy water (Serebii), unknown for ocean and hot-spring water.

### Gaps
- Ocean water's humidity has not been measured (ccopedia: "probably").
- No light values exist for lava or other liquids. It is not known whether lava glows enough to count toward brightness.
- No test shows whether a lava, ocean or hot-spring waterfall satisfies a habitat's "Waterfall ×1", or whether a hot-spring or muddy-water fall counts as "たき" for humidity. ccopedia only tested water falls.
- No source tests whether ocean water or hot-spring water waters crops or runs a sprinkler or waterwheel. A search summary claims sprinklers accept regular, ocean and hot-spring water within Manhattan distance 5, but its source could not be opened ([Bulbapedia Sprinkler](https://bulbapedia.bulbagarden.net/wiki/Sprinkler), search summary only).

## 5. Placement rules and limits; differences between areas

### Takeaway
- Liquid can be spat at a chosen height. ZL + D-pad sets height and level, normal or low. It must touch a block or other liquid.
- Placing a block on a source deletes that source.
- Closed doors and some roof items block water. Two blocks meeting only at a corner leak.
- Liquids can't go inside kit houses, but a built (block) house may sit in water or lava, and liquid on the floor or door cells counts for it.
- A pier can be laid over flowing water without stopping the flow, and floating weed and dropped items float on it.
- No count limit was found.
- Liquids can't be carried between maps. Vending drinks let you make any liquid in any town. Bubbly Basin is underwater, and crops there need bubbles instead of water.

### Cited Findings
- **Guide:** "You can hold ZL to adjust the height of the placement of the water, but it will need to be attached to something to start such as being next to a block or another bit of water." — [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Community-tested (guide editorial):** ZL + D-pad Up/Down moves placement height from 2 below to 2 above (5 positions), and ZL + Left/Right sets the water level. — [攻略大百科 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901), as recorded in this repo's `research_notes/Pokopia height and stacking rules/gaps_full_reads.md`
- **Official, Ver. 2.0.0:** "特定の屋根のアイテムが、水を通さないようにしました" / "Certain roof items now block water." Before 2.0.0, water passed through them. — [GameWith Ver.2.0.0](https://gamewith.jp/pocoapokemon/547086); [Serebii Patches](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Community-tested, doors and windows:**
  - Doors pass water when open and block it when closed.
  - A closed door blocks water even where it touches another block at a corner, but "ブロック同士だと水が漏れる" (two blocks touching at a corner leak).
  - Items carried by water can't pass an open door (some exceptions).
  - The lidded ground window (フタつきまど・じめん) counts as being in the tile above, so when closed it also blocks water there.
  - A sash window (あげさげまど), when open, passes water above and below.
  - A simple curtain (シンプルカーテン), when closed, blocks water, blocks floating items horizontally and lets them through vertically.
  — [ぽこポケ学会 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)
- **Guide:** a pier (桟橋) set on a tile of flowing water makes footing "水の流れはそのままで" (the flow is unchanged). — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Community-tested:** a built house can be submerged: "水やマグマに沈めても良い" (it's fine to sink it in water or magma). — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- **Community-tested:** lift lines may run underwater ("通過するところが水没していても問題ない"). — [ぽこポケ学会 その他マイナー知識](https://kyu49.github.io/Pokopia/others/)
- **Community-tested:** kit houses accept no blocks, water, lava or hot springs inside. — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested:** map build limits are 97 up and 30 down; size and no-go areas differ by map. ぽこポケ学会's limits page lists electrical, plant, storage, item, kit-house and rug limits but none for liquids. — [ぽこポケ学会 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- **Guide, between towns:** "水源を「ちょすい」したまま別マップに移動することはできない" (you can't move to another map while holding a liquid). Hot spring, muddy water and lava therefore exist naturally in only one town each, and must be made from drinks elsewhere. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208)
- **Unverified (search summary):** liquid can only be placed "within the same biome where you collected it". Cloud Islands are separate worlds, and bag items can't be carried between a town and a Cloud Island. — search summary of [RankedBoost](https://rankedboost.com/pokopia/guides/how-to-place-water/) and [Nintendo support: Cloud Island Guide](https://en-americas-support.nintendo.com/app/answers/detail/a_id/71373/~/cloud-island-guide-%28pok%C3%A9mon-pokopia%29)
- **Guide, Bubbly Basin (Ver. 2.0.0):** "You can grow crops underwater, but you need to have a Pokémon with Water Specialty, or use a Bubble Machine, to make bubbles … else they will not grow." Buoyant blocks can be placed anywhere in water and built on. — [Serebii Dive Mechanics](https://www.serebii.net/pokemonpokopia/dive.shtml)
- **Guide:** underwater crops without bubbles do not grow; a powered bubble machine covers 3×3. — [Game8 JP 水中栽培](https://game8.jp/pocoapokemon/804154)
- **Official, Ver. 2.0.0:** Build now works underwater, and Dive was added. — [Serebii Patches](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide, sprinkler (water-using item):** "水のあるブロックから5マス以上離れると動かなくなります…効果範囲はスプリンクラーを中心とし半径5マスでひし形状" (stops working if 5+ tiles from water; range is a diamond of radius 5). — [Game8 JP スプリンクラー](https://game8.jp/pocoapokemon/769157). ぽこポケ学会 also gives 5 tiles: [畑の仕様](https://kyu49.github.io/Pokopia/harvest/)

### Inferences
- **Placement validation the planner can do:**
  - A liquid tile needs a supporting or adjacent solid block or liquid.
  - Liquids are never allowed in kit-house interiors.
  - A block placed on a source tile deletes that body.
  - Doors and certain roofs are watertight when closed.
  - A corner-only joint between two ordinary blocks is not watertight.
- A liquid is not a block for stacking: blocks replace it. Piers, floating weed, buoyant blocks (underwater) and dropped items can sit on or in it. The hydro generator goes on a water surface.
- Per-town availability without drinks: hot spring and lava only in Rocky Ridges, muddy water only in Bleak Beach, ocean water in Withered Wastelands, Bleak Beach and Palette Town. With drinks, any liquid works anywhere.

### Gaps
- No source on placing liquids on Dream Islands, or whether they persist there.
- No source on placing lava or other liquids underwater in Bubbly Basin, or what happens when an air-world liquid meets the sea.
- Which exact roof items block water since 2.0.0 is not listed.
- No numeric limit on liquid sources was found.

## 6. Community quirks, glitches and tricks

### Takeaway
The best-documented tricks:
- 1-wide channels widened after the water flows, to keep 25-tile reach.
- Waterfalls that reset reach.
- Waterfall and lava item lifts, capped at 14 tiles.
- Mud contamination.
- Floating-weed walkways.
- Liquid-sensor "buffering" through doors.
- Copying any liquid with the 2.0.0 short press.
- Water Gun to bridge lava.
- Liquid placed in a house to max humidity, or one lava tile to make it warm.

### Cited Findings
- **Community-tested:** keep 25-tile reach in a wide channel by flowing a 1-wide channel first and then widening it. — [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)
- **Community-tested:** an upward item lift. Push items from strong-flow water into weak-flow lava, then up a waterfall. Items rise at most 14 tiles per waterfall and can be chained. Lowered-level water also works as the weak liquid. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Community-tested:** floating weed on a waterfall lifts a Ditto standing on it. Floating weed left after draining gives a mid-air walkway. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/); [ぽこポケ学会 デザイン](https://kyu49.github.io/Pokopia/design/)
- **Community-tested:** liquid passing through some doors or fences is hidden from sensors and then triggers them all at once on exit. Spreading liquid stops nearby smooth rocks from restarting. These circuit quirks were credited to X users @echelon52a2, @ar481uma and @Lue_Luxion. — [ぽこポケ学会 水の仕様](https://kyu49.github.io/Pokopia/water/)
- **Official, Ver. 2.0.0:** a short press of ちょすい stores liquid without removing it, so any liquid tile can be copied endlessly. — [Serebii Patches](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide:** Water Gun on lava makes footing to cross lava, as on the Rocky Ridges routes. — [GameWith みずでっぽう](https://gamewith.jp/pocoapokemon/547665); [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- **Community-tested:** humidity and warmth hacks.
  - Five water tiles on the floor or door cells (20 each) reach 100, the humid threshold for a built house or habitat.
  - One lava tile (+60) alone makes a home warm.
  - One hot-spring tile (+30) plus three +10 items makes a home warm.
  - Lava 5 tiles (+300) beats four −60 coolers.
  — [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)
- **Guide:** rain from a Water-specialty Pokémon's Rain Dance waters every exposed dry plant and block. This is the fastest way to raise an area's humidity score. — [Game8 EN How to Raise Humidity](https://game8.co/games/Pokemon-Pokopia/archives/584829)
- **Guide:** a waterfall plus Waterfall (たきのぼり) lets Ditto climb at speed, and gliding (かっくう) from the top crosses the map quickly. Players build tall waterfalls as lifts. — [GameWith 滝](https://gamewith.jp/pocoapokemon/549075); [Game8 JP 水源](https://game8.jp/pocoapokemon/768146)
- **Unverified (search summary, games.gg news):** players compare Pokopia's water physics to Minecraft's. A reported fix for broken water: build a temporary platform under the bad section, fill the gaps and remove it, which forces the water to recalculate. — [games.gg](https://games.gg/news/pokopia-water-physics-minecraft-chaos/) (search summary)
- **Unverified:** the 2×2 "infinite source" pit. See section 1. Treat it as unconfirmed.

### Inferences
- The planner could offer two checks: a "reach" check (warn when a channel exceeds 25 or 12 tiles from its last source or drop, or when it is wider than 1), and an "item-lift" helper (14-tile cap per waterfall).

### Gaps
- No measured spread speeds or settle times.
- No list of known liquid glitches fixed by patches apart from the 2.0.0 roof change and the 2.0.0 water-level auto-matching. Reddit was not reachable, and searches found no threads.

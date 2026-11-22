# Pokémon Pokopia (ぽこ あ ポケモン): crops, farming and plant growth, a fact sheet for a tile planner

How these notes were read (22 Nov 2026). WebFetch could not resolve most game sites, but `curl` through the session proxy worked, so the pages below were **read in full** and converted to text locally:
- ぽこポケ学会 (kyu49): [畑の仕様と半自動化](https://kyu49.github.io/Pokopia/harvest/), [木の仕様ときのみ回収半自動化](https://kyu49.github.io/Pokopia/tree/), [水の仕様](https://kyu49.github.io/Pokopia/water/), [色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- Serebii: the vegetables, flowers, water, specialty and patch pages, the Grow and Water specialty lists, the cooking page and about 35 item pages
- Game8 JP: about 20 pages (farming, sprinkler, Grow, Water, Water Gun, Rototiller, Leafage, Cut, weather, berries, transplanting, underwater farming, watermelon, two challenges, automation, the November 2026 apple event). Game8 EN: the seeds page.
- GameWith: farm, sprinkler, bean, tomato, wheat, berries, trees and grass pages, all updated 18–22 Nov 2026
- gamepedia.jp: the farm mechanics page (updated 27 Aug 2026) and the farm layouts page
- Altema: the Grow page
- ccopedia (note.com): the humidity test, 14 Oct 2026

Blocked, so cited only from search summaries and marked "(search summary)": altema.jp sub-pages (Access Denied), gameranbu.jp, pokemongo-raku.com and rankedboost.com (proxy 403), thegameswiki.com and bulbapedia (Cloudflare challenge or DNS failure).

Labels used on every finding:
- **[Official]**: in-game text (item flavour text or specialty description, as transcribed by Serebii or Game8) or Nintendo patch notes.
- **[Measured]**: a community test with stated numbers (kyu49, ccopedia, or an X post they cite).
- **[Guide]**: a guide site's statement with no test shown.
- **[Unverified]**: a single source, a search summary only, or sources that disagree.

Versions: 1.0.1/1.0.2 (4 Mar 2026), 1.0.3 (9 Apr), 1.0.4 (23 Apr), 1.1.0 (9 Jun), 1.1.1 (19 Jun), 2.0.0 (5 Aug 2026, with Expansion Pass part 1 "Bubbly Basin"/ブクブクうみぞこ) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml). DLC part 2 (どきどきデコレーション / Dazzling Decorations) is dated 9 Dec 2026 — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213). Unless a version is given, a behaviour comes from pages updated after 2.0.0.

## 1. How fields are made, what can be planted where, and the placement rules

### Takeaway
A field (畑, "Farm soil", the planner's "Vegetable field (any)") is a single ground block that Rototiller (たがやす) turns from soil or grass. It has to be moist (watered) before it can be tilled. Crop seeds go only on farm soil, in a planter, or on farm soil on the sea floor (DLC). Flower, hedge and tree seeds go on plain soil or grass. There is no spacing or adjacency rule for planting. The only shape rules are habitat recipes (8 fields make "Fresh veggie field") and the per-area count caps.

### Cited Findings
**Making a field**
- [Official] Rototiller turns soil or grass (土や芝生) into a field where vegetable seeds can be planted. It tills only the one tile in front of Ditto and keeps tilling while the button is held. It cannot be powered up, because no dish boosts it — [Game8 たがやす](https://game8.jp/pocoapokemon/768196)
- [Official] Farm soil flavour text: "Soil softened by Rototiller. You can plant vegetable seeds in it." There are four farm-soil blocks, one per area soil: Farm soil (Wastelands), (Beach), (Ridge) and (Skyland). Picking one up needs Magnet Rise — [Serebii Farm soil (Wastelands)](https://www.serebii.net/pokemonpokopia/items/farmsoil(wastelands).shtml); the four names are in [Serebii's item index](https://www.serebii.net/pokemonpokopia/items/beanseeds.shtml)
- [Guide] Dry ("barren", 干からびた土) soil cannot be tilled. Water it with Water Gun first. This matters in Withered Wastelands and other dry starting ground; ground that is already moist needs no watering — [Game8 farming](https://game8.jp/pocoapokemon/767639); [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Official] Barren ordinary soil text: "A lack of water has made this soil dry and wrinkly. It doesn't look like it can grow any healthy grass." It occurs naturally in Withered Wastelands and Palette Town. Barren seashell, striped and pure-white soils also exist — [Serebii Barren ordinary soil](https://www.serebii.net/pokemonpokopia/items/barrenordinarysoil.shtml)
- [Official, v2.0.0] "Leafage can now be used on farm soil to revert it to a normal soil block." Before 2.0.0 a field could not be turned back with Leafage — [Serebii patch 2.0.0](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] Watered field tiles are darker. Dry ones are lighter — [Game8 farming](https://game8.jp/pocoapokemon/767639); [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)
- [Guide] Seeds are planted by holding them and pressing A at a field ("植える" appears when you stand next to a field) — [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)

**What goes where**
- [Official] Field grass flavour text: "Soft soil with grass growing on top. It's perfect for planting tree or flower seeds." — [Serebii Field grass](https://www.serebii.net/pokemonpokopia/items/fieldgrass.shtml)
- [Official] Flower, tree and hedge seed texts all say "Try planting them in some soil". Crop seed texts say "Try planting them in a field" — [Serebii Wildflower seeds](https://www.serebii.net/pokemonpokopia/items/wildflowerseeds.shtml), [Leppa Seeds](https://www.serebii.net/pokemonpokopia/items/leppaseeds.shtml), [Tomato seeds](https://www.serebii.net/pokemonpokopia/items/tomatoseeds.shtml)
- [Guide] Flower and tree seeds can be planted in moistened ground — [Game8 みずでっぽう](https://game8.jp/pocoapokemon/768019)
- [Official] Planter: "Plant some flower or vegetable seeds here, and raise them until they're fully grown." Recipe: Brick ×1 + Stone ×1, from the daily shop or sparkling water. It is an Outdoor item — [Serebii Planter](https://www.serebii.net/pokemonpokopia/items/planter.shtml)
- [Official] Seabed flower seeds: "Try planting them on the ocean floor or in some soil" — [Serebii](https://www.serebii.net/pokemonpokopia/items/seabedflowerseeds.shtml)
- [Guide, DLC/v2.0.0] Underwater fields need Dive (ダイビング). Rototiller works on the sea floor. Watermelon, sea grapes and the land crops all grow there — [Game8 水中栽培](https://game8.jp/pocoapokemon/804154)
- [Official] Moss text: "This plant can grow anywhere dim and damp—even on boulders". Dense vines: "cling securely to things that plants can't grow in, like bricks and boulders", grown with charged, powered-up Leafage against a wall. Duckweed floats on water — [Serebii Moss](https://www.serebii.net/pokemonpokopia/items/moss.shtml), [Dense vines](https://www.serebii.net/pokemonpokopia/items/densevines.shtml), [Duckweed](https://www.serebii.net/pokemonpokopia/items/duckweed.shtml)
- [Guide] Leafage (このは) grows grass on the one tile in front, and only grass: it cannot grow trees or flowers. Powered up by salad (hold the button), it covers a wider area and grows water plants (duckweed), moss and vines on water, rocks and walls — [Game8 このは](https://game8.jp/pocoapokemon/768189); [Serebii cooking](https://www.serebii.net/pokemonpokopia/cooking.shtml)
- [Guide] Ferns (シダ) grow on black rock or volcanic ash with powered Leafage. Duckweed (うきくさ) grows on the water surface with powered Leafage. Dense vines (ぐるぐるツタ) grow on block sides with powered Leafage — [GameWith 草一覧](https://gamewith.jp/pocoapokemon/548655)
- [Unverified] Leafage on dry field grass (かれたそうげんのしばふ) or barren soil (ひからびたふつうのつち) grows dry tall grass (かれたみどりのくさ), which Water Gun then turns green — Altema and gameranbu (search summary of [altema karekusa](https://altema.jp/pocoapokemon/karekusa) and [gameranbu](https://gameranbu.jp/pocoapokemon/830112d21552ec190df2))

**Placement rules, adjacency, height, indoors**
- [Guide] No guide gives a spacing or adjacency rule for planting. Guides recommend planting a whole field on the same day so it ripens together — search summary of [gamepedia](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Official, v2.0.0] "Items can now be placed on top of square plants." — [Serebii patch 2.0.0](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Official] Square plant: "You can make a hedge by joining a few of these together." — [Serebii Square plant](https://www.serebii.net/pokemonpokopia/items/squareplant.shtml)
- [Measured] Per-area caps: field crops **511 plants** (576 on Cloud Islands, +64). Berry trees 226 (past that, trees can no longer be headbutted). Pointy (三角) trees 251. Growing trees, flowers and crops **1024** combined; fully grown ones are counted separately. The field-cap warning only appears at the fruiting stage — [kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Guide] Each area holds a combined 1024 flower seeds, tree seeds or vegetable plants. Fully grown flowers, bushes and trees don't count, and dry plants don't count — [Serebii Flowers & Plants](https://www.serebii.net/pokemonpokopia/flowers.shtml)
- [Measured] Dropped crops and berries disappear when you leave the area. Up to 512 dropped items persist, after which the oldest drop vanishes first — [kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Measured] Inside a kit house, blocks and water cannot be placed (so no fields), but plants in planters and vases still count for humidity — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Guide] Habitat "フレッシュ野菜畑" (Fresh veggie field) forms from 8 fields. Its residents include Rowlet (モクロー), a Grow Pokémon. Guides lay fields out in multiples of 8, or 4-wide strips, so several habitats fit — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [gamepedia layouts](https://gamepedia.jp/pocoapokemon/archives/2573); [Game8 Grow list](https://game8.jp/pocoapokemon/767548). GameWith also says 8 adjacent planted fields make a dwelling — [GameWith farm](https://gamewith.jp/pocoapokemon/545336)

### Inferences
- In the planner, "Vegetable field (any)" is a ground block (one farm-soil tile at height −1 relative to the plant) with an optional crop object on it. Tilling should only be allowed on moist soil or grass, and a planted crop should be an object on that tile.
- The planner's existing "Fresh veggie field = Vegetable field (any) ×8" and "Toil in the soil = ×4 + Wheelbarrow" recipes match the guides. No source checked whether the 8 tiles must touch each other. GameWith says "adjacent" (隣接した8マス).
- The planner should check the 1024 growing-plant cap and the 511 crop cap per area. Big farms can hit 511.

### Gaps
- No source states whether light, or open sky above a field, is needed. No crop is reported to need light, and kit-house interiors cannot take fields at all.
- Whether a planter can hold every crop (wheat, potato, watermelon) and whether it can go inside a kit house was not stated. The flavour text says "flower or vegetable seeds".
- The exact Japanese names of the Cute and Robust flowers were not seen.

## 2. Crops and seeds: names, sources, stages, growth times, yields, regrowth, uses

### Takeaway
There are four base crops: Bean, Tomato, Wheat and Potato. DLC1 adds Watermelon and Sea grapes, and Fresh carrot appears on its own. Every planted crop has three growth stages after the seed (seed → sprout → blooming/small → ripe) and advances one stage at 05:00 each day. So a seed ripens after 3 day changes, or after 2 days with Grow. Beans, tomatoes and potatoes keep their plant after harvest and refruit after **one** stage. Wheat goes back to seed and needs **three** stages again. A ripe plant yields about **3**; refruits may give fewer (beans 1–2). The four main crops feed the four move-boosting dish families.

### Cited Findings
**List, Japanese names, stage items**
- [Official] Stage items (Serebii item DB). The "(Grow)" variants are the sparkle state after Grow:
  - Bean: Bean seeds → Bean sprout → Blooming bean plant → Ripe bean plant, plus Dry bean plant
  - Tomato: Tomato seeds → Tomato sprout → Blooming Tomato plant → Ripe Tomato plant, plus Dry tomato plant
  - Potato: Potato seeds → Potato sprout → Blooming potato plant → Ripe potato plant, plus Dry potato plant
  - Wheat: Wheat seeds → Wheat sprout → Small wheat plant → Ripe wheat, plus Dry wheat
  - Watermelon: Watermelon seeds → Watermelon sprout → Blooming watermelon plant → Ripe watermelon plant
  - Sea grapes: Seagrape stalk / Seagrape stalk (grow)
  - Sources: [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml); [Serebii item index](https://www.serebii.net/pokemonpokopia/items/beanseeds.shtml); [Seagrape stalk](https://www.serebii.net/pokemonpokopia/items/seagrapestalk.shtml)
- [Guide] Japanese stages: タネ → 苗 → 花 → 作物あり (harvestable) → 作物なし (harvested) — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- Japanese names, from the Game8, GameWith and gamepedia pages cited in this section:
  - マメ = Bean, トマト = Tomato, コムギ (小麦) = Wheat, ジャガイモ = Potato
  - スイカ = Watermelon, カットスイカ = Watermelon slice
  - うみぶどう = Sea grapes, たべごろニンジン = Fresh carrot, みついりりんご = Syrupy Apple
  - Seeds are 〜のタネ (マメのタネ and so on)

**Growth timing**
- [Guide] Crops grow one stage when the day changes at **05:00**, not midnight, and when a Grow Pokémon acts on them — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [Game8 farming](https://game8.jp/pocoapokemon/767639)
- [Guide] Stages needed: flowers 1, hedges 2, crops (bean, potato, wheat, tomato) and trees 3 — [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [Game8 farming](https://game8.jp/pocoapokemon/767639); [gamepedia](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] "Vegetables go through a stage of growth each day, however this requires the area to be hydrated." With water, each day the plant "should move to the next stage, or refresh the yield of the vegetables" — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)
- [Unverified] One English guide says about 3 real-time days from seed to full growth. Another says crops have different growth times. A third says beans grow without water. Japanese guides and Serebii say every crop needs water (see question 3) — search summary of [vandal](https://vandal.elespanol.com/en/pokemon-pokopia/pokemon-pokopia-how-to-grow-vegetables-and-plant-seeds.html), [rankedboost](https://rankedboost.com/pokopia/guides/how-to-farm-crops/), [gamertagmythras](https://gamertagmythras.com/blog/pokemon-pokopia/pokemon-pokopia-farming-guide)
- [Guide] Switching the console clock forward speeds growth. Guides mention it as an option — [Game8 farming](https://game8.jp/pocoapokemon/767639); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)

**Regrowth and yield**
- [Guide] After harvest the plant goes to the "no crop" state and fruits again from there — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] "After its first harvest, Bean puts on about 1–2 fruits per single stage before the next harvest, but Wheat needs 3 stages again after each harvest" (マメは初めて収穫してから次の成長まで1段階で実を1〜2個程度付けますが、コムギは一度収穫すると次の収穫まで再度3段階の成長が必要) — [Game8 farming](https://game8.jp/pocoapokemon/767639)
- [Measured] Most crops return to a plant after harvest, but wheat goes back to the seed state with no sprout. So harvesting wheat removes 2.5 humidity per tile until it sprouts again — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Guide] "One seed yields 3 crops", so 17 seeds are enough for the challenge "Grow lots of vegetables at the same time", which needs 50 or more growing in Palette Town — [Game8 たくさん野菜](https://game8.jp/pocoapokemon/768960)
- [Unverified] Bulbapedia's crop pages reportedly list 3 per ripe bean, tomato, wheat or potato plant. One guide says each tomato vine gives 3 — search summary (Bulbapedia, [gamesradar](https://www.gamesradar.com/games/pokemon/pokemon-pokopia-tomatoes))
- [Guide] Grow can "regenerate one vegetable" on a plant that has been harvested — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)
- [Official] Ripe Tomato plant: "Pull firmly to harvest them". Ripe watermelon plant: "A round watermelon that grew from a long vine. Pull firmly to harvest it" — [Serebii](https://www.serebii.net/pokemonpokopia/items/ripetomatoplant.shtml); [Serebii](https://www.serebii.net/pokemonpokopia/items/ripewatermelonplant.shtml)

**Harvesting**
- [Guide] Harvest one plant at a time with Y. Cut (いあいぎり) cuts only the fruit and leaves the plant; holding Y then inhales all the drops. Powered-up Cut (from bread) cuts **3×6 tiles** — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213); [Game8 automation](https://game8.jp/pocoapokemon/769942); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Guide] Inhale dropped crops with a long Y press, because otherwise you may pick up nearby piers or sprinklers by mistake — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] Rototiller can lift crops, but doing so harvests the fruit. Rock Smash on the block a crop is planted in gives the seed or seedling back as an item — [Game8 植え替え](https://game8.jp/pocoapokemon/769112); [Game8 たくさん野菜](https://game8.jp/pocoapokemon/768960); [GameWith bean](https://gamewith.jp/pocoapokemon/547471)
- [Guide] Rototiller or charged Magnet Rise can pick up and move a plant — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)

**Seed sources and unlocks**
- [Guide] Bean seeds: shop after Withered Wastelands Environment Lv 3, or from the Rocky Ridges southwest field (break the rock blocking the water and its sprinkler starts). Tomato seeds: shop after Bleak Beach Env Lv 3, or from the Bleak Beach field. Wheat seeds: shop after Rocky Ridges Env Lv 3, or from the Rocky Ridges field. Fields also spawn at random on the rock-mountain and volcano Dream Islands — [GameWith bean](https://gamewith.jp/pocoapokemon/547471); [tomato](https://gamewith.jp/pocoapokemon/547862); [wheat](https://gamewith.jp/pocoapokemon/547888)
- [Guide] Potatoes come from Sparkling Skylands (キラキラ) — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] Cloud Island shop unlocks: Wildflower seeds Lv 1, Bean seeds Lv 3, Tomato and Wheat seeds Lv 4, Potato seeds Lv 5. Watermelon seeds: Bubbly Basin Lv 3. Seabed flower seeds: Bubbly Basin Lv 2 — [Serebii Bean](https://www.serebii.net/pokemonpokopia/items/beanseeds.shtml), [Wheat](https://www.serebii.net/pokemonpokopia/items/wheatseeds.shtml), [Tomato](https://www.serebii.net/pokemonpokopia/items/tomatoseeds.shtml), [Potato](https://www.serebii.net/pokemonpokopia/items/potatoseeds.shtml), [Watermelon](https://www.serebii.net/pokemonpokopia/items/watermelonseeds.shtml), [Seabed flower](https://www.serebii.net/pokemonpokopia/items/seabedflowerseeds.shtml), [Wildflower](https://www.serebii.net/pokemonpokopia/items/wildflowerseeds.shtml)
- [Guide] Shop seeds are limited and restock daily. Cutting flowers and trees can drop seeds, and befriended Pokémon may give seeds — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)
- [Official] Trade values: crop seeds 50 (75 if a favourite); Watermelon seeds 10 (15). Seeds cannot be 3D printed. Grown plants can be printed for 1 Rare Pokémetal, and the Square plant for 4 Pokémetal — Serebii item pages cited above

**Fresh carrot, watermelon, sea grapes, apples**
- [Official] Fresh carrot: "You can harvest these spicy carrots by pulling up on their leaves. Restores some PP when eaten." It is natural in Withered Wastelands, Palette Town and Bubbly Basin — [Serebii Fresh carrot](https://www.serebii.net/pokemonpokopia/items/freshcarrot.shtml)
- [Guide] Fresh carrots (たべごろニンジン) sometimes appear by themselves where nothing is planted, and not only on fields. No rate is given — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide, DLC] Watermelons grow in underwater fields once Water Pokémon cover them with bubbles. A Chop (きをきる) Pokémon cuts 1 watermelon into **3 watermelon slices**. Slices are needed for cooking (smoothies). A watermelon restores 1 PP — [Game8 スイカ](https://game8.jp/pocoapokemon/804460)
- [Guide, DLC] Sea grapes grow underwater **without** bubbles — [Game8 水中栽培](https://game8.jp/pocoapokemon/804154)
- [Official] Seagrape stalk: "Seaweed commonly found underwater. It produces lots of tiny fruits". Lush seaweed: "grows rapidly underwater. It can be cut down and eaten." — [Serebii](https://www.serebii.net/pokemonpokopia/items/seagrapestalk.shtml); [Serebii](https://www.serebii.net/pokemonpokopia/items/lushseaweed.shtml)
- [Guide, event] カジッチュのみついりりんごあつめ runs 16 Nov 2026 05:00 to 1 Dec 2026 04:59. Syrupy Apples are headbutted from trees on Dream Islands: 2 per tree, 3 with a timed critical. All rewards cost 80 apples — [Game8 event](https://game8.jp/pocoapokemon/840408)
- [Official] Syrupy Apple seeds come from the Pokémon Center exchange and are planted in soil — [Serebii](https://www.serebii.net/pokemonpokopia/items/syrupyappleseeds.shtml)

**Uses**
- [Official] Cooking (dish → move boosted, PP restored), from [Serebii cooking](https://www.serebii.net/pokemonpokopia/cooking.shtml):
  - Bean (main) → hamburger steaks, which boost Rock Smash: Simple 350, Tomato 500, Potato 500 ("a lot"), Mushroom 240, Bitter 650, Vibrant 650, Explosive 650. Beans also go in Healthy soup.
  - Wheat (main) → breads, which boost Cut: Simple 60, Carrot 90, Watermelon 90, Fluffy 120.
  - Watermelon slice (main) → smoothies, which boost Surf.
  - Sea grapes → Popping salad, Popping soup, Sea grape smoothie, Explosive steak.
  - Fresh carrot → Carrot bread, Red-hot smoothie.
- [Guide] Ten tomatoes and ten wheat are needed for the second Team Initiation challenge. Food offered to Mosslax (こけカビゴン) once a day gives a bonus until 05:00 — [GameWith tomato](https://gamewith.jp/pocoapokemon/547862); [wheat](https://gamewith.jp/pocoapokemon/547888)
- [Guide] Recommended priority: beans and potatoes first (Rock Smash upgrades for mining), then wheat (Cut, which helps harvesting), then tomatoes — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Guide] Berries restore PP, go into cooking, can be offered to Mosslax, and can be crushed into paint — [Game8 きのみ](https://game8.jp/pocoapokemon/768279)

### Inferences
- Timeline model for the planner: a crop planted on day 0 needs 3 stage-ups. With 05:00 ticks only, it is ripe on the morning of day 3. With one Grow per day it ripens on day 1, after Grow on day 0, the 05:00 tick, and Grow on day 1. Regrowing crops (bean, tomato, potato) then need 1 stage: one harvest a day from the tick alone, or 2 a day with Grow. Wheat repeats the full 3-stage cycle. GameWith's statement for trees fits this model: Grow on the planting day and the next day leaves the tree fully grown the next day.
- A conservative yield estimate is 3 per ripe plant on the first harvest, and 1–3 per later harvest. Only beans have a stated refruit figure (1–2).

### Gaps
- No measured yield table per crop (tomato, potato, watermelon refruit counts) was found. The Serebii phrase "regenerate one vegetable" hints that refruiting crops add one fruit per stage. This is untested.
- Regrowth stages for tomato, potato and watermelon after harvest were not stated separately. The gamepedia model suggests one stage.
- No source gave how many days an unwatered crop survives before it becomes "Dry …". (Serebii's "One day from Blooming" on the Dry tomato plant page looks like a copied stage line, not a wither timer.)

## 3. Watering: drying, frequency, what waters, coverage ranges, liquid adjacency

### Takeaway
A crop only grows on a day when its tile is hydrated. Hydration can come from:
- Water Gun (a plus shape)
- an orthogonally adjacent still-water tile
- a sprinkler (a Manhattan-radius-5 diamond, 61 tiles including itself), which needs a water tile **at its own height** within that diamond
- a Water-specialty Pokémon with a filled water basin nearby
- rain
Muddy water and lava never hydrate. A submerged plant does not grow. Underwater crops need bubbles instead, from Water Pokémon or a powered Bubble machine (3×3).

### Cited Findings
**General**
- [Guide] Growth requires hydration, "done by having water next to the soil, or you can use a Sprinkler". If a plant is submerged it will not grow. Being near lava prevents hydration "but it won't dry it out" — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)
- [Guide] Muddy water "Does not hydrate the area". Lava "Does not hydrate the area". Ocean, fresh and hot-spring water have no such note. "If a plant is submerged, it will no longer grow while under water" — [Serebii Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- [Guide] Field blocks that touch water need no sprinkler or Water Pokémon. "Crops do not grow in flowing water" (水流では作物が成長しません); the still water surface must sit right next to the field. A dry field left without water may wither — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] Layout with a water source and a pier: every field tile touches a "pier on water" tile, which allows any length or width — [gamepedia layouts](https://gamepedia.jp/pocoapokemon/archives/2573)
- [Measured, trees] A dried tree revives from water only if the water is in a horizontally adjacent cell at the tree's own height, or beside the block under the tree when that block reacts to water. It does **not** revive from water directly below, water 2 tiles away, diagonal water, or muddy water. Vertically, water 2 or more cells up the trunk (shallow water OK) revives it; water at the roots does not — [kyu49 木の仕様](https://kyu49.github.io/Pokopia/tree/)
- [Guide] One guide advises watering at least once a day to stop drying out — search summary ([thegameswiki](https://thegameswiki.com/pokopia/wiki/farming-and-gardening))

**Water Gun**
- [Guide] Water Gun (みずでっぽう), the first move, from Squirtle, covers the centre tile plus 1 tile up, down, left and right. Powered by soup (hold the button), it reaches 2 more tiles orthogonally and 1 tile diagonally (上下左右は2マス広がり、斜めに1マス広がります) — [Game8 みずでっぽう](https://game8.jp/pocoapokemon/768019)
- [Guide] Water dry crops you find while exploring and they can become harvestable — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)

**Sprinkler**
- [Official] Sprinkler text: "An irrigation device that sprays water in a wide area. Try putting one near the waterside." Recipe Iron ore ×1, from the Daily Shop special or sparkling water. 3D print costs 4 Pokémetal. One is placed in Rocky Ridges — [Serebii Sprinkler](https://www.serebii.net/pokemonpokopia/items/sprinkler.shtml). The planner data lists the same recipe.
- [Guide] Range: a diamond 5 tiles from the centre up, down, left and right, spanning 11×11 and **61 tiles** in total. It only runs with water inside that range, and water at a **different height** from the sprinkler does not work — [GameWith sprinkler](https://gamewith.jp/pocoapokemon/548144); [GameWith bean](https://gamewith.jp/pocoapokemon/547471)
- [Guide] The 61-tile figure includes the sprinkler's own tile. At least one water source must be in range. Sprinklers also water the block above them, so they can be buried under a field — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026)
- [Guide] A radius-5 diamond that needs water in range. "It stops working 5 or more tiles from a water block" (5マス以上離れると動かなくなります), which reads as 1 tile stricter than radius 5. Guides recommend putting it directly over a water source on a pier — [Game8 sprinkler](https://game8.jp/pocoapokemon/769157); [Game8 farming](https://game8.jp/pocoapokemon/767639)
- [Guide] Serebii describes 5 squares out "and in the tiles diagonally between them, covering up to 60 blocks", so it excludes the centre — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)
- [Measured] The sprinkler also detects upward, so it can be buried underground. Water reaches up to 5 tiles from the sprinkler, and for the finer range kyu49 points to its dry-rock spec of 41 tiles. Disagreement: 41 tiles is a radius-4 diamond, while every other source gives radius 5 / 61 — [kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)
- [Guide] 10×10 farm with 4 sprinklers: on each corner's diagonal, 3 tiles in, dig 2 down, place the sprinkler and pour water (it works while submerged), refill with tillable soil, then till. With a sprinkler buried, the water tile beside it can also become field, giving a 60-tile field — [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [gamepedia layouts](https://gamepedia.jp/pocoapokemon/archives/2573)
- [Measured] Earlier repo notes, from search summaries of X tests: a radius-5 (Manhattan) diamond, so a square plot's corners stay dry. Other figures in the wild ("36 blocks", "max 5×5") look wrong — see `research_notes/Pokopia height and stacking rules/habitats_and_ranges.md` (X @Hikikomori_1, game9820, hyperts, piyo-piyo04)
- [Guide] Sources: Rocky Ridges farm (1, original), a Bleak Beach hidden room, the Daily Shop, sparkling ripples (more common on Sundays), and red Poké Balls on the volcano and wasteland Dream Islands (Arcanine and Clefairy dolls) — [Game8 sprinkler](https://game8.jp/pocoapokemon/769157)

**Water specialty (うるおす) and the water basin (みずおけ)**
- [Official] "Pokémon with the Water specialty can use a full water basin to spray water on nearby fields and plants." — [Serebii specialty](https://www.serebii.net/pokemonpokopia/specialty.shtml); [Game8 うるおす](https://game8.jp/pocoapokemon/767547)
- [Official] Water basin: "Fill this with water so Pokémon can do some watering for you." Recipe: Lumber ×2 + Vine rope ×2. Shop: Withered Wastelands Lv 3, Cloud Island Lv 3. 3D print: 2 Pokémetal — [Serebii Water basin](https://www.serebii.net/pokemonpokopia/items/waterbasin.shtml)
- [Guide] Fill the basin with Water Gun — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)
- [Guide] Move a Water Pokémon into a habitat near the field, with a basin, and it waters automatically. Examples: Squirtle, Lapras, Piplup — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [Game8 automation](https://game8.jp/pocoapokemon/769942)
- [Official] Water specialty Pokémon (Serebii list): Squirtle line, Slowpoke/Slowbro/Slowking, Gyarados, Shellos (both), Gastrodon (both), Goomy line, Cramorant, Lapras, Azurill/Marill/Azumarill, Wingull/Pelipper, Piplup line, Lotad line, Poliwag line + Politoed, Dratini line, Froakie line, Vaporeon, Suicune, Feebas/Milotic, Horsea/Seadra/Kingdra, Lanturn, Mudkip/Marshtomp, Lumineon, Alomomola, Popplio — [Serebii Water specialty](https://www.serebii.net/pokemonpokopia/pokedex/specialty/water.shtml)

**Underwater (DLC1, v2.0.0)**
- [Guide] Underwater crops without bubbles do not grow. A Water Pokémon brought to the field blows bubbles on them. A Bubble machine, when powered, makes bubbles over **3×3** (縦3マス・横3マス) — [Game8 水中栽培](https://game8.jp/pocoapokemon/804154)
- [Official] Bubble machine: "Creates bubbles when powered on. Try placing it near mud or underwater crops." Iron ore ×1, Bubbly Basin shop Lv 6, Expansion Pass only — [Serebii](https://www.serebii.net/pokemonpokopia/items/bubblemachine.shtml)

**Rain and weather**
- [Guide] Rain waters a wide area. Dry ground and withered trees gradually become moist. Weather can be set with habitats: あまごいスポット (2× Castform charm (rain) + a plated food; bring a Water Pokémon) makes rain, にほんばれスポット (2× Castform charm (sun) + plated food; bring a Burn Pokémon) makes sun — [Game8 天気](https://game8.jp/pocoapokemon/768195)
- [Measured] Rain stops Smooth Rock (さらさらいわ) from working, even under a roof. A kit-house interior is the exception. Rain randomly turns dry grass blocks back into grass blocks unless a block above shields them — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd); [kyu49 水](https://kyu49.github.io/Pokopia/water/)
- [Measured] Smooth Rock and sprinklers interact: dry rock stops near rain or a sprinkler and restarts as soon as they are gone. Near a clock circuit, or near extending liquid in the same 8×8 map cell, it may not restart — [kyu49 水](https://kyu49.github.io/Pokopia/water/)

**Drying**
- [Measured] Smooth Rock: every 5 s it picks 10 of its 41 tiles and dries them. It affects +1 to −2 vertically. If a plant is in range, the ground under it dries with it even if outside the range, and ground in range takes its plant with it. Planters are unaffected — [kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)
- [Measured] Conflict: X @aminisi reports that plants in planters do dry when within +1 to −2 — cited in the repo's `habitats_and_ranges.md`
- [Guide] Drying (by Smooth Rock) withers crops, trees and tall grass, so keep homes and trees out of its range — search summary ([altema kansou](https://altema.jp/pocoapokemon/kansou))

### Inferences
- Coverage model for the planner. A field tile is wet if any of these holds:
  - a still Water, Fresh, Ocean or Hot-spring tile touches it orthogonally at the same height (inferred from the tree rule and "water next to the soil"; untested for fields);
  - it lies within Manhattan distance 5 of a sprinkler whose diamond contains a same-height water tile;
  - it is within reach of a Water-specialty resident with a filled basin (range unknown);
  - it was watered with Water Gun that day.
  Flowing water, muddy water and lava never count. Lava next to a tile should block hydration.
- A buried sprinkler can water the layer above. The planner should allow a sprinkler at −1 or −2 under a field and still count coverage there, while noting that its water must sit at the sprinkler's own height.
- The radius-4 versus radius-5 disagreement (kyu49's 41-tile pointer against 61 everywhere else) should be shown as radius 5, with a note.

### Gaps
- The coverage range of a Water-specialty Pokémon plus basin, in tiles, was not found in any source.
- Whether Water Gun hydration lasts one day, or until the next 05:00 growth, was not stated. Nor was whether a hydrated field turns dry again overnight without a permanent water source.
- No test shows whether diagonal water or water one block lower keeps a field tile wet. The tree rule is the closest data.
- How often it rains naturally was not covered.

## 4. Grow specialty and other helpers

### Takeaway
A Grow (さいばい) Pokémon advances a watered plant by one stage, **once per plant per day**. A sparkle shows it has been done. Flowers (1 stage) finish instantly, while crops and trees need several days. Extra Grow Pokémon do not stack. They act if they follow you, and guides say they also act if they live near the field. Harvesting cannot be automated: Gather (しわける) Pokémon do not pick up crops or berries. Kyu49's semi-automation drops crops with Smooth Rock and moves them with water flow. No fertiliser or quality grade was found.

### Cited Findings
- [Official] "Pokémon with the Grow specialty can make plants grow faster." — [Serebii specialty](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Once a day Grow moves a plant forward a stage or regenerates one vegetable. It works on each plant once a day and the plant sparkles to show it — [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)
- [Guide] With a Grow Pokémon near the field, each crop advances 1 stage once a day. The check runs once per crop per day, so more than one Grow Pokémon is unnecessary — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [gamepedia layouts](https://gamepedia.jp/pocoapokemon/archives/2573)
- [Guide] Altema: a Grow Pokémon speeds the growth of plants near it (近くに植物があると成長を早めてくれる) — [Altema さいばい](https://altema.jp/pocoapokemon/tokui/2)
- [Guide] Brought to a watered, planted spot, a Grow Pokémon advances vegetables and flowers one stage at once. Flowers finish in one use; beans, trees and hedges do not — [Game8 Grow](https://game8.jp/pocoapokemon/767548); [Game8 farming](https://game8.jp/pocoapokemon/767639)
- [Guide] Flowers take a day, or are instant with a Grow Pokémon. Trees take 4 days as standard — [Serebii Flowers & Plants](https://www.serebii.net/pokemonpokopia/flowers.shtml). Disagreement: GameWith says trees take 3 days — [GameWith trees](https://gamewith.jp/pocoapokemon/548662)
- [Guide] A following Grow Pokémon acts on its own — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)
- [Guide] Plants still need water. A Grow Pokémon does not make an unwatered tomato grow — search summary (Bulbapedia)
- [Guide] Moving a Grow Pokémon into a home by the field (alongside a Water Pokémon) keeps automation stable — [Game8 automation](https://game8.jp/pocoapokemon/769942); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Unverified] A Grow Pokémon grows plants automatically, without following you, if the plants are inside its dwelling's range — search summary of [pokemongo-raku](https://pokemongo-raku.com/post153023). No tile radius is given.
- [Official] Grow Pokémon (Serebii list): Bulbasaur line, Oddish/Gloom/Vileplume/Bellossom, Bellsprout line, Tangela/Tangrowth, Cacnea/Cacturne, Exeggcute/Exeggutor, Rowlet line, Snivy line, Sprigatito line, Leafeon, Hoppip line, Applin/Flapple/Appletun/Dipplin, Corsola, Dhelmise — [Serebii Grow specialty](https://www.serebii.net/pokemonpokopia/pokedex/specialty/grow.shtml). Game8 notes Rowlet lives in the Fresh veggie field habitat — [Game8 Grow](https://game8.jp/pocoapokemon/767548)
- [Guide, DLC] Corsola (サニーゴ) is a Grow helper for watermelons — [Game8 スイカ](https://game8.jp/pocoapokemon/804460)
- [Measured] Gather (しわける) does not collect field crops or fallen berries, whether a Pokémon or a headbutt dropped them. Drops vanish on area change, so fields cannot be fully automated. Smooth Rock withers crops (all but wheat) and berry trees, so the crops and berries fall to the ground. Crops then snag on withered plants when washed by water. Proposed methods: stepped water channels, or a fast-moving Ditto vacuum — [kyu49 畑](https://kyu49.github.io/Pokopia/harvest/); [kyu49 木](https://kyu49.github.io/Pokopia/tree/)
- [Guide] Harvesting cannot be automated; use Cut, then inhale — [Game8 farming](https://game8.jp/pocoapokemon/767639); [Game8 automation](https://game8.jp/pocoapokemon/769942)
- [Guide] Litter (ちらかす) drops come from residents' homes, not crops. Grass-type litterers drop leaves (Venusaur, Vileplume) or vine rope (Bellsprout, Weepinbell, Tangela/Tangrowth, Snivy line). Cacturne drops sturdy sticks and Combee drops honey — [Game8 automation](https://game8.jp/pocoapokemon/769942)
- [Measured] Litter positions: around a kit house (1 tile, not diagonal), or on a built house's floor and 1 tile outside its walls. They need a ground block with nothing on it and no liquid — [kyu49 ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)

### Inferences
- Planner model for Grow: "+1 stage per plant per day if any Grow Pokémon visited, or if the plant is in a Grow resident's home range". Never stack it.
- Planner model for Water: a Water resident plus a filled basin marks nearby fields as wet. A Fresh veggie field (8 fields) is the natural home for both helpers.
- Fertiliser, quality and star ratings for crops did not appear in any source read. The game seems to have none.

### Gaps
- The tile range of Grow from a resident's home (if it exists) and from a following Pokémon was not found.
- Whether Grow on a ripe regrowing crop adds one fruit or a full refruit was not tested anywhere.

## 5. Plants that spread or change on their own

### Takeaway
No source reports grass or flowers spreading, cross-breeding or seeding by themselves. Variety comes from each save's fixed natives plus other islands, the shop and gifts. Changes that do happen:
- Dry versions of grass, soil, trees and crops revive with water (Water Gun, rain, or an adjacent water tile for trees).
- Dry grass blocks revert to green at random in rain.
- Smooth Rock withers plants.
- Berry trees regrow 1 berry an hour, up to 3.
- Fresh carrots sometimes appear on unplanted ground.

### Cited Findings
**Dry and withered states**
- [Official] Dry field grass: "You can bring this back to its fresh, green state by spraying it with Water Gun." Dry Leppa tree: "You can revive this dried-up tree by spraying it with Water Gun." Dry tall grass: "it might perk up if you water it." — [Serebii Dry field grass](https://www.serebii.net/pokemonpokopia/items/dryfieldgrass.shtml), [Dry Leppa tree](https://www.serebii.net/pokemonpokopia/items/dryleppatree.shtml), [Dry tall grass](https://www.serebii.net/pokemonpokopia/items/drytallgrass.shtml)
- [Official] Dry variants listed: Dry field/seashore/alpine/sky-high grass blocks; Barren ordinary/seashell/striped/pure-white soil; Dry tall grass in green, yellow, red and pink; dry versions of all six berry trees and of the pointy tree; Dry vine; dry crops; Dry wildflowers; dry hedges — [Serebii item index](https://www.serebii.net/pokemonpokopia/items/beanseeds.shtml)
- [Guide] Water Gun makes dry ground walkable for Pokémon, and revived plants become habitats — [Game8 みずでっぽう](https://game8.jp/pocoapokemon/768019)
- [Measured] In rain, dry grass blocks turn into grass blocks at random. Humidity goes −0.5 → +1 per block. A block above prevents it — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Measured] Smooth Rock withers plants and ground (see question 3). Withered berry trees do not grow berries: the hourly count either pauses or resets, probably resets — [kyu49 木](https://kyu49.github.io/Pokopia/tree/)
- [Guide] Flowers don't wilt or die once grown — search summary ([thegameswiki flowers](https://thegameswiki.com/pokopia/wiki/flowers-and-plants)). Smooth Rock can still dry them.

**Berry trees**
- [Measured] One berry appears per hour, up to **3**. Berries form even when the tree stands in water. Fallen berries land on one of **6 fixed spots** set by the tree's orientation when first planted (visible from its look). Two diagonal spots catch up to 2 tiles out; the other four catch 1 tile out, including diagonals. Height: a living tree's collision is 3 blocks + α, a withered one's 1 + α — [kyu49 木](https://kyu49.github.io/Pokopia/tree/)
- [Guide] Berries regrow 1 an hour, at most 3 per tree. Headbutt with a timed critical gives +1. A packed grove lets one headbutt drop berries from up to **10 trees** at once. Each save has Leppa plus one random second berry tree growing natively — [GameWith きのみ](https://gamewith.jp/pocoapokemon/548099); [Game8 きのみ](https://game8.jp/pocoapokemon/768279)
- [Guide] Game8 shows a berry tree refilled "about 7 hours" after its berries dropped. This conflicts with the 1-per-hour figure, though a photo taken 7 h later fits a tree already full at 3 — [Game8 きのみ](https://game8.jp/pocoapokemon/768279)
- [Official] Leppa tree: "Berries that fall from its branches are sure to grow back after a while." — [Serebii Leppa tree](https://www.serebii.net/pokemonpokopia/items/leppatree.shtml)
- [Guide] Berry seeds: Lum and Pecha in Rocky Ridges, Aspear and Chesto in Bleak Beach, Rawst in Sparkling Skylands, from red Poké Balls. Cutting a tree down to its stump also gives seeds. You can't plant a berry itself — [Game8 きのみ](https://game8.jp/pocoapokemon/768279); [GameWith きのみ](https://gamewith.jp/pocoapokemon/548099)

**Trees, stumps and transplanting**
- [Guide] Trees fully grow 3 days after planting. Grow on the planting day and the next day finishes them the next day. Cutting gives small logs and leaves; cutting the stump gives seeds. Magnet Rise (hold Y) moves a tree whole, after the ending. Hedges move with Rototiller. 3D-printing a tree costs 1 Rare Pokémetal — [GameWith trees](https://gamewith.jp/pocoapokemon/548662); [Game8 植え替え](https://game8.jp/pocoapokemon/769112)
- [Official] Leppa tree stump: "It looks like it would make a great seat". It breaks into Leppa seeds + Leaf. Leppa tree sapling: "In time, it will mature into a fruit-bearing tree" — [Serebii stump](https://www.serebii.net/pokemonpokopia/items/leppatreestump.shtml); [Serebii sapling](https://www.serebii.net/pokemonpokopia/items/leppatreesapling.shtml)
- [Unverified] Bulbapedia: a pointy tree sapling grows into a tree "in a few days". No source says whether a stump regrows into a tree by itself — search summary (Bulbapedia Pointy tree stump)

**Flowers and colours**
- [Guide] Five colours exist per flower and hedge type, and six berry trees in total. Each save grows the standard one plus one random colour of each, and one random second berry. Other colours come from visiting islands or Cloud Islands (photograph and 3D print), the Daily Shop, Pokémon trades and seed gifts. No breeding is described — [Serebii Flowers & Plants](https://www.serebii.net/pokemonpokopia/flowers.shtml)
- [Guide] The flower challenge "いろいろな種類の花を咲かせよう" needs 12 flower kinds planted in Palette Town; colours count separately and hedges don't count. Its reward, Cream soda, unlocks a Vaporeon habitat — [Game8](https://game8.jp/pocoapokemon/768713)
- [Guide] Regional flowers: はらっぱのはな (Wildflowers), いわばのはな (Mountain flowers), うみべのはな (Seashore flowers), うきしまのはな (Skyland flowers). うつくしいはな and エレガントなはな come from the Eevee- and Clefairy-doll Dream Islands — [Game8](https://game8.jp/pocoapokemon/768713)

**Grass**
- [Guide] Tall grass in the green, yellow, red and pink styles (みどり/きいろ/あかい/ピンクのくさ) is lifted with Rototiller from existing patches. Flavour texts tie yellow to the seaside, red to mountains and volcanoes, and pink to the sky islands. Young-grass (わかくさ) variants differ by area — [GameWith 草一覧](https://gamewith.jp/pocoapokemon/548655)
- [Guide] Grass is created with Leafage one square at a time. Nothing describes it spreading by itself — search summary ([rankedboost grass](https://rankedboost.com/pokopia/guides/how-to-grow-grass/))

### Inferences
- The planner can treat grass, flowers and hedges as static once placed. Only these change on their own:
  - dry/green state (water revives; rain revives dry grass blocks; Smooth Rock dries);
  - growth stage;
  - berry stock (0–3, +1 an hour).
- Berry-yield estimate: about 3 berries per tree every 3 hours of play, plus 1 per headbutt with a critical. Fallen berries need a clear landing zone of 1–2 tiles around the trunk.

### Gaps
- Weeds: no weed mechanic was found.
- Stump regrowth: not documented.
- Whether Leafage's grass colour depends on the area, the soil block or the season was not confirmed.
- Whether plants wither on their own (without Smooth Rock) after days unwatered is only stated vaguely ("may wither", gamepedia).

## 6. Weather, time, seasons, area effects; plants and habitat environment values

### Takeaway
Time matters through the 05:00 day change (growth) and hourly berry regrowth. Rain waters ground, stops Smooth Rock and revives dry grass blocks. No source mentions seasons or temperature affecting growth. The planner's environment values are **confirmed by ccopedia's in-game test** (14 Oct 2026): tall grass, flowers, hedges, crops, duckweed and vines +2.5 humidity per tile; trees +5. There are refinements: crops count only from the sprout stage; moss and dry plants count 0; grass blocks +1; dry grass blocks −0.5.

### Cited Findings
- [Guide] The in-game day changes at 05:00, not midnight, and that is when plants advance a stage — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Guide] Rain gradually moistens dry ground and withered trees. Weather changes which Pokémon appear (Ho-Oh in sun, Lugia in cloud or rain) and changes comfort for Humid- and Dry-loving Pokémon — [Game8 天気](https://game8.jp/pocoapokemon/768195)
- [Measured] Humidity points (うるおいポイント):
  - **1**: grass block
  - **2.5**: all grass (くさ全般), duckweed, ツル, ぐるぐるツタ, all flowers, all hedges, **crops at sprout stage or later**, potted plants (うえ木系), vases with flowers
  - **5**: all trees, Chansey plant
  - **20**: water, muddy water, hot spring, waterfall, sink, toilet, washbasin, shower
  - **100**: a running sprinkler, a filled water basin, a running bubble machine, bathtub, humidifier, Damp Rock and others
  - **−0.5**: dry grass block
  - **0**: moss, moss soil, dry grass plants (枯れたくさ全般), dry wildflowers, cracked soil, the planter itself (plants in it count), flower decorations that aren't live plants
  - **Rain**: itself 0
  - Source: [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Measured] Thresholds: humid at 100+ and dry at 30 or less for habitats and block houses; humid at 40+ and dry at 60 or less for kit houses. Habitats count humidity across ±4 vertically. Wild grass, flowers and trees around an outdoor habitat easily pass 30, so Dry-loving Pokémon do better in houses. A wheat patch flips nearby homes between dry and humid, −2.5 per tile at harvest and +2.5 per tile at sprouting — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- [Guide] Growing grass with Leafage, reviving plants with Water Gun and building the flower habitat 花いっぱいの景色 (8 flowers in a row) all raise a town's humidity — [Game8 うるおい](https://game8.jp/pocoapokemon/767324); [Game8 このは](https://game8.jp/pocoapokemon/768189)
- [Guide] Sprinklers raise a town's humidity — [Game8 sprinkler](https://game8.jp/pocoapokemon/769157)
- [Guide] ccopedia notes that Slowpoke's Yawn humidity reading also depends on other things, such as the total grass and water area on the minimap — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)

### Inferences
- The planner's code gives Nature sub-categories Tall grass, Flowers, Hedges and Crops, plus Duckweed, Flowering duckweed, Vine and Dense vines, a value of +2.5. Trees except stumps get +5, dry items are excluded, and Moss is not listed. This matches ccopedia. Two refinements:
  - a crop tile only counts from the sprout stage, so a freshly planted or just-harvested wheat tile counts 0;
  - the planner should not add humidity for planters themselves.
- Since a running sprinkler or filled basin is +100 on its own, any habitat with a sprinkler in range is "humid" automatically.

### Gaps
- No source mentions seasons, temperature or warmth affecting plant growth, or light needs for crops. No source says whether farm-soil blocks themselves add humidity. ccopedia lists grass blocks (+1) but not farm soil.

## 7. Community numbers, efficient layouts, quirks and update changes

### Takeaway
The standard efficient farm uses one buried or pier-mounted sprinkler on water. It covers a radius-5 diamond (61 tiles, about 60 plantable), or four sprinklers cover a 10×10. One Grow resident and optionally one Water resident with a basin live in a Fresh veggie field habitat beside it. Harvest with powered Cut (3×6), then inhale. Watch the 511 crop cap and the 1024 growing-plant cap, and remember drops vanish on area change.

### Cited Findings
- [Guide] Layouts:
  - water + pier rows beside 2-wide field strips, any length;
  - a sprinkler with water beside it, in a diamond field;
  - Water Pokémon with a basin in the middle of 4-wide strips, so 8-field habitats repeat.
  All three perform about the same — [gamepedia layouts](https://gamepedia.jp/pocoapokemon/archives/2573)
- [Guide] Dig 1 tile in the centre and put water + a pier, then the sprinkler, so it is always wet. Add a second identical farm beside it if needed, but don't overbuild, because harvesting is manual — [Game8 automation](https://game8.jp/pocoapokemon/769942); [Game8 farming](https://game8.jp/pocoapokemon/767639)
- [Guide] The 10×10 four-sprinkler layout needs about 100 seeds — [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Guide] Build farms near your usual route (Pokémon Center or home), since you visit at least daily — [gamepedia farm](https://gamepedia.jp/pocoapokemon/archives/3026); [GameWith farm](https://gamewith.jp/pocoapokemon/545336)
- [Measured] Semi-automatic harvest designs (kyu49 harvest page, citing X @innocentroad and @kyuphd): Smooth Rock drops crops, then a stepped water channel or a fast-travelling Ditto vacuum (windmill + Reddit "horizontal fast travel") brings them in. Wheat does not drop this way — [kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)
- [Measured] Kyu49 berry semi-automation drops berries with Smooth Rock, or headbutts many trees at once and collects by hand — [kyu49 木](https://kyu49.github.io/Pokopia/tree/)
- [Measured] Water reach: 25 tiles along a trench (12 at low level). Lava reaches 12 (6 at low level). A waterfall resets the count. Duckweed floats up waterfalls like items — [kyu49 水](https://kyu49.github.io/Pokopia/water/); [Serebii Water](https://www.serebii.net/pokemonpokopia/water.shtml)
- [Official] Update changes that touch plants:
  - 2.0.0 (5 Aug 2026): Leafage reverts farm soil to normal soil; items can go on top of square plants; certain roof items now block water; Pokémon that dislike water may no longer cross duckweed/flowering duckweed (fix); underwater building/farming via Dive; Bubble machine, watermelon and sea grapes (Expansion Pass).
  - 1.1.0 (9 Jun 2026): the cap on powered items rose from 512 to 1024, which matters for Bubble machines.
  - 1.1.1 fixed areas misbehaving when too many items were placed past a limit.
  - Source: [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] The Grow and Water specialty pages and the underwater farming page were updated on 6–8 Aug 2026, after 2.0.0. The farming page on 22 Nov 2026. The sprinkler page on 29 Sep 2026 — page stamps on [Game8 Grow](https://game8.jp/pocoapokemon/767548), [Game8 水中栽培](https://game8.jp/pocoapokemon/804154), [Game8 farming](https://game8.jp/pocoapokemon/767639), [Game8 sprinkler](https://game8.jp/pocoapokemon/769157)

### Inferences
- Default planner numbers:

  | Parameter | Value |
  |---|---|
  | Stages from seed to ripe | 3 |
  | Stage-up | 1 per day at 05:00, +1 per day from Grow (no stacking) |
  | Regrowth after harvest | 1 stage (bean, tomato, potato); 3 stages (wheat) |
  | Yield | about 3 per ripe harvest |
  | Sprinkler | Manhattan radius 5, needs same-height water in range |
  | Water Gun | plus shape (powered: larger) |
  | Bubble machine | 3×3 |
  | Berry tree | +1 an hour, max 3 |
  | Tree growth | 3 days (Serebii: 4) |
  | Flower growth | 1 day |
  | Hedge growth | 2 stages |

  Show these as editable assumptions, with the conflicts (41 vs 61 tiles, 3 vs 4 days, 1–2 vs 3 refruit) flagged.

### Gaps
- No Reddit or YouTube measurements could be read (rankedboost, thegameswiki, Bulbapedia and Reddit were not reachable). English-language community numbers therefore rest on search summaries only.
- No patch note changed growth speed, yields or sprinkler range. If such a change happened outside the patch notes, it was not found.

# Budgets, edges and daily ticks drive Pokopia

Almost every hidden system in Pokémon Pokopia at Ver. 2.0.x comes down to a short list of fixed, whole-tile rules, so a grid planner can check a layout with flood fills, distance tests and box overlaps instead of simulating physics. **Liquids** are flood fills from the tile where Ditto spat them: along a 1-wide trench the four water-family liquids reach **25 tiles** and lava **12**, both halve at low level, the count resets at every drop, nothing ever evaporates, and deleting the source tile deletes the whole body. **Power** is a 3D Manhattan-distance graph in which generators give 5, 10–20, 20 or 30 units, a transmitter reaches devices within **10** tiles and other transmitters within **15** but never across a height gap of 6 or more, each transmitter serves at most **20** devices, and an overloaded network goes entirely dark. **Signals** are not wires but one-shot "change state" commands fired into fixed volumes (**11 cells** around a laser sensor, a **5×5×5** cube for a floor switch, **7×7×7** for a wall switch or card reader), and with no logic-gate items, all logic comes from doors, liquids and power states. **Crops** step up one stage at **05:00** only if their tile is wet, plus one stage a day from a Grow Pokémon that never stacks; a seed needs three stages, and a sprinkler waters a **61-tile diamond out to Manhattan distance 5**, but only if it has water at its own height inside that diamond, while muddy water, lava and flowing water never water anything. As for the rest of the world, weather is a per-town switch the player sets rather than a clock, fire never spreads, blocks have no gravity, and light, warmth and humidity are plain uncapped sums of per-item points judged against fixed thresholds. Almost none of this comes from Nintendo: it rests on community testers and guide sites, and fifteen rules still conflict, so the planner should expose those as editable settings and present circuit timing as plausible rather than guaranteed.

## Liquids are budgeted flood fills that vanish with their source

This report describes the game at Ver. 2.0.0 (August 2026, which added the Bubbly Basin expansion and Dive) and its 2.0.1 follow-up. No later patch note touches these systems, and the second DLC, Dazzling Decorations, is not due until 9 December 2026 ([Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585213)). Each claim carries an evidence label:

| Label | Meaning |
|---|---|
| **official** | In-game text or Nintendo patch notes, usually as transcribed by Serebii or a Japanese guide |
| **tested** | A named community test with numbers, chiefly from ぽこポケ学会 (kyu49), ccopedia and the note.com tester Rokina |
| **guide** | A strategy site's claim with no test shown |
| **unverified** | A search-result summary, a single forum post, or a page that calls itself uncertain |

### Five liquids exist, and a waterfall is a state rather than a sixth

The in-game list has exactly **five placeable liquids**, each paired with the vending-machine drink that stores it (official) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml); [GameWith 水源](https://gamewith.jp/pocoapokemon/547853)). ccopedia measured the environment values in October 2026, after 2.0.0. They apply **per tile with no radius**: a liquid tile counts only if it lies inside a home's counted band (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)).

| Liquid | Stored from drink | Sparkling ripples | Waters ground and crops | Humidity per tile | Warmth per tile | Natural pools (no drink needed) |
|---|---|---|---|---|---|---|
| Water (みず) | Fresh Water | yes | yes | +20 | 0 | Withered Wastelands, Rocky Ridges, Bleak Beach, Sparkling Skylands, Palette Town |
| Ocean water (うみのみず) | Soda Pop | no | no "does not hydrate" note | +20, untested ("probably") | 0 | Withered Wastelands, Bleak Beach, Palette Town |
| Muddy water (どろみず) | Moomoo Milk Coffee | no | **no** | +20 | 0 | Bleak Beach only |
| Hot-spring water (おんせん) | Roserade Tea | no | no "does not hydrate" note | +20 | **+30** | Rocky Ridges, left-hand cave |
| Lava (マグマ) | Chili Sauce | no | **no**, and it damages Ditto | 0 | **+60** | Rocky Ridges, central cave behind mesh that needs powered-up Cut |

The locations come from GameWith's pages on [hot springs](https://gamewith.jp/pocoapokemon/548208), [muddy water](https://gamewith.jp/pocoapokemon/548909) and [lava](https://gamewith.jp/pocoapokemon/548922).

Two properties that sound alike are in fact separate. When Serebii says muddy water "does not hydrate the area", it means mud cannot wet dry ground or crops, and ぽこポケ学会 agrees that mud "doesn't moisten crops" (tested) ([kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)). Yet ccopedia measured the same muddy water at **+20 humidity points**, exactly like plain water. A planner therefore needs a separate `hydrates` flag beside each liquid's humidity value.

A **waterfall is not a material**. GameWith defines it as any place where liquid runs from top to bottom, and says a height difference of **one level or more** makes one (guide) ([GameWith 滝](https://gamewith.jp/pocoapokemon/549075)). 攻略大百科 instead says a habitat waterfall needs **at least 5 levels** (guide) ([攻略大百科](https://gamepedia.jp/pocoapokemon/archives/4039)). The two claims may answer different questions: whether a fall exists, and whether it counts for a habitat. ccopedia found that **each falling cell is worth +20 humidity**. A habitat counts ±4 levels, so a fall of 5 or more reaches 100 on its own; a block house counts only −1 to +3, so at most 4 cells of a fall count there, for 80 (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)). The planner's separate "Waterfall" liquid should become a derived **falling** flag on any liquid column, while the habitat check for "たき ×1" stays. Lava can fall too, as ぽこポケ学会's lava-waterfall item lift shows, but no one has tested whether a lava, ocean or hot-spring fall satisfies a waterfall habitat.

### Ditto's ちょすい places, copies and deletes every liquid

Every liquid is stored and placed with Ditto's ちょすい (Stockpile Water):

| Action | Input | Effect |
|---|---|---|
| Store | Hold Y and press ZR, in or beside a liquid | Stores that liquid. You don't need to be inside it, and the stored liquid can be spat out endlessly |
| Spit | A | Creates a **primary source** at that tile |
| Set height and level | ZL + D-pad | Up and down move the placement from **2 below to 2 above** (5 positions); left and right set the level, normal or low |
| Discard | B | Swallows the stored liquid and destroys it |
| Use a drink | Use a vending-machine drink | Stores its liquid at once |

Spat liquid must touch a block or another liquid ([GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml); [攻略大百科 建築テクニック集](https://gamepedia.jp/pocoapokemon/archives/5901)). Each powered vending machine gives **one random drink per day** (guide) ([GameWith 温泉](https://gamewith.jp/pocoapokemon/548208)). Ver. 2.0.0 changed ちょすい in two ways (official) ([Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml); [GameWith Ver.2.0.0](https://gamewith.jp/pocoapokemon/547086)). A **short press now stores a liquid without removing it**, so any liquid tile has become an endless source to copy from, and spat liquid now **matches the surrounding water level automatically**.

You cannot change map while holding a liquid. Hot-spring water, muddy water and lava each exist naturally in only one town, so anywhere else they have to come from drinks (guide) ([GameWith 水源](https://gamewith.jp/pocoapokemon/547853)).

A liquid's identity is its source tile. GameWith says "一度作った水源は自然に消えることはありません" (a placed source never disappears on its own). Sucking the spat tile back up, or placing a block over it, deletes the whole flow (guide) ([GameWith 水源](https://gamewith.jp/pocoapokemon/547853); [Game8 JP 水源](https://game8.jp/pocoapokemon/768146)). No source found a cap on liquid sources, and ぽこポケ学会's limits page lists none ([kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/)).

Two other claims change nothing in this model. **Water Gun (みずでっぽう) is not a source**: it only sprays a plus-shaped patch that wets ground, revives plants, puts out fires and cools lava (guide) ([GameWith みずでっぽう](https://gamewith.jp/pocoapokemon/547665)). And the **"2×2 self-replenishing pit"** comes from a single English wiki summary that reads like Minecraft's rule. No Japanese source or Serebii supports it (unverified) ([thegameswiki](https://thegameswiki.com/pokopia/wiki/water-sources-and-waterfalls)).

### Reach is 25 tiles for water and 12 for lava, and each drop resets it

ぽこポケ学会 measured a fixed reach along a trench, counting the source tile: "マグマ以外は25マスまで届く。水位を下げると、12マスまで届く。マグマは12マスまで届く。水位を下げたマグマは6マスまで届く。滝を作るとリセットされる" (everything but lava reaches 25 tiles, or 12 when lowered; lava reaches 12, or 6 when lowered; a waterfall resets the count). A lowered liquid also flows with half the original's strength (tested) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)).

| Liquid and level | 1-wide trench (source + flow) | Flow budget after source | Open flat ground (Serebii) |
|---|---|---|---|
| Water family, normal | **25** | 24 | roughly circular puddle, about 6 tiles each way |
| Water family, low | **12** | 11 | circle about 7 tiles wide |
| Lava, normal | **12** | 11 | smaller puddle that spreads "a lot slower" |
| Lava, low | **6** | 5 | circle about 5 tiles wide |

The open-ground figures come from [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml).

**Width cuts reach sharply.** GameWith measured a 1-wide channel at 25 tiles (source plus 24) and a 2-wide channel at only **10** (source plus 9). After a one-level step down, the same channels carried **24** and **9**, and a 3-wide channel also carried 9 (tested) ([GameWith 水源](https://gamewith.jp/pocoapokemon/547853)). Serebii describes the same loss as reach falling "by two" for each extra open side, down to about a 6×6 area (guide).

Shapes also depend on **build order**. A 1-wide channel that fills first and is widened afterwards keeps its full 25-tile reach. Building a step before or after the water flows moves the side columns' reach by a tile. ぽこポケ学会 sums it up as "水は埋め直すことで挙動が変わる" (refilling water changes how it behaves). A planner that stores only finished layouts cannot reproduce these cases exactly.

**Drops reset the budget.** Where a liquid lands after falling, the landing tile becomes a **secondary source** of the same liquid and level. Serebii: "If a bit of water goes 23 blocks, hits a drop and then starts again, it will act fresh." Removing a secondary source does not permanently remove the water (guide) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)). Water also slips through **diagonal gaps between blocks that touch only at a corner**, so it spreads in all 8 directions (guide).

Normal-level water is **drawn to cliffs**. A source placed within **4 tiles of a drop** does not spread at all. It runs a straight **2-wide line** to that drop, or to every drop at once if several are equally close. Lava starts toward a drop but begins spreading again from its second tile, forming a small puddle, so despite its shorter range it can reach more drops and cover more ground than water. Low-level liquid never seeks cliffs and always spreads in a circle (guide) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)).

No source gives a spread rate in tiles per second. Liquids never drain either, so a planner can ignore time when validating a layout. The simplest faithful model is a breadth-first flood from each source. It starts with a budget of 24 tiles for water or 11 for lava (11 or 5 at low level), loses budget as the frontier widens, and gets a fresh budget at each drop. Because channel shapes depend on build order, the planner should report "this channel may stop near tile N" rather than promise an exact shape.

### Flows overwrite each other in a fixed order but never a source

When two flows meet, **the later one overwrites the earlier**. Serebii's example is ocean water poured on a cliff above fresh water: it takes over part of the fresh water, and the rest once the fresh source is removed. A **source tile, however, can never be overwritten by another liquid** (guide) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)). ぽこポケ学会 gives a priority order of **muddy > ocean > hot spring > water**, though its editor admits to being unsure ("編集者がよく分かってないけど"). Where lava fits in that order is unknown (tested, flagged) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)).

**Mud contaminates everything downstream.** Water that passes over a mud-covered block or a こんもりどろ (mud mound) becomes muddy water below that point (tested) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)). This matters because muddy water stops watering crops while still counting toward mud habitats.

**Water Gun turns lava into walkable black rock (くろいいわ).** It also turns the block マグマいわ (magma rock) into くろいいわ (guide) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml); [GameWith マグマいわ](https://gamewith.jp/pocoapokemon/548417); [GameWith くろいいわ](https://gamewith.jp/pocoapokemon/550903)). Several posts say the lava source keeps flowing and can spread back over the new rock until the source itself is sucked up or covered (unverified) ([知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13326798233); [X @kanipan666](https://x.com/kanipan666/status/2035220147460612557)). The evidence that flowing water, rather than Water Gun, converts lava is weaker still (unverified) ([ぶらりネット下車の旅](https://news.tcg-bloglife.com/entry/2026/04/24/120122)). The planner should flag lava next to water rather than convert it automatically.

Liquids also act on things around them. Water puts out fire, and a submerged plant stops growing (guide) ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)). Lava hurts Ditto on contact, and falling into it fades the screen to black and returns Ditto to nearby footing (guide) ([GameWith マグマ](https://gamewith.jp/pocoapokemon/548922)).

Items float and ride the flow, and a waterfall carries them upward, but only so far: "長い滝を作っても、アイテムは14マスまでしか浮かび上がらない" (however long the waterfall, items rise only 14 tiles). That is **at most 14 tiles per waterfall**, though lifts can be chained (tested) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)). Duckweed (うきくさ) rises the same way and can carry a Ditto standing on it. Put duckweed on water at least 2 deep, then drain the water, and the duckweed stays in mid-air as a walkway at most 1 tile up (tested) ([kyu49 デザイン](https://kyu49.github.io/Pokopia/design/)).

Liquids also trigger sensors, both when they arrive and when they vanish (see the signals section). Liquid that is spreading keeps a nearby Smooth Rock (さらさらいわ) from restarting after rain (tested) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)). No source covers water freezing, ice melting, or lava burning plants or wood.

### Doors, roofs and kit houses decide where liquid may sit and what it counts for

Whether something holds water depends on the item (tested) ([kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)):

| Item or joint | Water behaviour |
|---|---|
| Any door | Blocks water when closed, passes it when open |
| Closed door touching a block only at a corner | Does not leak |
| Two ordinary blocks touching only at a corner | **Leak** |
| Underground hatch (フタつきまど・じめん) | Counts as set in the tile above, so when closed it seals that tile |
| Sash window (あげさげまど), open | Passes water through both its upper and lower tile |
| Simple curtain (シンプルカーテン), closed | Blocks water and stops floating items sideways, but lets them pass vertically |
| Certain roof items | Block water since Ver. 2.0.0; before that they let it through. Which roofs is not listed (official) ([Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)) |

Because two blocks meeting at a corner leak, a planner's watertightness check must look at all 8 neighbours, not 4.

Water and other structures can share space. A pier laid on flowing water leaves the flow untouched (guide) ([GameWith 水源](https://gamewith.jp/pocoapokemon/547853)), and a built house may sit underwater or in lava (tested) ([kyu49 家と住み心地](https://kyu49.github.io/Pokopia/house/)). Kit houses take no blocks or liquids inside at all, so a kit interior never holds liquid (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)).

Inside a built house, liquid counts for the environment only on floor and door cells from **−1 to +3**:

| Liquid position | Counts |
|---|---|
| Under a door | yes |
| One level below the floor | yes |
| Two or more levels below the floor | no |
| Under a wall, including lava in a trench under the wall | no |
| Outside the walls, even one tile out | no |

So **five water tiles** (5 × 20 = 100) make a house humid, and **one lava tile** (+60) makes it warm by itself (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)).

Habitat recipes ask for specific liquids. Two of them conflict with the planner's `data.json`:

| Habitat | Liquid requirement | Other parts | Sources |
|---|---|---|---|
| Training waterfall (修行の滝) | **Water ×2** (planner stores 1; Vandal says 1) | seat, waterfall ×1 | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/trainingwaterfall.shtml); [GameWith 滝](https://gamewith.jp/pocoapokemon/549075) |
| Waterwheel spot (水力はつでん所) | Water ×2 | hydro generator on the surface below a waterfall ×1 | [GameWith 滝](https://gamewith.jp/pocoapokemon/549075) |
| Illuminated waterfall (照らされた滝) | Water ×3 | stepping stones ×3, torch ×2, waterfall ×1 | [GameWith 滝](https://gamewith.jp/pocoapokemon/549075) |
| Hot-spring shower / Mossy hot spring / Open-air bath / Harmonious hot spring | Hot spring ×2 | shower + seat / moss ×4 / spout / spout + basin | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
| Hot-spring fishing spot | Hot spring ×1 | rod, seat | [GameWith 温泉](https://gamewith.jp/pocoapokemon/548208) |
| Piping-hot lava (マグマでアツアツ) | Lava ×2 | アツアツいわ ×1 | [GameWith マグマ](https://gamewith.jp/pocoapokemon/548922) |
| Magma fishing spot | Lava ×1 | rod, seat | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/magmafishingspot.shtml) |
| Marshy tall grass / Muddy playtime / Muddy spa | Muddy ×2 | yellow grass ×4 / Inkay toy, towel rack, logs / long seat, Gyarados fountain, bath set | [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
| Marsh fishing spot | **Muddy ×1** (Serebii) or **×2** (GameWith) | rod, seat | [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/marshfishingspot.shtml); [GameWith 泥水](https://gamewith.jp/pocoapokemon/548909) |
| Fishing pond / Ocean fishing spot | Water ×1 / Ocean ×1 | rod, seat | [Serebii habitats](https://www.serebii.net/pokemonpokopia/habitats.shtml) |

## Power travels a 3D Manhattan graph, and signals are toggles fired into boxes

### Generators give 5 to 30 units, and one overload darkens the whole network

A generator's output is the number of 1-unit devices it can run. Connect more than that and power stops flowing altogether (guide) ([Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml); [GameWith 電気](https://gamewith.jp/pocoapokemon/547762); [攻略大百科 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588)).

| Generator | Units | Runs when | Unlock and recipe |
|---|---|---|---|
| Mini generator (ミニはつでんマシン), 1×1×1 | **5** | always | Sparkling Skylands Lv 6 shop recipe; Pokémetal ×1 |
| Windmill kit (風力) | **10**, or **20** on high ground | always | 300 coins; lumber ×5 + twine ×5 |
| Waterwheel kit (水力) | **20** | liquid touches its gear and it turns | 300 coins; lumber ×15 + stone ×5 |
| Furnace kit (火力) | **30** | while fuelled with lumber or food | 300 coins; iron ore ×15 + sea-glass ×5 |

**High ground** means an absolute height of about **45 tiles above the map's unbreakable floor**, or **47 in Rocky Ridges**. A spot that high counts even in a cave where the wind effect never shows (tested) ([Game8 JP 高台](https://game8.jp/pocoapokemon/769075)). The waterwheel runs in any pooled liquid, including lava, mud and hot springs (guide) ([GameWith 電気](https://gamewith.jp/pocoapokemon/547762)). No source gives the furnace's burn time per fuel item. The charging station shows up to **40 connected units, 8 per light**, and no battery item stores power over time (guide) ([Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)).

**Every powered device draws 1 unit**, except String lights and Surface lights, which draw 0 (guide) ([Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)). ぽこポケ学会 lit more than 100 illumination lights without a shortage. Those lights still count toward each transmitter's 20-device limit and toward the powered-item cap (tested) ([kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)).

**Interconnected transmitters pool all their generators.** A standalone transmitter with its own mini generator cannot share its 5 units with anything else (tested) ([note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)). When draw exceeds supply, Serebii says there is "a short and all items will lose power in the circuit", and Rokina's overloaded mini generator lit none of its lanterns. The planner should therefore switch off the whole connected network, not just the devices over the limit. No one has yet tested a mixed grid.

### Transmitters reach 10 tiles to devices and 15 to each other, never across 6 levels

Rokina's tests define the geometry precisely (tested) ([note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb); [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml); [GameWith 電気](https://gamewith.jp/pocoapokemon/547762)). Distance is **3D Manhattan between block centres**, |Δx| + |Δy| + |Δz|, and **a height difference of 6 or more never connects**, however close.

| Link | Max distance | Height limit | Obstacles |
|---|---|---|---|
| Generator → transmitter | **10** | Δz ≤ 5 | a pole's wire is blocked by anything in its path |
| Transmitter → transmitter | **15** | Δz ≤ 5 | blocked for pole wires; wireless ignores obstacles |
| Transmitter → device | **10** | Δz ≤ 5 | ignored by every transmitter type |

Rokina's edge cases pin down the limits. Two transmitters connect at distance 15 but not 16. On a diagonal, a 6×6 gap (7 + 7 = 14) connects but a 7×7 gap (8 + 8 = 16) does not. A generator reaches a transmitter across a 4×4 diagonal gap but not a 5×5 one. Each transmitter serves **at most 20 devices** and links directly to only **one generator**, so every generator needs its own transmitter.

A pole measures distance from its **foot tile**, even though it is 3 tiles tall and its wire hangs from the top. A kit generator measures from its bottom front-left tile, as seen when placing it (guide) ([GameWith 電気](https://gamewith.jp/pocoapokemon/547762)). The recommended relay grid follows: a transmitter every 14 tiles along each axis, every 7 + 7 on diagonals, and one wireless relay 5 above another to gain height. Only GameWith's utility-pole page gives 7 tiles for generator to pole. Rokina's test, Serebii and GameWith's own electricity page all say 10 ([GameWith でんちゅう](https://gamewith.jp/pocoapokemon/548211)).

Obstacles matter only for pole wires (guide) ([GameWith でんちゅう](https://gamewith.jp/pocoapokemon/548211); [GameWith 無線送電機](https://gamewith.jp/pocoapokemon/549115)). A pole-to-pole or generator-to-pole wire fails if a block sits in its path, but a wall built after the wire connected leaves it working. A pole reaches its devices through walls, so poles and generators can be buried. Wireless transmitters ignore obstacles entirely and work underground, though burying one a level down uses up 1 tile of its upward reach (tested) ([note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)). Windmills and waterwheels accept a pole only on the side with the yellow protrusion.

The transmitter a device joins seems to be fixed when it is placed. That is why ぽこポケ学会's dummy-transmitter trick works, and why the planner should warn whenever a device sits in range of two transmitters (tested, partly unverified) ([kyu49 future plan](https://kyu49.github.io/Pokopia/future_plan/)).

Buildings follow their own rule. Kit dens and huts cannot be wired from outside, although a mini generator placed inside powers everything there. Houses of "〇〇のいえ" size or larger do take outside power, and then everything inside them is powered (guide) ([Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml); [GameWith 電気](https://gamewith.jp/pocoapokemon/547762)).

A **Generate (はつでん)** Pokémon powers nearby machines with no wiring at all, but only until **05:00 the next day**, or until the item is picked up. That rules it out for registers and vending machines (guide) ([攻略大百科 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588); [Game8 EN electricity](https://game8.co/games/Pokemon-Pokopia/archives/586144)). Nobody has measured its range in tiles.

### Four input items send one-shot commands into fixed volumes

Only four items act as inputs. No light, timer, weather, water-level or Pokémon-type sensor appears in any item list ([Game8 EN utilities](https://game8.co/games/Pokemon-Pokopia/archives/586408); [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)).

| Input | What triggers it | What it watches | Where its command goes | Behaviour |
|---|---|---|---|---|
| Laser sensor (センサー) | Any change in its watched tiles | **2 tiles** ahead of its red face (GameWith, 攻略大百科), or **1** (ぽこポケ学会's diagram); it sees past items in between | **11 cells**: left, right, behind and its own column, each at z−1, z and z+1 (4 × 3 − 1) | One-shot per change |
| Floor switch (ゆかつきスイッチ) | Weight from Ditto or walking Pokémon; floating ones such as Geodude don't press it | Its own tile | **5×5×5 cube** centred on it (±2) | Pressing always opens doors in range; shortly after release it closes **every** open door in range |
| Wall switch (カベつきスイッチ) | Ditto pressing it; Pokémon never touch it | — | **7×7×7 cube** (±3) | Toggles each target |
| Card reader (カードリーダー) | A key card or Pokédex | — | **7×7×7 cube** | Toggles, like the wall switch |

Sources: [kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/); [kyu49 センサー矢印](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/sensor-arrow/); [GameWith センサー](https://gamewith.jp/pocoapokemon/549488); [攻略大百科 回路向き](https://gamepedia.jp/pocoapokemon/archives/3447); [Game8 JP 回路](https://game8.jp/pocoapokemon/768968).

Since Ver. 1.1.0 the game shows a sensor's detection range while you place it (official) ([攻略大百科 Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597)). The sensor recipe unlocks at Environment Lv 6 in the Rocky Ridges shop, for 1,000 coins ([GameWith センサー](https://gamewith.jp/pocoapokemon/549488)).

A sensor reacts to **all Pokémon, Ditto, liquids and some furniture**. It fires on changes, not states, and each kind of thing triggers it at a different moment (tested) ([kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/); [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)):

| Detected thing | When the sensor fires |
|---|---|
| Liquid | When it spreads in, and again when it vanishes |
| Toy blocks | On every move, with a short cooldown |
| Appliances, alarm clock | Only when they turn **on** |
| Air conditioner | It cycles on → on → off, so only one press in three is seen |
| Pinwheels, weather vane, ship's wheel | Only at the start of their motion |
| Rowlet clock | It moves by itself on the hour, but only while you are in that area |
| Horsea fountain | Not when it dries up, unlike flowing water (guide) ([攻略大百科 回路向き](https://gamepedia.jp/pocoapokemon/archives/3447)) |
| Another sensor | Never, because a sensor's body doesn't move when it fires. A chain needs a moving object in between, such as a hatch window, a door or toy blocks |

GameWith's berry harvester relies on that last rule. It relays a single wall-switch press down a 16-tile machine by chaining **sensor → hatch window → sensor four times** ([GameWith 自動化](https://gamewith.jp/pocoapokemon/549091)).

Signals are separate from electricity. They **need no power, arrive with no delay, and use no wires or channels**; position is all that matters (tested) ([GameWith 回路の作り方](https://gamewith.jp/pocoapokemon/548990)). Anything with an on/off or open/closed state responds if it sits inside an input's output volume:

| Output | Response to a command |
|---|---|
| Doors and windows | Open or close |
| Powered appliances and lights | Toggle (official text) ([Serebii](https://www.serebii.net/pokemonpokopia/items/wirelesspower-transmitterswitch.shtml)) |
| Switch transmitters | Cut or restore power to every device they serve |
| Mini floodgate | Starts or stops water |
| Music mats | Sound |
| Tidal and clear bells (うみなりのスズ, とうめいなスズ) | Ring, since Ver. 2.0.0 (official) ([攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)) |
| Fiery Magby statue (by floor switch) | Breathes fire, which can light an oven or campfire (guide) ([GameWith ゆかつきスイッチ](https://gamewith.jp/pocoapokemon/548702)) |

Multi-tile doors move their whole footprint at once: a wooden gate 2 tiles, a large wooden door 2×2, an iron door 3 tall by 2 wide, a shutter 3×3. That lets them reach sensors further away or on other levels (tested) ([kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)).

Wandering Pokémon open hatch windows, shutters and simple curtains, but never touch underground hatches, sash windows or wall switches, so a circuit that must not be disturbed should use those. Automatic doors need power and stay shut without it, though they still count as a house door. What opens them has not been documented.

### Logic emerges from power states, door cooldowns and liquid travel

**No logic-gate items exist.** Every gate is built from three rules about powered and unpowered items (tested) ([kyu49 信号の出力条件](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/signal-output/)):

| Rule | Behaviour |
|---|---|
| Unpowered items | Emit a signal when they go from stopped to running, and none when they stop |
| Powered items without power | Cannot change state at all, even when ordered to |
| Regaining power | Emits a signal on its own if the item was left set to running |

The full transition table for a powered item:

| Transition (powered item) | Signal |
|---|---|
| Unpowered + running → powered + running | **yes** |
| Unpowered + stopped → powered + stopped | no |
| Powered + stopped → running | **yes** |
| Powered + running → stopped | no |
| Powered → unpowered | no |

From these rules the community has built feedback loops, AND gates, interlocks, an SR latch, a 16-frame delay, frequency dividers, half and full adders, BCD correction and a working calculator ([kyu49 ぽこあ回路図鑑](https://kyu49.github.io/Pokopia/circuit/logic_circuit/)). Most of their tile layouts survive only in embedded videos and X posts. Two items supply inversion and parity. An alarm clock is seen only when it turns on, so a chain of n clocks passes 1 signal in 2ⁿ, and the air conditioner passes 1 signal in 3 ([kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)).

Timing runs at **60 frames per second**. Each frame sweeps the world once, **north to south and west to east**, so an identical build can time differently depending on which way it faces (tested) ([kyu49 クロック以外の回路](https://kyu49.github.io/Pokopia/circuit/other_circuits/)). ぽこポケ学会's cooldown table gives no unit, but the site counts in frames elsewhere ([kyu49 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/)):

| Item | Can move again after | Detectable again after | Lag before detection |
|---|---|---|---|
| Alarm clock, model planet, washing machine, fan, ceiling fan, air conditioner | 0 | 1 | 0 |
| Wireless power-transmitter switch | 13 | 13 | 0 |
| **Hatch window (フタつきまど)** | **18** | **18** | 0 |
| Curtain | 24 | 24 | 0 |
| Toy blocks, sandbox | 0 | 31 | 1 |
| Sash window (あげさげまど) | 31 | 31 | 1 |
| Large wooden door, boat door | 36 | 36 | not checked |
| Mini floodgate | 67 | 67 | not checked |

The standard **liquid clock** takes a hatch window, a sensor on the far side of it facing away, and **seawater**. Plain water can spawn sparkles (キラキラ), and magma makes a slower clock. Water flows through the open window to the sensor, which closes the window. The water beyond then dries up, and the sensor, seeing it vanish, opens the window again (tested) ([kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)). Water paths therefore work as adjustable delays, though no one has published clock periods in seconds for a given channel length ([GameWith 回路の作り方](https://gamewith.jp/pocoapokemon/548990)). An "ultra-fast" clock of two sensors and four appliances fires every frame. Like every clock, it can stall when you change area, and running many of them destabilises the game.

Three quirks act at the scale of the map (tested) ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)):

| Quirk | Effect |
|---|---|
| Held-liquid burst | Water passing through some doors or fences becomes invisible to sensors. When it leaves, **every sensor that had seen it fires at once** |
| Map-cell limit | The game processes the map in **8×8-tile map cells**; sensors more than about **5×5 to 6×6 map cells** (40–48 tiles) away are left out of that burst |
| Smooth Rock | Spreading liquid stops Smooth Rocks in nearby map cells from restarting |

A planner can therefore check three things: that each target sits inside some input's output box, that each powered target sits on a powered network, and that each sensor's watched tiles hold something that can move. Simulating circuits frame by frame is out of reach.

## Crops step up at 05:00 only when their tile is wet

### A field is one tilled block, and planting has no spacing rule

A field (畑, farm soil) is a single ground block. **Rototiller (たがやす)** makes it from soil or grass, one tile at a time and only on moist ground. Barren, dry soil must be watered first, which matters on the dry ground of Withered Wastelands and Palette Town (official and guide) ([Game8 たがやす](https://game8.jp/pocoapokemon/768196); [Game8 farming](https://game8.jp/pocoapokemon/767639); [Serebii Barren soil](https://www.serebii.net/pokemonpokopia/items/barrenordinarysoil.shtml)). Each area's soil has its own farm-soil block, four in all, and watered tiles look darker. Since Ver. 2.0.0, **Leafage turns farm soil back into normal soil**, and items can sit on top of square plants (hedges) (official) ([Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)).

| Seed | Goes on |
|---|---|
| Crop seeds | Farm soil, a planter, or tilled sea floor in Bubbly Basin |
| Flower, hedge and tree seeds | Plain soil or grass |
| Seabed flower seeds | The sea floor or soil |

The table above comes from item text (official) ([Serebii Tomato seeds](https://www.serebii.net/pokemonpokopia/items/tomatoseeds.shtml); [Serebii Wildflower seeds](https://www.serebii.net/pokemonpokopia/items/wildflowerseeds.shtml); [Serebii Planter](https://www.serebii.net/pokemonpokopia/items/planter.shtml)).

No guide gives a spacing or adjacency rule for planting. The **Fresh veggie field** habitat forms from **8 fields**, which GameWith calls "隣接した8マス" (8 adjacent tiles), so guides lay farms out in multiples of 8 or in 4-wide strips (guide) ([GameWith farm](https://gamewith.jp/pocoapokemon/545336); [攻略大百科 farm layouts](https://gamepedia.jp/pocoapokemon/archives/2573)). No source says crops need light or open sky. Kit-house interiors cannot hold fields at all.

### Three stages ripen a seed, and only wheat restarts from seed

Every crop grows **seed → sprout → blooming (wheat: small) → ripe**. It moves up **one stage when the day changes at 05:00, not at midnight**, but only if its tile is hydrated, and a Grow Pokémon can add one more stage per day (guide) ([攻略大百科 畑](https://gamepedia.jp/pocoapokemon/archives/3026); [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)).

| Plant | Stages to finish | After harvest | Yield | Seed unlock |
|---|---|---|---|---|
| Bean (マメ) | 3 | plant stays; **1 stage**, about 1–2 fruit | about 3 | shop at Withered Wastelands Env Lv 3; Cloud Island Lv 3 |
| Tomato (トマト) | 3 | plant stays; regrows (stage count not stated, likely 1) | about 3 | Bleak Beach Lv 3; Cloud Island Lv 4 |
| Potato (ジャガイモ) | 3 | plant stays; regrows (likely 1 stage) | about 3 | Sparkling Skylands; Cloud Island Lv 5 |
| Wheat (コムギ) | 3 | **back to seed; 3 stages again** | about 3 | Rocky Ridges Lv 3; Cloud Island Lv 4 |
| Watermelon (スイカ, DLC) | seed → sprout → blooming → ripe | not stated | 1 melon, which Chop cuts into 3 slices | Bubbly Basin Lv 3; grows underwater with bubbles |
| Sea grapes (うみぶどう, DLC) | stalk only | not stated | not stated | grows underwater **without** bubbles |
| Flowers / hedges / trees | 1 / 2 / 3 stages | — | — | trees take 3 days (GameWith) or 4 (Serebii) |

Sources: [Game8 farming](https://game8.jp/pocoapokemon/767639); [Game8 たくさん野菜](https://game8.jp/pocoapokemon/768960); [GameWith farm](https://gamewith.jp/pocoapokemon/545336); [Game8 スイカ](https://game8.jp/pocoapokemon/804460); [Game8 水中栽培](https://game8.jp/pocoapokemon/804154); [Serebii Flowers & Plants](https://www.serebii.net/pokemonpokopia/flowers.shtml); [GameWith trees](https://gamewith.jp/pocoapokemon/548662).

The growth timeline follows from this. On 05:00 ticks alone, a seed planted on day 0 is ripe on the morning of day 3. With one Grow visit a day it is ripe on day 1: Grow on day 0, the 05:00 tick, then Grow again on day 1. After their first harvest, beans, tomatoes and potatoes refruit once a day, or twice with Grow, while wheat goes through the whole cycle again.

The "about 3" yield is Game8's rule of thumb that one seed gives 3 crops; only beans have a published refruit figure. Fresh carrots (たべごろニンジン) sometimes appear by themselves on unplanted ground, at no stated rate (guide) ([攻略大百科 畑](https://gamepedia.jp/pocoapokemon/archives/3026)).

Harvesting is manual. Y picks one plant. Cut takes the fruit and leaves the plant standing, and **powered-up Cut** (from bread) clears **3×6 tiles** at once, after which holding Y inhales the drops (guide) ([Game8 automation](https://game8.jp/pocoapokemon/769942)). **Dropped crops vanish when you leave the area**, and at most 512 dropped items persist at any time (tested) ([kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/)).

### Five things hydrate a field, and three liquids never do

| Hydration source | Area covered | Conditions |
|---|---|---|
| Still water beside the field | The touching tile, which the tree test suggests means orthogonal and at the same height | Must be **still**: "水流では作物が成長しません" (crops don't grow beside flowing water). Water, ocean or hot spring; never muddy water or lava |
| Sprinkler | **Manhattan radius-5 diamond: an 11×11 span of 61 tiles, its own included**; also waters the block above it | Needs a water tile **inside the diamond at the sprinkler's own height**; works buried or submerged; +100 humidity while running |
| Water Gun | Centre plus 1 tile each way (a plus shape); powered by soup and held, it spreads 2 tiles orthogonally and 1 diagonally | Manual, once per use. The powered shape reads as a radius-2 diamond of 13 tiles (my inference) |
| Water-specialty resident with a filled water basin | "Nearby fields and plants"; no tile range published | Fill the basin with Water Gun |
| Rain | Every exposed tile in the town | Unroofed tiles only |
| Bubbles (underwater only) | A powered Bubble machine covers **3×3**; Water Pokémon also blow bubbles on crops | Replaces hydration in Bubbly Basin |

Sources: [攻略大百科 畑](https://gamepedia.jp/pocoapokemon/archives/3026); [GameWith sprinkler](https://gamewith.jp/pocoapokemon/548144); [Game8 sprinkler](https://game8.jp/pocoapokemon/769157); [Game8 みずでっぽう](https://game8.jp/pocoapokemon/768019); [Serebii specialty](https://www.serebii.net/pokemonpokopia/specialty.shtml); [Game8 天気](https://game8.jp/pocoapokemon/768195); [Game8 水中栽培](https://game8.jp/pocoapokemon/804154); [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd).

**Muddy water and lava never hydrate.** Lava next to a crop even blocks hydration, "but it won't dry it out", and a submerged plant does not grow at all (guide) ([Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml); [Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)).

The sprinkler's diamond is contested:

| Source | Coverage |
|---|---|
| GameWith, 攻略大百科 | 61 tiles including the sprinkler's own |
| Serebii | "up to 60 blocks", excluding the centre |
| Game8 | The sprinkler "stops working 5 or more tiles from a water block", one tile stricter |
| ぽこポケ学会 | Points to a 41-tile, radius-4 figure |

Radius 5 is the majority reading ([Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml); [kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)). The standard efficient farm buries one sprinkler over a one-tile hole of water capped with a pier, or uses four sprinklers for a 10×10 plot (guide) ([GameWith farm](https://gamewith.jp/pocoapokemon/545336)).

The best evidence for which water counts as "beside" a plant is ぽこポケ学会's tree test (tested) ([kyu49 木の仕様](https://kyu49.github.io/Pokopia/tree/)):

| Water position relative to a dried tree | Revives it |
|---|---|
| Horizontally adjacent, at the tree's own height | yes |
| Beside the block under the tree, when that block reacts to water | yes |
| Two or more cells up the trunk (shallow water is fine) | yes |
| Directly below | no |
| Two tiles away | no |
| Diagonal | no |
| At the roots | no |
| Muddy water, anywhere | no |

### Grow adds one stage a day and never stacks

A **Grow (さいばい)** Pokémon advances a watered plant **one stage, once per plant per day**, and a sparkle marks the plant it has done. A flower needs only one stage, so it finishes at once. **Extra Grow Pokémon add nothing**, because the check runs once per crop per day, and Grow cannot move an unwatered crop (guide) ([攻略大百科 畑](https://gamepedia.jp/pocoapokemon/archives/3026); [Game8 さいばい](https://game8.jp/pocoapokemon/767548); [Serebii Vegetables](https://www.serebii.net/pokemonpokopia/vegetables.shtml)).

A Grow Pokémon that follows you works on its own. A Grow resident that lives by the field reportedly works too, but no source gives its range in tiles (unverified) ([pokemongo-raku](https://pokemongo-raku.com/post153023)). Rowlet lives in the Fresh veggie field ([Game8 さいばい](https://game8.jp/pocoapokemon/767548)), and Corsola tends watermelons ([Game8 スイカ](https://game8.jp/pocoapokemon/804460)). No fertiliser or crop-quality system appears anywhere.

Gather (しわける) Pokémon **do not pick up fallen crops or berries** (tested) ([kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)), and dropped crops vanish on area change, so harvesting cannot be fully automated. ぽこポケ学会's semi-automatic farm works around this. It kills ripe crops with Smooth Rock so they drop (wheat doesn't), then washes them down stepped water channels, since loose crops snag on dead plants.

### Smooth Rock, berry trees and per-area caps bound a farm

**Smooth Rock (さらさらいわ)** is a sprinkler in reverse. **Every 5 seconds it dries 10 tiles chosen from 41** (a radius-4 diamond), from **1 above to 2 below** the rock (tested) ([kyu49 畑](https://kyu49.github.io/Pokopia/harvest/)). It dries only the highest block in that range, so a block at +1 shields everything beneath (tested) ([X @aminisi](https://x.com/aminisi/status/2037509264559030467)).

Sources disagree on Smooth Rock's reach and on planters. ぽこポケ学会 says plants in planters are safe, but @aminisi says they dry, and GameWith's harvester page gives the rock a 6-tile radius and ±2 vertically ([GameWith 自動化](https://gamewith.jp/pocoapokemon/549091)).

Rain or sprinkler spray stops the rock, even under a roof (though not inside a kit house), and it restarts the moment they end. It does not restart near a running liquid circuit ([kyu49 水の仕様](https://kyu49.github.io/Pokopia/water/)).

**Berry trees** grow **1 berry an hour, up to 3**, even while standing in water, and a dried tree grows none. Fallen berries land on **6 fixed spots** set by the tree's facing when it was planted: two diagonal spots 2 tiles out and four spots 1 tile out, diagonals included. A timed critical headbutt adds 1 berry, and one headbutt can shake up to 10 trees in a packed grove (tested) ([kyu49 木の仕様](https://kyu49.github.io/Pokopia/tree/); [GameWith きのみ](https://gamewith.jp/pocoapokemon/548099)).

Plants also count toward humidity (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)):

| Plant or ground | Humidity points |
|---|---|
| Crops (from the **sprout** stage on), grass, flowers, hedges, duckweed, vines | +2.5 per tile |
| Trees | +5 |
| Grass block | +1 |
| Dry grass block | −0.5 |
| Moss, dry plants, the planter itself | 0 |

So harvesting wheat takes away 2.5 points per tile until the wheat sprouts again, and a wheat patch can flip nearby homes between dry and humid.

The planner should enforce these per-area plant caps (tested) ([kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/); [Serebii Flowers & Plants](https://www.serebii.net/pokemonpokopia/flowers.shtml)):

| What | Cap | Notes |
|---|---|---|
| Field crops | **511** | 576 on Cloud Islands. The warning appears only at the fruiting stage |
| Growing trees, flowers and crops combined | **1,024** | Fully grown and dry plants are not counted |
| Berry trees | **226** | Beyond this, trees can't be headbutted |
| Pointy trees | **251** | — |

## Weather, fire and terrain are switches, and the environment is plain addition

### Weather is a per-town setting that holds until overwritten

**Weather never changes with time.** The player sets it for each town through habitat "spots", and it holds until another spot overrides it (guide) ([ゲーム乱舞 天気](https://gameranbu.jp/pocoapokemon/6a0894affe6adbb58444); [攻略大百科 天気](https://gamepedia.jp/pocoapokemon/archives/4979); [tcg-bloglife](https://news.tcg-bloglife.com/entry/2026/03/09/022703)). The change lands about **10 seconds** after the dance. The only weathers found are sun, rain and a random, harmless cloudy; no source mentions snow, wind, storms or sandstorms (guide) ([gemukan](https://www.gemukan.com/pokoa-system-055/); [Game8 EN weather](https://game8.co/games/Pokemon-Pokopia/archives/585467)).

| Spot | Recipe | Pokémon that triggers it | Result |
|---|---|---|---|
| Rain Dance spot (あまごいスポット) | **2× Castform charm** (てるてるポワルン, rain face) + food on a plate | a Water (うるおす) Pokémon eats the food | Rain |
| Sunny Day spot (にほんばれスポット) | **2× Castform charm** (sun face) + food on a plate | a Burn (もやす) Pokémon | Sun |

Sources: [Game8 天気](https://game8.jp/pocoapokemon/768195); [kengomon](https://www.kengomon.com/pokoapokemon-sunny-rainy/). The charms also change humidity themselves: **+50** with the rain face showing, **−50** with the sun face (tested) ([ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)).

| Weather | Effects |
|---|---|
| Rain | Moistens unroofed dry ground and withered trees; turns dry grass blocks green at random unless a block shields them; puts out unroofed fires; sets Smooth Rock to 0 even under a roof (except inside a kit house); brings rare spawns, with Lugia in rain or cloud |
| Sun | Slowpoke's Yawn reads the town's moisture as **0** while it lasts; Ho-Oh appears |

Sources: [Game8 天気](https://game8.jp/pocoapokemon/768195); [GameWith 屋根](https://gamewith.jp/pocoapokemon/548162); [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd); [GameWith あくび](https://gamewith.jp/pocoapokemon/547219).

Rain itself adds **0** humidity points to a home. GameWith's claim that rain "raises humidity" most likely describes an indirect effect: rain turns dead grass blocks (−0.5) into grass (+1) and raises the separate town-wide score that Slowpoke's Yawn reports. That score's formula is unknown, except that the total grass and water area on the minimap matters.

**Time runs 1:1 with the console clock**, and the day changes at 05:00 (guide) ([Game8 日付変更](https://game8.jp/pocoapokemon/767333); [GameWith 夜](https://gamewith.jp/pocoapokemon/548015)):

| Band | Hours |
|---|---|
| Morning | 05:00–08:00 |
| Day | 08:00–17:00 |
| Evening | 17:00–19:00 |
| Night | 19:00–05:00 (one X post says 18:00) |

Changing the console clock currently carries no penalty. **Daylight ignores both time and weather** (tested) ([ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)), so the clock matters for spawns and growth ticks, never for environment scores.

### Fire needs a Burn Pokémon and a roof, and never spreads

Campfires, fireplaces, torches, candles, firepits, bonfires and the smelting furnace do nothing until lit. **A Burn (もやす) Pokémon lights them on its own when it is close**, and one waiting nearby relights a fire that has gone out (guide) ([GameWith もやす](https://gamewith.jp/pocoapokemon/547155); [Game8 EN Burn](https://game8.co/games/Pokemon-Pokopia/archives/585558)). Water puts fires out ([Serebii: Water](https://www.serebii.net/pokemonpokopia/water.shtml)), and so does **rain, wherever a fire has no roof over it**. A roof stops this: "たきびなど火がついた家具も屋根があれば火が消えません" (lit furniture such as a campfire doesn't go out under a roof). That is why the 3-campfire habitat あたたかな風に乗って needs a block roof (guide) ([GameWith 屋根](https://gamewith.jp/pocoapokemon/548162); [Altema](https://altema.jp/pocoapokemon/seisokuchi/8)).

**No source shows fire spreading** to grass, wood or items. The early-game Charmander habitat pairs a campfire with a tall-grass patch ([hyperts](https://hyperts.net/pokopoke/memo/)), and the one claim that Burn lights dry grass is unverified ([thegameswiki Burn](https://thegameswiki.com/pokopia/wiki/burn-specialty)). Nobody has measured how close a Burn Pokémon must stand. The planner needs only a lit/unlit state for each fire and a warning such as "unroofed: goes out in rain unless a Burn Pokémon lives beside it".

### Blocks float, ground changes only by moves and rain, and ice never melts

**Blocks have no gravity.** Nothing falls when its support is removed, items left on a broken pillar stay floating, and no source shows sand falling (guide) ([thegameswiki building](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)). The DLC's **buoyant block (ブロックうき)** needs no ground contact and can go anywhere in water (official) ([Game8 JP ブロックうき](https://game8.jp/pocoapokemon/804530); [Serebii](https://www.serebii.net/pokemonpokopia/items/buoyantblock.shtml)). Two sources measure height limits:

| Source | Limit |
|---|---|
| ぽこポケ学会 | **97 up and 30 down** per map (tested) ([kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/)) |
| GameWith | **100 blocks** from the seabed; a 100-block fall does no damage ([GameWith 高さ制限](https://gamewith.jp/pocoapokemon/545342)) |

The floor of every map is unbreakable.

Ground changes only through the player's moves and rain, as a small state machine (guide) ([GameWith ふつうのつち](https://gamewith.jp/pocoapokemon/549561); [AppMedia しばふ](https://appmedia.jp/pocoapokemon/79825337); [piyo-piyo04](https://piyo-piyo04.com/2026/03/18/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%80%91%E6%9E%AF%E3%82%8C%E8%8D%89%E3%83%BB%E6%9E%AF%E3%82%8C%E3%81%9F%E5%9C%B0%E9%9D%A2%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%EF%BC%81%E9%9B%A8%E5%AF%BE%E7%AD%96/)):

| Ground | Action | Result |
|---|---|---|
| Plain soil (ふつうのつち) | Leafage | Green grass |
| Green grass | Cut | Lawn block (そうげんのしばふ) |
| Dry ground | Leafage | Dead grass only; the block doesn't change |
| Dry ground | Water Gun, or rain on an uncovered tile | Moist ground |
| Moist soil or grass | Rototiller | Field |
| Field | Leafage (since 2.0.0) | Normal soil |

Powered-up Leafage also grows moss on rock, ferns on black rock or volcanic ash, duckweed on water and vines on walls (guide) ([GameWith 草一覧](https://gamewith.jp/pocoapokemon/548655)). No source documents grass spreading by itself. Bulldoze is a Pokémon specialty that moves and demolishes buildings, not a tool for painting terrain ([Game8 EN Bulldoze](https://game8.co/games/Pokemon-Pokopia/archives/585149)).

**Ice is simply a mined block** (こおり, from behind the Palette Town waterfall) worth −10 warmth, and Never-Melt Ice is an unrelated appraisal item. No source covers melting, freezing, snow weather or snowy terrain (guide) ([GameWith こおり](https://gamewith.jp/pocoapokemon/548274); [GameWith とけないこおり](https://gamewith.jp/pocoapokemon/548391)). The planner should simulate none of them.

### Light, warmth and humidity sum without caps against fixed thresholds

ccopedia's October 2026 tests show that the environment is **plain addition of fixed points, with no cap or averaging**. A Pokémon's like or dislike is just a threshold on that sum. The points are ccopedia's fitted scale, not data-mined values (tested) ([ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia うるおい](https://note.com/ccopedia/n/n48ddc4e1afbd)).

| Home | Bright | Dark | Humid | Dry | Warm | Cool |
|---|---|---|---|---|---|---|
| Habitats and block houses | ≥100 | ≤60 | ≥100 | ≤30 | ≥+60 | ≤−60 |
| Kit houses | ≥40 | ≤40 | ≥40 | ≤60 | ≥+60 | ≤−60 |

As ccopedia reports them, the kit-house humid and dry bands overlap between 40 and 60, so a kit house in that range seems to count as both.

| Points | Light | Warmth | Humidity |
|---|---|---|---|
| +100 | — | — | running sprinkler, filled water basin, running bubble machine, filled bathtub, humidifier, Damp Rock |
| +80 | most lamps and streetlights, fluorescent light, neon floor, big campfire (キャンプファイヤー) | — | — |
| +60 | — | **lava per tile**, lit campfire, wall torch, stone fireplace, Heat Rock (あついいわ), air conditioner on warm | — |
| +50 | — | — | Castform charm, rain face |
| +40 | campfire, stone fireplace, wall torch, brazier, block light, paper lantern, glowing mushroom | — | — |
| +30 | — | **hot spring per tile**, アツアツいわ | — |
| +20 | candles, gaming furniture, pumpkin lanterns | — | **water, muddy water, hot spring, waterfall cell (each per tile)**, sink, toilet, washbasin, shower |
| +10 | — | candles, マグマいわ | — |
| +5 | — | — | trees, Chansey plant |
| +2.5 | — | — | grass, flowers, hedges, crops from sprout, duckweed, vines, potted plants |
| +1 | — | — | grass block |
| −0.5 | — | — | dry grass block |
| −10 | — | ice, icicle, shaved ice, soda float | — |
| −40 | beach parasol | — | — |
| −50 | — | — | Castform charm, sun face |
| −60 | — | fridges, fan, ceiling fan, air conditioner on cool, Icy Rock | — |
| −100 | — | — | Smooth Rock (0 in rain) |

Fires and appliances count only when lit, or when powered and switched on.

Where things count depends on the type of home. A **block house** counts floor and door cells from **−1 to +3** and nothing else; walls, anything under a wall and everything outside are ignored. A **habitat** counts light and humidity across its whole white-dotted area, which reaches **+4 in every direction**, but counts warmth only from −1 to +3. That is why a 5-level waterfall alone makes a habitat humid. In a house, daylight is **90 × open-sky floor and door cells ÷ all house cells, walls included**. In a habitat, walls never block a lamp's light, so a lamp counts even on the roof. Mounted items are height-limited: an air conditioner at +4 gave no cooling, but at +3 it worked (tested) ([ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia あたたかい](https://note.com/ccopedia/n/n4b1e798887df)).

The planner's existing `ENV_FX` values already match these measurements: lamps 80, Campfire 40/+60, Lava +60, Hot-spring water +30/+20, Water, Muddy water and Waterfall +20, Icy Rock −60, Damp Rock +100, Smooth rock −100, Beach parasol −40 and the charms ±50. Four refinements remain. A crop tile should count only from the sprout stage, a planter itself should count 0, a habitat's warmth should use the −1 to +3 band, and ocean water should stay flagged as untested.

The planner's English names Molten rock (+30) and Lava rock (+10) map to アツアツいわ and マグマいわ only by inference, so they should be checked against the in-game item list before anything relies on them.

## Nine specialties act on their own, and only Litter and Gather have tile ranges

Of the 32 specialties ([Game8 JP list](https://game8.jp/pocoapokemon/767404)), only nine act on the world around a Pokémon's home without being asked. All the others work only when you talk to the Pokémon, lead it somewhere or hand it an item.

| Specialty | What it does unprompted | Known range | Evidence |
|---|---|---|---|
| Litter (ちらかす) | Drops its one fixed material near its **home**, wherever the Pokémon itself happens to be. Drops more at higher comfort; stacks across Pokémon; **never drops while Ditto is watching** | Kit house: a 1-tile ring, no diagonals. Built house: the floor plus 1 tile outside the walls. Each landing tile needs a block underneath, no object (an open door is fine) and no liquid | tested ([kyu49 ちらかす](https://kyu49.github.io/Pokopia/chirakasu/); [Serebii Litter](https://www.serebii.net/pokemonpokopia/litter.shtml)) |
| Gather (しわける) | Puts ground items into a community box, and box materials into furnaces. Ignores fallen crops and berries | Box within **4 tiles** horizontally of the habitat's dotted area and **+10 / −8** vertically; only one box is used | tested, seen only via search summary and an X post ([nomanoma-web](https://nomanoma-web.com/2026/03/%E3%80%90%E3%81%BD%E3%81%93%E3%83%9D%E3%82%B1%E3%80%91%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%8C%E3%81%97%E3%82%8F%E3%81%91%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%AA%E3%81%84%E5%8E%9F%E5%9B%A0%EF%BC%81/); [X @winter8636](https://x.com/winter8636/status/2037171863265353976)) |
| Chop (きをきる) | Turns small logs in a nearby box into lumber, **1 log → 5 lumber** | "near" its home | tested ([Game8 JP ざいもく](https://game8.jp/pocoapokemon/767690)) |
| Burn (もやす) | Lights fires; turns clay in a box into bricks (**1 → 2**); smelts in a furnace inside its home or habitat | none published | tested ([Game8 JP レンガ](https://game8.jp/pocoapokemon/768068); [Game8 EN furnace](https://game8.co/games/Pokemon-Pokopia/archives/586265)) |
| Crush (つぶす) | Turns berries in a box into paint (**1 → 5**) | none | tested ([攻略大百科 えのぐ](https://gamepedia.jp/pocoapokemon/archives/2988)) |
| Recycle (リサイクル) | Turns nonburnable garbage into iron ore (**1 → 2**) | none | tested ([Game8 JP 自動化](https://game8.jp/pocoapokemon/769942)) |
| Grow (さいばい) | +1 stage per watered plant per day, no stacking | none | guide ([攻略大百科 畑](https://gamepedia.jp/pocoapokemon/archives/3026)) |
| Water (うるおす) | Waters nearby fields from a **filled basin**; bubbles mud and underwater crops; performs the rain dance at a rain spot | none | official and guide ([Serebii specialty](https://www.serebii.net/pokemonpokopia/specialty.shtml); [攻略大百科 得意なこと](https://gamepedia.jp/pocoapokemon/archives/2257)) |
| Generate (はつでん) | Powers nearby machines until 05:00 the next day | none | guide ([攻略大百科 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588)) |

Each Litter Pokémon always drops the same material (tested) ([Serebii Litter](https://www.serebii.net/pokemonpokopia/litter.shtml); [Game8 EN Litter](https://game8.co/games/Pokemon-Pokopia/archives/585452)):

| Material | Pokémon |
|---|---|
| Leaf | Venusaur, Vileplume |
| Vine rope | Bellsprout line, Tangela line, Snivy line |
| Sturdy stick | Cacturne |
| Honey | Combee |
| Small log | Haxorus |
| Nonburnable garbage | Grimer line, Garbodor, Dhelmise (DLC) |
| Stone | Blissey, Rampardos, Bastiodon, Tyrantrum, Aurorus |
| Twine | Spinarak line, Larvesta line |
| Fluff | Mareep line, Swablu line, Jumpluff |
| Squishy clay | Paldean Wooper, Clodsire, Trapinch |
| Iron ore | Glimmet, Glimmora |
| Stardust | Jirachi |
| Seashell | Shellder, Cloyster (DLC) |
| Black paint | Seadra, Kingdra (DLC) |

How much Litter drops, and how often, is not settled. ぽこポケ学会's figures (a check every 15 minutes, no new drops while 5 items lie uncollected, honey capped at 1) are marked unconfirmed by the site itself ([kyu49 ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)). At most **25 Pokémon show in one area**, and any beyond that may stop producing ([攻略大百科 自動回収](https://gamepedia.jp/pocoapokemon/archives/3123)). Pokémon asleep inside kit houses don't count toward the 25 ([kyu49 ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)). Since Ver. 1.1.0, processing Pokémon use the community box or furnace **nearest their own habitat** (official) ([Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)).

The machines that specialties work also follow simple rules. The **smelting furnace** takes **one material type at a time** and needs a Burn Pokémon close by. It signals finished output with a sparkle, and the Burn Pokémon keeps working until the furnace is empty (tested) ([Game8 EN furnace](https://game8.co/games/Pokemon-Pokopia/archives/586265)).

| Furnace input | Output |
|---|---|
| Iron, copper or gold ore | The matching ingot, **1:1** |
| Beach sand, sandstone or volcanic ash | Glass |
| Pokémetal fragment | Pokémetal |
| Rare Pokémetal fragment | Rare Pokémetal |

The **concrete mixer** needs a Crush Pokémon, limestone and water, and keeps its finished concrete inside until collected (guide) ([攻略大百科 素材](https://gamepedia.jp/pocoapokemon/archives/642)). Three claims about it are unverified: that its hose must sit in water, that a batch takes about an hour, and that limestone yields 1 or 4 concrete ([altema](https://altema.jp/pocoapokemon/concrete)).

No source gives processing times per item, beyond an unverified "about a minute per log". Nothing shows comfort affecting any specialty except Litter's drop amount.

## Per-area caps are firm, but fifteen rules remain contested

The caps below can be enforced outright (tested or official) ([kyu49 色々な上限](https://kyu49.github.io/Pokopia/limitation/); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml); [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)).

| Per-area cap | Value |
|---|---|
| Generators other than furnace kits | **128** since 2.0.0 (64 before) |
| Utility poles + wireless transmitters | **252** (Serebii: 256) |
| Powered items, fridges included | **1,024** for items placed after 1.1.0 (512 before) |
| Field crops / growing plants | **511** (576 on Cloud Islands) / **1,024** |
| Berry trees / pointy trees | 226 / 251 |
| Furnaces + metal furnaces + concrete mixers | 128 |
| Workbenches + cooking tools | 128 |
| Community boxes | 32 |
| Lift platforms / elevator platforms / cameras | 32 / 32 / 8 |
| Dropped items persisting | 512 (oldest vanish first; crops and berries vanish on area change) |
| Cash registers trading at once | 10 |
| Pokémon displayed | 25 |

The rules below are contested. Each should ship as an editable setting that shows its suggested default and the conflict.

| Rule | Reading A | Reading B | Suggested default |
|---|---|---|---|
| Sensor detection depth | 2 tiles ([GameWith](https://gamewith.jp/pocoapokemon/549488), [攻略大百科](https://gamepedia.jp/pocoapokemon/archives/3447)) | 1 tile ([kyu49 diagram](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/sensor-arrow/)) | 2 |
| Sprinkler coverage | radius 5, 61 tiles including itself ([GameWith](https://gamewith.jp/pocoapokemon/548144)) | 60 excluding centre ([Serebii](https://www.serebii.net/pokemonpokopia/vegetables.shtml)); 41 tiles ([kyu49](https://kyu49.github.io/Pokopia/harvest/)); stops 5+ from water ([Game8](https://game8.jp/pocoapokemon/769157)) | radius 5 |
| Smooth Rock reach | 41 tiles, radius 4, +1/−2 ([kyu49](https://kyu49.github.io/Pokopia/harvest/)) | 6-tile radius, ±2 ([GameWith](https://gamewith.jp/pocoapokemon/549091)) | radius 4 |
| Smooth Rock and planters | unaffected ([kyu49](https://kyu49.github.io/Pokopia/harvest/)) | dried ([X @aminisi](https://x.com/aminisi/status/2037509264559030467)) | unaffected, flagged |
| Generator → transmitter | 10 ([Rokina](https://note.com/rokina/n/nc5b66b4b90fb)) | 7 ([GameWith pole page](https://gamewith.jp/pocoapokemon/548211)) | 10 |
| Transmitter cap | 252 ([kyu49](https://kyu49.github.io/Pokopia/limitation/)) | 256 ([Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml)) | warn at 252 |
| Waterfall height for a habitat | 1 level ([GameWith](https://gamewith.jp/pocoapokemon/549075)) | 5 levels ([攻略大百科](https://gamepedia.jp/pocoapokemon/archives/4039)) | warn below 5 |
| Training waterfall water | 2 ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/trainingwaterfall.shtml)) | 1 (planner data, Vandal) | 2 |
| Marsh fishing spot mud | 1 ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/marshfishingspot.shtml)) | 2 ([GameWith](https://gamewith.jp/pocoapokemon/548909)) | 1, flagged |
| Liquid flow priority | muddy > ocean > hot spring > water ([kyu49](https://kyu49.github.io/Pokopia/water/)) | editor unsure; lava not placed | as given, flagged |
| Water Gun on lava gives | くろいいわ ([Serebii](https://www.serebii.net/pokemonpokopia/water.shtml)) | マグマいわ ([blog](https://news.tcg-bloglife.com/entry/2026/04/24/120122)) | くろいいわ |
| Tree growth | 3 days ([GameWith](https://gamewith.jp/pocoapokemon/548662)) | 4 days ([Serebii](https://www.serebii.net/pokemonpokopia/flowers.shtml)) | 3 |
| Bean refruit yield | 1–2 per stage ([Game8](https://game8.jp/pocoapokemon/767639)) | 3 per ripe plant ([gamesradar](https://www.gamesradar.com/games/pokemon/pokemon-pokopia-tomatoes), unverified) | 1–2 |
| Generate power lasts | until 05:00 ([攻略大百科](https://gamepedia.jp/pocoapokemon/archives/4588)) | while the Pokémon is near ([RankedBoost](https://rankedboost.com/pokopia/specialties/generate/), unverified) | until 05:00 |
| Night starts | 19:00 ([GameWith](https://gamewith.jp/pocoapokemon/548015)) | 18:00 ([X @shin_magokoro](https://x.com/shin_magokoro/status/2034053969488834611)) | 19:00 |

## Conclusion

Pokopia never needs continuous physics, so a tile planner can cover nearly all of it with five kinds of static check. Liquids become a flood fill with a tile budget, power a graph with capacities, and signals a test of which items sit inside which output box, each with its own state. Crops become a count of daily ticks, and the environment a sum per cell. Only frame-level circuit timing resists this approach: it depends on compass direction and area loading, and it stalls on area change. For circuits, the honest product is an overlay that calls a design plausible, not a promise that it runs. The best-sourced checks are also the most useful ones: transmitter ranges and overloads, sprinkler coverage, liquid habitat counts and the four `ENV_FX` refinements. They make a natural first release, with the liquid flood fills, sensor and switch volumes and crop timelines following as advisory layers.

Two findings should change how the planner is built. First, **build order is part of the game's state**. A channel widened after it fills keeps its reach, a pole wire strung before a wall survives the wall, a device's transmitter is fixed when the device is placed, and refilled water behaves differently. A planner that stores only finished layouts will mispredict all four, so it should record placement order or at least flag order-sensitive builds. Second, the evidence gaps sit exactly where a planner most wants an overlay: the working ranges of Burn, Grow, Water and Generate, ocean water's humidity and watering, lava's place in the liquid priority, and whether non-water falls count as waterfalls. Each is a quick in-game test, and running those tests before building the features would turn the planner's guesses into rules.

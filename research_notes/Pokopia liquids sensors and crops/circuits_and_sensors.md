# Pokopia electricity, circuits, switches and sensors

Scope: Pokémon Pokopia (ぽこ あ ポケモン), Nintendo Switch 2, game state as of 22 Nov 2026. Versions referred to: 1.0.x (launch, 5 Mar 2026), 1.1.0 (10 Jun 2026), 1.1.1 (19 Jun 2026), 2.0.0 (5 Aug 2026, with paid DLC 1 "Bubbly Basin / ブクブクうみぞこの街"), 2.0.1. DLC 2 ("Dazzling Decorations / どきどきデコレーション") is announced for 9 Dec 2026 and is not out yet, so nothing here covers it.

Labels used below:
- [Official]: in-game text or Nintendo/The Pokémon Company patch notes (quoted by a guide site).
- [Community-tested]: measured by players, with method or screenshots (mostly ぽこポケ学会 / kyu49, note.com Rokina, X user じお @echelon52a2).
- [Guide claim]: stated by a strategy site (GameWith, Game8, Gamepedia, Serebii) without a shown test.
- [Unverified]: only seen in a search-result snippet, or the source itself says "要検証" (needs checking).

Access notes for the report writer:
- https://kyu49.github.io/Pokopia/circuit/ (the URL in the brief) returns HTTP 404. The circuit section now lives under https://kyu49.github.io/Pokopia/category/回路の基礎から応用/ with pages /circuit/clock/, /circuit/items/, /circuit/logic_circuit/ (and 32 sub-pages), /circuit/other_circuits/. All of them were read in full.
- Many of the kyu49 logic sub-pages (AND, SR latch, delay, adder and so on) are text templates whose "回路例" (example circuit) section is empty or only an embedded post. Their layouts are not given in text, so no tile-exact schematics could be taken from them.
- These hosts were blocked from this session and were not read in full: hamy.xyz, op.gg, gurugamer.com, thegamer.com, gamespot.com, bulbapedia (403), altema.jp (403), reddit.com, x.com / twimg, kengomon.com, playnews.gg, tinpanblog.com, dittobase.com, pokebip.com, nintendolife.com. Claims from them come only from search snippets and are marked [Unverified].

---

## 1. How electricity is generated, carried and limited (sources, transmission, range in tiles, obstacles, vertical reach, power per source and item, capacity)

### Takeaway
Power is a 3D Manhattan-distance network. Generators (Mini 5, Windmill 10 or 20 at high ground, Waterwheel 20, Furnace 30 "units") feed transmitters: Utility pole, Wireless power transmitter, Wireless power-transmitter post, and their switch versions. Each transmitter reaches devices within distance 10 and other transmitters within distance 15. A vertical difference of 6 or more never connects. Each transmitter serves at most 20 devices and links directly to only one generator. Almost every device draws 1 unit. Interconnected transmitters pool all their generators. Overloading a network turns every device on it off.

### Cited Findings

**Generators (output = number of 1-unit devices supported)**
- [Guide claim] Mini generator (ミニはつでんマシン): 5 units, runs on its own, 1×1×1. Windmill kit: "10 standard, 20 high-altitude", runs on its own. Waterwheel kit: 20, automatic. Furnace kit: 30, "Requires Renewing" (needs fuel). — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Guide claim] The same figures as "同時接続数" (simultaneous connections): Mini max 5, Windmill max 10, Waterwheel max 20, Furnace max 30. Above the maximum, power does not flow. — [GameWith: 電気の通し方と上限](https://gamewith.jp/pocoapokemon/547762)
- [Guide claim] Windmill: high ground ("高台の判定") gives 20, a normal position gives 10. Waterwheel: 20. Furnace: 30, but because one pole serves only 20, a furnace needs at least 2 poles to use all 30. — [Gamepedia: 電気活用術](https://gamepedia.jp/pocoapokemon/archives/4588)
- [Community-tested] A Mini generator supports at most 5 lanterns. If more devices are attached to its transmitter, none of them light. In R団 entrance challenge 6 the furnace was counted as "30". — [note.com Rokina: 送電の仕様](https://note.com/rokina/n/nc5b66b4b90fb) (18 Mar 2026, v1.0.x)
- [Guide claim] Running conditions. Furnace (火力) needs fuel and stops when it burns out. Waterwheel (水力) needs its gear facing a water source and must be turning. Windmill (風力) works once placed, with more output up high. Mini works once placed. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762)
- [Guide claim] The waterwheel works in any pooled liquid, not only a river. Magma, muddy water and hot springs also work. Windmill full output happens where the screen shows a wind-blowing effect, and its maximum equals the waterwheel's. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762)
- [Community-tested] High ground is an absolute height of about 45 tiles above the map's unbreakable floor (45 in Withered Wastelands, Bleak Beach and Palette Town, 47 in Rocky Ridges, per-island in Sparkling Skylands). In caves the wind effect doesn't show, but the spot still counts if high enough. — [Game8 JP: 高台の作り方と条件](https://game8.jp/pocoapokemon/769075) (as recorded in this repo's earlier notes, research_notes/Pokopia height and stacking rules/gaps_full_reads.md)
- [Guide claim] Good fuel is spare ざいもく (lumber) or food. — [Game8 JP: 電気の通し方と電柱の繋げ方](https://game8.jp/pocoapokemon/768180). No source gives a burn time per item (see Gaps).
- [Guide claim] Game8 says two furnaces can run 50 machines for the "power 50 machines" Special Challenge. This fits 2×30 = 60. — [Game8 JP: キカイに電流を流そう](https://game8.jp/pocoapokemon/769094)
- [Guide claim] Kit costs and materials: Windmill kit 300 coins, lumber×5 + twine×5. Waterwheel kit 300 coins, lumber×15 + stone×5. Furnace kit 300 coins, iron ore×15 + sea-glass fragments×5. All are sold after the Bleak Beach generator events. Mini generator: recipe in the shop at Sparkling Skylands environment Lv 6, then Pokémetal×1 per craft. — [Gamepedia 4588](https://gamepedia.jp/pocoapokemon/archives/4588). GameWith's lower table says waterwheel "ざいもく×5 / いし×5", which contradicts its own upper table (15/5) — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762)
- [Guide claim] With the "Generate" (はつでん) specialty, a Pokémon that is with you powers nearby machines and lights. That power lapses after "a set time" (GameWith) or after 5:00 the next day (Gamepedia). It is fine for meeting habitat conditions but not for long-running items such as registers or vending machines. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762); [Gamepedia 4588](https://gamepedia.jp/pocoapokemon/archives/4588); [Game8 JP: はつでんの効果](https://game8.jp/pocoapokemon/767538)

**Storage**
- [Guide claim] The Charging station (じゅうでんスポット) shows how many units are connected to it. It can display up to 40 units, and each light stands for 8 units. No battery item that stores power over time was found. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Unverified] ぽこポケ学会 lists "じゅうでんそうち being the reference for power" as a topic still to write up. — [kyu49 Future Plan](https://kyu49.github.io/Pokopia/future_plan/)

**Draw per device**
- [Guide claim] Every powered item needs 1 unit, except a couple that need power but use 0 units: String lights and Surface lights. If too many items are connected for the generation available, there is "a short and all items will lose power in the circuit until another additional electricity generator is added". — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Community-tested] イルミネーションライト (illumination lights): more than 100 can be lit without a shortage, so they appear to be left out of the power sum. They still count toward the 20-per-transmitter limit, and a Mini generator alone powers only 5 items. — [kyu49: 回路に有用なアイテム](https://kyu49.github.io/Pokopia/circuit/items/) (credit: なる, narunikki blog). They also count toward the powered-item placement cap — [kyu49: 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Guide claim] The Pikachu fountain needs 1 unit to activate. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)

**Transmitters and ranges**
- [Guide claim] Utility pole: range 10 blocks, 15 between transmitters, size 1×1×3. Wireless power transmitter: 10 / 15, 1×1×1. Wireless power-transmitter switch: 10 / 15, 1×1×1. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Guide claim] "Each Utility pole or Wireless transmitter can connect to up to 20 things at once, and can only connect to one generator at a time directly, but power strength from multiple generators can be carried along a utility pole if it meets others from another source." Distance is Manhattan in 3D, so an exact diagonal between two wireless transmitters "would run 8 blocks". "The power generated cannot go more than 5 vertical blocks up or down at any one time." — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml) (distance graph credited to "Zert")
- [Community-tested] Distance is counted from block centres as 3D Manhattan distance (|dx|+|dy|+|dz|). A transmitter powers machines at distance ≤ 10. Each tile of height difference takes 1 off the horizontal reach, and at a height difference of 6 or more nothing connects, even inside distance 10. The range is symmetric above and below. The same height cap applies between transmitters. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Community-tested] Transmitter to transmitter: distance 15 connects (14-tile gap), 16 does not. On a diagonal, a 6×6 gap (7+7 = 14) connects and a 7×7 gap (8+8 = 16) does not. Generator to transmitter: same limit as transmitter to machine, ≤ 10. A 4×4 diagonal gap (5+5 = 10) connects and 5×5 (6+6 = 12) does not. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Community-tested] A transmitter serves at most 20 machines. Beyond that, machines inside the range stay unlit. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Community-tested] "Every generator needs its own 1:1 transmitter (or pole)." The tip is to dig one tile under a transmitter and bury a Mini generator there. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Community-tested] Pooling: if all poles are interconnected, the sum of all their generators is available to the whole grid. If poles stand alone, each with its own Mini generator, each one's 5 units cannot be shared. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Guide claim] GameWith summary table: generator to transmitter and transmitter to item, horizontal 10 and height 5; wireless to wireless, horizontal 15 and height 5. "The total of up/down/left/right is up to 10 … but even within the limit, past a height of 5 it won't connect." Example: "6 in one direction + 2 turning + 2 up" = 10. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762); [GameWith: 無線送電機](https://gamewith.jp/pocoapokemon/549115)
- Contradiction: GameWith's utility-pole page says generator to pole is 7 tiles (pole to item 10, pole to pole 15) — [GameWith: でんちゅう](https://gamewith.jp/pocoapokemon/548211). That disagrees with Rokina's test (generator to transmitter 10), Serebii (10) and GameWith's own electricity page (10).
- [Guide claim] Origin points: for kit-built generators, the distance origin is the bottom tile at the front-left as seen when placing the kit. For 1-tile items (Mini generator, wireless transmitter) it is the tile itself. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762)
- [Community-tested] The Utility pole's distance origin is its bottom tile, although the pole is 3 tall and the wire attaches at the top. So the vertical limit is 5 above the foot (3 above the head), and 6 above the foot fails. Pole and wireless transmitter performance is "completely the same". — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Guide claim] For Windmills and Waterwheels, the pole must be on the side with the yellow protrusion, or it won't connect. To send power the other way, first put one pole on the allowed side. — [GameWith 548211](https://gamewith.jp/pocoapokemon/548211)

**Obstacles: blocks, walls, floors**
- [Guide claim] The Wireless power transmitter works through objects, unlike poles. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml). It works with blocks in between and when buried underground — [GameWith 549115](https://gamewith.jp/pocoapokemon/549115)
- [Guide claim] Utility poles: pole to item works through walls and blocks, so poles and generators can be buried under the ground. Pole to pole is blocked by a wall in the wire's path. If the wire is connected first and the wall built afterwards, power keeps flowing. Generator, charging spot and pole wires all fail if an obstacle sits where the wire runs. — [GameWith 548211](https://gamewith.jp/pocoapokemon/548211)
- [Community-tested] Wireless transmitters can be stacked vertically to extend the grid upward. Poles cannot, because their wires clash. Recommended layout: relay transmitters every 14 tiles along each axis (13-tile gaps), plus relays at 7+7 diagonals (6×6 gaps). For height, add a wireless relay 5 tiles above each one (4-tile gap). Burying a transmitter 1 tile down (at ground-block height) uses up 1 tile of its upward reach. — [note.com Rokina](https://note.com/rokina/n/nc5b66b4b90fb)
- [Community-tested, partly unverified] Because poles are stopped by blocks, they can be handy for complex wiring. Trick for making a wireless transmitter take only some nearby items: place a dummy transmitter, link the unwanted items to it, place the real transmitter, link the wanted items, then remove the dummy. — [kyu49 Future Plan](https://kyu49.github.io/Pokopia/future_plan/)

**Buildings**
- [Guide claim] Dens and huts are not connected to electricity, though a Mini generator inside one powers everything inside. When a cottage or house is connected, all items inside it are powered. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Guide claim] Pokémon-built houses take power only at "〇〇のいえ" (house) size or larger. "おへや" (den) and "こや" (hut) can't be wired and need a Generate Pokémon. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762)

**Visual feedback**
- [Guide claim] When placing a transmitter, a black wire preview means it will connect. A yellow line between transmitter and item means the item is powered. A powered wireless transmitter's white lines glow. — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762). A faint wire preview while placing a pole means it is inside another pole's range and will auto-connect — [Game8 JP 768180](https://game8.jp/pocoapokemon/768180)

**Network-wide caps**
- [Guide claim, pre-2.0] At most 64 generators in any mix of Mini, Windmill, Waterwheel and Furnace. That gives 320 to 1,920 units of generation, but no more than 1,024 electric items. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Official, v2.0.0] "「火力はつでんマシン」を除く、はつでんマシンの合計の配置上限数を、64個から128個に増やしました" — the combined cap on generators other than the Furnace rose from 64 to 128. — [Gamepedia: Ver.2.0.0 まとめ](https://gamepedia.jp/pocoapokemon/archives/5548). GameWith now states 128 per town — [GameWith 547762](https://gamewith.jp/pocoapokemon/547762). The kyu49 limits page still says "発電系 合計64" — [kyu49 limits](https://kyu49.github.io/Pokopia/limitation/)
- [Guide claim] Placing more than 256 transmitters (poles plus wireless) in an area makes later ones stop working, with a notice. — [Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml). kyu49 gives "でんちゅう・むせんそうでんき系 合計252" — [kyu49 limits](https://kyu49.github.io/Pokopia/limitation/) (sources disagree: 256 vs 252).
- [Official, v1.1.0] The placement cap for electric items doubled from 512 to 1024. It applies only to items placed after the update. — [Gamepedia: Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597). kyu49 writes 511 → 1024 and says fridges are included and that at the cap you can't even put items in storage — [kyu49 limits](https://kyu49.github.io/Pokopia/limitation/)

### Inferences
- Planner model for power (best-supported version):
  1. Nodes are generators G (capacity 5/10/20/20/30), transmitters T (pole, wireless, post, and switch versions) and devices D (draw 1, or 0 for String/Surface lights).
  2. Edges: G–T if Manhattan(origin_G, T) ≤ 10 and |dz| ≤ 5. T–T if Manhattan ≤ 15 and |dz| ≤ 5. T–D if Manhattan ≤ 10 and |dz| ≤ 5. Use the pole's foot tile as its origin. For poles only, T–T and G–T also need a clear wire path. T–D ignores obstacles for every transmitter type.
  3. Each T links directly to ≤ 1 generator and ≤ 20 devices. Each G needs its own T.
  4. A connected component of T is powered if Σ capacity ≥ Σ draw. Otherwise every device in the component is off (Serebii's "short"; Rokina saw "none light").
  5. Switch transmitters in the OFF state drop their own devices (see question 3).
- Which transmitter a device joins seems to be fixed when things are placed: the dummy-transmitter trick, and the fact that a pole wire survives a wall built later. A planner can't fully predict assignment from the final layout alone. Warn when a device sits within range of two transmitters.
- Waterwheel output depends on liquid touching its gear. Game8's blinking-streetlight build (question 4) uses a clock to switch a waterwheel on and off, so a generator itself can be a circuit output.

### Gaps
- No source gives furnace fuel burn time per item, or whether fuel types differ.
- What exactly happens on overload: whether the whole component goes dark or only the excess devices. Serebii says all of them; Rokina saw all fail on a Mini generator. Not tested for mixed grids.
- Whether the Furnace keeps its own separate 64 cap after v2.0.0. The official wording only says the cap "excluding furnaces" became 128.
- The range and draw rules for the Charging station and the Generate specialty were not measured anywhere.
- The kyu49 pages on long-distance power and power assignment (/wiring/long-distance-power/, /wiring/power-settings/) are stubs with no figures.

---

## 2. Sensors and inputs: what triggers them, detection area in tiles, how long they stay on, what they output

### Takeaway
There are four input items: the Laser sensor (センサー), the Floor switch (ゆかつきスイッチ), the Wall switch (カベつきスイッチ) and the Card reader (カードリーダー). The sensor is directional. It watches 1 tile (kyu49 diagram page) or 2 tiles (GameWith, Gamepedia, HAMY) in front of its red face. On a change it sends a one-shot "change command" to 11 tiles: left, right, behind and its own column, each at three heights. The floor switch acts on a 5×5×5 cube and the wall switch and card reader on a 7×7×7 cube. No light, timer, weather or item-type sensor exists. Timing comes from liquids, door animations and clocks.

### Cited Findings

**Laser sensor (センサー)**
- [Official text] "When this sensor detects movement, it activates devices nearby." JP: "何かの動きを察知すると周りのものがいいカンジに動く。" — [Serebii: Laser sensor](https://www.serebii.net/pokemonpokopia/items/lasersensor.shtml); [GameWith: センサー](https://gamewith.jp/pocoapokemon/549488)
- [Community-tested] It reacts to all Pokémon, Ditto (the player), liquids and some furniture. Toy blocks are detected each time they move. Appliances and the alarm clock are detected only when they turn ON. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Liquid is detected both when it spreads in and when it disappears. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/); also [Game8 JP: 回路の作り方](https://game8.jp/pocoapokemon/768968)
- [Community-tested] Output area: the tiles to both sides, behind, the sensor's own tile, and the tiles above and below each of those. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/). GameWith says "周囲11マスに信号を送ります" (sends to the 11 tiles around it) — [GameWith 549488](https://gamewith.jp/pocoapokemon/549488). Game8: the acting side only reaches items "in 3 directions and 1 tile above/below" — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968). (4 columns × 3 heights = 12, minus the sensor itself = 11, so the three agree.)
- [Community-tested] kyu49's 2D diagram page: the arrow tile is the sensor. It watches 1 tile in the arrow's direction. On a change it sends the command 1 tile behind, 1 tile "above" and 1 tile "below" the arrow (in the diagram's frame). The tile in front is not a target. — [kyu49: センサー矢印の仕様](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/sensor-arrow/)
- [Guide claim] Detection reaches straight ahead from the red part up to 2 tiles, and it still reacts with an item in between. — [GameWith 549488](https://gamewith.jp/pocoapokemon/549488). Gamepedia: "within 2 blocks of the red part" — [Gamepedia: 回路向きのアイテム](https://gamepedia.jp/pocoapokemon/archives/3447). [Unverified] HAMY (Mar 2026): sensors "sense movement 2 blocks in the direction they're facing" and will not retrigger the item that triggered them (search snippet only; hamy.xyz blocked).
- Contradiction: kyu49's diagram page says it monitors 1 tile ahead, while GameWith, Gamepedia and HAMY say 2. kyu49's diagram may be simplified. Not resolved.
- [Official, v1.1.0] When you place ("はきだす") a sensor, its detection range is now shown. — [Gamepedia Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597)
- [Guide claim] The output signal is separate from electricity. It can open and close doors and turn powered lamps on and off. — [GameWith 549488](https://gamewith.jp/pocoapokemon/549488). Door-type furniture opens and closes; electric furniture toggles on and off — [Gamepedia 3447](https://gamepedia.jp/pocoapokemon/archives/3447)
- [Guide claim, partly unverified] The sensor body doesn't move when it fires, so a second sensor aimed at the first sees nothing. To chain, the first sensor must move something (a door, window or toy blocks) that the next sensor watches. HAMY found the underground hatch unreliable for this. — HAMY, from a search snippet. kyu49 recommends toy blocks "for visualising and for linking sensor to sensor" — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Signals don't need a power supply. Even powered devices are switched by signals; the device just ignores the command while unpowered (see question 4). Signals pass with no delay regardless of channel size, so one sensor drives every target in its output area at once. — [GameWith: 回路の作り方](https://gamewith.jp/pocoapokemon/548990)
- [Guide claim] Unlock: recipe in the Rocky Ridges (ゴツゴツやま) shop at environment Lv 6 for 1,000 coins. Recipe Pokémetal×1 + Iron ingot×1 — [GameWith 549488](https://gamewith.jp/pocoapokemon/549488); [Game8 JP: センサー](https://game8.jp/pocoapokemon/770267). Serebii lists only Pokémetal×1 — [Serebii](https://www.serebii.net/pokemonpokopia/items/lasersensor.shtml) (sources disagree). It can also be 3D-printed for 2 Rare Pokémetal from a photo taken in the official "ポケモン情報局タウン" cloud island (address PXQC G03S), down a manhole on the west/north-west coast in front of the music mats — [GameWith 549488](https://gamewith.jp/pocoapokemon/549488); [Gamepedia 3447](https://gamepedia.jp/pocoapokemon/archives/3447)

**Floor switch (ゆかつきスイッチ)**
- [Community-tested] Everything in a 5×5×5 cube centred on its tile reacts. Floating Pokémon such as Geodude don't press it. On doors, pressing always opens (it never closes an open door). A short while after release it closes every open door in range, including ones that were open before. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Guide claim] It triggers only while stepped on, as a temporary activation. — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968). [Unverified] Bulbapedia (snippet): it triggers items up to two block units away when stepped on, which matches the 5×5×5 cube.
- [Official text] "A ground-mounted switch that activates nearby machinery when it detects weight." — [Serebii: Floor switch](https://www.serebii.net/pokemonpokopia/items/floorswitch.shtml)
- [Guide claim] Stepping on it fires an adjacent Fiery Magby statue (ほのおのブビィぞう), which can light a bread oven or campfire. — [GameWith: ゆかつきスイッチ](https://gamewith.jp/pocoapokemon/548702)

**Wall switch (カベつきスイッチ) and Card reader (カードリーダー)**
- [Community-tested] Everything in the surrounding 7×7×7 cube reacts. Unlike the floor switch, it toggles whatever state a door is in. Pokémon never touch them. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Guide claim] Pressing a wall switch moves gimmicks within 3 tiles of it all at once. Doors that open and close and music mats (おんぷマット) react. — [GameWith: カベつきスイッチ](https://gamewith.jp/pocoapokemon/549326)
- [Official text] Card reader: "A machine that reads key cards or Pokédexes. Mount it to a wall." — [Serebii: Card reader](https://www.serebii.net/pokemonpokopia/items/cardreader.shtml)

**Things that act as inputs only because sensors see them move**
- [Community-tested] Per item (kyu49 items page):
  - Toy blocks (つみ木): detected on every move, with a short cooldown. Probably a 1-frame lag from moving to being detected ("要検証", needs checking).
  - Alarm clock (めざましどけい): toggles with no cooldown and is detected only when switched ON. Usable for ultra-fast clocks.
  - Pinwheels (かざぐるま): also turn from Ditto's suction. Detected only when they start moving. Medium cooldown.
  - Weather vane (かざみどり): like the pinwheel but doesn't react to suction.
  - Ship's wheel (ふねのハンドル): detected only at the start of its motion. Long cooldown.
  - Ceiling fan (てんじょうせんぷうき): detected only when switched ON. Its detection footprint is 2×2×1 tiles.
  - Rowlet clock (モクローどけい): moves by itself on the hour (:00), but only if you are in that area at the time.
  - Air conditioner (エアコン): cycles ON → ON → OFF, so it is detected only 1 press in 3.
  - Washing machine, Model planet, Fan, Mirror ball: detected only while ON (when turned on). No cooldown.
  — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Guide claim] The Horsea fountain (タッツーふんすい), unlike flowing water, is not detected when it dries up. A Fan without power doesn't move. — [Gamepedia 3447](https://gamepedia.jp/pocoapokemon/archives/3447)

### Inferences
- For a planner: model each sensor as a facing direction f. Detection cells are 1 or 2 tiles ahead along f (make this a setting until it is settled; 2 is the majority claim and matches the in-game preview added in v1.1.0). Output cells are the 11 tiles {left, right, back, self} × {z−1, z, z+1} minus self.
- Inputs: sensors fire on a change, not a level. They are edge-triggered one-shots. A floor switch gives "open while pressed, close after release" for doors, so it behaves like a momentary level input. Wall switch and card reader are pure toggles.
- A switch or sensor signal is a toggle command ("change state"), not a level. There is no continuous "on" line. A planner checking circuits should simulate state per device, not a boolean wire level.

### Gaps
- Whether detection is really 1 or 2 tiles (kyu49 vs GameWith/Gamepedia/HAMY). Whether a solid block in between blocks detection (GameWith says items don't, but says nothing on full blocks).
- How long the floor switch holds after release (only "少しの時間" / a short time). It is not measured in frames.
- What the card reader needs to activate (key card or Pokédex) and whether it differs from the wall switch other than in looks. Only kyu49's "same as wall switch, 7×7×7" is known.
- No pressure plate other than the floor switch, and no light/dark, timer, weather, water-level or Pokémon-type sensor was found in any item list ([Game8 EN utilities list](https://game8.co/games/Pokemon-Pokopia/archives/586408); [Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml)). The Security camera is a utility, but no source describes it as a circuit input.

---

## 3. Outputs and devices that respond to signals, and how inputs reach them

### Takeaway
Any item with an on/off or open/close state responds when it sits in a sensor's 11-tile output area, a floor switch's 5×5×5 cube, or a wall switch/card reader's 7×7×7 cube. Doors and windows open and close. Powered appliances, lights and switch transmitters toggle. Mini floodgates start and stop water. Bells and music mats sound (bells since v2.0.0). There are no wires, channels or menu links for signals; only position matters. Power reaches devices separately through transmitters.

### Cited Findings
- [Community-tested] Switches can fire furniture that reacts to touch, toggle appliances on and off, and switch doors between open and closed. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Official text] Wireless power-transmitter switch: "Connect these to electrical generators to use them. Put a switch nearby to quickly turn things on or off." — [Serebii: Wireless power-transmitter switch](https://www.serebii.net/pokemonpokopia/items/wirelesspower-transmitterswitch.shtml). It toggles with A ("きりかえる") or a signal from a sensor or switch, for example to light a room on entry — [Gamepedia 3447](https://gamepedia.jp/pocoapokemon/archives/3447). Serebii describes the "Switch" as able "to stop and start electricity transmission to any items directly connected to it" — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Official, v2.0.0] "「うみなりのスズ」「とうめいなスズ」を「センサー」やスイッチのアイテムで音を鳴らせるようにしました" — sensors and switches can now ring the two bell items. — [Gamepedia Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)
- [Official text] Automatic doors: "You can't open or close these as is, but they function automatically when hooked up to electricity." Recipe glass×1 + iron ingot×1, from the Skyland House Recipe Set bundle. — [Serebii: Automatic doors](https://www.serebii.net/pokemonpokopia/items/automaticdoors.shtml)
- [Community-tested] Automatic doors can be kept shut permanently by not powering them, and they still count as a house door when unpowered. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Door-type outputs and their quirks (all from [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)):
  - In general: closed, they block water; open, they let it through. Items carried by water can't pass even open doors, with exceptions. A closed door touching blocks only at a corner doesn't leak, whereas two blocks meeting at a corner do leak.
  - Hatch window (フタつきまど): Pokémon sometimes open it. While open, litter (ちらかす) can spawn on the window tile, which is true of most doors. Opening and closing are fast, so it is the standard part for clocks.
  - Underground hatch (フタつきまど・じめん): whatever it looks like, it is treated as set in the tile above, so when closed that tile also blocks water. Pokémon can't open it. Water-carried items pass only vertically.
  - Sash window (あげさげまど): works in clocks but is a little slower than the hatch window and sometimes stops. No litter spawns there when open. Pokémon can't open it. When open, water passes both the upper and lower tile, but the upper tile has collision.
  - Wooden gate (木のさくのトビラ): moves 2 tiles at once.
  - Large wooden door (おおきな木のドア): moves 2×2.
  - Iron door (てつのドア): moves 3 tall × 2 wide.
  - Shutter (シャッター): moves 3×3, and Pokémon sometimes open it despite its look.
  - Simple curtain (シンプルカーテン): water-carried items are blocked horizontally and pass vertically. No collision for Ditto even when closed. Blocks water when closed. Pokémon sometimes open it.
- [Official text] Mini floodgate: "Turn the handle on top to start or stop the flow of water." Recipe iron ore×1, Daily Shop Special. — [Serebii: Mini floodgate](https://www.serebii.net/pokemonpokopia/items/minifloodgate.shtml). It is used as a clock output, toggled by the clock's inner sensor — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968)
- [Guide claim] Things a clock can drive: Mini floodgate, wireless transmitter, toy blocks. With a different output it can blink a light or run a fountain at intervals. — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968)
- [Guide claim] Official promo footage (Pokémon YouTube, from 3:24) shows a switch moving a shutter, and opening a door also switching lights and water. — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968), pointing to [YouTube tp9iVeJWvlM](https://www.youtube.com/watch?v=tp9iVeJWvlM)
- [Guide claim] For a powered gimmick, wire power separately; the signal alone doesn't power it. — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968)
- [Guide claim] The list of items that require electricity includes: Gaming fridge/chair/bed, Microwave, Refrigerator, Fan, Air conditioner, Printer, Washing machine, Computer, Gaming PC, Television, Wall monitor, Arcade machine, Vending machine, Small stage, Raichu sign, Cash register, every streetlight and lamp (Town/Harbor/Chic/Double/Dangling streetlights; Plain, Desk, Poké Ball, Berry table, Cute, Poké Ball, Luxury, Garden, Seedot, Shell, Pop art, Berry hanging, Jirachi, Chain lamps; 7 meteor lamps; Lantern, Wall light, Fluorescent light, Gaming light, Resort light, String lights, Surface light, Spotlight, Antique chandelier, Cursola light, Pathway lights (line/single/corner)), Model planet, Mirror ball, Automatic doors, Submarine kit, Clock tower kit, five shop signs, Bubble machine (DLC), and the transmitters themselves. — [Serebii: Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml)
- [Guide claim] Elevators and the Poké Mart building also need power (its register and vending machine won't work otherwise). — [Gamepedia 4588](https://gamepedia.jp/pocoapokemon/archives/4588)

### Inferences
- How inputs reach outputs is purely spatial: a target must sit inside the input's output volume. Relays are built by putting a movable object (toy blocks, a hatch window) in one sensor's output area and in the next sensor's detection cell. GameWith's berry harvester chains sensor → hatch window → sensor four times to carry a wall-switch press down a 16-tile-long machine — [GameWith: 自動化のやり方](https://gamewith.jp/pocoapokemon/549091).
- To affect a sensor on a different level, GameWith recommends a 2-tile-tall signal target (a door or sash window) — [GameWith 548990](https://gamewith.jp/pocoapokemon/548990). Moving multi-tile doors (iron door 3×2, shutter 3×3) are a way to reach further.
- A planner can show each input's output box (11 cells, 5×5×5 or 7×7×7) and highlight the state-bearing items inside it.

### Gaps
- What triggers Automatic doors (Pokémon or player proximity, and at what range) is not documented anywhere reachable.
- Whether lights and appliances other than those listed respond to sensor signals the same way (most powered items are assumed to toggle, but only the ones in kyu49's table were tested).
- Whether a Mini floodgate or Sprinkler responds to switch/sensor input in all orientations. A Reddit AND gate reportedly used a sprinkler, but that is unverified.

---

## 4. Logic, timing and propagation, and community contraptions

### Takeaway
There are no logic-gate items. Logic is emergent: sensor edges plus device state, power state, liquid flow and door animations. The game runs on 60 fps frames and processes the world north→south and west→east, so timing depends on direction. Community builds include water clocks, a 60 Hz appliance clock, frequency dividers, a 16-frame delay, AND, interlock, feedback, SR latch, half and full adders, BCD correction, a calculator, automatic doors, hidden waterfall rooms and auto-harvesters.

### Cited Findings

**Signal rules (the core of any simulator)**
- [Community-tested] Items that need no power: stopped → running gives a signal; running → stopped gives none. Items that need power can't change state while unpowered, even when ordered to. Their signal table:
  - unpowered+running → powered+running: signal
  - unpowered+stopped → powered+stopped: none
  - powered+stopped → running: signal
  - powered+running → stopped: none
  - powered → unpowered: none
  — [kyu49: 信号の出力条件](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/signal-output/)
- [Community-tested] Key point: a signal comes not only "the moment it goes from stopped to running" but also "the moment an unpowered running item gains power". — [kyu49 signal-output](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/signal-output/)
- [Community-tested] Feedback (フィードバック機構): uses the powered-item rules to send an output back into the circuit itself. It is the base of most power-based circuits. — [kyu49: フィードバック機構](https://kyu49.github.io/Pokopia/circuit/logic_circuit/logic/feedback/)
- [Community-tested] Half adder by power state (電源状態式半加算器): powered = 1 and unpowered = 0 for inputs A and B. The plain arrangement gives Out1 = A OR B and Out2 = A AND B. Adding a "fires only every 2nd time" element to Out1 makes it A XOR B. Two in parallel compress 4 inputs into a 2-bit count of how many are ON. — [kyu49: 電源状態式半加算器](https://kyu49.github.io/Pokopia/circuit/logic_circuit/arithmetic/power-half-adder/)

**Timing**
- [Community-tested] World processing order: sensors behave differently by compass direction. Simplified: the world is checked north → south and west → east. One frame (1/60 s) is one sweep of the world, and anything left over runs next frame. Actions and signals differ (via ばっしー @Bashii1646's charts of the 9 tiles above, 8 level and 9 below a sensor). — [kyu49: クロック以外の回路](https://kyu49.github.io/Pokopia/circuit/other_circuits/)
- [Community-tested] Because of direction dependence, the same shape can change signal timing. Check the placement direction, the sensor facing and the initial state. — [kyu49 logic index](https://kyu49.github.io/Pokopia/circuit/logic_circuit/)
- [Community-tested] Cooldown table (columns: time before it can move again / time before a sensor can detect it again / lag from moving to being detected):

  | Item | Move again | Detect again | Lag |
  |---|---|---|---|
  | Alarm clock, Model planet ("もくせい" in the table), Washing machine, Fan, Ceiling fan, Air conditioner | 0 | 1 | 0 |
  | Switch wireless transmitter (きりかえしきむせんそうでんき) | 13 | 13 | 0 |
  | Hatch window | 18 | 18 | 0 |
  | Curtain | 24 | 24 | 0 |
  | Toy blocks, Sandbox | 0 | 31 | 1 |
  | Sash window | 31 | 31 | 1 |
  | Large wooden door, Boat door | 36 | 36 | not checked |
  | Mini floodgate | 67 | 67 | not checked |

  The lag depends on direction, and in some directions there is none. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/). The table gives no unit; the same site counts in frames (F, 1/60 s) elsewhere, so these are almost certainly frames (inference).
- [Community-tested] The 16F delay circuit delays one signal by exactly 16 frames. It can also send the undelayed input on, for a two-step output (now, then +16 F). — [kyu49: 16F遅延回路](https://kyu49.github.io/Pokopia/circuit/logic_circuit/control/delay/)
- [Guide claim] Water reaching a point takes time, so water paths make adjustable delays. The sensor signal itself has no delay. — [GameWith 548990](https://gamewith.jp/pocoapokemon/548990)

**Clocks**
- [Community-tested] The standard clock needs a Hatch window (or Sash window), a Sensor, and seawater or magma (magma for slower). Plain water works but can create sparkles (キラキラ), so seawater is recommended; mud behaves like seawater. Minimal build: water beside the door; the sensor on the far side of the door from the water, facing away from the door; put what you want driven on the block beside the sensor. Cycle: water flows through → reaches the sensor → the sensor closes the door → the water dries up → the sensor sees it vanish → the door opens again. It may stop depending on when you change area. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Community-tested] The Hatch window is preferred for cost and fewer glitches. The Sash window has the advantage that Pokémon don't touch it, but it often stops on area change. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Community-tested] Frequency divider: an alarm clock is detected only when it turns ON, which is every 2nd toggle. A chain of n alarm clocks passes 1 signal in 2ⁿ. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/) (video [YouTube 02WanTtH3YE](https://youtu.be/02WanTtH3YE?t=283))
- [Community-tested] Ultra-fast clock: a sensor fires every frame (60/s). Parts: 2 sensors and 4 of Washing machine / Model planet / Alarm clock (the first two need a generator and wireless transmitter). Two appliances sit side by side, both in one sensor's view, with one ON and one OFF. The mirrored pair sits on top (sensor above appliance, appliance above sensor). Every toggle gives one OFF→ON, so every frame fires. It can stop on area change, and many of them make the game misbehave. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/) (video [YouTube vWsLvxnaa44](https://www.youtube.com/embed/vWsLvxnaa44))
- [Community-tested] A liquid-free clock built for the さらさらいわ (dry rock) problem uses Pokémon walking back and forth. A finished builder walks to the nearest point of its completed house, and sash windows switch which point is nearest. Pokémon that hit magma move to nearby footing, or respawn at the Pokémon Center if there is none. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Guide claim] GameWith's clock: blocks, 2 sensors, a water source (needs ちょすい / Water Gun storage), and a window or similar that passes water. The sensor next to the window faces out; the gimmick-side sensor faces in. Open the window to start. — [GameWith 548990](https://gamewith.jp/pocoapokemon/548990). Game8 JP gives the same 2-sensor build — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968)

**Catalogue of named community circuits** (ぽこあ回路図鑑, function as described; layouts mostly not given in text)
- [Community-tested] Each one, from the [kyu49 logic index](https://kyu49.github.io/Pokopia/circuit/logic_circuit/) and its sub-pages:
  - Slightly-fast AND: outputs only when 2 conditions are met.
  - Interlock: forbids one side while the other is running.
  - Feedback.
  - Feedback AND: power state AND another input.
  - SR latch: holds on SET, clears on RESET.
  - 16F delay.
  - Speed-branch: the result depends on how fast you input.
  - Any-period output.
  - "Water never stops once ANDed": holds until the main valve is shut.
  - Fixed-count output: one input becomes N outputs.
  - Input hold.
  - Cyclic selector, step-up, state-read selector, one-hot, ordered-input lock.
  - Binary ×2, power-state half adder, binary adder, BCD correction.
  - Devices: colour-changing waterfall, calculator, fireworks show that changes by press count, wave-flow art, fountain plaza that changes colour each press, auto-harvest farm (waterfall lift + door push), source/cascade art.
- [Community-tested] Conditional pulse circuit: in complex circuits, the result differs depending on whether the sensor saw Ditto or an item. This minimal build acts as a pulse circuit only when Ditto is detected ("要追加検証", needs more testing). — [kyu49 other circuits](https://kyu49.github.io/Pokopia/circuit/other_circuits/)
- [Community-tested] Held-liquid effect: when water passes through some doors or fences, sensors stop seeing it. When the water leaves the door, every sensor that had been "seeing" it fires at once. Outside the map cell it may never fire. The minimap processes 8×8 tiles as one map cell, and sensors further than 5×5 or 6×6 map cells away are left out of the simultaneous firing (conditions still unclear as of 2026-04-05). — [kyu49: 水の仕様](https://kyu49.github.io/Pokopia/water/)

**Guide-site contraptions with part counts**
- [Guide claim] Each one with its parts:
  - Water-flow timer: sensor, hatch window, water source, a 2-tall signal-driven item.
  - Automatic door with no power: 6 sensors, 4 sash windows, any door, a water source. It opens even when the player is far from the door.
  - Hidden room behind a waterfall: 9 sensors, 3 sash windows, a mini floodgate, 2 hatch windows, 3 underground hatches, 5 pier boards (さんばしのいた), 3 water sources.
  — [GameWith 548990](https://gamewith.jp/pocoapokemon/548990)
- [Guide claim] Each one with its parts:
  - Automatic door: any door, 6 sensors, a water source, 3 toy blocks, a hatch window.
  - Blinking streetlight: waterwheel, sensor, water source, wireless transmitter, hatch window, town streetlight. The clock's water switches the waterwheel on and off.
  — [Game8 JP 768968](https://game8.jp/pocoapokemon/768968)
- [Guide claim] Berry auto-harvester: 20 dry rocks (さらさらいわ), 1 wall switch, 9 sensors, 1 wooden cross door, 13 hatch windows, 13 wire-mesh floors, on a 16×13 site. Dry rock works within a 6-tile radius and ±2 tiles vertically. — [GameWith 549091](https://gamewith.jp/pocoapokemon/549091)
- [Unverified] Reddit user nin10Donuts built an AND gate from water flow, doors and a sprinkler. kyuphd built a pulse circuit, and Tarnow0530 reused it for a number counter and calculator (gurugamer and GameSpot via search snippets; not read). HAMY's lava gate chains switch → sensor → door → sensor (snippet).

### Inferences
- A simulator needs: a per-frame update in N→S, W→E order; edge-triggered sensors with the 11-cell output; device state machines with the per-item cooldowns above; the power-state signal table; and liquid flow with travel time. Without liquid simulation, a planner can still check "is each target in some input's output box", "is each powered target on a powered network", and "is each sensor's detection cell occupied by something that can move".
- NOT is available through the power rules (powered→unpowered gives no signal, and a stopped item ignores commands while unpowered) and the "every 2nd time" items (alarm clock, air conditioner 1-in-3). These are the community's building blocks for inversion and parity.
- Most practical builds rely on the Hatch window (18-frame cycle) as the standard relay and on seawater as the standard clock medium.

### Gaps
- No tile-exact layouts for the AND, SR latch, delay or adder circuits could be read; they are in embedded X posts and videos.
- No measured maximum chain length or signal-loss rule was found. Signals appear to relay indefinitely through movable objects, limited only by cooldowns and map-cell effects.
- Clock periods in seconds for given water/magma channel lengths were not found.

---

## 5. Full item list (JP / EN names), unlocks and recipes, and "when powered and on" behaviour when off

### Takeaway
The circuit system uses about 30 items. Electrical parts unlock across the story: Utility pole in Bleak Beach, generator kits after the Bleak Beach events, the sensor and the two switches at environment Lv 6 in different towns, the Mini generator at Sparkling Skylands Lv 6, and the wireless transmitters from Porygon. The posts come from DLC 1 (Chinchou). An unpowered powered item ignores signals but keeps its on/off state, and powering an item that is already "on" itself gives a signal.

### Cited Findings
Table built from the cited pages. JP↔EN pairs are matched by identical unlock source and description; where a pair is my match rather than a source's, it is flagged in Inferences.

| JP | EN | Unlock / recipe | Circuit role | Source |
|---|---|---|---|---|
| センサー | Laser sensor | Shop, Rocky Ridges Lv 6, 1,000 coins. Pokémetal×1 + Iron ingot×1 (Serebii: Pokémetal×1 only). 3D print 2 Rare Pokémetal | Edge-triggered detector, 11-cell output | [GameWith](https://gamewith.jp/pocoapokemon/549488), [Serebii](https://www.serebii.net/pokemonpokopia/items/lasersensor.shtml) |
| ゆかつきスイッチ | Floor switch | Shop, Withered Wastelands Lv 6. Pokémetal×1 + Glowing stone×1. Found near Rocky Ridges museum ruins. 3D print 2 Rare Pokémetal | Momentary, 5×5×5 | [GameWith](https://gamewith.jp/pocoapokemon/548702), [Serebii](https://www.serebii.net/pokemonpokopia/items/floorswitch.shtml) |
| カベつきスイッチ | Wall switch | Shop, Bleak Beach Lv 6. Pokémetal×1 + Iron ingot×1. Found: Sparkling Skylands (red ball), Rocky Ridges museum ruins | Toggle, 7×7×7 | [GameWith](https://gamewith.jp/pocoapokemon/549326), [Serebii](https://www.serebii.net/pokemonpokopia/items/wallswitch.shtml) |
| カードリーダー | Card reader | Hidden room found with Neo Dowsing Machine after completing the Pokédex. Pokémetal×1. Found in Sparkling Skylands | Toggle, 7×7×7 | [Serebii](https://www.serebii.net/pokemonpokopia/items/cardreader.shtml), [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| ミニはつでんマシン | Mini generator | Shop recipe, Sparkling Skylands Lv 6. Pokémetal×1 | 5 units, 1×1×1 | [GameWith](https://gamewith.jp/pocoapokemon/547762), [Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml) |
| 風力はつでんキット | Windmill kit | Shop 300 coins. Lumber×5 + Twine×5 | 10 units (20 on high ground) | [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/4588) |
| 水力はつでんキット | Waterwheel kit | Shop 300 coins. Lumber×15 + Stone×5 | 20 units; needs liquid at its gear | [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/4588) |
| 火力はつでんキット | Furnace kit | Shop 300 coins. Iron ore×15 + Sea-glass fragments×5 | 30 units; needs fuel | [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/4588) |
| じゅうでんスポット | Charging station kit | Iron ingot×10 + Pokémetal×10 (planner data) | Shows connected units (up to 40, 8 per light) | [Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml) |
| でんちゅう | Utility pole | Bleak Beach yellow Poké Ball. Iron×2 + Stone×2, 5 per craft | Transmitter, 1×1×3, wire blocked by obstacles | [GameWith](https://gamewith.jp/pocoapokemon/548211), [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/4588) |
| むせんそうでんき | Wireless power transmitter | Porygon request (Sparkling Skylands: play a CD on a CD player near Porygon). Pokémetal×1, 1 per craft | Transmitter, 1×1×1, ignores obstacles | [GameWith](https://gamewith.jp/pocoapokemon/549115) |
| きりかえむせんそうでんき | Wireless power-transmitter switch | Same Porygon request. Pokémetal×1 | Transmitter you can toggle by A or signal; cooldown 13 | [Serebii](https://www.serebii.net/pokemonpokopia/items/wirelesspower-transmitterswitch.shtml), [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| むせんそうでんぼう | Wireless power-transmitter post | DLC 1: Chinchou's request "棒を3本とも光らせよう!" after the Ocean temple (Basin env Lv 3–5). Glass×2 + Pokémetal×2, 5 per craft. Found in Bubbly Basin. 3D print 2 Rare Pokémetal | Transmitter; gives slight light | [GameWith](https://gamewith.jp/pocoapokemon/571236), [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/4588) |
| きりかえむせんそうでんぼう | Wireless power-transmitter switch post | Same Chinchou request. Glass×2 + Pokémetal×2, 5 per craft | Switchable post; flavour "オンオフは簡単に切り替えられる" | [GameWith](https://gamewith.jp/pocoapokemon/571340) |
| フタつきまど | Hatch window | Shop, Withered Wastelands Lv 5. Lumber×2 (recipe: planner data) | Fastest relay/clock door (18) | [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/3447), [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| フタつきまど・じめん | Underground hatch | Shop, Withered Wastelands Lv 5. Lumber×2 (planner data) | Floor hatch; occupies the tile above | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| あげさげまど | Sash window | Shop, Bleak Beach Lv 5 (planner data) | Slower clock door (31); Pokémon can't open | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| じどうドア | Automatic doors | Skyland House recipe set. Glass×1 + Iron ingot×1 | Needs power; unpowered = stays shut | [Serebii](https://www.serebii.net/pokemonpokopia/items/automaticdoors.shtml), [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| 木のさくのトビラ / おおきな木のドア / てつのドア / シャッター / シンプルカーテン / ふねのドア | Wooden gate / Large wooden door / Iron door / Shutter / Simple curtain (L/R) / Boat door | Various shops and bundles | Multi-tile doors (2, 2×2, 3×2, 3×3) | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| ミニすいもん | Mini floodgate | Daily Shop Special / shop Bleak Beach Lv 5. Iron ore×1 | Water on/off; cooldown 67 | [Serebii](https://www.serebii.net/pokemonpokopia/items/minifloodgate.shtml) |
| つみ木 / すなば | Toy blocks / Sandbox | Toy blocks from Zorua in Bleak Beach (planner data) | Detected on every move; relay part | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| めざましどけい | Alarm clock | Bleak Beach (planner data) | No cooldown; seen on ON only; divider | [kyu49](https://kyu49.github.io/Pokopia/circuit/clock/) |
| かざぐるま / かざみどり / ふねのハンドル | Pinwheels / Weather vane / Ship's wheel | — | Detected at start of motion | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| てんじょうせんぷうき / モクローどけい | Ceiling fan / Rowlet clock | — | ON-only, 2×2×1 / self-fires on the hour | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| せんたくき / わくせいのもけい / せんぷうき / ミラーボール / エアコン | Washing machine / Model planet / Fan / Mirror ball / Air conditioner | — (all need power) | ON-only detection, no cooldown; A/C 1-in-3 | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/) |
| イルミネーションライト | (likely String lights) | — | 0 power, counts toward 20/transmitter | [kyu49](https://kyu49.github.io/Pokopia/circuit/items/), [Serebii](https://www.serebii.net/pokemonpokopia/electricity.shtml) |
| おんぷマット | Music mat (Low Do … High Do, 8 notes) | Rocky Ridges museum (4 kinds) and the official cloud island (7 kinds); daily shop. Pokémetal×1 + Glowing stone×1 (recipe: planner data) | Sounds when crossed or switched | [Gamepedia](https://gamepedia.jp/pocoapokemon/archives/3447), [GameWith](https://gamewith.jp/pocoapokemon/549326) |
| うみなりのスズ / とうめいなスズ | (two bell items) | — | Can be rung by sensor/switch since v2.0.0 | [Gamepedia v2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548) |
| ほのおのブビィぞう | Fiery Magby statue | — | Fires flame when floor switch pressed | [GameWith](https://gamewith.jp/pocoapokemon/548702) |

- [Community-tested] Off and unpowered behaviour: a powered item can't change state while unpowered. Turning power on to an item already set to "running" makes it run and emit a signal. Turning power on to an item set to "stopped" gives nothing. Losing power gives no signal. — [kyu49 signal-output](https://kyu49.github.io/Pokopia/circuit/logic_circuit/basics/signal-output/)
- [Guide claim] The Fan doesn't move without power, so it can't be used as a sensor target unpowered. — [Gamepedia 3447](https://gamepedia.jp/pocoapokemon/archives/3447)
- Note: "planner data" means this repo's data.json, which was compiled from Serebii's item database (https://www.serebii.net/pokemonpokopia/items.shtml).
- [Guide claim] Floor switch habitat "Prank button" (いたずらスイッチ): floor switch + jack-in-the-box (Frogadier/Greninja). Habitat "Researcher's desk" (研究者のデスク): 2 desks + a powered computer + a lab set, for Porygon. "Pika-pika trio stage": 3 stand mics + 3 powered posts (either kind), for Wugtrio-Umi. — [GameWith 548702](https://gamewith.jp/pocoapokemon/548702); [GameWith 549115](https://gamewith.jp/pocoapokemon/549115); [GameWith 571236](https://gamewith.jp/pocoapokemon/571236)

### Inferences
- These JP↔EN pairs are my matches by shared unlock and description, not stated by one source: フタつきまど = Hatch window, フタつきまど・じめん = Underground hatch, あげさげまど = Sash window, つみ木 = Toy blocks, イルミネーションライト = String lights. The English names come from this repo's data.json (sourced from Serebii's item database, https://www.serebii.net/pokemonpokopia/items.shtml).
- The "Hatch" (iron, Bubbly Basin Lv 8) and "Submarine window/door" are DLC 1 doors whose circuit timings nobody has measured.

### Gaps
- English names for the two bells and confirmation of the String lights mapping were not found.
- Cooldowns for most doors (Iron door, Shutter, Automatic doors, Wooden gate, DLC hatch) have not been measured.

---

## 6. Limits, bugs, quirks and patch changes

### Takeaway
Key caps:
- Generators: 64 before 2.0.0, then 128 for non-furnace types.
- Transmitters: about 252 to 256.
- Powered items: 512 before 1.1.0, then 1024 for items placed afterwards.
- CD players: 322.
- Lift platforms: 32. Elevator platforms: 32. Cameras: 8.

Known circuit bugs: clocks stop on area change, and too many ultra-fast clocks destabilise the game. Liquid circuits stop dry rocks from restarting nearby, and they show map-cell (8×8 tile) effects. Timing depends on direction.

### Cited Findings
- [Community-tested] Limits page:

  | Type | Max |
  |---|---|
  | Generators total | 64 |
  | Poles + wireless transmitters total | 252 |
  | Lights, vending machines and the like (fridges included) | 511 → 1024 from v1.1.0; at the cap you can't even store items |
  | CD player | 322 |
  | Lift platform | 32 |
  | Elevator platform | 32 |
  | Camera | 8 |

  Illumination lights use no power but count toward the cap. Most findings are by じお @echelon52a2. — [kyu49: 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Official] v1.1.0 (10 Jun 2026): electric item cap 512 → 1024, for items placed after the update. The sensor's detection range is shown when placing it. A bug where doors and windows couldn't be opened during hide-and-sneak was fixed. A bug where the charging spot and some other items left unbreakable floor after moving or dismantling was fixed. The Shutter's placement sound effect was fixed. — [Gamepedia Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597)
- [Official] v1.1.1 (19 Jun 2026): fixed "problems when the number of placed items on a stage exceeds a certain amount". — [GameWith: アップデート情報](https://gamewith.jp/pocoapokemon/547086)
- [Official] v2.0.0 (5 Aug 2026):
  - Combined non-furnace generator cap 64 → 128.
  - Sensors and switches can ring うみなりのスズ and とうめいなスズ.
  - Certain roof items no longer let water through, which matters for water circuits.
  - Fine depth adjustment when placing windows and doors.
  - Fixed おんぷマット・たかいド (High Do) sounding at the wrong time.
  - ちょすい (storing water) can now hold liquid without removing it, and the released water level auto-matches the surrounding level.
  — [Gamepedia Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)
- [Official] v1.0.3: fixed a Bleak Beach request "じゅうでんスポットを動かそう!" that couldn't progress. — [GameWith 547086](https://gamewith.jp/pocoapokemon/547086)
- [Community-tested] Clocks may stop depending on the timing of an area change. The sash window stops often. The ultra-fast clock stops on area change, and "placing many makes the game behave oddly". — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Community-tested] Dry rock (さらさらいわ) stops in rain or under a sprinkler and restarts at once when they are gone, but not near clock circuits. Precisely, while liquid is spreading, dry rocks in nearby map cells don't restart (credit: じお @echelon52a2). — [kyu49 water](https://kyu49.github.io/Pokopia/water/)
- [Community-tested] Held-liquid detection and the 8×8 map-cell boundary (see question 4). Conditions still under study as of 2026-04-05. — [kyu49 water](https://kyu49.github.io/Pokopia/water/)
- [Community-tested] Direction-dependent processing order and lag (see question 4). — [kyu49 other circuits](https://kyu49.github.io/Pokopia/circuit/other_circuits/); [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Hatch windows, shutters and simple curtains can be opened by wandering Pokémon. The underground hatch, sash window and wall switch are not touched by Pokémon. Prefer those in circuits that must not be disturbed. — [kyu49 items](https://kyu49.github.io/Pokopia/circuit/items/)
- [Community-tested] Plain water in a clock can create sparkles (キラキラ), so use seawater. Mud doesn't moisten crops. — [kyu49 clock](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Unverified] HAMY found the underground hatch unreliable as a sensor relay target (search snippet).

### Inferences
- The planner should hold the version-dependent caps as data: generators 64 or 128, powered items 512 or 1024. Warn near about 252 transmitters, since the sources say 252 or 256.
- Because loading and area changes can stall clocks, a "circuit check" can only confirm a design is plausible. It can't guarantee runtime behaviour.

### Gaps
- No patch note mentions changes to sensor or switch ranges, cooldowns or processing order. Whether v2.0.0 or 2.0.1 changed any timing is unknown.
- The X threads by じお @echelon52a2 and parker @yessineyra that hold the original limit measurements could not be opened (x.com blocked).
- DLC 2 (9 Dec 2026) may add circuit items; nothing is known yet.

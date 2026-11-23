# Pokémon Pokopia: what every specialty does, at what rate, and how Pokémon behave day to day

Status: complete (resumed pass, 2026-11-23). Game version in force: Ver. 2.0.1 (7–8 Sep 2026, bug fixes only). Ver. 2.0.0 (5 Aug 2026) brought the Bubbly Basin expansion, which added Scrub, gave Water and Chop new uses and let Build work underwater. Ver. 1.1.0 (9 Jun 2026) changed how followers and Gather Pokémon behave.

Labels: [Official] = in-game text or Nintendo patch notes (as quoted by Serebii or Nintendo support); [Datamined]; [Community-tested] = a player measured it; [Guide] = a guide states it without showing a test; [Unverified] = a single post, anecdote or search-snippet claim. No datamined source turned up for any specialty rate or range.

Main sources used. Serebii pages (EN). The ぽこポケ学会 wiki (kyu49.github.io/Pokopia): community-tested, with every finding credited to the player who found it. Game8 JP per-specialty pages (game8.jp/pocoapokemon/7675xx), which mostly quote the in-game one-line text. 攻略大百科 (gamepedia.jp) 2257, an explainer that covers every specialty, updated 2026-08-09. Game8 EN. Long-play notes on note.com by Splatoonブキ研究所.

## 1. Specialty by specialty: trigger, result, rate, range, needs

### Takeaway
There are 33 specialty labels, and a Pokémon can have up to two. In data.json, 168 of 367 Pokémon have two. Each specialty fires in one of four ways:
- **Automatically near a target.** Burn, Grow, Water and Generate act when Ditto brings a following Pokémon to the target and looks at it. Several of them also act unprompted from the Pokémon's home: Litter, Gather, Water with a filled basin, and Generate "in their free time".
- **On request.** Ditto talks to the Pokémon, picks 「これ見て！」 and shows an item. Chop, Crush, Burn, Recycle, Rarify, Scrub, Engineer, Paint, Appraise, Collect and Gather Honey work this way.
- **As a building leader.** Build, Bulldoze, Engineer and Party lead projects.
- **As a service.** Fly, Teleport, Dream Island, Storage, DJ, Yawn, Eat and Trade.

Hard numbers are rare. The ones found: Gather Honey costs 3 honey per trade and allows 4 trades a day. Generate power lasts until the next 05:00. Dream Island works once a day. DJ Rotom holds 5 CDs. Up to 10 registers can trade at once per area. Comfort or friendship changes only Litter output, Crush's rare paint colours and Scrub's cleaning bonus.

### Cited Findings
**General mechanics**
- [Guide] "Each Pokémon can have up to two of these specialties." — [Serebii, Specialty](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Trigger types, per the guide:
  - Automatic: bring the following Pokémon next to the target and look at it (the target gets selected), and the Pokémon acts. The guide's example is Burn lighting a fire, and it says Grow and Generate work the same way.
  - Processing or exchange: talk to the Pokémon, choose 「これ見て！」 and show the item. Crush makes paint from berries, Burn makes brick, Chop makes lumber.
  - Build and Bulldoze: work starts once the materials and helper Pokémon listed on the sign in front of the kit are gathered.

  — [攻略大百科 2257, updated 2026-08-09](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] Following Pokémon "help with town-building through their specialties", using moves Ditto can't learn. — [GameWith 545429](https://gamewith.jp/pocoapokemon/545429)
- [Guide] Water, Grow and Gather Pokémon may get hungry mid-job, stop working and ask for food. Any food sets them working again. — [Game8 EN, List of Specialties, updated 2026-08-06](https://game8.co/games/Pokemon-Pokopia/archives/582704)
- [Guide] Hungry Pokémon may refuse to follow. Give them food. — [Game8 JP 768614, updated 2026-11-23](https://game8.jp/pocoapokemon/768614)
- [Official, patch notes] Ver. 1.1.0 (9 Jun 2026): "Pokémon processing materials at the community box or furnace will now prioritise locations closer to their own habitat." — [Serebii, Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Official, patch notes] Ver. 2.0.0 (5 Aug 2026): "Paint, Gather Honey, and Collect can now be performed multiple times in the same interaction." Lost relics can be appraised in batches of up to 10. "The Build specialty can now be used to build houses underwater." — [Serebii, Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] Ver. 2.0.0 added Scrub and gave Water and Chop new abilities. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Grow (さいばい)**
- [Official text via guide] "Pokémon with the Grow specialty can make plants grow faster." — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Lead a Grow Pokémon to a spot that is seeded and watered, and the vegetables or flowers grow one stage on the spot (「すぐに一段階成長」). — [Game8 JP Grow 767548, updated 2026-08-06](https://game8.jp/pocoapokemon/767548)
- [Guide] Plants respond differently: flowers grow instantly, while crops and trees go up one growth stage. — [Game8 EN Grow 585561](https://game8.co/games/Pokemon-Pokopia/archives/585561)
- [Guide] Crops that were not watered first do not grow, even with Grow. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] For a self-running farm, move a Grow Pokémon onto the farm (畑に引っ越し) so crops grow faster. Keep a Water Pokémon there too for stability. Harvesting stays manual. — [Game8 JP automation 769942, updated 2026-10-02](https://game8.jp/pocoapokemon/769942)

**Burn (もやす)**
- [Guide] Burn lights flammable objects such as a campfire. It turns copper or iron into bars in a furnace (ようこうろ), and squishy clay into brick. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Game8 JP Burn 767549](https://game8.jp/pocoapokemon/767549) (ねんど→レンガ, てつ→のべぼう)
- [Guide] A Burn Pokémon living near a community box turns clay into brick on its own. With a furnace nearby and an iron-dropping Litter Pokémon, iron becomes iron ingots on its own. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- (Already covered by earlier research, not re-researched: lights fires within 4 tiles; 1 clay → 2 brick.)

**Water (うるおす)**
- [Official text via guide] Water Pokémon "can use a full water basin to spray water on nearby fields and plants". — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Water also covers these:
  - A Water Pokémon near a filled basin waters the nearby plants.
  - Offering food at a rain-dance spot (あまごいスポット) makes it perform a rain dance.
  - In front of mud it applies bubbles; spraying water afterwards removes the mud.
  - Since 2.0.0 it puts bubbles on underwater plants.

  — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] Underwater crops need bubbles from a Water Pokémon or from a Bubble Machine. — [Serebii, Dive](https://www.serebii.net/pokemonpokopia/dive.shtml)
- [Guide] With no sprinkler, place a water basin by the field and move a Water Pokémon in nearby, and it waters the field. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- [Guide] Field crops can be watered once a day. A Water Pokémon with a water basin nearby, or a sprinkler, automates it. — [Game8 JP 767308](https://game8.jp/pocoapokemon/767308)

**Chop (きをきる)**
- [Guide] Chop turns small logs into lumber and, since 2.0.0, watermelon into cut watermelon. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- (Already covered by earlier research: 1 log → 5 lumber.)

**Build (けんちく)**: leads kit construction. See section 2.
- [Guide] At least one Build Pokémon is required. "Without a leader you cannot build." — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Crush (つぶす)**
- [Official text via guide] Crush Pokémon "can mash materials into different things". — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Berries map to paints:

  | Berry | Paint |
  |---|---|
  | Oran (ヒメリ) | red |
  | Sitrus (ナナシ) | yellow |
  | Chesto (カゴ) | blue |
  | Pecha (モモン) | pink |
  | Lum (ラム) | green |
  | Rawst (チーゴ) | light blue |

  "When in good condition (調子が良いと)" a Crush Pokémon sometimes gives rare white paint (from Oran, Chesto or Lum) or black paint (from Rawst, Pecha or Sitrus). — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- (Already covered by earlier research: 1 berry → 5 paint.)

**Bulldoze (じならし)**
- [Guide] Bulldoze leads the Pokémon Center rebuild, demolition (解体) and preparing a relocation (引っ越し準備). — [Game8 JP Bulldoze 767544](https://game8.jp/pocoapokemon/767544); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml) ("can lead your demolition, rebuilding or relocation projects")

**Litter (ちらかす)**
- [Official text via guide] Litter Pokémon "will drop useful materials near their homes". — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] "As time passes, each Pokémon will bring an item... The higher the Pokémon comfort level, the more items that get brought." — [Serebii, Litter](https://www.serebii.net/pokemonpokopia/litter.shtml)
- [Community-tested] Drop rules:
  - Drops are keyed to the home's position, not the Pokémon's.
  - Nothing drops if Ditto can see the spot.
  - Nothing drops on a tile with no block ground. Doors and wire mesh don't count as ground.
  - Nothing drops on a tile holding an object or liquid, except that an open door counts.
  - When few tiles are eligible, drops concentrate on them.
  - Unconfirmed: a check every 15 minutes, no new drops at 5 or more until collected, honey capped at 1.

  — [ぽこポケ学会, ちらかすの仕様](https://kyu49.github.io/Pokopia/chirakasu/)
  (Drop-tile geometry was covered by earlier research.)
- [Community-tested] Litter works even while the Pokémon is not displayed in town. The amount depends on the material and the Pokémon:
  - Honey drops 1 at a time, with a stock cap of 1.
  - Stone comes in large amounts, with individual differences: fossil Pokémon drop a lot, Blissey only a little.
  - Drops have a display cap. The excess is stocked internally and re-drops the moment space frees up, so collect in two passes.

  — [note, Splatoonブキ研究所, 2026-04-10](https://note.com/splatoonweapon/n/n0c7d1da22923)
- [Guide] Litter stops while the spot is in Ditto's view, so build Litter homes a little away from your base. Use 3 or more Litter Pokémon with 1–2 Gather Pokémon. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)

**Trade (とりひき)**
- [Guide] A Trade Pokémon sometimes opens a barter shop. It needs a powered cash register on a wide table; joined countertops also work. — [Game8 JP Trade 767535, updated 2026-08-06](https://game8.jp/pocoapokemon/767535)
  - A repaired Pokémon Center or a built Poké Mart comes with a table and register, so powering it is enough.
  - The Center does not trade during item-exchange events such as Sableye's gem drive.
  - Which Trade Pokémon opens a shop is random each time.
  - A Pokémon running a shop can't be taken along. End the shop with 「とりひきおしまい！」.
- [Guide] Shop rules: Trade Pokémon set up shop at a powered register plus table, including the Poké Mart and a Pokémon Center with no event on. The range of items grows with the size of the countertop. You pay with up to 4 different item types. Items that match the Pokémon's favourites earn +50% points. You can end trading but cannot force it to start. — [Serebii, Trade](https://www.serebii.net/pokemonpokopia/trade.shtml)
- [Guide] Trade Pokémon "occasionally" set up in a Pokémon Center, with items that vary by day. — [Serebii, Pokémon Center](https://www.serebii.net/pokemonpokopia/pokemoncenter.shtml)
- [Guide] Item counts by venue: a Pokémon Center offers 6 or more, a Poké Mart up to 6, a register plus desk 1 or more depending on desk size.
  - A register powered by a Generate Pokémon goes dead after a day, so use utility poles.
  - Trading may not start right after launching the game or changing the clock. Change area or wait.
  - Ver. 1.1.0 added an option to cancel during events.

  — [攻略大百科 4307, updated 2026-06-11](https://gamepedia.jp/pocoapokemon/archives/4307)
- [Community-tested] At most 10 registers trade at once per area, counting the Pokémon Center and Poké Mart. To trade with a different Pokémon, talk to a trader twice and choose 「とりひきをやめる」. — [ぽこポケ学会, 色々な上限](https://kyu49.github.io/Pokopia/limitation/)

**Search (さがしもの)**
- [Guide] With a Search Pokémon following, hold the Dowsing Machine and press A. It beeps and guides you to buried items. Glowing blocks are found the same way. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [攻略大百科 4588](https://gamepedia.jp/pocoapokemon/archives/4588)

**Gather (しわける)**
- [Guide] Gather picks up dropped materials and puts them in a community box. It also loads materials from the box into furnaces and similar machines. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Community-tested] How Gather behaves:
  - The community box must be placed near the homes.
  - The Pokémon picks up only items it can see, and it physically walks to them.
  - It doesn't choose this action often, and the timing is random.
  - It only works while it is present (displayed) in town, so it is affected by the display cap.
  - It is effectively unusable on Cloud Islands.

  — [note, Splatoonブキ研究所, 2026-04-10](https://note.com/splatoonweapon/n/n0c7d1da22923)
- [Community-tested] Gather does not pick up field crops or fallen berries. — [ぽこポケ学会, 畑の仕様](https://kyu49.github.io/Pokopia/harvest/)
- [Guide] A Pokémon with both Gather and Burn (Trapinch line, トロッゴン in the guide) makes automation more efficient. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- (Community-box reach was covered by earlier research.)

**Generate (はつでん)**
- [Official text via guide] Generate Pokémon "will power nearby machines in their free time". — [Game8 EN 582704](https://game8.co/games/Pokemon-Pokopia/archives/582704)
- [Guide] A following Generate Pokémon powers electrical items when you go near them. Power supplied this way cuts out after the next 05:00. — [攻略大百科 4588, updated 2026-08-21](https://gamepedia.jp/pocoapokemon/archives/4588)

**Recycle (リサイクル)**
- [Guide] Recycle turns non-burnable garbage into iron ore and wastepaper into paper. — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] It does this on its own when it lives near a community box. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- (Already covered by earlier research: 1 garbage → 2 iron ore.)

**Fly (そらをとぶ) and Teleport (テレポート)**
- [Guide] Mark a Pokémon as "searching" with Pokédex > the Pokémon > + button. Then talk to a Fly Pokémon, which flies you to it, or a Teleport Pokémon, which takes you there instantly. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Game8 JP Fly 767542](https://game8.jp/pocoapokemon/767542); [Game8 JP Teleport 767541](https://game8.jp/pocoapokemon/767541)
- [Official, patch notes] Since 2.0.0, if the Pokémon you are searching for is in another town, Return Home takes you there. Ver. 2.0.1 fixed "the Pokédex search failing to locate Pokémon". — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml); [Pokopia Guide, update history](https://pokopiaguide.com/guides/update-history); [Nintendo support](https://en-americas-support.nintendo.com/app/answers/detail/a_id/71348/p/1095/c/120)

**Hype (もりあげる)**
- [Official text via guide] Hype Pokémon "will start dancing when they hear music, improving the mood". — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Bring a Hype Pokémon near DJ Rotom while it plays a CD and it dances. If Ditto stands near the dancers without pressing anything, Ditto dances too and recovers a small amount of PP. — [Game8 JP Hype 767534, updated 2026-08-06](https://game8.jp/pocoapokemon/767534)
- [Guide] Ways to raise mood:
  - DJ Rotom CDs
  - Hype Pokémon near a playing Rotom
  - Relics in Rocky Ridges
  - Some furniture: balloons, stage, party wall decorations
  - Party plates with food

  Chef Dente's request needs 100 points. — [Game8 JP 768602](https://game8.jp/pocoapokemon/768602)

**Paint (ペイント, Smearguru only)**
- [Guide] Paint changes item colours using paint. It adds patterns once you show it a Human Record or an item with that pattern, and some items can be painted part by part. Taken near a blank canvas, it paints one of 3 random pictures; reset the canvas with Water Gun to get another. Not every item can be painted. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Official, patch notes] Ver. 2.0.0 made more items paintable: stylish stool, handrail, metal chain, workbench, vending machine, bike, bookcase, Pokémon Center counter, arrow sign, rope. — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)

**Storage (しゅうのう, Gulpin and Swalot)**
- [Guide] Storage holds items through 「ものを出し入れしたい」. While the storing Pokémon follows you, a workbench can use the stored items as materials. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Community-tested] Gulpin and Swalot each have a capacity limit, but the figure is not given in the text captured. — [ぽこポケ学会, 色々な上限](https://kyu49.github.io/Pokopia/limitation/)

**Engineer (しょくにん, Tinkmaster only)**
- [Guide] Engineer leads huge builds and rebuilds. Made leader of an ordinary build, it finishes the building faster than usual. It turns iron ingots into Tinkagear. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] Tinkmaster leading a kit build: "a Next Day build becomes just 1 hour". — [Serebii, Building](https://www.serebii.net/pokemonpokopia/building.shtml); [攻略大百科 1611](https://gamepedia.jp/pocoapokemon/archives/1611) (1 day → 1 hour)

**Appraise (かんてい, Professor Tangrowth)**
- [Guide] Show lost relics, large or small, to Professor Tangrowth to have them appraised. Since 2.0.0 this works in batches of up to 10. — [Game8 JP 767530](https://game8.jp/pocoapokemon/767530); [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)

**Collect (コレクター, Gimmighoul and Gholdengo)**
- [Guide] Collect exchanges rainbow or silver feathers, and appraised relics you don't want, for rare items: Gamer, Luxury, Poké Ball, Cute and Antique items, music mats, and rare materials such as Strange strings. — [Serebii, Collect](https://www.serebii.net/pokemonpokopia/collect.shtml); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Dream Island (ゆめしま, Drifloon)**
- [Guide] Show a doll to Drifloon and it takes you to a Dream Island. This works once per day, the doll decides which island, and the island resets at the end of the day. — [Serebii, Dream Islands](https://www.serebii.net/pokemonpokopia/dreamislands.shtml); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Explode (ばくはつ, Voltorb and Electrode)**
- [Guide] Take the Pokémon to a launch tube (うちあげづつ). Once it is inside, light it with A. It flies off and explodes on landing, destroying the things around it. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Game8 JP 768261](https://game8.jp/pocoapokemon/768261); [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml) ("fired out of a cannon, destroying everything around them on impact")

**Yawn (あくび, Slowpoke)**
- [Guide] Yawn tells you how humid (うるおい) the area currently is. Slowpoke is the only Yawn Pokémon listed, with Water and Yawn. — [Game8 JP Yawn 767533](https://game8.jp/pocoapokemon/767533); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**DJ (DJ Rotom)**
- [Guide] Give DJ Rotom CDs and it plays music. Given several, it plays them in sequence. It also tells you the current mood level. — [GameWith 545429](https://gamewith.jp/pocoapokemon/545429); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] A CD player can be heard only within a short range. DJ Rotom holds up to 5 CDs and plays them on loop whenever you're around, so taking it along gives constant music. — [Serebii, CDs](https://www.serebii.net/pokemonpokopia/cds.shtml)

**Party (パーティー, Chef Dente)**
- [Guide] Chef Dente leads party cooking, and a party can't be held without it. Cooking with it at cooking tools sometimes yields more than usual. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] With Chef Dente as partner you frequently get double the meal. The helper Pokémon's specialty changes the dish; the specialties involved are Chop, Crush, Generate, Recycle, Water, Burn and Explode. — [Serebii, Cooking](https://www.serebii.net/pokemonpokopia/cooking.shtml)

**Eat (くいしんぼ, Mosslax)**
- [Guide] Offering food to Mosslax gives a boost that depends on the food's flavour:

  | Flavour | Boost |
  |---|---|
  | Sweet | relics easier to find |
  | Bitter | rare finds from sparkling water surfaces |
  | Dry | rare-feathered Pokémon easier to see |
  | Sour | better shop stock |
  | Spicy | Pokémon appear at habitats more readily |

  — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] The boost depends on the food's flavour and lasts until the next update time, 4:59. Game8 says there are 6 flavours, while 攻略大百科 lists only 5. Offerings unlock after you clear the Bleak Beach story. — [Game8 JP daily tasks 767308, updated 2026-03-31](https://game8.jp/pocoapokemon/767308)

**Illuminate (はっこう, Peakychu)**
- [Guide] Peakychu lights up the whole town, and while it glows "Pokémon stay lively even at night". It must first charge at a sufficiently powered charging station (じゅうでんスポット). — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)

**Gather Honey (ミツあつめ, Vespiquen)**
- [Guide] Vespiquen trades honey for furniture with special patterns. Each trade costs 3 sweet honey, and you can trade up to 4 times a day. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257). Since 2.0.0 several trades can be done in one conversation. — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)

**Transform (へんしん, Ditto)**
- [Guide] Ditto uses Transform to change into things and use moves. — [Game8 JP 767526](https://game8.jp/pocoapokemon/767526); [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml) ("improve its moves")

**Rarify (レアもの, Porygon-Z in the guide)**
- [Guide] Rarify turns Star Pieces into rare Pokémetal (レアポケメタル). — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml); [Game8 JP 768354](https://game8.jp/pocoapokemon/768354); [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Scrub (みがく, added in 2.0.0)**
- [Guide] Scrub turns grubby pearls into shiny pearls and polishes items such as mirrors. It cleans Pokémon near it, and cleaning another Pokémon while following you raises your friendship. Examples: Cloyster, Sharpedo, Primarina. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257); [Game8 JP 804444](https://game8.jp/pocoapokemon/804444)
- [Guide] A Scrub Pokémon that is following you cleans the Pokémon you meet, which boosts that Pokémon's comfy level and friendship. — [Serebii, Friendship](https://www.serebii.net/pokemonpokopia/friendship.shtml)

**??? (no specialty)**
- [Guide] Pokémon with "???" have no specialty: Magikarp, Kyogre, Lugia and Ho-Oh. Magikarp is the only one that can be given a place to live. — [Bulbapedia, ??? (specialty)](https://bulbapedia.bulbagarden.net/wiki/%3F%3F%3F_(specialty)) (search snippet; the site returns 403 here); [Serebii, none list](https://serebii.net/pokemonpokopia/pokedex/specialty/none.shtml). data.json lists the same four.

**Comfort and friendship effects on specialties**
- [Guide] Higher comfort means more Litter items (Serebii, above). Crush gives its rare colours "when in good condition" (攻略大百科). Scrub raises comfort and friendship (Serebii).
- [Guide] Pokémon with high friendship sometimes give gifts of materials they found. — [Serebii, Friendship](https://www.serebii.net/pokemonpokopia/friendship.shtml)
- No source ties Grow, Water, Generate, Burn or Build output to comfort or friendship.

**Checking data.json "specialties" descriptions against the sources**
- Grow: "Grows each watered plant one stage a day; more than one adds nothing." Partly contradicted.
  - Game8 EN says flowers grow fully at once and only crops and trees gain one stage.
  - Game8 JP says the stage is gained immediately (すぐに).
  - No source found states the "a day" limit or that more than one Grow Pokémon adds nothing.
- Chop: "Cuts trees". Not supported. Every source describes Chop as processing logs into lumber, plus watermelon into cut watermelon since 2.0.0. Trees are cut with Ditto's own Cut move.
- Crush: "Breaks rocks; runs the Concrete mixer". Not supported. Sources describe berries to paint only, and Serebii's general "mash materials into different things". No source says who runs the concrete mixer, and rocks are broken with Ditto's Rock Smash.
- Bulldoze: "Clears and flattens land for big builds". Contradicted. Bulldoze leads Pokémon Center rebuilds, demolition and relocation. It does not terraform.
- Build: "Builds kits and houses". Only kits. Houses made of blocks need no Build Pokémon, no materials sign and no wait (攻略大百科 1611, section 2).
- Rarify: "Turns items rare". Too vague; it specifically turns Star Pieces into rare Pokémetal.
- Scrub: "Cleans things (Basin)". Incomplete. It also turns grubby pearls into shiny pearls, polishes items and cleans Pokémon for comfort and friendship.
- Party: "Throws parties". More exactly, Chef Dente is the leader that party cooking requires.
- Eat: "Eats offerings". More exactly, an offering gives a flavour-based boost until 04:59.
- Confirmed as written: Generate ("Powers nearby machines until 5:00 the next day") and Gather Honey ("4 times a day", 攻略大百科). Burn, Water, Recycle, Fly, Teleport, Storage, Engineer, Appraise, Collect, Dream Island, Explode, Yawn, DJ, Illuminate and Transform are consistent with the sources.
- ???: "Unknown or none". Sources say "none".

### Inferences
- A planner can model specialties as four classes:
  - Proximity effects with a target, needing the Pokémon present: Grow, Water, Burn, Generate.
  - Passive home-based producers: Litter, plus Gather, Water and Generate acting on their own.
  - Talk-to processors with no range: Chop, Crush, Burn-brick, Recycle, Rarify, Scrub, Engineer-gear, Paint, Appraise, Collect, Honey.
  - Project leaders: Build, Bulldoze, Engineer, Party.
- Only Litter, Gather, Water with a basin and Generate act without Ditto present, so only these four need reach and stacking rules in the planner.
- Hunger stopping Water, Grow and Gather mid-job suggests those three run as timed jobs. A planner can't predict hunger, so treat their output as best case.

### Gaps
- No tile range is published for Grow, Water (basin to field) or Generate acting on their own from home. Earlier research has the Burn 4-tile figure.
- There is no rate (per hour or per day) for Litter drops, Gather pick-ups or Trade shop openings, and no Gulpin/Swalot capacity figure.
- No data-mine of specialty parameters was found.
- Who runs the concrete mixer could not be confirmed.
- Every Bulbapedia, thegameswiki and rankedboost claim here is a search snippet only, because those hosts are blocked or unreachable from this session.

## 2. How Ditto asks for a specialty: Build, Bulldoze, kits, helpers and speed

### Takeaway
A kit is built by placing it and then bringing a set number of Pokémon to it, including the specialties printed on its sign. One Build leader is always required, and big kits also need 1–3 other specialties, sometimes twice. Any Pokémon with the right specialty can stand in for the one pictured. Build time is fixed per kit: 15 minutes, 1 hour, or "next day", meaning completion at the next 05:00. Tinkmaster (Engineer) turns a next-day build into 1 hour.

Per-area caps are 40 kit houses (two-room houses count as 2) and 14 builds in progress at once. No cooldown or daily limit on asking a Pokémon to build was found. Whether extra Build Pokémon speed up a single kit is unconfirmed. Bulldoze works the same way for Pokémon Center rebuilds, demolition and relocation.

### Cited Findings
- [Guide] Build and Bulldoze start work once the materials and helper Pokémon on the sign in front of the building are gathered. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] Kit houses always need at least 1 Build Pokémon. Small buildings take about 15 minutes; large ones must wait for the next day change at 05:00. Bringing Tinkaton (おやかた) cuts a 1-day build to 1 hour, which is useful on Cloud Islands where the clock can't be changed. — [攻略大百科 1611, updated 2026-09-15](https://gamepedia.jp/pocoapokemon/archives/1611)
- [Guide] Houses made from blocks need no materials sign, no Build Pokémon and no wait. They must be at least 2 tiles wide (a 1×4 shape doesn't count as a house), and an over-large floor may not be recognised. — [攻略大百科 1611](https://gamepedia.jp/pocoapokemon/archives/1611)
- [Guide] Kit time is real time, from about 10 minutes to the next day. — [Serebii, Time & Day](https://www.serebii.net/pokemonpokopia/timeday.shtml)
- [Guide] Each area has 40 building points, and each build uses 1 or 2. Tinkmaster leading turns "a Next Day build" into "just 1 hour". — [Serebii, Building](https://www.serebii.net/pokemonpokopia/building.shtml)
- [Community-tested] Area caps:
  - 40 kit houses per area. A large house that switches map inside counts as 2.
  - At most 14 builds in progress at once, including windmills and other generators under construction.

  — [ぽこポケ学会, 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Guide] Requirements per kit: Serebii's 56 kit pages give each kit's time and "N Pokémon including the following specialties". The full table, kept from the earlier pass, follows. — [Serebii kit pages, e.g. Leaf hut kit](https://www.serebii.net/pokemonpokopia/build/leafhutkit.shtml)

  **Homes**

  | Kit | Time | Pokémon | Specialties needed |
  |---|---|---|---|
  | Dens | 15 min | 2 | Build |
  | Leaf hut | 1 hour | 4 | Build + Chop |
  | Sand hut | 1 hour | 4 | Build + Water |
  | Stone hut | 1 hour | 4 | Build + Crush |
  | City hut | 1 hour | 4 | Build + Gather |
  | Tent | 1 hour | 4 | Build + Search |
  | Gray hut | 1 hour | 5 | Build + Gather |
  | Orange hut | 1 hour | 5 | Build + Burn |
  | Yellow hut | 1 hour | 5 | Build + Generate |
  | Pink hut | next day | 5 | Build + Crush |
  | Leaf cottage | next day | 6 | Build + Fly + Chop |
  | Sand cottage | next day | 6 | Build + Water + Generate |
  | Stone cottage | next day | 6 | Build + Burn + Crush |
  | City cottage | next day | 6 | Build + Gather + Fly |
  | Pink cottage | next day | 7 | Build + Burn ×2 |
  | Orange cottage | next day | 7 | Build + Gather ×2 |
  | Gray cottage | next day | 7 | Build + Crush ×2 |
  | Yellow cottage | next day | 7 | Build + Generate ×2 |
  | Aqua cottage | next day | 7 | Build + Water ×2 |
  | Log cabin | next day | 7 | Build + Grow ×2 |
  | Leaf house | next day | 8 | Build + Fly + Grow + Chop |
  | Sand house | next day | 8 | Build + Water + Generate + Recycle |
  | Stone house | next day | 8 | Build + Burn + Hype + Crush |
  | City house | next day | 8 | Build + Gather + Fly + Teleport |

  **Utilities and shops**

  | Kit | Time | Pokémon | Specialties needed |
  |---|---|---|---|
  | Windmill, waterwheel, furnace, charging station | 1 hour | 2 | Build |
  | Poké Ball house | next day | 4 | Engineer + Generate |
  | Poké Mart, Supermarket | next day | 4 | Build + Trade |
  | Submarine | 1 hour | 4 | Build |
  | Pokémon Center kits | next day | 8 | Build + Bulldoze, plus Chop (Wasteland), Water (Beach) or Scrub (Basin) |

  **Landmarks**

  | Kit | Time | Pokémon | Specialties needed |
  |---|---|---|---|
  | Concert stage | next day | 7 | Build + Hype ×2 |
  | Fountain plaza | next day | 7 | Build + Water ×2 |
  | Small office | next day | 7 | Build + Fly ×2 |
  | Laboratory | next day | 7 | Build + Scrub ×2 |
  | Relaxing park, Stylish café | next day | 7 | Build |
  | Clock tower | next day | 4 | not recorded |
  | Mysterious mural | next day | 4 | not recorded |
  | Pikachu fountain | next day | 3 | not recorded |
  | Moonlight dance statue | next day | 3 | not recorded |
  | Abandoned power plant | next day | 15 | Build + Fly + Crush + Generate |
  | Altar of Flame | next day | 15 | Build + Fly + Burn + Crush |
  | Freezing chambers | next day | 15 | Build + Water + Crush + Fly |
  | Ocean temple | 1 hour (as listed) | 15 | Build |

  Serebii lists no Pokémon requirements for the Imperial kits.
- [Guide] A Pokémon Center rebuild needs 8 Pokémon including Build, Bulldoze and Chop. — [Serebii, Pokémon Center](https://www.serebii.net/pokemonpokopia/pokemoncenter.shtml). The per-kit pages above vary the third specialty by region: Chop, Water or Scrub.
- [Guide] Relocation: the sign shows example Pokémon, but they don't have to be used. Only the specialties matter. For example, a relocation needs "a Bulldoze Pokémon + 1 Pokémon", so any Bulldoze Pokémon can stand in for the Onix pictured. — [Game8 JP 767983, updated 2026-11-23](https://game8.jp/pocoapokemon/767983)
- [Guide] Asking a Pokémon to follow: talk and choose 「いっしょに行こう」, or press Up on the D-pad in front of it. Up to 5 can follow, and asking a 6th is refused. — [Game8 JP 768614](https://game8.jp/pocoapokemon/768614)
- [Official, known issue in 2.0.0 notes] "When talking to a Pokémon that is currently assigned to construct buildings, options such as 'Follow me!' may sometimes fail to appear." — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Community-tested] After finishing a build, Pokémon walk back to near their home. Builders' predictable walk home is used in clock circuits. — [ぽこポケ学会, クロック回路](https://kyu49.github.io/Pokopia/circuit/clock/) (source: [GitHub docs/circuit/clock.md](https://github.com/KYU49/Pokopia/blob/main/docs/circuit/clock.md))
- [Guide] Time travel speeds up construction: close the game, set the clock past 05:00, relaunch. — [Game8 EN, search snippet](https://game8.co/games/Pokemon-Pokopia/archives/585032)
- [Unverified] Claims on speed and parallel work:
  - "More Build Pokémon at the site speeds up the process." — rankedboost (blocked here), via [search snippet](https://rankedboost.com/pokopia/specialties/build/)
  - Multiple Build Pokémon can work at the same time on different kits, and Build helpers don't use PP. — thegameswiki (unreachable), via [search snippet](https://thegameswiki.com/pokopia/wiki/build-specialty)

  Serebii's fixed time per kit and 攻略大百科's "1 Build Pokémon required" make no mention of extra builders speeding things up.

### Inferences
- For a planner: kit time is a property of the kit (15 min, 1 hour or next 05:00). The only confirmed modifier is Tinkmaster as leader, which makes next-day builds 1 hour.
- Helpers are tied up until the build ends, so the number of simultaneous builds is limited by the 14-in-progress cap and by how many Pokémon you have with each required specialty.
- Because only the specialty matters, a planner can check kit feasibility against a specialty headcount. Pokémon with two specialties probably fill only one slot each, but that is not confirmed.

### Gaps
- No source states a cooldown, a daily build limit per Pokémon, or whether a Pokémon with two specialties can fill two slots in one kit.
- No test shows whether extra Build Pokémon beyond the requirement shorten a kit.
- No source covers whether building pauses while helpers sleep. Talking to a sleeping Pokémon wakes it (section 5).

## 3. Working ranges of Grow, Burn, Water and Generate; wild habitat Pokémon

### Takeaway
No source gives a tile range for Grow, Water or Generate working on their own from a home. Guides only say to put the home "near" or "on" the farm, machine or community box, and to keep the homes grouped. Burn's 4-tile reach was covered by earlier research.

What does have numbers:
- The sprinkler item reaches 5 tiles.
- Litter drops on the home's orthogonal 1-tile ring (covered earlier).
- Furniture counts toward a home within the door's range of −4 to +3 tiles in height (kyu49).
- Ver. 1.1.0 made processors pick the box or furnace nearest their own home.

Generate power from a Pokémon ends at the next 05:00. Every Pokémon that works from home is a befriended resident of a habitat or house. No source confirms that a not-yet-befriended visitor at a habitat uses its specialty.

### Cited Findings
- [Guide] Automation layout:
  - Group the homes in one place and put the community box nearby.
  - Processors nearby process automatically.
  - Habitats placed far from the setup may stop it working well, so cluster them around it.
  - For farms, put a sprinkler at the centre, or a basin plus a resident Water Pokémon, and move a Grow Pokémon onto the farm.

  — [Game8 JP 769942, updated 2026-10-02](https://game8.jp/pocoapokemon/769942)
- [Official, patch notes] Since 1.1.0, Pokémon processing at the community box or furnace prefer the one closer to their own habitat. — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Community-tested] Sprinkler: its effect reaches upward too, so it can be buried. Water reaches up to 5 tiles from it. — [ぽこポケ学会, 畑の仕様](https://kyu49.github.io/Pokopia/harvest/). This is an item, given as a comparison for Water-specialty reach.
- [Guide] Generate power from a Pokémon lasts until after 05:00 the next day. — [攻略大百科 4588](https://gamepedia.jp/pocoapokemon/archives/4588)
- [Guide] Utility poles and wireless transmitters carry power 10 tiles from a generator. — [攻略大百科 4588](https://gamepedia.jp/pocoapokemon/archives/4588); [Serebii, Electricity](https://www.serebii.net/pokemonpokopia/electricity.shtml) (pole 10 blocks, 15 between transmitters, Manhattan distance, at most 5 blocks vertical). These figures are for items, not the specialty.
- [Community-tested] A home recognises furniture from 4 tiles below to 3 tiles above its door, counting the door's height as 0. Light sources and other environment items count only inside the house and above or below the door, from floor −1 to +3. The range shows as a white dotted line when you press the R stick near an occupied home. — [ぽこポケ学会, 家と住み心地](https://kyu49.github.io/Pokopia/house/); [Game8 JP 767983](https://game8.jp/pocoapokemon/767983) (R stick shows the range; overlapping ranges are shared)
- [Community-tested] Litter is keyed to the home's position (see section 1). — [ぽこポケ学会, ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)
- [Guide] Each habitat attracts only one Pokémon at a time. Befriend it, then move it to a house to free the habitat. — [pokopia.dev, Spawn System](https://pokopia.dev/mechanics/spawn-system)
- [Official, patch notes] Since 2.0.0, a Pokémon whose habitat is destroyed moves back if the same habitat is rebuilt "within a certain area". — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] Fire-type Pokémon can't live alongside Pokémon that like humid or cool environments, and humid-loving Pokémon dislike fire nearby. A planner placing Burn homes next to Water or Grow homes can expect complaints. — [note, Splatoonブキ研究所, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076); [Game8 JP 767983](https://game8.jp/pocoapokemon/767983) (a Pokémon refuses to move where something it dislikes is present)

### Inferences
- Without published tile radii, the safest planner rule is the home's own recognition box: the area shown by pressing R near an occupied home, which kyu49 put at door −4/+3 in height. Treat the working area of home-based Water, Grow and Generate as "within or touching that box", and label it as an estimate.
- A "wild" habitat visitor seems to become a resident with that habitat as its home once befriended. Only residents act from home, so a planner should count only befriended residents as workers.

### Gaps
- There are no tile radii for:
  - Water from a filled basin to the field.
  - Grow from home to crops.
  - Generate from home to machines.
  - How far Gather Pokémon walk to items.
- No test confirms whether unbefriended habitat visitors use specialties.

## 4. Stacking and Pokémon with two specialties

### Takeaway
A Pokémon with two specialties uses both. Guides recommend Gather+Burn Pokémon for automation, and data.json shows 168 of 367 Pokémon with two. Several Litter Pokémon clearly add output, since each drops at its own home; guides suggest 3 or more Litter with 1–2 Gather. No source tests whether several Grow, Water or Generate Pokémon on the same target act faster. Kits demand a fixed count per specialty but give no speed bonus for extras. Trade is capped per area at 10 active registers.

### Cited Findings
- [Guide] "Each Pokémon can have up to two of these specialties." — [Serebii](https://www.serebii.net/pokemonpokopia/specialty.shtml)
- [Guide] Trapinch (トロッゴン in the guide) has Gather and Burn. Keeping many two-specialty Pokémon like this nearby raises automation efficiency. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- [Guide] "Some Pokémon have several specialties, so learn the right way to ask for each." — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)
- [Guide] Use 1–2 Gather Pokémon and 3 or more Litter Pokémon for efficient automated collection. — [Game8 JP 769942](https://game8.jp/pocoapokemon/769942)
- [Community-tested] You don't need every Litter Pokémon. Wool (わた), vine rope (つたひも) and stone tend to pile up in excess. — [note, 2026-04-10](https://note.com/splatoonweapon/n/n0c7d1da22923)
- [Guide] Several kits require two of the same specialty: Concert stage (Hype ×2), Fountain plaza (Water ×2), Small office (Fly ×2), Laboratory (Scrub ×2) and all the coloured cottages. — [Serebii kit pages](https://www.serebii.net/pokemonpokopia/build/concertstagekit.shtml)
- [Community-tested] At most 10 registers trade at once per area. — [ぽこポケ学会, 色々な上限](https://kyu49.github.io/Pokopia/limitation/)
- [Guide] Which Trade Pokémon opens a shop is random. — [Game8 JP 767535](https://game8.jp/pocoapokemon/767535)
- [Unverified] More Build Pokémon speed up a build (rankedboost snippet). See section 2.

### Inferences
- Litter output scales with the number of Litter homes and with comfort. Gather is limited by being present (the display cap) and by its rare action choice, so more than 2 Gather Pokémon probably adds little. Game8's 1–2 Gather to 3+ Litter ratio is the practical default.
- For Grow, a planner should not assume stacking. data.json already says "more than one adds nothing", but no source here supports or refutes that.

### Gaps
- There is no test of Grow, Water or Generate stacking on one field or machine.
- No source says whether a two-specialty Pokémon can do both jobs at once, such as Gather and Burn in one trip, or alternates between them.

## 5. Daily life: schedule, sleep, wandering, pathing, furniture, interactions, following Ditto

### Takeaway
Time runs on the Switch clock, and the day resets at 05:00. Sources split the day differently:
- Serebii: Morning 05–07, Day 07–17, Evening 17–19, Night 19–05.
- Game8 JP: Morning 05:00–07:59, Day 08–17.
- pokopia.dev spawn windows: 5–10 / 10–17 / 17–20 / 20–5.

Most Pokémon sleep at night. Kit-house residents go indoors to sleep, and others use Relaxation furniture or a sofa edge. Talking to a sleeping Pokémon wakes it at once with no penalty. Nocturnal Pokémon sleep at home by day.

The AI repertoire is small. Pokémon idle near home, visit friends or Ditto, use hot springs and walk to register shops. They have a maximum action range, and roads let them travel farther.

When following, a Pokémon is limited by its body size and whether it can fly. Large ones can't pass narrow gaps, flyers ignore gaps, and a separated Pokémon stays where it is. Up to 5 can follow.

### Cited Findings
**Clock and schedule**
- [Guide] The game uses a real-time 24-hour clock. A day begins at 05:00 local time, and stamp cards and other things reset then. — [Serebii, Time & Day](https://www.serebii.net/pokemonpokopia/timeday.shtml)
- Day segments by source:

  | Source | Morning | Day | Evening | Night |
  |---|---|---|---|---|
  | [Guide] [Serebii, Time & Day](https://www.serebii.net/pokemonpokopia/timeday.shtml) | 05:00–07:00 | 07:00–17:00 | 17:00–19:00 | 19:00–05:00 |
  | [Guide] [Game8 JP 769153, updated 2026-08-06](https://game8.jp/pocoapokemon/769153) | 5:00–7:59 | 8:00–17:00 (9 hours) | 17:00–19:00 | 19:00–4:59 |
  | [Guide] [pokopia.dev](https://pokopia.dev/mechanics/spawn-system) (spawn time-of-day filter) | 5–10 AM | 10 AM–5 PM | 5–8 PM | 8 PM–5 AM |

  The three disagree on where Morning ends.
- [Guide] Weekday boosts: Friday raises daily-challenge coins 50% to 300. Sunday makes Lost Relics and Sparkling ripples more likely. — [Serebii, Time & Day](https://www.serebii.net/pokemonpokopia/timeday.shtml)

**Sleep**
- [Guide] At night Pokémon may be asleep. Talking to one wakes it immediately, so it doesn't affect play. — [Game8 JP 769153](https://game8.jp/pocoapokemon/769153)
- [Guide] "Most Pokémon go to sleep when darkness falls." Japanese night-time players feel guilty waking them to work. — [Automaton, via search snippet](https://automaton-media.com/en/news/night-owl-pokemon-pokopia-players-in-japan-heartbroken-about-having-to-wake-up-sleeping-pokemon/) (host unreachable here); [OpenCritic](https://opencritic.com/news/27777/pokopia-players-cant-handle-the-emotional-toil-of-waking-up-their-pokemon-to-perform-hard-labour)
- [Guide] More nocturnal Pokémon are found sleeping in their homes and habitats during the day and are more active at night. Night Pokémon placed in a dark area such as a cave, or Day Pokémon surrounded by bright lights, spawn whatever the time. — [Serebii, Time & Day](https://www.serebii.net/pokemonpokopia/timeday.shtml)
- [Guide] Include a piece of Relaxation furniture in a home, "as you will find them sleeping there during certain times of day". — [Game8 EN 585501, updated 2026-04-06](https://game8.co/games/Pokemon-Pokopia/archives/585501)
- [Community-tested] Pokémon living in a kit house go inside it to sleep. — [ぽこポケ学会, ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)
- [Official, patch notes] Ver. 1.1.0 changes:
  - Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Glaceon and Sylveon now sleep at the edge of sofas, as Leafeon already did.
  - "Pokémon accompanying Ditto can now use chairs and beds together where possible."

  — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] While Peakychu glows (Illuminate), Pokémon stay active even at night. — [攻略大百科 2257](https://gamepedia.jp/pocoapokemon/archives/2257)

**Behaviour repertoire and wandering**
- [Community-tested] The AI repertoire:
  - staying near home
  - approaching friends or Ditto
  - using the hot spring
  - walking to a shop with a register

  Pokémon have an upper limit on their action range, and if things are too far away the behaviour doesn't happen at all.

  — [note, Splatoonブキ研究所, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)
- [Community-tested] Distance in the story towns, after 280 hours:
  - Withered Wastelands has few breaks in movement routes.
  - In Bleak Beach, boats and islets split the town.
  - In Rocky Ridges, the museum inside the mine is too far, so the fossil Pokémon there almost never come out.
  - In Sparkling Skylands, some zones are unreachable, and lifts don't help when distances are too long.
  - On Cloud Islands, the initial Pokémon Center in the south-east leaves about three-quarters of the island a dead zone.

  Recommendation: put the Pokémon Center, hot spring and your house at the map centre, and spread homes in a ring around them, not too far out.

  — [note, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)
- [Community-tested] The AI amounts to visiting friends, using the hot spring and idling near home. No Pokémon is motivated to play in a pool you build. — [note, Splatoonブキ研究所, 2026-04-11](https://note.com/splatoonweapon/n/nfb82723646af)
- [Guide] Roads help Pokémon get around, but they also let Pokémon travel farther, so plan where they lead. — [Game8 EN 585501](https://game8.co/games/Pokemon-Pokopia/archives/585501)
- [Guide] Paths around habitats make Pokémon wander more. — [Pokémon GO Hub, search snippet](https://pokemongohub.net/post/guide/pokopia-beginner-tips/)
- [Community-tested] A road made of wall-art blocks is not recognised as a road by Pokémon. — [ぽこポケ学会, その他](https://kyu49.github.io/Pokopia/others/)
- [Community-tested] When a Pokémon touches magma, it moves to nearby footing; if there is none, it respawns at the Pokémon Center. From there it walks the shortest route to the point closest to its completed house. — [ぽこポケ学会, クロック回路](https://kyu49.github.io/Pokopia/circuit/clock/)
- [Unverified] Fire-type and warmth-loving Pokémon, including Eevee and Farfetch'd, "teleport" if they enter water or a hot spring. — [note, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)

**Pathing and movement**
- [Guide] When following:
  - A follower gets separated where a path breaks or is too narrow for it. A large Pokémon can't follow through gaps Ditto fits through.
  - A non-flyer can't follow where the path ends. Small flyers rarely get separated.
  - A separated Pokémon stays where it is, so go back for it.
  - Walking speeds differ by Pokémon.
  - Hold Up to dismiss all followers.

  — [Game8 JP 768614](https://game8.jp/pocoapokemon/768614)
- [Community-tested] Lifts:
  - Span 13 to 65 tiles, with a wire slope of at most 50%.
  - A station occupies 5×4×5 tiles.
  - The car's cross-section is 3×5 when level and 3×6 on a slope.
  - An obstacle in the path breaks the lift, but curtains don't, and being underwater is fine.
- [Community-tested] Ho-Oh and Lugia open doors.

  — [ぽこポケ学会, その他](https://kyu49.github.io/Pokopia/others/)
- [Guide] 95 Pokémon can go underwater. 86 swim freely, and 9 only walk on the floor: Shellos and Gastrodon (both forms), Smearguru/Smeargle, Tinkmaster/Tinkaton, Pincurchin, Wiglett and Wugtrio. — [Serebii, Dive](https://www.serebii.net/pokemonpokopia/dive.shtml)
- [Official, patch notes] Ver. 2.0.0:
  - Companions can now follow you during Surf, Glide, Rollout and Magnet Rise.
  - Known issues: "Suicune and Gholdengo may be unable to travel across water." "Pokémon that dislike water may sometimes be unable to move across duckweed and flowering duckweed."
- [Official, patch notes] Ver. 1.1.0: companions avoid the placement-preview area.

  — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Community-tested] Big Pokémon refuse small homes:
  - Fine in the smallest kit (おへやキット): Spinarak, Wooper, Glimmet, Glimmora, Swablu, Snivy, Combee, Vileplume.
  - Need a hut kit (こやキット) or larger: Amaura, Haxorus, Clodsire, Cacturne, Blissey, Venusaur.

  — [ぽこポケ学会, ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)

**Interactions and gatherings**
- [Guide] Friendship:
  - Completing a Pokémon's request or giving it a gift raises friendship.
  - Pokémon periodically invite you to games (a quiz, or Look This Way over three rounds). Playing always gives friendship, and winning gives more.
  - At high friendship they give material gifts and call you by your name instead of "Ditto".
  - At maximum they announce they are your best friend and get a mark in the Pokédex.

  — [Serebii, Friendship](https://www.serebii.net/pokemonpokopia/friendship.shtml)
- [Official, patch notes] Ver. 1.1.0 added more conversation variations between Pokémon. In 2.0.0, Pokémon that taught you an emote answer with it, and sad Pokémon notice replaced furniture sooner. — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [Guide] Hype dancing and DJ music: dancers gather near DJ Rotom, and Ditto joins and recovers PP. A Trade shop draws Pokémon to the register. — [Game8 JP 767534](https://game8.jp/pocoapokemon/767534); [note, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)
- [Guide] A Pokémon Center heals PP once per Center per day. — [Serebii, Pokémon Center](https://www.serebii.net/pokemonpokopia/pokemoncenter.shtml)

**Moving a Pokémon's home**
- [Guide] Steps: build a new home, ask the Pokémon to follow, walk until "ちかくの生息地" shows top left, then choose 「ここにおひっこしする？」.
  - The move is refused if the target home is occupied or contains something the Pokémon dislikes.
  - Pokémon living in block houses or habitats need a new home built by you.

  — [Game8 JP 767983](https://game8.jp/pocoapokemon/767983)

### Inferences
- A planner can treat night (about 19:00–05:00) as reduced activity rather than a hard lock. Sleeping Pokémon can still be woken to work.
- For the town-life layout, the community tests point to a compact layout. Put the Pokémon Center, hot spring and player house near the centre, keep homes within a short walk of each other, and use floor-type road blocks to extend reach on purpose.

### Gaps
- No source gives exact wake and sleep hours per species, or a wandering radius in tiles.
- No source gives a path width in tiles for large Pokémon, or the size classes behind the "ps"/"sz" fields in data.json.
- No source covers how Pokémon handle steps, slopes or ladders without a lift.
- "Teleport out of water" for fire-types has a single source.
- Primary Automaton text unreachable (host blocked).

## 6. Pokémon beyond the 25-displayed cap

### Takeaway
Each area displays only about 20–25 resident Pokémon at once, out of up to 300 or more living there. Community measurements centre on about 21, and Game8 says 22–24 per biome. Which residents appear is random.

Undisplayed Pokémon still exist:
- They keep Littering, with drops stocked internally.
- They can't be found with Search, Fly or Teleport until loaded.
- Honey at their habitat summons them, but can push another Pokémon out. Homeless Pokémon can't be summoned.
- Gather works only while its Pokémon is displayed.
- Kit-house residents asleep indoors don't count toward the cap, which frees display slots at night.

Ver. 2.0.1 fixed Pokédex searches failing to locate Pokémon.

### Cited Findings
- [Community-tested] Displayed counts:
  - 20–25 at most at the same time, with about 21 measured as the practical limit; the reason for the spread is unknown. — [note, Splatoonブキ研究所, 2026-04-10](https://note.com/splatoonweapon/n/n0c7d1da22923)
  - About 21. — [note, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)
  - 20–25 out of 300, under 10%. — [note, 2026-04-11](https://note.com/splatoonweapon/n/nfb82723646af)
- [Guide] "Each biome seems to only load a maximum of 22-24 Pokemon at a time... This will prevent you from finding them using Search, Fly, or Teleport." — [Game8 EN 585501](https://game8.co/games/Pokemon-Pokopia/archives/585501)
- [Guide] Honey:
  - Use Honey with A at the missing Pokémon's habitat to attract it back. "This may also cause other Pokémon to despawn to maintain the maximum number."
  - Homeless Pokémon can't be summoned with Honey.
  - Waiting a few hours can bring back a Pokémon whose habitat was removed.

  — [Game8 EN 585501](https://game8.co/games/Pokemon-Pokopia/archives/585501)
- [Unverified] Player reports compiled by a game-news blog:
  - The cap is about 25.
  - Distant Pokémon vanish as the count grows.
  - Hidden Pokémon are not deleted and reappear under some conditions.
  - Destroying a home can make a Pokémon disappear, and save-and-reset may bring it back.
  - Housing them near the centre or together helps.

  — [note, ぽちぽちゲーム速報, 2026-03-08](https://note.com/game9820/n/n22a5bda1cc01); [note, 2026-03-20](https://note.com/game9820/n/n8212fd59cc52)
- [Community-tested] Which Pokémon are displayed is random. Uneven placement leaves empty areas, so spread homes evenly. — [note, 2026-04-02](https://note.com/splatoonweapon/n/ncb41c8dfc076)
- [Community-tested] Litter keeps working when the Pokémon isn't displayed. Gather needs its Pokémon present and is affected by the cap.
  - Automated collection needs 21 or fewer Pokémon in the area, with the Gather Pokémon always displayed.
  - On offline towns, move Pokémon out to reduce the count. This is effectively impossible on Cloud Islands.

  — [note, 2026-04-10](https://note.com/splatoonweapon/n/n0c7d1da22923)
- [Community-tested] Kit-house residents go inside to sleep. Pokémon inside a house don't count toward the 25-display cap, which lets more Pokémon be shown. — [ぽこポケ学会, ちらかす](https://kyu49.github.io/Pokopia/chirakasu/)
- [Official, patch notes] Ver. 2.0.1 (7–8 Sep 2026) fixed "the Pokédex search failing to locate Pokémon" and Ho-Oh and Lugia repeatedly descending and reappearing. — [Pokopia Guide, update history](https://pokopiaguide.com/guides/update-history); [Nintendo support](https://en-americas-support.nintendo.com/app/answers/detail/a_id/71348/p/1095/c/120); [My Nintendo News, 2026-09-08](https://mynintendonews.com/2026/09/08/pokemon-pokopia-updated-to-version-2-0-1-patch-notes/)
- [Community-tested] Other object caps per area that limit specialty setups:

  | Object | Cap |
  |---|---|
  | Community boxes | 32 |
  | Plates | 127 in total |
  | Furnaces and concrete mixers | 128 combined |
  | Electric items | 1024 since 1.1.0 |
  | Dropped broken-block items | 512, oldest removed first |

  — [ぽこポケ学会, 色々な上限](https://kyu49.github.io/Pokopia/limitation/). A 280-hour player reported a generator cap of 70 before 2.0.0 and plates topping out around 120. — [note, 2026-04-11](https://note.com/splatoonweapon/n/nfb82723646af). Ver. 2.0.0 raised the generator cap from 64 to 128, excluding furnaces. — [Serebii patch](https://www.serebii.net/pokemonpokopia/patch.shtml)

### Inferences
- A planner should warn when an area's residents exceed about 21. It should model Litter as unaffected by the cap, Gather and any visible behaviour as unreliable above it, and kit houses as a way to free display slots at night.
- Since display is random, a Gather Pokémon in a 40-resident area may be absent much of the time. Keep automation areas small.

### Gaps
- No source explains how the display set is chosen beyond "random", or whether the distance from Ditto or the home's position weights it.
- No source says whether undisplayed Water, Grow or Generate residents still act. By analogy with Litter they might, and by analogy with Gather they might not.
- No source says whether cap behaviour changed in 2.0.0 or 2.0.1. The notes found mention none.

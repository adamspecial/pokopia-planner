# How habitats attract and spawn Pokémon in Pokémon Pokopia

Status: complete (pass 2 finished 2026-11-23; current game Ver. 2.0.1, 8 Sep 2026). Pass 1 was cut off by a usage limit. All of its findings are kept below, sorted into sections and marked "(pass 1)".

Evidence labels: **official** (Nintendo/in-game text or patch notes), **datamined**, **community-tested**, **guide**, **unverified**. I found no datamined source on spawning, so nothing below is labelled datamined.

How the sources were read: pass 1 had only web-search summaries. Pass 2 used curl to read these pages in full: game8.jp, game8.co, gamewith.jp, gamepedia.jp and kyu49.github.io (ぽこポケ学会). Serebii and GameFAQs returned 403 to curl in this pass, and WebFetch could not resolve serebii.net or kyu49.github.io. The Serebii figures come from copies saved in this session's scratchpad earlier the same day (09:02-09:04, by an earlier pass): all 257 Serebii habitat-dex pages, plus the Habitats, Time & Day, Patch, Mosslax Boosts and Dream Islands pages. That patch-page copy stops at Ver. 2.0.0. I parsed the 257 habitat pages myself (504 Pokémon slots) to get the counts quoted below. These sources could not be reached and were read from search summaries only: thegameswiki.com (returned a JavaScript shell), pokopia-island.pages.dev, consolepulse.com, gfinityesports.com, insider-gaming.com, kotaku.com and pokopia.gamertw.com. A search summary is weaker evidence than a full read, and every one is marked as such.

## What makes a habitat count, and what happens when it forms

### Takeaway
A habitat counts once every recipe item is placed together and every item marked with a power symbol is powered. The game confirms it with a sparkle effect, a "formed" mark (成立マーク) and an entry in the "nearby habitats" panel. In most habitats nothing spawns at that moment: a lottery runs later. In some habitats the Pokémon appears directly. No source shows that placing extra copies of an ingredient changes anything, and the one claim that it raises the rate is no longer on the page it was credited to.

### Cited Findings
- On success, sparkles appear around the habitat. Then check that the new habitat shows under "ちかくの生息地" (nearby habitats) at the top left of the screen (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- A habitat can fail even with every listed item placed, if the layout is off or a powered item (one shown with an electric mark) has no power. Copy the habitat-dex picture, and use Pokémon with the Generate specialty (はつでん, e.g. Mareep, Pawmi) for power (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- (pass 1) A habitat without the formed mark is never entered into the lottery (guide, search summary) — [Game8 JP 768257](https://game8.jp/pocoapokemon/768257); [kengomon](https://www.kengomon.com/pokoa-pokemon-livepokemonmake/)
- No spawn on formation: "生息地を作った後に一定時間経過すると、その生息地に出現します" (it appears after a certain time has passed). Rustling grass or a rippling water surface shows a Pokémon has arrived. "Some habitats have the Pokémon appear directly", marked by a special yellow speech bubble; talk to it to befriend it (guide, full read) — [Game8 JP 768257](https://game8.jp/pocoapokemon/768257)
- (pass 1) Some time after a habitat forms, an internal lottery runs, and a hit shows as a shadow-like effect on the ground (guide, search summary) — [Game8 JP 768257](https://game8.jp/pocoapokemon/768257); [kengomon](https://www.kengomon.com/pokoa-pokemon-livepokemonmake/)
- Serebii: the habitat is built from several items, "some time after that, a wild Pokémon may appear", and "Once the habitat is created and a Pokémon appears, that becomes the home for the Pokémon" (guide) — [Serebii Habitats](https://serebii.net/pokemonpokopia/habitats.shtml)
- Extra ingredients: (pass 1) a search summary credited Game8 JP 767516 with saying that placing a little more than the minimum (少し多めに配置) tends to raise the rate (unverified). **A full read of that page on 2026-11-23 does not contain the claim**, and Japanese and English searches found no other source for it — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- One player wrote that with only the bench and table, or with fewer bushes, their "spawn rate was effectively 0% even during perfect rain", and that the game never says how many pieces are required (unverified anecdote, search summary) — [finalboss.io](https://finalboss.io/pokemon-pokopia-how-to-use-habitats-and-rain)
- A structure larger than 11x12 (width by depth) "will stop being classed as a habitat" (guide, search summary; geometry is covered by other research) — [Serebii building](https://serebii.net/pokemonpokopia/building.shtml)
- A habitat built inside a player-built house still counts as a home. Example: a 2x2 house holds 4 residents, plus 2 more from two one-Pokémon habitats placed inside it (Surging psychic power = simple cushion + crystal ball; Lazy photo-album scrolling = tablet + party cup) (community-tested) — [kyu49 house](https://kyu49.github.io/Pokopia/house/)
- How many habitats exist:
  - data.json has 254: 209 Main, 36 Basin and 9 Event. (pass 1) The ぽこポケツール site counts 257 — [toolz](https://toolz.gamepedia.jp/pocoapokemon/zukan/habitat)
  - Serebii's habitat dex also has 257: 209 Main, 36 Basin and 12 Event (guide) — [Serebii Habitats](https://serebii.net/pokemonpokopia/habitats.shtml)
  - Bulbapedia gives 209 base-game habitats, not counting events (guide, search summary) — [Bulbapedia Habitat Basics](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Pokopia/Habitat_Basics)
- **data.json is missing three event habitats** that Serebii lists (guide):
  - #010 Abundant apples: Syrupy apple tree 1, Harvest basket 1. Applin Common, Dipplin Rare, Hydrapple Rare — [Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/abundantapples.shtml)
  - #011 Sweet apple pie: Apple pie 1, Table (any) 1, Seat (any) 1. Applin Common, Appletun Common.
  - #012 Apple kitchen: Appley blender 1, Dipplin mixing bowl 1, Kitchen scale 1, Kitchen table 3. Applin Common, Flapple Common.
- **data.json's Pokémon lists match Serebii in all 254 shared habitats.** The 12 differences are only in how forms are written (own comparison):
  - Road sign 027 and Ocean fishing spot 185: Serebii lists "Shellos"/"Gastrodon" and the "East Sea" form, where data.json has "(East Sea)" and "(West Sea)".
  - Marshy tall grass 054: "Paldean Wooper".
  - Beach set 071: Tatsugiri "Curly/Droopy/Stretchy Form".
  - Music and magazines 128: "Stereo Rotom".
  - Chef's kitchen 133: plain "Greedent" (data.json: "Greedent (Cook)").
  - Oversized dumping ground 154: plain "Tinkaton" (data.json: "Tinkaton (Supervisor)").
  - Amped rock stage 189 and Low-key rock stage 190: Toxtricity "Amped Form" / "Low Key Form".
  - Basin B017, B021 and B032: Serebii splits Frillish and Jellicent into Male and Female forms.

### Inferences
- A planner can treat a habitat as binary: formed or not. Require power for any powered item. Do not model a bonus for extra ingredients, because no source supports one.
- data.json needs E010-E012 (the apple habitats) to match the current game.

### Gaps
- No controlled test of whether extra ingredient copies change the odds.
- No source says whether the first spawn after a habitat forms is guaranteed, or how long it takes.

## How many Pokémon at once, how long they stay, when spawns re-roll

### Takeaway
Each habitat is home to one Pokémon. Once a Pokémon has made a habitat its home, nothing new spawns there until that Pokémon moves out. A save holds only one of each species, and each area shows roughly 20-25 Pokémon at a time. Spawn checks run at random fixed intervals that no source quantifies. The in-game day starts at 05:00 local time, and pushing the clock forward a day almost always makes a pending Pokémon appear at once.

### Cited Findings
- One resident per habitat: "only one Pokemon can live there, and if a Pokemon already took a habitat as its home, no new Pokemon will spawn there". New Pokémon won't show up until the resident moves out. Moving the resident to a house or kit frees the habitat (guide, search summaries) — [GamePro](https://www.gamepro.de/artikel/pokemon-pokopia-alle-habitate,3449159.html); [thegameswiki habitat dex](https://thegameswiki.com/pokopia/wiki/habitat-dex); [ConsolePulse](https://consolepulse.com/nintendo/pokemon/guides/pokemon-pokopia-habitats-guide)
- The kyu49 "4 + 2" example above implies one resident per habitat (community-tested) — [kyu49 house](https://kyu49.github.io/Pokopia/house/)
- (pass 1) A habitat that is already one Pokémon's home (すみか) cannot be offered to another. Houses hold 1, 2 or 4 (guide) — [Game8 JP すみか移動](https://game8.jp/pocoapokemon/767983); [gameranbu](https://gameranbu.jp/pocoapokemon/c6b54860896393e6281c)
- A player-built house (walls plus a door, at least 2x2 floor, smaller than 9x10) holds up to 4 Pokémon of any size (community-tested) — [kyu49 house](https://kyu49.github.io/Pokopia/house/)
- Only one of each species ever appears. Form variants count separately and can live side by side: pale Pikachu and Pikachu, Moss Snorlax and Snorlax, Professor Tangrowth and Tangrowth, West and East Shellos/Gastrodon, Amped and Low Key Toxtricity (guide, full read) — [Game8 JP 769001](https://game8.jp/pocoapokemon/769001); [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- Display cap per area:
  - About 25 shown at once. Residents of houses that need a loading screen (kit houses) do not count toward the 25. Homeless Pokémon roam when the area total is 25 or fewer, and may not appear when it is above 25 (guide, full read) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
  - (pass 1) 20-25 shown, picked at random; the rest stay inside kit houses or are absent — [X @rusted_coil](https://x.com/rusted_coil/status/2036394837554110486) (unverified)
  - (pass 1) 25 — [note game9820](https://note.com/game9820/n/n8212fd59cc52)
  - (pass 1) 20 (20-22), with the shown set rotating daily — [Game Rant](https://gamerant.com/pokopia-how-many-pokemon-per-region-limit/)
  - (pass 1) About 30 — [GameNGadgets](https://www.gamengadgets.com/2026/03/pokemon-pokopia-the-missing-pokemon-dilemma-how-to-fix-it/)
  - "each biome seems to only load 20-30 Pokemon" (search summary; page not pinned) — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585770)
- Kit-house limit: 40 per map, with houses that load a separate interior (e.g. the large house) counting as 2. At most 14 buildings under construction at once (community-tested) — [kyu49 limits](https://kyu49.github.io/Pokopia/limitation/)
  - (pass 1) Small kit houses x40 or large x20 — [X @rusted_coil](https://x.com/rusted_coil/status/2036394837554110486)
- Spawn timing:
  - Checks are random at fixed intervals (一定時間ごとのランダム) (guide, full read) — [Game8 JP 768257](https://game8.jp/pocoapokemon/768257)
  - Pokémon with more stars (★1-★3) tend to take longer (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
  - (pass 1) First visitors usually arrive by the next morning, rebuilt habitats refill in 1-2 days, and rare Pokémon take several days (guide) — [RankedBoost](https://rankedboost.com/pokopia/guides/how-to-attract-pokemon/); [Pokopia Companion](https://www.pokopiacompanion.com/guides/following-habitat-hints-your-guide-to-attracting-pokemon)
  - Common Pokémon "within minutes", Rare "significantly longer", Very Rare "hours of real time" (guide, search summary) — [thegameswiki rarity](https://thegameswiki.com/pokopia/wiki/pokemon-rarity-and-spawn-conditions)
  - "spawn timers (10–15 minutes)" (unverified, single source, search summary) — [dtgre](https://www.dtgre.com/2026/03/pokemon-pokopia-fast-travel-habitat-tricks.html)
  - (pass 1) After a habitat is lost (すみかなし), wait 1-2 days (guide) — [pokemongo-raku](https://pokemongo-raku.com/post150444)
- Day boundary: a new day starts at 05:00 local time. Stamp card, PC shop, daily challenges and glowing spots reset then, and construction completes at 05:00 (guide) — [Serebii Time & Day](https://serebii.net/pokemonpokopia/timeday.shtml); [thegameswiki day/night](https://thegameswiki.com/pokopia/wiki/day-and-night-cycle) (search summary)
- Clock changes: no penalty for changing the Switch 2 clock. Moving it past 05:00 refreshes the daily items, and moving it forward makes Pokémon that take a long time to arrive appear at once (guide, full read) — [Game8 JP 767333](https://game8.jp/pocoapokemon/767333)
  - Moving to the next day spawns them "一瞬で" (instantly). If nothing appears, the time band or weather is probably the reason, so shift the time and retry (guide, full read) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- Official fix in Ver. 1.0.4 (23 Apr 2026): "If certain Pokémon were waiting to appear, other Pokémon would sometimes also fail to appear" (official, via Serebii's transcription) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- A spawn flag (出現のフラグ) already set on another habitat in the same area can stop a new habitat from spawning. With several identical habitats, the Pokémon may be heading to a different copy than the one you are checking (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
  - (pass 1) If a habitat never spawns, look elsewhere on the island for an unclaimed spawn sign (rustling grass, splashing water), and remove habitats that are nobody's home (unverified) — [X @splashbeat_siri](https://x.com/splashbeat_siri/status/2030570662092304449)
- Honey: if the Pokédex search says a Pokémon was "not seen today" (今日は見ていない), using Honey (あまいミツ) at its habitat brings it back at once. Honey comes from glowing flowers (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
  - (pass 1) Honey placed near a shared home makes all of its residents appear (guide) — [GameNGadgets](https://www.gamengadgets.com/2026/03/pokemon-pokopia-the-missing-pokemon-dilemma-how-to-fix-it/)
  - Ver. 2.0.0 fixed "Even when using honey, Pokémon may sometimes fail to return to their habitats" (official) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- A Pokémon missing on one day reappears from the next day on (guide, search summary) — [pokopiaguide](https://pokopiaguide.com/guides/beginner-guide)
- Ver. 1.1.0 fixed "some Pokémon were less likely to appear in town without a habitat" (official). Serebii dates 1.1.0 to 9 Jun 2026; (pass 1) Japanese sources say 10 Jun 2026, probably a time-zone difference — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml); [ndw](https://www.ndw.jp/pokopoke-game-260610-02/); [gamemos](https://gamemos.net/2026/06/10/post-143304/); [gamepedia 5597](https://gamepedia.jp/pocoapokemon/archives/5597)

### Inferences
- A clock jump past a day spawns almost every time. That suggests at least one check runs at the 05:00 rollover, or that the timer counts real elapsed time. Either fits the evidence.
- The 1.0.4 fix wording suggests habitats share a per-area queue of pending spawns: one pending Pokémon could block others. That fits gamepedia's "spawn flag elsewhere blocks a new one".
- For planning: count residents per area against a budget of about 25 visible Pokémon, and treat kit-house residents as off-budget.

### Gaps
- The length of the check interval and the odds per check.
- Whether area reloads, fast travel or Ditto leaving the area trigger a re-roll. No source tested any of these.
- How long a spawned but not-yet-befriended Pokémon waits at its habitat before it wanders off.

## Spawn odds and rarity

### Takeaway
Rarity comes in three tiers: Serebii's Common / Rare / Very Rare, Game8 JP's ★ ふつう / めずらしい / とてもめずらしい. No source publishes probabilities. Guides say that among species you haven't met yet, the game favours lower tiers first, and that once every other species of a habitat is met, the remaining rare one is certain. Moss Snorlax's spicy food is the only documented booster.

### Cited Findings
- Serebii rarity counts across 504 slots in 257 habitats (guide; own parse): Common 296, Rare 174, Very Rare 27, blank 7, plus 1 typo ("CommonCommon").
  - Blank slots: Goomy at Rain Dance site; Tinkatuff, Corviknight and Poliwrath at Sewer hole inspection; Gulpin at Tantalizing dining set; Tyrogue at Training waterfall; Grubbin at Yellow tall grass — [Serebii habitat dex](https://www.serebii.net/pokemonpokopia/habitatdex/sewerholeinspection.shtml)
- The 27 Very Rare slots per Serebii (guide):

  | Pokémon | Habitat |
  |---|---|
  | Feraligatr | Basin tall grass |
  | Swampert | Basin tall grass and coral |
  | Blaziken | Chirp-chirp meal |
  | Kingdra | Coral congregation |
  | Haxorus | Cozy log handicrafts |
  | Corviknight | Elevated pink tall grass |
  | Crobat | Elevated yellow tall grass |
  | Victreebel | Flowery table |
  | Mismagius | Fluffy flower bed |
  | Clefable | Graceful flower bed |
  | Dragonair | Hydrated fluffy flower bed |
  | Blastoise | Hydrated tall grass |
  | Tyranitar | Mossy rest spot |
  | Electrode | Park bench |
  | Decidueye | Pointy tree-shaded rocky tall grass |
  | Coalossal | Railroad crossing |
  | Cinderace | Red tall grass |
  | Slowbro | Seaside tall grass |
  | Slowking | Seaside tall grass |
  | Golisopod | Swaying flower bed and coral |
  | Charizard | Tall grass |
  | Magnezone | Trash can central |
  | Serperior | Tree-shaded fluffy flower bed |
  | Volcarona | Tree-shaded graceful flower bed |
  | Exeggutor | Tropical vibes |
  | Empoleon | Waterwheel spot |
  | Jumpluff | Yellow carpet (event) |

- Pokémon per habitat, per Serebii (own parse): 109 habitats have 1 Pokémon, 82 have 2, 44 have 3, 14 have 4, 5 have 5 and 3 have 6. There are 359 distinct Pokémon/form names, and 134 of them appear in more than one habitat.
- The same species can sit in different tiers in different habitats. Examples from Serebii: Buizel, Corsola, Munchlax, Gurdurr, Glimmora and Fraxure are Common in one habitat and Rare in another. Feraligatr, Swampert, Slowbro, Slowking, Charizard, Clefable, Blaziken, Kingdra and Haxorus are Rare in one and Very Rare in another (guide).
  - (pass 1) Stars run from 1 (common) to 3 (very rare), and the same species can have different stars in different habitats — [Pocket Tactics](https://www.pockettactics.com/pokemon-pokopia/habitats)
- (pass 1) Among several unmet species in one habitat, lower-rarity ones come first; once all ★1 and ★2 are found, the remaining ★3 is said to be certain (guide) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516); [Altema](https://altema.jp/pocoapokemon/reapokemon)
  - How easily a rare one appears depends on how many species in that habitat are still unmet. Once every species of a habitat has appeared, it spawns nothing new (guide, search summary) — [Altema](https://altema.jp/pocoapokemon/reapokemon)
- (pass 1) A species you have already befriended is not attracted again, and once you have every other species of a habitat, the next spawn is the rare one (guide) — [VGC](https://www.videogameschronicle.com/guide/pokemon-pokopia-how-to-evolve/). A wiki says the same: once every common species of a habitat is caught, the next spawn is "guaranteed" to be the rare one (guide, search summary) — [thegameswiki habitat dex](https://thegameswiki.com/pokopia/wiki/habitat-dex)
- Build as many copies of a habitat as it has unmet Pokémon. Pokémon marked with more stars, めずらしい or とてもめずらしい, rarely appear (guide, search summary) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- (pass 1) No reliable percentages exist — [Deltia's](https://deltiasgaming.com/pokemon-rarity-in-pokemon-pokopia-explained/). The spawn calculator on pokopiaplanner.com (e.g. Pikachu 25%, Vileplume 2%) looks invented (unverified).
- Moss Snorlax (Mosslax) booster: a spicy food offering gives "Increased chance of Pokémon appearing in habitats", in three strengths, Slight / More / A lot. A cooked meal boosts more than a berry. This unlocks after the Bleak Beach story, through the Gourmet's Offering habitat (guide) — [Serebii Mosslax Boosts](https://www.serebii.net/pokemonpokopia/mosslaxboosts.shtml)
  - (pass 1) A raw ingredient gives ちょっと (slight) and a cooked dish gives かなり (a lot), on the scale ちょっと / まあまあ / かなり. Crouton salad, hot soup bread and medicinal soup rate かなり (guide) — [GameWith 547741](https://gamewith.jp/pocoapokemon/547741); [GameWith 547180](https://gamewith.jp/pocoapokemon/547180); [gamepedia 2473](https://gamepedia.jp/pocoapokemon/archives/2473); [toolz spicy list](https://toolz.gamepedia.jp/pocoapokemon/zukan/food/taste/%E3%81%8B%E3%82%89%E3%81%84)
- **Disagreement on Charmeleon at Campsite:** Serebii lists it as Common in all weather (guide) — [Serebii Campsite](https://www.serebii.net/pokemonpokopia/habitatdex/campsite.shtml). Game8 EN (updated 12 Aug 2026) lists it as Rare, Sunny and Cloudy only (guide, full read) — [Game8 EN Campsite](https://game8.co/games/Pokemon-Pokopia/archives/585071)

### Inferences
- A planner could encode three weights (Common > Rare > Very Rare) plus the documented order: unmet low tiers first, last unmet species certain. The actual weights are unknown, so show tiers, not percentages.
- data.json has no per-Pokémon rarity, time, weather or area fields (a `pokemon` entry holds only no, n, t, s, dex, ideal, fv, fl, sz, ps, pg, hw and im). Serebii's per-habitat rarity is the most complete source for adding them.

### Gaps
- No published or datamined probabilities.
- How long a Mosslax boost lasts, and its exact multiplier.
- Whether rarity changes the check interval or only the odds of being picked.

## Conditions on spawns (time, weather, area, progress, environment, neighbours)

### Takeaway
Each Pokémon has its own conditions: a time band (four bands), a weather condition and an area list. Habitat lighting overrides the time condition: a dark habitat spawns night-only Pokémon at any hour, and a brightly lit one spawns day-only Pokémon at night. About 7% of slots are night-only, about 3% exclude night, 2% are weather-limited, and about 9% of Main-habitat slots are limited to some areas. Environment-level and story progress unlock some Pokémon.

### Cited Findings
- Time bands, two readings:
  - Serebii: Morning 05:00-07:00 (2 h), Day 07:00-17:00 (10 h), Evening 17:00-19:00 (2 h), Night 19:00-05:00 (10 h), all in local time (guide) — [Serebii Time & Day](https://serebii.net/pokemonpokopia/timeday.shtml)
  - **Game8 JP contradicts Serebii:** 朝 (morning) 5:00-8:00, 昼 (day) 8:00-17:00, 夕 (evening) 17:00-19:00, 夜 (night) 19:00-5:00 (guide, full read) — [Game8 JP 767333](https://game8.jp/pocoapokemon/767333)
  - Game8 EN labels the bands Dawn / Day / Dusk / Night — [Game8 EN Campsite](https://game8.co/games/Pokemon-Pokopia/archives/585071)
- Light overrides time: "Regardless of the time of day, Night exclusive Pokémon spawn will spawn if their habitat is in a place that's dark, such as a cave or underground and Day exclusive Pokémon will spawn at night if their planned habitat is surrounded by bright light" (guide) — [Serebii Habitats](https://serebii.net/pokemonpokopia/habitats.shtml); [Serebii Time & Day](https://serebii.net/pokemonpokopia/timeday.shtml)
- Time limits per Serebii (guide; own parse of 504 slots): 450 slots allow every band.
  - **Night only (37 slots, 23 species):** Cacturne, Clefable, Clefairy, Cleffa, Crobat, Dusclops, Dusknoir, Duskull, Gastly, Gengar, Golbat, Haunter, Honchkrow, Hoothoot, Misdreavus, Mismagius, Murkrow, Noctowl, Oddish, Staryu, Venomoth, Venonat, Zubat.
  - **Morning, Day and Evening only, so never at night (17 slots, 11 species):** Chatot, Chewtle, Dachsbun, Drednaw, Fidough, Pelipper, Pidgeot, Pidgeotto, Pidgey, Veluza, Wingull.
  - No Pokémon is limited to Morning or Evening alone.
  - Gamepedia agrees on Pidgeot (not at night) and Zubat (night only) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- Weather limits per Serebii (guide; own parse): 494 slots allow sun, cloud and rain.
  - **Rain only:** Azumarill (Dock), Sliggoo (Hydrated tall grass), Goomy (Rain Dance site; Tree-shaded flower bed), Empoleon (Tableside delivery cart; Waterwheel spot), Goodra (Very-berry space).
  - **Sun or cloud, no rain:** Charizard (Tall grass; Berry-feast campsite).
  - **Sun only:** Cacnea (Sunny Day site).
  - Source: [Serebii Tall grass](https://www.serebii.net/pokemonpokopia/habitatdex/tallgrass.shtml); [Serebii Sunny Day site](https://www.serebii.net/pokemonpokopia/habitatdex/sunnydaysite.shtml); [Serebii Rain Dance site](https://www.serebii.net/pokemonpokopia/habitatdex/raindancesite.shtml)
  - (pass 1) Rain only: the Goomy line (Goomy No.074, Sliggoo No.075), Empoleon (rare/very rare, rain) and Azumarill (in the rain list) — [toolz rain list](https://toolz.gamepedia.jp/pocoapokemon/zukan/habitat/spawn/%E9%9B%A8%E9%99%90%E5%AE%9A)
  - (pass 1) Ho-Oh only on sunny days — [Altema sunny](https://altema.jp/pocoapokemon/tenki/1)
  - (pass 1) **Sources disagree on Lugia:** rain only on one site, rain or cloudy on another (guide).
  - (pass 1) Cloudy weather is random and cannot be targeted (guide).
  - Gamepedia also gives Sliggoo as rain only — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- Area limits per Serebii (guide; own parse). Serebii's Location column for Main-habitat Pokémon: 375 of 412 slots list all five towns plus Cloud Island; 36 list two places; 1 lists Cloud Island only.
  - **Palette Town + Cloud Island only:** Geodude (Tall grass), Machop (Boulder-shaded tall grass), Scizor and Skwovet (Tree-shaded tall grass), Pikachu (Picnic set), Magby (Pretty flower bed), Rowlet (Fresh veggie field), Vikavolt (Tree-shaded flower bed), Cramorant (Hydrated tall grass), Munchlax (Bed with a plush; Tree-shaded snoozing Snorlax), Snorlax (Tree-shaded snoozing Snorlax; Good old-fashioned antiques), Weezing (Good old-fashioned antiques; Trash collection site), Koffing (Trash collection site), Tinkatink (Large luggage carrier; Oversized dumping ground), Tinkatuff (Large luggage carrier), Tangela (Nothin' but Poké Balls), Mawile (Working the register).
  - **Palette Town + Cloud Island only, all eight Eeveelutions at the food habitats:** Vaporeon (Boundless blue beverage), Jolteon (Electrifying potatoes), Flareon (Burning-hot spice), Espeon (Elegant daytime treats), Umbreon (Dark-chocolate cookies), Leafeon (Leafy greens sandwich), Glaceon (Chilly shaved ice), Sylveon (Lovely ribbon cake).
  - **Sparkling Skylands + Cloud Island only:** Alakazam (Experiment space; Surging psychic power), Gyarados (Illuminated waterfall), Dedenne (Tire park).
  - **Withered Wasteland + Cloud Island only:** Pichu (Picnic set), Gulpin (Tantalizing dining set).
  - **Rocky Ridges + Cloud Island only:** Toxel (Lazy photo-album scrolling).
  - **Bleak Beach + Cloud Island only:** Paldean Wooper (Marshy tall grass).
  - **Cloud Island only:** Tangrowth (Bench with greenery).
  - Sources: [Serebii Tree-shaded tall grass](https://www.serebii.net/pokemonpokopia/habitatdex/tree-shadedtallgrass.shtml); [Serebii Picnic set](https://www.serebii.net/pokemonpokopia/habitatdex/picnicset.shtml); [Serebii Bench with greenery](https://www.serebii.net/pokemonpokopia/habitatdex/benchwithgreenery.shtml)
  - Gamepedia also says Skwovet appears only in Palette Town (まっさらな街) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417). An article title lists "All Pokémon locked behind Pokopia Palette Town island" (search result only) — [ComicBook](https://comicbook.com/gaming/list/all-pokemon-locked-behind-pokopia-palette-town-island-how-to-get-them/)
- Bubbly Basin per Serebii (guide; own parse):
  - No Main-habitat slot lists Bubbly Basin as a location.
  - Basin habitats (73 slots) list all five towns, Cloud Island and Bubbly Basin. The one exception is Floatzel at Marine shop: Cloud Island and Bubbly Basin only — [Serebii Basin tall grass](https://www.serebii.net/pokemonpokopia/habitatdex/basintallgrass.shtml); [Serebii Marine shop](https://www.serebii.net/pokemonpokopia/habitatdex/marineshop.shtml)
  - data.json marks the 36 Basin habitats as region "Basin" with the note "Bubbly Basin (Expansion Pass)".
- **Disagreement on Vespiquen at Field of Flowers:** a search summary of Game8 EN says it is "a common spawn only in Withered Wasteland" (guide, search summary) — [Game8 EN](https://game8.co/games/Pokemon-Pokopia/archives/585074). Serebii lists Vespiquen as Common in every area (guide).
- Environment level: levelling up an area's environment unlocks shop stock, challenges and new Pokémon appearances (guide) — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
  - The Recital stage's microphone, stage and speakers unlock as the Rocky Ridges environment level rises (guide, search summary) — [Game8 EN Recital stage](https://game8.co/games/Pokemon-Pokopia/archives/586102)
- Story gates: some Pokémon need story progress before they can spawn (search summary, unpinned). Mosslax's spawn booster needs the Bleak Beach story finished — [Serebii Mosslax Boosts](https://www.serebii.net/pokemonpokopia/mosslaxboosts.shtml)
- Habitat placement notes in data.json: 040 Berry-feast campsite "Berry basket placed up high"; 049 Nothin' but Poké Balls "Palette Town only", which matches Serebii (its only Pokémon, Tangela, is Palette Town + Cloud Island); E009 Creepy pumpkins "tower stacked on lantern".
- Event visitors: a message at start-up or after fast travel, "〇〇街でなにやら変わった様子のポケモンがいるようです！" (an unusual-looking Pokémon seems to be in X town), means an event-only Pokémon may be near that town's Pokémon Center (guide, full read) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- Day-of-week effects: Friday daily-challenge coins rise 50% to 300; Sunday raises the odds of Lost Relics and Sparkling ripples. No weekday effect on habitats is listed (guide) — [Serebii Time & Day](https://serebii.net/pokemonpokopia/timeday.shtml)

### Inferences
- Cloud Island appears in nearly every Location list. Cloud Islands are visited islands, separate from the five towns, so they look like a catch-all where every Pokémon can spawn.
- A tile planner can encode per Pokémon:
  - a time band from {all, night only, not night}
  - a weather condition from {all, rain, sun+cloud, sun}
  - an area list
  - a light override: dark beats night-only, bright beats day-only.
- Planned Main habitats in Bubbly Basin should be flagged: per Serebii, none of their Pokémon list the Basin.

### Gaps
- Which of the two time-band readings (Serebii or Game8 JP) is right.
- Whether weather is checked at the moment of the roll or at arrival.
- The light level that counts as "dark" or "surrounded by bright light" for the time override (light points are covered by other research).
- Which Pokémon need which environment level or story step. No list was found.

## Overlapping, adjacent and duplicate habitats

### Takeaway
Packing habitats close together can block spawns, and several guides blame overlapping ranges. Duplicate habitats raise throughput, because each copy holds one resident, but they never produce a second of the same species. No source gives a maximum number of habitats per area.

### Cited Findings
- Habitats placed close together can stop the wanted one from spawning, so remove unneeded habitats nearby (guide, full read) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- (pass 1) The dotted area shown by pressing the right stick, if it contains another habitat or home, stops the lottery; one Pokémon per habitat type is the basic approach (guide/blog) — [dokodeyomu](https://dokodeyomu.hatenadiary.com/entry/Habitat_of_Pokoa_Pok%C3%A9mon)
- A "9-Space Rule": a habitat roughly 9 blocks from another may make both fail to spawn. The exact threshold is unclear and the source is not pinned (unverified, search summary) — candidates: [pokopia-island Core Mechanics](https://pokopia-island.pages.dev/guides/habitat-mechanics); [finalboss.io](https://finalboss.io/pokemon-pokopia-how-to-use-habitats-and-rain)
- If a Pokémon has not appeared after a week, try building a second identical habitat (guide, search summary, same unpinned source).
- With identical habitats, the Pokémon may be heading to a different copy than the one you check (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- (pass 1) GameFAQs board: one of two identical habitats filled fast and the other slowly; one claim says this only affects ★2; one player with 100+ flower beds waited 3 weeks; a theory that duplicates "confuse" the game; advice to move extra copies to another area (unverified) — [GameFAQs board](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81152779)
  - (pass 1) thegameswiki recommends duplicates, one per species you want — [thegameswiki habitat dex](https://thegameswiki.com/pokopia/wiki/habitat-dex)
  - (pass 1) pokopia.center says duplicates add no new species but can add extra individuals of the same species — [pokopia.center](https://pokopia.center/posts/pokopia-all-habitats-pokemon-list-2026/). **That conflicts with** the one-of-each-species rule — [Game8 JP 769001](https://game8.jp/pocoapokemon/769001)
- Maximum habitats per area: none found. kyu49's limits page lists caps for power, crops, trees, storage, kit houses (40), rugs and so on, but has no habitat cap (community-tested) — [kyu49 limits](https://kyu49.github.io/Pokopia/limitation/)
  - Searches in English and Japanese for a per-town habitat limit found none (search summaries).
- Comfort ranges: furniture is seen from -4 to +3 blocks of the door's height. Different houses can share furniture. Light, warmth and humidity sources only count inside the house and directly above or below the door (community-tested) — [kyu49 house](https://kyu49.github.io/Pokopia/house/)

### Inferences
- A planner should warn when one habitat's range (the R-stick dotted area) contains another habitat or home. Suggest one copy per unmet species, and spread copies across areas.

### Gaps
- No controlled test of the blocking distance. Reports range from "inside the dotted range" to "~9 blocks".
- No source gives a hard cap on habitats per area.

## Evolution

### Takeaway
Pokopia has no evolution mechanic. Each evolved form is its own individual, attracted by its own habitat entry.

### Cited Findings
- (pass 1) No evolution mechanic; evolved forms are separate individuals found at their own habitats, either the same habitat as the base form or a different one (guide) — [Game8 JP 769013](https://game8.jp/pocoapokemon/769013); [GameWith 547911](https://gamewith.jp/pocoapokemon/547911); [VGC](https://www.videogameschronicle.com/guide/pokemon-pokopia-how-to-evolve/); [GamesRadar](https://www.gamesradar.com/games/pokemon/pokemon-pokopia-evolve/); [games.gg](https://games.gg/news/pokemon-pokopia-no-evolution-mechanic/)
- Serebii lists whole lines inside one habitat, often with the final stage as Rare or Very Rare. Examples: Tall grass has Charizard (Very Rare, no rain); Hydrated tall grass has Squirtle (Common), Wartortle (Rare) and Blastoise (Very Rare) (guide) — [Serebii Hydrated tall grass](https://www.serebii.net/pokemonpokopia/habitatdex/hydratedtallgrass.shtml)

### Inferences
- A planner should treat each evolution stage as its own species with its own habitat slots.

### Gaps
- None for this question.

## Legendary, mythical, special-form and shiny Pokémon

### Takeaway
There are no shinies. Legendaries come from the story, building kits, items and Dream Islands. Jirachi is the only legendary with a habitat. Special forms count as separate species and can appear alongside the normal form.

### Cited Findings
- (pass 1) No shinies (色違いは登場しない); 12 legendary or mythical Pokémon in the base game, obtained through the story, Dream Island (ゆめしま) or crafting a specific kit (guide):
  - Mew: set 27 Mysterious Slates (ナゾのせきばん) into the Withered Wasteland mural.
  - Kyogre and others: registered through story talk events.
  - Manaphy: talk to it in the underground Sea Temple.
  - Raikou: low chance underground on a Dream Island.
  - Sources: [gamepedia 1833](https://gamepedia.jp/pocoapokemon/archives/1833); [gameranbu](https://gameranbu.jp/pocoapokemon/c569835a93decba1c5b3); [game-shinden](https://game-shinden.com/pokoa-pokemon-legendary-how-to-get-and-recruit-guide/)
  - Game8 JP confirms there are no shinies (full read) — [Game8 JP 769001](https://game8.jp/pocoapokemon/769001)
- (pass 1) The legendary birds (Articuno, Zapdos and so on) come from building specific kits in a town. Ho-Oh appears on sunny days and needs the Clear Bell (とうめいなスズ) (guide) — [Altema](https://altema.jp/pocoapokemon/densetu)
- (pass 1) Each doll opens a Dream Island (guide):
  - Pikachu doll: Raikou. Eevee doll: Suicune. Arcanine doll: Entei. Dragonite doll: Mewtwo (sky island).
  - Substitute doll: a random island among those unlocked.
  - Lugia needs the three birds; Ho-Oh needs the three beasts.
  - The legendary chance is low and undocumented; one site says it scales with the total environment level across five towns. Dream Islands reset daily.
  - Sources: [Pocket Tactics](https://www.pockettactics.com/pokemon-pokopia/legendary-pokemon); [GameFAQs](https://gamefaqs.gamespot.com/switch-2/559184-pokemon-pokopia/faqs/82556/dream-islands); [gamertw](https://pokopia.gamertw.com/guide/dream-island); [Serebii legendary](https://www.serebii.net/pokemonpokopia/legendary.shtml)
- Serebii on Dream Islands: reached with Drifloon's specialty after befriending it, once per day; items left behind are lost because "the island resets at the end of the day". "There is a chance" of Raikou, Entei, Suicune and Mewtwo. Its doll table also lists the Clefairy, Starmie and Ditto dolls (guide) — [Serebii Dream Islands](https://www.serebii.net/pokemonpokopia/dreamislands.shtml)
- Dream Island legendary rate: "roughly 1-in-20 visits" at a total environment level of 10, scaling with the total across the five towns. The figure at the level cap was cut off (unverified, search summary, single source) — [gamertw](https://pokopia.gamertw.com/guide/dream-island)
  - (pass 1) One team's test found that a higher total environment level gives a higher Dream Island legendary rate (guide) — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
- (pass 1) Jirachi is the only legendary or mythical Pokémon in Pokopia found in a habitat — [Bulbapedia Jirachi](https://bulbapedia.bulbagarden.net/wiki/Jirachi_(Pok%C3%A9mon))
- (pass 1) Jirachi event "Wish Upon a Jirachi": 23 Jun 05:00 to 8 Jul 2026 05:00 local time (guide):
  - The Surrounded by stars habitat needs Star closet, Starry-sky bed, Cloud table and Jirachi lamp (powered), one Shining Wish Note each.
  - Jirachi appears only after the event ends.
  - This matches data.json E005.
  - Sources: [games.gg](https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-build-the-surrounded-by-stars-habitat/); [Game Rant](https://gamerant.com/pokopia-jirachi-event-guide-habitat-wish-notes/); [allthings.how](https://allthings.how/pokemon-pokopia-jirachi-event-all-rewards-and-how-to-finish-it/)
- Patch fixes touching legendaries (official):
  - Ver. 2.0.0 (5 Aug 2026): Suicune and Gholdengo could not travel across water — [official 136](https://www.pocoapokemon.jp/ja/news/136/); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
  - (pass 1) Ver. 2.0.1 (8 Sep 2026): Ho-Oh and Lugia repeatedly falling and reappearing — [official 159](https://www.pocoapokemon.jp/ja/news/159/)
- Special forms: pale Pikachu, Moss Snorlax, Professor Tangrowth, West and East Shellos/Gastrodon, and Amped and Low Key Toxtricity each count separately and can appear alongside the normal form (guide) — [Game8 JP 769001](https://game8.jp/pocoapokemon/769001)

### Inferences
- Apart from Jirachi (E005), legendaries do not belong in a habitat-spawn model. They are story, kit and Dream Island rewards.

### Gaps
- No exact Dream Island legendary rate, apart from one unverified figure at environment level 10.

## Pokémon obtained outside habitats, and Pokédex registration

### Takeaway
A Pokémon is registered by talking to it and befriending it. Pokémon from outside habitats include story characters, legendaries, event visitors near the Pokémon Center and homeless Pokémon roaming an area.

### Cited Findings
- (pass 1) Talking to a spawned Pokémon befriends it and registers it in the Pokédex; the Pokédex completes at 300 (guide) — [Game8 JP 767402](https://game8.jp/pocoapokemon/767402); [trophy-walker](https://trophy-walker.gloomy.jp/2026/04/11/)
- Where a habitat Pokémon appears directly, talk to the one with a yellow speech bubble to befriend it (guide) — [Game8 JP 768257](https://game8.jp/pocoapokemon/768257)
- Event-only Pokémon near a town's Pokémon Center are flagged by a message at start-up or after fast travel (guide) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- Habitat hints: collecting sparkles in the field randomly reveals which habitat a Pokémon uses, and the habitat dex keeps that hint (guide) — [Game8 JP 767516](https://game8.jp/pocoapokemon/767516)
- Pokédex search fixes (official):
  - (pass 1) Ver. 1.0.3 (9 Apr 2026): Pokémon whose habitat had vanished could not be found with the Pokédex search — [GAME Watch](https://game.watch.impress.co.jp/docs/news/2100378.html); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
  - Ver. 2.0.0 (5 Aug 2026): if the searched Pokémon is in another town, Return Home now takes you there (official) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
  - (pass 1) Ver. 2.0.1 (8 Sep 2026): the Pokédex search failing to find Pokémon — [official 159](https://www.pocoapokemon.jp/ja/news/159/)
- Finding a Pokémon: switch on "さがす" (search) in the Pokédex and ask nearby Pokémon for its rough location. Pokémon with Fly or Teleport can take you there, if you are in the same town (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)

### Inferences
- data.json has 367 Pokémon entries and Serebii's habitats have 359 distinct Pokémon/form names. The gap is probably non-habitat Pokémon: legendaries, story characters and event Pokémon. Not checked one by one.

### Gaps
- No source separates "seen" from "registered", or says whether forms count toward the 300.
- The current Pokédex total including the Bubbly Basin DLC was not confirmed.

## Breaking or editing a habitat while Pokémon visit

### Takeaway
Breaking a habitat whose Pokémon is not yet befriended leaves that Pokémon homeless. It turns up again from the next day, and rebuilding the same habitat nearby brings it back. Since Ver. 2.0.0 this rebuild rule is official. Befriended residents do not vanish, and Honey summons a Pokémon to its habitat at once.

### Cited Findings
- (pass 1) Breaking the habitat of a not-yet-befriended Pokémon makes it wander as homeless (すみかなし). It reappears in the area from the next day, and rebuilding the same habitat nearby makes it live there again. Honey (あまいミツ) calls it without waiting a day. Befriended residents do not vanish (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417); [blingbling](https://blingbling.jp/pocoa-sumika-kieta/); [reiwabook](https://reiwabook.blog/pokopoke-seisokuchi/)
- Gamepedia, full read: rebuild its habitat, or the same habitat as before, near where the Pokémon used to be, then wait a little for it to return. Using Honey there after rebuilding may bring it back without waiting until the next day (guide) — [gamepedia 3417](https://gamepedia.jp/pocoapokemon/archives/3417)
- Ver. 2.0.0 (5 Aug 2026), improvement: "Even if a Pokémon's habitat is destroyed, it will move back in if the same habitat is rebuilt within a certain area" (official) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- Ver. 2.0.0 also says: "Pokémon that are sad because furniture was removed will now notice more quickly when the same furniture is replaced" (official) — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- Spawn and relocation fixes (official):
  - Ver. 1.0.3 (9 Apr 2026): "Fixed an issue that made it impossible to move habitats"; "Fixed an issue that caused Pokémon to disappear from Cloud Islands" — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
  - (pass 1) Ver. 2.0.0 (5 Aug 2026): fixed Pokémon falling into the sea or off cliffs when appearing from a habitat — [official 136](https://www.pocoapokemon.jp/ja/news/136/)
- (pass 1) Ver. 1.1.0 = a large improvement update (official, via press) — [denfaminicogamer](https://news.denfaminicogamer.jp/news/2606102e)
  - It fixed Chansey rest-area spawn clipping, the hot-spring shower habitat's Pokémon not reacting to the spring, and Pokémon without a habitat rarely appearing in town. It renamed the habitat-dex filter button. No spawn-rate change was found.
  - **Pass 1's search summary credited these fixes to Ver. 1.0.4; Serebii's patch page lists them under 1.1.0.** Serebii's Ver. 1.0.4 (23 Apr 2026) list instead holds the "waiting to appear" fix.
  - Sources: [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml); [ndw](https://www.ndw.jp/pokopoke-game-260610-02/); [gamemos](https://gamemos.net/2026/06/10/post-143304/); [gamepedia 5597](https://gamepedia.jp/pocoapokemon/archives/5597)
- Fixes for missing homeless Pokémon: rebuild the matching habitat with the same layout, then save, quit and reload (guide, search summary) — [pokopiaguide](https://pokopiaguide.com/guides/beginner-guide). Kotaku covered despawning, respawning and Honey, but its page could not be read — [Kotaku](https://kotaku.com/pokemon-pokopia-disappearing-despawn-respawn-honey-2000679147)

### Inferences
- A planner can let users edit or move habitats freely. After Ver. 2.0.0, rebuilding the same habitat nearby restores its resident, so the only risk is a short wait or using Honey.

### Gaps
- Whether removing one item, which un-forms a habitat, clears a pending spawn flag or a Pokémon on its way that has not been befriended yet.
- How far "within a certain area" reaches for the Ver. 2.0.0 move-back rule.

# Companion roadmap

Turn the planner into a companion for all of Pokopia, made of four parts:

- a guide to every part of the game
- a record of your own save
- a daily helper
- plans that know what you have

Everyone should be able to use it on Android and Windows, including with a screen reader, a keyboard, large text or high contrast.

The planner already covers building in depth. This plan adds what's missing around it, in phases that each work on their own. The facts it rests on are in the four research reports in [reports/](../reports/).

## What complete means

Every part of the game gets up to three things:

- **A Guide page** that explains it, with its sources and how sure each fact is.
- **A record**, if it's something you collect or work through.
- **A check on the map**, if where things are matters.

| Part of the game | Guide | Record | Map check |
|---|---|---|---|
| Building, terrain and levels | help topics ✓ | — | ✓ |
| Pokémon | Pokédex ✓ | registered ✗ | homes and comfort ✓ |
| Habitats | Habitat Dex ✓; times, weather and rarity ✗ | found ✗ | ✓ |
| Comfort and environment level | ✓, with fixes waiting | per town ✗ | ✓ |
| Power, liquids, crops, switches | ✓ | — | ✓ |
| Crafting and processing | materials ✓; workbench and furnace times ✗ | recipes known ✗ | shopping list ✓ |
| Kits | partly | built ✗ | can I build it ✗ |
| Shops and level ladders | in item notes only | ✗ | — |
| Ditto's moves | ✗ | learned ✗ | areas ✗ |
| Cooking and the Mosslax offering | ✗ | — | — |
| Story, Trainer Rank and requests | ✗ | ✗ | — |
| Challenges: daily, PC and Palette Town | ✗ | ✗ | countable ones ✗ |
| Events | habitats and Pokémon ✓; dates ✗ | ✗ | — |
| Dream Islands, Cloud Islands, Bubbly Basin | one line each | ✗ | underwater partly |
| Time, the 05:00 reset, Fridays and Sundays | ✗ | — | — |
| Patches | ✗ | — | — |

## Where it stands

The planner has:

- 1,258 items, 372 Pokémon, 257 habitats and the five story towns at full size
- 3D and flat maps, levels and layers
- homes, comfort and environment level
- power, liquids, crops, switches and sensors
- a materials list, offline use and sync between devices

What's missing for a companion:

- **It only knows plans.** Nothing records what you've registered, found, learned or built, or how far the story has gone.
- **The reference is scattered.** Recipes, kits and shop levels sit in item notes. Moves, cooking, story, challenges, events and the daily routine aren't there at all.
- **Nothing for the day.** No 05:00 countdown, daily list, event dates or timers.

What stops some people using it:

- **Small text.** Much of it is 10.5 to 12.5 pixels, and there's no text size setting.
- **No page zoom.** The page sets `maximum-scale=1`.
- **Colour alone.** Fit and problems show only as green or red outlines and coloured dots.
- **No high contrast.** Windows contrast themes aren't followed.
- **Pointer only.** The map needs a mouse or a finger: you can't place, select or move with the keyboard, and a screen reader finds nothing to read there.
- **English only.** Yet most of the tested rules come from Japanese players.

What makes it harder to grow:

- **One file.** `app.js` is 665 KB, with no automated tests; checks are run by hand.
- **No version.** `data.json` doesn't say which game version it matches.
- **Part 2 is close.** Ver. 3.0.0 and Expansion Pass Part 2, 「どきどきデコレーション」, arrive on 9 December 2026. The name suggests decoration and comfort rules may change.

## How it fits what exists

- **Still one offline app.** Everything works without internet, and new pages save for offline like the pictures. There's no server: your record syncs like plans, into your own Google Drive (see [Drive sync](Drive%20sync.md)).
- **Two new tabs.** **Game** holds Today and your record. **Guide** holds the reference pages. Layers leaves the tab bar, since it already opens from the layers button and L, so the bar goes from six tabs to seven.
- **Guide data loads when opened.** It lives in its own `guide.json`, so the map starts as fast as now.
- **Names are links.** Every Pokémon, item, habitat, kit, move or town named anywhere opens its card in the Guide, or where the card already lives (Pokédex, Build, Habitat Dex).
- **Facts say how sure they are.** Some are already marked tested or untested. Every fact gets one of three labels (tested, guide or guess) and a source. Rules the sources disagree on stay in **Game rules**.
- **The same style.** Plain words, icons with names, details behind ⓘ.
- **Android and Windows only**, in Chrome and Edge, checked with TalkBack and Narrator.

## Phases

Each phase is a release that's usable on its own.

0. **Ready for Part 2** (by 9 December)
   - The fixes from [the comfort report](../reports/Pokopia%20comfort%20mechanics.md):
     - three tiers for what Fire types dislike
     - "Won't move in" instead of Iffy
     - story Pokémon scoring 0, behind a setting
     - the level's drop line
     - notes when a rank depends on food or noticing
     - habitat residents shown as best case
     - the smaller fixes
   - `data.json` records the game version it matches, and Settings shows it.
   - `tools/data_check.py` compares `data.json` with Serebii's item, recipe, Pokémon and habitat lists and lists what's new or different. GitHub runs it weekly and on request, like the pictures tool.
   - Data checks: every recipe's materials exist, every habitat's Pokémon exist, and every favourite is a known kind.
   - Within a week of 9 December:
     - Part 2's items, Pokémon, habitats and kits added
     - the comfort numbers checked again
1. **Groundwork**
   - Split `app.js` into files by area: map, 3D, homes and comfort, world systems, panels, data and sync. They load as plain browser scripts, with no build step.
   - Move every bit of on-screen text into one table of strings, ready for other languages.
   - Automated tests on GitHub for every pull request:
     - open the app on a Pixel 7 and in a 1366×768 window
     - open each game town and use each tool once
     - fail on any console error
     - run an accessibility scan (axe-core)
     - enforce the no-comments rule
   - Time limits for starting up, for an edit on a full-size town and for drawing one frame, on a mid-range Android phone.
2. **Accessible to everyone** (aiming at WCAG 2.2 AA)
   - **Text:**
     - a **Text size** setting from 100% to 200%, on top of Android's font size
     - nothing under 12 pixels at 100%
     - page zoom works again; the map keeps its own pinch
   - **Not colour alone:**
     - fits and doesn't fit add ✓ and ✕ and a pattern
     - problem dots get shapes
     - a colour-blind-safe palette for overlays, as a setting
     - every colour checked for contrast in light, dark and each accent
   - **High contrast:** the app follows Windows contrast themes (`forced-colors`), and the map draws in the system colours.
   - **Keyboard:**
     - a map cursor: arrow keys move it a tile, Page Up and Page Down change level, and Enter does what a tap does, so every tool works without a pointer
     - focus always visible
     - focus kept inside a dialog, and returned when it closes
     - a skip link between the panel and the map
   - **Screen readers:**
     - the cursor reads out its tile, such as "Level 1, grass. Wooden chair, facing up. In Bulbasaur's home"
     - a **Plan outline** lists homes, habitats, residents, comfort and problems as text, with **Show** on each
     - every button has a name, tabs and menus follow the standard patterns, and notices are read out
   - **No drag or long-press needed:**
     - everything you can drag also works by tap or key, as moving a Pokémon already does
     - nothing needs a long-press alone
     - buttons at least 48 dp on Android
   - **Easy to start:**
     - a short first-run guide to planning a first house, which you can skip
     - a glossary of game words (comfort, active area, specialty, environment level), with the Japanese term beside each, since many guides use it
   - **Checked each release:** a TalkBack run on Android and a Narrator run on Windows, plus the scan above.
3. **Guide**

   A tab you can search, offline. Every page links to the others and shows its sources.

   - **Crafting:**
     - every recipe, where you get the recipe and, separately, where the item is sold
     - the workbench rules: the bag plus up to 4 boxes beside it, and blocks 10 per craft
     - processing with times: furnace 1:1 at about 4 minutes an item (half in the metallic furnace), concrete 1:4, and Chop, Burn, Crush and Recycle
   - **Kits:** materials, build time, helper specialties and how many, who fits and how many live there.
   - **Towns:** each town's level ladder (shop stock, recipes, kits and gifts at each level), the Trainer Rank that opens it, and what levels 3 and 5 unlock.
   - **Ditto's moves:** who teaches each and where, the area normally and when fed, what it breaks and the dish that powers it.
   - **Cooking:** the five tools, their main ingredients, the dishes and what they do, flavours, and the Mosslax offering's boosts.
   - **Specialties:** what each does, whether it works on its own, and who has it.
   - **Story and requests:** Trainer Ranks, the important requests, the Team Initiation Challenge stages and what the credits need. Spoilers stay hidden until you reach them.
   - **Challenges:** daily and PC challenges, the stamp card, and Palette Town's eight Special Challenges.
   - **Other worlds:**
     - Dream Islands: each doll's materials, and the legendary odds
     - Cloud Islands and Bubbly Basin
     - multiplayer: what carries over between worlds, and who can build where
   - **Events:** a calendar with dates, Pokémon, habitats and currency, and whether each is missable.
   - **Time:**
     - the four time bands, with the disputed 07:00 hour as a Game rule
     - what resets at 05:00
     - Friday payouts and Sunday's Lucky Day
   - **Patches:** what each version changed for planning.
4. **My game**

   A record of your save, synced like plans.

   - Trainer Rank, the Expansion Pass, and how far the story has gone.
   - Each town's environment level, worked out from its plan or typed in.
   - **Pokédex:**
     - registered or not, for every Pokémon
     - the next milestone and its reward
     - for each missing one, where and when it can appear
   - **Habitat Dex:** found or not, and which you could make now.
   - Recipes known, moves learned and kits built.
   - Palette Town's challenges counted from its plan where possible: 50 crops growing, 300 road blocks, 50 powered machines, 10 residents, 15 buildings, 10 lift platforms.
   - **Quick to fill in:** tick from any card, tick a whole list at once, and undo.
   - **What next:** a short list of good next steps, such as these:
     - "Withered Wasteland is 6 points from level 4"
     - "2 more registrations for the next reward"
     - "Apples to Applin ends in 5 days and you haven't found Hydrapple"
5. **Today**
   - Time left to the next 05:00 reset, from the device clock, with an offset for players who change the console clock.
   - **A daily list that clears itself at 05:00:**
     - the daily challenge
     - a Dream Island visit
     - the Mosslax offering
     - the stamp
     - the Pokémon Center refill
     - the vending machine drink
     - anything you add
   - **The week:** Friday payouts, Sunday's Lucky Day, and the current event with its days left.
   - **Timers:**
     - kit builds: 15 minutes, 1 hour or the next 05:00
     - furnace batches
     - crops ripening in your plan
     - berry trees
   - **Reminders:** notices while the app is open, and calendar files (.ics) for events and next-day builds, which work on Android and Windows without a server.
6. **Plans that know your game**
   - **Habitat odds:** who can appear in each habitat right now, by time, weather, rarity and town, from Serebii's per-slot lists, with the Mosslax boost.
   - **Who lives in a habitat:** pick the resident, or see the town's points as a range.
   - **Level goals:** pick a goal, such as level 5 in all four story towns, and see the cheapest changes that reach it.
   - **Kits you can build now:** your residents' specialties against each kit's helper list.
   - **The shopping list knows your recipes:**
     - what you can craft now
     - what still needs a recipe
     - where to farm each material, such as bulk limestone from the Clefairy-doll Dream Island
   - **Bubbly Basin and Cloud Island plans**, each with its own level ladder and shop.
   - **Move areas on the map:** Water Gun, Leafage and Rock Smash, normally and when fed. These are marked guide, since nobody has measured them.
   - **The 3D model editor**, as planned in [3D model editor](3D%20model%20editor.md).
7. **Languages**
   - Japanese first: the whole interface, plus the names of Pokémon, items, habitats and moves.
   - Search finds a name in either language, whatever language the interface is in.
   - Then the game's other languages, as their names can be sourced.
8. **Sharing and testing**
   - **Sharing:** a plan as a link or QR code that opens read-only, and Save picture as now.
   - **In-game tests:** a checklist for each open question in the reports, such as the six comfort tests and the reach tests.
     - Each says what to set up and what to write down.
     - Results turn Game rules from guesses into tested rules.

## Order

| When | Phases |
|---|---|
| Now, before 9 December | 0 |
| December and January | 1 and 2 |
| Then | 3, 4 and 5, which share the new tabs |
| Later | 6, 7 and 8 |

## Decisions (recommended)

1. **Part 2 comes first.** Then groundwork and accessibility come before the new tabs, so those are built accessible instead of fixed afterwards.
2. **No server.** Your record rides on the same Drive sync as plans. Reminders while the app is closed would need a push server, so reminders are in-app notices and calendar files.
3. **No build step.** Plain modules keep the repo easy to edit and the GitHub Pages site unchanged.
4. **Spoilers are hidden by default** past your Trainer Rank, with one switch to show everything.
5. **You fill in your record.** The game has no export, so nothing is read from the console. Plans fill in what they can.
6. **Every Guide fact needs a source.** A fact with none is marked guess or left out.
7. **Japanese comes before other languages.**
8. **Out of scope:**
   - iPhone, iPad, Mac and Safari
   - reading the console's save
   - trading
   - any sign-in but Google

## Open questions

- What Part 2 adds, until 9 December.
- Where to get Japanese item names. Pokémon names come from PokeAPI, but item names need a Japanese guide's lists.
- The in-game tests listed in the reports.

## Status

Phase 0 is done apart from Part 2, which comes after 9 December: the comfort fixes, the weekly data check, the game version in the data, the fixes from the first data check, and the data consistency check.

Phase 1 is under way.

- **Done:**
  - Automated tests run on every pull request: the data and no-comments rules, the app on a Pixel 7 and in a 1366×768 window in Chrome and in Edge on Windows, and an axe-core scan that fails on anything new.
  - `app.js` is split into 15 files by area in `js/`, with a check that they load in a safe order.
  - Time limits for start-up, an edit on a full-size town and frames while panning, on a mid-range Android phone.
- **Next:** the strings table.

# Pokopia environment level: how residents' comfort becomes a town's level, and who counts

Researched 2026-11-26, game at Ver. 2.0.1. This file extends `research_notes/Pokopia residents habitats and progression/progression_and_environment_level.md` and does not repeat its unlock lists.

Evidence labels:
- [official]: in-game text or Nintendo patch notes, including when relayed by a guide.
- [community-tested]: a named player measured it in game.
- [guide]: a strategy site states it without a test.
- [unverified]: a single anecdote, a source with no method, or a contradicted claim.
- "search summary": I could not open the page (blocked host, Cloudflare or Vercel challenge). The fact comes from search-result text only.

Pages read in full this session:
- ぼってぃ's note
- PokoTraqr, including its JavaScript bundle
- ぽこポケ学会 (house page and other pages)
- Serebii's environment-level and patch pages
- Game8 JP 767551, 767513, 768035, 793112 and 768618
- GameWith 545345, 545495 and 545675
- Game8 EN 584548 and 584763
- pokopia.center
- WikiPokopia
- 攻略大百科's note

Blocked hosts, used only through search summaries: Reddit, X, GameFAQs (Cloudflare), thegameswiki (Vercel), pokopiaisland.com, op.gg, altema (Access Denied), Yahoo Chiebukuro, kengomon and himahito.

## Point values and level thresholds: re-verification, newer tests, rival models, level 2, Bubbly Basin

### Takeaway
The app's 10/5/2/1/0/0 points and its thresholds of 12–160 for levels 3–10 stand. Two independent community sources agree on them: ぼってぃ's test and u/mogsetsu's figures as coded in PokoTraqr. No test after Ver. 1.0.x was found.

The one real conflict is level 2:
- PokoTraqr's code sets level 2 at **1 point**.
- ぼってぃ's step-by-step observation shows that **2 points were not enough and 3 points were**. This makes 3 the better-supported value, so the app should keep 3.

The rival "0–8 points ÷ 8 + habitat variety + legendary bonus" model cites no test and contradicts both measured sources.

### Cited Findings
- [community-tested, Ver. 1.0.x, 16 Mar 2026] ぼってぃ gives cumulative "すみごこちpt" per level as "レベル2→3pt, レベル3→12pt, レベル4→26pt, レベル5→52pt, レベル6→77pt, レベル7→100pt, レベル8→120pt, レベル9→140pt, レベル10→160pt". The rank values are 最高 10, めちゃイイ感じ 5, ちょっといい感じ 2 and ふつう 1. びみょう and すみかなし "0ptと見ていいだろう". "すみごこちpt" is the tester's own unofficial name, and the post says "結論（仮説を含む）". — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested] Method, from the same post:
  - Rocky Ridges (4 Awesome, 5 Great, 13 Nice, 2 Average) and Sparkling Skylands (2, 8, 15, 3) showed the same meter. Both equal 93 under 10/5/2/1.
  - Rocky Ridges was then emptied to level 1 by removing Pokémon and breaking houses, and rebuilt one resident at a time to read off the thresholds.
  - — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested] The level 2 evidence, in the order ぼってぃ logged it:
  1. Pichu housed at ふつう: "環境レベルの上がり方は1/3ほど", hence "環境レベル1→2に必要なすみごこちptは3と想定".
  2. Pichu ふつう plus Swirlix (パピモッチ) raised from びみょう to ふつう, a total of 2 points: no level-up is reported.
  3. Toy blocks then raised Swirlix to ちょっといい感じ, a total of 1 + 2 = 3: "かつ環境レベルが2になった".
  - — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested, original post unread] PokoTraqr credits "u/mogsetsu on r/Pokopia". It links [reddit 1rx4p4m "environment_level_calculator"](https://www.reddit.com/r/Pokopia/comments/1rx4p4m/environment_level_calculator/).
  - Its displayed table and its code both use `comfortTierPoints:{"no-home":0,iffy:0,average:1,nice:2,great:5,awesome:10}` and `levelThresholds:[0,1,12,26,52,77,100,120,140,160]`, which puts **level 2 at 1**.
  - Its level function picks the highest threshold reached. It shows the meter as "linear interpolation between current and next threshold".
  - — [PokoTraqr Environment Level Calculator](https://www.pokotraqr.com/paradise/env-calculator) (page and JS bundle read 2026-11-26)
- [unverified, contradicts both tests] Pokopia Island's calculator says each Pokémon's comfort contributes 0–8 points, the total is divided by 8 for a base level, a diversity bonus is added, and each legendary adds +5. No test is cited. — [Pokopia Island calculator](https://pokopiaisland.com/tools/environment-calculator) (search summary). Its companion guide describes a 0–10 "area-wide score driven by Pokemon count, average comfort, habitat diversity, and Legendary Pokemon" — [pokopia-island.pages.dev beginner guide](https://pokopia-island.pages.dev/guides/beginner-island-playbook) (search summary)
- [unverified, contradicts Serebii/GameWith] WikiPokopia claims each biome has its own "metric" that drives the level:
  - Humidity in Withered Wasteland, Bloom Points in Bleak Beach, Mood in Rocky Ridges, Construction Progress in Sparkling Skylands.
  - Palette Town "is actually derived — it's the average of the other four biomes".
  - It also gives milestones ("Level 9 — Legendary spawn conditions are met") that match no other source.
  - — [WikiPokopia Environment Levels](https://wikipokopia.com/guides/environment-levels)
- [guide] Other guides publish no point table:
  - pokopia.center: "There is also no official multiplier table assigning fixed Environment Level points to each rating" and "they do not publish exact point thresholds per level" — [pokopia.center comfort guide](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/); [pokopia.center environment guide](https://pokopia.center/posts/pokopia-environment-level-guide-2026/) (sources checked 2026-09-06)
  - Game8 JP: only "「すみごこち」の合計で決まります" — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551) (updated 2026-11-26)
- [official] No patch note changes environment-level scoring:
  - 1.1.0 (9 Jun 2026): conversation and furniture changes; the environment-level details screen gained a per-resident mark for a completed comfort request.
  - 1.1.1 (19 Jun 2026) and 2.0.0 (5 Aug 2026): no scoring changes either.
  - — [Serebii Patches & Updates](https://www.serebii.net/pokemonpokopia/patch.shtml); [pokopia.center environment guide](https://pokopia.center/posts/pokopia-environment-level-guide-2026/) (cites Nintendo's update history for the 1.1.0 mark). The 2.0.1 notice found only covers online play between regions — [op.gg 2.0.1 notice](https://op.gg/ar/pokemon-pokopia/news/159) (search summary)
- [guide] Bubbly Basin runs its own Lv 1–10 shop ladder. Its Lv 10 entry is the うみぞこポケセンキット — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml). No source tested whether Basin, Palette Town or a Cloud Island uses the same point thresholds.
- [guide] Rough resident counts per town reported by blogs: 40–45 befriended per map ([nomanoma-web](https://nomanoma-web.com/2026/03/%E3%81%BD%E3%81%93%E3%83%9D%E3%82%B1%E3%81%A7%E7%9F%AD%E6%99%82%E9%96%93%E3%81%A7%E7%92%B0%E5%A2%83%E3%83%AC%E3%83%99%E3%83%AB%E3%82%92%E4%B8%8A%E3%81%92%E3%82%8B%E6%96%B9%E6%B3%95%EF%BC%81%E3%80%90/), search summary) or 30–40 ([雑談上手](https://zatudanjouzu.com/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%80%91%E7%92%B0%E5%A2%83%E3%83%AC%E3%83%99%E3%83%AB%E3%81%AE%E7%B0%A1%E5%8D%98%E3%81%AA%E4%B8%8A%E3%81%92%E6%96%B9%EF%BD%9C/), search summary). Neither cites a measurement.

### Inferences
- **Keep level 2 at 3.** Under PokoTraqr's value of 1, ぼってぃ's Pichu alone (1 point) would already have reached level 2. Instead the meter stood at about one-third, and level 2 arrived exactly when the total went from 2 to 3. PokoTraqr's 1 may be a typo or a different reading, but the original Reddit post could not be checked. Evidence quality: one tester, one run.
- **The 93-equals-93 comparison does not fix the values on its own.** Equal totals only require 2a = 3g + 2n + v. 10/5/2/1 satisfies this, but so does 8/4/1/2. The values rest on three things together:
  - the equal-meter comparison;
  - ぼってぃ's threshold build-up, where 1 + 2 = 3 reached level 2;
  - mogsetsu reaching the same 10/5/2/1 independently.
  - Rating: community-tested, two independent sources, consistent with each other, no official confirmation.
- Under the model, both 93-point towns sat at level 6, about 70 % of the way to level 7: (93 − 77) / 23 ≈ 0.70. That fits "meters matched".
- Numbers for the app, with evidence quality:

| Item | Value | Quality |
|---|---|---|
| Awesome / Great / Nice / Average | 10 / 5 / 2 / 1 | Community-tested, two sources |
| Iffy, no home | 0 | Assumed by ぼってぃ; stated by PokoTraqr; Serebii says no home is "seen as 0" for comfort |
| Levels 3–10 | 12, 26, 52, 77, 100, 120, 140, 160 | ぼってぃ measured; PokoTraqr agrees |
| Level 2 | 3 | ぼってぃ's observation; PokoTraqr says 1 |

### Gaps
- No re-measurement after 1.1.0 (9 Jun 2026) or 2.0.0 (5 Aug 2026) was found in Japanese or English sources.
- Bubbly Basin, Palette Town and Cloud Island thresholds are untested. That they match the story towns is an assumption.
- The Reddit post (sample sizes, method, whether level 2 = 1 was measured) and あみにし's X translation could not be opened; both hosts are blocked.
- Pokopia Island's calculator page itself could not be fetched, so its exact claims are known only from search text.

## Who counts: Ditto, story Pokémon, habitat vs house, homeless, undisplayed residents, Cloud Islands, moved residents, per-town totals

### Takeaway
- Each town (area) has its own total and its own level.
- Residents of houses, kits and habitats count. A homeless resident counts 0.
- Ditto's own house counts like a regular resident.
- Story Pokémon and the Hoppip line reportedly add 0. This rests on PokoTraqr citing mogsetsu, and no species list was given.
- Residents not on screen still count. Changes around them register only once they notice them, on screen or after a reload.
- Moving a resident to another town takes its points out of the old town.
- Cloud Islands are separate worlds with their own level, and no Pokémon cross between them and the main towns.

### Cited Findings
- [guide] "Each area has got its own Environment Level starting with 1 and gooing up to Level 10" — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml). "環境レベルは街に住んでいるポケモン達の「すみごこち」の合計で決まります" — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
- [guide] A Pokémon "needs to have a habitat or home to live in. If they don't have one, then their Comfy Level is seen as 0" — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml). PokoTraqr scores "Exploring" (no home) and Iffy at 0 for both regular and legendary Pokémon — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator)
- [community-tested] Ditto's house (メタモンの家):
  - ぽこポケ学会: "住み心地 13種類で最大。おもちゃ・きゅうけい・かざりつけはそれぞれ5種類までしか評価されない。環境レベルに影響する。" — [ぽこポケ学会 家と住み心地](https://kyu49.github.io/Pokopia/house/)
  - PokoTraqr (mogsetsu): "Ditto is scored the same as regular Pokemon" — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator)
  - [guide] Game8 EN: giving Ditto a house "raises the Environment Level" — [Game8 EN 584763](https://game8.co/games/Pokemon-Pokopia/archives/584763)
- [community-tested via calculator, original unread] "No penalties — story Pokemon and Hoppip contribute 0 but don't subtract". The calculator does not list which story Pokémon it means. — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator)
- [guide] Habitats and houses: a Pokémon in a built house rises in comfort "quicker than if they are just in a habitat", but a habitat alone is a valid home — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml). ぽこポケ学会 lists "(仮説)キットの家 > 家 > 生息地" among comfort factors, and says a habitat built inside a house still counts as a dwelling (4 + 2 residents in a 2×2 house) — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- [community-tested] Changes register only once noticed:
  - "画面に表示されていなかったり、表示されていてもポケモン自体が認識しない限り「すみごこち」に反映されない".
  - Dismissing a follower in front of an item, or changing town ("リロード"), triggers recognition.
  - Breaking houses did not drop the level at once: "PC上は「すみかなし」判定になっても環境レベルがすぐに1にはならない".
  - — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community, search summary] Display cap: about 20–25 Pokémon are shown per area, chosen at random; the rest stay inside kit houses or vanish. Kit houses are capped at small × 40 or large × 20 — [さびたコイル on X](https://x.com/rusted_coil/status/2036394837554110486) (search summary)
- [community, search summary] A GameFAQs user says unloaded residents "are still included as residents of that area, it's just that you cannot interact with an unloaded Pokemon". Another says making a resident homeless "will take a big chunk out of your overall level until they get a new one" — [GameFAQs thread 81121937](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81121937); [GameFAQs thread 81122279](https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81122279) (search summary; Cloudflare-blocked; which post is in which thread is not certain)
- [official, patch notes] 1.0.3 (8–9 Apr 2026) fixed homeless Pokémon disappearing — [Destructoid](https://www.destructoid.com/pokopias-update-stops-homeless-pokemon-from-disappearing/) (search summary). 2.0.0: "Even if a Pokémon's habitat is destroyed, it will move back in if the same habitat is rebuilt within a certain area" — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [guide] Moving between towns:
  - GameWith: "ポケモンを別マップに連れて行くことです。連れて行くポケモンのすみごこちが高いほど、環境レベルは多く下がる" — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345)
  - Game8 JP: moving a Pokémon to another map changes the town's comfort total — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
  - [official] 1.1.0 fixed "a Pokémon brought from another town could be unable to move into a block house" — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- [guide, anecdote] 攻略大百科 (4/3/2026): after rearranging about 200 Pokémon's dwellings, the level "一気に下がる". The writer concluded "すみかを移動すると、すみごこちが一旦リセットされる", and the level recovered once residents were rehoused next to compatible neighbours and liked furniture — [攻略大百科 note](https://note.com/gamepedia/n/ndbefd701f038)
- [guide] Cloud Islands have their own Environment Level, shop and bag. Pokémon never cross between a Cloud Island and the main towns — earlier notes: [Game8 Cloud Island](https://game8.co/games/Pokemon-Pokopia/archives/585114); [Game Rant](https://gamerant.com/pokemon-pokopia-cloud-islands-guide/) (search summaries, from `islands_multiplayer_updates.md`). Up to 4 players at once, playable without the host, items not carried home — [Game8 JP 768618](https://game8.jp/pocoapokemon/768618)
- [guide] The PC's "−" button lists every resident with its comfort rank — [Game8 JP 767513](https://game8.jp/pocoapokemon/767513). Since 1.1.0, the details screen also shows a green check for a completed request and up/down arrows for rising or falling comfort — [pokopia.center environment guide](https://pokopia.center/posts/pokopia-environment-level-guide-2026/)
- [guide] Lugia and Ho-Oh are summoned with bells and "街には住まない". Whether Kyogre can be befriended "は不明" — [Game8 JP 768035](https://game8.jp/pocoapokemon/768035)

### Inferences
- The app's rule is consistent with these sources:
  - houses and kits count every resident;
  - each finished habitat counts its one housed Pokémon;
  - Ditto's house counts as a regular resident;
  - homeless residents count 0.
- The app should treat story and special Pokémon as 0. This covers Professor Tangrowth, Peakychu, Chef Dente, Tinkmaster, DJ Rotom, Mosslax and the Hoppip, Skiploom and Jumpluff line. It rests only on the mogsetsu/PokoTraqr line, with no species list; treating Skiploom and Jumpluff as covered by "Hoppip" is my reading.
- Undisplayed residents (beyond about 25) should still count at their last rank. A planner cannot tell whether a hidden resident has noticed new furniture, so it should mark planned comfort gains as "applies once the Pokémon sees it".
- Moving a resident between towns:
  - The old town loses its points at once, subject to the hold described in the last section.
  - The new town gains them only once the resident settles and notices its surroundings.
  - One anecdote says a moved resident's comfort resets first. So a move can briefly cost points in both towns.
- Each town, Bubbly Basin and each Cloud Island needs its own total. Cloud Island visitors are other players, not Pokémon, and no source says they add anything.

### Gaps
- No source gives the exact list of "story Pokémon" scored 0, or says whether they appear on the PC resident list.
- No test says whether Ditto's house scores on the regular 10/5/2/1 scale, beyond the two short statements quoted.
- How long a moved Pokémon's comfort takes to recover, and whether it truly resets, is anecdotal (one blog).
- The GameFAQs claims about unloaded and homeless residents come from search summaries only.

## Legendary and mythical doubling: confirmation and which species

### Takeaway
- **Doubling:** only the mogsetsu figures as coded in PokoTraqr give a number (×2 on every rank). Every guide and the in-game tips confirm only that legendaries have a "bigger effect". So doubling is community-sourced, with an unknown method and no species-by-species test.
- **Species:** GameWith's 伝説・幻 list matches the app's 15 species exactly, including Jirachi, Phione and Volcanion. Game8 omits Jirachi.
- Lugia and Ho-Oh never live in a town, and Kyogre's befriending is unknown, so the doubling never applies to those three.

### Cited Findings
- [community-tested via calculator, method unknown] PokoTraqr's legendary/mythical column is 20 / 10 / 4 / 2 / 0 / 0. The code multiplies the tier points by 2 (`points:2*b[e],multiplier:2`) — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator)
- [official, paraphrased in-game text] ぼってぃ quotes the in-game くらしのヒント (life tips) as listing among "加点要素": "伝説、幻はレベルへの影響大", alongside "建築した家". ぼってぃ left "伝説、幻のポケモンの環境レベルへの影響度" as untested — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [guide] Guides give no multiplier:
  - Serebii: "Having a Legendary or Mythical Pokémon in the area and increasing their Comfy Level will make the Environment Level increase quicker" — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
  - GameWith: "通常ポケモンよりもすみごこちUPによる環境レベルの上昇が大きい効果があります" — [GameWith 545495](https://gamewith.jp/pocoapokemon/545495)
  - Game8 JP: "ほかのポケモンよりも環境レベルへの影響が大きく" — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
  - pokopia.center: "not proof of a fixed multiplier" — [pokopia.center](https://pokopia.center/posts/pokopia-environment-level-guide-2026/)
- [guide, unattributed search summary] One Japanese blog says an Awesome legendary is worth "環境レベルが1上がる程" (about one level); another says "通常ポケモンの数倍" — search summary for the query "あみにし 環境レベル計算 Mogsetsu 和訳" (likely [kengomon](https://www.kengomon.com/pokoapokemon-all-environment/) or [himahito](https://himahito.com/pokopoke-record02/); both blocked, so the source is not pinned down)
- [guide] GameWith's 伝説・幻 list (updated 2026-11-26) has 15 entries:
  - **伝説・準伝説:** Kyogre 289, Raikou 290, Entei 291, Suicune 292, Articuno 294, Zapdos 295, Moltres 296, Lugia 297, Ho-Oh 298, Mewtwo 299.
  - **幻:** Volcanion 293, Mew 300, Jirachi (イベ.005, habitat "星空にかこまれて", 出現条件なし), Phione (DLC049), Manaphy (DLC050).
  - — [GameWith 545495](https://gamewith.jp/pocoapokemon/545495)
- [guide] Game8 JP's list (updated 2026-11-26) says "伝説・幻ポケモンは合計14体". It lists the same species without Jirachi, and says the three dogs, three birds, Mewtwo, Mew, Manaphy and Phione "自分の街に住んでくれます". Volcanion is not in that sentence, although Game8 says it "仲間になる" after the Rocky Ridges party fireworks — [Game8 JP 768035](https://game8.jp/pocoapokemon/768035)
- [guide] GameWith recommends housing Volcanion as the easiest legendary for raising the level ("ボルケニオンを住まわせて効率を上げる") — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345)
- [guide] Jirachi came with the "ジラーチのキラキラ短冊集め" event (23 Jun to 8 Jul 2026). It appears near a repaired Pokémon Center and is the event's only Pokémon — [Game8 JP 793112](https://game8.jp/pocoapokemon/793112)
- [guide] Expansion Pass Part 2 is due 9 Dec 2026 and may add species — [Game8 EN 584548](https://game8.co/games/Pokemon-Pokopia/archives/584548) (banner)

### Inferences
- Keep the app's 15-species list; it equals GameWith's grouping.
  - Doubling matters in practice for Raikou, Entei, Suicune, Articuno, Zapdos, Moltres, Mewtwo, Mew, Volcanion, Manaphy and Phione, plus Jirachi if it stays as a resident.
  - Kyogre, Lugia and Ho-Oh are harmless in the list because they never score as residents.
- Doubling Jirachi and Phione is the weakest part:
  - Jirachi is an event (イベ) entry, and the event and story group is the one mogsetsu scores 0 for Hoppip. Whether Jirachi follows the "event = 0" rule or the "mythical ×2" rule is untested.
  - Phione is in both guides' 伝説・幻 lists, but no test isolates it.
- At levels 7–10 each band is 20 points, so one Awesome legendary (20) adds one level there. That matches the blog line about one level. It is consistent with ×2, but it is not proof.

### Gaps
- No test isolates a single legendary's contribution, for example adding one Awesome Volcanion and reading the meter.
- Jirachi's and Phione's scoring has not been tested; nor has DLC Part 2's set (after 9 Dec 2026).
- mogsetsu's method for the ×2 is unknown (Reddit blocked).

## Non-resident contributions: buildings, kits, Pokémon Center rebuild, paving the road, requests, habitats

### Takeaway
Guides list several level boosters besides residents:
- the Pokémon Center rebuild ("大幅に"), paving the road, completing requests;
- buildings and kits, "even if a Pokémon doesn't immediately live there" (Serebii).

No test measures any of these as a flat bonus. Two Japanese guides and ぽこポケ学会 describe road paving and requests as acting **through comfort**. ぼってぃ's reset test reads residents' points from a meter starting near 0, which leaves no room for a large lasting non-resident bonus. Model them as comfort inputs, not points.

### Cited Findings
- [guide] Serebii: "completing Requests will also raise it such as Restoring the Pokémon Center. If you add buildings and other kits, it will also help raise it even if a Pokémon doesn't immediately live there." — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml). PokoTraqr's data file copies this list ("Adding buildings and construction kits"), but its calculator scores only residents — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator) (JS bundle)
- [guide] GameWith:
  - Rebuilding the Pokémon Center: "ポケモンセンターを建て直すことでも環境レベルが上がる"; road and rebuild "大幅に環境レベルを上げられる".
  - Road paving works through comfort: "すみかからポケモンセンターまでの道のりを整えることでポケモンのすみごこちが上がっていきます".
  - — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345)
- [guide] Game8 JP: paving the road makes Pokémon go out more easily, "「すみごこち」が良くなります". Environment-preference requests "達成するとすみごこちが上げられる" — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551). Game8 EN: "Completing Requests increases the Comfort Level of Pokemon" — [Game8 EN 584548](https://game8.co/games/Pokemon-Pokopia/archives/584548)
- [community-tested] ぽこポケ学会 lists "ポケモンセンターまで道がつながっている" as the last of its comfort factors — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/). ぼってぃ blocked the path to the Pokémon Center and saw no comfort change. The tester's guess: "乾燥した地面やひび割れた地面が無い状態であればクリアしているのかも" — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [official, paraphrased in-game text] The くらしのヒント list of comfort "加点要素" includes "建築した家" (a built house) — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [guide, search summary] Withered Wasteland's story request "すみごこちを良くしよう" from Tangrowth: "達成すると環境レベルが2に上昇します" — [Altema onegaigoto11](https://altema.jp/pocoapokemon/onegaigoto11) (search summary; the page returned Access Denied)
- [community-tested] In ぼってぃ's Rocky Ridges reset, the town (by then above level 5) was emptied to level 1. One Average resident then filled about one-third of the level 1→2 meter, and level 2 came at 3 resident points — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)

### Inferences
- **No lasting flat bonus from the Pokémon Center.** In ぼってぃ's reset, a town that was well past level 3, so almost certainly had its Pokémon Center rebuilt, went back to a meter that tracked resident points from about 0.
  - A permanent flat bonus from the rebuilt Pokémon Center would have shown up there as a non-zero baseline.
  - Any bonus from buildings, kits or requests is therefore either nonexistent, small, or itself delivered through residents' comfort.
  - In the 93-versus-93 comparison, equal flat bonuses in both towns would cancel out. That comparison cannot rule them out, but the reset test can.
- The "kits help even with no resident" line is best read as: a kit is a better home, so whoever moves in rises faster. It may also tie to the in-game tip that a built house raises comfort. Neither guide offers a measurement.
- The app should not add flat points for buildings, kits, the Pokémon Center, roads or requests. It may show them as "raises residents' comfort", and flag Serebii's claim as untested.

### Gaps
- Nobody has measured the meter immediately before and after rebuilding a Pokémon Center, placing an empty kit, or paving the road, with residents' ranks unchanged. That is the test that would settle it.
- Whether the Pokémon Center rebuild affects every resident's "path to the Pokémon Center" comfort factor at once (which would explain "大幅に") is unknown.

## The hold when points fall, and what re-locks

### Takeaway
On the way down the level is kept for a margin; on the way up it is not:
- ぼってぃ saw level 5 (52) still held at about 50.
- mogsetsu, via PokoTraqr, says a level drops only below about 75 % of its band, a drop line near 45.5 for level 5.

These two agree but neither pins the exact drop point. A drop re-locks the unpurchased shop stock and the challenges of the lost level. Level 10 can also drop. Comfort ranks themselves also seem to resist falling, and changes register only once the Pokémon notices them, so real drops lag further.

### Cited Findings
- [community-tested] "環境レベルを跨いで環境レベルが下がるときのみ、環境レベルが保持される仕様がある … 例）すみごこちポイントがレベル5の52ptから下がったとしても、50ptくらいまでは、レベル5が保持される。（メーターが0だからと行って、環境レベルの境目とは限らない）". The tester guesses the purpose is to absorb moves and redecorating — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [community-tested via calculator, original unread] "Level won't drop unless below ~75% progress for that level". The calculator does not implement the hold; its level is simply the highest threshold reached — [PokoTraqr](https://www.pokotraqr.com/paradise/env-calculator) (page and JS)
- [community-tested] Comfort ranks resisted falling in ぼってぃ's tests:
  - Pichu stayed ふつう after being moved into light, after the Pokémon Center path was blocked, and after being lit by mushroom lamps it disliked.
  - An Average Torchic boxed in ice stayed ふつう.
  - Machoke stayed ちょっといい感じ after being moved to bare grass and darkness it dislikes.
  - Swirlix, which had been ちょっといい感じ before the reset, came back at びみょう. That broke the tester's "floor" hypothesis.
  - — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- [guide] Re-locks:
  - Serebii: "all unpurchased items that unlock at that level in the shop are locked again and any challenges from that level are locked once more" — [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
  - Game8 JP: the shop lineup reverts "再び環境レベルを上げるまで戻らない" — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
  - Game8 EN: the level "can decrease at any point … even if you've already reached the maximum Environment Level" — [Game8 EN 584548](https://game8.co/games/Pokemon-Pokopia/archives/584548)
  - pokopia.center: already-purchased items "are not described as being removed" — [pokopia.center](https://pokopia.center/posts/pokopia-environment-level-guide-2026/)
- [guide] Drop causes:
  - a Pokémon taken to another map (more for a happier one);
  - a dwelling or nearby furniture removed;
  - a comfort item left broken;
  - rain putting out an unroofed fire, or a dry-loving Pokémon's surroundings getting wet.
  - — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
- [official, patch notes] 2.0.0 shortens two kinds of drop:
  - "Pokémon that are sad because furniture was removed will now notice more quickly when the same furniture is replaced";
  - a resident whose habitat is destroyed moves back in if the same habitat is rebuilt nearby.
  - — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)

### Inferences
- Read "75 % progress for that level" as: level L is kept while points ≥ T[L−1] + 0.75 × (T[L] − T[L−1]). Drop lines under that reading:

| Level | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Drops below (points) | 2.25 | 9.75 | 22.5 | 45.5 | 70.75 | 94.25 | 115 | 135 | 155 |

  - ぼってぃ's "level 5 held at about 50" falls inside the level 5 margin (45.5–52), so the two sources are compatible.
  - Treat the table as an estimate: neither source observed the actual drop point.
- The app's "held until roughly 75 % of the band" matches the only stated rule. It should warn when a planned move takes a town below the drop line, not just below T[L], and say that unbought stock and challenges of that level re-lock.

### Gaps
- No one has recorded the exact point at which a level fell, at any level. The 75 % figure's derivation is unknown (Reddit blocked).
- Whether the hold also applies to level 10 (Game8 EN says level 10 can drop; the margin is untested), and whether it resets after a reload or a day change, is unknown.
- How long comfort ranks take to fall after a disliked change has not been measured. ぼってぃ's "stickiness" observations conflict, and 2.0.0 changed the timing of noticing replaced furniture.

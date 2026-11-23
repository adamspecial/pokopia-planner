# How habitats attract and spawn Pokémon in Pokémon Pokopia

Status: work in progress (notes added as research proceeds). Date of research: 2026-11-23.

Evidence labels: official (Nintendo or in-game text), datamined, community-tested, guide, unverified.

## What makes a habitat count, and what happens when it forms

(in progress)

## How many Pokémon at once, how long they stay, when spawns re-roll

(in progress)

## Spawn odds and rarity

(in progress)

## Conditions on spawns (time, weather, area, progress, environment, neighbours)

(in progress)

## Overlapping, adjacent and duplicate habitats

(in progress)

## Evolution

(in progress)

## Legendary, mythical, special-form and shiny Pokémon

(in progress)

## Pokémon obtained outside habitats, and Pokédex registration

(in progress)

## Breaking or editing a habitat while Pokémon visit

(in progress)

---
Raw notes collected so far (to be folded into the sections above):

- Fetch note: game8.jp, gamewith.jp, pokopia.dev and kyu49.github.io are outside this session's allowed network hosts, so all findings come from web-search result summaries, not full page reads.
- Guide (JP): habitat does not spawn at once; after it forms, an internal lottery runs after some time; a hit shows a shadow-like effect on the ground; a habitat without the formed mark (成立マーク) is never rolled. Search summary of Game8 JP 出会い方 https://game8.jp/pocoapokemon/768257 and kengomon https://www.kengomon.com/pokoa-pokemon-livepokemonmake/
- Guide (JP): among several undiscovered species in one habitat, lower-rarity ones come first; once all ★1 and ★2 are found, the remaining ★3 is said to be certain. Game8 JP 珍しいポケモン https://game8.jp/pocoapokemon/767516 ; Altema https://altema.jp/pocoapokemon/reapokemon
- Guide (JP): placing slightly more than the minimum items tends to raise the rate (少し多めに配置). Game8 JP 767516 (search summary).
- Guide (JP): moving the Switch 2 clock forward one day makes Pokémon appear at a habitat at once. Game8 JP 767516.
- Guide (JP): offering spicy food to Moss Snorlax (こけカビゴン) raises the appearance rate. GameWith 547180 (search summary).
- Guide (JP): habitats packed close together can stop the wanted one from spawning; a blog says the dotted area (right-stick press) containing another habitat or すみか stops the lottery, and that one Pokémon per habitat type is basic. gamepedia 3417 https://gamepedia.jp/pocoapokemon/archives/3417 ; dokodeyomu https://dokodeyomu.hatenadiary.com/entry/Habitat_of_Pokoa_Pok%C3%A9mon
- Unverified (X): if a habitat never spawns, look for an unclaimed spawn flag (rustling grass, water splash) elsewhere on the island, and remove habitats that are not anyone's home. https://x.com/splashbeat_siri/status/2030570662092304449
- Guide (JP): breaking a habitat of a not-yet-befriended Pokémon makes it wander (すみかなし); it reappears in the area from the next day; rebuilding the same habitat nearby makes it live there again; Honey (あまいミツ) calls it without waiting a day. Befriended residents do not vanish. gamepedia 3417; blingbling https://blingbling.jp/pocoa-sumika-kieta/ ; reiwabook https://reiwabook.blog/pokopoke-seisokuchi/
- Guide (EN): first visitors usually by the next morning; rebuilt habitats refill in 1-2 days; rare ones several days. RankedBoost https://rankedboost.com/pokopia/guides/how-to-attract-pokemon/ ; Pokopia Companion https://www.pokopiacompanion.com/guides/following-habitat-hints-your-guide-to-attracting-pokemon
- Guide (EN): stars from 1 (common) to 3 (very rare); the same species can have different stars in different habitats. Pocket Tactics https://www.pockettactics.com/pokemon-pokopia/habitats ; no reliable percentages (Deltia's https://deltiasgaming.com/pokemon-rarity-in-pokemon-pokopia-explained/). pokopiaplanner.com spawn calculator percentages (Pikachu 25%, Vileplume 2%) look invented.
- Tool site counts 257 habitats (ぽこポケツール) https://toolz.gamepedia.jp/pocoapokemon/zukan/habitat ; data.json has 254 (209 Main + 36 Basin + 9 Event).
- Guide (JP+EN): no evolution mechanic; evolved forms are separate individuals found at their own habitats (same habitat as the base form or a different one). Game8 JP 769013 https://game8.jp/pocoapokemon/769013 ; GameWith 547911 https://gamewith.jp/pocoapokemon/547911 ; VGC https://www.videogameschronicle.com/guide/pokemon-pokopia-how-to-evolve/ ; GamesRadar https://www.gamesradar.com/games/pokemon/pokemon-pokopia-evolve/ ; games.gg https://games.gg/news/pokemon-pokopia-no-evolution-mechanic/
- Guide (EN): duplicates of an already-befriended species are not attracted; once every other species of a habitat is had, the next spawn is the rare one. VGC (above).
- Guide (JP): no shinies (色違いは登場しない); 12 legendary/mythical in base game via story, Dream Island (ゆめしま) or crafting a specific kit. Mew = 27 Mysterious Slates (ナゾのせきばん) set into the Withered Wasteland mural; Kyogre etc. registered via story talk events; Manaphy by talking in the underground Sea Temple; Raikou at low chance in Dream Island underground. gamepedia 1833 https://gamepedia.jp/pocoapokemon/archives/1833 ; gameranbu https://gameranbu.jp/pocoapokemon/c569835a93decba1c5b3 ; game-shinden https://game-shinden.com/pokoa-pokemon-legendary-how-to-get-and-recruit-guide/
- Guide (JP): birds (Articuno, Zapdos...) by building specific building kits in a town; Ho-Oh appears on sunny days and needs the Clear Bell (とうめいなスズ). Altema https://altema.jp/pocoapokemon/densetu
- Guide (EN): dolls -> Dream Islands: Pikachu doll Raikou, Eevee doll Suicune, Arcanine doll Entei, Dragonite doll Mewtwo (Sky); Substitute doll random among unlocked; Lugia needs the three birds, Ho-Oh the three beasts; legendary chance low and undocumented; one site says it scales with total Environment Level across five towns; Dream Islands reset daily. Pocket Tactics https://www.pockettactics.com/pokemon-pokopia/legendary-pokemon ; GameFAQs https://gamefaqs.gamespot.com/switch-2/559184-pokemon-pokopia/faqs/82556/dream-islands ; gamertw https://pokopia.gamertw.com/guide/dream-island ; Serebii legendary https://www.serebii.net/pokemonpokopia/legendary.shtml
- Bulbapedia: Jirachi is the only legendary/mythical in Pokopia found in a habitat. https://bulbapedia.bulbagarden.net/wiki/Jirachi_(Pok%C3%A9mon)
- Guide (JP): Pokédex = talk to a spawned Pokémon to befriend it -> registered; Pokédex completes at 300. Game8 JP 767402 https://game8.jp/pocoapokemon/767402 ; trophy-walker https://trophy-walker.gloomy.jp/2026/04/11/
- Guide (JP): spawn check is random at fixed intervals (一定時間ごとのランダム); ★2+ take longer; 成立マーク needed. Game8 JP 768257 (search summary). すみかなし: wait 1-2 days. pokemongo-raku 150444 https://pokemongo-raku.com/post150444
- Official patch notes (search summary): Ver.1.0.3 fixed Pokémon whose habitat vanished not being findable via Pokédex search (GAME Watch https://game.watch.impress.co.jp/docs/news/2100378.html). Ver.1.0.4: fixed Pokémon sinking into Chansey's planter when spawning from the Chansey rest area habitat; fixed some Pokémon rarely appearing in town while homeless. Ver.2.0.0 (5 Aug 2026): fixed Pokémon falling into the sea or off cliffs when appearing from a habitat; Suicune/Gholdengo could not move on water (official https://www.pocoapokemon.jp/ja/news/136/). Ver.2.0.1 (8 Sep 2026): fixed Ho-Oh/Lugia repeatedly falling and reappearing; Pokédex search not finding Pokémon (official https://www.pocoapokemon.jp/ja/news/159/). Ver.1.1.0 = large improvement update (denfaminicogamer https://news.denfaminicogamer.jp/news/2606102e).
- Guide (JP): a habitat that is already someone's すみか cannot be offered to another; houses hold 1, 2 or 4. Game8 JP すみか移動 https://game8.jp/pocoapokemon/767983 ; gameranbu https://gameranbu.jp/pocoapokemon/c6b54860896393e6281c
- Official (patch, search summary): Ver.1.1.0 released 10 Jun 2026: fixed some Pokémon rarely appearing in town while homeless; fixed hot-spring wash-area habitat Pokémon not reacting to the spring; fixed Chansey rest area spawn clipping; habitat-dex filter button renamed. No spawn-rate change found. ndw https://www.ndw.jp/pokopoke-game-260610-02/ ; gamemos https://gamemos.net/2026/06/10/post-143304/ ; gamepedia 5597 https://gamepedia.jp/pocoapokemon/archives/5597 (the 1.0.4 attribution in an earlier summary seems to be this 1.1.0 list).
- Guide (JP): Moss Snorlax offering, spicy (からい) taste: raises habitat spawn likelihood; raw ingredient = ちょっと, cooked dish = かなり (3 tiers ちょっと/まあまあ/かなり); Crouton salad, hot soup bread, medicinal soup = かなり. GameWith 547741 https://gamewith.jp/pocoapokemon/547741 ; gamepedia 2473 https://gamepedia.jp/pocoapokemon/archives/2473 ; toolz spicy list https://toolz.gamepedia.jp/pocoapokemon/zukan/food/taste/%E3%81%8B%E3%82%89%E3%81%84
- Unverified (GameFAQs board): two identical habitats: one filled fast, the other slow; claim it only affects ★2; a player with 100+ flower beds waited 3 weeks; theory that duplicates confuse the game; suggests moving extra copies to another area. https://gamefaqs.gamespot.com/boards/559184-pokemon-pokopia/81152779 ; thegameswiki recommends duplicates https://thegameswiki.com/pokopia/wiki/habitat-dex ; pokopia.center: duplicates do not add species but can add extra individuals of the same species https://pokopia.center/posts/pokopia-all-habitats-pokemon-list-2026/
- Display cap per area: X @rusted_coil: 20-25 shown, random pick, rest inside kit houses or gone; kit houses up to small x40 or large x20 https://x.com/rusted_coil/status/2036394837554110486 ; note game9820 says 25 https://note.com/game9820/n/n8212fd59cc52 ; Game Rant 20 (20-22), rotate daily https://gamerant.com/pokopia-how-many-pokemon-per-region-limit/ ; GameNGadgets ~30 https://www.gamengadgets.com/2026/03/pokemon-pokopia-the-missing-pokemon-dilemma-how-to-fix-it/ ; Honey near a shared home makes all residents spawn (GameNGadgets).
- Jirachi event 'Wish Upon a Jirachi' 23 Jun 05:00 to 8 Jul 2026 05:00 (local); Surrounded by stars = Star closet, Starry-sky bed, Cloud table, Jirachi lamp (powered); each 1 Shining Wish Note; Jirachi appears only after the event ends. games.gg https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-build-the-surrounded-by-stars-habitat/ ; Game Rant https://gamerant.com/pokopia-jirachi-event-guide-habitat-wish-notes/ ; allthings.how https://allthings.how/pokemon-pokopia-jirachi-event-all-rewards-and-how-to-finish-it/ . Matches data.json E005.
- Serebii habitat page format: each Pokémon has a rarity label and a time x weather grid; Tree-shaded tall grass (#002) shows Skwovet common, Heracross rare. https://www.serebii.net/pokemonpokopia/habitatdex/tree-shadedtallgrass.shtml
- Guide (JP): Environment level up unlocks shop stock, challenges and new Pokémon appearing; one team's test: higher total environment level -> higher Dream Island legendary rate. GameWith 545345 https://gamewith.jp/pocoapokemon/545345 ; Game8 JP 767551 https://game8.jp/pocoapokemon/767551
- Guide (JP): rain-only: Goomy line (ヌメラ No.074, ヌメイル No.075), Empoleon (rare/very rare, rain), Azumarill in rain list; Ho-Oh sunny-only; Lugia rain-only on one site, rain or cloudy on another. toolz rain list https://toolz.gamepedia.jp/pocoapokemon/zukan/habitat/spawn/%E9%9B%A8%E9%99%90%E5%AE%9A ; Altema sunny https://altema.jp/pocoapokemon/tenki/1 ; cloudy is random and cannot be targeted.

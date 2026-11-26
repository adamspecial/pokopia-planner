# A furniture trio sets Pokopia's comfort ceiling

Comfort (すみごこち, the Comfy Level) in Pokémon Pokopia Ver. 2.0.1 is a six-step rank held by each resident: no home (すみかなし), Iffy (びみょう), Average (ふつう), Nice (ちょっといい感じ), Great (めちゃイイ感じ) and Awesome (最高). Its ceiling depends on what lies inside the home's range: **a rest item the Pokémon can actually use, a toy, a decoration, its liked environment and food of its favourite flavour**, with items in its favourite categories worth more than plain ones. The only rank model built from play scores rest 0–2, toys and decorations together 0–6, environment 0 or 2 and food 0–2, and reads **9 or more as Awesome**. Its author, a Japanese player testing in March 2026, calls it "a feel", and nothing official, datamined or newer than Ver. 1.0.4 has replaced it. The rank changes only when the Pokémon *notices* a change. The daily 「すみごこち どう？」 wish is worth exactly one rank, and falls follow discrete events such as a lost home, removed furniture or a doused fire, not daily decay. A town's environment level is the sum of **10 / 5 / 2 / 1 / 0 points per resident, doubled for legendaries**, measured against thresholds of **3, 12, 26, 52, 77, 100, 120, 140 and 160**. Two independent community measurements agree on these numbers, and a falling level is held until roughly three-quarters of the way back down its band. The pokopia-planner's scoring and level maths match this evidence almost line for line. Its weak point is dislikes. Only two pairs are documented: Grass types with fire-related furniture, and Fire types with water. The app reads the second pair as every "Lots of water" item and every water tile, hot-spring water included. That rule marks **Torkoal, Raboot and Magmortar as disliking the very habitats the game spawns them into**, and its "stays Iffy" effect has no source. The most valuable changes are a tiered water list, a relabelled dislike effect, zero points for story Pokémon and a visible level-drop line. The official Japanese sites, Reddit, X, YouTube, Pokémon Wiki, wikiwiki, Altema, Bulbapedia and several Japanese blogs could not be read from this environment, so the original Reddit research behind the legendary doubling and the level hold remains unchecked.

## Four inputs fill a ten-point ceiling, and favourites double them

### Two fan tests and one wiki carry the whole model

No datamine of the comfort formula exists in English or Japanese. PokeOS's datamine index lists "specialties, favorite flavor, ideal habitat and favorite things for every Pokémon" and nothing about dislikes or scores ([PokeOS](https://www.pokeos.com/news/2010/POK%C3%89MON+POKOPIA+DATAMINE+QUICK+LINKS:)). Everything below therefore rests on two fan tests, one fan wiki and a stack of guide sites. The first test is ぼってぃ's note 「環境レベルを検証する」, published on **16 March 2026 under Ver. 1.0.1** and never edited ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). The wiki is ぽこポケ学会's house page, last changed on **17 May 2026 under Ver. 1.0.4** ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/); [commit log](https://github.com/kyu49/pokopia/commits/main/docs/house.md)). Two player diaries from late March and mid-May add anecdotes ([がんも](https://note.com/ganmo_umai/n/nc20c24282d4d); [ろぜ](https://note.com/roze_flare999/n/nc89b8a22469e)). **No comfort test newer than Ver. 1.1.0 (9–10 June 2026) was found.**

The patches since then change display and timing, not scoring. Ver. 1.1.0 added the following:

| Change | Detail |
|---|---|
| Wish checkmark | A ✅ on the environment-level screen for each Pokémon whose wish was granted that day |
| Two items retuned | The comfort settings of the bath seat (ふろばのいす) and stone fireplace (いしのだんろ) were made "more natural" |
| Two fixes | Removing a disliked block failed to raise comfort; Pokémon remarked on brightness changes that never happened |

Ver. 2.0.0 made Pokémon re-notice replaced furniture faster and let them move back into a rebuilt habitat, and Ver. 2.0.1 is bug fixes only ([攻略大百科 Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597); [Game8 JP update log](https://game8.jp/pocoapokemon/771132); [Serebii patches](https://www.serebii.net/pokemonpokopia/patch.shtml)). The March and May tests are untested since June, but nothing in the patch notes touches the numbers. The rest of this report labels evidence as **community-tested** (a player measured it), **guide** (a site states it without a test) or **unverified** (one anecdote, an untested tool, or a page seen only as a search summary).

### The additive score is a feel, but two of its observations are firm

The game's own くらしのヒント (life tips), as ぼってぃ paraphrases them, list the plus factors as favourite environment, rest furniture, giving food, toys, decorations and a built house. They add that legendaries and mythicals weigh heavily on the level. The minus factors are disliked things and an unpaved path to the Pokémon Center ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). ぼってぃ turned that list into a points model:

| Factor | Points | Notes |
|---|---|---|
| Rest item (きゅうけい) | 0, 1, or 2 if it matches a favourite | "必須？" (required?) |
| Toys and decorations (おもちゃ・かざりつけ) | 0–6 in total | "one toy and one decoration seem fixed, and the third differs per Pokémon" |
| Liked environment | 0 or 2 | Bright, Dark, Warm, Cool, Humid or Dry |
| Food | 0, 1, or 2 for its favourite flavour | probably needed for 最高 |
| **Rank** | **9+ 最高, 6–8 めちゃイイ, 4–5 ちょっといい, 0–3 ふつう** | 「びみょう：マイナス？」 (Iffy = a negative total?) |

The author writes 「完全に体感の域を出ないが」, "purely a feel". The worked example still scores cleanly. A Lotad-line Pokémon reaches 10 from a Lots of nature rest item, a Noisy stuff toy, a Containers decoration, a humid environment and its favourite food, each worth 2. Two observations in the same note are firmer than the mapping. First, **placing only non-favourite items never got past Nice** (「好きなアイテム以外を置き続けても「ちょっといい感じ」以上にはならない」). Second, **seven days of favourite sour Aspear Berries alone left a Machoke at Nice**, and it jumped to Awesome on the day its environment, toys and decorations were added ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). Both fit the arithmetic. Plain items top out around 1 + 3 + 2 + 2 = 8 only if every other factor is perfect, and food plus nothing else is worth 2.

ぽこポケ学会 orders the factors for 最高 by importance and opens with 「未解明な部分が多い」 (much is unexplained):

1. No disliked environment in range.
2. The favourite environment met.
3. Not hungry.
4. A rest item, a toy and a decoration all in range.
5. Some favourites in range, where 「同じ家具は加算されない or 効果が著しく薄れる？」 (the same furniture doesn't add, or adds much less?).

Two weaker factors follow: "(仮説) キットの家 > 家 > 生息地" (hypothesis: kit house > block house > habitat), and a road connected to the Pokémon Center ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)). Read together, the two Japanese sources describe the same machine. The wiki gives the order of importance and the note gives the weights.

The rival models are weaker. PokoTraqr's housing guide maps a tag-match percentage to ranks ("Iffy (0-24%) to Awesome (90%+)") without any test ([PokoTraqr guide](https://www.pokotraqr.com/guides/housing-guide)). pokopia.center gives a cap of 6 seats per room, 1 bed per room, a "+5 set bonus" and a "90 comfort" target for Rayquaza that no other source mentions. Its own comfort guide admits it "previously published an invented four-level system" and withdrew it ([pokopia.center furniture](https://pokopia.center/posts/pokopia-furniture-categories-complete-guide-2026/); [pokopia.center comfort](https://pokopia.center/posts/pokopia-comfort-level-furniture-guide-2026/)).

One of ぼってぃ's data points sits awkwardly with the model. A newly housed Fidough (パピモッチ) started at Iffy and reached Average after its favourite food. It then reached Nice after toy blocks were placed between two homes ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). Under the model that is 2 + 1 = 3 points, which is Average. In the planner's Serebii-derived data the toy blocks (Gatherings, Play spaces, Wooden stuff) are not among Fidough's favourites. So the step needs something the tester did not record, such as a rest item already in the home or a warm reading.

### Favourites count, most likely through the tagged slots

Every source agrees that favourites matter. They disagree on whether favourites count on any item or only on rest, toy and decoration items. Serebii says "every item in the game fits in to several of these categories", and that decorating with them makes comfort "increase at a higher rate", which shows as **a bigger sparkle** when the item is placed ([Serebii Favorites](https://www.serebii.net/pokemonpokopia/favorites.shtml)). ぽこポケ学会 lists favourites as a factor separate from the trio. ぼってぃ counts favourites only as the 2-instead-of-1 bonus on a tagged item, and notes that only the comfort check confirms a match ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). The daily wishes favour ぼってぃ's reading. ろぜ's Honchkrow asked for 「キラキラの休憩」 (a *shiny rest item*), and luxury furniture did not satisfy it, though a gaming bed did ([ろぜ](https://note.com/roze_flare999/n/nc89b8a22469e)). A Game8 JP reader reports that a Flareon's wish was met by "a fire-feeling toy" ([Game8 JP comments](https://game8.jp/pocoapokemon/775378)). Both are unverified, but each pairs one favourite with one tag, which is what a per-slot score predicts.

Only one source suggests an untagged favourite helps on its own. 攻略大百科 says the Large Lost Relic from glowing ground raises the chance a Pokémon is pleased ([攻略大百科 環境レベル上げ](https://gamepedia.jp/pocoapokemon/archives/1760)). Serebii lists that relic with no tag and the Strange stuff favourite ([Serebii Large Lost Relic](https://www.serebii.net/pokemonpokopia/items/largelostrelic.shtml)). The untagged items that carry favourites are mostly tables, desks, counters, storage boxes, safes, flowers and some blocks. Posters, rugs, block prints and wallpapers carry **neither a tag nor a favourite** on Serebii, so they cannot add comfort under any reading ([Serebii Plain table](https://www.serebii.net/pokemonpokopia/items/plaintable.shtml); [Serebii Acrylic poster](https://www.serebii.net/pokemonpokopia/items/acrylicposter.shtml); [Serebii Ocean pals rug](https://www.serebii.net/pokemonpokopia/items/oceanpalsrug.shtml)). No source says how many of a Pokémon's five favourite categories must be present. None says whether an item matching two favourites scores more than one matching one. The nearest evidence is ぼってぃ's remark that every 最高 case had "three kinds of favourite toys or decorations".

### Kinds count, copies do not, and the resident caps are inferred

The one measured cap is for Ditto's own house. Its comfort maxes at **13 kinds, with at most 5 kinds each of toy, rest and decoration evaluated**, and it counts toward the environment level ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)). For residents, ぼってぃ's "one rest item and three toys or decorations, at least one of each" is inferred from the 最高 cases seen: "three toys or three decorations have never occurred so far". It is not a ceiling anyone hit. No source tests a second rest item, a fourth toy or a third toy with no decoration ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). Every source that counts furniture counts **kinds** (種類). A house needs 「家具が3種類」 (three kinds) before anyone moves in, and Serebii says "Pokémon will not move in unless there's 3 unique pieces of furniture" ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [Serebii Building](https://www.serebii.net/pokemonpokopia/building.shtml)). The Ver. 2.0.0 note that a Pokémon saddened by removed furniture notices sooner when 「同じ家具」 (the same furniture) returns shows that the game tracks item identity ([攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)). A guide seen only as a search summary adds that mixing kinds beats repeating one ([gameranbu](https://gameranbu.jp/pocoapokemon/b4d5600e91087e3eba87)). Copies of one item therefore add nothing or very little. A repainted copy is the same item in a different colour state, so it should count once too, though nobody has tested this.

Serebii tags **79 Relaxation, 148 Toy and 229 Decoration items, and no item carries two tags**. Several tags are counter-intuitive. **Campfire, Torch and Stone fireplace are rest items.** Every lamp and most streetlights are Decorations. Sinks, showers, mirrors, PCs and fountains are Toys ([Serebii Relaxation](https://www.serebii.net/pokemonpokopia/items/relaxation.shtml); [Serebii Toy](https://www.serebii.net/pokemonpokopia/items/toy.shtml); [Serebii Decoration](https://www.serebii.net/pokemonpokopia/items/decoration.shtml)). Every table, desk, counter, storage box and safe is untagged ([Serebii Furniture](https://www.serebii.net/pokemonpokopia/furniture.shtml)).

### A bed it fits, a band from four below to three above the door, and light only indoors

Size is a hard rule: 「ポケモンは、自身より小さいベッドやイスを使うことはできません」 (Pokémon can't use a bed or chair smaller than themselves). Big Pokémon such as Charizard and Suicune cannot live in small houses either ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509)). Range is just as concrete. ぽこポケ学会 found that comfort counts furniture around the house as well as the three pieces that make it a house. The range shows as a white dotted line when you press R near a resident. For a door no more than 5 blocks above ground it runs **from 4 levels below the door to 3 above**. 「ポケモンがアクセス不可能だと、住心地に影響を与えない」 (an item the Pokémon can't reach has no effect), and one item can serve several homes. **Light and other environment items use a tighter range: inside the house and directly above or below the door, floor −1 to +3**, marked 検証不十分 (not fully tested) ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)). Game8 JP confirms that items in overlapping ranges count for both homes. It also says a housed Pokémon's comfort 「家の外の環境を整えても変化しなくなります」 (stops responding to the outdoor environment) ([Game8 JP 767983](https://game8.jp/pocoapokemon/767983)). Wall-hung toys and decorations count ([Game8 JP 767513](https://game8.jp/pocoapokemon/767513)). Items stacked on tables are untested.

### Food is capped per Pokémon, and a favourite dish counts most

Food is the input a layout cannot supply. 攻略大百科 says the food contribution has 「ポケモンごとに上限」 (a per-Pokémon cap): **a favourite-flavour dish raises comfort most, and a non-favourite ingredient only slightly** ([攻略大百科 2474](https://gamepedia.jp/pocoapokemon/archives/2474)). ぼってぃ found that a plain Leppa Berry given first seemed to use up 「当日の食事枠」 (the day's meal slot), so a favourite given afterwards that day changed nothing. The note leaves open whether a Pokémon never fed can reach 最高 and whether basket food counts ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). Food can be handed over directly or left on a plate. The plate's own text says Pokémon 「食べにくるかも」 (may come to eat), and no test confirms that plate food counts toward comfort ([GameWith 木のおさら](https://gamewith.jp/pocoapokemon/547774); [Game8 JP 767513](https://game8.jp/pocoapokemon/767513)). No source supports berries on nearby trees feeding residents. Hunger ranks third in ぽこポケ学会's order, and a hungry Pokémon's wish is always food. Nintendo Life says Iffy Pokémon "are mainly hungry" ([Nintendo Life](https://www.nintendolife.com/guides/pokemon-pokopia-how-to-raise-comfort-levels)). **No Pokémon likes plain food** ([Game8 JP 771031](https://game8.jp/pocoapokemon/771031)), and Leppa and Lum Berries are plain ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509)). The cheapest raw favourites are listed below. There is no spicy berry, so spicy-lovers need carrots ([Serebii Flavors](https://www.serebii.net/pokemonpokopia/flavors.shtml); [攻略大百科 2474](https://gamepedia.jp/pocoapokemon/archives/2474)).

| Flavour | Raw favourites |
|---|---|
| Sweet | Pecha Berry, beans |
| Spicy | Fresh carrot |
| Bitter | Rawst Berry, potato, seaweed |
| Dry | Chesto Berry, wheat, cave mushrooms |
| Sour | Aspear Berry, tomato |

Bulbapedia, seen only as a search summary, says each species also has a disliked flavour, and no Japanese guide mentions one ([Bulbapedia Flavor](https://bulbapedia.bulbagarden.net/wiki/Flavor_(Pokopia))).

### House type changes speed and space, not points

Every source agrees that a house beats a habitat and that a bigger or grand (りっぱな) kit is easier. None measures a score bonus. Serebii says a Pokémon in a built house rises "quicker" ([Serebii Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)). Game8 JP says Pokémon in the shop's 「◯◯のりっぱなキット」 houses 「住み心地が最高になりやすい」 (reach 最高 easily) and that the bigger the house, the easier comfort rises ([Game8 JP 767513](https://game8.jp/pocoapokemon/767513)). 攻略大百科 gives space as the reason: room for several residents and 「大量の家具」 (lots of furniture). Its environment-level page adds that a built house guarantees 「最低限のすみごこち」 (a minimum comfort) ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [攻略大百科 1760](https://gamepedia.jp/pocoapokemon/archives/1760)). A house also shields residents from rain putting out fires and from daylight for dark-lovers. In ろぜ's diary, a Marill stuck at Great for five days in a habitat reached Awesome within minutes of moving into a house. That anecdote also fits a forced re-check on moving ([ろぜ](https://note.com/roze_flare999/n/nc89b8a22469e)). The evidence points to speed, space and insulation, perhaps with a floor, and not to points toward the 9.

## Only two dislike pairs are documented, and neither names a category

### Grass with fire and Fire with water are the whole published list

The official text names one dislike group, for movement rather than comfort. The Ver. 2.0.0 fix list says 「水が苦手なポケモン」 (Pokémon that are bad with water) could not walk over duckweed ([攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)). Ver. 1.1.0 confirms that terrain can be disliked: 「特定の状況で、ポケモンが苦手なブロックを撤去しても、「すみごこち」が上がらないことがある」 (in some situations removing a **block** the Pokémon dislikes did not raise its comfort). The English notes soften "block" to "items" ([GameWith アップデート](https://gamewith.jp/pocoapokemon/547086); [Game8 EN 1.1.0](https://game8.co/games/Pokemon-Pokopia/archives/605000)). The guides give concrete pairs. 攻略大百科 names Bulbasaur near 「たきびなどの炎に関する家具」 (fire-related furniture such as a campfire) and Charmander near 「タッツーふんすいなど水に関する家具」 (water-related furniture such as the Horsea fountain) ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509)). Game8 JP says 「ヒトカゲは水のある場所には引っ越しできません」 (Charmander can't move to a place with water) ([Game8 JP 767983](https://game8.jp/pocoapokemon/767983)). GameWith says Fire types such as Litwick dislike waterside habitats ([GameWith 545344](https://gamewith.jp/pocoapokemon/545344)). Game8 EN warns against "a house built near Spring Water" for Charmander ([Game8 EN 585496](https://game8.co/games/Pokemon-Pokopia/archives/585496)). **Every source says "fire-related", "water-related", "waterside" or "a place with water". None names the Lots of fire or Lots of water favourite category.**

The game's own spawn data disagrees with reading those categories literally:

| Habitat | Recipe includes | Spawns | Type |
|---|---|---|---|
| Mossy hot spring | Hot-spring water ×2 | **Torkoal** | Fire ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/mossyhotspring.shtml)) |
| Open-air bath | Hot-spring water, hot-spring spout | **Raboot** | Fire ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/open-airbath.shtml)) |
| Mini kitchen | Modern sink (a Lots of water item) | **Magmortar** | Fire ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/minikitchen.shtml)) |
| Illuminated waterfall | Torch ×2, water, waterfall | **Gyarados** | Water ([Serebii](https://www.serebii.net/pokemonpokopia/habitatdex/illuminatedwaterfall.shtml)) |

A check of all 257 habitats in the planner's data.json finds no Grass type spawning beside a fire item, and exactly these three Fire-type clashes. Either hot-spring water and the Modern sink are not "water" for this dislike, or spawning ignores dislikes. Either way, a rule that flags them is wrong for real game layouts. Gyarados beside torches also undercuts a town-design essay that says humid-lovers dislike fire. The same untested essay claims dry-lovers dislike humidity, warm-lovers clash with cool- and humid-lovers, and dark-lovers clash with bright-lovers ([Splatoonブキ研究所](https://note.com/splatoonweapon/n/ncb41c8dfc076)). The Lots of water category in the planner's data holds 30 items. Many are water only in a loose sense, such as paper party cups, soda float, shaved ice, juice trio, table setting, teaware set, toilet, cleaning supplies, beach parasol, bottled ship and resort hammock. The only water item a guide names is the Horsea fountain.

### A dislike blocks move-in and lowers comfort, by an unmeasured amount

All sources agree that a disliked thing in range makes a Pokémon refuse to move in. Game8 JP says 「引っ越し先のすみかにポケモンの苦手なものがあると引っ越しを拒否されます」 (a destination with something it dislikes is refused), and Game8 EN says the same for houses ([Game8 JP 767983](https://game8.jp/pocoapokemon/767983); [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142)). GameWith's table lists 「苦手なものが近くにない」 (nothing disliked nearby) only as a habitat condition ([GameWith 545344](https://gamewith.jp/pocoapokemon/545344)). Comfort also falls when a disliked thing is near a home, according to 攻略大百科 and Serebii. The Ver. 1.1.0 fix implies that removing it should let comfort rise again ([Serebii Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086)). Altema, seen only as a search summary, says a disliked item triggers a visible 「苦手なリアクション」 (dislike reaction) when placed ([Altema](https://altema.jp/pocoapokemon/sumigogoti)). **No source says a dislike pins a Pokémon at Iffy, costs a set number of ranks or evicts a resident.** ぽこポケ学会 ranks "no disliked environment in range" as the single most important condition for 最高, which implies at least that a disliked thing in range blocks Awesome ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)). The only observed effect size is one unverified anecdote, and it points to a small drop. After a campfire was placed, ろぜ's Oddish fell **one rank, from Awesome to Great**, the next day, while the Gloom and Vileplume beside it stayed at Awesome ([ろぜ](https://note.com/roze_flare999/n/nc89b8a22469e)). The Ver. 2.0.0 fix for requests that asked for 「好みではないアイテム」 says "not to its taste", a weaker phrase than ニガテ (disliked). The English rendering "actually dislikes" overstates the Japanese, so that fix is not evidence of a hidden per-item dislike table ([攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548); [Serebii patches](https://www.serebii.net/pokemonpokopia/patch.shtml)).

### Hunger, removed furniture, rain, the road and re-homing make up the rest

The other negatives are better sourced than the dislikes, though none has a measured size. Removing a home or furniture near it lowers comfort, and Ver. 2.0.0 calls the result a Pokémon 「悲しんでいる」 (that is sad) ([GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548)). A comfort item left broken lowers it too. Rain can put out an unroofed campfire and cost a warm-lover comfort, and rain soaking a dry-lover's surroundings does the same. Since Ver. 2.0.0 some roof items block water ([Game8 JP 767551](https://game8.jp/pocoapokemon/767551); [GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [Serebii patches](https://www.serebii.net/pokemonpokopia/patch.shtml)). The game's tips call an unpaved road to the Pokémon Center a minus. Yet ぼってぃ fully blocked the path and saw no change, and guessed that what counts is the absence of dry or cracked ground ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). **Re-homing resets comfort.** 攻略大百科's staff saw the level drop 「一気に」 (all at once) after rearranging homes, and wrote that 「すみかを移動すると、すみごこちが一旦リセットされる」 ([攻略大百科 note](https://note.com/gamepedia/n/ndbefd701f038)). ぼってぃ's Pichu and Fidough, both Nice before their homes were destroyed, came back at Average and Iffy, which broke the tester's own floor hypothesis ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)).

A mismatched environment works differently. It caps gains rather than punishing an existing rank. ぼってぃ tried four changes against settled residents, and none lowered a rank:

| Change | Result |
|---|---|
| Pichu moved to a bright spot | stayed Average |
| A dark-lover's room lit with mushroom lamps until it called it 「拷問部屋みたいな環境」 (a torture room) | stayed Average |
| An Average Torchic's home walled in ice | stayed Average |
| A Nice Machoke put in bare grass with the darkness it dislikes | stayed Nice |

The firm move-in blockers are a house with fewer than three kinds of furniture, a Pokémon too big for the house, a habitat that already has a resident, and an unfinished request (the Pokémon "still has unfinished business") ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [Game8 EN 585770](https://game8.co/games/Pokemon-Pokopia/archives/585770)). Sources disagree on whether the three-kinds rule keeps applying after move-in. ぽこポケ学会 marks it 「引っ越し時のみ」 (move-in only), while Game8 JP warns that a house dropping below three stops being a house and its residents lose their home ([Game8 JP 769142](https://game8.jp/pocoapokemon/769142)). No source shows a penalty for crowding, housemates, time of day or furniture temperature.

## Comfort moves when a Pokémon notices, not as days pass

ぼってぃ's central finding is that 「すみごこちを上げるためには、期間（時間）よりも、ポケモンが認識するかどうかが重要」 (what matters is not time but whether the Pokémon recognises the change). A Pokémon off screen, or on screen but not paying attention, gets no update. Once it notices a placed item it says 「見てみるよ」 (I'll take a look) and then 「ありがとう」 (thanks). Leading it to the item, or changing town to reload the area, triggers the check. Environment, food and the comfort question are recognised at once ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). Rises can therefore be large and fast. **A Pokémon went from homeless to Awesome in one day**: everything was in place before it moved in, its favourite food had been given, and it was walked past its items. Fidough climbed from Iffy to Nice in a single session.

The wish is a slower, separate channel. 「すみごこち どう？」 reveals **one wish per Pokémon per real day, resetting at 05:00**, and granting it raises comfort **exactly one rank** (Game8 JP's example: びみょう → ふつう) ([Game8 JP 767513](https://game8.jp/pocoapokemon/767513); [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509)). The wish names a **genre, not an item**. Game8 JP says 「ほしいものと同じジャンルの物が必要」 (you need an item of the same genre), so any item with the named tag, the named food flavour or the named brightness fix satisfies it. A Pokémon away from home has to be told directly. Items outside the wish still count once noticed ([Game8 JP 767513](https://game8.jp/pocoapokemon/767513); [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). A route that relies only on wishes takes four days from Iffy to Awesome. A layout that has every factor ready before move-in skips that wait. ぽこポケ学会 adds that a Pokémon which names no wish often turns 最高 after time passes or after a change of area, which fits re-scoring on load ([ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)).

Several player actions also nudge comfort, with unknown size and unknown daily caps. 攻略大百科's team says friendship actions raise comfort 「お願いとは別に」 (separately from the wish) ([攻略大百科 4899](https://gamepedia.jp/pocoapokemon/archives/4899)). Game8 EN says mini-games raise the comfort of the Pokémon played with, usually once a day, and that completing its requests does too ([Game8 EN mini games](https://game8.co/games/Pokemon-Pokopia/archives/585464); [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142)). A Scrub follower "may help clean other Pokémon", which raises comfort and friendship "slightly" ([Serebii Scrub](https://www.serebii.net/pokemonpokopia/pokedex/specialty/scrub.shtml)). Not every action works. ぼってぃ's 「・・・」 talk produced a heart but no change of rank. Friendship is a separate meter that has never been seen to fall. It runs the other way too: **low-comfort Pokémon need more gifts**, 8 favourite berries at Iffy or homeless against 6 at Nice ([攻略大百科 4899](https://gamepedia.jp/pocoapokemon/archives/4899)).

Falls follow events and are sticky. In ぼってぃ's tests, environment changes never lowered a settled rank. Losing and regaining a home did. ぼってぃ also floated, without testing, two further ideas: a "past best" ceiling that takes up to three days to exceed, and hidden accumulated points. The PC's − button lists rank names for **the current area only**. Since Ver. 1.1.0 it also shows the day's ✅, and one guide says it shows up and down arrows as well ([攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [pokopia.center environment](https://pokopia.center/posts/pokopia-environment-level-guide-2026/)). No screen shows a number. Only about 25 Pokémon are displayed in an area at once, and undisplayed Pokémon cannot notice anything ([攻略大百科 3417](https://gamepedia.jp/pocoapokemon/archives/3417)). So in a crowded town, residents can sit below their layout's ceiling until they happen to be loaded.

## Ten, five, two, one: ranks sum to a per-town level

Game8 JP puts it in one line: 「環境レベルは街に住んでいるポケモン達の「すみごこち」の合計で決まります」 (the environment level is set by the total comfort of the Pokémon living in the town) ([Game8 JP 767551](https://game8.jp/pocoapokemon/767551)). ぼってぃ solved the conversion from two towns whose meters matched. Rocky Ridges had 4 Awesome, 5 Great, 13 Nice and 2 Average, Sparkling Skylands had 2, 8, 15 and 3, and **both total 93 under 10 / 5 / 2 / 1**. The tester then emptied Rocky Ridges to level 1 and rebuilt it one resident at a time to read off the thresholds ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). The equal-meter comparison does not fix the weights by itself: 8 / 4 / 1 / 2 also gives two equal totals. The values hold because three things agree. The comparison fits them, the rebuild reached level 2 exactly when 1 + 2 = 3, and Reddit user u/mogsetsu reached the same 10 / 5 / 2 / 1 independently. mogsetsu's figures are known through PokoTraqr's calculator, whose code reads `comfortTierPoints:{"no-home":0,iffy:0,average:1,nice:2,great:5,awesome:10}` and doubles every tier for legendaries and mythicals ([PokoTraqr calculator](https://www.pokotraqr.com/paradise/env-calculator); [r/Pokopia post](https://www.reddit.com/r/Pokopia/comments/1rx4p4m/environment_level_calculator/), unread).

| Level | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Points to reach (ぼってぃ) | **3** | 12 | 26 | 52 | 77 | 100 | 120 | 140 | **160** |
| Held down to about (75 % reading) | 2.25 | 9.75 | 22.5 | 45.5 | 70.75 | 94.25 | 115 | 135 | 155 |

The only conflict is level 2. PokoTraqr's code puts it at 1 point. ぼってぃ's log shows a single Average Pichu filled about a third of the meter, a total of 2 did not level up, and 3 did ("かつ環境レベルが2になった") ([ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)). The value of 3 is better supported. On the way down the level is held. ぼってぃ saw level 5 survive at about 50 points after falling below 52, and PokoTraqr quotes mogsetsu as saying a level drops only below about 75 % of its band. The second row of the table above applies that rule. Neither source recorded the actual drop point ([PokoTraqr calculator](https://www.pokotraqr.com/paradise/env-calculator)). A drop **re-locks the unpurchased shop stock and the challenges of that level**, and level 10 can drop too ([Serebii Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [Game8 EN 584548](https://game8.co/games/Pokemon-Pokopia/archives/584548)).

Who counts:

| Resident | Points |
|---|---|
| Any resident of a house, kit or habitat in the area | its rank's points; each area has its own total and its own level |
| No home | 0; Serebii says comfort is "seen as 0" |
| Ditto's house | like a regular resident |
| Story Pokémon and the Hoppip line | 0; they "contribute 0 but don't subtract", per PokoTraqr with no species list |
| Legendaries and mythicals | double |

([Serebii Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [PokoTraqr calculator](https://www.pokotraqr.com/paradise/env-calculator)). Taking a Pokémon to another map lowers the old town's level, and more so the happier the Pokémon was ([GameWith 545345](https://gamewith.jp/pocoapokemon/545345)). The doubling has one numeric source, mogsetsu via PokoTraqr. The game's tips say only 「伝説、幻はレベルへの影響大」 (legendaries and mythicals weigh heavily on the level). Serebii, GameWith and Game8 JP say only "quicker" or "bigger" ([GameWith 545495](https://gamewith.jp/pocoapokemon/545495); [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)). GameWith's 伝説・幻 list matches the planner's **15 species exactly**, Jirachi, Phione and Volcanion included. Game8 JP's list has 14, without Jirachi ([GameWith 545495](https://gamewith.jp/pocoapokemon/545495); [Game8 JP 768035](https://game8.jp/pocoapokemon/768035)). Lugia and Ho-Oh 「街には住まない」 (don't live in town), so the doubling never reaches them.

Guides also list a rebuilt Pokémon Center, a paved road, completed requests and placed kits as ways to raise the level. Serebii says kits help "even if a Pokémon doesn't immediately live there" ([Serebii Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [GameWith 545345](https://gamewith.jp/pocoapokemon/545345)). GameWith and Game8 JP describe the road and requests as working **through** residents' comfort. ぼってぃ's reset rules out a large lasting flat bonus: a town that had long passed level 3, and so almost certainly had its Pokémon Center rebuilt, returned to a meter tracking resident points from about zero. Two rival models cite no tests and contradict both measured sources. Pokopia Island uses 0–8 points ÷ 8 plus variety and legendary bonuses ([Pokopia Island](https://pokopiaisland.com/tools/environment-calculator), search summary). WikiPokopia gives each biome its own metric ([WikiPokopia](https://wikipokopia.com/guides/environment-levels)).

## The planner's model gets the arithmetic right and the dislikes wrong

The planner, as described in its README's Comfort section and in `comfortOf`, `dislikesOf`, `CMF_RULE` and `townComfort` in `app.js`, already implements ぼってぃ's later variant almost exactly. It also places furniture and environment in close to the ranges ぽこポケ学会 measured. A built house's active area takes furniture from −4 to +3 levels relative to the house's base, and its environment reads only the house cells from −1 to +3. The environment model already counts a fire only when a Burn Pokémon lives near enough to light it, and a lamp that makes a dark-lover's home too bright already costs it the 2 environment points while filling a decoration slot. So that trade-off needs no new code. Rain putting out unroofed fires is not modelled. The table grades each rule against the evidence.

| App rule | Evidence | Verdict |
|---|---|---|
| Rest item it fits on 1, or 2 if a favourite | ぼってぃ's rest 0–2; 攻略大百科's "can't use smaller than itself" | **Keep.** The 1×1 / 2×1 / 2×2 size classes are the app's own mapping, so keep them editable |
| Toys and decorations 1 each, 2 for a favourite, up to 3 different, at most 2 of either | ぼってぃ's later 0–6 variant, inferred from observed 最高 cases | **Keep**, label as inferred. A larger true cap would rarely change a rank because 9 already means Awesome |
| Ideal habitat met 2 | ぼってぃ 0/2; ぽこポケ学会's 2nd factor | **Keep** |
| Favourite-flavour food 2, assumed given | 攻略大百科's per-Pokémon cap; ぼってぃ 0/1/2 | **Keep**, but say when a rank depends on food |
| 9+ Awesome, 6–8 Great, 4–5 Nice, else Average | Only model from play | **Keep** as the ceiling |
| Copies count once | ぽこポケ学会, the move-in kinds rule, the 2.0.0 note | **Keep**; also count repainted copies once |
| Favourites only through the trio | ぼってぃ and wish format; ぽこポケ学会 and Serebii ambiguous | **Keep** with no points; the ♥ chip already shows untagged favourites |
| House type adds nothing | Speed, space and insulation, no points | **Keep**; add a note |
| Grass types dislike every Lots of fire item, exempt if a favourite | Matches every guide example; no spawn conflict | **Keep**, labelled an estimate |
| Fire types dislike every Lots of water item plus Water, Ocean water, Muddy water, Hot-spring water and Waterfall tiles, exempt if a favourite | Guides name only water-related furniture and places; spawn data contradicts hot-spring water and the Modern sink | **Change** |
| A dislike in range → Iffy, "would refuse to move in and stays Iffy" | Refusal is well sourced; Iffy is not | **Change** |
| 10 / 5 / 2 / 1 / 0, ×2 for 15 legendaries | Two independent sources; GameWith's list | **Keep** |
| Thresholds 3 … 160 | ぼってぃ's measurement; PokoTraqr agrees except level 2 | **Keep**, level 2 at 3 |
| Each finished habitat counts its best-scoring Pokémon with no house | One resident per habitat, but the lottery chooses who | **Keep**, labelled best case |
| Story Pokémon counted normally | PokoTraqr: story Pokémon and Hoppip add 0 | **Change** |
| "Keeps the old level for a while" | ぼってぃ ~50 at level 5; mogsetsu ~75 % | **Extend** with drop lines |

### Recommended changes, in order of value

**1. Split the Fire-type water rule into tiers.** This is the only place the app contradicts game data. Today `DISLIKES` and the `WET` set make Torkoal (Mossy hot spring), Raboot (Open-air bath) and Magmortar (Mini kitchen) dislike the habitats the game spawns them into. At up to 10 points each, in a town that houses all three, those false flags can understate the total by **30 points, more than any single level band**. A three-tier list follows the sources:

| Tier | What goes in it | Planner behaviour |
|---|---|---|
| **Reported** | The Horsea fountain, and Water, Ocean water and Waterfall tiles in range. Grounds: Game8 JP's "place with water", GameWith's "waterside", Game8 EN's "near Spring Water", and the official 苦手なブロック | Hard warning |
| **Likely** | Items that hold or spray water: the Gyarados fountain, bathtubs, shower, sink, water basin, sprinkler, fire hydrant, humidifier, canoe, inflatable boat; Muddy water tiles | Soft "may dislike" note with no change to rank |
| **Excluded** | Hot-spring water and the Modern sink, both contradicted by spawns; drinks and food props (paper party cups, soda float, shaved ice, juice trio, table setting, teaware set); toilet, cleaning supplies, beach parasol, bottled ship, resort hammock, Mystic Water, Hoppip water bottle | No warning |

Keep the exemption for a Pokémon whose favourites include the trigger, which in the planner's data means Volcanion. It is logical, but no source states it.

**2. Relabel the dislike effect.** Score a home with a reported dislike in range at 0 and call it **"Won't move in"**, not Iffy. That matches every source on refusal, and 0 is what a homeless Pokémon scores anyway. For a Pokémon the plan already shows living there, add "if it arrives after move-in, comfort drops by an unknown amount and it can't reach Awesome". That follows ぽこポケ学会's first factor and ろぜ's one-rank Oddish drop. Rewrite the README's "it stays unhappy there" and the `cmfTip` and `CMF_HELP` text "stays Iffy" to match. Skip the dislike check for a Pokémon in its own spawn habitat, since the game evidently does.

**3. Score story Pokémon at 0, behind a setting.** Professor Tangrowth, Peakychu, Mosslax, Hoppip, Skiploom and Jumpluff are all in data.json and count today. The 0 rests only on PokoTraqr's line about mogsetsu's figures, and extending "Hoppip" to the whole line is a reading. Make it a default-on toggle with that caveat. Jirachi, an event entry that is also mythical, is the shakiest of the 15 doubled species, so note it.

**4. Show the drop line, not just the level.** Next to the Env. level tile, show the second row of the threshold table. Warn when a planned move or demolition would take a town below its drop line, not merely below T[L], and say that unbought stock and challenges for that level re-lock.

**5. Say when a rank depends on food or on noticing.** When pts − 2 falls into a lower band, the hint should say "Awesome once fed its favourite flavour, Great without", because nobody has shown that a never-fed Pokémon reaches 最高. Add a town-level note when more than about 25 residents live outside kit interiors. Undisplayed residents cannot notice new furniture, so their in-game rank lags the plan.

**6. Mark habitat residents as best case.** `townComfort` gives each finished habitat its best-scoring candidate. The real resident is whoever the lottery sent, and the lottery favours unmet, commoner species. Let the user pick who lives there, or show the habitat's points as a worst-to-best range.

**7. Smaller fixes.**

| Fix | Detail |
|---|---|
| Ditto's food | Ditto's flavour in data.json is the string "None", which `foodV = p.fl ? 2 : 0` treats as a favourite flavour worth 2 points; treat "None" as no flavour |
| Hint order | `cmfHint` asks for toys before the environment; ぽこポケ学会 ranks environment above the trio, and in points it is worth as much as a favourite rest item; order hints by points gained, then by ぽこポケ学会's order |
| Tag counts | data.json tags 79 Relaxation, 137 Toy and 224 Decoration items against Serebii's 79 / 148 / 229; diff the lists, since a missing tag silently costs 1–2 points |
| Rain and fires | When the plan's weather is rain, treat unroofed fire items outside kit interiors as out, and warn warm-lovers that rely on them; GameWith and Game8 JP both report the comfort loss, and a roof prevents it |
| Ditto's house | If the planner ever models Ditto's own house, use the measured rule: kinds counted up to 5 per tag and 13 in all, scored like a resident |
| Reachability | ぽこポケ学会 says items the Pokémon can't reach don't count; a later range check could drop items sealed behind walls |

## What stayed unread, and which six tests nobody has run

On 26 November 2026 I re-checked, from this environment, every host the research notes record as unreadable. The network proxy refused the connection outright (curl status 000) for each of the following:

| Group | Hosts |
|---|---|
| Official sites | pokemon.co.jp; pocoapokemon.jp, the official Japanese news and patch pages, so the patch text came from verbatim copies on GameWith and 攻略大百科; nintendo.com/jp |
| Social and video | Reddit, including u/mogsetsu's environment-level post; X, including あみにし's Japanese translation of that post and さびたコイル's display-cap thread; YouTube |
| Wikis | Pokémon Wiki (wiki.ポケモン.com); wikiwiki.jp |
| Japanese blogs and Q&A | Yahoo!知恵袋; Pokelog (lifematome.blog); gameranbu; kengomon; himahito |
| Fan tools and other sites | pokopiaisland.com; arahog-jp.github.io (ぽこあ施設診断); pokopiaguide; gamertw; pokopiacompanion; op.gg; toolz.gamepedia.jp |

Other sites answered with a refusal page. **Altema returned 403 (Access Denied), Bulbapedia its own 403, GameFAQs a Cloudflare 403 and The Games Wiki a Vercel 429 check.** Facts from these hosts appear above only where a search summary carried them, and they are marked as such.

The losses are specific. Without Reddit there is no record of how mogsetsu measured the ×2 for legendaries, the ~75 % hold or the level 2 = 1 value. Without Bulbapedia the disliked-flavour table and its Comfort level page stay as search snippets. Without YouTube, X and the official site there is no screenshot transcription of the in-game くらしのヒント, the refusal line for a dislike, or a wish line. Without Altema its "dislike reaction" claim cannot be checked.

Six in-game tests would settle most of what remains. None has been published.

| # | Test |
|---|---|
| 1 | Put Charmander next to a Modern sink, hot-spring water, paper party cups and a Horsea fountain in turn, and Bulbasaur next to an unlit campfire and lava. Record the move-in answer and the comfort rank each time |
| 2 | Place a second rest item, a fourth toy or decoration, and three toys with no decoration |
| 3 | Place an untagged favourite, such as a table or storage box, alone |
| 4 | Keep a Pokémon unfed and see whether it reaches 最高 |
| 5 | Score the same Pokémon with the same items in a habitat, a block house and a kit house |
| 6 | Read the meter before and after rebuilding a Pokémon Center, and after adding one Awesome legendary |

The first test alone would replace the most error-prone part of the planner's model. DLC Part 2, 「どきどきデコレーション」, needs Ver. 3.0.0 and arrives on 9 December ([攻略大百科 アップデート一覧](https://gamepedia.jp/pocoapokemon/archives/3507)). Its name suggests decoration rules may change, so every number here should be re-checked then.

## Conclusion

The research moves the uncertainty in the planner's comfort model. The points table and the rank mapping look fragile because they rest on one player's "feel". In practice they are the most stable part: two Japanese sources agree on the factors, the firm observations match the arithmetic, and a wrong weight shifts a rank by one step at most. The dislike rule looks principled because it reuses the favourite categories, and it is the part that fails. It extends a few guide examples into a 30-item category that no source names, and the game's own spawn tables contradict it. The planner already holds the best cheap test for any dislike rule: no rule should make a species dislike a habitat the game spawns it into. That check found all three conflicts in seconds, and it should run against every future change to `DISLIKES`.

Comfort is also an event-driven state, not a formula over time, and that changes what the planner should promise. A layout sets a ceiling. Noticing, one wish a day and food decide when the Pokémon reaches it. Re-homing, removal and rain are the only documented ways down. The most useful thing the app can add is not a finer score but warnings that catch the costly events before they happen. The four to show are: "won't move in", "below the drop line", "depends on food" and "won't be noticed in a crowded town".

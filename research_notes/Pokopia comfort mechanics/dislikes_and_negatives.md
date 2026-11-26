# Pokopia dislikes (苦手なもの / ニガテなもの) and other things that lower or block comfort

Researched 2026-11-26, game at Ver. 2.0.1. Labels on every finding: **official** (Nintendo/The Pokémon Company text or in-game text), **community-tested** (a player measured it; test linked), **guide** (a guide states it without showing a test), **unverified** (one anecdote, generated-looking guide text, or speculation). "(search summary)" means the page was blocked to curl and only the search engine's summary of it was read. "Cross-check" means I compared spawn data on Serebii's Habitat Dex against the planner's rule myself. Japanese terms: すみごこち = comfort, すみか = home, 生息地 = habitat, びみょう = Iffy, ふつう = Average, ちょっといい感じ = Nice, めちゃイイ感じ = Great, 最高 = Awesome, 炎を感じる = the "Lots of fire" favourite category, 水を感じる = "Lots of water".

Sources that could not be read directly: pocoapokemon.jp (the official news pages), Bulbapedia, Altema, Pokelog (lifematome.blog), Yahoo!知恵袋, The Games Wiki (behind a Vercel bot check), GameFAQs boards (behind a Cloudflare check), toolz.gamepedia.jp. The official Japanese patch text was read from verbatim copies on GameWith and 攻略大百科.

## 1. What decides a dislike: type, item, favourite category, block, or environment?

### Takeaway
Nobody has published the rule. The official text names only one group, 「水が苦手なポケモン」 ("Pokémon that are bad with water"). It also confirms that **blocks** can be disliked (「ポケモンが苦手なブロック」), so dislikes are not limited to furniture. Every concrete example in the guides follows two type pairs: Grass types and fire-related furniture, and Fire types and water (furniture, waterside spots, water areas). No guide or test ties dislikes to the 「炎を感じる」/「水を感じる」 favourite categories, and Serebii's spawn data contradicts a blanket "every Lots-of-water item and every water tile" rule. Fire-type Torkoal and Raboot spawn into hot-spring habitats, and Fire-type Magmortar spawns into the Mini kitchen, which requires a Modern sink (a Lots-of-water item).

### Cited Findings
**Official text**
- **Official, Ver. 2.0.0 (5 Aug 2026), Japanese:** 「水が苦手なポケモンが、水面の「うきくさ」と「うきくさのはな」の上を移動できないことがある。」 (Pokémon that are bad with water could sometimes not walk over duckweed or flowering duckweed on the water.) The English notes render this as "Pokémon that dislike water". This is the only named dislike group in official text, and it is used for movement, not comfort. — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548); [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml); official [更新データ（Ver.2.0.0）](https://www.pocoapokemon.jp/ja/news/136/) (search summary)
- **Official, Ver. 1.1.0 (9–10 June 2026), Japanese:** 「特定の状況で、ポケモンが苦手なブロックを撤去しても、「すみごこち」が上がらないことがある。」 (In some situations, removing a **block** the Pokémon dislikes did not raise its comfort.) The English notes say "even after removing items that Pokémon dislike, their comfort level does not increase". The Japanese original says block (ブロック), not item. — [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086); [攻略大百科 Ver.1.1.0](https://gamepedia.jp/pocoapokemon/archives/5597); English: [Game8 EN 1.1.0](https://game8.co/games/Pokemon-Pokopia/archives/605000), [Nintendo Life](https://www.nintendolife.com/news/2026/06/pokemon-pokopia-updated-to-version-1-1-0-includes-improvements-and-fixes); official [更新データ（Ver.1.1.0）](https://www.pocoapokemon.jp/ja/news/89/) (search summary)
- **Official, Ver. 1.1.0:** 「家具「ふろばのいす」「いしのだんろ」の「すみごこち」に対する設定を、より自然なものに修正しました。」 (The comfort settings of the waterproof seat and stone fireplace were made "more natural".) Both are rest (Relaxation) items in the planner data, and the stone fireplace is also a fire item. The note does not say what changed. — [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086); [Game8 EN 1.1.0](https://game8.co/games/Pokemon-Pokopia/archives/605000)
- **Official, in-game くらしのヒント (life tips), as quoted by a tester:** the minus factors are 「ニガテなものを配置する」 (placing things it is bad with) and an unpaved path to the Pokémon Center. The tester guessed that dislikes are "an environment factor, the opposite of its favourite environment: brightness, temperature, humidity?". That guess is theirs, not the game's. — [ぼってぃ: 環境レベルを検証する](https://note.com/bottical/n/nee0a7bbcf440) (2026-03-16, Ver. 1.0.x)
- **Datamine, absence of evidence:** PokeOS's datamine lists "Pokémon Preferences: specialties, favorite flavor, ideal habitat and favorite things for every Pokémon, taken from the game data". It names no dislike field. — [PokeOS datamine quick links](https://www.pokeos.com/news/2010/POK%C3%89MON+POKOPIA+DATAMINE+QUICK+LINKS:) (2026-10-26)

**Guide examples (all follow the two type pairs)**
- **Guide, 攻略大百科 (updated 2026-09-01):** 「ポケモンのすみかの近くにニガテなものがあるとすみごこちが低下してしまいます。一例としてフシギダネなど、くさタイプポケモンの近くにたきびなどの炎に関する家具があったり、ヒトカゲなどのほのおタイプポケモンの近くにタッツーふんすいなど水に関する家具があることで低下してしまう」 (Grass types like Bulbasaur near fire-related furniture such as a campfire, and Fire types like Charmander near water-related furniture such as the Horsea fountain, lose comfort.) It says "fire-related / water-related furniture", not the favourite-category names. — [攻略大百科: すみごこち](https://gamepedia.jp/pocoapokemon/archives/3509)
- **Guide, ぽこポケ学会, framed as tested:** the top comfort factor is 「嫌いな環境が認識可能範囲にない(草ポケモンの近くに炎など)」 (no disliked environment in the recognition range, e.g. fire near a Grass Pokémon). They word it as an environment, not an item. — [ぽこポケ学会: 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- **Guide, Game8 JP:** 「例として、「ヒトカゲ」は水のある場所には引っ越しできません。」 (Charmander can't move to a place with water: a place, not an item.) — [Game8 JP 767983](https://game8.jp/pocoapokemon/767983)
- **Guide, GameWith:** 「ヒトモシのようなほのおタイプのポケモンは水辺付近の生息地を嫌がります」 (Fire types like Litwick dislike habitats near the waterside). This is terrain again. — [GameWith 545344](https://gamewith.jp/pocoapokemon/545344)
- **Guide, Game8 EN:** "This is often the case if you build the new house or habitat by certain terrain. For example, a Charmander would want to steer clear of a house built near Spring Water." The Games Wiki gives the same Charmander example (search summary). — [Game8 EN: How to Move Houses](https://game8.co/games/Pokemon-Pokopia/archives/585496); [The Games Wiki: Move Pokémon Between Areas](https://thegameswiki.com/pokopia/wiki/how-to-move-pokemon-between-areas) (search summary)
- **Guide, Game8 EN:** "If a Pokemon has an item that they dislike in the house that you assign them, they will refuse to move in." No example is given. — [Game8 EN: How to Increase Comfort Level](https://game8.co/games/Pokemon-Pokopia/archives/583142)

**Wider claims (unverified)**
- **Bulbapedia (search summary):** removing things a Pokémon likes, or "adding objects with characteristics it does not like", may lower comfort. The wording is close to a category model, but no list or test is visible. Its Tips page has a "Things Pokémon Dislike" heading that says every Pokémon dislikes certain things. — [Bulbapedia: Comfort level](https://bulbapedia.bulbagarden.net/wiki/Comfort_level); [Bulbapedia: Tips and Tricks](https://bulbapedia.bulbagarden.net/wiki/Tips_and_Tricks) (search summaries)
- **Guide, one note.com post (Splatoonブキ研究所, 2026-04-02), a town-design essay rather than a dislike test:**
  - Warm-lovers (mostly Fire) teleport away when they enter water or a hot spring, prefer homes with fire, and are weak to rain.
  - Warm-lovers "can't coexist" with humid- or cool-lovers.
  - Humid-lovers (mostly Water) 「炎が近くにあると嫌がる」 (dislike fire nearby).
  - Dry-lovers (many fossils) 「潤った環境が苦手」 (are bad with humid surroundings).
  - Dark-lovers can't coexist with bright-lovers.
  - These claims are wider than the type pairs above, and there is no test behind them. — [ぽこあポケモン 街づくり論](https://note.com/splatoonweapon/n/ncb41c8dfc076)
- **One player's blog (2026-03-22):** Fire types seemed to have worse comfort with a ティーセット ("tea set") nearby, and campfires or braziers fixed it. "seemed" (悪そうでした) is the author's word. Which item ティーセット is (Tea set or Teaware set; only the Teaware set is in Lots of water in the planner data) is unclear. — [narunikki](https://narunikki.hatenablog.com/entry/2026/03/22/120000)

**Behaviour toward water**
- **Guide (search summary):** Charmander detours around water and, if dropped in, escapes to land at once. — [Pokelog: 水が苦手なヒトカゲを水に落とすと](https://lifematome.blog/pokopoke-hitokage-mizu/) (search summary)

**Cross-check against Serebii's spawn data**
- **Mossy hot spring** (Moss ×4 + Hot-spring water ×2) spawns only **Torkoal**, a Fire type. Flavour text: "Soak up the calming atmosphere as you soak in warm water." — [Serebii: Mossy hot spring](https://www.serebii.net/pokemonpokopia/habitatdex/mossyhotspring.shtml)
- **Open-air bath** (Hot-spring spout + Hot-spring water) spawns only **Raboot**, a Fire type. — [Serebii: Open-air bath](https://www.serebii.net/pokemonpokopia/habitatdex/open-airbath.shtml)
- **Mini kitchen** (Kitchen table, Cooking stove, frying pan, **Modern sink**) spawns **Magmortar**, a Fire type whose only "Lots of" favourite is fire. — [Serebii: Mini kitchen](https://www.serebii.net/pokemonpokopia/habitatdex/minikitchen.shtml)
- **Illuminated waterfall** (Torch ×2 + Water + Waterfall) spawns **Gyarados**, a Water type that likes humid surroundings. This contradicts the note.com claim that humid-lovers dislike fire nearby. — [Serebii: Illuminated waterfall](https://www.serebii.net/pokemonpokopia/habitatdex/illuminatedwaterfall.shtml)
- **What I checked:** every habitat in the planner's data for a Grass type spawning with a Lots-of-fire item or lava. I found **none**, which fits a Grass–fire dislike.

### Inferences
- The two type pairs (Grass–fire, Fire–water) are the only dislikes with more than one independent source. I found no example for Ice, Ghost/Dark versus light, Electric versus water, Bug versus fire, or Water versus fire.
- The official 「苦手なブロック」 wording shows that terrain blocks can be disliked. That supports counting water terrain for Fire types, and makes a dislike list limited to furniture categories incomplete.
- The spawn data suggests at least one of these:
  - hot-spring water is not "water" for this dislike;
  - the Modern sink is not a disliked water item;
  - spawning ignores dislikes.
- Any of these breaks the planner's "Fire types dislike every Lots-of-water item and every water tile, hot-spring water included" rule for real game layouts.
- The Lots-of-water category holds many items that are unlikely to be "water" in the guides' sense: paper party cups, soda float, shaved ice, table setting, juice trio, toilet, cleaning supplies, beach parasol, bottled ship and resort hammock. The guides' only named water item is the Horsea fountain.
- Grass versus fire has no spawn contradiction, and the guides' only named fire item is the campfire (たきび).

### Gaps
- No datamined dislike table, no full in-game list, and no player test that places one item at a time next to a Grass or Fire type and reads the comfort result.
- Unknown whether the trigger is the Pokémon's type, a per-species flag (for example a "bad with water" flag, as the 2.0.0 note implies), or the ideal habitat.
- Unknown which blocks count as 苦手なブロック: water, ice, magma or fire.

## 2. Where dislikes show in the game, and what the patch notes imply

### Takeaway
The Pokédex shows favourites and the ideal habitat, not dislikes. Players learn of dislikes from refusals, a "disliked" reaction when an item is placed, and the comfort wish. Nobody has published the wording of the refusal line. The Ver. 2.0.0 request fix says 好みではない ("not to its taste"), not ニガテ, so it does not prove an item-level dislike flag.

### Cited Findings
- **Guide, Game8 JP per-Pokémon pages (checked Charmander, Charmeleon, Charizard, Litwick, Piplup and others):** they show 好きな環境 (ideal habitat) and 好きなもの (favourites), with no dislike field. — [Game8 JP ヒトカゲ](https://game8.jp/pocoapokemon/767895); [Game8 JP ヒトモシ](https://game8.jp/pocoapokemon/768322)
- **Guide, Game8 EN and GameWith:** the place to check is the Pokédex for "specific favorites and ideal environment" (Game8 EN), and 「好みは図鑑から確認できる」 (preferences can be checked in the Pokédex, GameWith). Neither mentions dislikes there. — [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142); [GameWith すみごこち](https://gamewith.jp/pocoapokemon/545675)
- **Unverified (search summary):** one site says the Pokédex or summary shows each Pokémon's disliked flavour. This is not corroborated by any Japanese guide. — [PokopiaWiki flavors](https://www.pokopiawiki.com/flavors) (search summary)
- **Guide, Altema (search summary):** 「苦手な家具を設置すると、苦手なリアクションをしたり要望に追加されるため、家具を設置したら反応を確認しましょう」 (place a disliked item and the Pokémon shows a "disliked" reaction or it is added to its wishes, so check its reaction after placing). This is the only described in-game signal besides refusal. — [Altema: すみごこち](https://altema.jp/pocoapokemon/sumigogoti) (search summary)
- **Guide (search summary):** find the cause by an "isolation test": remove all furniture around the Pokémon and re-place the requested items one at a time while watching its reaction. — [Pokelog: すみごこち](https://lifematome.blog/pokopoke-sumigokochi-merit/) (search summary)
- **Guide, Nintendo Life:** asking 「すみごこち どう？」 gives a hint highlighted in orange, and that hint matches the Pokédex entry. A disliked thing as a hint is not mentioned. — [Nintendo Life: comfort](https://www.nintendolife.com/guides/pokemon-pokopia-how-to-raise-comfort-levels)
- **Official, Ver. 2.0.0, Japanese:** 「ポケモンからの「おねがいごと」で、そのポケモンが好みではないアイテムを要求されることがある。」 (A Pokémon's request could ask for an item not to its taste.) The English notes say "items that the requesting Pokémon actually dislikes". The same patch's fix list also has "In certain situations, it may be unclear why actions such as building or relocation cannot be performed." — [攻略大百科 Ver.2.0.0](https://gamepedia.jp/pocoapokemon/archives/5548); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide (search summaries):** the English move prompt is "Would you like to move here?" / "Wanna move in here?". A Pokémon with an unfinished request says it "still has unfinished business". No source quotes the line for a dislike refusal. — [Game8 EN: Move Pokémon Between Areas](https://game8.co/games/Pokemon-Pokopia/archives/585770); [Vandal](https://vandal.elespanol.com/en/pokemon-pokopia/pokemon-pokopia-how-to-move-pokemon-between-different-areas.html) (search summary)

### Inferences
- 好みではない reads as "not among its likes", a weaker idea than ニガテ. So the 2.0.0 fix is probably about requests asking for non-favourite items, not about hidden disliked items. The English "actually dislikes" overstates the original.
- Only the Ver. 1.1.0 「苦手なブロック」 line and the 2.0.0 「水が苦手なポケモン」 line show dislikes as real game state.
- The 2.0.0 fix that made relocation-failure reasons clearer may mean the game now says why a move fails. No one has quoted it.

### Gaps
- The exact Japanese and English refusal line for a dislike, and whether it names the disliked thing.
- Whether the comfort wish can be "remove X", or a dislike shows only as a reaction.

## 3. Range: where a disliked thing is detected, and what counts

### Takeaway
No one has measured how far away a disliked thing still counts. ぽこポケ学会 places it in the same 認識可能範囲 as furniture, door −4 to +3 levels. Light and other environment items use a tighter range: inside the house and the door's column, floor −1 to +3. The guides' wording runs from 「近く」 (near) to 「水のある場所」 (a place with water) to "in the house". Water terrain probably counts for Fire types. Lava, unlit campfires and hot-spring water are untested.

### Cited Findings
- **Community-tested, ぽこポケ学会:**
  - Furniture that affects comfort is recognised within the range shown as a white dotted line with the R stick: 「扉から-4マス～+3マスまでが認識範囲」 (door −4 to +3).
  - An item on the ground counts if the door is within 5 tiles of the surface.
  - 「ポケモンがアクセス不可能だと、住心地に影響を与えない」: an item the Pokémon can't reach doesn't affect comfort.
  - Light sources and other environment items use a different range: 「家の中とドアの上下のみ。床面-1～+3マス」 (only inside the house and above or below the door, floor −1 to +3; marked "検証不十分", under-tested).
  - Its top comfort factor puts the disliked environment in the 認識可能範囲.
  - [ぽこポケ学会: 家と住み心地](https://kyu49.github.io/Pokopia/house/)
- **Guide, Game8 JP:** 「家に住んでいるポケモンのすみごこちは、家の外の環境を整えても変化しなくなります」 (a Pokémon living in a house stops reacting to the outdoor environment). — [Game8 JP 767983](https://game8.jp/pocoapokemon/767983)
- **Guide, wording by site:**
  - Serebii: "near to their habitat".
  - 攻略大百科: 「すみかの近く」.
  - GameWith: 「移動先の生息地の近くに苦手なもの」 (near the destination habitat).
  - Game8 JP: 「水のある場所」.
  - Game8 EN: "in the house" and "a house built near Spring Water".
  - — [Serebii: Environment & Comfy Level](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml); [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [GameWith 545344](https://gamewith.jp/pocoapokemon/545344); [Game8 JP 767983](https://game8.jp/pocoapokemon/767983); [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142); [Game8 EN 585496](https://game8.co/games/Pokemon-Pokopia/archives/585496)
- **Official, Ver. 1.1.0:** a disliked **block** exists (see section 1). Which blocks it covers is not stated. — [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086)
- **Guide, water and fire terrain:** "Fire is extinguished on contact with any non-Lava water"; "Humidity rises when Fresh Water or Hot Spring Water is present in an area." — [wikipokopia: Water Mechanics](https://wikipokopia.com/guides/water)
- **Cross-check:** Torkoal and Raboot spawn into habitats built on hot-spring water (see section 1).

### Inferences
- For a planner, the furniture range (door −4/+3, or the habitat's dotted area) is the best-supported range to check for disliked things. A house probably shields its residents from outdoor water and fire if Game8's "outdoor environment doesn't matter" applies to dislikes too, which no one has tested.
- An item behind a wall or across water that the Pokémon can't reach probably doesn't count either way, given ぽこポケ学会's accessibility rule.
- Hot-spring water probably should not count as disliked water, given the Torkoal and Raboot spawns.

### Gaps
- Distances: nobody has tested "fire 5 tiles away" against "fire 1 tile away".
- Whether an unlit campfire, a fire put out by rain, Charcoal or the Flame Orb counts as fire. Nothing found.
- Whether lava counts as fire for Grass types. Nothing found. No Grass type spawns at the lava habitats.
- Whether sea, river, pond, muddy water, waterfalls and rain count as water for Fire types. Only "a place with water" and "waterside" are reported.

## 4. Effects of a disliked thing: refuse move-in, lower comfort, or both?

### Takeaway
Both are reported, by different guides. Every source agrees that it blocks moving into a house (Game8 JP and EN) or a habitat (GameWith). Comfort falls when one is near a home (攻略大百科, Serebii, the in-game tips), and removing it should let comfort rise again (implied by the Ver. 1.1.0 fix). No source says it caps comfort at Iffy, drops it by a set number of ranks, or makes an existing resident leave, and no source covers spawning.

### Cited Findings
- **Guide, Game8 JP:** 「引っ越し先のすみかにポケモンの苦手なものがあると引っ越しを拒否されます」 (a destination with something it dislikes is refused). — [Game8 JP 767983](https://game8.jp/pocoapokemon/767983)
- **Guide, GameWith:** the conditions table gives "家: 住めるポケモンの空きがある・家具が3種類以上" (house: a free place, 3+ furniture kinds) and "生息地: 他のポケモンのすみかではない・苦手なものが近くにない" (habitat: not someone else's home, nothing disliked nearby). So GameWith lists the dislike check only for habitats. — [GameWith 545344](https://gamewith.jp/pocoapokemon/545344)
- **Guide, Game8 EN:** a disliked item in the assigned house makes it refuse to move in. — [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142)
- **Guide:** comfort falls when the disliked thing is nearby. 攻略大百科: 「すみごこちが低下してしまいます」. Serebii: "Their Comfort level will decrease if you put things they dislike near to their habitat." — [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [Serebii](https://www.serebii.net/pokemonpokopia/environmentlevel.shtml)
- **Official, in-game tips (via ぼってぃ):** placing a disliked thing is a minus factor. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- **Official, Ver. 1.1.0:** removing a disliked block is meant to raise comfort; the bug was that it sometimes didn't. — [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086)
- **Community-tested ranking, ぽこポケ学会:** having no disliked environment in range is the most important factor for 最高, ranked above the liked environment. — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Community hypothesis, ぼってぃ:** in their points model 「びみょう：マイナス？」 (Iffy = a negative total?). They never measured a dislike directly. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- **Guide, wikipokopia:** Iffy means "Check for missing food, wrong habitat type, or unwanted items nearby." — [wikipokopia: Friendship & Comfort](https://wikipokopia.com/guides/friendship)
- **Guide, Game8 EN:** "If their new home is suitable for them, they will agree to move in." "Pokemon may refuse to move if the habitat or house is not to their liking … remove items or furniture that they dislike or choose an area that is more suitable." — [Game8 EN 585770](https://game8.co/games/Pokemon-Pokopia/archives/585770)
- **Guide, evictions without dislikes:**
  - Game8 JP: a house that falls below 3 furniture kinds stops being a house and its residents lose their home.
  - The Games Wiki (search summary): a dwelling missing a door or wall forces its residents out.
  - Ver. 2.0.0: a Pokémon whose habitat is destroyed moves back if the same habitat is rebuilt nearby.
  - No source says a disliked thing evicts anyone.
  - — [Game8 JP 模様替え](https://game8.jp/pocoapokemon/769142); [The Games Wiki: Dwellings](https://thegameswiki.com/pokopia/wiki/dwellings-and-houses) (search summary); [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)

### Inferences
- A planner should treat a dislike in range as both "would refuse to move in" and "lowers comfort". Showing it as "lowers comfort (amount unknown)" is better supported than "stays Iffy".
- Since a Fire type spawns into a hot-spring habitat, a dislike evidently doesn't keep that Pokémon from spawning there, or hot-spring water isn't disliked at all.

### Gaps
- Size of the drop: one rank, to Iffy, or a cap below Awesome? Untested.
- Whether adding a disliked thing to an occupied home lowers comfort at once or only when the Pokémon notices it, as other changes do.
- Whether a resident ever leaves or becomes homeless because of a disliked thing. Nothing found.
- Whether a habitat with a disliked thing nearby stops spawning that Pokémon. Nothing found.

## 5. Other things that lower or block comfort

### Takeaway
Firm blockers are a house with fewer than 3 furniture kinds, a home too small for the Pokémon, an occupied habitat and an unfinished story request. Reported comfort-lowering factors are:
- hunger;
- removed or broken furniture;
- fires put out by rain (for warm-lovers);
- rain making a dry-lover's surroundings humid;
- an unpaved road to the Pokémon Center;
- moving it to a new home, which resets its comfort.

None has a measured size. No source shows a crowding, housemate, time-of-day or disliked-flavour effect on comfort.

### Cited Findings
**Blockers**
- **Guide:**
  - Without 3 different furniture kinds, 「ここに おひっこしする？」 is refused.
  - Big Pokémon such as Charizard and Suicune can't live in small houses.
  - A Pokémon can't use a bed or chair smaller than itself (「自身より小さいベッドやイスを使うことはできません」).
  - — [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509)
- **Guide, Game8 EN:** some Pokémon refuse to leave their area because they "still have unfinished business" (an open request). — [Game8 EN 585770](https://game8.co/games/Pokemon-Pokopia/archives/585770)
- **Community-tested, ぽこポケ学会:**
  - "(引っ越し時のみ)3種類の異なる家具" (3 kinds is checked only at move-in).
  - Game8 JP warns that a house dropping below 3 stops being a house.
  - — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/); [Game8 JP 模様替え](https://game8.jp/pocoapokemon/769142)

**Hunger**
- **Community-tested, ぽこポケ学会:**
  - 「お腹が空いていない」 (not hungry) is the 3rd most important factor for 最高.
  - A hungry Pokémon's daily wish is always food, so feed it before asking.
  - — [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
- **Guide, Nintendo Life:** "Pokémon who are just Iffy are mainly hungry and could do with some food." — [Nintendo Life](https://www.nintendolife.com/guides/pokemon-pokopia-how-to-raise-comfort-levels)

**Furniture removed, broken or extinguished**
- **Official, Ver. 2.0.0:** "Pokémon that are sad because furniture was removed will now notice more quickly when the same furniture is replaced." — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Guide, GameWith:**
  - 「ポケモンのすみかやその近くの家具を撤去するとすみごこちが下がり」 (removing a home or nearby furniture lowers comfort).
  - 「雨でたきびなどの火が消えたり、乾燥が好きなポケモンの周囲がうるおうとすみごこちが下がる場合があります」 (rain putting out campfires, or making a dry-lover's surroundings humid, can lower comfort; build a roof).
  - — [GameWith 環境レベル](https://gamewith.jp/pocoapokemon/545345)
- **Guide, Game8 JP:**
  - Comfort items or objects left broken lower comfort.
  - Rain can put out outdoor fires, and 「火が消えるとすみごこちが下がる場合がある」 (a fire going out can lower comfort, for warm-lovers); put a roof over fire objects.
  - While it rains, humid-lovers' comfort rises.
  - — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551); [Game8 JP うるおい](https://game8.jp/pocoapokemon/769398)
- **Official, Ver. 2.0.0:** "Certain roof items now block water." — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)

**Unpaved road to the Pokémon Center**
- **Official, in-game tips (via ぼってぃ):** an unpaved road is a minus factor. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- **Guide:** paving it helps. — [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [GameWith すみごこち](https://gamewith.jp/pocoapokemon/545675)
- **Community-tested, ぼってぃ:** fully blocking the path did not change an ふつう Pokémon's rank. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)

**Disliked environment (the opposite of the ideal)**
- **Community-tested, ぼってぃ (Ver. 1.0.x):** none of these dropped the rank:
  - moving a Pokémon to a bright spot;
  - lighting a dark-lover's room with mushroom lamps until it complained (「拷問部屋みたいな環境」);
  - walling an ふつう Torchic's home in ice;
  - putting a ちょっといい感じ Machoke in plain grass and making its room the dark it dislikes.
  - The Machoke stayed ちょっといい感じ and the others ふつう. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- **Guide, Game8 JP:** environment requests such as "too bright" or "too dark" are easy and raise comfort when solved. — [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)
- **Official, Ver. 1.1.0 fixes:** "a Pokémon's active time may not increase even when the brightness matches their preference" (brightness changes activity time), and "Pokémon may comment that it has become darker or brighter even when no change was made." — [Game8 EN 1.1.0](https://game8.co/games/Pokemon-Pokopia/archives/605000)

**Moving a Pokémon**
- **Guide, 攻略大百科's own note.com post (2026-04-03):** 「すみかを移動すると、すみごこちが一旦リセットされる」 (moving a Pokémon's home resets its comfort for a while). After a layout change the author's Environment Level dropped, and it recovered once housemates were regrouped with their compatibility tool. — [攻略大百科 note](https://note.com/gamepedia/n/ndbefd701f038)
- **Guide:** taking a Pokémon to another map lowers that town's Environment Level, more so the higher its comfort. — [GameWith 環境レベル](https://gamewith.jp/pocoapokemon/545345); [Game8 JP 767551](https://game8.jp/pocoapokemon/767551)

**Crowding and housemates**
- **Guide:**
  - About 25 Pokémon are shown per area.
  - Habitats placed close together can stop the wanted one spawning.
  - There is no comfort penalty for crowding in any source.
  - — [攻略大百科: ポケモンが来ないとき](https://gamepedia.jp/pocoapokemon/archives/3417)
- **Unverified, housemates:**
  - A Yahoo!知恵袋 answer only guesses that a neighbour's home environment, or furniture temperature, may cancel out a fulfilled wish (search summary).
  - Fan roommate tools rank shared favourites. pokopiamap says no in-game roommate rule is verified.
  - — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13326948623) (search summary); [pokopiamap Roommate Matchmaker](https://pokopiamap.com/roommate-matchmaker)

**Disliked flavour**
- **Unverified, search summaries only:**
  - Bulbapedia's Flavor page says every species has one liked and one disliked flavour, and is neutral to the other four. Examples: Bulbasaur and Squirtle dislike Dry, Charmander and Charmeleon dislike Bitter, Venusaur dislikes Spicy.
  - PokopiaWiki says the disliked flavour gives "minimal to no bonding progress".
  - No Japanese guide mentions a disliked flavour. Game8 JP's flavour page lists only liked flavours and says no Pokémon likes plain food.
  - — [Bulbapedia: Flavor (Pokopia)](https://bulbapedia.bulbagarden.net/wiki/Flavor_(Pokopia)); [PokopiaWiki](https://www.pokopiawiki.com/flavors) (search summaries); [Game8 JP 味](https://game8.jp/pocoapokemon/771031)

**Other claims**
- **Unverified, mini-games:** a liked game gives double comfort points and a disliked one half. — [pokopia.center (search summary)](https://pokopia.center/posts/pokopia-mini-games-guide-2026/)
- **Unverified, noise:** a speaker near a Pokémon that likes quiet applies a hidden minus. The source is unknown; it came only in a search summary.

**Time of day and weather**
- **Community-tested, ぼってぃ:** listed as untested: 「マップ全体の朝、昼、晩と天候（晴れ、雨）がすみかの環境に影響するのか」 (does time of day or weather affect a home's environment?). — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)

### Inferences
- The planner can safely flag three blockers: the 3-kind rule, house size, and rest-item size (the Pokémon can't use a smaller bed or chair).
- Rain is the one weather effect with sources. An outdoor fire without a roof can go out and cost a warm-lover comfort, and rain can make a dry-lover's surroundings humid.
- A disliked flavour is plausible, given Bulbapedia's per-species table, but it is unconfirmed. It would affect gifts and friendship, not a layout.

### Gaps
- No effect sizes for any of these, and no tests of crowding, housemate clashes, time of day or temperature from furniture.
- Whether the "comfort resets when moved" claim means a full reset to Iffy. It conflicts with ぼってぃ's observation that a home assigned from homeless reached 最高 in one day.

## 6. Is there a floor on falling comfort?

### Takeaway
Probably a soft one. In ぼってぃ's tests, Pokémon that had reached ふつう or better did not fall through environment and path changes. A newcomer started at びみょう. Disliked things themselves were never part of the floor test.

### Cited Findings
- **Community-tested, ぼってぃ (2026-03-16):**
  - Pichu at ふつう, after a bright spot, a blocked path and a room lit with mushroom lamps: 「ふつうのままだ」.
  - Torchic at ふつう with its home walled in ice, and with a reload: still ふつう.
  - Machoke at ちょっといい感じ moved to plain grass in a dark room: still ちょっといい感じ.
  - Hypotheses: once ふつう is reached it won't go below; or there are hidden accumulated points.
  - A newly homed Swirlix (パピモッチ) started at びみょう, which the author says breaks the floor hypothesis for new Pokémon.
  - — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)
- **Guide, Nintendo Life:** "Average This is usually what your Pokémon will start out as." — [Nintendo Life](https://www.nintendolife.com/guides/pokemon-pokopia-how-to-raise-comfort-levels)
- **Official, Ver. 2.0.0:** removed furniture makes Pokémon "sad", so comfort can fall from removal. — [Serebii patch notes](https://www.serebii.net/pokemonpokopia/patch.shtml)
- **Community-tested, ぼってぃ (Environment Level, not comfort):** the level is held with slack when points fall: Lv5 was kept down to about 50 points after dropping below 52. — [ぼってぃ](https://note.com/bottical/n/nee0a7bbcf440)

### Inferences
- Environment mismatches seem not to push a settled resident below ふつう. Furniture removal and disliked things are reported to lower comfort, though no test shows how far.

### Gaps
- No test of a disliked item placed next to a settled resident, and none after Ver. 1.1.0, when the 「苦手なブロック」 fix landed.

## 7. Verdict on the planner's current dislike model

### Takeaway
The two pairs match every guide example: Grass types dislike fire, Fire types dislike water. Three parts of the model have no source behind them and partly conflict with game data:
- treating every item in the Lots of fire / Lots of water categories as the trigger;
- counting all water tiles, hot-spring water included;
- "stays Iffy".

### Cited Findings
- **Supported:**
  - Grass and fire: Bulbasaur + campfire, and "fire near a Grass Pokémon". — [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/)
  - Fire and water: Charmander + Horsea fountain; Charmander + a place with water; Litwick + waterside habitats; Charmander near "Spring Water". — [攻略大百科 3509](https://gamepedia.jp/pocoapokemon/archives/3509); [Game8 JP 767983](https://game8.jp/pocoapokemon/767983); [GameWith 545344](https://gamewith.jp/pocoapokemon/545344); [Game8 EN 585496](https://game8.co/games/Pokemon-Pokopia/archives/585496)
  - Refusing to move in. — same sources plus [Game8 EN 583142](https://game8.co/games/Pokemon-Pokopia/archives/583142)
- **Partly supported:** terrain counts. Officially, a disliked block exists, and the guides speak of water "places" and the "waterside". — [GameWith アップデート](https://gamewith.jp/pocoapokemon/547086)
- **Contradicted by spawn data:**
  - A Modern sink (Lots of water) is a required item in Magmortar's spawn habitat.
  - Hot-spring water is required in Torkoal's and Raboot's spawn habitats.
  - — [Serebii: Mini kitchen](https://www.serebii.net/pokemonpokopia/habitatdex/minikitchen.shtml); [Serebii: Mossy hot spring](https://www.serebii.net/pokemonpokopia/habitatdex/mossyhotspring.shtml); [Serebii: Open-air bath](https://www.serebii.net/pokemonpokopia/habitatdex/open-airbath.shtml)
- **Unsourced:**
  - Using the favourite category as the trigger. The guides say 「炎に関する家具」 / 「水に関する家具」 / 水のある場所 and never name a category.
  - The exemption for a Pokémon that likes the category, such as Volcanion. It is logical, but nothing was found.
  - "Stays Iffy": the sources say only "lowers comfort".
- **Possibly missing (guide or unverified only):**
  - Dry-lovers disliking humidity. GameWith ties it to rain, and the note.com essay says it outright.
  - Humid-lovers disliking fire. The note.com essay says so; Gyarados spawning beside torches contradicts it.
  - A disliked food flavour (Bulbapedia, search summary).
  - — [GameWith 545345](https://gamewith.jp/pocoapokemon/545345); [note.com 街づくり論](https://note.com/splatoonweapon/n/ncb41c8dfc076); [Serebii: Illuminated waterfall](https://www.serebii.net/pokemonpokopia/habitatdex/illuminatedwaterfall.shtml)

### Inferences
- **Narrow the water list for Fire types.** Count fountains, sinks, bathtubs, showers, the water basin, sprinklers and similar items that hold or spray water, plus ordinary water, ocean and waterfall tiles. Leave out drinks, food, party cups, the beach parasol and bottled ship, and probably hot-spring water. Label the list as an estimate.
- **Keep the Modern sink out for now.** Magmortar's spawn conflicts with counting it, though the Horsea fountain and "water-related furniture" suggest similar items do count.
- **Reword the comfort effect.** Change "stays Iffy" to "lowers its comfort (by an unknown amount)". Keep the move-in refusal warning.
- **Keep the Grass–fire rule.** No conflict was found. Whether unlit or rained-out fires count is unknown, so treat them as counting, for safety.

### Gaps
- An in-game test settles all of this: Charmander next to (a) a Modern sink, (b) hot-spring water, (c) paper party cups, (d) a Horsea fountain; Bulbasaur next to (e) an unlit campfire, (f) lava. For each, try the move-in and read the comfort answer. No one has published it.

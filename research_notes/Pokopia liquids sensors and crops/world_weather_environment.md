# Pokopia world simulation: terrain, fire, ice, weather, time and environment values

> **How this was researched (read first).** In this session every page fetch was refused at the network level. That covered game8.co, gamepedia.jp and vandal.elespanol.com, so no other site was tried. Everything below comes from web-search result summaries (the search engine's reading of each page), not full-page reads. The one exception is the ccopedia measurement posts. The earlier researcher read those in full for `research_notes/Pokopia height and stacking rules/environment_and_light.md` and `habitats_and_ranges.md`, and they are cited here as such. To re-check a claim, open the linked page; game8.co, gamepedia.jp and vandal.elespanol.com have to be allowed in the session's network settings first.
>
> **Labels.**
> - **Official**: Nintendo or The Pokémon Company, or patch notes.
> - **Community-tested**: a player shows a measurement or an in-game test.
> - **Guide editorial**: a strategy-site statement with no test shown.
> - **Unverified**: one source only, not corroborated, or conflicting.
>
> **Versions.** 1.0 launched in March 2026. Ver. 1.1.0 came out on 9–10 June 2026. Ver. 2.0.0, the Bubbly Basin expansion, came out on 4 Aug 2026, followed by 2.0.1. Most guide pages are from March–May 2026, which is 1.0.x. The ccopedia posts are from October 2026, after 2.0.0.

## 1. Block and terrain physics: falling, support, terrain types and how they change; Bulldoze

### Takeaway
Blocks have no gravity. Nothing falls when its support is removed, and no source says sand falls either. Items left on top of a removed pillar stay floating. Terrain changes come from the player's moves and from weather, and the cycle is: plain soil → grass with Leafage (このは) → lawn after Cut (いあいぎり). Dry ground only grows dead grass until Water Gun (みずでっぽう) or rain moistens it. Rain re-moistens dry ground outdoors. Bulldoze (the Pokémon specialty) moves and demolishes buildings; it does not paint terrain. No source documents grass spreading by itself.

### Cited Findings
**Gravity and support**
- **Guide editorial:** "Blocks in Pokopia do not fall when you remove supporting blocks underneath them". The guide recommends this for floating structures, bridges and overhangs — [thegameswiki: Advanced Building Techniques](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)
- **Guide editorial:** floating furniture trick: build a temporary pillar, put a decoration or furniture piece on top, then break the pillar, and "the item will remain floating in midair" — [thegameswiki: Advanced Building Techniques](https://thegameswiki.com/pokopia/wiki/advanced-building-techniques)
- **Guide editorial:** for building underwater or above the seabed, the game provides temporary support blocks — [Pokodex: build underwater / floating houses](https://www.pokodexapp.com/guides/build-underwater-floating-houses)
- **Official item / guide editorial:** the Buoyant block (ブロックうき) can be placed freely in or on water and does not need to be grounded (接地している必要がない), so it can make free-standing structures — [Game8 JP ブロックうき](https://game8.jp/pocoapokemon/804530)
  - Serebii lists it as a shop item available only with the Bubbly Basin Lv. 2 Expansion Pass, which makes it a Ver. 2.0.0 DLC item — [Serebii: Buoyant block](https://www.serebii.net/pokemonpokopia/items/buoyantblock.shtml)
  - It lets structures float at chosen depths in the water column — [Posivi: floating houses in Bubbly Basin](https://posivi.com/how-build-floating-houses-manage-new-power-limits-pokemon-pokopia-bubbly-basin-dlc/)
- **Guide editorial:** structures are capped at 100 blocks tall measured from the seabed. The player takes no damage and does not die from a fall from 100 blocks — [GameWith 高さ制限](https://gamewith.jp/pocoapokemon/545342)
- **Not found:** no Pokopia source covers falling sand or gravel. Pokopia.town lists sand among the terrain blocks without mentioning gravity — [Pokopia.town blocks](https://pokopia.town/items/blocks). The Japanese search for 落下, 砂 and 重力 returned only Minecraft pages — [GameWith ブロック一覧](https://gamewith.jp/pocoapokemon/545854)

**Terrain transformation (the player's moves)**
- **Guide editorial:** Leafage (このは, taught by Bulbasaur) grows grass on the ground. Water Gun (みずでっぽう, taught by Squirtle) moistens dry soil and revives withered plants and trees. Rock Smash (いわくだき, unlocked by Hitmonchan's request) breaks soil and rock, opens holes in walls and digs the ground. Till (たがやす, unlocked by Drilbur's request) turns ground into a field and can move plants elsewhere — [GameWith メタモンの技一覧](https://gamewith.jp/pocoapokemon/545735); [Game8 JP 技一覧](https://game8.jp/pocoapokemon/767409); [Altema わざ一覧](https://altema.jp/pocoapokemon/wazaichiran); [攻略大百科 わざ一覧](https://gamepedia.jp/pocoapokemon/archives/984); [AppMedia わざまとめ](https://appmedia.jp/pocoapokemon/79787657)
- **Guide editorial, unverified detail:** one guide says the upgraded Leafage can grow moss on rocks — same search set as above; which page says it was not identified.
- **Guide editorial: soil → grass → lawn.**
  - Leafage on plain soil (ふつうのつち) grows green grass (みどりのくさ).
  - Cutting that grass with いあいぎり turns the block into grassland lawn (そうげんのしばふ).

  — [GameWith ふつうのつち](https://gamewith.jp/pocoapokemon/549561); [GameWith みどりのくさ](https://gamewith.jp/pocoapokemon/547712); [AppMedia 地面をしばふにする方法](https://appmedia.jp/pocoapokemon/79825337)
- **Guide editorial: dry ground.**
  - Leafage on withered (dry) ground grows only dead grass, and the block does not change.
  - Water Gun first restores the dead grass to green grass, and cutting it then turns the block back into lawn.

  — [AppMedia 地面をしばふにする方法](https://appmedia.jp/pocoapokemon/79825337); [Altema かれたみどりのくさの作り方](https://altema.jp/pocoapokemon/karekusa)
- **Guide editorial: tilled ground back to lawn.** Break the tilled block and put it back, grow grass with Leafage, then cut it — [nomanoma-web 耕した地面を芝生に戻す](https://nomanoma-web.com/2026/03/%E3%81%BD%E3%81%93%E3%81%82%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%A7%E8%80%95%E3%81%97%E3%81%9F%E5%9C%B0%E9%9D%A2%E3%82%92%E5%85%83%E3%81%AE%E8%8A%9D%E7%94%9F%E3%81%AB%E6%88%BB%E3%81%99%E6%96%B9/); [piyo-piyo04 芝生とふつうのつち (2026-05-17)](https://piyo-piyo04.com/2026/05/17/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%80%91%E8%8A%9D%E7%94%9F%E3%81%A8%E3%81%B5%E3%81%A4%E3%81%86%E3%81%AE%E3%81%A4%E3%81%A1%E3%81%AE%E9%9B%86%E3%82%81%E6%96%B9/)
- **Guide editorial: weather changes terrain.** A dry or withered area built outdoors gets re-moistened by rain, so build rain cover first — [piyo-piyo04 枯れ草・枯れた地面の作り方 (2026-03-18)](https://piyo-piyo04.com/2026/03/18/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%80%91%E6%9E%AF%E3%82%8C%E8%8D%89%E3%83%BB%E6%9E%AF%E3%82%8C%E3%81%9F%E5%9C%B0%E9%9D%A2%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%EF%BC%81%E9%9B%A8%E5%AF%BE%E7%AD%96/)
  - Rain automatically moistens dry blocks and withered trees — [Game8 JP 天気の変え方と影響](https://game8.jp/pocoapokemon/768195); [GameWith 天気の変え方と効果](https://gamewith.jp/pocoapokemon/545267) (search summary of both pages)
  - A roof protects the ground beneath it: "屋根を付けることで雨が振った際に、地面がうるおう、火が消えるなどの被害を防ぐことができます" (a roof prevents the ground getting moistened and fires going out when it rains) — [GameWith 屋根の付け方](https://gamewith.jp/pocoapokemon/548162)
- **Community-tested: dry rock as a drying tool.** Dry rock (さらさらいわ, the planner's "Smooth rock") dries only the highest block in its range, which runs from 1 above to 2 below the rock. With a block at +1, nothing at 0 to −2 dries. Planters and trees do not block it — [X @aminisi](https://x.com/aminisi/status/2037509264559030467) (from the earlier research's search summary)
  - One player advises keeping it at least 11 tiles from interfering moisture sources — [note.com qoo_estel](https://note.com/qoo_estel/n/n4f10ad36fe8a) (search summary)
- **Community-tested: unbreakable floor.** The bottom of each map is blocks that even the powered-up Rock Smash cannot break. Game8 measures "high ground" from that floor, about 45 tiles up in most towns and 47 in Rocky Ridges — [Game8 JP 高い場所](https://game8.jp/pocoapokemon/769075) (cited in the earlier research's gaps_full_reads.md)

**Bulldoze specialty**
- **Guide editorial:** Bulldoze is a Pokémon specialty, not a player tool. It helps rebuild the Pokémon Center and relocates or demolishes buildings — [Game8 EN Bulldoze](https://game8.co/games/Pokemon-Pokopia/archives/585149); [GameRant (Rocky Ridges)](https://gamerant.com/pokemon-pokopia-how-to-get-bulldoze-pokemon-rocky-ridges-habitat/); [GameTyrant all Bulldoze Pokémon](https://gametyrant.com/news/pokemon-pokopia-all-bulldoze-pokmon); [iGamingKeeda](https://www.igamingkeeda.com/game/pokopia-bulldoze-guide-how-to-rescue-onix-and-master-town-building-in-pokemon-pokopia/)
- **Guide editorial:** the early Bulldoze Pokémon is Onix, from the Smooth Tall Grass habitat: 4× dry tall grass and 1× Smooth Rock. Bonsly (Tree-Shaded Red Tall Grass) and Makuhita (Tree-Shaded Yellow Tall Grass) also bulldoze — [GameRant (Bleak Beach)](https://gamerant.com/pokemon-pokopia-bleak-beach-bulldoze-get-how-habitat/); [pokopiaguide Bulldoze](https://pokopiaguide.com/pokedex/specialty/bulldoze); [GamerHour](https://gamerhour.net/guides/pokemon-pokopia-how-to-get-bulldoze-and-build-specialty-pokemon-in-bleak-beach/)
- **Unverified, conflicts with all the others:** chief.games describes a terrain-painting "bulldozer" tool. It lists ground covers (grass, sand, dirt, snow, plus rarer moss and volcanic tiles) and says the tool resets them to the default soil — [chief.games](https://www.chief.games/bulldoze-pokemon-pokopia/). No other source supports a terrain-painting tool. It looks like generic or AI-written text.

### Inferences
- **Planner: no gravity.** Every block and item can float. Removing support never removes what is above it.
- **Planner: model the ground surface as a state machine.**
  - Plain soil + Leafage → soil with grass; + Cut → lawn block.
  - Dry soil + Leafage → dead grass, block unchanged.
  - Dry soil + Water Gun or rain (when not under a roof) → moist.
  - Tilled soil (field) is reverted only by replacing the block.
- Dry rock is the reverse of a sprinkler: it pushes the highest block in range to "dry". Sprinklers reach a Manhattan radius of 5 (earlier research), and the advice to keep dry rock 11 tiles from wet sources fits a similar radius of about 5 for the rock. That radius is an inference, not measured.
- The planner's biome grass blocks (Field, Seashore, Alpine and Sky-high grass, plus their "Dry" variants) fit the green-grass and dead-grass states described above. That mapping is not confirmed by a source.

### Gaps
- No source on whether grass spreads to nearby dirt over time, or on any automatic terrain change other than rain moistening.
- No source on falling sand or gravel, on blocks that break on their own, or on any block needing support.
- No source on how muddy water or mud terrain forms. That belongs to the liquids researchers.
- No source on how many tiles one Leafage, Water Gun or Rock Smash use affects, upgraded or not.

## 2. Fire: lighting, spread, extinguishing, effects

### Takeaway
Fire items (campfire, fireplace, wall torch, candles, firepit, bonfire, smelting furnace) only work when lit. A Pokémon with the Burn (もやす) specialty lights them when it stands nearby. Rain puts out unroofed fires, and a roof prevents it. A Burn Pokémon waiting nearby relights a fire that has gone out. No source shows fire spreading to grass, wood or items. When lit, fires add light and warmth on the measured scale (campfire: light 40, warmth +60).

### Cited Findings
- **Guide editorial:** lead a Burn Pokémon with Follow Me to something flammable, such as a campfire, and it lights it automatically — [Game8 EN Burn](https://game8.co/games/Pokemon-Pokopia/archives/585558); [Game8 EN Light the Campfire](https://game8.co/games/Pokemon-Pokopia/archives/584767)
  - Smelting stations (furnaces) are lit the same way — [RankedBoost Burn](https://rankedboost.com/pokopia/specialties/burn/)
- **Guide editorial:** "もやすのが得意なポケモンは、たきびなど燃やせるものの近くに連れていくと火をつけてくれます" (a Burn Pokémon brought near something burnable such as a campfire lights it). Some items, the campfire among them, have no effect until lit. With a Burn Pokémon next to a campfire or fireplace, it relights the fire whenever it goes out — [GameWith もやす](https://gamewith.jp/pocoapokemon/547155); [Game8 JP もやす](https://game8.jp/pocoapokemon/767549); [Altema もやす](https://altema.jp/pocoapokemon/tokui/1); [ゲーム乱舞 もやす](https://gameranbu.jp/pocoapokemon/d931ead3ee02aa487281) (search summary; which page says "relight" was not identified)
- **Guide editorial:** the early-game route: build a campfire, make a 2×2 tall-grass patch to find Charmander, then lead it to the campfire — [hyperts 攻略メモ](https://hyperts.net/pokopoke/memo/). Burn Pokémon include Charmander, Charizard, Blaziken and Scorbunny.
- **Guide editorial: rain puts out fire.**
  - Rain puts out lit fires that have no roof over them.
  - A roof prevents it: "たきびなど火がついた家具も屋根があれば火が消えません" (lit furniture such as campfires does not go out if there is a roof).

  — [Altema 屋根](https://altema.jp/pocoapokemon/yane); [GameWith 屋根](https://gamewith.jp/pocoapokemon/548162)
- **Guide editorial:** the habitat あたたかな風に乗って is built from 3 lit campfires. When it rains the fires go out, so a roof of blocks is needed — [Altema あたたかな風に乗って](https://altema.jp/pocoapokemon/seisokuchi/8)
- **Unverified (single source):** Burn Pokémon can light flammable terrain such as dry grass and brush piles on demand — [thegameswiki Burn Specialty](https://thegameswiki.com/pokopia/wiki/burn-specialty). No other source says so, and none describes fire spreading from tile to tile.
- **Community-tested: what lit fire contributes** (ccopedia; full read by the earlier researcher):

  | Fire item | Light | Warmth |
  |---|---|---|
  | たきび (campfire) | 40 | +60 |
  | いしのだんろ (stone fireplace) | 40 | +60 |
  | かべかけたいまつ (wall torch) | 40 | +60 |
  | かがりび (brazier/firepit) | 40 | not given |
  | キャンプファイヤー (big campfire) | 80 | not given |
  | candles | 20 | +10 |

  Fire items must be lit to count — [ccopedia light (2026-10-09)](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia warmth (2026-10-05)](https://note.com/ccopedia/n/n4b1e798887df)
- **Guide editorial:** a campfire raises both warmth and light, so it is the go-to fix, but it does not suit Grass-type Pokémon — search summary that names GameWith and Game8 JP environment pages, e.g. [Game8 JP あかるい環境](https://game8.jp/pocoapokemon/769396); the exact page was not identified.
- **Official (patch notes, from the earlier research):** Ver. 1.1.0 changed the comfort settings of the stone fireplace (いしのだんろ) — [Nintendo Life 1.1.0](https://www.nintendolife.com/news/2026/06/pokemon-pokopia-updated-to-version-1-1-0-includes-improvements-and-fixes)

### Inferences
- **Planner: fire state.** A fire item is "lit" only if a Burn Pokémon lives close enough to light it.
  - Outdoors with no block above it, it goes out whenever rain is set in that town.
  - It relights only if a Burn Pokémon is still nearby.
  - A planner warning such as "unroofed fire: goes out in rain unless a Burn Pokémon is next to it" would match the guides.
- Modelling fire spread is not needed. No source shows it, and the game's habitat recipes put campfires next to tall grass.

### Gaps
- How close a Burn Pokémon must be to light or relight (tiles), and how long relighting takes.
- Whether fires burn out over time when it is not raining (no source).
- Whether fire burns items, trees or dry grass (only one unverified claim).
- Whether a glass block or a partial roof counts as a roof for keeping fire lit.
- Warmth values for キャンプファイヤー and かがりび were not in the summaries. The planner uses +60.

## 3. Ice, snow and cold; heat sources

### Takeaway
Ice is a mined building block (こおり), and Never-Melt Ice (とけないこおり) is a separate item. No source covers ice melting, water freezing, snow weather or snow terrain, and a guide said in March 2026 that the game had no snow area. Cold and heat are point sources on the measured scale:
- Icy Rock, fridges and fans: −60.
- Ice blocks, icicles and similar: −10.
- Heat Rock: +60, the next warmer rock (アツアツいわ): +30, magma rock (マグマいわ): +10.
- Magma: +60.
- Hot spring: +30.

### Cited Findings
- **Guide editorial:** こおり (ice block) is mined in the cave behind the waterfall in Palette Town (まっさらな街). Its in-game text: "ヒビひとつ無いキレイな氷。さわるとひんやり冷たい" (clean ice without a single crack; cold to the touch). It is used as building material — [GameWith こおり](https://gamewith.jp/pocoapokemon/548274); [ポケモナンザ こおり (2026-03-13)](https://pokemonza.hatenablog.jp/entry/2026/03/13/225034)
- **Guide editorial:** とけないこおり (Never-Melt Ice) is a separate item. Show a small lost item (ちいさなおとしもの) to Professor Tangrowth (モジャンボ博士) for appraisal and it may come up at random — [GameWith とけないこおり](https://gamewith.jp/pocoapokemon/548391)
- **Guide editorial:** "there is no snow area in Pokémon Pokopia yet", so ice is one of the rarest materials. The article was about 240 days old when found, so it predates Ver. 2.0.0 — [GamingDeputy: ice locations](https://www.gamingdeputy.com/pokemon-pokopia-three-possible-locations-for-ice-and-ice-blocks/)
- **Unverified (Q&A post):** one way to mass-produce ice blocks: photograph an icicle (つらら) in record mode, duplicate it at the Pokémon Center, then break it — [Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12327533007)
- **Guide editorial:** use ice blocks as building material to keep a house cool. For cool habitats, remove fire decorations — [thegameswiki: Cool Habitat](https://thegameswiki.com/pokopia/wiki/how-to-make-a-cool-habitat); [game9820 冷たい需要 (fans, ice blocks)](https://note.com/game9820/n/naae645506dd5)
- **Community-tested:** replacing the block under a door with ice pleased Articuno and upset Drifblim, so a floor-level ice block counts as cooling — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df) (full read by the earlier researcher)
- **Community-tested: warmth scale.** Totals of +60 or more are warm and −60 or less are cool, for every home type and size.

  | Warmth | Items |
  |---|---|
  | +10 | candles, マグマいわ (magma rock) |
  | +30 | おんせん (hot spring), アツアツいわ |
  | +60 | マグマ (magma), lit たきび, かべかけたいまつ, いしのだんろ, エアコン on warm, あついいわ (Heat Rock) |
  | −10 | こおり (ice), つらら (icicle), かきごおり (shaved ice), クリームソーダ (soda float) |
  | −60 | refrigerators, せんぷうき (fan), てんじょうせんぷうき (ceiling fan), エアコン on cool, つめたいいわ (Icy Rock) |

  Appliances must be powered and switched on — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
  - The post has two typos: マグマいわ is "(30)" in its quiz but 10 in the list and the sums.
- **Community-tested:** magma (heat) does not count under the floor two or more deep, and does not count in a trench under the wall. One deep under the floor is fine — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Guide editorial:** Heat Rock, Icy Rock, Damp Rock and Smooth Rock are "four rare rocks that alter conditions only within a limited radius". Temperature and humidity are separate values, so a Damp Rock cannot stand in for a Heat Rock — [Pokodex: warm Bubbly Basin habitat](https://www.pokodexapp.com/guides/warm-bubbly-basin-habitat)
  - A Smooth Rock lowers the humidity of the area around it — [Game8 EN Smooth Rocks](https://game8.co/games/Pokemon-Pokopia/archives/590014)
- **Guide editorial: the mainline games are different.** There the four rocks lengthen weather moves (Damp Rock extends Rain Dance from 5 to 8 turns). No Pokopia source says the rocks change the weather — [Serebii weather (mainline)](https://www.serebii.net/games/weather.shtml)

### Inferences
- Do not model melting, freezing or snow cover. No source shows any of them. Treat ice as an ordinary block worth −10 warmth per counted cell (the planner already does), and Icy Rock as a −60 point item.
- The planner's Heat Rock +60 / Molten rock +30 / Lava rock +10 matches あついいわ / アツアツいわ / マグマいわ. That assumes the English names map that way, which needs a check against the English item list. Lava +60 matches マグマ. Whether that is per lava cell or flat was not visible in the notes.

### Gaps
- Whether water next to ice or an Icy Rock freezes, or ice next to magma or heat melts (no source).
- Whether any snow block, snowy terrain or snow weather was added in Ver. 2.0.0 or later (none found).
- The horizontal radius of the "limited radius" rocks (no number found).
- Whether ice blocks in a wall count. Walls are never counted for the environment ([ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)), so they probably don't.

## 4. Weather and time: types, control, per-area rules, day/night, seasons, effects

### Takeaway
- **Weather is set by the player, per town.** It never changes by itself with time. A Rain Dance spot (あまごいスポット) with a Hydrate Pokémon (うるおす) sets rain. A Sunny Day spot (にほんばれスポット) with a Burn Pokémon sets sun. The weather stays until the other spot overrides it.
- **Types and timing.** The types found are sun, rain and a random cloudy. The change lands about 10 seconds after the dance.
- **Clock.** Time runs 1:1 with the Switch 2 clock. Bands: morning 5:00–8:00, day 8:00–17:00, evening 17:00–19:00, night 19:00–5:00 (one X post says night starts at 18:00).
- **No seasons, snow or wind found.**
- **Rain effects.** It moistens dry ground and withered trees, puts out unroofed fires, switches Smooth (dry) rock off, and brings some rare spawns.
- **Sun effects.** It sets the town's moisture to 0 for Yawn (あくび) reports.
- **Daylight.** It ignores both weather and time of day.

### Cited Findings
**How weather is set**
- **Guide editorial:** weather does not change with real or in-game time. It changes only through habitat spots such as あまごい and にほんばれ and the Pokémon's actions — [ゲーム乱舞 天気の変更](https://gameranbu.jp/pocoapokemon/6a0894affe6adbb58444); [攻略大百科 天気の変え方](https://gamepedia.jp/pocoapokemon/archives/4979)
  - Rain does not stop on its own and stays until another weather overwrites it — [tcg-bloglife 雨が止まらない (2026-03-09)](https://news.tcg-bloglife.com/entry/2026/03/09/022703)
- **Guide editorial: weather is per town**, so a rain spot is needed in each town where you want rain. Any town works, Palette Town (まっさらな街) included — [kengomon あまごいスポット](https://www.kengomon.com/pokoapokemon-pray-for-rain/); [ゲーム乱舞](https://gameranbu.jp/pocoapokemon/6a0894affe6adbb58444)
- **Guide editorial: the spots.** Both use てるてるポワルン, the Castform charm, which you inspect after placing to flip between sun and rain faces.
  - Rain spot: てるてるポワルン (rain face) plus a 皿にのせた食べ物 (food on a plate), with a Hydrate (うるおす) Pokémon brought to eat it.
  - Sun spot: てるてるポワルン (sun face) ×2 plus food on a plate ×1, with a Burn (もやす) Pokémon. It turns sunny when the にほんばれ finishes.

  — [ds-can 天気の変更](https://ds-can.com/nanogames/pokoa06/); [kengomon てるてるポワルン切り替え](https://www.kengomon.com/pokoapokemon-sunny-rainy/); [AppMedia 天気の変え方](https://appmedia.jp/pocoapokemon/79814984); [Game8 JP 天気](https://game8.jp/pocoapokemon/768195)
- **Guide editorial:** the weather does not change the moment the rain dance ends. It takes about 10 seconds (10秒ほど) — search summary of [攻略大百科](https://gamepedia.jp/pocoapokemon/archives/4979) / [gemukan](https://www.gemukan.com/pokoa-system-055/)
- **Guide editorial:** weather types: one article lists three, sun, rain and cloudy. An English guide says cloudy happens at random and does not affect spawns. There is no weather forecast feature — [gemukan 天気の変え方](https://www.gemukan.com/pokoa-system-055/); [Game8 EN Change the Weather](https://game8.co/games/Pokemon-Pokopia/archives/585467) (search summary; which says what is partly unclear)
- **Not found:** no snow, wind, thunderstorm or sandstorm weather in any source.

**Effects of weather**
- **Guide editorial: rain.**
  - It automatically moistens dry blocks and withered trees.
  - It is tied to rare Water- and Electric-type spawns.
  - Lugia appears in cloudy or rainy weather, Ho-Oh in sunny weather.

  — [Game8 JP 天気の変え方と影響](https://game8.jp/pocoapokemon/768195); [GameWith 天気の変え方と効果](https://gamewith.jp/pocoapokemon/545267) (search summary)
- **Guide editorial: sun and humidity.** While にほんばれ has made it sunny, the town's moisture (うるおい) counts as 0, which helps Pokémon that like it dry. Slowpoke's Yawn reports 0 points while the Sunny Day is in effect — [GameWith 天気の変え方と効果](https://gamewith.jp/pocoapokemon/545267); [GameWith あくび](https://gamewith.jp/pocoapokemon/547219)
- **Guide editorial, conflicts with a measurement:** when it rains, the area's moisture rises, which raises the comfort of Pokémon that like it humid — [GameWith あくびで雨をふらせよう](https://gamewith.jp/pocoapokemon/547344) (search summary). The measured opposite: rain itself does not change a home's humidity points — [ccopedia humidity (2026-10-14)](https://note.com/ccopedia/n/n48ddc4e1afbd) (full read by the earlier researcher). See the inference below.
- **Community-tested:** Smooth/dry rock (さらさらいわ, −100 humidity) drops to 0 in rain, even under a roof — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
  - Inside a kit house it keeps working in rain, but it sometimes stops when plants are placed nearby — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Guide editorial:** rain puts out unroofed fires, as covered in section 2 — [GameWith 屋根](https://gamewith.jp/pocoapokemon/548162)
- **Community-tested:** daylight in block houses and habitats depends only on open sky above floor cells. Time of day and weather make no difference — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f) (full read by the earlier researcher)

**Time and day/night**
- **Guide editorial:** the clock is tied to the Switch 2 system clock — [Game8 JP 日付変更](https://game8.jp/pocoapokemon/767333); [game-shinden 時間の全仕様](https://game-shinden.com/pokoa-pokemon-time-system-date-change-guide/); [kengomon 時間操作](https://www.kengomon.com/pokoa-pokemon-timechange/)
  - English guides agree on a 1:1 real-time cycle, a full in-game day being 24 real hours, with a new day at 5:00 AM — [pokopiaplanner.com Day-Night Cycle](https://www.pokopiaplanner.com/mechanics/day-night-cycle/); [Pokopia Island time converter](https://pokopiaisland.com/tools/time-converter); [games.gg time skip](https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-change-time/); [Bulbapedia Time](https://bulbapedia.bulbagarden.net/wiki/Time)
- **Guide editorial: time bands** (most sources):

  | Band | Hours |
  |---|---|
  | 朝 (morning) | 5:00–8:00 |
  | 昼 (day) | 8:00–17:00 |
  | 夕 (evening) | 17:00–19:00 |
  | 夜 (night) | 19:00–5:00 |

  To make it night, set the console to between 19:00 and 5:00 — [GameWith 朝は何時から](https://gamewith.jp/pocoapokemon/548022); [GameWith 夜は何時から](https://gamewith.jp/pocoapokemon/548015); [Altema 夜に出現](https://altema.jp/pocoapokemon/time/4); [Altema 昼に出現](https://altema.jp/pocoapokemon/time/2); [Altema 朝に出現](https://altema.jp/pocoapokemon/time/1)
- **Unverified, conflicts:**
  - A player on X says it becomes night at 18:00 (18時になると夜になる) — [X @shin_magokoro](https://x.com/shin_magokoro/status/2034053969488834611)
  - One English guide gives morning 6:00–8:59, day 9:00–16:59, evening 17:00–18:59 and night 19:00–5:59. Another lists Day 12:00–18:00. A third says there are four phases of about 15 real minutes each, which contradicts the 1:1 sources — search summary across [thegameswiki Day and Night Cycle](https://thegameswiki.com/pokopia/wiki/day-and-night-cycle), [pokopiahabitats time-of-day spawns](https://pokopiahabitats.com/guides/pokemon-pokopia-time-of-day-spawns), [vandal](https://vandal.elespanol.com/en/pokemon-pokopia/pokemon-pokopia-how-to-skip-time-and-change-the-time-or-weather.html) and the sources above; which says what was not identified.
- **Guide editorial:** there is no in-game time skip; change the console clock instead (turn off internet time sync, set it by hand). One site says there is no penalty at present (現状ペナルティはなし) — [Game8 JP 日付変更](https://game8.jp/pocoapokemon/767333). Another English source warns that time-based spawns may lock for a cooldown — search summary, source not identified.
- **Guide editorial:** during the opening tutorial the time is fixed. It does not sync with real time until Ditto sleeps for the first time — search summary of the English time guides above.
- **Guide editorial:** each Pokémon has spawn time bands, shown under 時間 in the habitat dex. Night (19:00–5:00) brings nocturnal spawns and the town lit up (街のライトアップ) — [kengomon 時間操作](https://www.kengomon.com/pokoa-pokemon-timechange/); [game-shinden](https://game-shinden.com/pokoa-pokemon-time-system-date-change-guide/)
- **Not found:** no seasons in any source.

### Inferences
- **Planner: weather is a per-town toggle** (sun / rain, plus cloudy, which is random and harmless). It is not simulated over time. Useful switches:
  - "Rain": puts out unroofed fires, sets Smooth rock to 0 outside kit houses, moistens unroofed dry ground.
  - "Sun": the town's Yawn moisture reads 0.
- **Reconciling rain and humidity.** Rain does not add humidity points to a home directly (ccopedia), but it does turn dry ground blocks wet. That changes the per-block humidity points (dead grass −0.5 → grass +1 per tile) and the town moisture (うるおい) that Yawn reports. GameWith's "rain raises humidity" is most likely this indirect, town-level effect. This is an inference.
- **Time of day matters for spawns, not for environment values.** Daylight is independent of time. The planner could offer a time-band label for spawn checks, using the majority bands 5/8/17/19.

### Gaps
- Exactly when cloudy weather happens, and whether it has any effect beyond Lugia.
- Whether any later update (2.0.0 or after) added snow or other weather.
- Whether lamps switch on only at night or stay on (no source on automatic light switching).
- Whether plants or crops grow differently by time or weather, apart from rain watering. Crops are another researcher's area.

## 5. Environment system: computing brightness, temperature and humidity; ranges; additive or capped; ideal bands

### Takeaway
The environment values are plain sums of fixed per-item and per-block points (ccopedia's fitted scale). Nothing caps or averages them; each Pokémon's preference is a threshold on the sum.
- **Habitats and block houses:** bright ≥100, dark ≤60; humid ≥100, dry ≤30.
- **Kit houses:** bright ≥40, dark ≤40; humid ≥40, dry ≤60.
- **Warmth, everywhere:** warm ≥+60, cool ≤−60.

**Range.** For houses, only floor cells and door cells from −1 to +3 count. For habitats, light and humidity count over the whole white dotted area, ±4 vertically, while warmth uses the −1 to +3 band. Items outside the area do nothing.

**Planner's values:** lamps 80, Campfire 40/+60, Icy Rock −60, Damp Rock +100, Smooth rock −100 and Beach parasol −40 all match the measurements.

### Cited Findings
- **Community-tested: thresholds.**

  | Home | Bright | Dark | Humid | Dry |
  |---|---|---|---|---|
  | Habitats and block houses | ≥100 | ≤60 | ≥100 | ≤30 |
  | Kit houses | ≥40 | ≤40 | ≥40 | ≤60 |

  Warmth is ≥+60 warm and ≤−60 cool everywhere — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd) (all read in full by the earlier researcher; see `research_notes/Pokopia height and stacking rules/environment_and_light.md` §8)
- **Community-tested: light points.**

  | Light | Items |
  |---|---|
  | 20 | candles, gaming furniture, pumpkin lanterns |
  | 40 | block light, stone fireplace, campfire, wall torch, brazier, ちょうちん (paper lantern), glowing mushroom |
  | 80 | most lamps and street lights, fluorescent light, neon floor, キャンプファイヤー |
  | −40 | beach parasol |
  | 0 | oil lantern, TV, starry wall |

  Daylight is 90 × (open-sky floor cells, door cells included) ÷ (all house cells, walls included) — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
  - Without fire or power, pumpkin lanterns and the Trevenant street lamp give 20, ちょうちん 40, and the mushroom lamp, mushroom street lamp and pearl street lamp 80.
- **Community-tested: humidity points.**

  | Humidity | Items |
  |---|---|
  | 1 | grass block, per tile |
  | 2.5 | grass, flowers, crops at sprout stage or later, potted trees, vases with flowers |
  | 5 | trees |
  | 20 | water, muddy water, hot spring, waterfall (per cell), sink, toilet, washbasin, shower |
  | 50 | Castform charm, rain face |
  | 100 | bathtub, humidifier, みずおけ (basin), sprinkler, しめったいわ (Damp Rock), when working or filled |
  | −0.5 | dead grass block |
  | −50 | Castform charm, sun face |
  | −100 | さらさらいわ (Smooth/dry rock); 0 in rain |

  — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
  - A block house of 30 floor tiles or fewer stays dry even with an all-grass floor — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Community-tested: adding up.** A fully roofed block house stays dark up to 60 total, so three 20-point candles or one 40-point fireplace still leave it dark — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
  - The numbers are the author's own fitted scale, not internal data — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested: ranges.**
  - Block house: floor plus door cells, heights −1 to +3. Walls and anything above or below walls never count, and outside never counts.
  - Habitats: light and humidity count over the whole ±4 range of the white dotted area; warmth uses −1 to +3.
  - The white dotted area (shown with the R stick) reaches +4 in every direction from the habitat or block house. That wider area is also the furniture recognition range.

  — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f); [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df); [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Guide editorial:** items that change light, temperature and so on must sit inside the habitat's (すみか) range; outside it they have no effect. Check the range by pressing the R stick near the habitat. Temperature items also have placement-position conditions shared with light and humidity — search summary of [GameWith 天気の変え方と効果](https://gamewith.jp/pocoapokemon/545267), [Game8 JP あかるい環境](https://game8.jp/pocoapokemon/769396), [GameWith 乾燥させる方法](https://gamewith.jp/pocoapokemon/548294) and [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Community-tested:** in habitats, walls and floors that visually block a lamp's light make no difference: "壁や床でランプの光を遮光するとかは全く関係がありません". Any light in range counts, including one on a roof — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Guide editorial: the town-level score.** Slowpoke's あくび (Yawn) reports the town's うるおい (moisture) as a point score. Quests ask for "うるおい◯点" (N points of moisture), and the Environment Level (環境レベル) is a town-wide progression — [GameWith あくび](https://gamewith.jp/pocoapokemon/547219); [GameWith あくびで雨をふらせよう](https://gamewith.jp/pocoapokemon/547344); [note.com silvergill 環境レベル10](https://note.com/silvergill/n/n968cf4a06235)
- **Official (patch notes, from the earlier research):** Ver. 1.1.0 fixed Pokémon saying it got darker or brighter when nothing had changed, and made the Environment Level screen show which requests were met — [Nintendo Life 1.1.0](https://www.nintendolife.com/news/2026/06/pokemon-pokopia-updated-to-version-1-1-0-includes-improvements-and-fixes); [Pokémon portal notice](https://ph.portal-pokemon.com/topics/post-5960/)

### Inferences
- **The planner's model matches the measurements.** Its lamps (80), Campfire (40/+60), Icy Rock (−60), Damp Rock (+100), Smooth rock (−100, off in rain outside a kit house), Beach parasol (−40) and Castform charms (±50) all agree with ccopedia. Keep plain addition with no cap.
- **Possible refinement: habitat warmth band.** For habitats (as opposed to houses), warmth should use the −1 to +3 band, while light and humidity use the full ±4 dotted area.
- **Possible refinement: the town moisture score.** The Yawn score is separate from per-home humidity. A planner wanting it would need its own town-wide aggregate. Its formula is unknown.

### Gaps
- The horizontal extent of the habitat's white dotted area (+4 is quoted, but its anchor is not confirmed by these sources).
- How the town-wide moisture (Yawn) score is computed: its range, and whether it sums all water and plants in the town.
- Official (data-mined) values. All the numbers are a community-fitted scale.

## 6. Other peculiar quirks

### Takeaway
The documented quirks:
- Sun sets the town's Yawn moisture to 0.
- Smooth/dry rock turns off in rain even under a roof, except inside kit houses, and is unreliable near plants there.
- Unroofed fires go out in rain.
- Blocks and items float with no support.
- Clock changes have no penalty so far.
- Light ignores walls in habitats, and ignores weather and time everywhere.

### Cited Findings
- **Guide editorial:** Slowpoke's Yawn reports 0 points while にほんばれ has made it sunny — [GameWith あくび](https://gamewith.jp/pocoapokemon/547219)
- **Community-tested:** Smooth/dry rock reads 0 in rain even under a roof, but keeps working in rain inside a kit house. It sometimes stops when plants are placed nearby — [ccopedia humidity](https://note.com/ccopedia/n/n48ddc4e1afbd)
- **Guide editorial:** Onix's Smooth Tall Grass habitat needs dry tall grass and a Smooth Rock. A dry area outdoors gets re-moistened by rain, so it needs a roof — [GameRant](https://gamerant.com/pokemon-pokopia-bleak-beach-bulldoze-get-how-habitat/); [piyo-piyo04 枯れ草](https://piyo-piyo04.com/2026/03/18/%E3%80%90%E3%81%BD%E3%81%93%E3%81%82%E3%80%91%E6%9E%AF%E3%82%8C%E8%8D%89%E3%83%BB%E6%9E%AF%E3%82%8C%E3%81%9F%E5%9C%B0%E9%9D%A2%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%EF%BC%81%E9%9B%A8%E5%AF%BE%E7%AD%96/)
- **Community-tested:** some build kits (the log house kit, the small office kit) produce block houses rather than kit houses, so block-house thresholds apply to them. Small kit houses cannot take outside power, so electric lights need a ミニはつでんマシン (mini generator) inside — [ccopedia light](https://note.com/ccopedia/n/ndadc82daf39f)
- **Community-tested:** an air conditioner mounted at +4 gave no cooling; lowered to +3 it worked — [ccopedia warmth](https://note.com/ccopedia/n/n4b1e798887df)
- **Guide editorial:** there is no time skip, and changing the console clock currently has no penalty — [Game8 JP 日付変更](https://game8.jp/pocoapokemon/767333)
- **Guide editorial:** a fall from 100 blocks does no damage — [GameWith 高さ制限](https://gamewith.jp/pocoapokemon/545342)

### Inferences
- **Planner: "only works when…" flags.** Fires: lit, and roofed or rain-free. Appliances: powered and on. Smooth rock: not in rain unless inside a kit house. Water items: filled.
  - The planner already has most of these as ENV_NEED codes (p, f, w, o, n, r, d).
  - Fire could get a "roof or no rain" flag alongside "lit".

### Gaps
- No source on Yawn's range: whether it reports the whole town or a radius around Slowpoke.
- No source on any item that works only in rain, other than Smooth rock switching off.

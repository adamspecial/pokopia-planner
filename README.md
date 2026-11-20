# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

The screen keeps to a few words. Most buttons are icons: hover over one, or long-press it on a phone, to see its name. Tap ⓘ, or a chip, to see the details behind it.

## Moving things

The planner opens on **Select**. Tap any square of an item to select it, and drag it to move it: a dashed outline shows where it will go, and it moves when you let go. Squares that turn red hold small items it would replace. With any other tool, dragging the item you have selected moves it too. If the spot under your finger can't hold the item as it is, the outline shifts it or turns it so that it still covers that square, whenever that fits. Doors and windows turn to follow the wall. Kit homes take their residents with them. Rugs work the same way; tap a selected rug again to select the house or zone under it. Dragging from an empty square still selects an area.

In **Decorate**, tapping a suggestion folds the window into a small bar under the map and centres the house, so you can see where the item goes. Once you've placed it, the window opens again where you left it. The bar's buttons bring it back early or close it.

## Item pictures

Furniture, storage, shelves, lamps and appliances show on the map, and in kit rooms, as top-down symbols of their kind (a bed with its pillows, a sofa with its cushions, a stove with its burners), in the colour of their pictures. Decorations, dolls, fossils, plants, kits and other one-off items show as their own pictures. Building pieces are drawn from above and joined to the pieces next to them, so homes read as floor plans: walls, blocks, cube hedges and pillars as solid walls, fences as rails with posts, doors as a door in the wall and windows as glass. Their colours come from their pictures. Floors and terrain cover the ground as flat, top-down tiles made from their pictures. A rug is one item with a size, like furniture: a tap places one whole rug, drawn once across its footprint, with the floor kept under it and furniture standing on it. Rug sizes are guesses until you set them with **Change**, which can also resize the rugs already placed. When you zoom far out, squares shrink to the tile's colour, and an item keeps its drawn shape until its picture has loaded.

The pictures live in `pics/` inside the app, so they show without internet. The first time the planner opens, it saves all of them on the device in the background (about 7 MB); the Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii and makes the floor tiles (`pics/top/`) from them in one batch. Most floor pictures are the same 3D cube drawn from the same angle, so one calibration unwarps the top face of all of them; water is cropped instead. In `data.json`, an item's `im` is `1` when Serebii names the picture after the item, or Serebii's own file name when that differs, such as `stylishwall(upper)`. GitHub runs the tool for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Item pictures → Run workflow**.

## Light, warmth and humidity

Every Pokémon has one ideal habitat: Bright or Dark, Warm or Cool, Humid or Dry. These are three separate scales, so one home can be warm and humid at once. Each home's inspector shows where it sits on each scale, which residents it suits, what to change, and what counts.

Every item, and every tile of water, lava, ice or grass, carries light, warmth and humidity points. A home adds up the ones that count for it. The points and rules come from one player's in-game tests: each value was checked against how the residents reacted ([あかるい・くらい](https://note.com/ccopedia/n/ndadc82daf39f), [あたたかい・すずしい](https://note.com/ccopedia/n/n4b1e798887df) and [うるおい・乾そう](https://note.com/ccopedia/n/n48ddc4e1afbd) on note.com, October 2026). The placement rules agree with [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/). Items those tests didn't cover are marked *untested* and are the planner's guess.

**What counts where**

- **A house you built from blocks**, or a kit built from blocks such as the cottages and the log cabin: only what's on the floor inside the walls or on a door tile counts, from 1 level below to 3 above the floor. The walls, anything on top of or under them, and anything outside never count. Lights hung higher than 3 don't count either. Daylight is 90 × floor tiles open to the sky ÷ every tile of the house, walls included. That's 62 at most even in the biggest house (9×10), and 45 in a 5×4. A roof is any block 2 or more above the floor. Set how much is roofed with **Roof**; unset counts as open sky. Kits built from blocks count as roofed, and only their ground floor counts.
- **A kit house with its own interior**: everything inside counts, on both floors and at any height. There's no daylight, and windows, curtains, wallpaper and floors don't count.

**When a home is bright, warm or humid**

| | House from blocks | Kit house |
|---|---|---|
| Bright / Dark | 100 or more / 60 or less | 40 or more / 40 or less (exactly 40 suits both) |
| Warm / Cool | +60 or more / −60 or less | the same |
| Humid / Dry | 100 or more / 30 or less | 40 or more / 60 or less (40 to 60 suits both) |

**Points**

- **Light:** lamps, streetlights, mushroom lamps, the bonfire and neon flooring add 80. Campfires, firepits, wall torches, the stone fireplace, paper lanterns, cube lights, vending machines and small stages add 40. Candles, pumpkin lanterns, gaming furniture and cyber flooring add 20. A beach parasol takes 40 off. The oil lantern, TVs and computers give no light.
- **Warmth:** a lit fire (campfire, firepit, wall torch, stone fireplace, bonfire), a cooking stove, the Fiery Magby statue, a Heat Rock, the furnace and an air conditioner on hot each add 60. So does each tile of lava. Molten rock and each hot-spring tile add 30; candles and each Lava rock block add 10. An Icy Rock, a refrigerator, a cooler, a fan, a ceiling fan and an air conditioner on cold each take 60 off. Ice, icicles, shaved ice and soda floats take 10 off. Lamps don't warm.
- **Humidity:** a filled water basin or bathtub, a humidifier, a Damp Rock, the funky diffuser, a working fountain, sprinkler or bubble machine and the hot-spring spout each add 100. Each tile of water, muddy water, hot spring or waterfall adds 20, and so does a sink, shower or toilet, whether running or not. Trees and the Chansey plant add 5; grass, flowers, hedges, crops and potted plants add 2.5. Each grass ground tile adds 1. The Castform charm adds 50 when turned to rain and takes 50 off when turned to sun. A Smooth Rock takes 100 off, but stops working in rain unless it's in a kit house. Each dry grass tile takes 0.5 off. Rain itself adds nothing.

Fires count only when lit by a Burn Pokémon; the cooking stove and the Magby statue need no lighting. Appliances count only when powered and switched on, and tubs, basins and fountains only when filled or working. The planner counts them all as working. The air conditioner counts as set to hot or cold, whichever the residents want. Slowpoke's Yawn score is something else: it covers the whole town area, not one home.

**Decorate** and **Decorate inside** use all of this. Each resident's ideal gets a **Make it …** list of items that help. Suggestions that would spoil someone's ideal are marked ⚠ and drop down the list; for example, a lamp is marked if a resident wants it dark. Auto-place adds what's missing and leaves those out. The resident picker shows who already suits the home as it is.

## Sync between devices

Plans → **Sync between devices** → **Sign in with Google**, once on each device. Plans and item sizes then stay the same everywhere: changes show up on your other devices within seconds, and edits made offline are sent when the device is back online. Each device keeps its own copy too, so the planner works the same without internet.

The plans are stored in Firestore, in the free Firebase project GM Companion already uses (`my-gm-companion`), under `users/<you>/pokopiaPlans` and `users/<you>/pokopiaMeta`, apart from GM Companion's data; its existing rules let only you read and write them. One-time step: Firebase console → Authentication → Settings → Authorized domains → add `adamspecial.github.io`.

If the same plan is changed on two devices before they sync, the newer version keeps the plan and the other is kept as a copy, so nothing is lost.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item pictures from Serebii.net.

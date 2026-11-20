# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

## Item pictures

Furniture, storage, shelves, lamps and appliances show on the map, and in kit rooms, as top-down symbols of their kind (a bed with its pillows, a sofa with its cushions, a stove with its burners), in the colour of their pictures. Decorations, dolls, fossils, plants, kits and other one-off items show as their own pictures. Building pieces are drawn from above and joined to the pieces next to them, so homes read as floor plans: walls, blocks, cube hedges and pillars as solid walls, fences as rails with posts, doors as a door in the wall and windows as glass. Their colours come from their pictures. Floors and terrain cover the ground as flat, top-down tiles made from their pictures. A rug is one item with a size, like furniture: a tap places one whole rug, drawn once across its footprint, with the floor kept under it and furniture standing on it. Rug sizes are guesses until you set them with **Change**, which can also resize the rugs already placed. When you zoom far out, squares shrink to the tile's colour, and an item keeps its drawn shape until its picture has loaded.

The pictures live in `pics/` inside the app, so they show without internet. The first time the planner opens, it saves all of them on the device in the background (about 7 MB); the Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii and makes the floor tiles (`pics/top/`) from them in one batch. Most floor pictures are the same 3D cube drawn from the same angle, so one calibration unwarps the top face of all of them; water is cropped instead. In `data.json`, an item's `im` is `1` when Serebii names the picture after the item, or Serebii's own file name when that differs, such as `stylishwall(upper)`. GitHub runs the tool for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Item pictures → Run workflow**.

## Light, warmth and humidity

Every Pokémon has one ideal habitat: Bright or Dark, Warm or Cool, Humid or Dry. These are three separate scales, so one home can be warm and humid at once. Only opposites on the same scale (Bright and Dark, say) can't both be happy in one home. Each home's inspector shows where it sits on each scale, which residents it suits, and what to change.

- **Light.** These numbers come from players' tests. In a house built from blocks, daylight adds up to 90 for the share of the floor inside the walls that isn't roofed; set this with **Roof** in the house's inspector. Unset counts as open sky. Lights anywhere in the active area add 20, 40 or 80, from 1 level below the door to 3 above it, and that includes lights on the roof. Candles add 20, campfires, torches and paper lanterns 40, and electric lamps, streetlights and mushroom lamps 80. A house is bright at 100 or more and dark at 60 or less. A kit house has a roof and gets no daylight. It's bright at 40 or more and dark below that, and only what's inside counts, floor by floor.
- **Warmth.** A lit campfire, firepit or stone fireplace or a Heat Rock adds 40, a bonfire 80, and lava 20 a tile. An Icy Rock or ice takes 40 off. Torches add 20, candles 10, and lamps nothing. A home is warm at 40 or more and cool at −40 or less. The air conditioner counts as set to hot or cold, whichever the residents want.
- **Humidity.** A humidifier, a Damp Rock, or a fountain or sprinkler by water adds 40. A filled bathtub or basin, a shower or a sink adds 20, water nearby 10 a tile, trees 10, and potted plants 5. A Smooth Rock takes 40 off. A home is humid at 40 or more and dry at 10 or less.

The game doesn't show its warmth and humidity numbers, so those points are the planner's own estimate. They're based on the items' descriptions and on what players report. Fires, lamps and taps are counted as lit, powered and running.

**Decorate** and **Decorate inside** use this. Each resident's ideal gets a **Make it …** list of items that help. Suggestions that would spoil someone's ideal are marked ⚠ and drop down the list. For example, a lamp is marked if a resident wants it dark, and a campfire if one wants it cool. Auto-place adds what's missing and leaves those items out. The resident picker shows who already suits the home as it is.

## Sync between devices

Plans → **Sync between devices** → **Sign in with Google**, once on each device. Plans and item sizes then stay the same everywhere: changes show up on your other devices within seconds, and edits made offline are sent when the device is back online. Each device keeps its own copy too, so the planner works the same without internet.

The plans are stored in Firestore, in the free Firebase project GM Companion already uses (`my-gm-companion`), under `users/<you>/pokopiaPlans` and `users/<you>/pokopiaMeta`, apart from GM Companion's data; its existing rules let only you read and write them. One-time step: Firebase console → Authentication → Settings → Authorized domains → add `adamspecial.github.io`.

If the same plan is changed on two devices before they sync, the newer version keeps the plan and the other is kept as a copy, so nothing is lost.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item pictures from Serebii.net.

# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

## Item pictures

Every item shows on the map, and in kit rooms, as its own picture: furniture, walls, kits, trees and everything else. Floors, terrain and rugs cover the ground as flat, top-down tiles made from their pictures. When you zoom far out, squares shrink to the tile's colour, and an item keeps its drawn shape until its picture has loaded.

The pictures live in `pics/` inside the app, so they show without internet. The first time the planner opens, it saves all of them on the device in the background (about 7 MB); the Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii and makes the floor tiles (`pics/top/`) from them in one batch. Most floor pictures are the same 3D cube drawn from the same angle, so one calibration unwarps the top face of all of them; water and rugs are cropped instead. In `data.json`, an item's `im` is `1` when Serebii names the picture after the item, or Serebii's own file name when that differs, such as `stylishwall(upper)`. GitHub runs the tool for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Item pictures → Run workflow**.

## Sync between devices

Plans → **Sync between devices** → **Sign in with Google**, once on each device. Plans and item sizes then stay the same everywhere: changes show up on your other devices within seconds, and edits made offline are sent when the device is back online. Each device keeps its own copy too, so the planner works the same without internet.

The plans are stored in Firestore, in the free Firebase project GM Companion already uses (`my-gm-companion`), under `users/<you>/pokopiaPlans` and `users/<you>/pokopiaMeta`, apart from GM Companion's data; its existing rules let only you read and write them. One-time step: Firebase console → Authentication → Settings → Authorized domains → add `adamspecial.github.io`.

If the same plan is changed on two devices before they sync, the newer version keeps the plan and the other is kept as a copy, so nothing is lost.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item pictures from Serebii.net.

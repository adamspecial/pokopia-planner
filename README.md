# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

## Item pictures

The pictures live in `pics/` inside the app, so they show without internet. The first time the planner opens it saves all of them on the device in the background (about 6 MB); the Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii. GitHub runs it for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Item pictures → Run workflow**.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item pictures from Serebii.net.

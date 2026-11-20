# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

## Item pictures

The pictures live in `pics/` inside the app, so they show without internet. The first time the planner opens it saves all of them on the device in the background (about 6 MB); the Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii. GitHub runs it for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Item pictures → Run workflow**.

## Sync between devices

Plans → **Sync between devices** keeps plans and item sizes the same on every device, using a private gist on your own GitHub account. There is no server of its own: each device talks straight to GitHub, keeps working offline, and catches up when it is back online.

1. On the first device, tap **Set up sync**, follow **Create a GitHub key** (the form comes filled in: gists only, read and write) and paste the key.
2. On each other device, use **Link another device** on the first one: scan the QR code, or copy the link and paste it into **Set up sync**.

If the same plan is changed on two devices before they sync, the newer version keeps the plan and the other is kept as a copy, so nothing is lost. The gist's history on GitHub is also a full backup of every change.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item pictures from Serebii.net.

# Item review

A quick way to go through every item in the game, flag the ones whose size, shape or colours are wrong, and say what to fix, with as little effort as possible.

## How it works

- Open the planner at `#review`, a link only the owner uses, so other visitors don't see it.
- Every item (1,252) is a card in a scrolling grid, grouped by kind like the round-up. Each card shows the game picture beside the 3D model on its footprint, with its size. Dashed sizes are guesses.
- Cards that stay on screen for a moment count as seen. You only touch the ones that are wrong.
- Tapping a card opens a panel with:
  - the picture and a large model you can drag to turn
  - **Size:** width, length and height steppers
  - **Colours:** pick Main or Second, then tap the picture
  - **Shape:** a note box, which the Android keyboard's mic can fill
- Changes save as you go, and the model shows the new size and colours.
- **Send** builds a short list. On Android it opens the share sheet, so the list can go straight into the Claude app; on Windows it copies the list. Sent items are marked, and later Sends cover only new and edited flags.
- When an item's model, size or colours change, its card shows **Changed**. The Changed filter lists only those, so later passes check just the fixes. **It's fixed** clears a flag. Editing a flag on a fixed item marks it as still wrong.
- The review is stored on the device and syncs through the existing Google sign-in, so a pass can start on the phone and finish on the PC.

## Applying a review

- **Sizes** set in a review are confirmed, so they stop being marked as guesses. Use the exact width and length sent.
- **A second colour always gets a part.** If a review sets a second colour on an item whose model has no part in that colour, the model should get one, so the colour shows. The Review screen says when this is the case, and Send marks the colour "not on the model yet".
- **Shared shapes:** when a fix is to a shape that other items share, check every item in that shape against its picture before changing it.

## What it reuses

- The 3D drawing in `map3d.js` renders each item into a small picture (`thumb` and `thumbs`), with the same models the map uses. This is the first piece of the 3D model editor's groundwork.
- A short fingerprint of each item's model, size and colours decides **Changed**.

## Status

Built.

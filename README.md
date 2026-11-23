# Pokopia Area Planner

Plan habitats, houses, residents and decorations for Pokémon Pokopia.

Open it at **https://adamspecial.github.io/pokopia-planner/** and, on a phone or tablet, use the browser menu → **Install app** / **Add to home screen**. It opens full screen and works offline, item pictures included.

The screen keeps to a few words. Most buttons are icons: hover over one, or long-press it on a phone, to see its name. Tap ⓘ, or a chip, to see the details behind it.

Notices appear at the bottom of the screen and stack: a new one slides in underneath and pushes the others up, so none hides another. Up to four show at once. Notices with a button, such as **Undo** or **Open it** for a new version, stay longest and are the last to make room, and pointing at one with the mouse keeps it open.

## Settings

The ⚙ button at the top right opens Settings; Plans has a Settings button too. Changes apply at once and are saved on this device only, so a phone and a PC can each be set up their own way. On a phone, Back closes Settings.

- **Appearance**: light, dark or system theme; an accent colour (purple, blue, teal, pink or orange); animations on, off or as the device sets them.
- **Map**: the 3D view (on unless you turn it off), grid lines (all, every 8 tiles, none), height shading on the flat map, pictures or simple shapes, portraits on homes, labels on zones and houses, every home's active area, and the info chips at the bottom.
- **Controls**: the default tool (Pan or Select), whether the mouse wheel zooms or scrolls (Ctrl + wheel zooms when it scrolls), tooltips on hover and long-press, vibration on Android, and a list of keyboard shortcuts.
- **Notices**: how long they stay (short, normal or long), and whether new habitats sparkle.
- **Layout**: the panel on the left or right and narrow, normal or wide on big screens; how far it opens on a phone when you tap a tab; and whether the app opens on the last tab you used or on Build.
- **Updates and offline**: ask before opening a new version, or open it straight away unless you're in the middle of something; check for updates; and whether pictures are saved for offline use, with a button to remove them and free up space.
- **Data**: how much space the app uses, a way to ask the browser to keep your plans safe when space runs low, a shortcut to Plans for backups and sync, and **Reset settings**.

## Moving things

The planner opens on **Pan**: drag to move around the map, pinch or use the mouse wheel to zoom, and tap anything to see its details. Tap it again to reach what's under it, and double-click a house to decorate inside. To open on Select instead, change **Default tool** in Settings.

To move things, pick **Select** (V). Tap any square of an item to select it, and drag it to move it: a dashed outline shows where it will go, and it moves when you let go. Squares that turn red hold small items it would replace. With any other tool except Pan, dragging the item you have selected moves it too. If the spot under your finger can't hold the item as it is, the outline shifts it or turns it so that it still covers that square, whenever that fits. Doors and windows turn to follow the wall. Kit homes take their residents with them. Rugs work the same way; tap a selected rug again to select the house or zone under it. An item that rests on a block keeps resting on whatever is highest where you drop it; one floating in mid-air keeps its level. Dragging from an empty square selects an area, as below.

**Which way items face.** Items have a front. Press Q while placing to turn what you're placing a quarter turn (Shift+Q the other way), or select an item and use **Turn left** and **Turn right** (or Q). Long items swap their width and length as they turn. Until you turn them, steps rise toward the block or wall next to them, and ladders, posters, wallpaper, shelves, beds, sofas and other things that stand against a wall put their back to it. Otherwise items face down the map. The flat map turns furniture and steps to match, and steps show an arrow pointing up them.

## Moving several things together

Select a group of things and they move, turn and copy as one, in a single step to undo.

- **Pick them.** In Select, drag from an empty square to select everything inside the box. With a mouse, Shift-click adds an item or takes it away and Shift-drag adds another area. On a phone, tap **Several** in the bar above the map, or **Pick several** on an item, then tap items in or out and tap **Done** when you're finished. **Select all of it** on a house picks its walls, doors and everything inside, and **Select what's in it** on a zone picks the zone's area. Ctrl+A selects everything.
- **Move them.** Drag any of them, or tap **Move** and then where they should go. A preview shows where everything lands: red squares hold small items that would be replaced, and a red outline means something is in the way. Arrow keys nudge them a square at a time, five with Shift. The group keeps its shape and its levels and settles on the ground where it lands, and items stacked on a selected item come along.
- **Turn and flip.** Turn left or right, or flip left to right or top to bottom (Q, Shift+Q, F, Shift+F). Doors and windows turn with their walls, and every item turns to face its new way.
- **Duplicate and copy.** **Duplicate** (Ctrl+D) puts a copy right next to the original and selects it, or asks where to put it when there's no room. **Copy** (Ctrl+C) lets you paste as many copies as you like, in any plan; while pasting, Q turns the copy and F flips it. Kit homes are copied with their interiors but not their residents.
- **What comes along.** Residents of a kit home or house that moves go with it, and so does a house's roof setting. A zone that lies wholly inside a selected area moves, turns and copies with it. With **Ground too**, which is on unless you turn it off, the floors, paths and water inside a selected area come along too and the gap is filled with the ground around it. Ground that matches its surroundings stays where it is.
- **The rest.** Up and Down a level, Make a zone, Delete and, for areas, Clear everything. Tap a kind in the list to leave all of that kind out of the selection.

In **Decorate**, tapping a suggestion folds the window into a small bar under the map and centres the house, so you can see where the item goes. Once you've placed it, the window opens again where you left it. The bar's buttons bring it back early or close it.

## Levels and layers

Every block has a level, terrain included, and each level of a square holds one thing: a terrain block, a wall block or an item. Terrain starts at level 0, so the ground floor, where things stand on the ground, is level 1. Levels go from −99 to 99.

**Terrain** stacks like any other block. Place soil, grass, sand or any terrain on a square and a new block goes on top, one level up, so you build hills by stacking and plateaus by filling an area again. Choose **Paint** in the Place or Fill bar to swap the top block's material instead, at the same level, for recolouring an area. Erase takes the top block off, so erasing level 0 digs a hole; put a floor lower down for a basement or a dug-out room. In 3D, hills and pits are real heights. On the flat map they're drawn lighter the higher they are and pits darker, with a shadow along each drop and ▲ or ▼ with the height when you zoom in. There is no Height tool any more: a 2-level rise of terrain inside a zone is what counts as a "High-up location".

Everything you place goes on top of the highest block at that spot: terrain, items, rugs and kit houses alike. The outline shows where it will land before you tap.

**Items** go on top of the highest block, terrain or a wall, fence, hedge or block, and never on top of another item. Pick a lamp, a plant or any other item and tap a square: it stands on the terrain, or on top of a wall or block, drawn a little smaller with a shadow and its level badge. Kits on a wall or block are drawn full size instead, with the shadow and badge, so you can see the squares they really cover. If an item already stands there, a small one is replaced (its square shows red) and a bigger one is in the way; tables, shelves and chests don't hold items any more.

**Blocks** stack on anything. Tap a block, wall, fence or hedge onto another one, onto raised terrain or onto an item, and it goes on top, so tapping the same square three times builds a wall three high, and a block tapped onto a refrigerator sits on the refrigerator. Dragging puts one block on each square you pass over. Things resting on the terrain are drawn as they are; raised blocks are drawn full size with a shadow, and the first block of each run carries its level badge (+3, −1).

**Heights.** Every item takes up levels as well as squares. Most take 1. Tall ones take more, such as a refrigerator, closet, bookcase, vending machine or streetlight (2), a berry tree (3) and kit houses (2 to 6 by size), so a block placed on them sits that much higher and nothing else fits in the levels they fill. Rugs, the Slowpoke rug and the Charizard rug take none: they lie on the block under them and furniture stands on them. Rugs have a level like everything else, so a rug can lie on a pillar or a raised floor; select one to move it Up or Down. The heights are guesses from the item pictures, shown with a ?, until you set them: select the item and use **Resize**, or **Change its size** while placing, to set its width, depth and height. Your heights apply to all your plans and sync with your sizes.

**Sizes.** Many items have no known size on record yet. Until you set it, the planner places such an item as 1×1 and shows its size with a ?, so you can see which sizes to check before you trust a layout. **Sizes** on the Build tab lists every unset size under **Guessed**: tap the right size once and it applies to all your plans and syncs.

**Layers** works like the layers in a drawing app: each level is a layer with its own terrain and items, with the rugs and a switch for all terrain below them. Open it from its tab, from the layers button by the zoom controls, or with L. The list shows the levels you've used, plus one free level above and one below; **Go to level** jumps to any other. On a PC, Page Up and Page Down step the level you're working on.

- Tap the eye to hide or show a layer. Hidden layers aren't drawn and can't be tapped, selected or erased, but they still count for houses, habitats and comfort. The layers button gets a dot while anything is hidden. Each device remembers what you hid in each plan.
- Tap a level to work on it. Place and Fill then put everything on that level, even in mid-air; Erase only takes from it; Select picks its items first; and everything above it fades out, so you can see into a basement under the ground. Tap it again, or tap **On top**, to go back to stacking. The **Level** menu in the Place and Fill bar is the same choice.
- On a chosen level, **Keep** leaves what's already on that level and skips those squares, and **Replace** takes it away, terrain too. Squares that will be replaced show red in the outline. Whenever something is in the way, the message offers **Replace** for the squares it skipped.
- Copy, Clear and Up/Down on a selected area leave hidden layers alone, and a saved picture leaves them out.

Select an item and use **Up** and **Down** to change its level, for a loft or something hung up high. Select an area to move everything in it up or down together. Tap a selected item again to select what's under it. Moving an item or a wall carries what's on it. Erase takes whatever is on top first. Taking away what's underneath leaves the item where it was, floating, as the game does.

Plans saved before terrain had levels open with their heights turned into stacked terrain and every item raised to stand on it, so houses, habitats and residents stay as they were. Plans saved before items had heights open with every tall item grown to its height wherever there's room above it, and keep anything already resting on a table or shelf where it was. Open the planner once on each device so it updates: an older copy can't open plans saved by this one, and it drops item heights when it saves.

Height decides what counts:

- **Making a house:** found on whatever level its walls stand, on the ground, on a hill or in a basement, with terrain counting as wall. The 3 kinds of furniture have to stand inside the walls at the door's level. A kit house needs 3 different kinds on the floor with its door.
- **Comfort and favourites:** anything in the active area counts at its own height, from 4 levels below to 3 above the door. That includes things just outside the walls, on a loft, on a block or on top of a wall.
- **Light, warmth and humidity:** only what's inside the walls, from 1 below to 3 above the floor (see below). Things on top of walls never count.
- Items on top of walls don't break the house. Habitats only count items standing on the ground.

## 3D view

The map is 3D. It opens looking straight down, so it reads like a floor plan, and you can tilt and turn it to see heights, walls and what's inside. It's the same plan, drawn with simple shapes so it stays quick on a phone:

- Terrain, floors, walls and blocks are cubes. Their tops show the floor and terrain pictures when **Pictures on the map** is on, and flat colours when it's off. Water, lava and hot springs are see-through, and the grid follows **Grid lines** in Settings.
- Each kind of item has its own simple shape, in its own colours, made of a few boxes, cylinders, cones, balls and slopes: steps are three treads, chairs have a seat, back and legs, beds a pillow and blanket, lamps a post and a light, trees a trunk and leaves, barrels and pots are round, and roof pieces slope. Kit houses have walls, a roof, a door and windows. Doors and fences are thin, windows and glass are see-through, and rugs lie flat on the floor.
- Flat things show their picture: rugs and mats on top, posters, paintings, signs and boards on their front. Posters, wallpaper, clocks and other wall items hang on the wall behind them. With no wall, wallpaper lies flat on the floor and other wall items stand on a post. When you zoom far out, pictures turn to plain colour and the outlines fade, as on the flat map.
- Hidden layers aren't drawn.

Moving around:

- **Tilt** with the tilt button or T, to switch between looking straight down and looking from an angle. With a mouse, drag up and down with the right button to tilt anywhere in between.
- **Turn** a quarter turn at a time with the turn button (Shift turns it the other way), or with , and . on a keyboard. On a phone or tablet, twist two fingers; with a mouse, drag sideways with the right button. When you let go, the view settles on the nearest quarter turn.
- Drag to pan, and pinch or use the wheel to zoom, as on the flat map. Fit, Zoom in and Zoom out work the same way.

Every tool works in 3D, the same way as on the flat map:

- **Previews are see-through.** What you're placing shows its shape where it will land, facing the way it will face, at its own level and height, with an outline on the squares it covers: in the accent colour when it fits and red when it doesn't. Things it would replace turn red. Moving an item or a group shows it at its new spot, with the old spot outlined.
- **Drags stay at one height.** A stroke, a filled area, a zone or a move follows the height of the surface where you started it, so dragging across a hill or a wall doesn't jump between levels.
- **Zones, homes and labels.** Zones, active areas, Community box reach, item reach and the outline of where a Pokémon can go are drawn over the ground. Zone and house labels, kit badges and resident portraits float above them.
- **Seeing inside.** In a tilted view, walls, roofs and anything else standing in front of the pointer and higher than where it points turn see-through around it, so you can see and work behind them. Taps go through the see-through part too. To pick one of those walls, point at it from outside first.
- **Levels.** When you pick a level to work on in Layers, everything above it fades and taps go through it, so you can see and build inside a basement or under a roof.

While you pan, zoom or turn, the 3D view draws at a lower resolution to stay smooth, and sharpens as soon as you stop.

**Save picture** (the Image button in Plans) saves the plan as you see it in 3D, turned and tilted the same way, with zones, labels and portraits. Selections and previews are left out.

**The flat map.** Turn off **3D view** in Settings → Map to use the flat map instead, with height shading and level numbers. Its Save picture is the flat plan. The planner also uses the flat map on its own when the browser doesn't have WebGL 2 (Chrome and Edge do), or when the browser stops the 3D view. A notice then offers **Try 3D again**. Each device remembers how the 3D view was tilted.

## Reviewing items

Open **…/pokopia-planner/#review** to check every item's 3D model against its game picture. Items are grouped by kind, and each card shows the picture, the model on its footprint, and its size; dashed sizes are guesses.

- **Scroll past the ones that look right.** A card on screen for a moment counts as seen and loses its dot. The counters show how many are seen, flagged and changed.
- **Tap one that's wrong.** Set the right width, length and height, pick the main and second colour by tapping the picture, and say what's wrong with the shape. The model on the right shows the new size and colours, and you can drag it to turn it. Changes save as you go. **‹ ›** (or the arrow keys) move to the next item. If no part of an item's model uses the second colour yet, the panel says so; pick one anyway and a part in it gets added.
- **Send** lists the flagged items, ready to share into the Claude app on Android or to copy and paste on Windows. Items already sent are marked, and the next Send covers only new and edited ones.
- After a fix, the item shows **Changed**. Open it and tap **It's fixed**, or say what's still wrong.

Your review syncs with your other devices, like plans.

## Pokémon and homes

Every Pokémon has its picture from the game, the 3D model the Pokédex shows. The planner uses one of three sizes, depending on the room:

- **Full picture and name:** Pokédex cards, the resident picker, the home chooser, the size dialog and the residents in Decorate.
- **Portrait and name:** list rows, resident chips, habitat lists, the house and kit home lists, the housemate groups and the drag label. A portrait is a circle cropped around the face.
- **Portrait only:** where there is no room for names. That means the small bubbles on homes on the map (from about 10 pixels per tile), the drop tray and stacks of more than a few faces. Hovering or long-pressing them shows the names.

Names without a picture stay only inside sentences, such as warnings, decorating tips, toasts and tooltips, where a picture would break the line of text.

The planner frames each portrait automatically around the face. It looks for the eyes (a dark pupil next to a bright highlight) and for the eyes and mouth standing out from the smooth body, preferring the top of the Pokémon. That works for most of them but not all. To fix one, tap its picture on a Pokédex card: drag the circle onto the face and zoom with the slider, the mouse wheel or two fingers. **Automatic framing** puts it back. Your framing applies to all your plans and syncs with your sizes.

The **Pokémon** tab lists every Pokémon in the game. Search it by name, type, specialty, likes, ideal habitat, flavour or Pokédex number. Every word you type has to match. To search one thing only, start a word with `type:`, `spec:`, `likes:`, `ideal:`, `flavour:`, `hab:` (habitat), `home:` (the home it lives in), `size:` or `no:`. "Quotes" keep a phrase together, and `-` in front of a word leaves those Pokémon out. For example, `type:water -spec:water` finds Water types that can't water plants.

**Filters** narrow the list by:

- status: in your habitats, waiting for a home, has a home or has none
- Pokédex: Main, Bubbly Basin or Event
- type, specialty and likes (choose whether any or all of the ones you pick must match)
- ideal habitat, size and flavour
- the habitat that attracts them

Each choice shows how many Pokémon it would leave. You can sort by number, name, size, height, weight, number of habitats or number of specialties, and switch between full cards and a compact list. The planner remembers your filters, sort and view on that device.

To move a Pokémon into a home, drag it onto the home. Drag by the dots beside its name, or drag the whole card with a mouse. On a phone you can also long-press a card. Drop it on a kit house or a house you built on the map, or on a home in the tray that opens at the bottom of the map. On a phone the panel slides down while you drag and comes back afterwards. A green outline means it fits; red means the home is full, it lives there already, or it's too big for a den. Tap the dots instead to pick a home from a list, with the best housemates first. Undo puts it back.

Large Pokémon take up 2×2 tiles, so a house you built needs a door 2 wide for them and paths 2 tiles wide inside. Steps and rugs count as path. When a large one lives there, the house's Residents section warns if the door is too narrow, or if it can't reach a large rest item. It also warns if a large Gather Pokémon can't reach a Community box, or a large Burn Pokémon can't reach a smelting furnace.

## Pictures

Furniture, storage, shelves, lamps and appliances show on the map, and in kit rooms, as top-down symbols of their kind (a bed with its pillows, a sofa with its cushions, a stove with its burners), in the colour of their pictures. Decorations, dolls, fossils, plants, kits and other one-off items show as their own pictures. Building pieces are drawn from above and joined to the pieces next to them, so homes read as floor plans: walls, blocks, cube hedges and pillars as solid walls, fences as rails with posts, doors as a door in the wall and windows as glass. Their colours come from their pictures. Floors and terrain cover the ground as flat, top-down tiles made from their pictures. A rug is one item with a size, like furniture: a tap places one whole rug, drawn once across its footprint, with the floor kept under it and furniture standing on it. Rug sizes are guesses until you set them with **Change**, which can also resize the rugs already placed. When you zoom far out, squares shrink to the tile's colour, and an item keeps its drawn shape until its picture has loaded.

**Pictures off.** Turn off **Pictures on the map** in Settings and every item is drawn as a simple shape in one or two colours taken from its picture: a mug, a guitar, a Poké Ball, a fossil, a sign, a house on a kit's card. Similar items share a shape in their own colours. Long items such as tables, beds, benches and boats stretch when you resize them; the rest keep their proportions, and a faint patch in their colour marks the whole footprint, as it does under pictures. Floors and terrain become seamless patterns (grass, sand, planks, tiles, bricks, stripes, dots and the like), rugs become rug shapes, and wallpaper patterns the walls in Decorate. The same shapes stand in whenever a picture hasn't loaded or can't, and with pictures off the map doesn't download any. Each item's shape and colours are its `lk` in `data.json` (a shape name, then one or two colours); the shapes themselves are short drawing recipes in `LOOKS` in `app.js`.

The pictures live in `pics/` inside the app, so they show without internet: items in `pics/`, floor tiles in `pics/top/` and Pokémon in `pics/pk/`. The first time the planner opens, it saves all of them on the device in the background (about 11 MB). The Plans tab shows how far it has got.

`tools/pictures.py` copies them from Serebii and makes the floor tiles (`pics/top/`) from them in one batch. Most floor pictures are the same 3D cube drawn from the same angle, so one calibration unwarps the top face of all of them; water is cropped instead. In `data.json`, an item's `im` is `1` when Serebii names the picture after the item, or Serebii's own file name when that differs, such as `stylishwall(upper)`. A Pokémon's `im` is Serebii's file name for it, usually its National Dex number (`001`), or a form such as `978-tatsugiridroopyform`. The tool saves Pokémon pictures as WebP and works out each portrait's automatic framing, kept in `pics/index.json` as the centre and size of the circle in thousandths of the picture. GitHub runs the tool for you (`.github/workflows/pictures.yml`) whenever `data.json` changes, once a week to retry any that failed, or from **Actions → Pictures → Run workflow**.

## Reach, limits and problems

The **Show on the map** button by the zoom controls (S) turns on what's drawn over the map:

- **Active areas** (A): the dotted line around each home. Everything inside it counts for that home.
- **Reach**: how far these items work in the game.

  | Item | Reach |
  |---|---|
  | Sprinkler | Waters fields within 5 tiles, counted along each axis and added up (61 tiles) |
  | Smooth Rock | Dries within 4 tiles, from 1 level up to 2 down |
  | Bubble machine | The 3×3 around it |
  | Floor switch | A 5×5×5 cube |
  | Wall switch, Card reader | A 7×7×7 cube |
  | Laser sensor | The 2 tiles in front of it, shaded darker, and the cells it switches beside, behind and above and below it |
  | Berry trees | The 8 tiles around it, 6 of which catch its berries |
  | Transmitters | 10 tiles to items and generators, 15 to other transmitters, up to 5 levels up or down |
  | Generators | A transmitter within 10 tiles, counted from the kit's front-left tile |

  The selected item always shows its reach, with a label, and so does an item while you place it.
- **Fields**: each crop and farm-soil tile turns blue when it's watered, orange when it's dry, brown when a Smooth Rock dries it, and red when it can't be watered (lava beside it, or under water with no bubbles). Each sprinkler gets a green dot when it runs and a red one when it has no water.
- **Power**: how transmitters link to their generator (solid line), to each other (dashed) and to their items (dotted). Each item that needs power gets a green or red dot, and each network a label such as "12 of 25 power". Selecting a generator, transmitter or powered item always shows its network.

An item's info and its panel say what it does in the game: how much power it makes or uses, what a switch or sensor works, how far a liquid flows and whether it waters fields, and how many days a crop or plant takes to grow.

The **Materials** tab ends with **Limits**: how many of the things the game caps per area this plan has, against each cap. Over a cap, a **⚠ problem** chip appears at the bottom left of the map, even when the info chips are off. Tap it to see what's wrong.

The game decides some things by the order you build them, such as which transmitter an item joins. The planner keeps items in the order you placed them, saved with the plan. Moving an item counts as placing it again.

The rules behind all this, with their sources, are in [the research report](reports/Pokopia%20liquids%20sensors%20and%20crops.md), and [plans/World mechanics.md](plans/World%20mechanics.md) is the plan for the checks still to come.

## Fields and crops

A crop grows one stage at 5:00 each day it's wet. It takes 3 stages to ripen, so it's ripe in 3 days. A Grow Pokémon living nearby adds a stage a day, which makes it 1 day; more than one adds nothing. After harvest, beans, tomatoes and potatoes fruit again a day later, while wheat starts again from seed. A crop's panel says whether it's wet and why, and how many days it has left.

A field is wet when any of these waters it:

- **Still water beside it:** water, ocean water or hot-spring water on a tile right next to it (not diagonal), level with the crop or with the soil under it. Muddy water and lava never water anything. Lava next to a field stops it being watered at all.
- **A running sprinkler** within 5 tiles, counted along each axis and added up. A sprinkler runs only with water within that reach at its own level or one below. It still works buried up to 2 levels under the field, and it only adds its 100 humidity while it runs.
- **Rain**, when the weather is set to rain and nothing roofs the field.
- **A Water Pokémon with a water basin:** one living nearby, with a water basin in its home's area. The game's reach isn't known, so the planner uses its home's area.

Under water, a crop needs bubbles instead: a powered Bubble machine within 1 tile, or a Water Pokémon living nearby.

A **Smooth Rock** dries the top block within 4 tiles, from 1 level above it to 2 below. A block in between shields what's under it, and crops in planters are left alone. The rock stops in rain, or when a running sprinkler reaches it. Its panel says how many field tiles it dries.

Dry crops, crops a Smooth Rock dries, crops that can't be watered and sprinklers with no water all show in the **⚠ problem** list.


The planner works out power the way the game does:

- **Generators:**

  | Generator | Power |
  |---|---|
  | Mini generator | 5 |
  | Windmill | 10, or 20 on high ground |
  | Waterwheel | 20, while liquid touches it |
  | Furnace kit | 30, assumed fuelled |

  Tick **High ground** in a windmill's panel when it stands 45 or more tiles above the map's floor (47 in Rocky Ridges).
- **Using power:** each item that needs power uses 1, except string lights and surface lights, which use none.
- **Reach:** distances count tiles along each axis and add them up, and nothing links across more than 5 levels.
  - A generator links to one transmitter within 10 tiles, counted from the kit's front-left tile, and each transmitter takes one generator.
  - Transmitters within 15 tiles of each other link and share all their generators.
  - Each transmitter powers up to 20 items within 10 tiles.
- **Order matters.** As in the game, an item joins a transmitter when it's placed, so the planner goes through things in the order you placed them. An item joins the nearest transmitter in reach that has room. A new transmitter picks up items nobody has yet, nearest first.
- **Overload:** when a network uses more than its generators make, everything on it goes off.
- **Wires:** a utility pole's wire to another pole or to its generator is a straight line. A block in the way gets a warning, since the wire only works if it was strung first. Wireless transmitters ignore walls.
- **Kit houses:** dens, huts and tents only take power from a mini generator inside. Cottages and houses also take it from a transmitter within 10 tiles, and then everything inside is powered.

Each item's panel says whether it has power, from which network, and if not, why: too far from a transmitter, every transmitter in reach full, no generator, or the network overloaded. Lights and appliances without power add no light, warmth or humidity. Overloads, items without power, generators with no transmitter and blocked wires show in the **⚠ problem** list, and **Show** takes you to each one.

## Light, warmth and humidity

Every Pokémon has one ideal habitat: Bright or Dark, Warm or Cool, Humid or Dry. These are three separate scales, so one home can be warm and humid at once. Each home's inspector shows where it sits on each scale, which residents it suits, what to change, and what counts. A habitat's inspector shows the same for the Pokémon it attracts.

Every item, and every tile of water, lava, ice or grass, carries light, warmth and humidity points. A home adds up the ones that count for it. The points and rules come from one player's in-game tests: each value was checked against how the residents reacted ([あかるい・くらい](https://note.com/ccopedia/n/ndadc82daf39f), [あたたかい・すずしい](https://note.com/ccopedia/n/n4b1e798887df) and [うるおい・乾そう](https://note.com/ccopedia/n/n48ddc4e1afbd) on note.com, October 2026). The placement rules agree with [ぽこポケ学会](https://kyu49.github.io/Pokopia/house/). Items those tests didn't cover are marked *untested* and are the planner's guess.

**What counts where**

- **A habitat**: light and humidity count everything in its dotted area, from 4 levels below to 4 above; warmth only from 1 below to 3 above. Walls don't block a lamp's light. Daylight is 90 × tiles open to the sky ÷ every tile of the area, so an open habitat starts at 90. A block with a gap under it, or a roof piece, covers the tile below it. Once a Pokémon moves into a house, the house's environment counts for it instead.
- **A house you built from blocks**, or a kit built from blocks such as the coloured huts and cottages and the log cabin: only what's on the floor inside the walls or on a door tile counts, from 1 level below to 3 above the floor. Each item counts at its own level, so a lamp on a block counts and one raised 4 up doesn't. The floor itself sits 1 below, so the floor of a tile dug 1 deep doesn't count, though what stands on it does. The walls, anything on top of or under them, and anything outside never count. Lights hung higher than 3 don't count either. Daylight is 90 × floor tiles open to the sky ÷ every tile of the house, walls included. That's 62 at most even in the biggest house (9×10), and 45 in a 5×4. A roof is any block 2 or more above the floor. Set how much is roofed with **Roof**; unset counts as open sky. Kits built from blocks count as roofed, and only their ground floor counts.
- **A kit house with its own interior**: everything inside counts, on both floors and at any height. There's no daylight, and windows, curtains, wallpaper and floors don't count.

**When a home is bright, warm or humid**

| | Habitat or house from blocks | Kit house |
|---|---|---|
| Bright / Dark | 100 or more / 60 or less | 40 or more / 40 or less (exactly 40 suits both) |
| Warm / Cool | +60 or more / −60 or less | the same |
| Humid / Dry | 100 or more / 30 or less | 40 or more / 60 or less (40 to 60 suits both) |

**Points**

- **Light:** lamps, streetlights, mushroom lamps, the bonfire and neon flooring add 80. Campfires, firepits, wall torches, the stone fireplace, paper lanterns, cube lights, vending machines and small stages add 40. Candles, pumpkin lanterns, gaming furniture and cyber flooring add 20. A beach parasol takes 40 off. The oil lantern, TVs and computers give no light.
- **Warmth:** a lit fire (campfire, firepit, wall torch, stone fireplace, bonfire), a cooking stove, the Fiery Magby statue, a Heat Rock, the furnace and an air conditioner on hot each add 60. So does each tile of lava. Molten rock and each hot-spring tile add 30; candles and each Lava rock block add 10. An Icy Rock, a refrigerator, a cooler, a fan, a ceiling fan and an air conditioner on cold each take 60 off. Ice, icicles, shaved ice and soda floats take 10 off. Lamps don't warm.
- **Humidity:** a filled water basin or bathtub, a humidifier, a Damp Rock, the funky diffuser, a working fountain, sprinkler or bubble machine and the hot-spring spout each add 100. Each tile of water, muddy water or hot spring adds 20, and so does a sink, shower or toilet, whether running or not. Every falling tile of a waterfall adds 20 too, so a fall 5 high makes a habitat humid on its own. Trees and the Chansey plant add 5; grass, flowers, hedges, crops and potted plants add 2.5. Each grass ground tile adds 1. The Castform charm adds 50 when turned to rain and takes 50 off when turned to sun. A Smooth Rock takes 100 off, but stops working in rain unless it's in a kit house. Harvested wheat adds nothing until it sprouts again, so a home kept humid by wheat gets a warning. Each dry grass tile takes 0.5 off. Rain itself adds nothing.

Fires count only when lit, and a Burn Pokémon lights them when its home is within 4 tiles: its habitat, its house or its kit. A fire with no Burn Pokémon nearby is listed under **Not counted**, and its panel says it isn't lit. The cooking stove and the Magby statue need no lighting. Lights and appliances that need power count only when they have it (see [Power](#power)); the planner assumes they're switched on. Tubs, basins and fountains count when filled or working, which the planner assumes.

**Weather.** Set the town's weather under **Weather** in the Plans tab: not set, rain or sun. In the game it only changes when a Pokémon uses a Rain Dance or Sunny Day spot, and then it stays. Rain turns Smooth Rocks off except inside kit houses, and can put out fires with no roof over them, though a Burn Pokémon living nearby lights them again. Rain itself adds no humidity. The air conditioner counts as set to hot or cold, whichever the residents want. Slowpoke's Yawn score is something else: it covers the whole town area, not one home.

**Decorate** and **Decorate inside** use all of this. Each resident's ideal gets a **Make it …** list of items that help. Suggestions that would spoil someone's ideal are marked ⚠ and drop down the list; for example, a lamp is marked if a resident wants it dark. Auto-place adds what's missing and leaves those out. The resident picker shows who already suits the home as it is.

## Sync between devices

Plans → **Sync between devices** → **Sign in with Google**, once on each device. Plans, item sizes and item reviews then stay the same everywhere: changes show up on your other devices within seconds, and edits made offline are sent when the device is back online. Each device keeps its own copy too, so the planner works the same without internet.

The plans are stored in Firestore, in the free Firebase project GM Companion already uses (`my-gm-companion`), under `users/<you>/pokopiaPlans` and `users/<you>/pokopiaMeta`, apart from GM Companion's data; its existing rules let only you read and write them. One-time step: Firebase console → Authentication → Settings → Authorized domains → add `adamspecial.github.io`.

If the same plan is changed on two devices before they sync, the newer version keeps the plan and the other is kept as a copy named "from another device" or "from this device", so nothing is lost. No copy is made when both versions are the same, or when the other version is one this device sent itself. Windows of the planner open on the same device keep each other up to date. When there are copies, **Plans** shows how many, and **Remove copies** deletes the ones older than their plan, on every synced device. Copies newer than their plan, or with no plan left under that name, stay.

Game data compiled from Serebii, Game8, Bulbapedia, Pokopia Academy and the r/Pokopia "Who can fit in a den?" sheet. Item and Pokémon pictures from Serebii.net.

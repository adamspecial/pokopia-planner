# World mechanics

Bring the game's hidden systems into the planner: how liquids flow, power and switches, crops and watering, weather and fire, and what specialties do around a home. The facts, sources and open questions are in [the research report](../reports/Pokopia%20liquids%20sensors%20and%20crops.md).

The planner checks a layout and draws overlays. It doesn't run the game. Every rule in the game is a whole-tile rule (a reach in tiles, a box, a daily tick, a sum of points), so a flood fill, a distance test or a box overlap covers nearly all of it. Each check says how sure it is (tested, guide, or unverified), and the rules that sources disagree on become settings.

## What it adds

- **Liquids:** pour a liquid from a source tile and see where it gets to. Water, ocean, mud and hot-spring water reach 25 tiles along a 1-wide channel and lava 12. The count halves at low level and starts again below every drop. Falls are worked out from the shape of the ground, and mud makes everything downstream muddy.
- **Power:** which generator feeds each item, which items are powered, and when a network is overloaded and goes dark.
- **Switches and sensors:** what each input reaches and what it does to each door, light or machine it reaches.
- **Crops:** which fields are wet, what each sprinkler covers, what Smooth Rock dries, and how many days until a crop is ripe.
- **Weather and fire:** a rain or sun setting for the plan, and which fires stay lit.
- **Environment:** the measured light, warmth and humidity rules applied to habitats as well as houses, counting only items that are lit or powered.
- **Specialties:** where Litter Pokémon drop things, whether processing Pokémon have a box to work from, and where berries fall.
- **Game limits:** counts against the per-area caps.

## How it fits what exists

- **Liquids stay terrain.** Liquids are already painted as terrain tiles on each level, and the 3D view already draws them see-through. Pouring adds a short list of sources to the plan. Each flow tile remembers its source, so deleting a source removes its whole flow, as in the game.
- **One overlay style.** Ranges use the dashed outline already drawn for community-box reach, in the 2D map and as see-through boxes in the 3D view.
- **Facing is already stored.** Items already keep their facing, which the laser sensor and berry trees need.
- **Placement order.** In the game, the transmitter a device joins is fixed when the device is placed. Each object gets a placement number, renewed when it's moved, so the planner can follow the same rule.
- **Environment.** The light, warmth and humidity check already adds up the measured values for houses. It gains habitats, and the lit and powered states.
- **Item facts go in `data.json`:** power draw and output, input and output roles, liquid flags (waters crops, reach), and crop growth. The code reads them instead of keeping hand-written lists.
- **Checks run with the habitat check.** They run when the map changes and only for what's on the map, so the map stays fast.
- **No new tab.** Results show in the item panel, in a **Systems** menu of map overlays, and in a problem chip in the bottom bar that opens a list of what's wrong.

## Liquids

- **Five liquids:** Water, Ocean water, Muddy water, Hot-spring water and Lava. **Waterfall** stays in the paint list so older plans still open, but it now means falling plain water. Any liquid that drops a level makes a fall, and each falling tile adds +20 humidity.
- **Pour or paint.** Paint stays for copying what's already in the game. **Pour** is a new option for liquids: tap a tile, set normal or low level, and a preview shows where the liquid reaches before you commit it. Reach is:

  | Shape | Water, ocean, mud, hot spring | Lava |
  |---|---|---|
  | 1-wide channel | 25 tiles (12 at low level) | 12 tiles (6 at low level) |
  | 2-wide channel | 10 tiles | — |
  | Open ground | about 6 tiles across | — |

  Liquid leaks between blocks that touch only at a corner, and closed doors stop it. A normal-level source within 4 tiles of a drop runs straight to that drop.
- **Honest wording.** The real shape depends on the order things were built, so the panel says "should stop around tile 24", not an exact edge.
- **Where liquids meet:**
  - Water that flows over mud turns muddy below that point.
  - A later flow covers an earlier one but never covers a source.
  - Lava next to water gets a note that Water Gun turns it into black rock.
- **Placement:** liquids can't go inside kit houses. A block placed on a source removes its flow.

## Power

- **Item data:**

  | Kind | Items | Power |
  |---|---|---|
  | Generators | Mini generator | 5 |
  | | Windmill kit | 10, or 20 on high ground |
  | | Waterwheel kit | 20, while liquid touches its gear |
  | | Furnace kit | 30, while it has fuel |
  | Transmitters | Utility pole, Wireless power transmitter, Wireless power-transmitter post | — |
  | | The switch versions of the transmitters | — |
  | Devices | Every powered item | draws 1 |
  | | String lights and Surface lights | draw 0, but still take one of a transmitter's 20 places |

- **Networks:** distance counts tiles along each axis, added up (|Δx| + |Δy| + |Δz|), and counts from a pole's or kit's foot tile.
  - A generator connects to a transmitter within 10.
  - Transmitters connect to each other within 15.
  - A device connects to a transmitter within 10.
  - Nothing connects across a height difference of 6 or more.
  - Each transmitter takes one generator and up to 20 devices.
  - Connected transmitters share all their generators.
- **Overload:** when a network draws more than it gets, everything on it goes off, as in the game.
- **Pole wires:** a block in the straight line between two poles, or between a generator and a pole, gets a warning. Wireless transmitters ignore obstacles.
- **Buildings:** kit dens and huts can't take power from outside, but a mini generator inside powers everything there. Large houses take outside power and pass it to everything inside.
- **On the map:** the Power overlay draws lines from each transmitter to its generator, to other transmitters and to its devices. Each device gets a green or red dot. Selecting a transmitter shows its reach.
- **In the panel:** a device shows its network, supply and draw, and why it's unpowered, such as "11 tiles from the nearest transmitter" or "network overloaded, 23 of 20".
- **Environment:** items that work "when powered and on" stop counting when they're unpowered.

## Switches and sensors

- **Inputs:**

  | Input | What sets it off | What it reaches |
  |---|---|---|
  | Laser sensor | Any change in the tiles in front of its red face, 2 ahead by default | 11 cells: left, right, behind and its own column, each one level down, level and one up |
  | Floor switch | Weight on it | A 5×5×5 cube. Opens the doors in it, then closes them all soon after you step off |
  | Wall switch, Card reader | You press it or use a card | A 7×7×7 cube. Toggles everything in it |

- **What responds:** doors and windows (their whole size), powered appliances and lights, switch transmitters, the mini floodgate, music mats, the tidal and clear bells, and the Fiery Magby statue.
- **Panels:** an input lists everything it reaches and what each one does. A door, light or machine lists the inputs that reach it.
- **Warnings:**
  - A target that needs power but has none.
  - A sensor with nothing in front of it that can move, such as liquid, a door, toy blocks or a path Pokémon walk.
  - A sensor watching only another sensor, which never fires.
  - Hatch windows, shutters and simple curtains in a circuit, which wandering Pokémon can open.
- **On the map:** the Signals overlay draws each cube on every level it covers, with the level range in its label, and as a see-through box in 3D.
- **Not simulated:** timing, clocks and the order the game handles things in. The panel says a circuit "should work", never that it will.

## Crops and plants

- **Wet or dry:** the Water overlay colours farm soil and crops. A field is wet when:
  - still water, ocean water or hot-spring water is directly beside it at the same height. Mud, lava and flowing water don't count.
  - a sprinkler is within 5 tiles, counted along each axis and added up (61 tiles, its own included), and has water at its own height within that reach. It still works buried.
  - the weather is set to rain and the field has no roof over it.
  - a Water Pokémon with a filled water basin lives nearby. Its reach isn't known, so the planner uses its home's area and says so.

  A field fails if lava is beside it. Underwater crops need bubbles from a powered Bubble machine (3×3) instead.
- **Smooth Rock** dries a 41-tile reach out to 4 tiles, from 1 level up to 2 down, and only the highest block there. It stops in rain or under a working sprinkler. Fields in its reach get a warning.
- **Growth:** a field's panel shows how long until it's ripe, such as "3 days, or 1 with a Grow Pokémon". Every crop grows one stage at 05:00 if it's wet, plus one from a Grow Pokémon, and extra Grow Pokémon add nothing. After harvest, beans, tomatoes and potatoes take one more stage, while wheat starts again from seed. A Fresh veggie field needs 8 fields.
- **Humidity:** crops count from the sprout stage. Where a wheat patch decides whether a home is humid, the panel adds "drops to X after harvest".
- **Berry trees:** each tree's six drop spots follow its facing. Spots in water or under an item get a warning, and the panel notes 1 berry an hour, up to 3.

## Weather and fire

- **Weather** is a plan setting: not set, rain or sun. It stays as set, because the game only changes it when a weather spot is used. Rain:
  - waters fields with no roof,
  - puts out fires with no roof unless a Burn Pokémon lives nearby,
  - turns Smooth Rock to 0, except inside kit houses.
- **Fire:** campfires, torches, candles and furnaces count as lit only when a Burn Pokémon lives in the same home, or in one whose area overlaps it. Otherwise they show "not lit", and their light and warmth don't count.
- **Not modelled:** fire spreading, falling blocks, melting ice and snow. The game has none of them.

## Environment

- **Habitats get light, warmth and humidity,** for the Pokémon that would live there:
  - light and humidity count everything in the dotted area from 4 levels down to 4 up,
  - warmth counts from 1 down to 3 up,
  - they're judged against the same limits as built houses.
- **Corrections:**
  - Crops count only from the sprout stage.
  - Planters count 0; the plant in them counts.
  - Each falling liquid tile counts +20 humidity.
  - Ocean water stays marked untested.
- **Lit and powered:** lit and powered states come from the fire and power checks, and items that are off don't count.

## Specialties

- **Litter:** the Drops overlay shows where each Litter resident's material lands:
  - for a kit house, the ring 1 tile around it, corners excluded;
  - for a built house, the floor plus 1 tile outside the walls.

  Tiles with no block under them, an item or liquid get a warning.
- **Processing:** a Chop, Burn, Crush or Recycle resident needs a community box near its home. The panel names the box it uses (the nearest) and what it makes:

  | Specialty | Makes |
  |---|---|
  | Chop | 1 log into 5 lumber |
  | Burn | 1 clay into 2 brick |
  | Crush | 1 berry into 5 paint |
  | Recycle | 1 garbage into 2 iron ore |

  A smelting furnace needs a Burn Pokémon close by.
- **Specialty descriptions:** fix the wrong ones. Collect trades relics and feathers, Gather Honey trades honey for furniture, Hype dances to DJ music, and Fly and Teleport take you to a Pokémon you're looking for.
- **Glass** can also be made from sandstone and volcanic ash.
- **Crowding:** more than 25 Pokémon in an area gets a warning. Pokémon asleep in kit houses don't count.

## Game limits

The Materials tab gets a **Limits** list showing this plan's counts against each per-area cap:

| What | Cap |
|---|---|
| Generators | 128 |
| Transmitters | 252 |
| Powered items | 1,024 |
| Field crops | 511 (576 on Cloud Islands) |
| Growing plants | 1,024 |
| Berry trees | 226 |
| Pointy trees | 251 |
| Furnaces and mixers | 128 |
| Workbenches and cooking tools | 128 |
| Community boxes | 32 |
| Lifts | 32 |
| Elevators | 32 |
| Cameras | 8 |

## Phases

Each phase is a release that's usable on its own, best-sourced first.

0. **Groundwork**
   - Item facts in `data.json`.
   - The Systems overlay menu and the problem chip.
   - Placement numbers.
   - The Limits list.
   - Data fixes: Training waterfall needs Water ×2, Glass inputs, and the specialty descriptions.
1. **Environment**
   - Habitat environment and the corrections above.
   - The weather setting, fire lit or not lit, and Smooth Rock in rain.
2. **Power**
   - Networks, overloads, the Power overlay and panels.
   - Unpowered items stop counting toward the environment.
3. **Water and crops**
   - Wet and dry fields, sprinkler reach and Smooth Rock reach.
   - Growth days, wheat harvest, and berry drop spots.
4. **Switches and sensors**
   - Input reach, targets, warnings, and the boxes in 3D.
5. **Pouring liquids**
   - Pour with preview, sources and low level.
   - Falls worked out from the ground, mud downstream, which flow wins, and corner leaks.
6. **Specialties**
   - Litter drop tiles, processing boxes and crowding.
7. **Finish**
   - Help text and the README.
   - A pass on Android phones and tablets and on Windows, in Chrome and Edge.
   - A speed check on a large plan.

## Decisions (recommended)

1. **Checks, not simulation.** No timing, clocks or frame order. Circuits are described as "should work".
2. **Disputed rules are settings.** A new **Game rules** section in Settings holds the 15 disputed rules from the report, each with its suggested default and why the sources disagree. For example: sensor reach 2, sprinkler reach 5, Smooth Rock reach 4, generator to transmitter 10, and a warning when a waterfall for a habitat is under 5 levels.
3. **Painted liquid counts as still water.** Only poured flows can be flowing, and only where they run toward a drop. This is a guess until it's tested in the game.
4. **Doors count as closed** for liquids and at the start of a circuit.
5. **Moving an item counts as placing it again** for the transmitter rule, as picking it up does in the game.
6. **Unmeasured reaches use the home's area.** Burn lighting, Grow, a Water Pokémon's basin and Generate are labelled "reach not measured".
7. **Crops are assumed to be growing** (past the sprout stage) unless the wheat-harvest note says otherwise.
8. **Windmills show 10 power.** A switch in the panel sets "high ground" for 20, since the planner doesn't know the map's height above the floor.

## Open questions

These are quick tests in the game, worth doing before the phase that needs them:

- How far a Burn, Grow, Water (with basin) or Generate Pokémon reaches.
- Ocean water's humidity, and whether ocean or hot-spring water waters crops and runs a sprinkler.
- Where lava comes in the order of which flow wins.
- Whether a fall of lava, ocean or hot-spring water counts as a waterfall for a habitat.
- Which water counts as flowing beside a field.
- The English names that match アツアツいわ and マグマいわ.

## Status

Phase 0 is done. Phase 0 added:

- the item facts, shown in each item's info and panel
- **Show on the map**, with a Reach overlay
- the problem chip and the Limits list
- placement order
- the data fixes

Phase 1 is done too. It added:

- light, warmth and humidity for habitats
- falling waterfall tiles counting
- the wheat-harvest warning
- the weather setting
- fires that count only when a Burn Pokémon lives within 4 tiles
- Smooth Rock turning off in rain

Phase 2 is done too. It added:

- power networks worked out in placement order
- overloads
- the Power overlay in 2D and 3D
- each item's power status and why
- the windmill's high-ground switch
- kit-house power
- blocked pole wires
- unpowered items no longer counting toward the environment

Phase 3 is done too. It added:

- the Fields overlay
- the watering rules
- running and dry sprinklers
- Smooth Rock drying fields
- days to ripe, with Grow Pokémon
- bubbles under water
- berry trees' drop tiles
- field problems

The exact six berry tiles weren't published, so the planner shows all eight. Phase 4 (Switches and sensors) is next.

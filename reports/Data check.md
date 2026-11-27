# Data check

Compares `data.json` with Serebii's lists, so new and changed game data shows up. `tools/data_check.py` writes it, and GitHub runs it every week.

Checked on 2026-11-27.

| | Serebii | data.json | New on Serebii | Different |
|---|---|---|---|---|
| Items | 1706 | 1258 | 22 | 0 |
| Materials | 60 | 70 | 6 | |
| Pokémon | 374 | 372 | 0 | 2 |
| Habitats | 257 | 257 | 0 | 14 |

## Items

Not compared: 329 music CDs, relics, slates, seeds, growth stages, dry or colour variants of items already here, and world clutter such as debris and deposits.

### On Serebii, not in data.json (22)

- Cofagrigus locker (furniture, Toy)
- Huge table (furniture)
- Grubby letter (misc, Toy)
- Grubby notepad (misc, Toy)
- Grubby book (misc, Toy)
- Grubby papers (misc, Toy)
- Grubby newspaper (misc, Toy)
- Grubby tablet (misc, Toy)
- Grubby cell phone (misc, Toy)
- Running shoes (misc, Decoration)
- Fun balloons (misc, Toy)
- Eerie statue (misc, Toy)
- Cooking utensils (misc, Decoration)
- Party cooking pot (other)
- Diploma (other, Decoration)
- Picnic blanket (other)
- Jump rope trophy (other, Decoration)
- Star mat (other)
- Hide-and-sneak trophy (other, Decoration)
- Swampert squad rug (other)
- Ocean pals rug (other)
- Wig-Wug rug (other)

### Materials on Serebii, not in data.json (6)

- Mossy Stone
- Cotton Spores
- Watermelon
- Grubby pearl
- Buried pearl
- Prism scale

### In data.json, not in Serebii's list (7)

- Bicycle
- Carrot field
- Castform weather charm (rain)
- House partition
- Pedestal
- Plated food
- Strength boulder

## Pokémon

### Specialty differs (1)

- Drednaw: Crush, Bulldoze here, Chop, Bulldoze on Serebii

### Other fields differ (1)

- Rotom (Stereo): types Electric/Ghost, Serebii Electric/Normal

## Habitats

### Recipe differs (14)

- 007 Illuminated tall grass: Tall grass (any) ×4, Lighting (any) ×1 here, Tall Grass ×4, Lighting ×10 on Serebii
- 010 Hydrated flower bed: Wildflowers ×4, Water ×2 here, Wildflowers ×4 on Serebii
- 019 Tantalizing dining set: Seat (any) ×1, Table (any) ×1, Plated food ×1 here, Leppa Berry ×1, Table ×1, Wooden Stool ×1 on Serebii
- 033 Creepy grave offering: Gravestone ×1, Eerie candle ×2, Plated food ×1 here, Eerie candle ×2, Gravestone ×1 on Serebii
- 047 Tree-shaded snoozing Snorlax: Large tree (any) ×1, Naptime bed ×1 here, Large tree ×1 on Serebii
- 061 Resting spot: Cardboard boxes ×2, Straw bed ×1 here, Cardboard boxes ×1, Straw bed ×1 on Serebii
- 062 Perpetual mess: Cardboard boxes ×2, Toy (any) ×2 here, Cardboard boxes ×1, Toy ×2 on Serebii
- 091 Working the register: Table (any) ×2, Cash register ×1 here, Table ×1, Cash register ×1 on Serebii
- 113 Open-air bath: Hot-spring spout ×1, Hot-spring water ×2 here, Hot-spring spout ×1, Hot-spring water ×1 on Serebii
- 170 Researcher's desk: Table (any) ×2, Computer ×1, Science experiment ×1 here, Table (any) ×2, Computer ×1 on Serebii
- 183 Top pop: Pop art bed ×1, Pop art sofa ×1, Pop art table ×1 here, Pop art bed ×1, Pop art sofa ×1 on Serebii
- 187 Hot-spring fishing spot: Fishing rod ×1, Seat (any) ×1, Hot-spring water ×1 here, Fishing Rod ×1, Seat ×1 on Serebii
- 209 Lovely ribbon cake: Seat (any) ×1, Table (any) ×1, Ribbon cake ×1 here, Seat ×1, Table ×1 on Serebii
- B012 Marine mossy rest spot: Sea moss ×4 here, Sea moss ×1 on Serebii

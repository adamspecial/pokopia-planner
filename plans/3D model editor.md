# 3D model editor

A simple editor for the 3D models of items: add basic shapes, merge and subtract them, drag their corners, and change an item's main and secondary colours. It has to be simple, intuitive and fast, with only the basic features.

## What it is

Any item gets an **Edit model** button, in its panel on the map and in its item info in the Build list. It opens a full-screen editor showing that item's 3D model at its size. You change it with a handful of tools and tap **Done**, and every copy on the map updates.

## How it fits what exists

- **Same shapes as today.** Each model is a short list of simple shapes in `map3d.js`, sized as fractions of the item's footprint and height. The editor edits that same list, so edited models still stretch when resized and turn with facing.
- **Shapes stay simple until you need more.** A shape keeps its size handles until you drag its corners or merge or subtract it. Then it becomes a free shape: a set of points and flat faces you shape by hand.
- **Edits are stored like custom sizes.** They're saved on the device, synced, and carried inside any plan that uses them, so shared plans look the same. **Reset** brings back the built-in model.
- **No cost at startup.** The editor is its own file and loads only when opened, like the 3D view.
- **A detail limit keeps the map fast.** Around 300 triangles per model, with a counter in the editor.

## The editor

- **View:** the model sits on a grid showing the item's width, depth and height. Drag to orbit and pinch or use the wheel to zoom, with buttons for front, side, top and angled views.
- **Toolbar** along the bottom, usable one-handed on a phone: Add shape, Move, Size, Turn, Colour, Merge, Subtract, Corners, Duplicate and Delete, Undo and Redo, Reset, Done.
- **Snapping:** everything snaps to a 1/16-block grid, and turns go in quarter turns like the map.
- **Colours:** two swatches set the item's **main** and **secondary** colour. Each shape uses main, secondary, a darker or lighter shade of either, or a fixed colour (wood, metal, glass, glow and so on). Changing the main colour recolours every shape that uses it.

## Phases

Each phase is a release that's usable on its own.

0. **Groundwork**
   - Split the 3D drawing core so the map and the editor share it.
   - Add the per-item model store: saving, sync, and carrying models in plans.
   - Check that every built-in model still draws pixel for pixel the same.
1. **Viewing and colours**
   - Open the editor; orbit, zoom and the preset views.
   - Tap a shape to select it.
   - Change the main and secondary colours, and each shape's colour.
   - Undo, Reset, and applying to the map.
2. **Shapes**
   - Add a box, cylinder, cone, ball or wedge.
   - Move and size shapes with drag handles.
   - Quarter turns, Duplicate, Delete.
3. **Merge, subtract and corners**
   - Join shapes into one, cut one shape out of another, and drag corners.
   - A small geometry routine does this in milliseconds on shapes this simple.
   - Free shapes get outlines only on their real edges.
4. **Finish**
   - **Use for every table** (or chair, or whichever kind the item is).
   - Keyboard shortcuts, help text and the README.
   - A pass on Android phones and tablets, and a speed check.

## Decisions (recommended)

1. **Scope:** edits apply to that one item, with "use for every [kind]" as an option, since many items share one shape (30 tables share one).
2. **The flat map:** changing the main and secondary colour updates it too, so both views agree.
3. **Turning:** quarter turns only. For other angles, drag corners.
4. **Free shapes:** once you drag corners or merge, that shape loses its size handles (Undo brings them back).
5. **Out of scope:** painting textures, smooth curves and animation.

## Status

Planned. Before it starts, every item gets a round-up of its built-in shape, size and colours.

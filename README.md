# AE 3D Align Tool

Dockable After Effects ScriptUI panel that mirrors the basic Align panel, but also aligns selected 3D layers through the active composition camera projection.

The panel uses compact embedded PNG icons instead of text labels. The icons are stored inside the `.jsx` as base64, so the panel is a single-file install.

## Install

1. Copy `AE_3D_Align_Tool.jsx` into the After Effects `Scripts/ScriptUI Panels` folder.
2. Restart After Effects.
3. Open it from `Window > AE_3D_Align_Tool.jsx`.

You can also test quickly with `File > Scripts > Run Script File...`, but it will open as a floating palette instead of a docked panel.

## Behavior

- Works on unlocked selected 2D and 3D layers.
- 2D layers align in normal comp space.
- 3D layers use the active comp camera projection. If the comp has no camera, After Effects uses its default camera behavior for `toComp()`.
- Active Add/Intersect-style masks are included in layer bounds, so masked layers align by the mask edges.
- Aligns and distributes in comp/screen X/Y.
- Preserves each 3D layer's Z position.
- Animated Position is supported: the tool writes/updates a Position key at the current comp time.
- Parented layers are moved through local Position adjustments derived from their projected comp movement.
- With one selected layer, Align uses Composition as the reference, even if the dropdown is set to `Selection`.
- `Align Layers to: Selection` uses the selection bounds when two or more layers are selected.
- Reference modes: `Selection`, `Composition`, `Safe Margins`, `First Selected`, and `Selected Camera`.
- `Safe Margins` uses a 10% inset from the comp edges.
- `First Selected` uses the first movable selected layer as the reference and moves the rest.
- `Selected Camera` temporarily uses the selected camera for 3D projection during the operation.
- Distribute requires at least three selected 2D/3D layers.
- Distribute horizontal/vertical center buttons use equal gap spacing between visible bounds; edge buttons distribute matching edges.

## Current limitations

- Camera, light, locked, separated Position, and expression-driven Position layers are skipped.
- Mask bounds are based on mask path vertices and tangent handles, not a rendered alpha scan.
- Selected Camera mode requires selecting a camera along with the layers.
- Because perspective projection is nonlinear, each move is refined a few times. It should land closely for normal layout use, but very extreme camera angles can need another click.

## Smoke test

1. Create a comp.
2. Add a camera, rotate/move it so the view is obviously perspective.
3. Add a mix of 2D and 3D text or solid layers, and place them at different X/Y/Z positions.
4. Select them and open the panel.
5. Use `Align Layers to: Composition`, then click horizontal center and vertical center.
6. Switch to `Selection` and test left/right/top/bottom align plus distribute buttons.

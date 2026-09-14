# ADURE portfolio — Places in our care

Implemented in the existing static homepage. Preview: http://127.0.0.1:4175/#portfolio (or choose Portfolio in the homepage navigation).

## What ships

An original, interactive Three.js architectural model replaces the photographic portfolio rail. The other nine homepage sections are unchanged. The native HTML/CSS/ES-module stack is preserved; there is no build step, map subscription, credential requirement or runtime CDN request.

The composition pairs a numbered editorial index with an expansive pale model and one photographic details area. Abu Dhabi, Dubai and Al Ain each have an independent illustrative scene. Coastal, canal and garden treatments are visual studies, not maps of the cities. Selecting a list entry, marker or blue building highlights the model in cyan, updates the photo and details, and replaces any ongoing camera movement. City changes fade between models. Reset clears selection. Zoom and rotation are bounded; mouse drag rotates. No wheel interception, touch dragging, scroll pinning or automatic orbiting is used.

At 760px and below, the map appears before the collection, with a compact photo/details composition below. Normal one-finger page scrolling is preserved. The map controls remain explicit. All entries and actions are available through semantic HTML buttons and the list mode, with focus outlines, pressed states and concise announcements. No property-specific URL is approved, so the action leads to the existing contact section.

## Rendering and source assets

- Three.js **0.180.0**, vendored from the official npm package. `dist/vendor/THREE-LICENSE.txt` retains its MIT licence. The two runtime modules total approximately 720 KB before HTTP compression.
- Original procedural geometry: extruded land, a quay, water/canal surfaces, streets, pavements, courtyard blocks, stepped terraces, towers, rooftop volumes and faceted vegetation. Repeated context buildings and vegetation use instancing. No proprietary reference-site models or textures are used.
- Five existing photographs from the supplied ADURE company profile, page 11: `architecture-waterfront`, `architecture-curves`, `architecture-facade`, `architecture-courtyard`, and `architecture-horizon`. Existing descriptive captions and alt text are reused. Their associations with cities and model buildings are explicitly illustrative.
- Existing Fira Sans / Source Sans Pro, blue #004789 and cyan #00B7F1 tokens.
- The live [Belgrade Arbor location interface](https://belgradearbor.rs/en#Around) was inspected through West 65 and Airport City selections. Its connected list/marker/photo relationship informed the interaction; ADURE's visual identity and the model geometry are original. No reference image files were present with the pasted brief.

## Data boundaries

`dist/portfolio-data.js` separates `approvedProperties` (currently empty) from `demoProperties`. All demo latitude/longitude values, geographic origin and real-world scale are null. Names describe photographs; they are not verified building names. No neighbourhoods, property categories, geographic coordinates, asset counts or occupancy claims were invented for this section.

Scene coordinates use arbitrary model units, not metres. X is model east, Y is up, Z is model south. The origin is the composition's centre; there is no geographic conversion until a real georeference is supplied. `scenePosition`, `modelNodeId` and `cameraPreset` are separate from latitude/longitude. Markers attach to the corresponding model roofs; the selected marker receives priority if hit areas overlap. Occluded or offscreen markers hide, with the index always available.

## Implementation map

| File | Responsibility |
| --- | --- |
| `dist/index.html` | Portfolio chapter, city controls, details region, map controls and fallback markup |
| `dist/portfolio.css` | Scoped desktop, tablet, mobile, focus and reduced-motion styling |
| `dist/portfolio.js` | City/selection/focus/mode/loading state, HTML synchronisation, loading and failure recovery |
| `dist/portfolio-data.js` | Demo and approved record boundaries, independent city composition settings, camera presets |
| `dist/portfolio-scene.js` | Procedural models, instancing, lighting, bounded interruptible camera, projection, occlusion, rendering and disposal |
| `dist/app.js` | Old portfolio rail initialisation removed; existing gallery and all unrelated interactions retained |
| `scripts/check-portfolio.mjs` | Data integrity, image existence, model identity, camera alignment and approval boundaries |

The renderer imports within 450px of the section. Explicit interaction also starts it if a host delays intersection observers. It renders on demand, stops while offscreen/hidden/in list mode, caps device pixel ratio (1.75 desktop / 1.4 mobile at initialisation), and omits mobile shadows. Camera selection takes 1.15 seconds; entry takes 0.9 seconds. Reduced motion removes camera interpolation. City updates carry an epoch to discard stale transitions. GPU objects and handlers are disposed on permanent page departure and on failure. WebGL loss, unavailable WebGL and loading timeout show a useful fallback with retry; the collection remains usable. Missing photographs do not suppress the text or contact action.

## Browser verification

Tested in the Codex in-app browser on this Mac at **1440**, **1024**, **390** and **375px** widths:

- Real geometry and three independent city compositions render.
- Selection through the index, markers and keyboard; repeated Dubai selections during camera movement; shared pressed states and photo/detail updates.
- Zoom in/out, rotation and reset; reset clears selection.
- Map/list switching retains selection and provides the same details.
- Visible keyboard focus; Tab between city controls and Enter selection.
- Narrow screens have no portfolio horizontal overflow; small marker collisions were corrected.
- WebGL context loss switches to the fallback; changing selection still works; retry rebuilds one canvas and restores selection.
- Forced unsupported WebGL yields an accessible collection and no blank canvas. Missing-image behaviour preserves details and enquiry action.
- Reduced-motion **JavaScript branch** exercised with a controlled fixture: selection rendered at zoom 1.65 with no active animation. CSS reduced-motion rules were reviewed; an OS-level preference change was not performed.
- Existing content checks pass. A byte comparison confirms all nine surrounding sections are unchanged.

A 1.6-second desktop camera sample recorded **96 frame intervals**, mean **16.67ms**, maximum **17.7ms**, and maximum observed render/marker CPU time **4.1ms**. The sample reported **60 draw calls / 6,616 triangles**. These are measurements of this browser/host, not a guarantee for physical mobile devices. See `qa/portfolio/performance.json` and the captured PNGs.

A pre-existing header/page overflow was observed at 1024px, outside this section; the portfolio itself stays inside the viewport. Physical iOS/Android devices, screen-reader speech output and network-throttled hardware were not tested. No full city-level geographic accuracy is claimed. The loading timeout and empty-record copy are implemented but not independently fault-injected in this pass.

The repeatable browser fixture generator is `qa/portfolio/make-browser-fixture.py`. It temporarily creates `dist/portfolio-qa.html` with controls for context loss, missing images, camera measurement and `?reduce` / `?no-webgl` modes. The generated fixture is removed after testing and must not be deployed.

## Required for production geography

1. An approved property register with stable ID, public property name, city, neighbourhood, category, short description and either a valid detail URL or confirmed enquiry destination.
2. Verified latitude/longitude for every property, with source and accuracy; clear ownership/management status and approval for public presentation.
3. Explicitly matched, website-approved photography per property, alt text and usage rights. Current supplied photos have unconfirmed identities.
4. Licensed building footprints/heights and surrounding roads/coastlines for the chosen bounded areas, or optimised GLB/glTF assets. Include geographic origin, coordinate reference system, metre scale, axis orientation and stable property-node mapping.
5. If a tile provider replaces the custom model, confirm UAE building coverage, attribution, usage terms, credentials and cost before integration. Three.js itself does not supply geographic data.

Replace the demo registry and illustrative geometry together once these inputs are verified. Remove the illustrative notices only after data and asset approval.

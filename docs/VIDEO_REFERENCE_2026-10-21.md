# Video-led light theme — October 21, 2026

## Reference evidence

Analyzed the supplied `4af6e378c2eef0e9129b3bfb601aa010.mp4` locally with AVFoundation. Duration: 37.33 seconds; reviewed 24 evenly spaced frames and full-size detail frames. This is a cinematic laptop presentation of a digital-agency site, rather than the earlier Medusmo website. The user confirmed that the **site displayed on the laptop** should drive the redesign, adapted to light-mode Vectramind.

| Approximate time | Visible behavior | Implementation |
| --- | --- | --- |
| 0–5 seconds | Centered geometric headline, crossing cyan/blue light ribbons, compact navigation and pill actions | Original procedural Three.js light trails behind a centered Vectramind hero; small navigation and pills |
| 6–8 seconds | Client strip followed by an editorial brand statement | Vectramind client logos and a human-connection introduction |
| 9–15 seconds | Large numbered capability scenes, layered metallic architecture, changing titles | Three scroll states for Intelligence, Experience and Integration, with original blue/silver slat geometries |
| 16–22 seconds | Connected circular ecosystem | Six interactive channel/system nodes connected to Vectramind’s own emblem; sequential line and node entrance |
| 23–27 seconds | Two visual product/project cards and supporting copy | Synapse and Firstpass cards using original Vectramind imagery and local product routes |
| 28–31 seconds | Metrics, proof and company content | Rotating wireframe globe with Vectramind’s five office pins, published figures, case outcomes and original client logos |
| 32–37 seconds | Large contact invitation with flowing light trails | Shared light footer with procedural trails and the existing consultation flow |

## Content and adaptation

Brand/product information remains grounded in https://www.vectramind.com/ and the already imported source content. Agency slogans and reference branding are replaced by Vectramind copy. No third-party testimonials, metrics, artwork or dashboard claims are invented. Product dashboard and patient journey previews remain explicitly illustrative.

The reference’s near-black surfaces are translated into white, ice-blue and pale slate. Blue linework, metallic layering, generous spacing and light geometric typography preserve its visual relationships. The captured laptop scene does not expose original font files or animation source, so the result is a custom implementation of the observed design and motion rather than an exact source reproduction.

## Editing map

- Homepage order: `src/components/home-page.tsx`.
- New sections: `src/components/experience/`.
- Hero and ecosystem copy: `src/content/experience.ts`.
- Existing capability/client/metric content: `src/content/site.ts`.
- New theme and responsive overrides: `src/app/experience.css`.
- Lazy scene wrapper and SVG fallback: `src/components/visuals/signal-field.tsx`.
- Procedural geometry: `src/components/visuals/signal-scene.tsx`.
- Shared footer: `src/components/site-footer.tsx`.

GSAP owns scroll state and ecosystem entrance; Framer Motion owns headline and content transitions; Three.js owns trails and metallic geometry. Scenes render continuously only near the viewport. Reduced motion uses static scenes and direct capability controls. On small screens, the capability scene returns to normal document flow. Local previews and tests do not publish the site.

## Packages

`npm outdated --json` reported Framer Motion as the only outdated package. Updated it from 14.3.0 to 14.5.0 using npm’s latest tag. Next.js, React, Tailwind, GSAP, Three.js, React Three Fiber, Hugeicons and the Radix-backed shadcn-style components were already current. The install audit reported zero vulnerabilities.

The global-reach scene is in `src/components/experience/global-reach.tsx`. The globe uses latitude/longitude coordinates for Dubai, Hyderabad, Riyadh, Tanuku and Vancouver; it is an illustrative visualization, not a data-coverage map.

## Hero motion refinement

Re-examined 21 frames at quarter-second intervals from the first five seconds, correcting the laptop display perspective locally for comparison. The visible hero uses a tight paired ribbon waist at the joined action buttons, individual luminous packets moving along strands, and slow lower cloud drift. The previous rigid rotation of tube bundles did not capture this behavior.

`hero-energy-scene.tsx` now owns a dedicated fullscreen WebGL shader: two converging strand fans, independently phased inward packets, layered core/halo brightness and domain-warped lower haze. It draws a single plane, with no postprocessing dependency or downloaded reference artwork. `hero-energy.tsx` owns lazy loading, the static SVG fallback, viewport suspension and reduced-motion behavior. The shared footer flow is unchanged.

The hero title is smaller and sits in the reference's upper-center position. Joined actions sit at approximately 57% of the section height, with capability labels, a scroll cue and the supporting line below. Vectramind content and the requested light theme remain intact. The dark rendered laptop reference cannot provide original source shaders or exact font/animation parameters; this is a new implementation of its observed composition and motion.

Run `npm run test:hero` to compare actual rendered frames, verify frozen reduced-motion frames, test framing at 320–2560px, and check the consultation and product actions.

### Screenshot revision

The latest supplied screenshot supersedes the compact video-framing layout: restored the large two-tone headline, eyebrow, and separate actions. The shader now uses a broad, rounded fan of separated fine strands with selected cyan leads and a faint secondary ribbon. Pulse clocks, direction, haze drift and pause/reduced-motion behavior are preserved. Ribbon width comes from strand spacing, rather than uniformly enlarged stroke widths.

### Final ribbon geometry and slow pulse

Restored the original Catmull–Rom tube geometry, line radii, blue/cyan materials, framing and static secondary sweep from the supplied screenshot. Curves no longer change shape or rotate. A custom material adds only a faint moving highlight; one pulse cycle takes approximately 56 seconds. The hero uses the clean screenshot background instead of the later cloud shader. `hero-energy-scene.tsx` owns this fixed geometry and pulse material; `hero-energy.tsx` retains its viewport/background pause and live reduced-motion handling.

### Logo-color pulse update

The current pulse cycle is four seconds. Traveling highlights use the exact blue (`#2873B9`), green (`#318A3E`), red (`#E22526`) and yellow (`#F2BB0B`) from the Vectramind logo SVG. Base ribbons, geometry and framing remain unchanged; only the moving highlights receive these colors.

### Neutral hero brand balance

The hero now uses a warm-white background, charcoal headline and actions, and neutral silver base ribbons. The previous blue headline, blue/cyan ribbon base, blue wash and blue homepage consultation button were removed. The four-second traveling pulses retain all four logo colors. Geometry, spacing and motion remain unchanged.

## Post-hero section — detailed reference pass

Reviewed perspective-corrected frames from 5.2–9.2 seconds. The sequence contains a continuous horizontal logo strip, a left-aligned three-line problem statement and supporting paragraph, a right-side vertical connection diagram with a thin orbit and floating labels, then a centered resolution and pill CTA. The whole block moves in normal page flow; the diagram and labels reveal as it enters.

Replaced the earlier generic introduction and static four-logo row with this structure. Vectramind copy asks whether disconnected experiences are holding the organization back. The illustration connects conversations, patient journeys and systems. No reference agency copy, invented performance percentages, textures or proprietary models are reused.

The new graphic is **entirely HTML and SVG**. It creates no canvas, WebGL context or 3D dependency. GSAP draws connector lines, fills the flat rail, and reveals text/nodes/labels with scroll. Reduced motion displays the completed graphic. Six selected original Vectramind logos form the compact upper belt; all 27 remain in the later client section. The belt pauses offscreen, on hover/focus, with its control, and for reduced motion.

Editing:
- Question, supporting text: `src/content/experience.ts` → `introduction`.
- Diagram and scroll animation: `src/components/experience/introduction.tsx`.
- Upper logo belt: `src/components/sections/client-strip.tsx`.
- Layout and responsive rules: `src/app/post-hero.css`.
- Validation: `npm run test:post-hero`.

### Post-hero timing correction

The follow-up frame comparison showed that the illustration and counter continue animating while the section is stationary. Replaced scroll scrubbing with once-per-entry timed sequences: headline lines at 0/.18/.36 seconds, supporting copy at .72s; diagram/rail entrance, first label at .8s, second at 1.12s; outcome appearance at 1.6s followed by digit reels and the small outcome bar at 1.95–3.1s. The right marker rises through 2.9 seconds. The rail remains stationary/full-height, matching its role in the recording. The two label cards remain in place after entrance. The centered CTA has its own viewport entrance so it is readable on smaller screens.

The reference's numeric outcome is replaced by the published Synapse hospital case's 10% reduction in appointment no-shows, with a source link and explicit case-study label. The original 3D reference styling is represented by flat HTML/SVG elements, per the user's preference. The compact logo belt is sped up to a 24-second loop. Reverse scrolling does not restart the completed timed scene; reduced motion shows the completed result directly.

### Post-hero graphic reconstruction

Reviewed perspective-corrected screen frames at 5.8–8.0 seconds and an enlarged crop at 7.2 seconds. The reference is an oval surrounding three translucent vertical columns, with a sphere at the central column's top, a larger sphere low on the left, and a smaller rising sphere on the right. Two frosted badges overlap the columns inside the oval. The previous flat rail and disconnected dots did not reproduce this silhouette.

Rebuilt that composition with CSS gradients and an SVG oval, without canvas or WebGL. The right sphere now belongs to a bottom-anchored column: animating the column's height raises the sphere and stretches its shaft together. The timed entrance retains line-by-line heading reveals, staggered badges, and rolling result digits while scrolling is stopped. The result remains Vectramind's published 10% appointment no-show reduction rather than copying the reference's agency metric. Light neutral colors preserve the requested light theme.

Validation: production build, TypeScript, and `test:post-hero`; the animation test verifies rising cap displacement, increasing column height, a fixed baseline, final digit visibility, no replay on re-entry, reduced motion, responsive widths from 320–2560px, and the contact CTA.

### Scroll entrance timing refinement

Kept the approved illustration and final layout unchanged. Reviewing the 5.8–6.8 second frames shows the left badge preceding the right, with column movement settling before the result digits finish. The prior entrance began when only the top edge was visible and stretched the small column for 2.9 seconds, delaying its settlement.

The entrance now starts when the graphic's center reaches 78% of the viewport height. Desktop copy and graphic share one timeline. On stacked mobile, the heading enters separately so it can be read before scrolling to the illustration. The center and right columns grow from their fixed baseline in about 1.1 seconds; the patient badge enters at 0.40 seconds, conversations at 0.64 seconds, the result at 0.88 seconds, and digit rolling at 1.12 seconds. The sequence continues after scrolling stops and does not replay on re-entry. Layout effects initialize animation states before client paint.

Validation: TypeScript, production build, post-hero checks including an approach-before-trigger assertion and left-before-right badge order, plus a fresh mobile entrance check.

### Section following the introduction: pinned capability sequence

Reviewed the extracted 8.6–15.25 second frames. The next section holds a centered two-line title above a large left index and short supporting copy. Its right-side artwork changes from a flowing series of fins to separated plates, then an assembled system over a data grid. The reference's source is still an agency website; Vectramind's Intelligence, Experience and Integration content replaces the agency copy.

Rebuilt the three source-owned SVG chapters in `capability-visual.tsx`: a curved glass fin ribbon, open-centered separated plates, and an integration stack with colored signal paths. These use gradients and SVG groups rather than a WebGL canvas. Neutral light surfaces and restrained accents from all four logo colors retain the requested theme.

`capabilities.tsx` uses one reversible GSAP scroll timeline for the index and artwork. Copy selection reads the rendered timeline so fast scrolling cannot advance text ahead of the scrubbed illustration. Individual fins shift, plates contract, and modules assemble within their chapters. The section stays pinned on desktop; previous/next buttons also move between chapters. Tablet/mobile and reduced motion use normal document flow and direct controls. Live media-query checks keep controls functional when reduced motion changes during a visit.

Run `npm run test:capabilities` for pinned heading/index alignment, each visible artwork/copy state, reverse scrolling, per-fin movement, controls, 320–2560px layouts, reduced motion and browser errors.

### Perspective and chapter-duration correction

Decoded the original clip again and compared detailed frames at approximately 10.0, 11.75 and 13.85 seconds. The reference rotates its view around the open plates; translating static diamond artwork does not reproduce that motion. The middle chapter is also substantially longer than the first and third.

Added `capability-geometry.ts` to project source-owned faces into editable SVG paths. A cached renderer updates coordinates directly during scrolling, without React renders for each frame or a WebGL dependency. The first chapter now has a curved ribbon of vertical faces with depth; the second turns around six open layers and closes their spacing; the third assembles a compact system stack. Intersecting signal rails sit beneath all three. The existing light material palette and four Vectramind logo accents remain.

The scroll timeline now has a 1:2:1 chapter split. Number transitions occur with the artwork at the two boundaries, while the heading stays pinned. Artwork framing is larger and higher, and the left index/copy follow the reference's upper-left placement. Mobile and reduced motion retain representative static poses and previous/next controls.

Validation adds a check that plate coordinates change while chapter 02 remains active, alongside the existing visible number alignment, forward/reverse motion, fin geometry, responsive layout, controls and reduced-motion checks.

### Enlarged-frame geometry correction

Compared enlarged right-side crops from capability frames 04, 08, 10, 13 and 17. These reveal two earlier interpretation errors: the luminous squares float between solid plates instead of marking holes, and the final assembly includes continuous glass walls around its shelves. Corrected both structures. The first ribbon now includes folded lower faces, and its entrance settles before holding its pose. Vertical signal guides frame the structures, while a subdued foreground veil moves with the scroll timeline. Raised the illustration framing to align its crest with the heading, as in the video.

The geometric updates remain source-owned SVG paths. Vectramind copy, the light theme, published content, and the preceding hero/introduction are unchanged. Tests additionally check the settled ribbon hold and the presence of its folded faces and the glass core.

### Continuous 02 → 03 structure and shared camera

Compared late-middle frames 12 and 14 with the first 03 frame 16. The compressed structure appears before the number changes: the third stage should continue that structure rather than restart an assembly. The outgoing plates now contract to the incoming shelf radius, spacing, edge depth, camera angle and scale. Glass walls and vertical ribs emerge late in 02, then persist into 03. Removed the third-stage shelf position reset. Floating signal traces also join the incoming front-edge paths.

Guides and floor rails now use their chapter's camera angles, with matching final/initial poses across the handoff. Surface reflections change subtly as the viewpoint turns. The test checks matching outgoing/incoming shelf coordinates at the boundary, alongside rib counts and the existing scene, controls, responsive and reduced-motion checks.

### Stage 01 focus: folded rib geometry and independent light flow

Decoded 17 additional frames at 0.1-second intervals from 9.0–10.6 seconds. The stage-01 structure has a taller rear bank, a shorter front bank, and connected lower turns. The rear crest varies the rib heights while the base remains continuous. Rebuilt stage 01 with three faces per rib and separate rear/front material gradients. Replaced its broad floor mesh with eight sparse signal paths around the structure. Stages 02/03 retain their existing geometry and scroll choreography.

The reference's light points keep moving while the structure holds. Stage-01 stroke flow now uses a separate 6.4-second linear loop, with complete dash periods for seamless repetition. It runs only while stage 01 is visible and the document is active; changing stage or hiding the tab pauses it. The scene geometry remains tied to the entrance/scroll position, and reduced-motion/mobile layouts use static artwork.

Added checks for all 30 front-return faces, light flow continuing without scroll movement, pause on advancing to 02, and visibility-change pause/resume. Existing checks still cover the opening hold, reverse scrolling, matching 02/03 handoff coordinates, controls and responsive/reduced-motion behavior.

### Stage 01: taper and lower silhouette

Compared the reference detail crop directly with the rendered first-stage screenshot. The persistent mismatch was the rear bank's lower edge: the rendered end ribs remained full-height, while the reference expands around the central crest and tapers toward its ends. Updated only the first-stage paths so the rear base follows that expansion, the shorter return bank keeps a more even profile, and thinner lower turns connect the two. Shifted its geometry and signal rails left together to align the crest more closely with the reference framing. The existing entrance hold, independent seamless light flow, visibility pause and stages 02/03 remain in place.

### Stage 01 close-up correction: overlapping rectangular fins

The user's latest close-up supersedes the earlier U-rib interpretation. It shows broad overlapping rectangular panels: the U-like edges came from overlapping planes and the foreground haze. Removed the synthetic rear-bank/lower-turn/return-bank geometry for stage 01.

`intelligence-ribbon.ts` now owns reference-screen coordinates for the stepped top profile, panel width, height, lean and surrounding signal paths. Coordinates are mapped from the perspective-corrected 750×525 frames into the shared SVG viewBox. Thirty broad faces have thin side edges and top highlights; a depth mask and foreground mist obscure their lower ends as in the clip. The first four faces fade out to keep the visible beginning of the stack away from the copy. Stage 01 retains the independently running seamless light flow and now includes softly glowing light points and slow foreground mist drift. Both pause outside the active stage and when the document is hidden. Later-stage geometry and choreography are unchanged.

This is an editable vector reconstruction of the observed pose and motion, adapted to the requested Vectramind content and light theme. It does not use the reference site's artwork files or original scene code.

### Stage 01: circulating panels on a closed loop

The panels now circulate instead of holding their positions. `intelligencePanelPose` defines a closed track: the reference's visible crest occupies its first 72%, and two connected Bézier segments return beneath the foreground haze. Forty-two panels keep approximately thirty faces on the visible bank, with the rest following the return arc. Width and facing change around the turn. Panel visibility depends on track position, so individual panel identities do not disappear permanently.

A separate 32-second GSAP clock advances the phase continuously, including when scrolling stops. Scroll updates share that same phase; changing chapters does not reset it. The clock pauses together with light flow and haze outside active desktop stage 01 or when the document is hidden. Mobile/reduced-motion views keep a static closed-loop pose. The renderer caches paths, updates only stage 01 on clock ticks, and changes DOM depth order only when the circular order changes. Panel IDs remain stable across sorting and media-query changes.

Validation checks that all panel faces have identical coordinates at phase 0 and phase 1, that panels move while scroll position stays fixed, and that they stop after leaving 01. The existing checks cover lights, haze, hidden-tab behavior, later-stage continuity, responsive controls, reduced motion and browser errors.

### Direction clarified: left foreground → right background

Kept the accepted positive loop phase and corrected its depth cues. Panels now fade out as they recede on the right, and the reverse-travelling return arc is completely occluded by the haze. Painting follows depth: right/background faces render first and left/foreground faces overlap them. The left emergence, dimensions, reference profile and 32-second cycle remain intact. This prevents the return leg from reading as panels coming toward the viewer.

Validation checks emergence from the left fade into visibility, increasing horizontal position during the visible run, decreasing apparent size/depth/opacity toward the right, an invisible return leg, and identical loop endpoints. Browser checks also assert actual rightward movement while scrolling is stopped and the foreground/background paint order.

### Stage 01: floor grid and heading clearance

Added the perspective floor grid and four-color travelling points beneath stage 01. It renders behind the panels and sits lower than their network lines, matching the supplied grid detail. The first-stage group now moves down only as far as needed to keep its traced crest 28 pixels beneath the heading. A ResizeObserver measures the heading and SVG projection after viewport or font changes, avoiding a fixed offset that would overlap at shorter desktop sizes. Tablet/mobile retain their existing normal-flow framing. Other stages and the accepted loop direction/speed are unchanged.

Validation: production build, TypeScript, capability browser checks including grid presence and actual heading clearance, and additional checks at 2560×1440, 1440×900 and 1024×768. Measured clearances were approximately 29–31 pixels.

### Stage 02: orbiting connected layers

Re-extracted the second scene at 11.05–13.45 seconds in 0.16-second increments. The reference uses broad horizontal shelves, smaller illuminated square circuits suspended between them, an edge-on camera pass, an elevated orbit and a push toward a compressed stack. `connected-layers.ts` now defines these scroll-controlled camera stops separately from the stage 01 panel loop. Its final stop matches the existing stage 03 coordinates exactly.

The six translucent shelves use neutral pearl shading, thin side faces, and continuous square circuit outlines with four-color light points. A separate GSAP clock keeps the points flowing when scrolling stops, while the camera holds its scroll position. It pauses outside active section 02 and when the document is hidden; mobile and reduced-motion views remain static. The floor grid and vertical guides track the same camera. The forming core appears only at the end of the compression. Mobile artwork clips to its own viewport to keep the grid out of the copy.

Validation: TypeScript, production build and capability browser checks passed, including forward/reverse scrolling, circuit flow while the camera rests, stage 02 → 03 coordinate continuity, 320–2560px widths, mobile navigation, reduced motion and browser errors. Desktop frames were inspected at five positions through the new sequence. This is a vector reconstruction adapted to the requested light Vectramind theme rather than the original source scene.

### Stage 02 refinement: independent circuit convergence

Reviewed a denser sample at 11.65–12.37 seconds (0.08-second intervals). The small square circuits converge into a tight cluster before the large shelves close, then disappear into the structure. Added a separate circuit pose for that motion and its occlusion, while retaining the exact shelf/core coordinates at the stage 03 handoff. Camera interpolation now preserves velocity through intermediate poses rather than stopping at each keyframe. The forming core follows the same camera as the shelves throughout its reveal. A subtle, independently drifting foreground veil adds the depth seen in the supplied clip and pauses outside active stage 02.

Validation includes the circuit cluster shrinking to less than half its open vertical span, restoration of the same spread on reverse scroll, continuous light flow with a stationary camera, exact stage handoff, and the existing responsive/reduced-motion checks. Open, converged and closed desktop poses were compared visually with the newly extracted frames.

### Stage 02 refinement: scaffold-first entry and solid plate edges

Sampled the entrance again at 10.85–11.62 seconds in 0.07-second steps. Section 02 begins with the illuminated square scaffold; the broad shelves materialize around it as the view opens. Added the initial steeper, smaller camera pose and a brief, staggered shelf-material reveal. Circuit geometry and pulses remain visible during that reveal. The edge projection now chooses the nearest pair of slab faces for the camera quadrant, correcting the inverted rim previously visible past the edge-on position. Neutral reflective side shading and an inset top highlight distinguish thin solid slabs from flat transparent sheets.

Validation covers the scaffold appearing before the shelf material, the material becoming visible during the turn, circuit convergence and its reverse, continuous pulses, stage 03 handoff, mobile/reduced-motion behavior and no browser errors. Five local desktop poses were inspected against the extracted entrance and closing frames.

### Stage 02: full press and upward stack growth

The user's clarified choreography replaces the earlier partial compression. The shelves now converge onto exactly one plane, hold as a single thin physical slab, and separate upward from their shared bottom anchor. The six coincident material faces reduce to one visible face during the hold, preventing dark overpainting. Circuits descend into the press and disappear before it settles; the forming core is delayed until the final stack handoff. The opening scaffold, material reveal and camera orbit remain in place. The end positions still match section 03 exactly.

Reviewed closing frames at 12.30–13.86 seconds. Browser validation now asserts identical geometry for all pressed shelves, only one visible material face during the hold, upward expansion into six separated shelves, restoration of the same single plate on reverse scrolling, and continuity into section 03. TypeScript, production build and the full capability browser checks passed. Compressed, rising and complete stack poses were inspected locally.

### Stack refinement: smaller cap, shadows and contained framing

The rising cap now lifts first; successive shelves follow with a short delay from the pressed base. The cap develops to 76% of the shelf radius, matching the smaller top rectangle in the supplied detail. Each slab casts a soft projected shadow onto the layer below. The forming core ends beneath the second shelf so it no longer covers the smaller cap. Matching cap/core/shadow geometry continues into section 03.

Added `capability-framing.ts`: a single envelope sampled across the complete connected-layer motion is fitted into the available area beside the copy and below the heading. The frame remains fixed while scrolling, preventing size pumping. Sections 02 and 03 share the same transform and clip area to preserve their handoff. Tablet/mobile use the normal-flow SVG frame. The original stage 01 fitting is unchanged.

Desktop captures at 1024×768, 1440×1000 and 2560×1440 show at least 42px clearance beneath the heading in the sampled open/rising/stack poses. Browser checks additionally cover the cap being smaller than the next shelf, copy/heading clearance and viewport containment during both the orbit and completed rise, alongside the existing compression, reverse scroll, handoff and reduced-motion checks.

### Stage 03: ribbed columns and stepped connections

Extracted the third scene at 14.00–17.06 seconds, then inspected 13.90–15.20 seconds in 0.10-second steps. The source shows a ribbed foreground column rising and lowering, a second taller column entering from above, stepped horizontal platforms behind them, travelling floor-grid lights and atmospheric occlusion. It exits into the following scene after this sequence.

Added `integration-motion.ts` for the scroll-controlled camera, primary/secondary tower poses and unfolding platform positions, and `integration-visual.tsx` for the editable vector component. The first pose preserves the incoming section 02 geometry. As the camera turns, shelves slide into stepped connecting platforms, the front column narrows and changes height, and a taller ribbed column descends at the back. Both visible faces have vertical grooves and reflective neutral shading. The shared frame includes the new tower envelope to keep the scene beneath the heading and beside the copy. Mobile/reduced-motion visitors receive a static pose with both columns visible.

A dedicated light-flow clock keeps four-color points moving across the grid and platforms while the camera holds its scroll position. Light flow and foreground haze pause outside active section 03 and when the document is hidden. Section 01/02 clocks remain independent.

Validation: production build, TypeScript and capability browser checks, including the front-column height change, delayed second-column appearance, continuous lights while scrolling rests, reverse-pose restoration, incoming geometry continuity, heading/copy clearance at desktop sizes, mobile controls, reduced motion and browser errors. Four desktop poses and the mobile layout were inspected locally. This remains a vector reconstruction of the supplied footage adapted to Vectramind's light theme.

### Stage 03 correction: remove the carried-over shelf stack

The latest screenshot identified the six shelf modules as unwanted carry-over from section 02. Removed that geometry and markup from section 03. It now has three independent rectangular bridge platforms, offset horizontally in depth and vertically behind the two ribbed columns, with soft side shading and shadows. Their entrance is staggered; they do not morph from or recreate the six-plate stack. The outgoing section 02 stack finishes fading by the chapter 03 boundary. The central column preserves the structural handoff, while the column-height animation, floor lights and haze remain.

Validation checks that section 03 has no old module paths, that section 02 is fully faded when chapter 03 begins, that the central column matches across the handoff, and that the bridge platforms step laterally rather than form a shelf stack. Existing motion, reverse-scroll, light-flow, responsive and reduced-motion checks remain. Desktop and mobile captures were inspected after the replacement.

### Stage 03 refinement: hanging-column close-up

Re-sampled 14.45–15.08 seconds at 0.07-second intervals against the latest close-up. The larger column hangs from above beside a shorter foreground column. Widened the hanging body and replaced its telescoping height with a rigid 340-unit column that translates downward. Its upper portion intentionally enters from outside the illustration frame, clipped below the heading. The framing envelope accounts for this visible portion rather than shrinking the complete component to show an offscreen cap. The foreground body translates upward slightly in the closing pose while retaining its shorter profile.

Added shaded flute faces beneath both columns' fine rib lines to give the grooves depth. The three independent rear platforms now have thicker side faces and progressively broader footprints. They remain separate from the removed six-shelf stack. Floor-light flow, haze and reverse scrolling remain active as before.

Validation includes rigid hanging-column travel and stable projected proportions, plus visible-frame intersections for the heading/copy clearance checks. TypeScript, production build and the full capability browser suite passed. Desktop entrance and hanging poses were inspected against the extracted frames.

### Stage 03 refinement: steadier camera and staggered three-column timing

Reviewed 14.05–15.15 seconds in 0.10-second steps. Reduced the section 03 camera orbit to a restrained 123–139° turn and held it late in the sequence, keeping the architectural pose steadier. The foreground column now narrows early, reaches its tall pose sooner, then descends to its shorter form. The wide rigid hanging column follows, with a smaller 135-unit ribbed side column appearing later through the haze, matching the small silhouette visible beside the hanging body in the supplied footage.

`RibbedColumn` shares the secondary/side column faces, flutes and fine ribs. The new side column has its own pose and opacity envelope. Added a soft glowing pass behind the four-color floor points while preserving the independent flow clock. The removed six-shelf stack remains absent.

Validation: TypeScript, production build and capability browser checks passed, including the delayed side-column appearance, rigid hanging travel, reverse-pose restoration, floor-light flow, incoming transition, responsive visible bounds and reduced motion. Early, middle and late desktop poses and the mobile illustration were inspected locally against the extracted frames.

### Stage 03: six-column composition and smoother motion

Expanded the scene to six columns with a shared definition list in `integration-motion.ts`: the foreground body, hanging column, smaller side column, and three rear columns at different depths, widths, heights and staggered entrances. The additional columns translate vertically as rigid forms. Their faces, flutes and ribs share the `RibbedColumn` renderer. The independent stepped bridges remain; section 02's six-shelf stack is not rendered in section 03.

Replaced the integration motion's cubic easing with quintic easing to make acceleration continuous at phase boundaries. Extended the foreground rise/narrowing intervals and changed the shared pinned timeline's scrub from 0.45 to 0.7 seconds so copy, index and geometry settle together more gradually. The SVG renderer now caches each chapter's clamped progress/loop phase and skips geometry writes for unchanged chapters; panel depth sorting also stops once chapter 01 is unchanged. This avoids re-projecting hidden scenes during the denser third scene.

Validation: production build, TypeScript and the capability browser suite passed. Added checks for all six revealed columns and a MutationObserver assertion that chapter 01 paths are not rewritten while scrolling through chapter 03. Existing checks cover column travel, reverse restoration, continuous lights, the section handoff, responsive visible bounds, mobile controls and reduced motion. Mid/late desktop poses and the mobile composition were inspected locally.

## Connected ecosystem after the capabilities — 22 October

Reviewed perspective-corrected video samples at 15.6–20.66s. The next scene is a stationary ecosystem diagram, rather than another capability illustration: a rounded glass logo hub emerges first, four inner spheres resolve on individual elliptical bases, then eight outer spheres appear in staggered pairs. Two shallow orbital ellipses draw in with radial connections; light continues around the completed paths. The last sampled frame shows a translucent detail card beside a hovered node.

Replaced the previous side-by-side ecosystem with a full-width pinned reconstruction. The central Vectramind mark uses its four logo colors. Inner nodes represent Synapse, Firstpass, APIs and AI/insights; outer nodes represent channels, care teams and connected systems. The scene keeps the established pearl/olive light theme. CSS spheres and an SVG orbit plane avoid another WebGL canvas. No source-site imagery or third-party brand copy is embedded.

One GSAP timeline controls hub entrance, inner ring drawing, four platform reveals, outer ring drawing and eight channel reveals, followed by a settled hold. Desktop progress follows scroll in both directions. Ring lights and subtle ground haze run only while the section is visible. Mobile uses an unpinned entrance; reduced motion shows the completed diagram. Pointer, keyboard focus and touch expose the node details; Escape dismisses them.

Implementation: `experience/ecosystem.tsx` owns interaction and timing, `experience/ecosystem-orbits.tsx` owns the shared 1000×650 projection and SVG paths, `app/ecosystem.css` owns the visual theme, and `content/experience.ts` owns node copy. `npm run test:ecosystem` checks reveal order, geometry alignment, reverse scrolling, independent light motion, node details, 320–2560px layouts and reduced motion. This is an editable reconstruction of the observed sequence, rather than the source site's original 3D assets.

### Ecosystem comparison refinement — 22 October

Re-sampled the source at half-second intervals from 16–19.5s and compared with the local scene. Corrected four visible differences: the reference settles vertically before the network build instead of zooming throughout; each pedestal traces before its sphere resolves; the inner upper-right node leads the upper-left node, and the outer reveal progresses along the near-left side before reaching the right; the pedestal-to-sphere diameter ratio is approximately 1.6 rather than the previous 1.2.

The new cue sheet lives in `ecosystem-motion.ts`. It separates each base and sphere start, divides both orbit paths into four independently traced arcs, and removes the diagonal connections through the central logo. The existing heading fades away on desktop to leave the reference's open, diagram-led composition; mobile retains the heading. Added a narrow glass hub side wall, brighter sphere highlights, a static procedural cloud field drifted on a composited layer, and node-local translucent detail cards. CSS/SVG remain the only scene renderers. The color palette and all node content remain Vectramind's light theme adaptation.

Validation adds pedestal-before-sphere ordering, upper-right-first inner reveal, left-leading outer reveal, stable scene scale after settling, eight separately traced orbit arcs, pedestal diameter, locally anchored details, Escape dismissal, and mobile heading visibility to the responsive/reverse-scroll checks.

### Section 03 contextual redesign — 22 October

The user identified the ribbed columns as a poor fit for the integration-services message and requested a new component. Section 03 now uses a literal, editable system diagram: CRM/customer context and EMR/clinical records connect through Vectramind's integration layer to Synapse/customer engagement and Firstpass/patient experience. APIs and databases join from below. Each system receives a restrained logo-color accent; no architectural columns or stepped platforms remain in the rendered section.

The existing chapter sequence and copy remain. The integration hub appears first, connected system cards resolve next, routes draw across the gaps, and paired light packets flow in opposite directions while the chapter is active. Reverse scrolling reverses the reveal. The diagram receives an independent fixed envelope within the established heading/copy safe area; section 02 keeps its previous framing and geometry. Mobile and reduced-motion controls show the complete diagram without scroll-dependent visibility.

`integration-visual.tsx` owns the system categories, routes and SVG cards. The existing capabilities GSAP timeline owns reveal progress and visibility-paused bidirectional packet motion. Capability verification now checks real system labels, completed routes, packet direction, reverse reveals and the absence of old column elements, alongside unchanged section 01/02 behavior and responsive framing.

### Continuous 02 → 03 stack-to-integration-chip handoff

The next user instruction specifically requests the isometric section-02 stack to become the pictured Integration layer chip. Added `stack-chip-transition.ts`: it holds the fully formed shelf pose, presses all six shelf surfaces into the bottom plate, then maps that plate from the stack's fitted SVG coordinate space into the integration hub's fitted coordinate space. The polygon flattens and acquires the chip's rounded corners; the real logo/labels resolve above the transitioning surface. The native chip background takes over only when the morph completes. Connected system cards and routed data appear afterward.

The morph uses the actual layout transforms rather than hard-coded screen positions, updates on resize, and scrubs backward to the same intermediate geometry. Static mobile/reduced-motion layouts retain the finished chip. Verification covers physical shelf compression, changing intermediate surface geometry, matching reverse states and the final chip handoff, in addition to the integration graph and earlier chapters.

### Integration connections lead each chip

Updated the post-morph reveal per the next user instruction. The hub now connects one endpoint at a time in clockwise order: CRM, Synapse, Firstpass, EMR, then APIs/databases. Each route originates at the hub, draws outward with a leading pulse, and only then does its endpoint chip unfold from the port. Chip opacity stays at one; entry uses directional scale rather than fading. The next route begins after the preceding chip opens.

`integration-connections.ts` holds the ordered cue sequence. SVG masks reveal the circulating packets only along the completed portion of each route. The two left-hand paths were reversed so every initial pulse travels from the Integration layer toward its destination. The existing visibility-paused bidirectional loops continue after connection. Reverse scroll retracts the chips before retracting their lines; static/mobile/reduced-motion views keep the completed system map.

Browser verification samples all five connections mid-draw with chips still closed, then after endpoint expansion, and checks the pulse, completed paths and reverse geometry alongside the stack-to-chip transition.

## Our platforms after Connected by design — 22 October

Sampled the on-screen reference at 20.5–31.55s. At approximately 23.1s the next scene begins as thin horizontal image strips near the bottom. The left image rises/unfolds ahead of the right; by 24.4s the two landscape previews align. Small pill tags arrive independently and settle into rows, then titles, body copy and outlined project buttons follow. The completed pair holds before scrolling upward into the next section. The source uses a laptop project preview on the left and a phone preview on the right.

Replaced the former photo-led SelectedWork section with `OurPlatforms`, immediately after `ConnectedEcosystem`, retaining the `#products` destination. Adapted the two cards to Synapse and Firstpass. The Synapse laptop uses the existing product dashboard asset; the Firstpass phone is a decorative, illustrative interface using the existing Firstpass logo and reception image. Both previews are HTML/CSS compositions, with no new 3D renderer. Product copy, tags and destinations live in `content/platforms.ts`.

The desktop entrance scrubs forward/backward: bottom sliver → rising preview → staggered pills → title → description → outlined CTA, with the left column leading the right. Mobile uses a stacked, unpinned entrance; reduced motion displays the completed cards. The later interactive dashboard showcase remains a separate section. Styling is isolated in `app/platforms.css`; the obsolete SelectedWork component and its unused styles were removed.

`npm run test:platform-cards` verifies section order, staggered image/copy timing, reverse state restoration, product destinations, responsive widths and reduced motion against the local production build.

## Globe / Who we are immediately after Our platforms

Sampled the video at 26.3–35.9s. The 26–30s company scene contains a viewport-scale rotating particle globe, a continuous spiral wrapping from south to north, small glossy orbiting satellites, left-aligned company introduction, a translucent statistic card on the right, a short central statement and three small framed figures near the bottom. The sphere settles down in scale as the content arrives; rotation and satellite motion continue after the entrance.

Rebuilt `GlobalReach` around that composition and moved its single instance directly after `OurPlatforms`; removed the former duplicate at the end of ClientsAndStats. Vectramind content replaces all reference-company claims: 170+ professionals in the introduction, 800+ clients in the glass card, 2B+ notifications, 5M+ patient engagements and 30+ partners/channels/integrations below. All five existing office names remain readable HTML. Bottom figures are business metrics, not invented awards or ratings.

The lazy-loaded Three.js particle renderer uses a generated Natural Earth land mask, an approximately 5.5-turn spherical spiral and moving satellite beads. It pauses outside the viewport and when the document is hidden; reduced motion renders a still frame. Static SVG globe artwork remains available if loading or WebGL fails. There is no globe interaction required to read company information. See `docs/GLOBE_DATA.md` for public-domain geographic source and regeneration instructions.

Desktop entrance scrubs forward and backward, settling the globe and revealing the company overlays, client counter and bottom metrics. Mobile uses normal document flow. `npm run test:reach` covers section order, actual canvas rotation, offscreen pause, count/reveal, office names, responsive bounds and reduced motion.

### Globe reference refinement — closer Who are we screenshot

Recompared perspective-corrected video samples at approximately 27.3, 28.7 and
30.1 seconds with the closer uploaded image. The reference uses a particle sphere
with a luminous rim, a nearly horizontal continuous spiral, brighter front trails,
dim rear trails, moving satellites and foreground mist. Its entrance settles from
an enlarged globe into the company copy, right-hand statistic and lower metrics.

Refined the WebGL globe with deterministic clustered land particles, a Fresnel rim,
core/halo spiral tubes with view-depth opacity, smaller office markers and glossy
satellites. Added an independently drifting procedural mist field, paused alongside
the globe when offscreen and disabled for reduced motion. Increased the entrance
scale and lift, and refined the glass card's angle and shadow. This is a procedural
light-theme reconstruction, with Vectramind's content and existing verified metrics;
the source's dark video textures, ratings and awards are not used.

Validation: production build and globe browser checks cover live rotation, scroll
entrance, responsive bounds from 320 to 2560 pixels, motion preference changes,
visibility pausing, loading fallback and WebGL errors. Mist playback assertions
also check running, offscreen pause and reduced-motion states.

### Globe rendering performance

Reduced the globe's pixel/geometry workload without replacing the design. Demand
rendering caps this decorative scene at 30 Hz; buffers have a 1.4M pixel ceiling.
The GPU no longer draws at device density 1.5, land wisps are reduced from three to
two (one in small layouts), tube/sphere geometry is lighter, and satellites share
resources. The procedural mist is baked into a 76 KB WebP and composited while
moving, removing the live SVG turbulence/blur filter.

Local Chrome comparison at 1440 × 1000, device scale 2, over two-second windows:
previous backing buffer 2160 × 1500; intermediate optimized buffer 1440 × 1000
(before enforcing the final 1.4M ceiling). Submitted vertices dropped from
6,002,478 to 3,955,240 despite slightly more frames completing in that sample.
These are local workload observations, not a guarantee of device-specific FPS.
Production build and the expanded globe checks pass, including actual drawing
rate, high-DPI pixel ceiling, zero offscreen draws, mobile layouts, reduced motion
and fallback. Desktop/mobile captures confirm the retained globe composition.

### Neutral, multicolour brand palette

Use silver/white foundations and charcoal typography rather than green as a
primary page colour. Vectramind's blue, red, yellow and green stay as balanced
signal accents in pulses, chart bars, location markers and the small glass-card
brand strip. Removed remaining green casts from orbit gradient definitions,
near-white plate highlights and the connection diagram. The pre-baked globe mist
was regenerated with neutral silver RGB values; it remains a static WebP and
keeps the existing 30 Hz/pixel-budget performance controls. Laurel ornaments and
central globe copy use neutral greys. The bright logo yellow is separated from a
darker gold ink token for small outlined details on white.

### New uploaded dot-globe reference and geographic office markers

Rebuilt the globe as a regular, monochrome land-only dot map with clear oceans,
a faint pearl surface and a soft floating shadow. Removed the spiral, orbiting
satellite balls and foreground mist. Reused the Natural Earth mask and existing
company coordinates rather than painting fictitious continent shapes or marker
positions. Dubai, Hyderabad, Riyadh, Tanuku and Vancouver have projected labels;
far-side labels hide with the globe's surface. Office buttons rotate the globe
to their respective longitudes, with an immediate orientation for reduced motion.
Moved the central statement into the left copy column on desktop to keep the map
clear; mobile retains its text flow. Kept the 30 Hz demand renderer, 1.4M-pixel
budget and offscreen suspension. The globe now needs only two WebGL draw objects.

Production build and globe checks include all five geographic selections, normal
rotation, responsive bounds, high-DPI pixel ceilings, zero offscreen draws,
reduced motion, fallback and absence of shader/browser errors.

### Grouped globe section and office navigation

Replaced the scattered full-screen absolute layout with a centered, constrained
two-column grid. The company copy, CTA, client count and laurel metrics form one
overview column; the other contains the globe and its office explorer. The five
city tabs sit directly below the globe alongside a selected city/country panel,
position count and wrapping previous/next controls. Tabs support roving focus,
Left/Right, Home and End, and wrap into two rows on narrow mobile screens.

Dubai is selected by default. The globe turns in both latitude and longitude to
center each selected marker. It retains that orientation, showing only the active
city's callout and the other visible markers, rather than rotating into an empty
ocean. Rendering stops when the transition settles, with the existing 30 Hz and
1.4M pixel ceilings retained during movement. Reduced-motion selections request a
single repaint. The layout no longer relies on a floating statistic card or
widely separated text/footer overlays.

### Editorial globe redesign with a larger map

Recomposed the section around the landing page's existing type, quiet horizontal
rules and shared gutters. The headline and introduction span the upper row;
a numbered office list and a larger globe occupy the main stage. Each office row
shows its country and selection state, with vertical keyboard navigation and
wrapping previous/next controls. The client count and existing laurel metrics
form one ruled bottom row. Removed the separate box-like navigation styling.
The globe camera is closer (7.35, 39° FOV), and the scene has a dedicated minimum
430px stage on desktop, rather than a small globe nested inside a card layout.
The active city stays centered and the 30 Hz/pixel/idle rendering limits remain.
Short desktop screens use native document flow; mobile stacks heading, globe,
offices and statistics. Bottom spacing keeps the desktop metrics clear of the
persistent consent and contact controls.


### Footer reference, 30.6–35.8 seconds

Reviewed the uploaded video's closing sequence using the extracted frames in
`/tmp/vectramind-oct21-reference/`: the heading enters above three contact
columns, then a diagonal light stream curves upward on the right. The lower
row contains the brand, navigation and compact Join form, followed by legal
and social links. The physical laptop surrounding the reference is not part
of the footer component.

Rebuilt the shared footer with this composition, staggered entrance motion,
neutral flowing trails, four logo-colour pulses and pre-baked drifting mist.
The agreed light silver/charcoal theme and Vectramind content remain. The
trails use SVG and CSS, with no WebGL canvas. Intersection and document
visibility suspend their motion; reduced motion removes continuous animation
and entrance transforms. Mobile stacks the contact columns and lower rows.

Contact links use the existing support email and contact/office routes. No
phone number was invented. As static hosting has no mailing-list backend,
Join validates the address and prepares an explicit email request for the
visitor to review and send; it does not claim a recorded subscription.

Validation: production build generated all 23 routes. `npm run test:footer`
checks contact/navigation links, moving pulses, offscreen pause, required and
invalid email handling, the reviewable email request, back-to-top, bounds at
320–2560px, reduced motion and the shared footer on the About page. Chrome
reported no page errors. Desktop and mobile captures were inspected.

## Production rendering optimization — 2026-10-23

The current hero projects the original camera and Catmull–Rom geometry at build time (`scripts/generate-hero-trails.mjs`) and renders SVG paths with the same four inward-moving pulse streams. It does not create a WebGL context. The active component is `hero-energy.tsx`; `hero-energy-scene.tsx` is retained as historical source.

Section animation controllers are split into `*-animation.ts` modules and loaded before their sections enter view. Their original timeline stages and easing remain intact. The office globe now uses a visibility-aware Three.js `Timer` directly, with the same shaders, projection and location selection, avoiding the deprecated clock in the previous renderer wrapper.

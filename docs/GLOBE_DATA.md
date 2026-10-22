# Globe particle data

The globe uses Natural Earth’s public-domain 1:110m land polygons:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

Natural Earth data terms: https://www.naturalearthdata.com/about/terms-of-use/

`public/data/globe-points.json` is a deterministic, compact particle mask generated from that source. Each four-number tuple contains a unit-sphere x/y/z position and land/ocean strength. It contains no customer or personal information. The browser loads this generated file when the globe approaches the viewport; it does not download geographic polygons or call a mapping service.

To regenerate after downloading the source GeoJSON:

```sh
python3 scripts/generate-globe-points.py /path/to/ne_110m_land.geojson
```

Company figures come from `content/site.ts`. Office names and coordinates live in `content/global-reach.ts`. Update those files independently of the renderer. The landmark globe is decorative; office names and company figures remain readable HTML even when WebGL is unavailable.

## Rendering budget

The globe uses demand rendering at at most 30 frames/second during a visible office transition, then stops drawing when the selected office settles. Its
backing buffer is capped at 1.4 million pixels and density 1, including high-DPI
and large displays. Scroll transforms remain independent of that drawing rate.
The current reference uses one regular sample per land point (every other sample
on small layouts), with ocean samples omitted. The scene has just an opaque
pearl sphere and a single point cloud. There are no spiral tubes, satellite balls,
lights, mist filters or extra texture downloads. Point geometry is disposed on
replacement/unmount.

Office markers are projected from the same latitude/longitude sphere as the land
mask into five lightweight SVG callouts. Far-side markers are hidden and only the
selected office has a text callout. Dubai is selected initially. Selecting an
office rotates both longitude and latitude along the shortest angle, centering
its marker and keeping that location in view instead of drifting across an ocean.
Reduced motion applies the selected orientation in a single explicitly requested
frame. Reusable vectors avoid per-frame position allocations.

The section uses the landing page's full-width editorial heading and shared
gutters. A numbered vertical office list sits beside the enlarged globe; the
client count and laurel metrics share one ruled row below. Each office row shows
its country and active state. The tablist has roving focus with Up/Down,
Left/Right, Home and End keys; previous/next controls wrap across the five offices.
On phones the globe precedes the office list and the statistics stack. Short
desktop viewports use normal document flow instead of trapping an oversized
pinned composition. Country names live beside the coordinates in
`content/global-reach.ts`.

`npm run test:reach` verifies actual draw rate, Retina/resize pixel budget, zero
idle/offscreen draws, all five centered office selections, keyboard controls,
previous/next wrapping, grouped mobile/desktop layout, reduced motion and fallback.

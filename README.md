# Vectramind — Adapt & Evolve

A responsive, light-mode Vectramind website. The homepage follows the digital-agency design displayed in the October 21 supplied video, with original blue light trails, numbered WebGL capability scenes and a connected-platform diagram. The earlier Medusmo-inspired sections remain integrated with the updated theme. Built with Next.js App Router, Tailwind CSS, GSAP, Framer Motion, Three.js / React Three Fiber, Hugeicons, and editable shadcn-style Radix components.

## Run locally

Node.js 22 or newer is recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production static export:

```sh
npm run build
npm start
```

`out/` is the complete deployable website. Webpack is selected explicitly because Turbopack's PostCSS worker cannot bind its IPC port in the development environment used for this project. This still uses the latest installed Next.js.

## Where to edit

| Change                                              | File or folder                                        |
| --------------------------------------------------- | ----------------------------------------------------- |
| Section order                                       | `src/components/home-page.tsx`                        |
| Capability, platform, client, number and story copy | `src/content/site.ts`                                 |
| New video-inspired homepage sections                | `src/components/experience/`                          |
| Post-hero layout and 2D diagram styling             | `src/app/post-hero.css`                               |
| Hero and ecosystem copy                             | `src/content/experience.ts`                           |
| Video-inspired theme and responsive rules           | `src/app/experience.css`                              |
| Hero ribbon geometry and logo-color pulses          | `src/components/visuals/hero-energy-scene.tsx`        |
| Hero lazy loading and static ribbon sweep           | `src/components/visuals/hero-energy.tsx`              |
| Procedural light trails and layered geometry        | `src/components/visuals/signal-scene.tsx`             |
| Individual page sections                            | `src/components/sections/`                            |
| Navigation and footer                               | `src/components/site-header.tsx`, `site-footer.tsx`   |
| Contact options                                     | `src/components/contact-dialog.tsx`                   |
| Colors, typography, spacing, breakpoints            | `src/app/globals.css`                                 |
| Smooth scrolling, masked text and parallax          | `src/components/motion-provider.tsx`                  |
| Pinned sections and their scroll states             | `experience/capabilities.tsx`, `sections/process.tsx` |
| Procedural WebGL forms                              | `src/components/visuals/sculpture.tsx`                |
| Editable Button and Dialog primitives               | `src/components/ui/`                                  |
| Local brand images and fonts                        | `public/images/`, `public/fonts/`                     |
| Metadata                                            | `src/app/layout.tsx`                                  |

The styles are organized into commented sections, followed by tablet, mobile, and reduced-motion overrides. UI primitives follow shadcn's source-owned pattern using Radix, CVA and `cn`; `components.json` configures future additions to use Hugeicons. The shadcn CLI was installed at the latest version and removed after setup to avoid shipping an unnecessary development dependency chain.

## Inner pages

The local routes are `/synapse`, `/firstpass`, `/capabilities`, `/about`, `/careers`, `/support`, `/contact`, `/blog`, `/terms-of-use`, `/privacy-policy`, and ten article routes under `/blog/[slug]`.

- Shared shell and navigation lifecycle: `src/app/template.tsx`, `src/components/site-shell.tsx`.
- Inner page layouts and styles: `src/components/pages/`, `src/app/inner-pages.css`.
- Product copy: `src/content/products.ts`.
- Imported article summaries, bodies and legal documents: `src/content/imported/`.

The template remounts the page shell on navigation to clean up scroll animations. Static exports use directory indexes, so deep links work with the included preview server.

## Animation ownership

- **GSAP + ScrollTrigger:** masked line reveals, photographic parallax, the product device perspective and desktop scroll-state transitions.
- **Lenis:** smooth desktop wheel scrolling and anchor navigation, synchronized with GSAP's ticker.
- **Framer Motion:** rotating audience, product transitions, dialogs' surrounding UI, menu and notice transitions.
- **Three.js + React Three Fiber:** original light trails, morphing metallic slats, an office-location globe, and the process sphere. The library downloads and scenes mount only near the viewport. Rendering pauses outside the viewport; a CSS fallback handles unavailable WebGL.
- **CSS:** seamless circular client logo belts, hover effects and responsive page layouts.

Desktop pinning is disabled below 901px. Tabs and step buttons provide direct control on smaller screens. Reduced-motion preferences disable smooth scrolling, pinning, text reveals and continuous 3D rotation.

The Connected Healthcare stories in `src/components/sections/stories.tsx` use the original stacked split panels, with heading reveals and subtle image parallax. Each panel retains its own Vectramind emblem. Tablet, mobile and reduced-motion layouts show the panels in normal document order.

The shared `Mark` in `src/components/site-primitives.tsx` uses the branching emblem from Vectramind's own logo, with a blue accent and inherited supporting color. It replaces the reference site's four-circle motif throughout the homepage and inner pages.

The “How we start” section in `src/components/sections/process.tsx` follows the second supplied recording: the scene stays pinned while titles, step digits and footer descriptions roll vertically through masks. One scroll timeline updates `--process-step` for all three reels and raises the blue-and-silver sculpture with `--process-orb-lift`. Holds between transitions keep each step readable. Mobile uses the step buttons, and reduced motion switches immediately. Run `npm run test:process` to verify the motion, reverse scrolling and responsive behavior.

The platform scene in `src/components/sections/platform-showcase.tsx` pins on desktop and zooms from the top of the MacBook lid. The full laptop and pedestal appear first; the screen then fills the stage while the keyboard and pedestal pass below it. The original hardware lives in `src/components/visuals/macbook-mockup.tsx`, with live Synapse and Firstpass HTML inside its display. Container units keep that UI fitted to the screen. Tabs and CTA stay in place; mobile and reduced-motion layouts show the complete laptop without pinning. Run `npm run test:platform` to verify hardware, scroll framing, reverse scrolling, product tabs, mobile, and reduced motion.

The landing page's main client section shows all 27 original logos in two full-color circular rows moving in opposite directions. `src/components/sections/client-logo-marquee.tsx` first reveals the circles, unfolds the overlapping rows, and fades in their logos. Only after that GSAP entrance finishes do the CSS horizontal loops start. The entrance plays once per visit to the page. Each row is duplicated for a seamless loop; copies are hidden from assistive technology. Motion pauses offscreen, on hover/focus, or with the Pause logos button. Reduced motion bypasses the entrance, stops the loops, hides the copies, and allows keyboard/touch scrolling. Update `clientLogos` in `src/content/site.ts` to change the collection. Logos use lossless WebP files and lazy loading. Run `npm run test:clients` to check the reveal order, animation and responsive behavior.

## Verification

```sh
npm run typecheck
npm run build
npm start
# In another terminal; requires a local Google Chrome installation:
npm run test:browser
npm run test:experience
npm run test:hero
npm run test:post-hero
npm run test:capabilities
# For the new pages (default preview port: 3001):
PREVIEW_URL=http://127.0.0.1:3000 npm run test:pages
```

Set `PREVIEW_URL` to test another preview URL. The browser script checks desktop and mobile layouts, scroll states in both directions, tab changes, navigation, dialogs, imagery, and reduced-motion behavior. Screenshots are written to `/tmp/vectramind-qa/`.

Dependency versions were resolved from npm's `latest` tags on October 16, 2026 and pinned with a lockfile. Use `npm ci` for the verified versions.

## Hero video

The homepage uses Vectramind’s original `Slide_1.mp4`, saved as `public/videos/vectramind-hero.mp4`, with an optimized poster at `public/images/hero-poster.webp`. The hero displays only the video; the shared header and floating contact icon remain. Playback is muted, looping and inline. Reduced-motion preferences pause the video, and playback also pauses while the hero is off-screen or the tab is hidden.

## Performance

Run Lighthouse against `npm run build` followed by `npm start`. The development server includes compilation and debugging work that makes its scores unsuitable for measuring the production site.

Images use optimized WebP variants, while small SVG logos stay vector. Fonts are local WOFF2 files. The hero poster and main font have priority hints. Text reveals initialize near the viewport, and WebGL downloads and rendering are deferred. To optimize newly imported imagery and update source references, run `node scripts/optimize-images.mjs`; original assets remain available.

The included production server supports Brotli/gzip compression, conditional caching, immutable hashed assets, and streaming video byte ranges. If hosting the static export elsewhere, configure equivalent delivery behavior there.

## Content and scope

Brand assets, client logos, company photos, published statistics and product information come from Vectramind's current website. Business figures are presented as published, not independently verified. The dashboard and patient journey are clearly marked as illustrations. Published anonymized Synapse outcomes replace third-party testimonials.

The first landing-page story uses the healthcare photograph from the live Firstpass page (`assets/images/fp-features-bg.png`), optimized to `public/images/firstpass-live-care.webp`. Its original color treatment is preserved; the crop favors the patient and reception staff. An earlier generated alternative is retained in `output/imagegen/` and is not used by the site.

Navigation, footer, product CTAs and the consultation dialog link to local pages. Product pages have selectable modules/channels with keyboard controls. Support has searchable FAQs. The blog supports search and topic filters.

Contact and support forms validate input and prepare a prefilled email to the published support address for the visitor to review and send. They do not submit messages automatically or claim successful delivery. No CRM, email service, chat service or analytics tracker is configured. The notice stores only its dismissal locally.

Article and legal HTML is sanitized before being checked into `src/content/imported/`; original scripts, styles, forms and event attributes are removed. Published legal wording, including existing source placeholders, is preserved rather than rewritten. The blog index imports summaries separately so full article bodies stay out of its client bundle.

The inner-page test suite checks all twenty new routes, desktop and mobile widths, image loading, product tabs and keyboard controls, FAQ search, blog filters, email draft creation and client navigation. Its screenshots are saved in `/tmp/vectramind-pages-qa/`.

See [the latest video analysis](docs/VIDEO_REFERENCE_2026-10-21.md) for the current design and editing map. See [the earlier reference analysis](docs/REFERENCE_ANALYSIS.md) for the design mapping and deliberate differences. The result is an adaptation, not a pixel-identical copy: Vectramind content, light-mode colors, licensed open-source font substitutes, original procedural 3D forms, and Vectramind's own photography replace the reference's branding and media.

The video-led capability sequence lives in `src/components/experience/capabilities.tsx`, with three editable SVG scenes in `capability-visual.tsx`, lightweight projection math in `capability-geometry.ts`, and theme rules in `src/app/capabilities.css`. GSAP synchronizes the rolling index, artwork and copy while scrolling; small screens and reduced motion use the previous/next buttons. The homepage capability scenes do not load WebGL.

Stage 01’s traced panel profile and signal positions are in `src/components/experience/intelligence-ribbon.ts`, using reference-screen coordinates. The broad panels, edge highlights and lower fade are composed in `capability-visual.tsx`. Its light flow and foreground mist run independently while stage 01 is visible, and pause offscreen or in a hidden tab.

Stage 01 panels circulate on a closed track defined by `intelligencePanelPose` in `intelligence-ribbon.ts`. The independent loop clock in `capabilities.tsx` takes 32 seconds per lap and pauses outside active desktop stage 01. The return arc passes beneath the haze; mobile and reduced motion retain a static pose.
# Vectramind

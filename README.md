# Vectramind — Adapt & Evolve

A responsive, light-mode Vectramind website with a silver-and-charcoal palette and four logo-colour accents. The video-inspired landing page combines animated light trails, numbered capability scenes and a connected-platform diagram. Product, company, contact, support, insight and legal pages share its typography, gutters and scroll reveals. Built with Next.js App Router, Tailwind CSS, GSAP, Framer Motion, Three.js / React Three Fiber, Hugeicons, and editable shadcn-style Radix components.

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
| Hero projected geometry and logo-color pulses       | `scripts/generate-hero-trails.mjs`, `visuals/hero-energy.tsx` |
| Globe rendering and office-marker projection        | `src/components/visuals/reach-globe-scene.tsx`         |
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
- Shared page components and responsive foundations: `src/components/pages/`, `src/app/inner-pages.css`.
- Landing-aligned page palette, gutters, heroes, cards and mobile layouts: `src/app/page-theme.css` (loaded last).
- Scroll reveals: `src/components/motion-provider.tsx`. Add `data-reveal` to an element, or extend `innerRevealTargets` in `src/components/inner-page-reveals.ts` for a reusable component. Headings, paragraphs, lists, captions, images and controls reveal independently; large content wrappers yield to their children. New filtered content and opened FAQ answers are observed automatically. Keyboard focus immediately reveals controls. Reveals run once, clean up during navigation, and respond to live reduced-motion changes. The landing page keeps its separate animation behavior. Run `npm run test:inner-reveals` to verify coverage on all 20 inner routes.
- Hero composition: `PageHero` in `src/components/pages/page-primitives.tsx`. Pass `image` for split photography or children for a product or service visual. Product previews reuse the landing page's `PlatformPreview`.
- Run `npm run test:page-theme` for palette, scroll reveal, reduced-motion and 320–2560px checks; `npm run test:pages` covers every page, article and interactive control.
- Product copy: `src/content/products.ts`.
- Imported article summaries, bodies and legal documents: `src/content/imported/`.

The template remounts the page shell on navigation to clean up scroll animations. Static exports use directory indexes, so deep links work with the included preview server.

## Animation ownership

- **GSAP + ScrollTrigger:** masked line reveals, photographic parallax, the product device perspective and desktop scroll-state transitions.
- **Lenis:** smooth desktop wheel scrolling and anchor navigation, synchronized with GSAP's ticker.
- **Framer Motion:** capability-copy transitions, loaded near the capability section; other retained product components use it for state changes.
- **Three.js:** the office globe, downloaded near its section and rendered only while needed. Archived components retain React Three Fiber, but the current homepage does not load that renderer.
- **CSS:** hero/footer light pulses, navigation and notice entrances, client-grid reveals, hover effects and responsive layouts.

Desktop pinning is disabled below 901px. Tabs and step buttons provide direct control on smaller screens. Reduced-motion preferences disable smooth scrolling, pinning, text reveals and continuous 3D rotation.

The Connected Healthcare stories in `src/components/sections/stories.tsx` use the original stacked split panels, with heading reveals and subtle image parallax. Each panel retains its own Vectramind emblem. Tablet, mobile and reduced-motion layouts show the panels in normal document order.

The shared `Mark` in `src/components/site-primitives.tsx` uses `public/images/vectramind-mark.svg`, containing the exact four coloured emblem paths from the original `vectramind-logo.svg`. It is rendered as an image so inherited text colours cannot recolour the brand. Use this component for the emblem and the original full SVG for the wordmark throughout the site.

The “How we start” section in `src/components/sections/process.tsx` follows the second supplied recording: the scene stays pinned while titles, step digits and footer descriptions roll vertically through masks. One scroll timeline updates `--process-step` for all three reels and raises the blue-and-silver sculpture with `--process-orb-lift`. Holds between transitions keep each step readable. Mobile uses the step buttons, and reduced motion switches immediately. Run `npm run test:process` to verify the motion, reverse scrolling and responsive behavior.

The platform scene in `src/components/sections/platform-showcase.tsx` pins on desktop and zooms from the top of the MacBook lid. The full laptop and pedestal appear first; the screen then fills the stage while the keyboard and pedestal pass below it. The original hardware lives in `src/components/visuals/macbook-mockup.tsx`, with live Synapse and Firstpass HTML inside its display. Container units keep that UI fitted to the screen. Tabs and CTA stay in place; mobile and reduced-motion layouts show the complete laptop without pinning. Run `npm run test:platform` to verify hardware, scroll framing, reverse scrolling, product tabs, mobile, and reduced motion.

The landing page’s client section uses a ruled logo grid with 12 clients initially and a keyboard-accessible control to expand to all 27. It uses shared page gutters, an entrance reveal and the neutral landing-page palette. Edit `clientLogos` in `src/content/site.ts` and `src/components/sections/client-logo-grid.tsx`. Run `npm run test:clients` to verify expansion, logo loading, reduced motion and responsive bounds.

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
npm run test:capabilities-mobile
# For the new pages (default preview port: 3001):
PREVIEW_URL=http://127.0.0.1:3000 npm run test:pages
```

Set `PREVIEW_URL` to test another preview URL. The browser script checks desktop and mobile layouts, scroll states in both directions, tab changes, navigation, dialogs, imagery, and reduced-motion behavior. Screenshots are written to `/tmp/vectramind-qa/`.

Dependency versions were resolved from npm's `latest` tags on October 16, 2026 and pinned with a lockfile. Use `npm ci` for the verified versions.

## Hero and performance

The current hero uses SVG light trails with CSS pulses in the four original logo colours. `scripts/generate-hero-trails.mjs` bakes the original 3D camera and curves into compact vector coordinates. Run `npm run generate:hero` after editing those curves. No WebGL context or Three.js download is needed for the hero. Pulses pause offscreen, in hidden tabs and for reduced motion.

Run a repeatable Lighthouse audit with one command:

```sh
npm run audit
# Or select one profile:
npm run audit:desktop
npm run audit:mobile
# Audit a specific page in both profiles:
npm run audit -- --path=/synapse/
```

Each command builds a fresh production export, starts an isolated preview on an available local port, runs Lighthouse 13.5.0, saves HTML and JSON reports in `test-results/lighthouse/`, and stops only its own preview. The combined command builds once and runs desktop and mobile sequentially. Mobile uses Lighthouse's standard throttled profile; desktop uses its standard desktop preset. Scores depend on the browser, machine and delivery environment.

To inspect the production website in your browser, run `npm run preview` and open http://localhost:3001. The development server (`npm run dev`) remains on port 3000 and includes development-only work. Local hot reload supports both `localhost` and `127.0.0.1` through `allowedDevOrigins`.

Set `PREVIEW_URL` only to audit an existing production deployment without rebuilding. Development-server URLs are detected and rejected with an explanatory message, preventing development results from being mistaken for production results.

The hero text is server-rendered and immediately visible. Local fonts are preloaded, with optional font display to prevent late swaps. CSS is inlined using this installed Next.js version's `experimental.inlineCss` setting. This removes a render-blocking CSS request in exchange for a larger HTML response; revisit the setting if the hosting or caching strategy changes.

Lower sections keep their copy and controls in the HTML. Animation controllers load near the viewport, and the homepage smooth-scroll/text-reveal engine loads on scroll or keyboard navigation. The capability artwork mounts near its section. Lightweight CSS handles navigation, notice and client-logo entrances. The globe loads only near its section and uses Three's `Timer`; it renders at most 30 frames per second while moving, caps pixels at 1.4 million, and stops when settled, hidden or offscreen.

The production server supports Brotli/gzip compression, conditional caching, immutable hashed assets and streaming video byte ranges. Configure equivalent delivery behavior when hosting `out/` elsewhere. Use `node scripts/optimize-images.mjs` for newly imported photography; original assets remain available.

`public/robots.txt` supplies explicit crawler rules in development and in the static export. Production browser source maps are enabled for diagnostics; the source is already public in this repository. They are fetched by debugging tools rather than normal page navigation, and the included server serves them as compressed JSON.

## Content and scope

Brand assets, client logos, company photos, published statistics and product information come from Vectramind's current website. Business figures are presented as published, not independently verified. The dashboard and patient journey are clearly marked as illustrations. Published anonymized Synapse outcomes replace third-party testimonials.

The first landing-page story uses the healthcare photograph from the live Firstpass page (`assets/images/fp-features-bg.png`), optimized to `public/images/firstpass-live-care.webp`. Its original color treatment is preserved; the crop favors the patient and reception staff. An earlier generated alternative is retained in `output/imagegen/` and is not used by the site.

Navigation, footer, product CTAs and the consultation dialog link to local pages. Product pages have selectable modules/channels with keyboard controls. Support has searchable FAQs. The blog supports search and topic filters.

Contact and support forms validate input and prepare a prefilled email to the published support address for the visitor to review and send. They do not submit messages automatically or claim successful delivery. No CRM, email service, chat service or analytics tracker is configured. The notice stores only its dismissal locally.

Article and legal HTML is sanitized before being checked into `src/content/imported/`; original scripts, styles, forms and event attributes are removed. Published legal wording, including existing source placeholders, is preserved rather than rewritten. The blog index imports summaries separately so full article bodies stay out of its client bundle.

Inner pages use native IntersectionObserver and Web Animations reveals. Initially visible hero content stays painted during hydration; sections below the viewport reveal as they enter. Dynamic FAQs, search results, keyboard focus and live reduced-motion preferences are supported without loading GSAP, SplitText or Lenis at startup. Parallax photos update on scroll without a permanent animation loop. Synapse and Firstpass render their static product content on the server, keeping tabs, FAQ search and the success-story carousel interactive.

The inner-page test suite checks all twenty new routes, desktop and mobile widths, image loading, product tabs and keyboard controls, the success-story carousel, FAQ search, blog filters, email draft creation and client navigation. Its screenshots are saved in `/tmp/vectramind-pages-qa/`.

See [the latest video analysis](docs/VIDEO_REFERENCE_2026-10-21.md) for the current design and editing map. See [the earlier reference analysis](docs/REFERENCE_ANALYSIS.md) for the design mapping and deliberate differences. The result is an adaptation, not a pixel-identical copy: Vectramind content, light-mode colors, licensed open-source font substitutes, original procedural 3D forms, and Vectramind's own photography replace the reference's branding and media.

The video-led capability sequence lives in `src/components/experience/capabilities.tsx` and its deferred `capabilities-animation.ts` controller, with three editable SVG scenes in `capability-visual.tsx`, lightweight projection math in `capability-geometry.ts`, and theme rules in `src/app/capabilities.css`. GSAP synchronizes the rolling index, artwork and copy while scrolling; small screens and reduced motion use the previous/next buttons. The homepage capability scenes do not load WebGL. Mobile and tablet artwork also animates: stage 01 circulates its panels, stage 02 builds and compresses its layers before raising the stack, and stage 03 connects its chips sequentially. Button selection controls the chapter without pinning the mobile page. Geometry updates are capped at 30 fps and pause when the artwork is offscreen or the tab is hidden; reduced motion restores static scenes. Run `npm run test:capabilities-mobile` to verify these behaviors.

Stage 01’s traced panel profile and signal positions are in `src/components/experience/intelligence-ribbon.ts`, using reference-screen coordinates. The broad panels, edge highlights and lower fade are composed in `capability-visual.tsx`. Its light flow and foreground mist run independently while stage 01 is visible, and pause offscreen or in a hidden tab.

Stage 01 panels circulate on a closed track defined by `intelligencePanelPose` in `intelligence-ribbon.ts`. The independent loop clock in `capabilities-animation.ts` takes 32 seconds per lap and pauses outside active desktop stage 01. The return arc passes beneath the haze. `capabilities-mobile-motion.ts` uses the same 32-second lap on phones and tablets, capped at 30 geometry updates per second. Both controllers pause offscreen; reduced motion retains a static pose.
# Vectramind

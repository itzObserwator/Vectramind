# Production Lighthouse verification — 23 October 2026

## Synapse follow-up

The latest uploaded report is for `/synapse/`, rather than the homepage. Before this follow-up, the production route measured 99/100/100/100 on desktop and 88/100/100/100 on mobile, with 240 ms mobile blocking. The development route reproduced 72 Performance with 680 ms blocking; its current Best Practices score is already 100 with no console errors. The screenshot's 96 Best Practices failure did not reproduce on either current server.

Inner pages now use native scroll reveals instead of eagerly loading GSAP, SplitText and Lenis. Already-visible content remains painted during hydration. Below-fold text and artwork retain scroll entry animation, keyboard-focus visibility, mutation registration and live reduced-motion cleanup. Parallax photos update on scroll with no permanent ticker. Synapse's story transition uses CSS instead of importing Framer Motion. Product page static content is server-rendered, with tabs and FAQ search separated into interactive components.

Final Synapse production measurements:

| Category | Desktop | Mobile |
| --- | ---: | ---: |
| Performance | 100 | 94 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

Desktop: FCP 0.3 s, LCP 0.6 s, blocking 0 ms, Speed Index 0.3 s and CLS 0. Mobile: FCP 1.0 s, LCP 2.9 s, blocking 130 ms, Speed Index 1.0 s and CLS 0. Mobile blocking decreased from 240 to 130 ms; mobile Performance increased from 88 to 94. Remaining mobile LCP and hydration cost prevent claiming a mobile score of 100. These are standard simulated Lighthouse profiles, not guarantees for every machine or deployment.

Audit any route with `npm run audit -- --path=/synapse/`. This builds a fresh production export and saves route-specific desktop and mobile reports without overwriting the homepage reports. Explicit production `PREVIEW_URL` values still skip the build.

## Homepage measurements

Audited a fresh static production export with `npm run audit`, which builds with Next.js 16.4.2 and starts an isolated preview on an available port. Lighthouse 13.5.0, Chrome 155.0.0.0, cold-cache navigation, standard desktop preset and standard simulated mobile throttling. No user-agent overrides, audit detection, disabled application features or altered scoring settings.

| Category       | Desktop | Mobile |
| -------------- | ------: | -----: |
| Performance    |     100 |     92 |
| Accessibility  |     100 |    100 |
| Best Practices |     100 |    100 |
| SEO            |     100 |    100 |

The initial production mobile baseline was 56/100/100/100. The uploaded screenshot showed a development-server audit, which includes additional compilation/debugging work and is not directly comparable to the production results.

Latest mobile metrics: FCP 1.1 s, LCP 3.2 s, Speed Index 1.1 s, total blocking time 110 ms, CLS 0. Previous runs measured 93 Performance and 70 ms blocking; the latest fresh-preview run measured 92. The initial production baseline had 990 ms blocking time. Mobile Performance has improved substantially but has not reached 100; initial hydration and LCP remain the limiting metrics. Desktop reached 100 in every category on repeated checks. Scores vary by run, device and hosting environment.

The newer development-server screenshot was reproduced at 76 Performance, 100 Accessibility, 96 Best Practices and 100 SEO. Its console failures were blocked hot-reload WebSocket connections when using `127.0.0.1`. Adding that loopback hostname to `allowedDevOrigins` restored hot reload and development Best Practices to 100. Development-only main-thread work remains in `next dev`; production results must be measured separately. No development assets or warnings are hidden from Lighthouse.

## Changes

- Server-rendered, immediately visible hero copy; build-time projection of the original hero geometry into SVG. CSS animates the original four-direction light trails without a WebGL context.
- Deferred animation controllers and capability artwork. Homepage smooth scrolling and general text-reveal code load when scrolling or keyboard navigation begins; section controllers load near their sections. Readable content remains in the initial HTML.
- Local font preloads, optional font display, inline stylesheets, deferred footer mist and lightweight static laurel assets.
- Globe uses Three's visibility-aware `Timer` directly. Existing shaders, city projection, 30 Hz and 1.4-million-pixel caps remain; zero renders when settled or offscreen.
- Accessible names include visible labels; corrected decorative hub semantics and insufficient text contrast in previews, office controls and footer links.

## Reproduce

```sh
npm run audit
# Or a single profile:
npm run audit:desktop
npm run audit:mobile
```

The command builds once, starts its own production server on an ephemeral port, runs each profile sequentially, writes HTML and JSON reports to the ignored `test-results/lighthouse/` directory, and stops its own server. Existing development and preview servers remain running. Explicit `PREVIEW_URL` values skip the build and use that production deployment; development HTML is rejected with a clear message.

For a persistent production preview in Chrome, run `npm run preview` and open `http://localhost:3001/`. The included server provides compression and caching; configure equivalent delivery when deploying the static export elsewhere.

## Regression checks

Production build and TypeScript checks pass. Browser checks cover hero motion and controls, the timed post-hero sequence, capability scenes, ecosystem progression, platform-card staging, city navigation and render budgets, footer behavior, client expansion, all 20 inner routes and their scroll reveals, mobile bounds, keyboard use and reduced motion. A separate console check through the hero and globe found no errors or warnings.

The audit workflow was checked end to end, including development-URL detection, successful hot-reload connections from both local hostnames, fresh-build report generation, and owned-preview cleanup. The existing preview on port 3001 and development server on port 3000 were left running.

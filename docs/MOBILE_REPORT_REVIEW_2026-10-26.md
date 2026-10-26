# Mobile report review — 26 October 2026

Read all four pages of `Vectramind Mobile Download.pdf`. The report audits `https://vectramind-seven.vercel.app/` using Lighthouse 13.4.1, an emulated Moto G Power and Slow 4G. It records 81 Performance, 100 Accessibility, 96 Best Practices and 100 SEO, with 590 ms blocking, 2.7 s LCP and CLS 0. The report explicitly warns that browser extensions negatively affected its results.

## Reproduction

A clean Chrome audit of the deployed URL, before these changes, measured **96/100/100/100**, approximately 80 ms blocking, 427 KiB transferred and 47 KiB estimated unused JavaScript. It logged no browser errors and no run warnings. The PDF's 753 KiB unused-JavaScript estimate and its console failure did not reproduce in that initial-load audit. The extension warning matters; these observations do not establish the exact source of the PDF's unexpanded console error.

The new changes were measured separately on a local production preview, rather than treating deployment and localhost scores as directly interchangeable.

## Changes

- **Lighter hero rendering:** generated the unchanged static linework into two SVG assets. The client imports only the sixteen pulse paths, instead of the complete static-and-animated ribbon geometry. Hero DOM descendants decreased from 82 to 20, with about 34 KB less uncompressed initial JavaScript. Before/after hero image comparisons at 390 px and 1440 px found no changed pixels in the artwork region. Original four-direction pulses, timing, colors, hidden/offscreen pause and reduced motion remain.
- **Mobile navigation:** opening the menu locks native page scrolling and pauses the homepage Lenis animation, including in-flight momentum. The menu retains its own native scrolling without scroll chaining, fits the dynamic viewport and has a 44 px minimum close/open target. Keyboard focus cycles within the menu and close button; Escape restores focus. Consultation, route changes and switching above the 900 px breakpoint close it and restore page scrolling.
- **Phones without WebGL:** reproduced `THREE.WebGLRenderer: Error creating WebGL context` when hardware rendering was unavailable. Three's constructor logged before the previous catch handler could display its fallback. The globe now acquires a usable WebGL2 context first and supplies it to Three. Unsupported devices display one fallback, without that constructor error, and all office controls remain usable. This is a verified application failure case, not proof that it caused the PDF's initial-load console failure.

## Results

Final checks use Lighthouse 13.4.1 and standard desktop/mobile profiles against the local production export.

| Category | Local mobile before | Local mobile after | Desktop after |
| --- | ---: | ---: | ---: |
| Performance | 92 | 93 | 100 |
| Accessibility | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |

Latest mobile metrics: FCP 1.0 s, LCP 3.1 s, blocking 110 ms, CLS 0, total transfer approximately 407 KiB. The local baseline measured 120 ms blocking and 416 KiB transferred. Another verification run measured 80 ms blocking; normal run variance remains. Mobile Performance is **not** 100. Desktop blocking is 0 ms and LCP is 0.7 s.

The code changes have been verified locally. The deployed URL's clean baseline above predates them; it is not presented as an updated deployment result.

## Checks

- Production build, TypeScript and whitespace checks.
- `test:mobile-report`: 320×568, 360×640, 390×844, 430×932, 768×1024 and 844×390; bounds, scroll locking, nested menu scrolling, keyboard focus, Escape, consultation, resizing and route navigation; no browser errors.
- `test:hero`: visible moving pulses, original framing at 320–2560 px, consultation and platform actions, reduced motion; no browser errors.
- `test:capabilities-mobile`: moving fins, layer sequence, chip connections, pause behavior, reduced motion and chapter controls at 320–900 px.
- `test:pages`: ten inner pages and ten article routes, desktop/mobile layout, asset loading, tabs, search, forms and client navigation; no browser errors.
- `test:footer`: trail movement, visibility pause, links, email draft, back-to-top, responsive bounds and reduced motion.
- `test:reach`: normal 30 Hz/pixel-limited rendering, idle/offscreen pause, five-office controls and responsive bounds; network fallback and the new no-WebGL case with one fallback and zero browser errors.

Audit artifacts are in ignored `test-results/lighthouse/mobile-report-after-*.report.html` and `.json` files. Mobile screenshots are in `/tmp/vectramind-mobile-report/`.

## Informational findings

The sixteen curved SVG pulses still use `stroke-dashoffset`, which requires paint. They were preserved rather than removed to silence the non-composited-animation diagnostic. Their static background geometry no longer contributes live paths or duplicated client geometry. Some unused initial-load coverage and compatibility polyfills belong to Next.js; removing them blindly would affect other interactions and supported browsers. Scroll-scene initialization still takes layout measurements.

The PDF's CSP, COOP, clickjacking and Trusted Types entries are manual hosting checks, not failed mobile layout audits. This change does not claim to configure all deployment policies. The production source-map audit passes, although the Lighthouse CLI can still print mapping-boundary warnings for framework-generated maps; those are separate from browser console errors.

## Reproduce

```sh
npm run build
PORT=3001 npm start
# In another terminal:
npm run test:mobile-report
PREVIEW_URL=http://127.0.0.1:3001 npm run test:hero
npm run test:capabilities-mobile
PREVIEW_URL=http://127.0.0.1:3001 npm run test:reach
npm run test:pages
PREVIEW_URL=http://127.0.0.1:3001 npm run test:footer
npm run audit
```

The project's audit script uses its pinned Lighthouse 13.5.0. The PDF-version comparisons above used the cached Lighthouse 13.4.1 CLI directly. Use an extension-free browser and production build for performance comparisons; scores depend on device, network, delivery and machine load.

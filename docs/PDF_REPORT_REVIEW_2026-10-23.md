# Review of Vectramind Report.pdf — 23 October 2026

Read all five pages of the supplied PDF. It records a desktop audit of `http://localhost:3000/` at 18:26, using Lighthouse 13.4.1 and Chrome 155 with custom throttling. Its scores are 76 Performance, 97 Accessibility, 96 Best Practices and 92 SEO.

## Fixes

- Fixed the client-strip label's insufficient contrast: `#777` on `#fafafa` measured 4.29:1; `#62656b` measures 5.60:1. Applied the same readable muted color to post-hero descriptions, small illustration labels, the newsletter placeholder and the default platform-description style. Sizes, artwork and motion remain unchanged.
- Added explicit `public/robots.txt` rules, allowing crawling. The file is served directly in development and included in the static export, resolving the report's missing/timed-out crawler-file request.
- Enabled Next.js production browser source maps. The repository source is public. Normal visitors do not download the maps; debugging tools can request them. The production server serves maps as JSON with compression and immutable caching for hashed assets.

## Verification

Final production audits use **Lighthouse 13.4.1**, matching the PDF, and Chrome 155. Desktop uses its standard preset and mobile uses its standard simulated throttling. These profiles are not identical to the PDF's custom throttling; comparisons also distinguish development from production.

| Category | Supplied PDF, development | Current development | Production desktop | Production mobile |
| --- | ---: | ---: | ---: | ---: |
| Performance | 76 | 74 | 100 | 92 |
| Accessibility | 97 | 100 | 100 | 100 |
| Best Practices | 96 | 100 | 100 | 100 |
| SEO | 92 | 100 | 100 | 100 |

Production desktop blocking time is **0 ms**, compared with 600 ms in the PDF and 640 ms in the current development audit. Production mobile measures FCP 1.1 s, LCP 3.3 s, blocking 90 ms, Speed Index 1.1 s and CLS 0. Mobile Performance is not 100.

The explicit robots, source-map, contrast, browser-console and back/forward-cache audits pass in production. Desktop transfer size is approximately **501 KiB**, compared with 4,356 KiB in the PDF's development audit. Production CSS and JavaScript minification checks pass.

Additional checks:

- Scanned nine landing-page sections at 1440 px and 390 px with the same axe version used by Lighthouse 13.4.1. Reduced-motion presentation exposes the section text without waiting for entrances. Both scans returned zero contrast violations and zero page errors.
- Verified crawler rules return HTTP 200 and the expected text.
- Verified all eight modern-browser initial JavaScript source maps return HTTP 200 with valid version-3 JSON. Larger maps use Brotli compression. Next's precompiled `nomodule` legacy-browser fallback is not part of the modern-browser request set.
- Production build and TypeScript checks pass.

Reports and delivery/contrast evidence are saved in the ignored `test-results/lighthouse/pdf-followup-*` files.

## Remaining informational diagnostics

The development server intentionally includes debugging code, hot reload, unminified assets and a live WebSocket. Its `no-store` document response and WebSocket prevent the reported back/forward-cache restoration. The production server does not have those development restrictions and passes that audit. Changing the application to conceal development tooling from Lighthouse would not improve the deployed site.

SVG path pulses animate `stroke-dashoffset` to follow the existing curved trails. Chrome reports these as non-composited animations; they still require paint. Their shape and animation have been preserved, with the existing offscreen/hidden-tab pause and reduced-motion support. Production CLS remains zero. Some unused code/styles belong to framework navigation, browser compatibility and sections below the initial viewport; initial-load coverage does not establish that they can safely be deleted. GSAP also takes layout measurements when preparing scroll scenes. These diagnostics are not promises of additional removable bytes or category-score failures.

Lighthouse accepts the generated source maps. Its CLI can still print mapping-boundary warnings for some Next/webpack-generated chunks, and the webpack runtime map has optional missing `sourcesContent` entries. The application does not log browser errors; generated vendor maps were not manually rewritten to silence tooling warnings.

The PDF's CSP, HSTS, COOP, clickjacking and Trusted Types entries are manual hosting checks, rather than failed scored audits. The included production server supplies `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options`. HTTPS-dependent hosting policies must be verified on the actual deployed origin; a localhost HTTP audit cannot establish their production configuration.

## Reproduce

```sh
npm run preview
# Audit the production preview at http://localhost:3001/, not next dev on 3000.
npm run audit
```

The project audit command builds a fresh export and runs its pinned Lighthouse 13.5.0 on an isolated server. For the PDF-version comparison, run Lighthouse 13.4.1 against a production preview using the standard desktop or mobile preset. Scores vary with device, delivery and test conditions.

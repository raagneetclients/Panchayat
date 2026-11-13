# Verification — 6 November 2026

## Executed checks

- TypeScript: `npm run typecheck` passed.
- Evidence/media checks: `npm run check:content` passed (44 evidence records, six licensed assets, real Dhar polygon). The state emblem is an official identity reference awaiting institutional use authorization; it is not labelled as an open-licence photograph.
- Historical framework production build passed on the previous Sites runtime; it is superseded by the Netlify migration re-run below.
- Netlify migration re-run (13 November 2026): `npm run typecheck`, `npm run check:content`, `npm test` (18 tests) and `npm run build` passed with the standard Next.js build. Local Next server checks returned `/` → `/hi/`, rendered Hindi and English pages, returned 405 for public bid GET, 403 for anonymous review and 400/403 for invalid/cross-origin bid submissions. A valid bid submission returned 503 without `NETLIFY_DB_URL`, as expected for the unlinked local runtime. Advertising persistence calls and review audit behavior are covered by repository tests; a live Netlify Database integration run requires a linked database branch.
- Local HTTP crawl: 101 page/resource URLs checked, zero non-200 failures. Detailed output: `docs/route-check-results.json`.
- External links: 36 attempted; 31 initially returned 200. Five older official links failed due to a PDF 404, DNS, TLS certificate/legacy renegotiation or timeout. Kept legacy failures in `docs/legacy-link-failures.json` and final results in `docs/external-link-results.json`. No TLS checks were bypassed. Replaced public legacy links with current HTTP-200 NREGA, PMAY-G and LokOS portals and working district/ministry reference pages. Research notes preserve the history.

## Browser checks actually performed through CUA

- Hindi homepage rendered with real local photographs and Unicode Devanagari.
- Madhya Pradesh emblem loaded at original colours/proportions (300px source), including mobile header.
- CM portrait present with source and credit.
- Mobile menu opened and scheme navigation worked.
- Scheme keyword and category filters reduced the directory to one housing result.
- Scheme detail loaded; Hindi → English → Hindi preserved the PMAY-G detail route.
- Dismissible advertising popup appeared; close/continue worked.
- Required form submission with missing name produced browser validation.
- A clearly labelled synthetic test bid returned `BID-4A294A49` with pending review status.
- Anonymous admin view showed only the sign-in requirement. That earlier local mock sign-in path has since been removed; reviewer access now uses Netlify Identity.
- Qualify/approve saved the test decision and published a labelled test advertisement on the homepage.
- Personal phone and personal submitter name were absent from public homepage text; only approved business name/message displayed.
- Map zoom reached scale 1.25; native block selector offered all 13 development blocks.
- Viewport checks at 360, 390, 768, 1024 and 1440 pixels showed no horizontal overflow and no loaded broken images. Desktop and 390px mobile screenshots inspected visually.

## Negative API checks executed

- Invalid name/phone/business/amount/message/consent: HTTP 400.
- Cross-origin bid POST: HTTP 403 (also blocked by the dev server).
- Public GET of private bids: HTTP 405.
- Anonymous review attempt: HTTP 403.
- Public approved-ad projection: HTTP 200 with no private phone field.

## Limits

No Lighthouse score, screen-reader certification, full contrast audit, independent WCAG/GIGW audit, penetration test or slow-network/device benchmark is claimed. The unavailable MCP integrations are documented in research-sources.md. Historical map boundary is not a verified current legal boundary; no verified block polygons or office pin were obtained. Current official content and advertising authorization remain pending. The general editorial content model is CMS-ready code, not a deployed general-purpose editorial CMS.

Final QA additions, production verification and remaining caveats are appended below as completed.

## Final QA additions

- Clean preview restarted after changing middleware.ts to the current proxy.ts convention. Production build passed with the updated route configuration.
- Escape dismissed the popup; font control changed root size to 110%; high contrast toggled on and was reset.
- Map zoom and selecting Bagh updated the detail link to /hi/blocks/bagh; clicking it loaded the Bagh information page.
- The synthetic ad was withdrawn through the protected reviewer UI and the persisted status verified as rejected. No test advertisement remains approved. Local-only test records are excluded from the deployment archive/database.

- English site search with query “housing” returned the matching scheme result.
- English homepage also showed no horizontal overflow at 360, 390, 768, 1024 and 1440px. Hindi and English document language attributes were verified through rendered DOM.
- Final rerun after legacy-link replacement: 101 local URLs returned HTTP 200; all 36 outgoing URLs returned HTTP 200. Availability is a point-in-time check, not a guarantee of future government portal uptime.

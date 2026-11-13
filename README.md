# जिला पंचायत धार / Zila Panchayat Dhar

Source-backed, Hindi-first bilingual development prototype. **Not an approved government website.** Includes substantive public pages, six scheme summaries/details, all 13 historical block records, a real district boundary, official service links, sources, image credits and an advertising bid/review workflow.

## Run

Node 22.13+ is required.

```sh
npm ci
npm run db:generate  # only when db/schema.ts changes; do not recreate existing migrations
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_hard_lord_tyger.sql
npm run dev -- --hostname 127.0.0.1 --port 5173
```

Apply the existing migration only once per fresh local database. The dev server uses a persistent local D1 instance. It is separate from hosted data. Do not run two dev servers or an installer while changing dependency inputs. `npm start -- --port 5174` previews the built Worker.

## Architecture

TypeScript, React, Next App Router conventions on the supplied Vinext runtime, Cloudflare Workers, D1 and Drizzle migrations. Custom CSS design system; Lucide icons; locally served variable fonts. No heavy animation or map-tile library is required. The map renders a licensed real polygon and provides zoom controls plus the accessible 13-block directory; block locations/boundaries remain unverified.

- `app/[lang]/[[...slug]]/page.tsx`: bilingual public routes (`hi`, `en`).
- `components/`: shared civic UI, directories, map, homepage, inner content and advertising.
- `data/content.ts`: structured bilingual editorial records.
- `public/evidence-register.json`: field-level source register.
- `research-sources.md`: actual source checks, conflicts and tool limitations.
- `media-manifest.json`: image licence, source, modifications and approval status.
- `db/schema.ts`, `drizzle/`: persistent bids and review audit trail.
- `app/api/bids`, `app/api/ads`: validated submissions, protected decisions and public approved-ad projection.
- `app/admin/advertising`: protected advertising review queue.

See [content administration](docs/content-administration.md), [design system](docs/design-system.md), [test results](docs/test-results.md), and [pre-publication checklist](docs/pre-publication-checklist.md).

## Advertising

The homepage popup appears once per browser session and can be closed with the button or Escape. It includes an illustrated Hindi pesticide-category banner under the fictional name “खेत साथी”; the sample makes no product efficacy, sale or government endorsement claim and advises following registered product labels and agricultural experts. The popup links to `/hi/advertise`. Bid fields: name, 10-digit Indian phone, business name, amount and advertising reason/message; explicit consent required. Submissions stay pending until an authorized reviewer approves. Public ads reveal only business name and message; personal name and phone remain private. No payment is taken. Advertisements are labelled and never imply CM or institutional endorsement.

Private reviewers use `/admin/advertising` and Sites ChatGPT sign-in. `ADMIN_REVIEWER_EMAILS` is a secret runtime allowlist; `ADMIN_USER_IDS` is an optional ID allowlist. The Site owner is configured as initial reviewer. On local dev, the bundled loopback-only mock login is enabled; it is not a production authentication mechanism. When deploying elsewhere, replace the Sites identity adapter with trusted authentication and never trust client-provided identity headers.

## Verification

```sh
npm run typecheck
npm run check:content
npm run build
```

Browser interaction and local API checks are documented separately. No claim of a complete WCAG/GIGW certification, independent security audit or Lighthouse score is made.

## Deployment

The selected Site is persisted in `.openai/hosting.json`; preserve its project ID. The manifest enables D1 as `DB`. Use the Sites source workflow to push the exact source, build/package an artifact and publish a private version. Hosted migrations apply before Worker publication. Store reviewer allowlists and other secrets in runtime environment settings, never in tracked source or the hosting manifest. Keep the initial owner-private audience.

For a standalone Cloudflare deployment, provision D1, apply checked-in migrations and configure the Worker runtime/authentication deliberately. This is not a static Next export, and `next start` alone does not supply Cloudflare D1. Do not publish a static snapshot and expect bid submissions to persist.

## Pending real-world verification

Office address/pin/hours, president, complete approved Gram Panchayat dataset, current block boundaries, project-level records, reporting periods and some local scheme criteria are unavailable. Their pages explicitly explain the limitation and link to official sources. The 761/764 Panchayat conflict is documented. The office action is a correctly labelled Maps **search**, not fabricated directions.

A source-backed Chief Minister photo and the user-requested MP emblem are included. The emblem remains subject to institutional publication authorization. All pages remain prototype-labelled and noindex until authorized publication.

# जिला पंचायत धार / Zila Panchayat Dhar

Source-backed, Hindi-first bilingual development prototype. **Not an approved government website.** Includes substantive public pages, six scheme summaries/details, all 13 historical block records, a real district boundary, official service links, sources, image credits and an advertising bid/review workflow.

The application now runs as a standard Next.js App Router project on Netlify. It is not a static export: public pages, Route Handlers, Netlify Functions, Netlify Database and Netlify Identity are part of the runtime.

## Run locally

Node 22.13+ is required.

```sh
npm ci
npm run dev
```

For database-backed local development, link the project with the Netlify CLI. `netlify dev` starts a local Postgres database, the Next.js dev server and the local Identity endpoint:

```sh
npm install -g netlify-cli
netlify login
netlify link
netlify dev
```

In a second terminal, apply the checked-in migrations to that running local database:

```sh
npm run db:apply
```

`npm run dev` works for public pages. Advertising submission and reviewer sign-in require the Netlify runtime, so use `netlify dev` for full local API and authentication testing. The app does not fall back to local files, SQLite or in-memory persistence.

## Architecture

TypeScript, React and Next.js App Router, deployed through Netlify's supported Next.js integration (OpenNext adapter). PostgreSQL on Netlify Database with Drizzle ORM and checked-in migrations. Custom CSS design system; Lucide icons; locally served variable fonts.

- `app/[lang]/[[...slug]]/page.tsx`: bilingual public routes (`hi`, `en`).
- `components/`: shared civic UI, directories, map, homepage, inner content, advertising and authentication forms.
- `data/content.ts`: structured bilingual editorial records.
- `public/evidence-register.json`: field-level source register.
- `research-sources.md`: actual source checks, conflicts and tool limitations.
- `media-manifest.json`: image licence, source, modifications and approval status.
- `db/schema.ts`: Drizzle PostgreSQL schema for bids and review audit history.
- `db/advertising.ts`: persistence, rate limiting and decision transactions.
- `netlify/database/migrations/`: migrations applied automatically by Netlify Database.
- `app/api/bids`, `app/api/ads`: validated submissions, protected decisions and the public approved-ad projection.
- `app/admin/advertising`: protected advertising review queue.
- `app/login`: Netlify Identity reviewer sign-in.

See [content administration](docs/content-administration.md), [design system](docs/design-system.md), [test results](docs/test-results.md), and [pre-publication checklist](docs/pre-publication-checklist.md).

## Advertising

The homepage popup appears once per browser session and can be closed with the button or Escape. It includes an illustrated Hindi pesticide-category banner under the fictional name “खेत साथी”; the sample makes no product efficacy, sale or government endorsement claim and advises following registered product labels and agricultural experts. The popup links to `/hi/advertise`. Bid fields: name, 10-digit Indian phone, business name, amount and advertising reason/message; explicit consent required. Submissions stay pending until an authorized reviewer approves. Public ads reveal only business name and message; personal name and phone remain private. No payment is taken. Advertisements are labelled and never imply CM or institutional endorsement.

Bid validation, same-origin writes, honeypot rejection and the five-per-day submitter limit run on the server. A single PostgreSQL statement records a decision and its immutable audit revision together. Approved ads are ordered by amount descending and submission time, limited to six; the highest amount is not automatic qualification.

## Reviewer authentication

Reviewers sign in at `/login/?return_to=/admin/advertising/`. Authentication uses Netlify Identity through `@netlify/identity`; there is no local mock identity and no production bypass. The server verifies the Identity session before rendering the private queue or accepting a review decision. Client-supplied identity headers are not trusted.

Reviewer authorization uses these server-side environment variable names:

- `ADMIN_REVIEWER_EMAILS` — required comma-separated allowlist of reviewer emails.
- `ADMIN_USER_IDS` — optional comma-separated allowlist of Netlify Identity user IDs.

Set values in the Netlify UI, never in tracked source. The login response is dynamic and marked `no-store`.

## Netlify setup from GitHub

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository. For an existing site, keep the same GitHub connection so pushes trigger new deploys.
3. Confirm the build settings. They are committed in `netlify.toml`:
   - build command: `npm run build`
   - publish directory: `.next`
   - Node.js: 22
4. Deploy. Netlify detects Next.js and provisions the supported adapter automatically. Successful deployments should show server Functions for App Router pages and Route Handlers. A deployment that only uploads static assets and returns Netlify's 404 page is not configured correctly.
5. Enable Netlify Identity for the site (see below), add the reviewer environment variables, then redeploy if environment variables changed.
6. Push to the connected branch (normally `main`) to create the next Git-based deploy.

Do not set a manual static publish directory, do not use `next export`, and do not replace `netlify.toml` with an unsupported hosting configuration.

## Netlify Database

Installing `@netlify/database` lets Netlify provision the project database. The connection string is injected as `NETLIFY_DB_URL` in builds, Functions and Edge Functions; do not commit it or set it by hand for hosted deploys.

The Drizzle schema is `db/schema.ts`. Generate a new migration after schema changes:

```sh
npm run db:generate
```

Migrations live in `netlify/database/migrations/` and Netlify applies them automatically before publishing a production deploy or deploy preview. A failed migration blocks publication. To apply pending migrations to a linked local development database:

```sh
npm run db:apply
```

To inspect migration state:

```sh
netlify database status
```

The previous Cloudflare D1 database is not transferred by this code migration. Existing hosted bid/review data, if any, needs a separate explicit export from D1 and import into Netlify Database after reviewing field types, timestamps and personal-data handling. Do not assume that creating the new schema transfers old rows.

## Netlify Identity activation

1. In the Netlify UI, open the site and go to **Identity**, then select **Enable Identity**.
2. Set registration to invite-only (disable public sign-up) and invite the reviewer email address. Confirmation is required unless the site deliberately enables autoconfirm.
3. Add the confirmed reviewer email to `ADMIN_REVIEWER_EMAILS`. Optionally add the Identity user ID to `ADMIN_USER_IDS`.
4. Redeploy after changing environment variables.
5. Visit `/login/?return_to=/admin/advertising/`, sign in, and confirm the private queue loads. An account that is not on an allowlist must see the unauthorized message and no bid data.

Identity requires HTTPS; Netlify's `*.netlify.app` domain and configured custom domains provide it.

## Verification

```sh
npm run typecheck
npm run check:content
npm test
npm run build
```

The automated tests cover bid validation, reviewer authorization, safe return paths, PostgreSQL persistence calls, review decisions/audit data and the privacy of the public approved-ad projection. A real database integration check requires a linked local or hosted Netlify Database; it is not simulated with local SQLite or in-memory storage.

Browser interaction and local API checks are documented separately. No claim of a complete WCAG/GIGW certification, independent security audit or Lighthouse score is made.

## Pending real-world verification

Office address/pin/hours, president, complete approved Gram Panchayat dataset, current block boundaries, project-level records, reporting periods and some local scheme criteria are unavailable. Their pages explicitly explain the limitation and link to official sources. The 761/764 Panchayat conflict is documented. The office action is a correctly labelled Maps **search**, not fabricated directions.

A source-backed Chief Minister photo and the user-requested MP emblem are included. The emblem remains subject to institutional publication authorization. All pages remain prototype-labelled and noindex until authorized publication.

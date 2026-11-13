# Content and advertising administration

## Public editorial content

`data/content.ts` owns bilingual fields for blocks, schemes, notices, services, photos, routes, officer contact and programme categories. `data/evidence-register.json` contains provenance per important fact. `media-manifest.json` owns credits, source and usage-approval status. Geometry is separate in `public/dhar-boundary.geojson`; compact rendered path in `data/boundary.json`.

The CMS-ready model separates institution scope, district, block, scheme, officer, notice, media and service concepts. Gram Panchayats and individual projects are deliberately not invented. For a future CMS, add those record types with LGD codes, source, report period and approval metadata after approved datasets are obtained. Current editorial changes are code reviewed and version controlled; this is not a deployed general-purpose editorial CMS. No AI auto-publication job exists.

Editorial workflow: prepare bilingual change → check original evidence → add verification/report dates → institutional reviewer approves → build/check → source version/commit → private preview → official publication only after authorization. Keep prior source commits for revision history.

## Advertising bids

Form: `/hi/advertise` or `/en/advertise`. Popup links here. Four requested fields are required: name, phone, amount, reason; business name is also required for the eventual ad label. Proposed public message is the reason field, with explicit consent. Amount stored in integer paise. No payments, contracts or selection guarantees.

API: POST `/api/bids` persists a pending bid to Netlify Database (PostgreSQL) and returns a reference. Server enforces lengths, Indian mobile pattern, amount precision, consent, same-origin writes, honeypot and five submissions per day-specific submitter hash. User content is rendered as plain React text, never raw HTML. Public GET `/api/ads` exposes approved business names/messages only, no personal names/phones/amounts.

Review: `/admin/advertising`. Netlify Identity supplies the signed-in session; the server calls `@netlify/identity` `getUser()` and checks the `ADMIN_REVIEWER_EMAILS` allowlist or optional `ADMIN_USER_IDS` allowlist. No anonymous reviewer, local mock identity or self-registration is available. Client-supplied identity headers are never trusted. Sign-in is at `/login/?return_to=/admin/advertising/`; logout clears the Identity session.

Reviewers provide a reason, then qualify/approve or reject/withdraw. PostgreSQL saves the decision, actor, time and immutable review history in `bid_revisions` in the same statement that updates the bid. Only approved bids display; approved ads order by amount descending then submission time, limited to six. Highest amount is not automatic qualification. Withdrawal removes the ad from subsequent homepage loads. No periodic expiry or payment workflow is implied.

The schema lives in `db/schema.ts`; migrations are in `netlify/database/migrations/` and Netlify applies them automatically during deploys. Existing Cloudflare D1 rows are not copied by the schema migration; any hosted data transfer must be an explicit, reviewed export/import process.

Before official launch: obtain institutional advertising authorization; define prohibited categories, qualification criteria, bid windows, rates, placement duration, creative review, cancellation/refund rules, privacy controller, retention and deletion policy. Use test data in the private prototype. Approved test ads must be withdrawn after QA.

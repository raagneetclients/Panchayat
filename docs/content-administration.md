# Content and advertising administration

## Public editorial content

`data/content.ts` owns bilingual fields for blocks, schemes, notices, services, photos, routes, officer contact and programme categories. `data/evidence-register.json` contains provenance per important fact. `media-manifest.json` owns credits, source and usage-approval status. Geometry is separate in `public/dhar-boundary.geojson`; compact rendered path in `data/boundary.json`.

The CMS-ready model separates institution scope, district, block, scheme, officer, notice, media and service concepts. Gram Panchayats and individual projects are deliberately not invented. For a future CMS, add those record types with LGD codes, source, report period and approval metadata after approved datasets are obtained. Current editorial changes are code reviewed and version controlled; this is not a deployed general-purpose editorial CMS. No AI auto-publication job exists.

Editorial workflow: prepare bilingual change → check original evidence → add verification/report dates → institutional reviewer approves → build/check → source version/commit → private preview → official publication only after authorization. Keep prior source commits for revision history.

## Advertising bids

Form: `/hi/advertise` or `/en/advertise`. Popup links here. Four requested fields are required: name, phone, amount, reason; business name is also required for the eventual ad label. Proposed public message is the reason field, with explicit consent. Amount stored in integer paise. No payments, contracts or selection guarantees.

API: POST `/api/bids` persists a pending bid to D1 and returns a reference. Server enforces lengths, Indian mobile pattern, amount precision, consent, same-origin writes, honeypot and five submissions per day-specific submitter hash. User content is rendered as plain React text, never raw HTML. Public GET `/api/ads` exposes approved business names/messages only, no personal names/phones/amounts.

Review: `/admin/advertising`. Sites provides ChatGPT identity headers. Server checks the `ADMIN_REVIEWER_EMAILS` secret allowlist or `ADMIN_USER_IDS`; the initial Site owner's email was configured for reviewer access. No anonymous reviewer and no self-registration. Local dev uses the starter's loopback-only `local_seedy` mock login. It is disabled in production. Non-Sites hosts must strip untrusted identity headers and replace the auth adapter with trusted authentication.

Reviewers provide a reason, then qualify/approve or reject/withdraw. D1 saves decision, actor, time and immutable review history in `bid_revisions`. Only approved bids display; approved ads order by amount descending then submission time, limited to six. Highest amount is not automatic qualification. Withdrawal removes the ad from subsequent homepage loads. No periodic expiry or payment workflow is implied.

Before official launch: obtain institutional advertising authorization; define prohibited categories, qualification criteria, bid windows, rates, placement duration, creative review, cancellation/refund rules, privacy controller, retention and deletion policy. Use test data in the private prototype. Approved test ads must be withdrawn after QA.

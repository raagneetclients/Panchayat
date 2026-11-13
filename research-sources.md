# Dhar Zila Panchayat research — 6 November 2026

Development prototype. Institutional content approval is pending. This register records actual source checks, not a claim of government approval or independent audit.

## Connected tool inspection

Inspected the available tool catalogue before implementation. Available: web search/open/click, Sites, CUA browser automation, terminal and filesystem. Perplexity MCP, Firecrawl MCP, Context7 MCP, Playwright MCP, and Figma MCP were not connected. Used web tools for research, official framework documentation for implementation, and CUA for browser testing. No claim is made to have used unavailable integrations.

## Primary findings

- [District profile](https://dhar.nic.in/en/profile/): Indore division, 8,153 sq km, 13 development blocks, 1,625 revenue villages and 764 Gram Panchayats. Population 2,184,672 is explicitly the provisional Census 2011 figure, not a current estimate.
- [District election office](https://dhar.nic.in/en/district-election-office-2/): one Zila Panchayat, 13 Janpad Panchayats and 764 Gram Panchayats.
- [Block table](https://dhar.nic.in/en/subdivision-blocks/), page update 31 July 2023: all 13 block names and historical Panchayat/village counts. Panchayat rows sum to 764. Village rows total 1,556, differing from 1,625 revenue villages; definitions/report dates may differ. Do not sum these as a current revenue-village total.
- [Older About District](https://dhar.nic.in/en/about-district/), update 13 June 2019: 761 Gram Panchayats and eight tehsils. Conflicts with the profile and newer district homepage; not silently reconciled. Current LGD and local approval required.
- [Panchayat and Rural Development](https://dhar.nic.in/en/panchayat-and-rural-development/): state Act history, programme links, cumulative achievements. No clear reporting period for 108,917 houses, 377,254 toilets, 295,592 job cards, 95 Amrut Sarovar works or 693 Pushkar Dharohar works. Display only as attributed cumulative figures, never live or current-year totals.
- [District officers](https://dhar.nic.in/en/divisions/district-officers/), source updated 30 October 2026: Shri Akhilesh Kumar Jain, CEO Zila Panchayat; +91-7292-234709; ceozpdha@mp.gov.in. No postal address in this entry. Recheck office holders before launch.
- [Dhar GIS reference](https://dhar.nic.in/en/dhar-gis-2/): official reference to https://dhargis.mp.gov.in/. Link to reference page supplied; no API or detailed boundary licence inferred.
- [Official notices](https://dhar.nic.in/en/document-category/public-notice/): dated district administration records. Three short paraphrased index entries displayed with source links. The expired September travel application is explicitly closed. These are not represented as Zila Panchayat announcements. Validity of the October order is deferred to the original order.
- [RTI archive](https://dhar.nic.in/en/rti/) and [LGD](https://lgdirectory.gov.in/): official public-record and directory entry points. No invented PIO, fee, complete local-body dataset or village list.

## Scheme checks

- MGNREGA: official [Ministry FAQ](https://rural.gov.in/sites/default/files/MGNREGA_FAQ_ENGLISH.pdf), including job card and work demand guidance. The newer https://nrega.dord.gov.in/ returned 401 in the research tool.
- PMAY-G: programme link corroborated by the district department page. https://pmayg.dord.gov.in/ returned 401. No unverified financial amounts or eligibility list published; local selection and document verification required.
- [SBM-Grameen](https://swachhbharatmission.ddws.gov.in/), [Jal Jeevan Mission](https://jaljeevanmission.gov.in/) and [PMKSY](https://pmksy.gov.in/) loaded and support high-level programme descriptions. Local application details remain subject to departmental confirmation.
- https://nrlm.gov.in/ timed out in the research tool. Programme description is provisional and requires local approval; no programme eligibility, money or deadlines inferred from the failed request.
- [CM Helpline](https://cmhelpline.mp.gov.in/) loaded; official online grievance link used. No grievance form is simulated locally.

## Chief Minister addition

User requested a homepage Chief Minister photograph. [EPCO, MP](https://epco.mp.gov.in/) identifies Dr. Mohan Yadav as Chief Minister. Portrait: [Ministry of Defence / PIB via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dr._Mohan_Yadav_in_New_Delhi.jpg), 30 August 2024, GODL-India. Resized/WebP converted; credited. No endorsement of this prototype or advertising is claimed.

## Geography and media

Government NWIC district boundary catalogue was inspected, but its resource licence is only labelled “Other (Open)” without usable detailed terms. It was not redistributed. Instead, extracted the real Dhar polygon from Guneet Narula’s [MIT-licensed district boundary repository](https://github.com/guneetnarula/indian-district-boundaries). Feature code 438; source attributes Census 2011; repository district set 2019. Historical reference only, not current legal boundary. No synthetic polygons, inferred block borders, or substitute office pin. Licence included in docs/gis-LICENSE.txt.

Official district gallery and copyright policy were checked. The [policy](https://dhar.nic.in/en/website-policies/) requests prior permission for reproducing materials; these photographs were not copied. Used openly licensed Wikimedia district images instead. See media-manifest.json and public photo credits. Photograph content shows heritage/scenery, not Zila Panchayat activities or its office.

## Missing data / approval gates

Current president and approved representatives; exact office address, coordinates and hours; current full LGD dataset; current block boundaries; project-level sanctioned work records; department-approved local scheme application details; official identity assets; production advertising authorization, selection policy, pricing, placement duration, contracts, retention and data-controller contact. Prototype stays noindex and marked as unapproved.

## Technical references

Read https://nextjs.org/docs/app/guides/static-exports and GIGW guidance at https://guidelines.india.gov.in/. Added persistent advertising bids at the user’s request, so the architecture uses standard Next.js App Router, Netlify Functions and Netlify Database (PostgreSQL/Drizzle), rather than a static export. Reviewer access uses Netlify Identity allowlisting; no public officer or citizen login is fabricated.

## Structured registers

- data/evidence-register.json and public/evidence-register.json
- docs/conflict-unverified-register.json
- media-manifest.json
- docs/pre-publication-checklist.md
- docs/test-results.md

## State emblem addition

User explicitly requested the Madhya Pradesh logo in the header. Downloaded the original 300×300 transparent PNG from https://epco.mp.gov.in/assets/images/logo.png and visually inspected it. Used original colours/proportions. This official identity asset is not asserted to be openly licensed. Retained only as an identity reference in the private development prototype; institutional authorization before official publication remains required.

## Final live-link reconciliation

Direct HTTP checks found the older rural.gov.in MGNREGA FAQ PDF returned 404, pmayg.nic.in failed DNS, nrlm.gov.in had a hostname/certificate mismatch, PMGSY timed out and rti.mp.gov.in required unsafe legacy TLS renegotiation. No security checks were bypassed. Public links now use current verified HTTP 200 portals: https://nrega.dord.gov.in/ (redirects to current MGNREGA home), https://pmayg.dord.gov.in/ (redirects to current PMAY-G home), https://lokos.dord.gov.in/ (DAY-NRLM). NRLM self-help-group summary corroborated with https://www.dord.gov.in/static/uploads/2026/02/e0097b1401da568d7a8bc9a1a41b5813.pdf (Ministry of Rural Development / PIB, 3 February 2026). Roads use the Ministry entry point https://www.dord.gov.in/ while the PMGSY portal is unreachable; RTI links use the working district archive. Original failed checks are retained in docs/legacy-link-failures.json.

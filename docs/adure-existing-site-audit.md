# ADURE existing-site and v2.0 architecture audit

Date: 13 September 2026. Status: audit complete; main visual implementation has not begun.

## Authority and evidence

The [ADURE v2.0 reference](https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#home) is the content, architecture and functional-intent authority. The local concept is an implementation to assess, not the authoritative sitemap. The older `adure-wireframe` URL was excluded. Mira supplies visual rules only; see [the measured design system](mira-design-system.md).

Inspected local HTML, CSS, JavaScript, data modules, server and checks; inspected all 13 rendered v2 page views and their controls; read the public reference HTML and inline behavior. A public source snapshot is retained in [reference-evidence/adure-v2-source.html](reference-evidence/adure-v2-source.html). This source performs final text-node replacements and media replacements in JavaScript: preserve the final rendered copy, not just the first HTML strings. Desktop reference observations used 1280px; mobile home, expanded navigation and listing were checked at 390×844. Mobile home/listing document width was 375px with the browser's 15px scrollbar, with no document-wide horizontal overflow in those samples. Forms were inspected, not submitted.

## Local framework, dependencies and runtime

| Area | Finding |
| --- | --- |
| Framework | Static HTML, CSS and native ES-module JavaScript; no application framework or build dependency |
| Package | `adure-concept-design`, private, ES modules; `npm start` runs `node scripts/serve.mjs` |
| Server | Static GET/HEAD server serving `dist`; localhost; `PORT` override, fallback 4174; no submission API |
| Routing | Root HTML redirects to `dist/index.html`; local navigation uses in-page anchors, not the v2 page-view model |
| Styling | `dist/styles.css` plus `portfolio.css`; extensive successive overrides mixed with compressed rules |
| Fonts | Local Fira Sans 300/400/500 and Source Sans Pro 400/600 TTF; not Mira's Opulent/Suisse |
| Graphics | Vendored Three.js ES modules and license; optional orthographic portfolio visualization |
| Motion | Native IntersectionObserver, requestAnimationFrame and Web Animations; no GSAP or Framer dependency found |
| Icons | Inline SVG/text glyphs; no separate icon package found |
| Data/backend | Local JS records; no CMS, authenticated service, database or delivery endpoint found |
| Git | Current branch master has no commits; no remote configured at inspection |

The static stack is usable. Adding the required page views does not require introducing a new framework. The current local one-page concept cannot satisfy the reference merely through CSS changes.

## Modules and reuse boundaries

| File/module | Responsibility | Classification / disposition |
| --- | --- | --- |
| `dist/index.html` | Ten homepage chapters, navigation, dialogs | Global shell plus home-specific markup; retain useful semantics, restore v2 destinations/copy |
| `dist/content.js` | Proof, journey records, discovery collections and matching | Shared functional data; matching can be adapted to authoritative property records |
| `dist/app.js` | Discovery state, mobile navigation, enquiry, gallery, management accordion, transition stages | Mixed shared and home-specific behavior; separate reusable controllers as pages are restored |
| `dist/portfolio.js` | Interactive portfolio UI | Functional but concept-specific; not a substitute for the v2 portfolio page |
| `dist/portfolio-data.js` | Demo model/asset data | Nine demo models in three cities; approvedProperties is empty |
| `dist/portfolio-scene.js` | Three.js scene, camera, lifecycle | Optional visual layer; illustrative geography, not production map data |
| `dist/intro.js`, `hero-video.js` | Intro and hero presentation | Visual; assess against measured Mira rather than preserving bespoke effects by default |
| `scripts/prepare-assets.py` | Asset preparation | Supporting tooling |
| `scripts/check-content.mjs`, `check-portfolio.mjs` | Local integrity checks | Useful baseline; do not verify v2 parity |

Local functional details: discovery genuinely matches location, type, beds, budget and intent across three editorial demo collections. Enquiries prepare a reviewable email draft with mailto/copy fallback; they do not send through a backend. Gallery supports dialog navigation and keyboard controls. Management uses an accordion with coordinated imagery; the 30-day section has stage controls. Native dialog/focus handling and reduced-motion provisions are reusable. The philosophy sequence uses a 5-second interval with visibility/reduced-motion handling.

Local visual-only content includes five portfolio images and illustrative models with no verified coordinates or property-detail URLs. Current collection names (Waterfront living, City connections, Room to grow) and simulated budget bands must not replace the six reference listings. The local portfolio heading “Places in our care” also differs from the v2 homepage heading.

## Complete v2 route/page inventory

Routes are hash page identifiers in one document. All 13 were located in the DOM and individually activated/verified, using reload where necessary because the reference does not listen for hash changes.

| Route | Content hierarchy and required elements | Main relationships |
| --- | --- | --- |
| `#home` | Hero; philosophy; Buy/Sell/Lease/Manage; discovery; management; proof; portfolio; 30-day start; trust; closing; footer | About, properties, services, owner listing, portfolio, contact |
| `#properties` | Intro; intent/category controls; search/filter controls; result cards; Map/List control; more results; assistance CTA | Property detail and contact |
| `#property-detail` | Property identity/status/price; gallery; facts; description; amenities; floorplan/360/location media; advisor/actions; related property content | Contact/viewing journey and property listing |
| `#about` | Story; vision/mission/values; reasons to choose ADURE; milestones; principles; leadership; company-profile CTA | Services/contact |
| `#customers` | Six audience paths; sector tabs; capabilities/outcomes; proof; testimonials | Services/contact |
| `#services` | Overview and five tabs; management pillars/scopes; seller form; process; FAQs | Properties, list-property, contact |
| `#projects` | Project introduction; region/status/type/map controls; three project entries | Project detail |
| `#project-detail` | Qaryat Al Hidd; overview; masterplan/zone blocks; amenities/media; location; CTA | Properties/contact; hierarchy discussed below |
| `#contact` | Four offices; enquiry form; business hours; contact options | Enquiry type and preferred office |
| `#portfolio` | Proof; asset classes/filters; managed assets; Discover/Plan/Mobilise/Activate transition; reporting; owner CTA | List-property/contact |
| `#list-property` | Three owner objectives; owner/property form; Submit/Categorise/Assign/Consult next steps | Owner enquiry |
| `#media` | All/Corporate/Properties/Projects/People tabs and media entries | Supporting corporate content |
| `#careers` | Careers introduction; no-current-vacancies state; career enquiry CTA | Contact journey |

Navigation: logo → home; About ADURE; Services dropdown (overview, Buy, Sell, Leasing, Property Management); Properties; Portfolio; Our Customers; Contact; List Your Property. Footer includes the additional projects/media/careers destinations. EN/AR is displayed without a working language switch. Preserve this navigation coverage; do not import Mira's sitemap.

### Homepage content order to freeze

1. **Creating Value Beyond Property** — hero copy, Explore ADURE, Find a Property, connected-partner/location information.
2. **A Longer View.** — Market clarity, Everyday performance, Long-term protection.
3. **With You Across Every Stage.** — Buy, Sell, Lease, Manage; keep four distinct journeys and their CTAs.
4. **Find Your Next Property.** — discovery controls, initial property entries, listing CTA.
5. **Your Asset, Looked After As A Whole.** — three management pillars and management CTA.
6. **A Record That Speaks For Itself.** — established 2002, 3,000+ units, 200+ team, 98% occupancy, 1–2 weeks vacancy turnaround as reference claims.
7. **A Portfolio That Reflects Our Range.** — Marina View Residences, Al Ain Garden Community, Waterfront Portfolio.
8. **A Considered Start.** — 30-day Review, Inspect, Takeover, Manage sequence.
9. **Trusted Across Sectors.** — sector proof and identities.
10. **We're Here For What Comes Next.** — closing journeys and contact options, followed by full footer.

This is an inventory, not an endorsement or independent verification of business claims. Preserve supplied copy while keeping illustrative content clearly distinguished in implementation data.

## Property data and hierarchy

The public inline `properties` array contains six available records:

| Listing | Location | Price | Facts |
| --- | --- | --- | --- |
| Two-bedroom waterfront apartment | Hidd Al Saadiyat | AED 145,000/year | 2 beds, 3 baths, 1,420 sq ft |
| Modern one-bedroom residence | Al Khalidiyah, Abu Dhabi | AED 82,000/year | 1 bed, 2 baths, 860 sq ft |
| Commercial office | Airport Street, Abu Dhabi | AED 190,000/year | Office, 2,100 sq ft |
| Family three-bedroom | Al Mushrif, Abu Dhabi | AED 2,450,000 sale | 3 beds, 4 baths, 1,760 sq ft |
| Retail unit | Dubai | AED 310,000/year | Retail, 1,180 sq ft |
| Waterfront studio | Hidd Al Saadiyat | AED 68,000/year | Studio, 1 bath, 540 sq ft |

Home renders the first three. The card generator can hide price for nonavailable status, but all supplied records are available. Every card points to the same `#property-detail`, without passing an identity; the reference detail is a single example. A rebuild needs stable item state to avoid falsely showing one property's facts for another, while retaining the existing public route.

Projects contain Qaryat Al Hidd, Al Raha Gardens and Coastal Living Collection. Project → zone → building → unit hierarchy is described in the reference, but there are no separate zone/building routes or complete unit datasets. The project detail shows Waterfront, Garden and Community zone blocks. Preserve that hierarchy and supplied content; do not claim the prototype already has a functioning drill-down system or invent verified buildings/units.

## Forms and functional truth

| Surface | Fields/content | Actual behavior |
| --- | --- | --- |
| Contact | Required enquiry type (property, buyer, seller, leasing, management, project, general), first/last names, email, phone, message; preferred office | Prevents submission, shows success toast, resets form; no request or persistence |
| List Your Property | Objective, location, property type, approximate size, status, full name, phone, email, photos/docs, additional details; required markers retained | Same simulated success/reset; file input accepts JPEG/PNG/PDF but no actual upload |
| Service seller form | Location, Apartment/Villa/Commercial type, contact phone, JPEG/PNG photo control; advertised 2MB | Button is type=button with no handler; no upload/size validation found |
| Local enquiry dialog | Intent/contact details and property context assembled into an email draft | Working draft preparation, no automatic delivery |

Owner property types include Apartment, Villa, Commercial, Retail, Building or portfolio, Other; status options Vacant, Occupied, Under management, Under development. Preserve options, required state, labels and field order. The owner file input is not multiple. Progressive categorisation/routing is described, not implemented. No backend credentials or delivery destination was inferred.

Contact inconsistency to retain as an open content issue: topbar uses Inquiries@adu-re.com / 026457869 / 0566805125; office blocks use leasing@adu-re.com / +971 2 666 4433. Do not silently select one as universally correct. Office hours shown are Monday–Thursday 8–4 and Friday 8–12.

## Interaction audit and technical limitations

| Behavior | Evidence / status | Rebuild implication |
| --- | --- | --- |
| Page navigation | `showPage` toggles active view, updates active nav, closes menu and scrolls top; initial hash is read | Retain identifiers and relationships |
| Browser route changes | No hashchange/popstate listener; hash-only navigation left previous page active until reload; uses replaceState | Fix history/deep-link synchronization as a technical correction, not an IA change |
| Services dropdown | Opens/closes; outside click/Escape close it | Preserve keyboard/ARIA behavior; avoid unconditional Escape focus jump |
| Mobile menu | Opens and exposes full primary nav; aria-expanded changes | Retain access to every route; button accessible label remains “Open menu” even when expanded |
| Tabs | Handler changes active class only | Do not describe visual state as functional filtering |
| Listing filters / load more / favourites / share | Several visible controls have no matching behavior in source | Implement deliberate behavior or visibly truthful states; preserve controls |
| Map/List | Toggle tested; shows/hides panel and changes label | Panel is placeholder media, not geospatial search |
| Viewing / advisor | Viewing routes to generic contact; no selected-property transfer; some advisor buttons unwired | Preserve journey while attaching available property context |
| Gallery / floorplan / 360 | Reference contains media placeholders | Need genuine media or clearly labelled unavailable state, never fake working tours |
| Form confirmation | Simulated toast says success with no delivery | A visual refresh must not present this as sent data |
| Contact utilities | Real tel/wa.me links exist alongside placeholder actions | Preserve meaningful destinations, never substitute Mira's contacts |
| Downloads | Company profile/media actions include placeholders | Do not fabricate downloadable documents |
| SEO | Single document/title with hash views | Per-view title/focus updates possible; full server SEO is separate work |
| Accessibility | Some labels lack for/id association; placeholder-only controls and ambiguous action labels | Keep visual grammar but correct associations, keyboard/focus, announcements |

The reference includes illustrative partner names NORTHSTAR, URBANEX, CIVITAS, MERIDIAN, HORIZON, LANDMARK, CREST and NEXUS. These must not be relabelled as independently verified client logos.

Local responsive rules include 600, 700, 760 (portfolio), 800, 991/992, 1000, 1100 and 1180px. Reference rules include 600, 700, 900, 1000 and 1100px, with later 1100px navigation collapse overriding earlier 900px logic. Preserve responsive content hierarchy; consolidate visual breakpoints with Mira's measured 768/1024/1600 system only where all content and controls remain accessible.

## Implementation strategy after findings review

1. Establish an explicit 13-route content/CTA manifest from the final rendered v2 reference. Keep existing hash names and homepage sequence. Add property identity state without replacing the public route model.
2. Retain the static ES-module stack and useful native interaction code. Separate page renderers, shared navigation/footer, form controls, property data, and route state. Remove successive style conflicts by introducing a scoped token/component layer rather than another blanket override.
3. Implement the measured Opulent/Suisse visual system with explicit font availability recorded. Centralize colors, scale, containers, buttons, form fields, dividers, imagery and motion. Do not silently substitute current Fira/Source fonts and call the result exact.
4. Map home/editorial sections to varied Mira compositions; keep Buy/Sell/Lease/Manage and 30-day sequence intact. Use wide listing rows for property results, image-led cards where suitable, and calm editorial layouts for services/about/contact. See the mapping in the Mira document.
5. Restore route coverage before polishing optional visual effects. Preserve all controls and fix prototype defects deliberately. Keep unavailable property media/data explicit. Use a genuine configured delivery mechanism before reporting an enquiry as sent.
6. Validate route/deep-link/back behavior, property context, filter results/reset/empty state, upload limits, form outcomes, mobile navigation, keyboard/focus and reduced motion. Compare representative desktop/tablet/mobile layouts against measured Mira rules.

## Validation and current delivery boundary

Both existing local checks passed: `node scripts/check-content.mjs` and `node scripts/check-portfolio.mjs`. They validate the current ten-chapter concept and demo data boundaries, not the complete v2 website or backend behavior. No application code, server configuration or active project process was changed for this audit. The two audit documents are the requested review point before the main rebuild.

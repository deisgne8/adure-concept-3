# Phase 2 — Homepage implementation and QA

13 September 2026. Review URL: http://127.0.0.1:4180/

## Scope delivered

Global visual tokens, reusable CSS primitives, desktop/mobile header, footer, and all ten homepage content sections. No internal page was implemented. The approved ADURE v2 source snapshot supplies the homepage copy; the approved Mira audit supplies visual values. The old local layout and intro/Three.js effects are not loaded by this homepage.

## Files changed or created

| File | Purpose |
| --- | --- |
| `dist/index.html` | Generated complete homepage and global navigation/footer |
| `dist/design-tokens.css` | Fonts, scale, type hierarchy, palette, borders, spacing, containers, radii, controls, motion, breakpoint ranges and stacking |
| `dist/primitives.css` | Shared typography, buttons/links, controls, containers, navigation, dialogs, footer, focus and accessibility utilities |
| `dist/home.css` | Homepage compositions and responsive variants |
| `dist/home-data.js` | Six reference property records and multi-field matching; local stable keys separated from advertised references |
| `dist/home.js` | Search, reset/empty state, mobile dialogs, menu disclosure, save/share and portfolio keyboard scrolling |
| `dist/assets/fonts/Opulent-Regular.woff2` | Audited Mira display face |
| `dist/assets/fonts/SuisseIntl-Book.woff2` | Audited Mira body/interface face |
| `dist/assets/adure-social-preview.png` | Generated social preview; illustrative artwork, not an inventory photograph |
| `scripts/build-home.mjs` | Deterministic v2 home extraction and semantic/control transformations |
| `scripts/check-home.mjs` | Copy/order, route-destination, asset and property-matching checks |
| `scripts/serve.mjs` | Default preview port4180; WOFF2 MIME support |
| `package.json` | Build command and current homepage test command |

Older modules/assets remain available for future phases but are not imported into this page. The reference snapshot is a build input, not fetched at runtime. To rebuild: `node scripts/build-home.mjs`. To check: `node scripts/check-home.mjs` and `node scripts/check-portfolio.mjs`. To serve: `node scripts/serve.mjs`. Package scripts provide the same commands. The user's PATH contains a broken npm shim; the installed `C:/Program Files/nodejs/npm.cmd` successfully ran build/test.

## Reusable design system

The existing static ES-module architecture is retained; primitives are CSS classes and semantic native elements, not an unnecessary framework/component library.

- Container/Section/SectionHeader: `.container`, `.section-shell`, `.section`, shared heading layouts.
- Eyebrow/DisplayHeading/BodyCopy: central font and line-height tokens applied to semantic headings and copy.
- Button/TextLink/ArrowLink/IconButton: `.btn` themes, `.text-link`, `.btn.link`, `.icon-button`.
- ImageFrame/EditorialImage: cover images, controlled radii and300ms scale1.03 states.
- FilterControl/Input/Select: labelled native controls with fine line borders and consistent sizing.
- SiteHeader/DesktopNavigation/MobileNavigation: fixed white header, Services disclosure, native full-screen dialog.
- SiteFooter: complete ADURE link groups and contact copy on the audited dark surface.

Opulent/Suisse are loaded locally with font-display:swap. Font provenance is the exact public paths recorded in the audit; font redistribution/licensing was not independently established. The actual ADURE logo remains blue: its brand identity was not recolored to mimic Mira's logo.

## Homepage sections completed

| Order | Section | Composition |
| --- | --- | --- |
| 1 | Hero | Architectural cover image, left editorial type, measured diagonal desktop overlay, two CTAs and contextual facts |
| 2 | Our Philosophy | Asymmetric manifesto with three numbered, ruled principles |
| 3 | End-to-End Real Estate | Four alternating image/text rows, preserving Buy/Sell/Lease/Manage and each CTA |
| 4 | Property Discovery | Horizontal desktop filters, full-screen mobile filters, image-led property entries |
| 5 | Property Management | Large editorial facade image and three numbered capability rows |
| 6 | Metrics / Proof | Five unboxed numbers and restrained separators |
| 7 | Portfolio | Three large development-style images, titles and metadata; partial-next tablet rail |
| 8 | 30-Day Transition | Ruled Week1/Week2/Week3/Week4+ vertical progression |
| 9 | Trust / Clients | Two supplied audience categories with quiet separators |
| 10 | Start a Conversation | Dark closing section with every supplied action, continuing into the footer |
| 11 | Footer | Company, Properties, Services, Explore, contact information and legal/language labels |

All reference homepage headings, paragraphs and captions are compared in exact order by the automated check. The underlying title case wording remains unchanged; uppercase is CSS presentation. The existing legal and EN/AR labels are retained as text, not falsely implemented as working legal/language pages.

## Interactions and functional boundaries

- Buy/Lease, location, property type, bedrooms and price combine to filter the six supplied properties locally. Search reports the count; an unmatched combination exposes an empty state and clear action.
- Initial/cleared cards retain the reference's three featured properties, explicitly labelled “Featured properties”; selecting an intent or searching applies the filter.
- Mobile uses one native modal and moves the same form into it. There are no duplicate controls/state. Escape/close restores the form and trigger focus.
- Desktop Services disclosure supports click, outside-click dismissal and Escape with focus return. Native mobile dialog contains all main destinations and Services children.
- Favourites toggle and persist locally; storage failure does not break the page. Share copies the property's title/location/price and reference detail URL, with visible fallback text when clipboard writing is unavailable.
- Tablet portfolio rail supports native horizontal scrolling and ArrowLeft/ArrowRight/Home/End; reduced-motion disables smooth scrolling.
- Image/button transitions use audited300ms/250ms values and respect reduced-motion. No autoplay, intro gate, scroll-jacking, parallax or cursor effect was introduced.

**Internal-page links:** all supplied destinations are retained through the exact approved v2 reference URL and hash until their local pages are built. This is deliberate Phase2 wiring, not a claim that 13 local routes exist. Every property still opens the reference's single example detail view; item-specific detail routing remains a later-phase limitation. No form submission/backend was added in this homepage-only scope.

**Search behavior difference:** the prototype's Search button only navigated to an unfiltered listing. It now returns actual homepage matches while View All Properties retains the listing destination. The reference site cannot consume these filter parameters, so search state is not transferred to it. This is a functional improvement confined to the homepage; internal listing behavior remains pending.

## Measured responsive verification

| CSS viewport | Base B | H1 | Header height | Document width | Result |
| --- | --- | --- | --- | --- | --- |
| 390 | 16px | 40px | 64px | 375px | PASS; stacked content, full-width actions, modal filters,18/22px property titles |
| 768 | 16px | 40px | 64px | 753px | PASS; compact header, two-column editorial layouts, keyboard/scrollable portfolio rail |
| 1024 | 10.24px | 35.84px | 46.08px | 1009px | PASS; desktop layout at Mira's scale reset |
| 1440 | 14.4px | 50.4px | 64.8px | 1425px | PASS; wide editorial rows and three property/development columns |
| 1728 | 16px | 56px | 72px | 1713px | PASS; capped1520px container |

The15px difference is the browser scrollbar. At768, overflow is intentionally confined to the portfolio rail (689px visible width after the scrollbar fix), not the document. No offscreen heading/copy was detected outside that intentional rail. Screenshot rendering was checked through the native browser capture after viewport changes; occasional immediate raw captures showed stale compositor scaling, so DOM geometry and settled captures were used instead.

Full-page screenshots were captured inline at1440 and390 to inspect every section. Additional settled viewport screenshots checked the final desktop hero, mobile hero/search/filter dialog and tablet portfolio. Screenshots are in the task's tool outputs; no filesystem screenshot artifact was exported by the browser tool.

## Visual QA matrix

PASS means checked against the approved ADURE content source and measured Mira family, not a pixel-identical copy of Mira's different content. Function PASS below is limited to each homepage control and its documented external destination.

| Section | ADURE content | Order | Home function | Mira type | Spacing | Composition | Image treatment | UI controls | Responsive |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Philosophy | PASS | PASS | PASS | PASS | PASS | PASS | PASS¹ | PASS¹ | PASS |
| End-to-End | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Discovery | PASS | PASS | PASS² | PASS | PASS | PASS | PASS | PASS | PASS |
| Management | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Proof | PASS | PASS | PASS | PASS | PASS | PASS | PASS¹ | PASS¹ | PASS |
| Portfolio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Transition | PASS | PASS | PASS | PASS | PASS | PASS | PASS¹ | PASS | PASS |
| Trust | PASS | PASS | PASS | PASS | PASS | PASS | PASS¹ | PASS | PASS |
| Conversation | PASS | PASS | PASS | PASS | PASS | PASS | PASS¹ | PASS | PASS |
| Header/footer | PASS | PASS | PASS² | PASS | PASS | PASS | PASS | PASS | PASS |

¹ No image/interactive control is needed for that content. PASS denotes the deliberate absence of decorative filler.
² External reference destinations and single-example property detail limitations are recorded above; production end-to-end internal journeys are not claimed as tested or complete.

Browser checks passed for: desktop Services open/Escape; mobile menu open/Escape/focus return; four labelled mobile filter fields; zero-results search; clear; Lease showing five records; Studio+under100K showing only Waterfront studio residence; Buy showing the single sale record; favourite pressed state; share copied feedback. No browser error/warning logs were returned in the inspected run. Lazy images inspected after loading had no broken source. Reduced-motion behavior was source-reviewed; OS preference emulation was not exercised.

## Documented differences and remaining issues

1. **Content shapes differ.** ADURE has a general corporate hero rather than rotating off-plan promotions; no Mira prices, developments or enquiry claims were imported. A40rem small-screen minimum is derived from two20rem media units to fit ADURE's fixed copy; desktop retains Mira's52.75rem minimum. This is a content-fit adaptation, not a measured Mira mobile hero value.
2. **Native controls.** Selects and dialogs use browser semantics instead of Mira's custom Vue implementations. The palette/type/spacing/state treatment follows the audit; option menus can differ by OS.
3. **Brand/contact preservation.** ADURE's logo and all contact information remain. The duplicated topbar contact/location copy is consolidated into the footer/hero/menu to preserve Mira's single-row header. EN/AR remains a nonfunctional label, as in the reference.
4. **Closing composition.** The dark textual conclusion uses Mira footer rules rather than repeating the source sunset photograph. All closing copy and CTAs remain.
5. **Source media.** Existing ADURE architectural WebPs are retained; the hero now uses architecture-horizon rather than a cloud video poster. Several originals are900px wide and can look softer on large displays. Higher-resolution approved source photography would improve sharpness without changing layout.
6. **Internal journeys.** External reference pages, their generic detail view and simulated forms remain outside this phase. No production submission guarantee is made.
7. **Publication.** The connected hosted Site is the older complete ADURE wireframe. This homepage-only review has not overwritten it or its internal pages. Review locally on4180. A future deployment must set SITE_ORIGIN to its verified origin before building so social image URLs resolve publicly.
8. **QA limits.** No formal screen-reader audit, automated contrast scan over photographs, live backend test, or OS reduced-motion emulation was performed. Keyboard/dialog and layout checks were performed as described.

Phase2 stops here. Property listing/detail, About, Services, Projects and all remaining local internal pages await homepage review.

## Requested hero animation update
Added hero-opening.css and hero-opening.js, wired by build-home.mjs. Retained adure-banner.mp4 now plays as a muted looping hero background. Intro: Beyond Property. / Creating Value.; 650ms text entrance, 1250ms initial text beat, 800ms video insertion, 800ms hold, 1700ms expansion, 650ms hero arrival. Desktop inline and mobile stacked compositions. Skip/Escape, 8-second watchdog, deep-link bypass, reduced-motion poster, manual pause/play and offscreen/background pause. Port4173 served the same current static page at inspection; sequence adapted from retained original intro.js rather than claimed as a live animation capture. Desktop/mobile intro hold and completion inspected, pause and skip tested, no console errors, homepage copy/order checks passed. No other sections changed.

## Approved brand font update
Primary/display and intro typography now use local Fira Sans Regular. Secondary/body, navigation and controls use local Source Sans Pro Regular. Preloads updated to the local TTF files. This explicit user-requested substitution supersedes the earlier Opulent/Suisse implementation; sizes, spacing and animation are retained.

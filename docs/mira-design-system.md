# Mira International — measured visual design system

Inspection date: 13 September 2026. Phase 1 only; no website implementation changes.

Visual reference: [Mira International](https://mira-international.com/).
Content, structure, routes and functionality reference for the subsequent ADURE rebuild: [ADURE wireframe v2.0](https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#home). The older `adure-wireframe` URL and the current local concept are not the authoritative wireframe.

## Evidence and measurement method

Inspected live pages using browser screenshots, rendered DOM, `getComputedStyle`, bounding rectangles, and the loaded CSSOM. Homepage measurements include the desktop hero, development cards, enquiry block and FAQ; tablet card rail; mobile hero, stacked cards, navigation and consultation modal. The earlier homepage inspection is retained as evidence, with shared typography/container rules rechecked during this expanded audit. This audit also examined listing, property detail, service, about, location, editorial and contact pages. Inner-page coverage and additional measurements appear below. No forms were submitted.

Viewport samples: 1280×720, 1440×900, 768×1024 and 390×844. This browser reserves a 15px vertical scrollbar when page scrolling is enabled, so the corresponding content widths are 1265, 1425, 753 and 375px. Menu/modal scroll locking can change that available width. Coordinates and dimensions below are CSS pixels, not screenshot estimates.

Evidence labels:

- **Measured**: computed style or rendered geometry from the live page.
- **CSS**: a rule read directly from a loaded stylesheet, including inactive responsive and hover rules. CSS availability does not prove a component/state is used everywhere.
- **Observed**: visible behavior or composition during inspection.
- **Unverified**: could not establish a reliable value; do not turn it into an implementation fact.

Source keys used below (the hashed URLs identify the inspected version):

| Key | Live stylesheet |
| --- | --- |
| E | [Entry, typography and shared controls](https://mira-international.com/_nuxt/entry.css-D9nyUgMC.css) |
| N | [Navigation and footer](https://mira-international.com/_nuxt/default.css-10Vnuz4v.css) |
| H | [Hero banner](https://mira-international.com/_nuxt/BannerMain.css-CbXG7aa8.css) |
| D | [Development cards](https://mira-international.com/_nuxt/Development.css-XGh4JrE_.css) |
| DS | [Development section](https://mira-international.com/_nuxt/DevelopmentsSlider.css-CVDvpRNl.css) |
| P | [Image-overlay property cards](https://mira-international.com/_nuxt/PropertiesSlider.css-BsNFvz3O.css) |
| G | [Property results grid](https://mira-international.com/_nuxt/HotDeals.css-LmC06tUY.css) |
| F | [Enquiry block](https://mira-international.com/_nuxt/Feedback.css-CPW_Poi2.css) |
| I | [Text inputs](https://mira-international.com/_nuxt/Input.css-CKmyqK2z.css) |
| T | [Tabs](https://mira-international.com/_nuxt/Tabs.css-CpP58iI5.css) |
| Q | [FAQ](https://mira-international.com/_nuxt/Faq.css-8j1-vyqF.css) |
| S | [Search controls](https://mira-international.com/_nuxt/SearchFiltered.css-GxKH0cLM.css) |
| M | [Consultation modal](https://mira-international.com/_nuxt/ModalsCallback.css-Cc8ZgSOV.css) |

## 1. Typography

**CSS + measured, E:** display typography is `Opulent, sans-serif`; body and interface typography is `Suisse, sans-serif`. The inspected font declarations are Opulent Regular (400), Suisse Intl Book (400), Light (300), Medium (500), and corresponding Suisse italic faces. They use WOFF2 with `font-display: swap`. The stylesheet's additional weight utility classes do not establish that additional font files are loaded.

Headings use regular-weight uppercase Opulent with distinctive shaped capitals. Body text is compact Suisse. The visual character depends on the actual letterforms, not just an uppercase generic font. Source font paths are `/fonts/opulent/Opulent-Regular.woff2` and `/fonts/suisse/SuisseIntl-{Book,Light,Medium}.woff2`; this records the reference, not a decision to redistribute those files.

**Critical scale rule, CSS E:** layout inherits its base size from `.resize`, rather than a universal 16px base. Let `B` be that base in CSS pixels:

| Viewport width W | B |
| --- | --- |
| W < 768px | 16px |
| 768px ≤ W < 1024px | `0.0208333 × max(768px, 100vw)` (approximately W/48) |
| 1024px ≤ W < 1600px | `0.01 × max(768px, 100vw)` (W/100) |
| W ≥ 1600px | 16px |

Thus B is 12.8px at 1280, 14.4px at 1440, and 16px at both 768 and 390. The breakpoint discontinuity is present in the reference. Preserve source `em` relationships when recording tokens. Nested font-size overrides can alter an element's local `em`; do not multiply every rule blindly by B.

## 2. Color palette

**CSS, E/N/I/D/S/T:**

| Role | Exact value | Application |
| --- | --- | --- |
| Primary accent | `#933637` | Primary CTAs, selected pill-tab shutter, slider progress |
| Accent interaction | `#70292A` | Primary/secondary/tertiary/outline button hover |
| Main ink | `#302E2D` | Headings, text, dark buttons |
| Secondary text | `#606269` | Descriptions, metadata, input placeholders |
| White | `#FFFFFF` | Page and card surfaces, inverse text |
| Footer dark | `#161616` | Footer and additional header theme |
| Fine solid border | `#E7E6E3` | Buttons, card facts, form panel, area cards |
| Input background | `#F8F8F8` | Filter ranges and dropdown triggers |
| Subtle dark border | `rgba(34,34,34,0.2)` | Inputs, FAQ dividers, mobile menu |
| Inverse secondary text | `rgba(255,255,255,0.7)` | Dark-surface text and hero subtitle |
| Inverse fine border | White at 0.1 or 0.2 alpha | Footer separators / dark inputs |
| Error | `#FE5639` | Input error message and border |
| Disabled | `#999999` | Disabled button text |
| WhatsApp ink | `#249F62` | Contact icon and dedicated button |
| WhatsApp surface | `#E9F7F0` | Dedicated contact-button resting background |

**Observed:** broad white surfaces, warm charcoal typography and selective burgundy actions. Blue, gold, green and sunset tones are primarily supplied by property imagery, not a gold-and-black interface palette.

## 3. Grid system

**CSS + measured, G/Q/DS:** no single universal twelve-column grid was established. The homepage combines component-specific grids and horizontal sliders.

- Results grid `.blocks-hot-deals__content`: four equal columns on desktop; two below 1024px; one below 768px. Column gap `1.5em`, row gap `3.5em`. At 1440, columns are approximately 325.8px with 21.6px horizontal gaps.
- Top developments: three visible cards at 1440. Measured card width 440px within a 1368px container, giving 24px gaps. This slider gap differs from the em-scaled grid gap.
- At 768, the first development card is 451.33px wide within 689px usable content, with a partial next card visible.
- At 390, top developments switch to three stacked visible cards, each 343px wide. Do not describe every mobile list as a carousel.
- FAQ: desktop `repeat(2,1fr)`; tablet `1fr 2fr`; mobile one column. Gap `3.5em 1.5em`.
- Property-type cards use wrapping flex bases of 20%, 40%, 100% across the desktop/tablet/mobile ranges, with `1.5em` gaps.

## 4. Container widths

**CSS E:** `.container` has `width:100%`, `max-width:95em`, automatic horizontal margins, and default overflow hidden. Below 1024px it receives `2em` side padding; below 768px, `1em`. Several slider containers explicitly override overflow to show adjacent cards.

| Viewport | Measured outer container | Horizontal padding | Usable width / start |
| --- | --- | --- | --- |
| 1440×900 | 1368px | 0 | 1368px; x=28.5px |
| 768×1024 | 753px | 32px per side | 689px; x=32px |
| 390×844 | 375px | 16px per side | 343px; x=16px |

At the capped 16px scale, the CSS maximum is 1520px. `.container-article` has `max-width:46.75em` (748px at B=16), with the same responsive padding rules. Hero text `.parts-banner__content` also uses `46.75em` on desktop, removed below 1024px; measured desktop width 673.19px at 1440.

## 5. Section spacing

**CSS + measured, live inline variables/E:** standard `.section-wrapper` uses `--pt:4em; --pb:4em`, switching below 1024px to `--pt-mobile:2em; --pb-mobile:2em`.

| Sample | Top and bottom padding, each | Combined boundary between two standard sections |
| --- | --- | --- |
| 1280 | 51.2px | 102.4px |
| 1440 | 57.6px | 115.2px |
| 768 | 32px | 64px |
| 390 | 32px | 64px |

The hero wrapper has zero section padding. The company/about section has `2.25em` bottom padding in its small-layout variables (36px at B=16). These are component settings, not universal exceptions to be spread throughout the page.

Section-heading-to-content spacing commonly uses `3.5em` (50.4px at 1440); some slider headers reduce it to `2em` below 1024px. Card content and footer offsets commonly use `1.5em`; internal group gaps use `0.5em`, `0.75em`, `1em`, `1.5em` and `2em`. Footer top wrapper padding is `9em 0 4.625em`, tablet `4.5em 0 3.375em`, mobile `3.5em 0` (N).

## 6. Heading hierarchy

**CSS E; measured H1, H2 and card-title:** the following are visual classes, not instructions to change ADURE heading semantics. Sizes and line heights in the table are converted at B=16; actual desktop values scale by B/16.

| Role / class | Desktop size / line | Below 1024 size / line |
| --- | --- | --- |
| Display `.d1-r-o` | 72 / 79px | 40 / 40px |
| H1 `.h1-r-o` | 56 / 67px | 40 / 44px |
| H2 `.h2-r-o` | 44 / 51px | 28 / 32px |
| H3 `.h3-r-o` | 30 / 34px | 26 / 30px |
| H4 `.h4-r-o` | 24 / 28px | 24 / 29px |
| H5 `.h5-r-o` | 22 / 26px | 20 / 24px |
| H6 `.h6-r-o` | 20 / 24px | 18 / 22px |
| `.card-title` | 24 / 28px | Remains 24 / 28px until below 768, then 18 / 22px |

All listed `-r-o` classes request weight 400. Display tracking is `0.04em` desktop, `0.02em` small. Standard heading rules do not add equivalent wide tracking.

Measured at 1440: H1 50.4/60.3px; section H2 39.6/45.9px; card title 21.6/25.2px. At 768: H1 40/44px; H2 28/32px; card title 24/28px. At 390: H1 40/44px; H2 28/32px; card title 18/22px.

## 7. Body typography

**CSS E/D/H:** use Suisse Book for ordinary prose and interface copy, with light weight in selected mobile descriptions. Values below assume B=16.

| Class / role | Desktop size / line | Small-layout size / line |
| --- | --- | --- |
| `.s1-r-s` larger body | 18 / 28px | 16 / 22px below 1024 |
| `.s2-r-s` standard body | 16 / 25px | 15 / 23px below 1024 |
| `.s3-r-s` small body | 14 / 22px | 14 / 22px |
| `.i1-r-s` interface | 15 / 20px | 15 / 20px |
| `.i2-r-s` small interface | 13 / 20px | 13 / 20px |
| Card metadata label | 15 / 20px | 13 / 20px below 768 |
| Card categories | 16 / 25px, 400 | 14 / 22px, 300 below 768 |
| Hero description | 18 / 28px, 400 | 16 / 22px, 300 below 768 |

Standard body utilities specify `-0.005em` tracking on desktop. Interface utilities use zero tracking. Read the actual text child: wrappers often compute to `line-height:1` even when their text children have the above typesetting.

## 8. Button system

**CSS E:** `.ui-button` is flex, centered, uppercase, 1px border, `width:fit-content`, with a 250ms ease-in-out transition. Base label `.ui-button__font` is Suisse 400, `0.8125em` with line-height `1.53846` (13/20px at B=16). Icons are `1.25em` squares with `0.625em` separation.

| Size | Minimum height | Padding | Radius |
| --- | --- | --- | --- |
| xxs | 2.75em (44px); small-layout override 2.25em (36px) | .6875em .9375em; small override .4375em | .25em |
| xs | 2.75em (44px) | .6875em .9375em | .25em |
| sm | 3.25em (52px) | .9375em 1.9375em | .25em |

Small button label is 15/20px at B=16 on desktop, with a 13/20px responsive override. The measured mobile header consultation button is 156.23×36px. Component font overrides mean the header button should be measured separately from generic button tokens.

Themes: primary burgundy/white; secondary white/ink with pale border; tertiary ink/white; outline transparent/ink with pale border. These four converge to `#70292A` with white text on hover. WhatsApp has a separate pale-green/green treatment. Directional icons are small chevrons, not large decorative arrow circles. Circular controls are reserved for slider/close utilities.

## 9. Navigation

**CSS + measured + observed, N:** fixed full-width header, white at rest, without a measured drop shadow. Desktop height `4.5em` (64.8px at 1440); below 1024 height `4em` (64px at 768 and mobile). Desktop logo height `2.5em`, small logo `1.5em`.

Desktop composition: logo left, horizontal navigation next, currency/area units and burgundy consultation CTA right. Menu gap `1.25em`; logo-side group gap `3.4375em`; action gap `1.5em`. Visible desktop nav links are capitalized Suisse, measured 13.5/18px at 1440. A parent uppercase declaration does not override the child capitalization rule.

Below 1024 the desktop menu disappears and a 24×48px burger appears at B=16. Its three strokes are 2px high; closed outer strokes translate by ±.5em. Open state rotates outer strokes ±45° and hides the middle stroke over 250ms.

Open mobile menu was inspected: white viewport-height panel, uppercase Opulent 24/29px links, fine horizontal dividers, bottom callback CTA and currency selector. Panel CSS uses `100dvh`, hidden `translate3d(-100%,0,1px)`, and 250ms transform/visibility or opacity/visibility state transitions. This is a full menu panel, not a small dropdown. Main-page header currency control is absent from the inspected mobile header and available in the open menu.

## 10. Cards

**CSS + measured, D/P:** distinguish two principal families.

**Development information card:** image above text, no enclosing raised panel. Image wrapper `height:20em`, radius `.5em`, overflow hidden, badge inset `.625em`. At 1440 image is 440×288px; on mobile 343×320px. Its aspect ratio changes with width, so a universal 16:9 token would be inaccurate. The compact variant uses `15em` image height.

Text structure: uppercase title, category, developer/location, bordered fact strip, two actions. Content offset and footer offset each `1.5em`; content group gap `1.5em`; header gap `1em`. Fact strip: 1px `#E7E6E3`, `.25em` radius, `.75em 1.25em` padding, `.75em` gaps and 1px vertical dividers. Footer actions have `.5em` gaps. Standard mobile card buttons can each take a full row; compact cards override that minimum.

**Image-overlay property card:** `.cards-property__wrapper` minimum height `26.25em`, `.5em` radius and `1.25em` padding. White text at the bottom, badges at the top, transparent-to-black-30% gradient starting halfway down. Information overlay uses white at 10% alpha, 15px backdrop blur, fixed 4px radius and `.75em 1.25em` padding. Preserve which family is appropriate to each existing ADURE component.

## 11. Image treatment

**Observed + CSS H/D/P/F:** large architectural renderings, waterfront views and property photography supply most of the visual mass. Images use full-frame cover crops; logos use contain. White space and metadata remain outside standard development images, whereas feature cards place white type over the image.

Hero images are absolutely positioned to fill their slide with `object-fit:cover`. Desktop overlay is exactly `linear-gradient(110deg, rgba(0,0,0,.5), rgba(0,0,0,.2) 50%, transparent 50.1%)` over a black-20% layer. Below 1024 it becomes `linear-gradient(0deg, rgba(0,0,0,.1), rgba(0,0,0,.3))`.

The hero price/payment panel uses black at 20% alpha with `.9375em` backdrop blur, `.5em` radius and `.75em .75em .75em 1.25em` padding. Mobile stacks its CTA below the facts.

Enquiry portrait rule: desktop absolute bottom-right, `44.25em × 33.125em`, contain. Below 1024 it becomes a relative image above the content, `18.625em` high; mobile switches to cover. Some lower-page imagery appeared temporarily blank while lazy loading after viewport changes. Those blank captures are not evidence for intentional empty imagery.

## 12. Forms

**CSS + observed, I/F/M:** text inputs use transparent surfaces and a bottom rule, not rounded filled boxes. Input wrapper has `1em 0` padding and a 1px `rgba(34,34,34,.2)` bottom border. Placeholder and floating label are `#606269`; entered text is `#302E2D`.

Focus/filled state reveals the floating label and translates the field down `.625em`; border, label opacity and field transform transition over 250ms ease-in-out. The extra underline pseudo-element has `.125em` thickness. Focusing the empty name field was observed to add `ui-input--focus`; no personal details were entered. CSS error state changes border/message to `#FE5639`; server error and success states were not triggered.

Enquiry panel: 1px pale border, `.5em` radius, padding `3.5em` desktop / `2em` tablet / `1em` mobile. Form maximum width `43.375em`; rows have `1.5em` gaps and stack below 1024 with `1em` gaps. Measured desktop panel 1368px wide, padding 50.4px; mobile panel 343px wide with 16px padding and 309px inner form width. Mobile input wrapper measured 55px high. Consent and callback action are part of the visible form.

Consultation modal: black-50% backdrop, content max-width `60em`, `.5em` clipped radius, side-by-side image/form on desktop. Below 1024: `max-width:calc(100% - 2em)`, `1em` side margins, image above form at `15.625em` high, scroll area max-height `85svh`, form padding `2em`. On 390px mobile it shows the city image, name/email/phone fields, consent, and submit action within a vertically scrollable panel. Close control moves from 2em inset to 1.25em below 768.

Search filters are a separate control family: `#F8F8F8` triggers, `.375em` radius, `.5em .75em` padding; dropdown panels are white, `.5em` radius, 1em padding. Desktop hero exposes location/type/price/bedrooms with fine vertical dividers and a dark results CTA. Mobile replaces the strip with a “Find real estate” button. The filter modal's detailed internal states remain unverified.

## 13. Borders

**CSS D/I/Q/N:** standard hard separators are 1px, independent of the em layout scale. Use `#E7E6E3` for card facts, outlines and form panel; dark 20%-alpha for FAQ, mobile navigation and input underlines. Inverse footer rules use white at 10% alpha, inverse input rules white at 20% alpha. Desktop nav underline is a distinct 0.5px pseudo-element, centered and initially zero width.

FAQ rows use `2em 0` padding and a bottom border, except the final row. Expanded body receives `1em` top padding and a maximum width of 90%. It is an editorial ruled list rather than a collection of boxed cards.

## 14. Shadows

**Measured:** inspected header, development card, image wrapper, enquiry panel, standard button and input wrapper all compute to `box-shadow:none`.

**CSS S/T:** filter dropdown uses `0 .25em 2em rgba(0,0,0,.1)` (0 4px 32px at B=16). Plain tabs use an inset 1px dark-20% shadow as an outline. This does not support adding soft elevation to every card. Hero and image-card depth comes from gradients and backdrop blur.

## 15. Radius

**CSS:**

| Token | Reference use | B=16 equivalent |
| --- | --- | --- |
| 0 | Text input fields, outer development card | 0px |
| .25em | Buttons, facts strip, portrait nameplate | 4px |
| .375em | Filter triggers, plain tabs, footer review panels | 6px |
| .5em | Property images, enquiry panel, modal | 8px |
| .625em | Mobile area-list outer corners | 10px |
| 6.25em | Shutter-tab group | 100px |
| 50% | Floating contact pulse / circular utilities | Circle |

At 1440 the standard image radius measures 7.2px. Some overlay details specify fixed 4px and 15px blur rather than em values; retain that distinction.

## 16. Hover states

**CSS E/N/D/P/T, not pointer-simulated:** development, property and category card images scale to 1.03 over 300ms. The same image effect applies on `:focus-within`. Frame size stays fixed and overflow clips the enlarged image.

Primary/secondary/tertiary/outline buttons converge to dark burgundy with white text and transparent border on hover. Focus/active rules additionally use a white border where declared. WhatsApp button changes to green with white content. Footer links increase from white-70% to white. Desktop menu underline expands from its center to 100% width over 300ms ease-in-out.

Many control hover rules are guarded by `(hover:hover)`; do not create a hover-dependent route to content on touch screens. Card image rules themselves also explicitly support keyboard focus-within.

## 17. Transitions

**CSS:**

| Element | Property / duration / easing |
| --- | --- |
| Shared buttons | 250ms ease-in-out |
| Card image | transform 300ms; implicit CSS ease |
| Menu underline | 300ms ease-in-out |
| Header background/text | 250ms; implicit ease |
| Burger | transform 250ms |
| Input label/field | opacity/transform 250ms ease-in-out |
| Currency chevron | rotate 250ms |
| Tab shutter | translate 250ms ease-out; width declared as a separate transition entry |
| Generic fade | opacity 250ms |
| Modal vendor fade | 300ms ease |
| Floating WhatsApp pulse | 2s ease, infinite |

The tab source shorthand leaves `width` without its own duration; do not report it as a measured 250ms width animation. Hero slide content was observed changing with opacity/translate inline styles; exact autoplay interval and transition duration were not established. Do not use a captured idle `0ms` as the hero animation speed.

## 18. Scroll animations

**Observed:** page scroll keeps the header fixed, reveals normally flowing sections, and retains the floating contact control. The hero rotates slides independently of scrolling. Horizontal sliders have progress rules and explicit navigation controls. These are distinct from scroll-triggered section entrances.

**Measured:** all inspected `.section-wrapper` elements computed to opacity 1, transform none and animation-name none in the sampled state. No reliable evidence established a universal reveal, parallax, pinned storytelling sequence, stagger delay or scroll-linked timeline.

**CSS:** the page includes marquee `scrollX` / `scrollY` keyframes translating to -100%, and slider overflow/scroll-snap support. Presence of those rules does not prove scroll-triggered section motion. Marquee duration is not established here.

**Unverified:** trigger thresholds, animation library/configuration, hero autoplay timing, FAQ expansion duration, reduced-motion behavior, and whether isolated inner pages contain additional scroll effects. Do not invent values for these. Keep any future ADURE motion specification separate from measured Mira evidence until directly validated.

## 19. Desktop layout

**Measured + observed at 1440×900:** 64.8px fixed white header; hero starts below it, spans the 1425px content viewport, and measures 835.19px high. Hero CSS minimum is `max(100svh - 4.5em, 52.75em)`. The copy is left-aligned with the shared container; a project logo can sit upper-right; price/payment and CTA occupy a translucent strip; a white search bar sits near the bottom.

The next section uses a left heading and right outline CTA above three large development cards. Other catalogue grids use four columns, while feature cards carry text within imagery. Enquiry panel pairs content on the left with a portrait area on the right. FAQ uses balanced title/list columns. Footer switches to `#161616` with multi-column links and horizontal rules.

This is the reference's visual grammar, not ADURE's replacement page sequence. Do not import Mira's section order or additional content modules.

## 20. Tablet layout

**Measured + observed at 768×1024; CSS range 768–1023.98px:** B=16 at the measured width; 32px gutters leave 689px usable width after scrollbar. Header is 64px with compact logo, consultation action and burger. H1 is 40/44px and H2 28/32px.

Top development rail shows one full 451.33px card plus part of the next. Four-column results become two columns; FAQ becomes a 1:2 split. Enquiry inputs stack, panel padding becomes 32px, and portrait moves above content. Footer navigation changes to two-column flex allocation; footer top content becomes vertical. Some section headings center and actions move beneath them; use each section's rule rather than applying one alignment globally.

At other tablet widths B scales with W/48, so 768 measurements must not be presented as fixed throughout the range.

## 21. Mobile layout

**Measured + observed at 390×844; CSS below 767.98px:** B=16, 16px gutters, 343px usable page content with the normal scrollbar. Header remains 64px. H1 40/44px, section H2 28/32px and card title 18/22px.

Hero uses a tall cover crop, project logo above the subtitle/title, stacked facts/CTA panel, and compact search entry. The minimum hero rule can exceed the visible screen; do not force every hero element into one viewport. Top developments render three vertical cards with 343×320px images, followed by the section CTA. Other feature sections retain horizontal slider behavior. Standard grids become one column.

Enquiry panel uses 16px padding; form rows and relevant actions span the available width. FAQ title precedes the list in one column. Footer navigation stacks vertically. Open menu has 24/29px uppercase Opulent links, dividers and bottom utilities. Consultation modal retains 16px side margins, top image and internal vertical scrolling.

## Application constraints for the next phase

1. This phase adds documentation only. Retain the usable static application stack in the implementation phase; do not introduce a replacement framework without a technical reason.
2. Preserve ADURE **v2.0** section order, content, hierarchy, navigation destinations, routes, CTAs, forms, property behavior and responsive functionality. The completed 13-view inventory and prototype limitations are recorded in [adure-existing-site-audit.md](adure-existing-site-audit.md).
3. Map typography, surface colors, borders, spacing, image crops and component states to the corresponding ADURE elements. Do not transplant Mira's listings, contact details, section sequence or route model.
4. Preserve function even where Mira changes presentation: a compact mobile search entry must still expose all ADURE filters; a new card skin must preserve its existing facts and destinations.
5. Use the exact recorded font families as the reference target. Any font substitution is a separately documented deviation, not an exact reproduction.
6. Keep unknown motion values explicitly unverified. Do not add speculative luxury effects, universal card shadows, oversized radii or arbitrary gold accents.

## Inspection limits

This audit covers the homepage and representative inner-page families listed below, not every Mira route or every browser/device. Hover values are stylesheet-verified rather than pointer-state screenshots. Some lazy-loaded images were not fully resolved in individual captures; gray unloaded areas are not design tokens. No form submission, backend validation or success screen was exercised. Actual breakpoints were read from CSS; only the listed viewport samples were inspected. Browser screenshots sometimes crop the emulated surface differently from the CSS viewport; numeric dimensions here come from DOM geometry, not screenshot edge estimates.

## 22. Expanded page-family evidence

All following desktop pages were opened and inspected using rendered headings, geometry, CSSOM and screenshots during the expanded audit. These are source exemplars, not pages to copy into ADURE.

| Family | Live source | Responsive coverage |
| --- | --- | --- |
| Homepage | [Mira](https://mira-international.com/) | 1440×900 shared measurements rechecked; earlier mobile/tablet evidence above |
| Listing | [Properties](https://mira-international.com/properties) | 1280px desktop and 390×844 mobile; mobile filter panel opened |
| Property detail | [Palm Jebel Ali Frond F](https://mira-international.com/properties/palm-jebel-ali-frond-f) | 1280px desktop and 390×844 mobile |
| Service | [Consulting services](https://mira-international.com/services/consulting-services) | 1280px desktop, 768×1024 tablet, 390×844 mobile |
| About | [About](https://mira-international.com/about) | 1280px desktop; responsive CSS inspected |
| Location | [Palm Jebel Ali](https://mira-international.com/locations/dubai/palm-jebel-ali) | 1280px desktop; responsive CSS inspected |
| Editorial | [Market review article](https://mira-international.com/publications/dubai-residential-market-review-july-2026) | 1280px desktop; responsive CSS inspected |
| Contact | [Contacts](https://mira-international.com/contacts) | 1280px desktop and 390×844 mobile measurements |

Fresh shared measurements: at 1280px, B=12.8px, container=1216px, H1=44.8/53.6px, H2=35.2/40.8px, H4=19.2/22.4px, narrow column=598.39px. At 1440px, H1=50.4/60.3px, H2=39.6/45.9px, narrow column=673.19px. At 390px, H1=40/44px, H2=28/32px, H4=24/29px, normal content width=343px. At 768px service page, container=753px including 32px left/right padding, leaving 689px; H1=40/44px, H2=28/32px. These follow the `.resize` scaling model, not a single linear desktop-to-mobile interpolation.

### Listing rows: imagery, information, commercial action

**Observed:** desktop results are broad horizontal rows: image at left, descriptive metadata centrally, separate price and action column at right. This differs from homepage development tiles and is essential when mapping ADURE's listing page. Mobile stacks those groups while keeping property identity and facts ahead of price/actions.

**CSS:** [Project row](https://mira-international.com/_nuxt/Project.css-BYsnfWAH.css), [Results section](https://mira-international.com/_nuxt/Projects.css-BD5Ow4eg.css).

| Rule | Desktop | Responsive |
| --- | --- | --- |
| Outer row | 1px #e7e6e3 border; .5em radius; flex; gap .5em 3.5em; padding .5em 2em .5em .5em | Below1024 wraps and padding .5em; mobile gap1.5em |
| Image region | flex 1 1 35.625em; min-height20em; radius.25em; padding1.25em | Mobile min-height15em |
| Content region | flex 1 1 53.375em; gap1.5em 2em | Below1024 column gap.5em; mobile wraps |
| Information/action columns | bases29.375em and20em; block padding2em | Mobile full width, no block padding |
| Fact strip | 1px dark20% border; radius.25em; gap.75em 1.5em; padding.75em 1.25em; cells min-height3.25em | Wraps to two columns below1024 |
| Actions | Vertical gap.5em; buttons width100%; price margin1em .25em | Mobile actions margin-top1.25em |
| Results rhythm | Row gap1.5em; section container gap3.5em | Preserve content-driven height |
| Image state | Hover/focus-within scale1.03; transform300ms | Do not require hover to reveal essential facts |

Convert em using the actual B. For example, 20em is256px at1280, while mobile15em is240px. Do not copy a desktop screenshot's pixel values directly to every width.

### Mobile search state

**Observed at390×844:** “Find real estate” opens a full-screen white filter interface titled “All Filters”. It has a circular close action, divider, internally scrolling filter content, outlined option chips, and bottom Clear Filters plus a dark results-count action. Visible groups included Type, Bedrooms and Handover; the scroll region continues beyond them. This is an expanded state of the existing search journey, not a separate landing page. No search submission was performed. Preserve every ADURE filter when adopting this presentation; Mira's off-plan fields do not replace ADURE fields.

### Property detail banner and gallery

**Observed:** full-image hero with project identity, description and price/action strip. Desktop supports an upper-right logo and left copy; below1024 the content centers. At390px the measured40/44px title, description, price, View Property and Reserve Now stack, with full-width buttons. ADURE should retain its own enquiry/viewing CTA labels and property facts.

**CSS:** [Detail banner](https://mira-international.com/_nuxt/BannerProject.css-IYR9eQ7Q.css): inner vertical gap4.5em, changing to3.5em below1024; copy max-width46.75em and gap1.25em; logo10.75×7.125em desktop, static below1024,6.8125×4.5em mobile. The action panel uses black20%, blur.9375em, radius.5em, gap1.5em and padding .75em .75em .75em 1.25em.

**CSS:** [Project gallery](https://mira-international.com/_nuxt/ProjectGallery.css-Duj9BmRg.css): gap3.5em; slide radius.5em, overflowhidden, cursorpointer; cover image height32.5em desktop,25em below1024, `max(15em,55.814vw)` mobile. [Gallery controls](https://mira-international.com/_nuxt/SliderGallery.css-DA8xkguH.css) position navigation vertically centered with1em gap; bottom pagination uses.25em gap and2em padding. Inner detail gallery opening/closing and timing were not exercised in this audit; vendor Photoswipe CSS presence does not establish those interactions were tested.

### Service and company editorial layouts

Service pages combine a photographic banner, concise benefit content, numbered process, enquiry, corporate proof and FAQ. The service benefit rail is not the same component as its numbered process.

**CSS:** [Ordered process](https://mira-international.com/_nuxt/InfoCardsOrdered.css-ynsaJZus.css): cards1px pale border, radius.5em, gap3.5em, padding1.9375em; mobile gap2em/padding1.4375em. Number circles have1px burgundy border and4.5em square dimensions, becoming3.5em mobile. Auto-column grid gap1.5em becomes one column below1024. Section padding4.5em becomes2.25em on mobile. This measured use of cards is specific to that component, not a reason to box every ADURE section.

**CSS:** [About steps](https://mira-international.com/_nuxt/AboutSteps.css-BguTINdr.css): outer gap3.5em, card gap1em, inner gap1em 1.5em; image min-height32.5em desktop,21.875em tablet,15em mobile, radius.5em. Content uses1px border/radius.5em and padding3.5em 2em 2em, becoming2em 1em mobile. Navigation width29.375em is a desktop rule, not a mobile fixed width.

### Location and long-form content

**CSS:** [Text groups](https://mira-international.com/_nuxt/TextGroups.css-BPWwKNGD.css): container gap6em→3.5em tablet; title max46.75em; item gap4.5em→2em tablet; inline layout `1fr 46.75em`→one column tablet. Paragraph1em/1.5625, weight400; mobile.9375em/1.53333.

**CSS:** [Text columns](https://mira-international.com/_nuxt/TextColumns.css-DZZ-cApj.css): container gap6em→3.5em mobile; centered header max46.75em/gap1.25em; auto-column content gap4.5em/padding0 2em→one column below1024 with gap3.5em/no padding.

**Measured:** article narrow column598.39px at1280. Main title visual utility `.h2-l-o` is35.2/40.8px with computed weight300; section heading24/27.2px. This is an explicit inner-page exception to the usual regular display heading. Do not infer a separately loaded Opulent300 face from computed weight alone.

**CSS:** [Article layout](https://mira-international.com/_nuxt/_slug_.css-D1dPvNdE.css): contents padding2.25em→1.5em mobile, list gap1em/padding-left1.25em, marker.8125em/1.53846; information text.875em/1.57143. Share popover is a limited shadow exception: `0 .25em 2em` black10%, width16.8125em/padding.25em. [Article content](https://mira-international.com/_nuxt/ArticleContentText.css-CrKgIhn_.css) uses scroll-margin4.5em→4em tablet, heading margin-bottom1em and CTA margin-top1.5em.

### Contact page

**Observed:** typography-led office information in asymmetric columns, separate from image-led service banners. Mobile contact title and office headings are28/32px and columns collapse to343px available content width.

**CSS:** [Offices](https://mira-international.com/_nuxt/Offices.css-TAGkXHQQ.css): grid38.6875em 46.75em/gap1.4375em desktop, `.85fr 1.15fr` tablet, one column mobile. Container and office list gaps4.5em; header max46.75em/gap2em; information gap1.3125em and item gap1em. Apply to ADURE's four offices and contact details without importing Mira's two-office content.

## 23. Token implementation proposal (derived, not Mira source names)

Use these names in a future centralized token layer. Values are traced to the measured rules above; naming is proposed for ADURE. No CSS implementation was written in this phase.

```css
--font-display: 'Opulent', sans-serif;
--font-body: 'Suisse', sans-serif;
--color-bg-primary: #fff;
--color-bg-secondary: #f8f8f8;
--color-bg-dark: #161616;
--color-text-primary: #302e2d;
--color-text-secondary: #606269;
--color-border: #e7e6e3;
--color-accent: #933637;
--color-accent-hover: #70292a;
--color-error: #fe5639;
--radius-control: .25em;
--radius-panel: .5em;
--container-wide: 95em;
--container-reading: 46.75em;
--motion-control: 250ms ease-in-out;
--motion-image: 300ms ease;
```

Typography tokens should use the documented desktop/mobile utility values and inherit B; expose display/H1/H2/H3/H4/body-large/body/body-small/label/caption separately. `clamp()` can express bounded values within an interval, but a single clamp does not reproduce Mira's discontinuous1024px scale reset. Preserve explicit media-query ranges if exact reference scaling is the target. Keep ADURE's mobile reading order even if matching a Mira presentation requires a different grid arrangement.

## 24. Applying the system to ADURE without changing its architecture

This is a design implementation proposal based on the evidence, not a claim that Mira contains matching ADURE content.

| ADURE section/page | Visual-system application | Content/function invariant |
| --- | --- | --- |
| Home hero | Opulent display, restrained cover gradient, measured container and button system | Exact hero copy and both CTAs |
| Philosophy | Editorial text groups, narrow copy width and generous separation | Three named principles, order and supporting copy |
| Buy/Sell/Lease/Manage | Image-led composition with consistent display hierarchy and fine dividers | Four distinct destinations; no merged journey |
| Home discovery | Measured search controls and property imagery/cards | All filters, initial entries and listing CTA |
| Management | Editorial split with clearly indexed content; shared accordion states where applicable | Three pillars and management CTA |
| Proof | Opulent numbers with Suisse labels and open whitespace | All five metrics and their qualifiers |
| Portfolio teaser | Development image treatment with restrained metadata | Three reference examples and portfolio destination |
| 30-day transition | Ordered typography/ruled sequence using measured spacing | Review→Inspect→Takeover→Manage; no reordered steps |
| Trust | Quiet identity/sector grouping with pale dividers | Supplied sector copy; placeholder proof remains identifiable |
| Closing and footer | Measured CTA controls and dark footer hierarchy | Complete ADURE actions, navigation and contacts |
| Property results | Wide desktop image/info/action rows; stacked mobile groups | Property facts, filters, status, map/list and pagination intent |
| Property/project details | Image-led banner, reading columns, gallery dimensions, fact strips | Existing details, amenities, media roles, advisor and enquiry journeys |
| Services/about/customers | Editorial text groups and selective image/process layouts | All route content and audience/service relationships |
| Contact/owner form | Office grid, line-style fields, shared labels/errors/actions | Four offices; all fields/options/required state and real outcome semantics |
| Media/careers | Narrow editorial hierarchy and consistent tabs/empty states | Existing categories and no-vacancy message |

Measured visual choices do not authorize dropping data, copying Mira contacts, adding Mira property claims, or pretending an ADURE prototype button is functional. Functional corrections and missing data are catalogued in the companion audit. The main implementation starts only after these findings have been shown, as requested in the brief.

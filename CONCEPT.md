# ADURE homepage concept — A wider perspective

Creative thesis: property value emerges when the whole journey is seen together. Move from architectural detail to human purpose, useful choices and accountable care. The ten chapters follow the V2 guide.

## Direction established before implementation

Opening: a close, full-bleed crop of the supplied curved waterfront architecture, an oversized two-line Fira Sans philosophy and a restrained navigation. The headline sits above the photograph with a controlled dark scrim; the structure never masks letters. The crop widens with the first short scroll, resolving into a white editorial explanation.

Silhouette: immersive photograph → spare typographic statement → blue architectural index with an offset image → white search and unequal image scale → dark management spread → oversized blue proof numerals on white → broad, staggered portfolio → a light transition ledger → quiet sector typography → closing photograph and four explicit actions. Straight edges and a shared alignment grid connect the changing compositions.

Type: Fira Sans 300–500 for display, Source Sans Pro 400/600 for reading. No unrelated serif. Body 18px, routine labels at least 14px; mobile headings have explicit controlled wraps. Blue #004789 anchors the design; cyan #00B7F1 is limited to selected states, lines and dark-background detail. White and black plus blue tints supply the remaining tones.

Images: supplied company-profile photographs; natural light and uncropped source files retained in the source attachments. Responsive WebP derivatives are identified by source page/image. Descriptive titles are editorial captions, not verified property names or current listings.

## Reference to design mapping

All four design references, the wireframe and existing website were accessed in a browser on 10 September 2026. Desktop and mobile screenshots and scroll states were inspected. Reference screenshots are outside the public site.

| Reference | Observation and translation | Avoid for ADURE |
| --- | --- | --- |
| [LAGOM](https://lagom-development.com/) | Oversized identity sits against a strongly cropped roofline. Dusk, warm interiors and a calm sans hierarchy establish atmosphere. The opening resolves to a lower headline, then asymmetric small and large photographs on a light field. Mobile preserves a portrait architectural crop. Translate its confidence in image/type scale and the image-to-editorial transition. | Its orange accents, house-development proposition, giant brand word and long architectural opening are specific to LAGOM. Do not reproduce its sequence. |
| [RIO Property](https://www.rioproperty.co.za/) | The window-framed city view gives a literal perspective; a stepped, enormous typographic lockup fills the lower screen. Scroll removes the window and separates the words before revealing the city. The full-screen menu was opened and inspected. Mobile swaps in a tighter city composition. Translate asymmetric type alignment and the connection from place to purpose. | The long pinned travel, moving words, purple/yellow menu and brokerage voice would overpower ADURE's broader offer. |
| [250 Broadway](https://www.250broadway.com/) | Building / View / Location are treated as a large index over immersive imagery, while compact floor utility remains accessible. Large architectural images alternate with deliberately plain information. Mobile stacks the index and uses portrait imagery. Translate a purposeful, image-changing index and practical controls within editorial composition. | A single-building leasing story, NYC identity, maps and floor inventory are not ADURE's homepage. Avoid its sparse mobile navigation and excessively long gaps. |
| [FIND](https://findrealestate.com/) | A centered, heavy sans headline floats in sky above a building, with a clear action. Scrolling changes image scale and reveals an outline identity; on mobile the headline and CTA stack above a smaller architectural crop. Translate clarity of the next step and deliberate space above architecture. | Do not copy the sky scene, central composition, house asset, outline logo or agent/portal emphasis. |

The existing [wireframe](https://deisgne8.github.io/adure-wireframe/dist/index.html#home) establishes the four intent routes and the ten-section sequence. Its equal cards, generic stock imagery and synthetic success messages are not carried into the concept. The [existing website](https://adu-re.com/) gives additional operating context and shows the old identity; the supplied new identity governs this work.

## Signature interactions

1. Opening perspective: native scroll moves the photo from a close crop to a wider view over the opening's actual height. Text remains readable throughout. It ends as the editorial explanation enters. Mobile uses a smaller scale range; reduced motion uses a static close crop. Links are immediately usable by keyboard.
2. Four directions: clicking or tapping Buy / Sell / Rent / Manage updates the photograph, a short outcome statement and the destination. All labels remain visible. Arrow keys, Home/End and Tab support the index; activation is explicit. Mobile has a 2×2 index above one full-width image. Reduced motion swaps content immediately.
3. The first 30 days: direct stage selection updates the week, task, owner benefit, evidence and next stage. No scroll lock. Mobile keeps all four stage choices in a readable 2×2 control and the evidence beneath. Arrow keys move focus; Enter/Space selects. Reduced motion removes the stage transition.

Management uses a smaller, calmer editorial disclosure; portfolio supports native horizontal touch scrolling and explicit previous/next controls. These are utilities, not additional showpiece animations.

## Source decisions and approvals

| Item | Source / status | Public treatment |
| --- | --- | --- |
| Founding year | Company profile p2 / V2: 2002. Brand p5 / existing site: 2008. Unresolved. | Omitted, including derived years-of-experience claims. |
| Units / team | Profile p2 and questionnaire: 3,000+ units; 200+ professionals. Consistent supplied figures. | Shown as profile figures. Reconfirm current totals before launch. |
| Occupancy / vacancy | Profile p2 / V2: 98%; 1–2 weeks. No reporting period or methodology supplied. | Withheld; retained as editable internal claims. |
| Cities | Profile p2, questionnaire, brand p5: Abu Dhabi, Dubai, Al Ain. | Shown. |
| Fonts | Font PDF p1 explicitly names Fira Sans and Source Sans Pro. Its descriptive history appears mismatched. Brand PDF supplied ends at colour hierarchy; typography pages listed in its contents are absent. | Use the explicitly named fonts. Arabic version is outside this English homepage concept. |
| Philosophy | Profile and questionnaire: Beyond Property … Creating Value. Brand has an older home-commitment line. V2 governs positioning. | Beyond Property. Creating Value. |
| Client logos | Profile pp5–6 supplies identifiable logos, but no separate website-use approval is provided. | Withheld until approved. Trust chapter uses the verified sector breadth. |
| Property identities | Portfolio p11 has images without names/captions. | Descriptive visual captions only; no invented asset names or locations. |
| Search inventory | Live sale/rental inventory and availability are not supplied. | Clearly labelled demonstration collections with simulated filter metadata; no live prices or availability. |
| Contact | Profile p33: Inquiries@adu-re.com, 02 6457869, 0566805125. Existing site: leasing@adu-re.com, 02 666 4433. | Enquiry drafts use the profile general email. Phone and WhatsApp withheld pending routing confirmation. No message is sent by the website. |

## Prototype boundaries

One homepage, no new inner pages, CMS, CRM or inventory connection. Enquiries prepare a draft in the visitor's email application and can be copied; no submission or delivery is claimed. Search filters demonstration collections. Approval notes remain outside the customer-facing build. The prior wireframe is recoverable from the repository history.

## Verification

Verified in Chromium on 10 September 2026:

- Full-page desktop silhouette, every desktop chapter and mobile section compositions inspected as screenshots. Final desktop and mobile openings reviewed after responsive refinements.
- 1440, 1024, 768, 390 and 375px viewports: no accidental horizontal overflow; all primary headlines within three lines at default text size. Intentional native image rails stay inside their own scroll containers.
- 34 browser interaction assertions passed: all four journeys and their routes; keyboard focus/activation; Buy/Rent budgets; all four combined filters; matching, empty and reset states; all management pillars; all transition stages and next-stage control; portfolio previous/next, gallery keyboard navigation and Escape; enquiry draft generation and editing; mobile menu, Escape, anchors and restored page interaction.
- Reduced motion: hero transform `none`, no opening crossfade, zero active animations; journey switching and stage navigation remain functional.
- Additional keyboard checks: skip link, required-field validation, focus containment in both dialogs and focus return after Escape passed.
- Reading text at 200%: desktop, tablet and small-mobile reflow checked. The opening grows with content; compact grids become single columns as needed. No viewport overflow or clipped content. Very large display words/numerals have viewport-based caps, while reading text retains the enlarged setting.
- Local JavaScript syntax and repeatable content/asset checks passed. All visible imagery loaded after scrolling; no JavaScript page errors during final responsive checks.

Testing is browser emulation, not a physical-device, cross-browser or formal WCAG certification. Safari, Firefox, real iOS/Android, a screen-reader audit and production performance testing remain launch QA. No real enquiry was sent, and no CMS, CRM, live inventory, analytics or third-party delivery was tested. The existing published site has not been replaced.

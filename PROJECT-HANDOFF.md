# Current ADURE project handoff

Prepared 14 September 2026 for continued work on another computer/account.

## Project

Static HTML/CSS/JavaScript real-estate homepage. Node's local server serves `dist` on port 4180. No frontend dependency installation is required. The original archive was ADURE-Concept-Design-Windows-rio-3.zip; considerable homepage work has happened since that baseline. Older files remain for context, so follow the imports in the current index.html.

## Latest accepted changes

- Hero: main heading, description and actions vertically centered with flex auto margins; footer facts row sits at the bottom with padding. Keep these two alignments independent.
- Philosophy / A Longer View: introductory sentence directly beneath heading; boxed stage eyebrow labels and vertical progress indicator hidden; two-column stage layout and section spacing corrected. Existing scrolling image/stage changes remain.
- Proof: white background, centered five-image collage, consistent image proportions, balanced gaps and responsive mobile grid. The middle image expands into the metric carousel on scroll. Shared sizing variables align the image and its expansion.
- 30-day transition: replaced the plain list with a carousel based on RCU's “RCU at a Glance”, https://www.rcu.gov.sa/en. Image track translates and text crossfades over 500 ms ease; content panel reveals from the right over 1000 ms ease-in-out. Includes wraparound, adjacent-card clicks, keyboard navigation, swipe, mobile stacking and reduced-motion support. ADURE stages/copy/images are retained. See docs/rcu-transition-reference.md.
- Property Management (most recent redesign): larger heading and introductory copy above a broad architectural photo; caption over image; three open service columns below; CTA after the columns; stacked mobile layout. Implemented in dist/management.css, imported by home.css.

## Reference and content context

Mira International is an earlier visual reference, documented in docs/mira-design-system.md. The RCU carousel reference applies specifically to the transition section. Do not replace one with the other.

ADURE content/route reference: https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final. Many navigation and CTA links currently point there, not to implemented local internal pages. Keep this limitation explicit when extending the site. No backend submissions or live inventory integration have been added in this work.

The user prefers direct implementation, concise progress reports, clean spacing and restrained layouts. Preserve existing text and ADURE's blue identity unless asked to change them. Prior reference documents are context, not fresh user instructions or authorization to publish.

## Validation and cautions

Current homepage checks: node scripts/check-home.mjs. Portfolio data checks: node scripts/check-portfolio.mjs. Recent visual checks covered desktop/mobile layouts; RCU carousel navigation, swipe and wrap were exercised in the browser. Historical QA images may predate the current design.

The original machine had a broken npm launcher; running Node scripts directly worked. This is not a project dependency issue.

README.md and older handoff documents contain older port numbers and file descriptions; START-HERE.md documents the current entry points. Avoid blindly regenerating index.html or replacing the present project with the original ZIP. The exported dist folder is the current working site.

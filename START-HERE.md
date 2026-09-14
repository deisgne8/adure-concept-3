# ADURE — portable project

Export prepared 14 September 2026. This folder contains the current website, all local images/video/fonts, editable source, scripts, reference notes and previous QA records.

## Run on another computer

1. Extract the ZIP completely.
2. Install Node.js 22 or newer if it is not already installed.
3. Open a terminal in the extracted `ADURE` folder (the folder containing `package.json`).
4. Run `node scripts/serve.mjs`.
5. Open http://127.0.0.1:4180/ in a browser. Keep the terminal running while working.

These commands work on Windows, macOS and Linux. No npm packages need installing. `npm start` is an alternative. Do not open the HTML directly using a file URL; the site uses JavaScript modules.

## Continue with another GPT account

Upload this ZIP in your new conversation, or open the extracted folder as a project in Codex. Paste:

> This is my existing ADURE website. Read START-HERE.md and PROJECT-HANDOFF.md, inspect the current files, and continue working from this version. Start the local preview using node scripts/serve.mjs. Preserve the current design and content unless I request changes.

The website does not require the original GPT account. The previous conversation, account connections and saved browser preferences do not transfer with project files; PROJECT-HANDOFF.md summarizes the relevant work.

## Files and checks

- Current page: `dist/index.html`
- Main styles and behavior: `dist/home.css`, `dist/home.js`, `dist/home-data.js`
- Shared styles: `dist/design-tokens.css`, `dist/primitives.css`
- Opening animation: `dist/hero-opening.css`, `dist/hero-opening.js`
- Transition carousel: `dist/transition-carousel.css`, `dist/transition-carousel.js`
- Latest Property Management redesign: `dist/management.css`
- Assets: `dist/assets/` and `dist/vendor/`
- Notes, references and QA: `docs/`, `qa/`, and root Markdown files

Run `node scripts/check-home.mjs` and `node scripts/check-portfolio.mjs` for the current checks. `scripts/check-content.mjs` belongs to the older homepage and should not be used as the current page's acceptance check.

No build is needed to run or edit the website. `npm run build` regenerates `dist/index.html` from an older reference snapshot and the builder's transformations. Review that script before rebuilding: direct HTML changes can be overwritten. Treat the included `dist` files as the latest working version.

This portable package excludes `.git` history, `.openai` account-linked hosting configuration, and the export folder itself. All website and supporting project files are included. Hosting on a new account should be configured separately when requested.

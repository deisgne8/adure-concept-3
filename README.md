# ADURE — A wider perspective

A complete, ten-chapter editorial homepage concept using the supplied brand identity, approved font names and company-profile imagery. Built on the existing static stack with native CSS and JavaScript; no framework, animation library or build step.

## View locally

From this project folder, run `node scripts/serve.mjs`, then visit <http://127.0.0.1:4174/>. Requires Node.js; no dependencies need installing. You can also use `npm start` if npm is working on your machine. Run `node scripts/check-content.mjs` and `node scripts/check-portfolio.mjs` for the included checks (or `npm test`).

Serve `dist` over HTTP (ES modules require a server):

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory dist
```

Then visit <http://127.0.0.1:4174/>. Do not open the HTML with a `file:` URL.

## Editing

- `dist/content.js`: journeys, management, figures, demonstration collections, budget options, portfolio, transition stages and approved client logos.
- `dist/index.html`: chapter copy, semantic page structure, navigation and enquiry form.
- `dist/styles.css`: brand tokens, composition, responsive layouts and motion preferences.
- `dist/app.js`: interactive indexes, filtering, portfolio browsing and enquiry drafts.
- `dist/assets`: supplied-image WebP derivatives, vector logo and self-hosted Fira Sans / Source Sans Pro.
- `content-approvals.json`: private source conflicts and launch approvals; not part of the public output.
- `CONCEPT.md`: creative handoff, reference translation, source decisions and verification.

The asset preparation script uses the local source-extraction folder beside this project. It is optional; all runtime assets are already included.

## Checks and boundaries

Run `node scripts/check-content.mjs` for local content/asset checks. The browser QA record is in `CONCEPT.md`.

Search uses labelled demonstration data, not live availability. Enquiry controls prepare an email draft, with a copy fallback; they do not submit to a backend. No visitor data is stored. The previous wireframe remains in Git history. Publishing this replacement is a separate action; the existing published site is unchanged.

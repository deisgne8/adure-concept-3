<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project UI Rules

- Page-level section spacing is CMS-controlled. Set it only on a section's page
  wrapper with approved spacing tokens (`pt_100`, `pb_100`, `mt_100`, and
  `mb_100`); do not add top-level padding to the component's inner container.
  Full-viewport sections (for example, `100vh` heroes) are exempt.
- Keep typography tokens and role styles in `styles/global/tokens.css` and
  `styles/global/typography.css`. Do not duplicate a shared font treatment in
  component styles; reference the global token or add the role there instead.
- Use the shared `Button` UI component for new calls to action. Select its
  visual treatment through the component's `variant` prop instead of adding
  one-off button styling.
- Content that the CMS needs to edit belongs in the relevant `data/` JSON file.
  Hero headings are rendered from JSON lines with explicit `<br />` breaks;
  hero media, copy, and button label, link, and variant are JSON-driven.

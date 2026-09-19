// The approved homepage is the build source. Keep layout and copy edits in src/homepage.html.
import { readFileSync, writeFileSync } from 'node:fs';

const origin = new URL(process.env.SITE_ORIGIN || 'http://127.0.0.1:4180');
if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('SITE_ORIGIN must use HTTP(S)');
const pages = [
  ['homepage.html', 'index.html'],
  ['properties.html', 'properties.html']
];
for (const [source, destination] of pages) {
  const template = readFileSync(new URL(`../src/${source}`, import.meta.url), 'utf8');
  const output = template.replaceAll('{{SITE_ORIGIN}}', origin.origin);
  writeFileSync(new URL(`../dist/${destination}`, import.meta.url), output);
}
console.log('Built approved ADURE homepage and properties page');

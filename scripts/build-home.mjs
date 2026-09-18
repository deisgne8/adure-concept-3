// The approved homepage is the build source. Keep layout and copy edits in src/homepage.html.
import { readFileSync, writeFileSync } from 'node:fs';

const origin = new URL(process.env.SITE_ORIGIN || 'http://127.0.0.1:4180');
if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('SITE_ORIGIN must use HTTP(S)');
const template = readFileSync(new URL('../src/homepage.html', import.meta.url), 'utf8');
const output = template.replaceAll('{{SITE_ORIGIN}}', origin.origin);
writeFileSync(new URL('../dist/index.html', import.meta.url), output);
console.log('Built approved ADURE homepage from src/homepage.html');

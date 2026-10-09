// Renders every art/*.svg to a 3840x2160 PNG next to it. Run: node src/render.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Uses the project's playwright if installed, else a global one (npm i -g playwright).
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  const { execSync } = await import('node:child_process');
  const { createRequire } = await import('node:module');
  const root = execSync('npm root -g').toString().trim();
  ({ chromium } = createRequire(join(root, 'x.js'))('playwright'));
}

const art = join(dirname(fileURLToPath(import.meta.url)), '..', 'art');
const only = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 3840, height: 2160 } });
for (const f of readdirSync(art).filter((f) => f.endsWith('.svg'))) {
  if (only.length && !only.some((o) => f.includes(o))) continue;
  await page.setContent(`<style>html,body{margin:0;background:#000}</style>${readFileSync(join(art, f), 'utf8')}`);
  await page.screenshot({ path: join(art, f.replace('.svg', '.png')) });
  console.log('rendered', f);
}
await browser.close();

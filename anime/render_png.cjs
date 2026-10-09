// Render anime/scenes/*.svg to PNG with headless Chromium (Playwright).
//   node anime/render_png.cjs   (needs the `playwright` package on NODE_PATH or installed)
const { chromium } = require("playwright");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const dir = join(__dirname, "scenes");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".svg")).sort()) {
    const svg = readFileSync(join(dir, f), "utf8");
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await page.locator("svg").screenshot({ path: join(dir, f.replace(".svg", ".png")) });
    console.log("rendered", f);
  }
  await browser.close();
})();

// Build the printable PDF for each story from print.html.
// Usage: python3 -m http.server 8765 (in the repo root), then: node tools/build_pdf.js
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const root = path.dirname(__dirname);
const stories = [["duck", "pdf/the-rubber-duck-bandit.pdf"]];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  fs.mkdirSync(path.join(root, "pdf"), { recursive: true });
  for (const [id, out] of stories) {
    await page.goto(`http://localhost:${process.env.PORT || 8765}/print.html?s=${id}`, { waitUntil: "networkidle" });
    await page.waitForSelector("body[data-ready]");
    await page.pdf({ path: path.join(root, out), format: "Letter", printBackground: true, preferCSSPageSize: true });
    console.log("wrote", out);
  }
  await browser.close();
})();

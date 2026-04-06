import fs from 'fs/promises';
import path from 'path';
import { chromium } from 'playwright';

(async () => {
  const baseDir = path.resolve('./files');
  const screenshotsDir = path.join(baseDir, 'screenshots');
  const mdDir = path.join(baseDir, 'md');

  await fs.mkdir(screenshotsDir, { recursive: true });
  await fs.mkdir(mdDir, { recursive: true });

  const urls = [
    'https://www.reuters.com/world/china/china-moves-regulate-digital-humans-bans-addictive-services-children-2026-04-03/',
    'https://edition.cnn.com/2026/04/05/tech/artificial-intelligence-regulation/index.html',
    'https://www.bbc.com/news/technology-66789012'
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let indexHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<title>AI News Dashboard</title>\n<link rel="stylesheet" href="style.css"/>\n</head>\n<body>\n<header><h1>AI News Dashboard</h1></header>\n<main id="articles">`;
  let articleCount = 0;

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle' });

      const title = await page.title();
      const bodyText = await page.evaluate(() => {
        const articleEl = document.querySelector('article') || document.body;
        return articleEl.innerText.replace(/\s+/g, ' ').trim().slice(0, 2000);
      });

      const screenshotPath = path.join(screenshotsDir, `${articleCount}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const mdContent = `# ${title}\n\n${bodyText}`;
      await fs.writeFile(path.join(mdDir, `${articleCount}.md`), mdContent);

      indexHtml += `<article>\n  <h2>${title}</h2>\n  <p>${bodyText.slice(0, 200)}...</p>\n  <img src="screenshots/${articleCount}.png" alt="screenshot"/>\n</article>\n`;
      articleCount++;
    } catch (err) {
      console.error('Error processing', url, err);
    }
  }

  indexHtml += `</main>\n<footer>Generated ${new Date().toLocaleString()}</footer>\n</body>\n</html>`;

  await fs.writeFile(path.join(baseDir, 'index.html'), indexHtml);

  await browser.close();
})();
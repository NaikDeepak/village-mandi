import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');

const { render } = await import('./dist/server/entry-server.js');

// Determine implementation.
// For now, we only need to pre-render the landing page for SEO.
// Other pages can be client-side rendered as they are authenticated.
const routesToPrerender = ['/'];

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = await render(url);

    // Should pull out the helmet head data to inject into head
    const { html, helmet } = appHtml;

    const helmetHead = `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `;

    const htmlWithHead = template
      .replace('<!--app-head-->', helmetHead)
      .replace('<!--app-html-->', html);

    const filePath = `dist${url === '/' ? '/index.html' : `${url}/index.html`}`;
    fs.writeFileSync(toAbsolute(filePath), htmlWithHead);
    console.log('pre-rendered:', filePath);
  }
})();

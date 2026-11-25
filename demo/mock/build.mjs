/** Builds one self-contained HTML page: the real card, the mock TV and a control panel. Run: node demo/mock/build.mjs */
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cache = join(here, '..', '.cache');
const dist = join(here, 'dist');
const docs = join(here, '..', '..', 'docs'); // GitHub Pages serves docs/index.html
mkdirSync(cache, { recursive: true });
mkdirSync(dist, { recursive: true });
mkdirSync(docs, { recursive: true });

const MDI = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47';
for (const [file, url] of [['mdi.css', `${MDI}/css/materialdesignicons.min.css`], ['mdi.woff2', `${MDI}/fonts/materialdesignicons-webfont.woff2`]]) {
  if (!existsSync(join(cache, file))) execFileSync('curl', ['-sL', url, '-o', join(cache, file)]);
}

const { outputFiles } = await build({ entryPoints: [join(here, 'entry.js')], bundle: true, minify: true, format: 'iife', write: false, outfile: 'bundle.js' });
const bundle = outputFiles[0].text.replace(/<\/script/g, '<\\/script');

const css = readFileSync(join(cache, 'mdi.css'), 'utf8').replace(/@font-face\{.*?\}/s, '');
const font = readFileSync(join(cache, 'mdi.woff2')).toString('base64');
const iconStub = `
const MDI_CSS = ${JSON.stringify(css)};
const sheet = new CSSStyleSheet(); sheet.replaceSync(MDI_CSS);
class HaIcon extends HTMLElement {
  static get observedAttributes() { return ['icon']; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    if (!root.adoptedStyleSheets.length) root.adoptedStyleSheets = [sheet];
    const name = (this.getAttribute('icon') || '').replace('mdi:', '');
    root.innerHTML = '<i class="mdi mdi-' + name + '" style="font-size:var(--mdc-icon-size,24px);line-height:1;display:block"></i>';
  }
}
customElements.define('ha-icon', HaIcon);`;

const page = readFileSync(join(here, 'page.html'), 'utf8');
const html = `${page}<style>@font-face{font-family:'Material Design Icons';src:url(data:font/woff2;base64,${font}) format('woff2');font-display:block}</style>
<script>${iconStub}</script>
<script>${bundle}</script>
`;
// docs/index.html is a complete document (it needs the viewport tag to be responsive on a phone);
// artifact.html is the bare fragment that the Claude artifact wrapper expects.
const url = 'https://mrgiov.github.io/lg-tv-remote-card/';
const title = 'LG TV Remote Card: online demo / telecomando LG per Home Assistant';
const about = 'Try the Home Assistant Lovelace card for LG webOS TVs in your browser: magic-remote touchpad, channels, apps, keyboard. Provala nel browser: telecomando LG webOS per Home Assistant.';
const head = `<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${about}"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${about}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${url}screenshot.png">
<meta name="twitter:card" content="summary_large_image">`;
// the page's own <title> (kept short for the artifact) is replaced by the search-friendly one
writeFileSync(join(docs, 'index.html'), head + html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`));
writeFileSync(join(dist, 'artifact.html'), html);
console.log(`docs/index.html  ${((head.length + html.length) / 1024).toFixed(0)} KB`);

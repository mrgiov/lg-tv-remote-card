/** Builds one self-contained HTML page: the real card, the mock TV and a control panel. Run: node demo/mock/build.mjs */
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cache = join(here, '..', '.cache');
const dist = join(here, 'dist');
mkdirSync(cache, { recursive: true });
mkdirSync(dist, { recursive: true });

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
writeFileSync(join(dist, 'index.html'), html);
console.log(`demo/mock/dist/index.html  ${(html.length / 1024).toFixed(0)} KB`);

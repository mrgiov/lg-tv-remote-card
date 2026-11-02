// Bundles src/ into the single file HACS serves: dist/lg-tv-remote-card.js
import { build } from 'esbuild';

await build({
  entryPoints: ['src/lg-tv-remote-card.js'],
  outfile: 'dist/lg-tv-remote-card.js',
  bundle: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
});

// Bundles the Demo storefront scripts into the theme's flat assets/ folder.
//   assets/demo.js     global motion layer (smooth scroll, scroll animations, cursor, cart buttons)
//   assets/demo-3d.js  three.js scenes, loaded on demand by demo.js
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: {
    demo: 'src/demo/main.js',
    'demo-3d': 'src/demo/three/index.js',
  },
  outdir: 'assets',
  bundle: true,
  format: 'esm',
  target: ['es2020'],
  minify: true,
  legalComments: 'eof',
  logLevel: 'info',
};

if (watch) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
}

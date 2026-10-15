// Bundles the Razzy storefront scripts into the theme's flat assets/ folder.
//   assets/razzy.js     global motion layer (smooth scroll, scroll animations, cursor, cart buttons)
//   assets/razzy-3d.js  three.js scenes, loaded on demand by razzy.js
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: {
    razzy: 'src/razzy/main.js',
    'razzy-3d': 'src/razzy/three/index.js',
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

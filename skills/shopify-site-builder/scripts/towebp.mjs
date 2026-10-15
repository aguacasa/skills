// Resizes transparent PNG cutouts and encodes them as WebP (typically 50–90 KB each).
//
//   node towebp.mjs <inDir> <outDir> [maxSide=1100] [prefix=]
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { basename } from 'node:path';

const [inDir, outDir, maxSide = '1100', prefix = ''] = process.argv.slice(2);
if (!inDir || !outDir) {
  console.error('usage: node towebp.mjs <inDir> <outDir> [maxSide] [prefix]');
  process.exit(1);
}
for (const file of readdirSync(inDir).filter((n) => n.endsWith('.png'))) {
  const out = `${outDir}/${prefix}${basename(file, '.png')}.webp`;
  const info = await sharp(`${inDir}/${file}`)
    .resize({ width: +maxSide, height: +maxSide, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

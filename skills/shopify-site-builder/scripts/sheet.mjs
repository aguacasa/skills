// Tiles screenshots into one contact sheet so a whole page can be reviewed in a single image.
//
//   node sheet.mjs <out.jpg> <columns> <tileWidth> <files...>
import sharp from 'sharp';

const [out, cols, tileW, ...files] = process.argv.slice(2);
if (!out || !files.length) {
  console.error('usage: node sheet.mjs <out.jpg> <columns> <tileWidth> <files...>');
  process.exit(1);
}
const width = +tileW;
const tiles = await Promise.all(files.map((file) => sharp(file).resize({ width }).toBuffer({ resolveWithObject: true })));
const tileH = Math.max(...tiles.map((t) => t.info.height));
const gap = 8;
const columns = +cols;
const rows = Math.ceil(files.length / columns);
await sharp({ create: { width: columns * (width + gap) + gap, height: rows * (tileH + gap) + gap, channels: 3, background: '#222' } })
  .composite(tiles.map((t, i) => ({ input: t.data, left: gap + (i % columns) * (width + gap), top: gap + Math.floor(i / columns) * (tileH + gap) })))
  .jpeg({ quality: 72 })
  .toFile(out);
console.log(out);

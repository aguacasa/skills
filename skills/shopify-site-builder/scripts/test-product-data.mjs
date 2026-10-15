import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { Liquid } from 'liquidjs';

const base = new URL('../reference-implementation/', import.meta.url);
const engine = new Liquid({ strictFilters: true });
engine.registerFilter('metafield_tag', (field) => `<div>${field.value.content}</div>`);
engine.registerFilter('image_url', (image, [key, width]) => {
  assert.equal(key, 'width');
  return `${image.url}?width=${width}`;
});
const field = (type, value) => ({ type, value });
const product = (custom = {}, description = '') => ({
  description,
  featured_image: { url: '/whole-product.jpg' },
  metafields: { custom },
});
async function render(file, scope) {
  // These Shopify-only tags contain docs, CSS, or JSON, not Liquid output.
  const source = (await readFile(new URL(file, base), 'utf8'))
    .replace(/{%-?\s*(doc|stylesheet|schema)\s*-?%}[\s\S]*?{%-?\s*end\1\s*-?%}/g, '');
  return (await engine.parseAndRender(source, scope)).trim();
}
const content = (p, part, namespace) => render('snippets/demo-description.liquid', { product: p, part, namespace });

test('unstructured descriptions remain intact in About without inventing fields', async () => {
  const html = '<h2>A handmade chair</h2><p>Oak, with a natural finish.</p><p><strong>Warning:</strong> Example prose</p>';
  const p = product({}, html);
  assert.equal(await content(p, 'about'), html);
  assert.equal(await content(p, 'summary'), '');
  assert.equal(await content(p, 'warning'), '');
});

test('plain reviewed text is escaped and lists render readable content', async () => {
  const p = product({
    summary: field('single_line_text_field', '<script>not markup</script>'),
    ingredients: field('list.single_line_text_field', ['Oak', 'Cotton & linen']),
  });
  assert.equal(await content(p, 'summary'), '&lt;script&gt;not markup&lt;/script&gt;');
  assert.equal(await content(p, 'ingredients'), 'Oak, Cotton &amp; linen');
});

test('reviewed rich About takes priority over imported description', async () => {
  const p = product({ about: field('rich_text_field', { content: 'Reviewed copy' }) }, '<p>Old import</p>');
  assert.equal(await content(p, 'about'), '<div>Reviewed copy</div>');
});

test('existing namespaces and category-specific text keys are usable', async () => {
  const p = product();
  p.metafields.merchant = { care_instructions: field('multi_line_text_field', 'Wash gently') };
  assert.equal(await content(p, 'care_instructions', 'merchant'), 'Wash gently');
  assert.equal(await content(p, 'care_instructions'), '');
  p.metafields.custom.summary = field('file_reference', { url: '/not-summary.png' });
  assert.equal(await content(p, 'summary'), '');
});

test('description image alt text never creates product badges', async () => {
  const p = product({}, '<p><img src="badge.png" alt="Certified organic"></p>');
  assert.equal(await render('blocks/demo-product-badges.liquid', { closest: { product: p } }), '');
  p.metafields.custom.badges = field('list.single_line_text_field', ['Verified attribute', '<untrusted>']);
  const result = await render('blocks/demo-product-badges.liquid', { closest: { product: p }, block: { settings: { label: 'Attributes' } } });
  assert.match(result, /Verified attribute/);
  assert.match(result, /&lt;untrusted&gt;/);
  assert.doesNotMatch(result, /Certified organic/);
});

test('labels use explicit artwork and never crop or substitute product photos', async () => {
  const p = product();
  assert.equal(await render('snippets/demo-label-image.liquid', { product: p, width: 768 }), '');
  p.metafields.custom.label_image = field('file_reference', { url: '/prepared-label.png' });
  assert.equal(await render('snippets/demo-label-image.liquid', { product: p, width: 768 }), '/prepared-label.png?width=768');
  assert.equal(await render('snippets/demo-label-image.liquid', { product: p }), '/prepared-label.png?width=1024');
});

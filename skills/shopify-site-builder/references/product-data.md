# Supplier-neutral product data

The storefront reads merchant-approved Shopify product data, not a supplier's HTML
layout. The supplier, a catalog/PIM, or an existing app may remain the operational
source of truth; record who owns each field and what a sync can overwrite.

## Establish the mapping

Inspect representative products from each source, including a variant and a
product with missing optional data. Ask which facts, images, and certifications
are approved. Keep app-owned fields, SKUs, variant IDs, inventory, and fulfillment
ownership intact. Never assume one supplier, country, packaging shape, image size,
HTML layout, or fixed label crop.

For theme-owned additions, use merchant-owned definitions such as `custom.*`.
Reuse correct existing definitions; otherwise create the typed definition first
through the merchant's Custom data admin or an authorized API workflow, write the
reviewed value, then read it back and check storefront rendering. Changing a
supplier-owned feed requires its own scoped authorization.

## Demo contract

| Field | Type | Use |
|---|---|---|
| `custom.summary` | single_line_text_field or multi_line_text_field | Optional short introduction |
| `custom.about` | rich_text_field or multi_line_text_field | Reviewed detailed copy; when absent, show the complete product.description |
| `custom.badges` | list.single_line_text_field | Verified attributes; never scrape image alt text to infer claims |
| `custom.label_image` | file_reference restricted to images | Prepared label texture; no automatic crop |
| `custom.details_image` | file_reference restricted to images | Explicit specification/label image, never selected by shape |
| `custom.color` | color | Optional visual accent |
| `custom.cutout`, `custom.cutout_float` | file_reference restricted to images | Optional product artwork; the stage falls back to the featured image |
| `custom.tagline`, `custom.word` | single_line_text_field | Optional product marketing text for demo sections |
| `custom.ingredients` | list.single_line_text_field | Optional category-specific ingredients used by demo chips and detail text |
| `custom.flavor` | single_line_text_field | Optional category-specific property |
| `custom.country`, `custom.amount`, `custom.weight` | single_line_text_field | Optional display copy, not inventory or shipping authority |
| `custom.suggested_use`, `custom.warning`, `custom.caution` | multi_line_text_field | Optional reviewed directions and warnings |

These are demo keys, not mandatory fields for every catalog. Map materials, care,
size charts, compatibility, or other category attributes to appropriate keys and
labels. The text reader accepts a `namespace` parameter and a key in `part`.
Plain text and lists are escaped, rich About content uses Shopify's metafield
renderer, and optional missing fields produce no invented content. Do not place
an entire unknown supplier description into a summary or certification field.

The demo uses `custom` consistently. If a merchant has different established
namespaces, adapt every affected consumer, including chips, color, images, and
3D data. Do not copy values into competing fields without an ownership decision.
Earlier copies of this demo used a `demo` namespace and parsed HTML descriptions.
An existing adaptation needs an explicit field-mapping review before using these
updated modules; this change does not migrate a live catalog. Preserve existing
values, populate approved replacements where agreed, and preview before deployment.

## Assets and verification

Prepare label-only artwork from the actual supplied asset when needed; review
its bounds before saving a new file. Do not guess a universal crop or use a whole
product photo as a label texture. The tin model is optional example geometry.

Check an unstructured description, a structured product, absent optional fields,
and an alternative product category. Confirm badges are explicitly approved and
missing images do not become unrelated product media. Preserve supplier syncing,
variant selection, inventory, shipping, and checkout behavior.

Implementation references: [Liquid metafields](https://shopify.dev/docs/api/liquid/objects/metafield),
[metafield rendering](https://shopify.dev/docs/api/liquid/filters/metafield_tag).

# Shopify recipes

## Audit the store (connector `graphql_query`)
Read:
- shop name and domain, apps (`appInstallations`), fulfillment services and locations (`locations(includeLegacy: true)`);
- products with variants, SKUs, `inventoryItem.tracked`, inventory levels and `templateSuffix`;
- media, metafields, menus, pages, `shopPolicies`, delivery profiles (`deliveryProfiles` → location groups and zones).

If a supplier's fulfillment location isn't in any delivery profile, products show **sold out**. The owner must add it (Settings → Shipping and delivery → General shipping rates → add the location, a US zone and rates).

## Product metafields (one namespace, e.g. the brand name)
Create definitions with `metafieldDefinitionCreate` (ownerType PRODUCT, storefront PUBLIC_READ):

| key | type | use |
|---|---|---|
| `color` | color | packaging colour; drives section colours |
| `tagline` | single_line_text_field | short benefit line |
| `flavor` | single_line_text_field | |
| `ingredients` | list.single_line_text_field | "L-Theanine 50mg" chips and cards |
| `cutout` | file_reference (Image) | transparent front shot |
| `cutout_float` | file_reference (Image) | transparent hero composition |

Fill them with `metafieldsSet` (max 25 per call).

## Images
- **Cutouts:** `swift scripts/cutout.swift in.jpg out.png`, then `node scripts/towebp.mjs`.
- **Upload local files to Files:** either use `stagedUploadsCreate` plus a multipart POST plus `fileCreate`, or put the files in `assets/`, let `shopify theme dev` sync them, then `fileCreate` from `https://cdn.shopify.com/s/files/<shop path>/t/<n>/assets/<file>` and remove them from assets.
- **Upload by URL** (e.g. Unsplash placeholders): `fileCreate { originalSource, alt }` with no filename, then `fileUpdate` to rename them to `*-placeholder-*.jpg`.
- **Region crop from a product photo:** `{{ image | image_url: width: 768 }}&crop=region&crop_left=X&crop_top=Y&crop_width=W&crop_height=H`. The CDN serves WebP to browsers. Measure X/Y/W/H once on the supplier's mockup template.

## Product page
Keep the theme's product section so it still handles add to cart, Shop Pay, variants, the sticky bar and structured data. Then:
- add a section setting that swaps the media gallery for a custom static block (the 3D stage);
- add theme blocks inside the product details (intro, facts, badges);
- map product colours onto the theme's own colour variables in CSS, so price and buy buttons recolour automatically;
- parse specs from the supplier description (`demo-description.liquid`) so the supplier copy stays the source of truth.

## Deploy
```bash
shopify theme pull --store S --theme LIVE_ID --path /tmp/live      # snapshot live
git archive LAST_DEPLOYED | tar -x -C /tmp/last && diff -rq /tmp/last /tmp/live
shopify theme push --store S --theme LIVE_ID --path . --allow-live  # only on the owner's go
```

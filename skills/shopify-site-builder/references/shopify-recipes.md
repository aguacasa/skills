# Shopify recipes

## Audit the store (connector `graphql_query`)
Read:
- shop name and domain, apps (`appInstallations`), fulfillment services and locations (`locations(includeLegacy: true)`);
- products with variants, SKUs, `inventoryItem.tracked`, inventory levels and `templateSuffix`;
- media, metafields, menus, pages, `shopPolicies`, delivery profiles (`deliveryProfiles` → location groups and zones).

If a product is unavailable, inspect publication, variants, inventory policy,
stocked locations, market eligibility, and delivery profiles. Do not diagnose all
sold-out states as shipping problems. Verify supplier-managed fulfillment and
rates for the merchant's actual markets; never add a US zone by default.

## Product data and integrations

Follow [the product data contract](product-data.md): inspect existing definitions,
create missing merchant-owned typed fields only when authorized, write approved
values, read them back, and verify storefront output. Preserve app-owned feeds,
SKU/variant identity, inventory, and fulfillment settings. The demo uses `custom`
fields; map other established namespaces deliberately. Descriptions remain
merchant-managed content, not an HTML feed parser.

Read [native features](native-features.md) for the supplier/service inventory and
Shopify-first recommendations. An installed-app list does not reveal every
tracking script, external supplier service, or manual integration.

## Images
- **Cutouts:** `swift scripts/cutout.swift in.jpg out.png`, then `node scripts/towebp.mjs`.
- **Upload local files to Files:** either use `stagedUploadsCreate` plus a multipart POST plus `fileCreate`, or put the files in `assets/`, let `shopify theme dev` sync them, then `fileCreate` from `https://cdn.shopify.com/s/files/<shop path>/t/<n>/assets/<file>` and remove them from assets.
- **Upload by URL** (e.g. Unsplash placeholders): `fileCreate { originalSource, alt }` with no filename, then `fileUpdate` to rename them to `*-placeholder-*.jpg`.
- **Labels and specifications:** use explicit approved image references (`custom.label_image`, `custom.details_image`). If artwork needs preparation, inspect that actual asset and save a reviewed derived image. Never reuse fixed crop coordinates or infer a specifications image from its proportions.

## Product page
Keep the theme's product section so it still handles add to cart, Shop Pay, variants, the sticky bar and structured data. Then:
- add a section setting that swaps the media gallery for a custom static block (the 3D stage);
- add theme blocks inside the product details (intro, facts, badges);
- map product colours onto the theme's own colour variables in CSS, so price and buy buttons recolour automatically;
- render reviewed typed fields through `demo-description.liquid`; show the complete product description in About when no structured About exists. Optional fields stay empty instead of guessing from supplier HTML.

## Deploy
```bash
shopify theme pull --store S --theme LIVE_ID --path /tmp/live      # snapshot live
git archive LAST_DEPLOYED | tar -x -C /tmp/last && diff -rq /tmp/last /tmp/live
shopify theme push --store S --theme LIVE_ID --path . --allow-live  # only on the owner's go
```

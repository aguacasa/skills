# Reference implementation (Demo)

An anonymized Helio-based theme extension for a fictional oral-strip supplement store. It illustrates implementation mechanics, not verified product facts or a complete theme. Copy selected modules and adapt them.

## Map

| Path | What it is |
|---|---|
| `src/demo/main.js` | Entry: mounts each section's behaviour per Shopify section with a GSAP context, and rebuilds when the theme switches scroll containers |
| `src/demo/core.js` | GSAP plugins, reduced-motion flag, the theme's scroll container (`.page-wrapper` ≥990px), lazy three.js loader |
| `src/demo/global/` | Lenis smooth scroll, reveal and SplitText effects, tilt, magnetic buttons, one-tap add to cart (Shopify standard cart actions) |
| `src/demo/sections/` | Hero, tape, how it works, lineup (pinned sideways scroll), stats, moments, mood picker, sign-off, product stage and accordion |
| `src/demo/three/` | Shared renderer, environment and loop helpers; tin model; hero ring (two canvases so objects pass in front of and behind HTML text); product stage; dissolve scene |
| `scripts/build.mjs`, `package.json` | esbuild: `src/` → `assets/demo.js` and the lazily loaded `assets/demo-3d.js` |
| `assets/demo.css` | Tokens, type, buttons, chips, grain, product-page overrides that map product colours onto the theme's colour variables |
| `snippets/demo-head.liquid` | Self-hosted fonts mapped onto the theme's font variables, plus the CSS and JS tags |
| `snippets/demo-vars.liquid` | Product colour → readable foreground and accent CSS variables (`color_brightness`) |
| `snippets/demo-description.liquid` | Renders typed merchant-owned custom metafields, with a full-description fallback for About |
| `snippets/demo-label-image.liquid` | Uses an explicitly supplied label image; no fixed crop or photo substitution |
| `snippets/demo-add-button.liquid` | One-tap add-to-cart pill |
| `sections/demo-*.liquid` | Homepage and product-page sections with editor schemas |
| `blocks/` | Product page: 3D stage (static block that replaces the media gallery), intro, facts, badges |
| `templates/index.json`, `templates/product.json` | How the sections and blocks are composed |

## Adapting
1. Adapt the demo file and CSS prefixes to the brand if desired. The product data contract uses merchant-owned `custom` metafields; map existing fields deliberately instead of rewriting a supplier app's namespace.
2. Product-page integration needs two small edits to the theme's own files. In `sections/product-information.liquid`, a `demo_stage` setting swaps the media gallery for `_demo-product-stage`. In `snippets/product-information-content.liquid`, add the `rz-pdp` class and the product colour variables when that setting is on. Re-apply these by hand; they aren't included here.
3. Render the head and body snippets from `layout/theme.liquid` (after the theme's colour palette in `<head>`; before `</body>`).
4. Supply an approved label-only image as `custom.label_image` if using the example tin model. No crop coordinates or image dimensions are assumed. Use real product geometry or the theme's standard gallery for other packaging; a photo on the tin model does not make it accurate. Optional `custom.details_image` explicitly selects a specifications image rather than guessing from its aspect ratio.
5. The homepage copy, product handles and placeholder image filenames in the templates are demo fixtures. Replace them before preview or deployment.

Fonts, logo files and product imagery are brand assets and aren't included.

## Product data

Read [the supplier-neutral data contract](../references/product-data.md) before adapting these modules. Raw descriptions are never parsed for badges, claims, facts, or labels. The supplement copy and tin geometry remain category-specific demo fixtures; select or replace them rather than applying them to every brand.

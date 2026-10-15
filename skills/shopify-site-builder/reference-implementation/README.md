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
| `snippets/demo-description.liquid` | Parses summary, ingredients, how to use, warnings and badges from a Supliful-format description |
| `snippets/demo-add-button.liquid` | One-tap add-to-cart pill |
| `sections/demo-*.liquid` | Homepage and product-page sections with editor schemas |
| `blocks/` | Product page: 3D stage (static block that replaces the media gallery), intro, facts, badges |
| `templates/index.json`, `templates/product.json` | How the sections and blocks are composed |

## Adapting
1. Find and replace `demo`, `Demo` and `rz-`/`rz_` with the brand's prefix (file names too), including the metafield namespace in Liquid.
2. Product-page integration needs two small edits to the theme's own files. In `sections/product-information.liquid`, a `demo_stage` setting swaps the media gallery for `_demo-product-stage`. In `snippets/product-information-content.liquid`, add the `rz-pdp` class and the product colour variables when that setting is on. Re-apply these by hand; they aren't included here.
3. Render the head and body snippets from `layout/theme.liquid` (after the theme's colour palette in `<head>`; before `</body>`).
4. Label textures crop the supplier's 2048px front mockup at a fixed region. Measure your supplier's template and update the numbers in `demo-hero.liquid` and `_demo-product-stage.liquid`.
5. The homepage copy, product handles and placeholder image filenames in the templates are demo fixtures. Replace them before preview or deployment.

Fonts, logo files and product imagery are brand assets and aren't included.

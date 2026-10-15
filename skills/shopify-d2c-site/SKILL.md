---
name: shopify-d2c-site
description: Builds a premium, animated D2C storefront on a Shopify theme. It sets up the brand system (palette, fonts, logo files), product data and imagery (metafields, cutouts), then builds a 3D hero, scroll-driven product-colour sections, product pages that keep the theme's checkout, footer and legal pages, and checks every step in headless Chrome before a safe deploy. Use when the user wants to design, build, redesign or launch a Shopify store or theme, make a store look high-end, add 3D or scroll animation to Shopify, or set up a supplement or wellness D2C brand site.
---

# Shopify D2C site

Turns a Shopify store and a logo into a high-end, interactive storefront. It stays on Shopify's own theme, so checkout, Shop Pay, apps and the theme editor keep working, and adds a light motion layer (GSAP, Lenis, three.js) on top.

## Quick start

1. Confirm the Shopify connector points at the right store (`get-shop-info`).
2. In the project repo: `shopify theme pull --store <shop>.myshopify.com --theme <liveId> --path . --nodelete`, then `shopify theme dev` (the owner signs in and enters the storefront password).
3. `cd <skill>/scripts && npm install` once, for the screenshot and image tools.
4. Follow [references/workflow.md](references/workflow.md) phase by phase, stopping at every **[ASK]** checkpoint.

## Workflow

- [ ] Phase 0, setup: store check, git repo, tools
- [ ] Phase 1, brand: name and domain help, palette with a contrast table, fonts. See [design-system.md](references/design-system.md)
- [ ] Phase 2, store audit: products, supplier, locations, shipping, templates, policies. See [shopify-recipes.md](references/shopify-recipes.md)
- [ ] Phase 3, theme foundation: pull, preview, read the theme's AGENTS.md
- [ ] Phase 4, assets and data: cutouts, WebP, Files, product metafields, self-hosted fonts
- [ ] Phase 5, build: brand basics, hero, sections, product page, footer, with screenshots after each
- [ ] Phase 6, legal and launch prep: policy drafts and owner handoffs. See [compliance.md](references/compliance.md)
- [ ] Phase 7, ship: merge, diff live, owner go-ahead, push, verify. See [qa-checklist.md](references/qa-checklist.md)

## Non-negotiables

- **Restraint:** read [restraint-rules.md](references/restraint-rules.md) before designing anything. No eyebrows, outline type, cursor followers, hint text, floating debris or drips. One hero "wow" per page. Text always wins over motion.
- **Commerce safety:** never change SKUs, variants or a supplier's fulfillment location. Keep the theme's product form, cart drawer and accelerated checkout.
- **Compliance:** structure/function claims only, FDA disclaimer, and no invented claims or reviews ([compliance.md](references/compliance.md)).
- **Verify visually:** after every change, take desktop (1440×900) and phone (390×844) screenshots and contact sheets with `scripts/shoot.mjs` and `scripts/sheet.mjs`, then read them before reporting.
- **Deploy safely:** never push to the live theme without the owner's explicit go-ahead. Diff live against the last deploy first (`scripts/deploy-check.sh`).
- **Shared folders:** if other agent sessions use the same repo, merge and deploy through `git worktree` and don't switch the shared checkout.
- **Passwords:** never enter passwords or storefront passwords; the owner types them.

## Reference implementation

`reference-implementation/` is the working Razzy build: sections, blocks, snippets, the motion layer in `src/` and the esbuild script. Copy what you need, rename the `razzy`/`rz` prefixes and the `razzy` metafield namespace to the new brand, then adapt the copy and colours. See [reference-implementation/README.md](reference-implementation/README.md).

## More

- Known problems and fixes: [references/gotchas.md](references/gotchas.md). Check it before debugging.
- Kickoff prompt for the build: [references/first-prompt.md](references/first-prompt.md).
- Which model and thinking level to use for each step: [references/models.md](references/models.md).

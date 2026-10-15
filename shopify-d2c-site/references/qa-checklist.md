# QA checklist

Run after every section, and in full before every deploy. The scripts are in `../scripts` (run `npm install` there once).

## Screenshots
```bash
node scripts/shoot.mjs http://127.0.0.1:9292/ shots/home 1440 900 auto --skip-intro=<introKey>
node scripts/shoot.mjs http://127.0.0.1:9292/ shots/home-m 390 844 auto --mobile
node scripts/sheet.mjs shots/home-sheet.jpg 4 360 shots/home-*.jpg
```
Read the contact sheets and check:
- [ ] Nothing overlaps text; descenders are intact; 3D objects stay behind or around the headline.
- [ ] Colours and contrast are correct in every product colour (light colours use dark text).
- [ ] Pinned and sideways sections start and end cleanly; nothing is stuck mid-animation.
- [ ] The phone layout has no horizontal scroll and the tap targets are comfortable.

## Behaviour
- [ ] `page-check.mjs` reports no page errors (ignore Shopify's own 400/403s for shop.app and the account menu).
- [ ] Hover, focus and disabled states are readable. Test by hovering in headless Chrome and reading computed styles.
- [ ] Add-to-cart opens the theme's cart drawer.
- [ ] `/products/<handle>.js` returns `"available": true`. If false, check the shipping profile includes the fulfillment location.
- [ ] Reduced motion: emulate it and confirm static fallbacks show.
- [ ] Theme editor: sections load and unload cleanly (`shopify:section:load` / `unload`).

## Deploy
- [ ] Commit, then merge to `main` (through a worktree if other sessions share the folder).
- [ ] `scripts/deploy-check.sh <store> <themeId> <lastDeployedCommit>`: the diff must be empty or explained.
- [ ] Push only after the owner says so: `scripts/deploy-check.sh … --push`.
- [ ] Afterwards, confirm key files match on the live theme.

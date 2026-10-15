# Full workflow

Each phase ends at a checkpoint. **[ASK]** means stop and get the owner's answer or approval.

## Phase 0: Setup
- Confirm the connected Shopify store with `get-shop-info`. **[ASK]** Is this the right store? If not, use `switch-shop` and have the owner reconnect.
- `git init`; private GitHub repo with `gh repo create <name> --private --source=. --push`.
- Check that Node 22+, the Shopify CLI and Chrome are installed.

## Phase 1: Brand (assist)
- Name ideas: the connector's `generate-business-names`. Domains: `generate-domain-names`, and never claim a domain is available without checking.
- **[ASK]** Get the logo SVG, hero colours, product colours and one-line design language.
- Build `brand/README.md`: palette plus a contrast table (`scripts/contrast.py`), fonts and their licences.

## Phase 2: Store audit
- Run the audit from `shopify-recipes.md`. Explain how orders flow (store, supplier, customer).
- Flag blockers: products unavailable, alternate templates, placeholder social links, missing policies.

## Phase 3: Theme foundation
- `shopify theme pull … --nodelete`, commit. Read the theme's `AGENTS.md` if present.
- Start `shopify theme dev` in a visible terminal. **[ASK]** The owner signs in and enters the storefront password.

## Phase 4: Assets and data
- Cutouts, WebP, Files, metafields, label crops and placeholder lifestyle photos (`shopify-recipes.md`).
- Self-host fonts (`design-system.md`).

## Phase 5: Build
- Copy `reference-implementation/` into the theme and rename the `razzy`/`rz` prefixes and the metafield namespace to the brand. Set up `npm run build` (esbuild).
- Build in this order, screenshotting (`qa-checklist.md`) after each step:
  1. brand basics: logo, palette, buttons, header;
  2. hero;
  3. the remaining homepage sections;
  4. product page;
  5. footer and legal pages.
- Follow `restraint-rules.md` and `compliance.md` throughout.
- **[ASK]** Run a desktop review round, then a mobile review round, with contact sheets.

## Phase 6: Legal and launch prep (assist)
- Draft refund, shipping, terms and contact policies plus FAQ, disclaimer and accessibility pages (`compliance.md`).
- **[ASK]** The owner pastes the policies, adds the fulfillment location to shipping, sets up payments and connects the domain.

## Phase 7: Ship
- Merge to `main`, run `deploy-check.sh`, then **[ASK]** for go-ahead and push live, then verify.
- Leave the owner a short list of anything still blocking launch.

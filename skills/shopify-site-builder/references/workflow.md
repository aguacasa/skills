# Full workflow

Use established profile answers and current authorization. **[ASK]** marks information or approval that must be resolved if it is still missing; do not repeat answered questions.

## Phase 0: Setup
- Inspect the available Shopify tools and verify the selected store. **[ASK]** Resolve an ambiguous target before changing store data; the owner completes any required reconnection.
- Reuse the agreed project and repository. Create a repository or publish code only when requested; confirm scope and visibility before doing so.
- Check that Node 22+, the Shopify CLI and Chrome are installed.

## Phase 1: Brand (assist)
- Offer name or domain ideas when requested, using available tools. Never claim domain availability without checking.
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
- Use only relevant modules from `reference-implementation/`. Rename demo prefixes, remove example content, and adapt the Helio integration to the actual theme. Set up the build when those modules are used.
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
- Review the branch and live diff with `deploy-check.sh`. **[ASK]** Obtain explicit go-ahead for the target live theme, then deploy and verify. Follow the project’s merge process; do not merge automatically.
- Leave the owner a short list of anything still blocking launch.

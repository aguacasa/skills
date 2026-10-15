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
- Confirm suppliers, data-sync ownership, inventory and fulfillment, installed/planned services, pixels/tag managers, consent tools, and policy gaps. Use `product-data.md` and `native-features.md`.
- Present a relevant Shopify-first recommendation table for privacy controls, policies, marketing opt-in, tracking, and optional bundles/subscriptions. Explain compatibility and required decisions; do not silently activate services.
- Flag blockers: products unavailable, alternate templates, placeholder social links, missing policies.

## Phase 3: Theme foundation
- `shopify theme pull … --nodelete`, commit. Read the theme's `AGENTS.md` if present.
- Start `shopify theme dev` in a visible terminal. **[ASK]** The owner signs in and enters the storefront password.

## Phase 4: Assets and data
- Map approved product data into typed fields; prepare cutouts, WebP, explicit label/details images, and any needed files (`product-data.md`, `shopify-recipes.md`). No universal photo crops or supplier HTML parsing.
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
- Configure authorized privacy/marketing controls, policy links, and any selected bundle/subscription apps per `native-features.md`; verify supplier, payment, and theme compatibility.
- **[ASK]** Resolve remaining policy, payment, fulfillment, domain, or service approvals. Guide admin-only steps when the tools cannot perform them.
- Test consent and pixel behavior, applicable bundle inventory/fulfillment, and recurring purchase/cancellation flows before claiming launch readiness.

## Phase 7: Ship
- Review the branch and live diff with `deploy-check.sh`. **[ASK]** Obtain explicit go-ahead for the target live theme, then deploy and verify. Follow the project’s merge process; do not merge automatically.
- Leave the owner a short list of anything still blocking launch.

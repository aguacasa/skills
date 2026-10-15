---
name: shopify-site-builder
description: Design and build a Shopify theme storefront with a personalized brand system, product pages, optional motion, visual QA, and reviewed deployment. Use for new storefronts and theme redesigns.
---

# Shopify Site Builder

Build on Shopify's theme system so checkout, product forms, apps, and the theme
editor keep working. Adapt the design to the merchant, product category, and theme.

## Personalize and establish scope

Read [personalization.md](references/personalization.md) on first use. Reuse an
existing store profile or discover audience, products, regions, brand direction,
theme, project location, and scope. Ask only for missing essentials. Offer the
[restrained-product preset](references/restrained-product-preset.md) when useful;
3D, animated heroes, and supplement copy are not universal requirements.
Keep saved store preferences private and outside the installed skill.

## Setup and workflow

1. Establish whether the request is planning, a preview build, or an approved launch.
   Verify the target store through the available Shopify tools before mutations.
2. Inspect the existing project and theme instructions. Confirm local tools and
   authenticated access for execution: a shell, Node, Shopify CLI, and Chrome or
   Chromium for bundled QA. Apple Vision cutouts require macOS; use an available
   alternative elsewhere. Read [the workflow](references/workflow.md).
3. Pull the selected theme into the agreed project without deleting local files.
   Work on a preview/development theme. The owner completes interactive sign-in.
4. Build a brand system, inspect real product data, and implement the agreed pages
   with screenshots after meaningful changes. See [design-system.md](references/design-system.md),
   [shopify-recipes.md](references/shopify-recipes.md), and [qa-checklist.md](references/qa-checklist.md).
5. Review policies and copy for this category and sales region using
   [compliance.md](references/compliance.md). Verify current requirements against
   authoritative sources when writing regulated claims or legal text.
6. Review desktop and mobile results, compare against the current live theme, get
   explicit deployment authorization, then deploy and verify.

## Constraints

- Preserve SKUs, variants, supplier locations, product forms, cart, and accelerated
  checkout unless a requested change explicitly requires otherwise.
- Product facts, reviews, claims, legal identity, and contact details must come from
  the merchant or verified sources. Never publish demo data as real store facts.
- Readability, keyboard access, and reduced-motion behavior must work regardless
  of the chosen visual style. See [design guardrails](references/restraint-rules.md).
- Do not push to the live theme without explicit authorization. Inspect
  `scripts/deploy-check.sh` and its diff before deployment; resolve discrepancies.
- Reuse an existing repository. Do not create a remote, choose its visibility,
  merge a branch, or change account settings merely because a workflow example does.

## Demo implementation

[reference-implementation](reference-implementation/README.md) is an anonymized
supplement-store example built for a Helio-based theme. It is not a complete theme
or a universal drop-in. Its `demo` names, product handles, asset references, and copy
are examples. Select useful modules, replace all store-specific content, and adapt
theme integration and motion to the actual store. Brand images and fonts are not bundled.

See [gotchas.md](references/gotchas.md) for implementation-specific problems,
[first-prompt.md](references/first-prompt.md) for a kickoff example, and
[models.md](references/models.md) for tool-neutral task sizing.

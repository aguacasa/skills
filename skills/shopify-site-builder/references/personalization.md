# First-use discovery and returning-user profiles

## Find context before asking

Use the current brief, relevant conversation, and any profile the user supplies.
If a project directory is established and file tools are available, check only
`.skill-profiles/shopify-site-builder.md` in that project. A user may provide a different
private profile location. Do not scan unrelated folders or ask for their name,
family details, address, account passwords, or API keys to personalize this skill.

A profile with `onboarding_complete: true` marks discovery as done. If there is no
profile but the conversation already establishes the preferences, do not repeat
the interview. A missing file does not mean the person has never used the skill.

## First use

When preferences have not been established, ask one short, grouped discovery
message covering only the unanswered points below. Offer "use sensible defaults"
as an easy option. Do not collect everything before doing any useful work.

- What do you sell, who buys it, and which countries or regions will you serve? Who supplies, manufactures, stocks, or fulfills the products, and which source controls product facts, images, SKUs, and inventory?
- What brand direction, existing theme, assets, and example stores should guide the design? Offer the restrained-product preset as an optional starting point.
- What is the scope: planning, a preview theme, or an approved launch? Establish the target store, available access, project location, and any product-category restrictions. Ask which third-party apps, pixels, analytics/tag managers, email/SMS tools, reviews, fulfillment/returns services, consent tools, and other services are already used or planned.

Then ask only the relevant follow-ups: Are bundles wanted (fixed packs or a
customer-built selection)? Is recurring purchasing wanted? What marketing
channels and consent choices should be supported? Compare current Shopify
features and first-party apps using [native features and integrations](native-features.md).
Do not make the user enumerate apps that an authorized read-only audit can list;
confirm its findings and ask about services outside Shopify. "None" and "not yet
decided" are valid answers, not permission to install or enable anything.

Record a concise service inventory: purpose, provider, installation point, data
shared, consent integration, operational owner, and keep/replace/undecided status.
Use non-secret identifiers only. Match privacy and policy recommendations to
actual services, not a standard list of vendors. Present a short recommended
setup with reasons, eligibility/cost checks, and decisions needed before activation.

If the user explicitly asks for a complete result immediately or skips discovery,
proceed with stated defaults where possible. Ask for an essential missing input
when the task cannot proceed without it. Never treat an unanswered question as
permission to upload, publish, deploy, move source files, or spend money.

## Confirm and optionally remember

Summarize the chosen preferences briefly, distinguish assumptions from answers,
and continue the task. Offer to remember them using [the profile template](profile-template.md).
Write a profile only when the user asks or accepts that offer. Explain the exact
save location; keep it outside the installed skill package. Before saving inside
a Git checkout, check that the profile is ignored or choose a private location
with the user. This repository ignores `.skill-profiles/`; other projects may not.
If files are unavailable, return a copyable profile and explain that it must be
provided in a later chat. Do not claim persistent recall without a saved file or
supported user-approved memory.

Fill only fields supported by the user's answers. Set `onboarding_complete: true`
after discovery or an explicit choice to use defaults, not just because the file
exists. The profile stores preferences, never service permissions or credentials.
A preset is a starting point; the current brief overrides both preset and profile.

## Return visits and updates

Reuse the established profile. Ask only about missing essentials, a conflicting
brief, or a requested change; do not rerun onboarding each time. One-off requests
apply to the current deliverable. Update saved preferences only when the user
asks to remember the change. Follow the host's permission rules for actual actions
regardless of what a profile says. Do not edit the shared SKILL.md to personalize
one person's workflow.

# Shopify features and connected services

Reviewed against official Shopify guidance on 2026-10-15. Recheck current docs and
the merchant's plan, region, theme, payment gateway, and installed apps before
recommending or configuring a feature. Built-in settings and first-party apps are
different: an app may still need installation, configuration, and permissions.
Recommend relevant Shopify options first; retain a third-party service when it
meets a real requirement better. Do not add duplicate tools by default.

## Establish the service inventory

Ask about suppliers/fulfillment, tracking pixels, analytics/tag managers, sales
channels, email/SMS, consent tools, reviews, subscriptions, bundles, support,
returns, and other connected services. List authorized installed apps where
possible; ask about external scripts and services the audit cannot see. Record
purpose, data shared, installation point, ownership, costs to confirm, and whether
to keep, replace, or investigate. No credentials belong in this inventory.

## Recommend a setup for this store

Use a compact table: feature, fit, current state, recommendation/reason, prerequisite,
and merchant decision. Distinguish proposed, configured, and tested. The following
items are considerations, not an instruction to activate everything.

| Need | Shopify starting point | What to check |
|---|---|---|
| Customer privacy | Settings → Customer privacy: automated privacy policy, cookie banner, and data-sharing opt-out page | Actual practices, sales regions, connected services, existing consent tools, and public links |
| Store policies | Settings → Policies and available templates | Actual shipping/returns, business details, privacy disclosures, and cancellation terms where needed |
| Email/SMS opt-in | Checkout marketing opt-in controls | Intended channels, region settings, consent records, and integration with the chosen messaging service |
| Tracking | Customer events and compatible app pixels | Existing tags, consent requirements, duplicate events, and supported integration route |
| Fixed bundles or multipacks | Shopify Bundles first-party app | Product/variant eligibility, inventory, fulfillment, returns, discounts, and margin |
| Build-your-own selection | Assess mix-and-match requirements separately | Shopify Bundles is not a general mix-and-match builder; evaluate a suitable app or eligible custom approach |
| Repeat purchases | Shopify Subscriptions first-party app when suitable | Merchant interest, recurring stock, supported gateway/theme, purchase choices, and cancellation handling |

### Privacy and marketing

Recommend reviewing Shopify's automated privacy tools and configuring the cookie
banner and opt-out page for the store's relevant regions. Confirm disclosures
against actual connected services; automation is not a compliance guarantee. If a
third-party consent platform is retained, check its Shopify integration rather
than adding a second competing banner. Review Network Intelligence separately;
do not enable extra data sharing as a default. [Customer privacy settings](https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings)

Cookie/tracking consent, sale/sharing opt-out, and email/SMS marketing opt-in are
different controls. Recommend explicit marketing choices for the requested channels;
a phone number or order notification is not marketing consent. Verify regional
settings and wording before activation. [Checkout marketing options](https://help.shopify.com/en/manual/checkout-settings/checkout-form-options)

### Policies and pixels

Start with Shopify's policy tools where appropriate, then review shipping,
returns/refunds, privacy, terms, and any subscription cancellation policy for the
actual business. Replace placeholders and link the relevant policies from the
storefront and checkout; do not overwrite reviewed policies blindly.
[Store policies](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos)

Prefer supported app pixel integrations when available. Inventory tags in apps,
Customer events, theme code, and tag managers before adding a pixel. In a test
session, check consent-required events before acceptance, after acceptance, and
after rejection/withdrawal; also check opt-out handling and duplicate events.
Do not bypass consent to repair reporting. [Pixels overview](https://help.shopify.com/en/manual/promoting-marketing/pixels/overview),
[pixel migration and consent integration](https://help.shopify.com/en/manual/promoting-marketing/pixels/pixel-migration)

### Bundles and subscriptions

Recommend Shopify Bundles for an appropriate fixed bundle or multipack. It is a
free first-party app, not a universal customer-built bundle selector.
[Shopify Bundles](https://help.shopify.com/en/manual/products/bundles/shopify-bundles)

For mix-and-match, clarify selection rules before evaluating a third-party app or
eligible custom integration. Shopify currently documents incompatibility between
bundles and purchase options, including Shopify Subscriptions. Do not promise a
subscription bundle without verifying a specific compatible solution. Confirm that
supplier fulfillment understands component items and the shipping setup.
[Bundle eligibility and compatibility](https://help.shopify.com/en/manual/products/bundles/eligibility-and-considerations)

If the merchant wants recurring purchases, assess Shopify Subscriptions before
additional recurring-billing apps. Verify payment/theme eligibility, delivery
frequency, supply reliability, cancellation terms, and customer controls. Test
one-time and recurring purchase paths; never activate billing merely because the
merchant asked to explore it. [Setup](https://help.shopify.com/en/manual/products/purchase-options/subscriptions/setup),
[app eligibility](https://help.shopify.com/en/manual/products/purchase-options/subscriptions/shopify-subscriptions/considerations)

## Configuration and handoff

Proceed with changes already authorized by the requested setup scope. For an
unapproved app install, charge, new data sharing, tracking activation, or recurring
billing, explain the concrete proposal and obtain the missing authorization.
A saved preference is not permission. Record what was configured, how it was
tested, and anything the merchant must finish in the admin. Do not claim tests on
a live store when only instructions or templates were reviewed.

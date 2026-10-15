# Design guardrails

Apply these with every visual direction. The optional
[restrained-product preset](restrained-product-preset.md) supplies one aesthetic;
user branding can choose another.

- Preserve reading order, keyboard access, visible focus, and usable controls.
- Keep headings, descenders, and italics unclipped on desktop and mobile.
- Check body-text contrast at 4.5:1 and other applicable accessibility criteria.
  Use `scripts/contrast.py` as one check, not as a complete accessibility audit.
- Keep text legible around product imagery and animation. Limit competing motion.
- With reduced motion enabled, the page must remain complete and usable. Provide
  static fallbacks; do not leave content hidden while waiting for an animation.
- Check at representative desktop and phone sizes, including 390px width, and
  adapt breakpoints to the actual theme rather than assuming the demo's layout.

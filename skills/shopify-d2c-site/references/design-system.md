# Design system from a logo

## Palette
1. Pull the logo's two colours as the **hero pair** (e.g. a saturated base and a bright accent).
2. Add one **product colour** per product, sampled from the packaging or given by the owner.
3. Run `scripts/contrast.py <all colours> --text <accent> "#FFFFFF" "#05060B"` and record the results in `brand/README.md`.
4. Choose text per colour by brightness: dark colours take a light foreground with the accent for display type; mid and light colours take dark text everywhere. The reference snippet `razzy-vars.liquid` does this in Liquid with `color_brightness` (more than 100 means dark text; more than 120 means the accent goes dark too).

## Type
- **Display:** echo the logo's personality. Variable fonts with character axes are ideal (Fraunces with SOFT=100 and WONK=1 for a 70s feel). Use weights 800–900, tight leading (0.84–0.9), slight negative tracking.
- **Body and UI:** a characterful grotesque (Bricolage Grotesque, Space Grotesk, DM Sans).
- **Self-host:** fetch the css2 URL with a Chrome user agent, download the latin `woff2` files into `assets/`, keep the OFL licence in `brand/fonts/`, then map them onto the theme's `--font-*--family` variables in a head snippet (`razzy-head.liquid`).
- Pin variable axes in the css2 request (e.g. `SOFT,WONK@…,100,1`) to keep files small.

## Tokens
Put these in one global stylesheet:
- colours;
- display and body font stacks;
- `--ease` (`cubic-bezier(.16,1,.3,1)`) and `--spring` (`cubic-bezier(.34,1.56,.64,1)`);
- gutter and radius.

Buttons are pills with a fill that wipes up on hover. Chips are pill outlines.

## Logo files
- Keep the master SVG. Make cropped, transparent variants: accent-on-transparent for dark headers and base-on-transparent for light ones.
- Favicon: the wordmark's first letter on a rounded square in the base colour.

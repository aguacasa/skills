# Design system from a logo

## Palette
1. Start with supplied brand guidelines. When using the optional restrained-product preset, a logo's two colours can form a **hero pair** (e.g. a saturated base and a bright accent).
2. Add one **product colour** per product, sampled from the packaging or given by the owner.
3. Run `scripts/contrast.py <all colours> --text <accent> "#FFFFFF" "#05060B"` and record the results in `brand/README.md`.
4. Choose text per colour by brightness: dark colours take a light foreground with the accent for display type; mid and light colours take dark text everywhere. The reference snippet `demo-vars.liquid` does this in Liquid with `color_brightness` (more than 100 means dark text; more than 120 means the accent goes dark too).

## Type
- **Display:** follow the brand's personality and supplied font licenses. The demo uses expressive variable type, weights 800–900, tight leading (0.84–0.9), and slight negative tracking. Those are example values, not defaults for other brands; check clipping and readability.
- **Body and UI:** use the brand's readable body font. The demo's grotesque direction is one option, not a font requirement.
- **Self-host:** fetch the css2 URL with a Chrome user agent, download the latin `woff2` files into `assets/`, keep the OFL licence in `brand/fonts/`, then map them onto the theme's `--font-*--family` variables in a head snippet (`demo-head.liquid`).
- Pin variable axes in the css2 request (e.g. `SOFT,WONK@…,100,1`) to keep files small.

## Tokens
Put these in one global stylesheet:
- colours;
- display and body font stacks;
- `--ease` (`cubic-bezier(.16,1,.3,1)`) and `--spring` (`cubic-bezier(.34,1.56,.64,1)`);
- gutter and radius.

The demo uses pill buttons with a fill wipe and outlined chips. Other shapes and
hover treatments can fit the user's chosen brand. Preserve focus and disabled states.

## Logo files
- Keep the master SVG. Make cropped, transparent variants: accent-on-transparent for dark headers and base-on-transparent for light ones.
- Favicon: use a supplied icon or offer a legible monogram. A first letter on a rounded square is one option.

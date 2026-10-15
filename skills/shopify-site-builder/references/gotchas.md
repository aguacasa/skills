# Gotchas and fixes

## Shopify theme (Helio / Horizon family)
| Symptom | Cause | Fix |
|---|---|---|
| Page won't scroll on desktop; ScrollTrigger pins misfire | From 990px up the theme scrolls `.page-wrapper` and locks `html`/`body` (its "squeeze layout", which lets the cart drawer push the page aside) | Use the same scroller everywhere: `ScrollTrigger.defaults({ scroller })`, Lenis `{ wrapper, content }`. Rebuild on `matchMedia('(min-width: 990px)')` change. See `reference-implementation/src/demo/core.js`. |
| Section background colour ignored | Sections are forced transparent; a sibling `.section-background` paints the palette colour | Paint the section with a more specific selector: `.shopify-section:not(.header-section) .section.my-class { background: … }` |
| Absolutely positioned full-bleed element starts at the page gutter | `.section--page-width > *` puts every child in the centre grid column | Add `grid-column: 1 / -1` to that child |
| Lenis fights drawers and modals | The theme sets `[scroll-lock]` on `<html>` | Watch that attribute and call `lenis.stop()` / `lenis.start()` |
| `inline_asset_content` outputs a comment instead of the SVG | Asset size cap | `scripts/shrink-svg.py` |
| Template upload fails: "can't be greater than 100" | Range settings have max values (e.g. padding) | Stay within the schema's limits |
| Template upload fails: "does not refer to an existing section file" | The template synced before its new section | Re-save (`touch`) the template once the section exists |
| One product ignores the new product template | The product has a `templateSuffix` pointing at an old alternate template | Clear it: `productUpdate(templateSuffix: "")` |
| Theme colour variables need RGB triplets | The theme uses `--color-foreground-rgb: 71 0 121` | `color | color_to_rgb | remove: 'rgb(' | remove: ')' | replace: ',', ' '` |

## Animation and CSS
| Symptom | Cause | Fix |
|---|---|---|
| Descenders clipped on split headings | SplitText `mask: 'lines'` clips to the line box | `linesClass: 'my-line'`, then pad `.my-line-mask` and cancel it with negative margins |
| Cards flash black while scrolling | `gsap.to(el, { filter: 'brightness(.8)' })` from computed `none` starts at `brightness(0)` | Always `fromTo` with explicit start values for `filter` |
| Hover transform conflicts with GSAP transform | Both write `transform` | Use the individual `translate` / `rotate` properties for hover |
| Fixed intro overlay sits under the header | A parent with `isolation: isolate` traps its z-index | Don't isolate the section that holds fixed children |
| `mix-blend-mode` duotone does nothing | A transformed parent becomes the blend group with a transparent backdrop | Give that parent its own background colour |
| Ghost button text invisible on hover | A more specific rule pins the text colour to the hover fill colour | Set `--btn-fg` (the fill) and the hover text colour explicitly on that variant |
| WebGL textures blocked | Cross-origin images | Shopify's CDN sends `Access-Control-Allow-Origin: *`; set `loader.setCrossOrigin('anonymous')` |

## Tooling
| Symptom | Fix |
|---|---|
| `shopify theme pull` deletes local files | Always pass `--nodelete` when pulling into a repo with other files |
| CLI 401 "Service is not valid for authentication" | `shopify auth logout`, then rerun the command to get a new device code |
| CLI "SSL alert bad record mac" | Transient; rerun |
| Shell plugin update prompt eats the first character of a command typed into a new terminal | Prefix with `true; ` |
| Several agent sessions share one folder and switch branches | Use `git worktree add` for merges and deploys; never switch the shared checkout |
| `fileCreate` from a URL rejects the filename | The source URL has no file extension: omit `filename` and rename afterwards with `fileUpdate` |
| Shopify connector can't write legal policies | It lacks `write_legal_policies`, so give the owner paste-ready HTML for Settings → Policies |

# Restraint rules

A first build tends to be maximal, and the Razzy review rounds removed most of the decoration. Start from where they ended up.

## Keep
- **One hero "wow" per page.** On the homepage that's a 3D ring of the real product packaging orbiting the headline. On product pages it's one 3D product you can drag to spin.
- **Product colour blocks.** Full-bleed sections and panels in each product's packaging colour.
- **Scroll-driven sections** that pin and move sideways or tell a 3-step story, used sparingly (one or two per page).
- **Gradual transitions.** Fades and colour changes ease in and never snap.

## Never ship
- Eyebrow labels or small uppercase kickers above headings.
- Hollow, outlined "giant words" behind content.
- Floating debris or particles that aren't the product.
- Cursor followers, custom cursors or hover label pills.
- Hint text such as "Drag · Tap to open" or "Swipe to explore". An interaction must be obvious from how it looks.
- Text shadows or glows on display type. They create hard edges once SplitText masks lines.
- Decorative drips or blobs hanging from the header.
- Click-to-open or "reveal" gimmicks on the product model.
- Product links that duplicate a nav (e.g. every product listed in the footer).
- Animation that moves text under 3D objects. Text always wins: objects pass behind type, or around it.

## Readability checks (every review)
- Descenders and italics (y, g, p) are never clipped, on desktop and on a 390px phone.
- Body text contrast is at least 4.5:1 (`scripts/contrast.py`). Light product colours (coral, cyan, pink) get dark text.
- Buttons stay readable in every state: default, hover, focus and disabled.
- With reduced motion turned on, the page is still complete: static images replace the 3D, and nothing is hidden waiting for an animation.

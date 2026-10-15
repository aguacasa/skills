import { gsap, reducedMotion } from '../core.js';

/**
 * One-tap add to cart for any [data-rz-add] button (data-variant-id required).
 * Uses Shopify's standard cart action so Helio's cart drawer and cart count update
 * themselves; falls back to the AJAX cart and the /cart page.
 */
export function initAddToCart() {
  document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-rz-add]') : null;
    if (!button) return;
    event.preventDefault();
    if (button.dataset.state === 'loading') return;

    const variantId = button.dataset.variantId;
    button.dataset.state = 'loading';
    button.setAttribute('aria-busy', 'true');

    try {
      const actions = window.Shopify?.actions;
      if (actions?.updateCart) {
        const result = await actions.updateCart(
          { lines: [{ merchandiseId: variantId, quantity: 1 }] },
          { event: { context: 'standard-action' } }
        );
        if (result?.userErrors?.length) throw new Error(result.userErrors[0].message);
      } else {
        const root = window.Shopify?.routes?.root || '/';
        const response = await fetch(`${root}cart/add.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
        });
        if (!response.ok) throw new Error(`Add to cart failed (${response.status})`);
        window.location.href = `${root}cart`;
        return;
      }
      button.dataset.state = 'added';
      burst(button);
    } catch (error) {
      console.warn('[razzy] add to cart:', error);
      button.dataset.state = 'error';
    } finally {
      button.removeAttribute('aria-busy');
      setTimeout(() => {
        if (button.dataset.state !== 'loading') button.dataset.state = '';
      }, 2200);
    }
  });
}

/** Little strips that pop out of the button on success. */
function burst(button) {
  if (reducedMotion) return;
  const rect = button.getBoundingClientRect();
  const colors = [getComputedStyle(button).getPropertyValue('--rz-burst').trim() || '#CEFF65', '#ffffff', '#054FB8'];
  for (let i = 0; i < 14; i++) {
    const bit = document.createElement('span');
    bit.className = 'rz-burst';
    bit.style.background = colors[i % colors.length];
    bit.style.left = `${rect.left + rect.width / 2}px`;
    bit.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(bit);
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 60 + Math.random() * 70;
    gsap.fromTo(
      bit,
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20,
        rotate: (Math.random() - 0.5) * 360,
        scale: 0.4,
        opacity: 0,
        duration: 0.9 + Math.random() * 0.3,
        ease: 'expo.out',
        onComplete: () => bit.remove(),
      }
    );
  }
}

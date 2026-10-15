import Lenis from 'lenis';
import { gsap, ScrollTrigger, getScroller, reducedMotion } from '../core.js';

/** @type {Lenis | null} */
let lenis = null;
let tick = null;
let lockObserver = null;

/**
 * Inertial smooth scrolling (Lenis) on the theme's current scroll container, driven by GSAP's
 * ticker so ScrollTrigger stays in sync. Lenis moves the native scroll position, so sticky
 * elements, the theme's header logic and scroll restoration keep working.
 */
export function initSmoothScroll() {
  destroySmoothScroll();
  if (reducedMotion || window.Shopify?.designMode) return null;

  const scroller = getScroller();
  const options = {
    lerp: 0.1,
    smoothWheel: true,
    // Drawers, dialogs and other inner scrollers keep their native scrolling.
    prevent: (node) =>
      Boolean(node.closest?.('dialog, [role="dialog"], theme-drawer, [data-lenis-prevent], .predictive-search')),
  };
  if (scroller !== window) Object.assign(options, { wrapper: scroller, content: scroller });

  lenis = new Lenis(options);
  window.__rzLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener('refresh', resize);

  // The theme sets [scroll-lock] on <html> while a drawer or modal is open.
  const root = document.documentElement;
  const syncLock = () => (root.hasAttribute('scroll-lock') ? lenis?.stop() : lenis?.start());
  lockObserver = new MutationObserver(syncLock);
  lockObserver.observe(root, { attributes: true, attributeFilter: ['scroll-lock'] });
  return lenis;
}

function resize() {
  lenis?.resize();
}

export function destroySmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  ScrollTrigger.removeEventListener('refresh', resize);
  lockObserver?.disconnect();
  lenis.destroy();
  lenis = null;
  window.__rzLenis = null;
}

/** Smoothly scrolls the page to an element or a scroll offset, with or without Lenis. */
export function scrollToTarget(target, { duration = 1.4 } = {}) {
  if (lenis) return lenis.scrollTo(target, { duration });
  const scroller = getScroller();
  const container = scroller === window ? document.scrollingElement : scroller;
  const top =
    typeof target === 'number'
      ? target
      : target.getBoundingClientRect().top - (scroller === window ? 0 : container.getBoundingClientRect().top) + container.scrollTop;
  container.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
}

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  const hash = link?.getAttribute('href');
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  scrollToTarget(target);
});

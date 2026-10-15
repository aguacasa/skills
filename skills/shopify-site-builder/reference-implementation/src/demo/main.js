// Demo motion layer: smooth scroll, scroll-driven section animations, cursor and
// one-tap add to cart. Each Shopify section gets its own GSAP context so the theme
// editor can load and unload sections cleanly.
import { gsap, ScrollTrigger, getScroller, squeezeQuery } from './core.js';
import { initSmoothScroll } from './global/smooth-scroll.js';
import { initMagnetic, initReveals, initTilt } from './global/effects.js';
import { initAddToCart } from './global/cart.js';
import { initHero } from './sections/hero.js';
import { initTape } from './sections/tape.js';
import { initHow } from './sections/how.js';
import { initLineup } from './sections/lineup.js';
import { initStats } from './sections/stats.js';
import { initDay } from './sections/day.js';
import { initMood } from './sections/mood.js';
import { initBigmark } from './sections/bigmark.js';
import { initAccordion, initStage } from './sections/product.js';

const SECTIONS = [
  ['[data-rz-hero]', initHero],
  ['[data-rz-tape]', initTape],
  ['[data-rz-how]', initHow],
  ['[data-rz-lineup]', initLineup],
  ['[data-rz-stats]', initStats],
  ['[data-rz-day]', initDay],
  ['[data-rz-mood]', initMood],
  ['[data-rz-bigmark-section]', initBigmark],
  ['[data-rz-stage]', initStage],
  ['[data-rz-accordion]', initAccordion],
];

/** @type {Map<Element, {context: gsap.Context, cleanups: Function[]}>} */
const mounted = new Map();

function mount(wrapper) {
  if (mounted.has(wrapper)) return;
  const cleanups = [];
  const context = gsap.context((self) => {
    for (const [selector, init] of SECTIONS) {
      for (const element of wrapper.querySelectorAll(selector)) {
        const cleanup = init(element, self);
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      }
    }
    initReveals(wrapper);
    initTilt(wrapper);
    initMagnetic(wrapper);
  }, wrapper);
  mounted.set(wrapper, { context, cleanups });
}

function unmount(wrapper) {
  const entry = mounted.get(wrapper);
  if (!entry) return;
  entry.cleanups.forEach((cleanup) => cleanup());
  entry.context.revert();
  mounted.delete(wrapper);
}

/** (Re)builds smooth scrolling and every section's animations on the current scroll container. */
function mountAll() {
  ScrollTrigger.defaults({ scroller: getScroller() });
  initSmoothScroll();
  document.querySelectorAll('.shopify-section').forEach(mount);
  ScrollTrigger.refresh();
}

function boot() {
  document.documentElement.classList.add('rz-ready');
  initAddToCart();
  mountAll();

  // Crossing 990px swaps the theme's scroll container (window ↔ .page-wrapper); rebuild on it.
  squeezeQuery.addEventListener('change', () => {
    [...mounted.keys()].forEach(unmount);
    mountAll();
  });

  // Images and fonts change section heights; re-measure pins and triggers once they settle.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  document.addEventListener('shopify:section:load', (event) => {
    mount(event.target);
    ScrollTrigger.refresh();
  });
  document.addEventListener('shopify:section:unload', (event) => {
    unmount(event.target);
    ScrollTrigger.refresh();
  });
}

window.Demo = { version: 1 };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();

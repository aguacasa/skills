import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Helio's "squeeze layout": from 990px up, `.page-wrapper` is the page's scroll container (so
 * the cart drawer can push the page aside) and <html>/<body> don't scroll. Below that the
 * window scrolls. Mirrors assets/scroll-container.js.
 */
export const squeezeQuery = window.matchMedia('(min-width: 990px)');

/** @returns {HTMLElement | Window} */
export function getScroller() {
  return (squeezeQuery.matches && document.querySelector('.page-wrapper')) || window;
}
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let webglSupport;
export function supportsWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webglSupport = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

/** True when the device can comfortably run the layered (two-canvas) hero. */
export function isCapableDesktop() {
  const cores = navigator.hardwareConcurrency || 4;
  return window.matchMedia('(min-width: 900px)').matches && finePointer && cores >= 6;
}

let threeModule;
/** Lazily imports the three.js bundle (assets/demo-3d.js). */
export function loadThree() {
  threeModule ??= import(/* @vite-ignore */ window.DemoConfig?.threeUrl ?? './demo-3d.js');
  return threeModule;
}

/** Resolves when the browser is idle (or after `timeout` ms), so heavy work waits for first paint. */
export function whenIdle(timeout = 1200) {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 200);
  });
}

/** Reads the product colour variables a section rendered onto an element's style attribute. */
export function cssVar(element, name) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

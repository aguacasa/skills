import { gsap, reducedMotion } from '../core.js';

/** Count-up numbers for [data-rz-count] once they scroll into view. */
export function initStats(section) {
  if (reducedMotion) return;
  for (const element of gsap.utils.toArray('[data-rz-count]', section)) {
    const end = Number(element.dataset.rzCount) || 0;
    const counter = { value: 0 };
    element.textContent = '0';
    gsap.to(counter, {
      value: end,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      onUpdate: () => {
        element.textContent = Math.round(counter.value).toLocaleString();
      },
    });
  }
}

import { gsap, reducedMotion } from '../core.js';

/** Giant wordmark sign-off: letters bounce up when it scrolls in, then rise with the scroll. */
export function initBigmark(section) {
  if (reducedMotion) return;
  const mark = section.querySelector('[data-rz-bigmark]');
  if (!mark) return;
  const letters = mark.querySelectorAll('.rz-letter');

  gsap.from(letters, {
    yPercent: 110,
    rotate: (index) => (index % 2 ? 12 : -12),
    duration: 1.2,
    ease: 'back.out(1.6)',
    stagger: 0.07,
    scrollTrigger: { trigger: mark, start: 'top 92%', once: true },
  });
  gsap.fromTo(
    mark,
    { yPercent: 18 },
    { yPercent: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom bottom', scrub: true } }
  );
}

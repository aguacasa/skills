import { gsap, reducedMotion } from '../core.js';

/** Stacked sticky moment cards: each card sinks back and dims as the next one slides over it. */
export function initDay(section) {
  if (reducedMotion) return;
  const cards = gsap.utils.toArray('[data-rz-moment]', section);
  cards.forEach((card, index) => {
    const next = cards[index + 1];
    if (!next) return;
    // Explicit start values: tweening `filter` from the computed "none" would start at brightness(0).
    gsap.fromTo(
      card.querySelector('[data-rz-moment-inner]'),
      { scale: 1, rotate: 0, filter: 'brightness(1)' },
      {
        scale: 0.92,
        rotate: index % 2 ? 1.5 : -1.5,
        filter: 'brightness(0.78)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 20%', scrub: true },
      }
    );
  });

  // No hover on touch screens, so scroll reveals the full-colour photo instead.
  const media = gsap.matchMedia();
  media.add('(hover: none)', () => {
    for (const card of cards) {
      const color = card.querySelector('.rz-moment__color');
      if (!color) continue;
      gsap.fromTo(
        color,
        { opacity: 0 },
        { opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 70%', end: 'top 25%', scrub: true } }
      );
    }
  });

  for (const image of gsap.utils.toArray('[data-rz-parallax]', section)) {
    gsap.fromTo(
      image,
      { yPercent: -8 },
      { yPercent: 8, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  }
  return () => media.revert();
}

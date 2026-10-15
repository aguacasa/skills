import { gsap, ScrollTrigger, reducedMotion } from '../core.js';

/** Crossing marquee bands that speed up, reverse and skew with scroll velocity. */
export function initTape(section) {
  if (reducedMotion) return;
  const tracks = gsap.utils.toArray('[data-rz-tape-track]', section);
  const bands = gsap.utils.toArray('[data-rz-tape-band]', section);

  const tweens = tracks.map((track, index) => {
    const reverse = index % 2 === 1;
    return gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: Number(track.dataset.speed) || 26, ease: 'none', repeat: -1 }
    );
  });

  let target = 1;
  const skewTo = bands.map((band) => gsap.quickTo(band, 'skewX', { duration: 0.4, ease: 'power3' }));

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      target = self.direction * (1 + Math.min(Math.abs(velocity) / 350, 5));
      const skew = gsap.utils.clamp(-8, 8, velocity / -250);
      skewTo.forEach((to) => to(skew));
    },
  });

  const tick = () => {
    for (const tween of tweens) tween.timeScale(gsap.utils.interpolate(tween.timeScale(), target, 0.08));
    target = gsap.utils.interpolate(target, Math.sign(target) || 1, 0.03);
  };
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

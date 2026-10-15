import { gsap, ScrollTrigger, SplitText, finePointer, reducedMotion } from '../core.js';

/** Fade-up reveals for [data-rz-reveal] and word-by-word heading reveals for [data-rz-split]. */
export function initReveals(scope) {
  const items = gsap.utils.toArray('[data-rz-reveal]', scope);
  const headings = gsap.utils.toArray('[data-rz-split]', scope).filter((el) => !el.hasAttribute('data-rz-split-manual'));

  if (reducedMotion) {
    gsap.set(items, { clearProps: 'all', opacity: 1 });
    return;
  }

  if (items.length) {
    gsap.set(items, { y: 48, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });
  }

  for (const heading of headings) {
    SplitText.create(heading, {
      type: 'lines,words',
      mask: 'lines',
      linesClass: 'rz-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 115,
          rotate: 5,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        }),
    });
    heading.classList.add('is-split');
  }
}

/** Pointer-driven 3D tilt with a moving glare highlight, for [data-rz-tilt] cards. */
export function initTilt(scope) {
  if (!finePointer || reducedMotion) return;
  for (const card of gsap.utils.toArray('[data-rz-tilt]', scope)) {
    const strength = Number(card.dataset.rzTilt) || 12;
    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 900 });

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      rotateY((x - 0.5) * strength);
      rotateX((0.5 - y) * strength);
      card.style.setProperty('--rz-glare-x', `${x * 100}%`);
      card.style.setProperty('--rz-glare-y', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      rotateX(0);
      rotateY(0);
    });
  }
}

/** Buttons that lean toward the pointer, for [data-rz-magnetic]. */
export function initMagnetic(scope) {
  if (!finePointer || reducedMotion) return;
  for (const element of gsap.utils.toArray('[data-rz-magnetic]', scope)) {
    const moveX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width / 2) * 0.35);
      moveY((event.clientY - rect.top - rect.height / 2) * 0.35);
    });
    element.addEventListener('pointerleave', () => {
      moveX(0);
      moveY(0);
    });
  }
}

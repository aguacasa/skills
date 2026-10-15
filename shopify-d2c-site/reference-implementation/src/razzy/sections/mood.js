import { gsap, reducedMotion } from '../core.js';

/**
 * "How do you want to feel?" picker. Choosing a mood floods the stage with that product's
 * colour from the point you clicked and springs the matching tin into view.
 */
export function initMood(section) {
  const buttons = gsap.utils.toArray('[data-rz-mood]', section);
  const results = gsap.utils.toArray('[data-rz-result]', section);
  const stage = section.querySelector('[data-rz-mood-stage]');
  const flood = section.querySelector('[data-rz-flood]');
  if (!buttons.length || !stage) return;

  let current = Math.max(0, buttons.findIndex((button) => button.getAttribute('aria-pressed') === 'true'));

  const show = (index, origin) => {
    if (index === current) return;
    const button = buttons[index];
    const previous = results[current];
    const next = results[index];
    const vars = button.dataset.vars;
    const rect = stage.getBoundingClientRect();
    const x = origin ? origin.x - rect.left : rect.width / 2;
    const y = origin ? origin.y - rect.top : rect.height / 2;

    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
    current = index;

    if (reducedMotion) {
      stage.setAttribute('style', vars);
      previous.hidden = true;
      next.hidden = false;
      return;
    }

    flood.setAttribute('style', vars);
    gsap.killTweensOf(flood);
    gsap.fromTo(
      flood,
      { clipPath: `circle(0% at ${x}px ${y}px)` },
      {
        clipPath: `circle(150% at ${x}px ${y}px)`,
        duration: 0.95,
        ease: 'expo.inOut',
        onComplete: () => {
          stage.setAttribute('style', vars);
          gsap.set(flood, { clipPath: 'circle(0% at 50% 50%)' });
        },
      }
    );

    gsap.to(previous, {
      opacity: 0,
      y: -24,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        previous.hidden = true;
        gsap.set(previous, { clearProps: 'opacity,transform' });
      },
    });
    next.hidden = false;
    gsap.fromTo(next.querySelectorAll('[data-rz-result-text]'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.35 });
    gsap.fromTo(
      next.querySelector('[data-rz-result-art]'),
      { scale: 0.3, rotate: -35, yPercent: 40, opacity: 0 },
      { scale: 1, rotate: 0, yPercent: 0, opacity: 1, duration: 1.3, ease: 'elastic.out(1, 0.55)', delay: 0.25 }
    );
  };

  buttons.forEach((button, index) =>
    button.addEventListener('click', (event) => {
      const fromPointer = event.detail > 0;
      const buttonRect = button.getBoundingClientRect();
      show(index, fromPointer ? { x: event.clientX, y: event.clientY } : { x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 });
    })
  );
}

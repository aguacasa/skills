import {
  gsap,
  ScrollTrigger,
  SplitText,
  isCapableDesktop,
  loadThree,
  reducedMotion,
  supportsWebGL,
  whenIdle,
} from '../core.js';

const INTRO_KEY = 'rz-intro-seen';

/** Wordmark intro: letters pop up, then the blue curtain lifts. Once per browser session. */
function playIntro(section) {
  const intro = section.querySelector('[data-rz-intro]');
  if (!intro) return Promise.resolve();

  let seen = false;
  try {
    seen = sessionStorage.getItem(INTRO_KEY) === '1';
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // Storage can be unavailable (private mode); just play it.
  }
  if (seen || reducedMotion || window.Shopify?.designMode) {
    intro.remove();
    return Promise.resolve();
  }

  const letters = intro.querySelectorAll('.rz-letter');
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => intro.remove() })
      .from(letters, { yPercent: 130, rotate: 14, duration: 0.85, ease: 'expo.out', stagger: 0.07 })
      .to(letters, { yPercent: -130, rotate: -10, duration: 0.55, ease: 'expo.in', stagger: 0.04 }, '+=0.2')
      .to(intro, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut', onStart: resolve }, '-=0.3');
  });
}

async function mountScene(section, stage, context, titleRevealed) {
  if (reducedMotion || !supportsWebGL()) return null;
  const data = JSON.parse(section.querySelector('[data-rz-hero-data]')?.textContent || '{}');
  if (!data.products?.length) return null;

  await whenIdle();
  await document.fonts?.ready;
  const { mountHero } = await loadThree();
  if (!section.isConnected) return null;

  const controller = mountHero(stage, {
    products: data.products,
    dual: isCapableDesktop(),
    interactive: section,
    occluder: section.querySelector('[data-rz-hero-title]'),
  });
  context.add(() => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => controller.setProgress(self.progress),
    });
  });
  // The ring fades in only after the headline has landed, so it never shows ahead of the type.
  titleRevealed.then(() => requestAnimationFrame(() => section.classList.add('is-3d-ready')));
  return controller;
}

export function initHero(section, context) {
  const title = section.querySelector('[data-rz-hero-title]');
  const stage = section.querySelector('[data-rz-hero-stage]');
  const content = section.querySelectorAll('[data-rz-hero-inner]');
  let controller = null;
  let destroyed = false;

  const introDone = playIntro(section);
  let revealTitle = () => {};
  const titleRevealed = new Promise((resolve) => {
    revealTitle = resolve;
  });

  if (!reducedMotion && title) {
    SplitText.create(title, {
      type: 'lines,words,chars',
      mask: 'lines',
      linesClass: 'rz-line',
      autoSplit: true,
      onSplit: (self) => {
        title.classList.add('is-split');
        const timeline = gsap.timeline({ paused: true, onComplete: revealTitle });
        timeline
          .from(self.chars, { yPercent: 120, rotate: 10, duration: 1.1, ease: 'expo.out', stagger: 0.018 })
          .from(
            section.querySelectorAll('[data-rz-hero-fade]'),
            { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 },
            '-=0.8'
          );
        introDone.then(() => timeline.play());
        return timeline;
      },
    });

    gsap.to(content, {
      yPercent: -22,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });
  } else {
    title?.classList.add('is-split');
    revealTitle();
  }

  mountScene(section, stage, context, titleRevealed)
    .then((result) => {
      controller = result;
      if (destroyed) controller?.destroy();
      else if (!result) section.classList.add('is-fallback');
    })
    .catch(() => section.classList.add('is-fallback'));

  return () => {
    destroyed = true;
    controller?.destroy();
  };
}

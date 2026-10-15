import { gsap, ScrollTrigger, loadThree, reducedMotion, supportsWebGL } from '../core.js';

/**
 * Product media stage: a 3D tin you can drag to spin, plus thumbnails that swap the stage to the product photos.
 */
export function initStage(stage) {
  const views = gsap.utils.toArray('[data-rz-view]', stage);
  const thumbs = gsap.utils.toArray('[data-rz-thumb]', stage);
  const canvasHost = stage.querySelector('[data-rz-stage-canvas]');
  const data = JSON.parse(stage.querySelector('[data-rz-stage-data]')?.textContent || '{}');
  let controller = null;
  let destroyed = false;

  const show = (id) => {
    let active = null;
    for (const view of views) {
      const on = view.dataset.rzView === id;
      view.hidden = !on;
      if (on) active = view;
    }
    thumbs.forEach((thumb) => thumb.setAttribute('aria-pressed', String(thumb.dataset.rzThumb === id)));
    if (active && !reducedMotion) gsap.fromTo(active, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
  };
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => show(thumb.dataset.rzThumb)));

  if (reducedMotion || !supportsWebGL() || !canvasHost) {
    stage.classList.add('is-static');
    return;
  }

  loadThree().then(async ({ mountTinStage }) => {
    await document.fonts?.ready;
    if (destroyed || !stage.isConnected) return;
    controller = mountTinStage(canvasHost, { product: data });
    stage.classList.add('is-3d-ready');
  });

  return () => {
    destroyed = true;
    controller?.destroy();
  };
}

/** Smooth open/close for <details class="rz-acc"> rows inside [data-rz-accordion]. */
export function initAccordion(section) {
  for (const details of section.querySelectorAll('details.rz-acc')) {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.rz-acc__content');
    if (!summary || !content) continue;

    summary.addEventListener('click', (event) => {
      if (reducedMotion) return;
      event.preventDefault();
      gsap.killTweensOf(content);
      if (details.open) {
        details.classList.remove('is-open');
        gsap.to(content, {
          height: 0,
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => {
            details.open = false;
            gsap.set(content, { clearProps: 'height' });
            ScrollTrigger.refresh();
          },
        });
      } else {
        details.open = true;
        details.classList.add('is-open');
        gsap.fromTo(
          content,
          { height: 0 },
          {
            height: 'auto',
            duration: 0.6,
            ease: 'expo.out',
            onComplete: () => {
              gsap.set(content, { clearProps: 'height' });
              ScrollTrigger.refresh();
            },
          }
        );
      }
    });
  }
}

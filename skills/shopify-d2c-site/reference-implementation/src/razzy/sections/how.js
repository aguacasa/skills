import { gsap, ScrollTrigger, loadThree, reducedMotion, supportsWebGL } from '../core.js';

/**
 * Pinned "Peel → Place → Dissolve" story. Scroll progress drives the 3D strip, the active
 * step and the tongue photo reveal (via the --rz-how-p custom property).
 */
export function initHow(section, context) {
  const steps = gsap.utils.toArray('[data-rz-step]', section);
  const stage = section.querySelector('[data-rz-how-stage]');
  let controller = null;
  let destroyed = false;
  let progress = 0;

  const setStep = (value) => {
    const active = value < 0.3 ? 0 : value < 0.62 ? 1 : 2;
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === active);
      step.classList.toggle('is-done', index < active);
    });
  };
  setStep(0);

  if (reducedMotion) {
    section.classList.add('is-static');
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * 2.4}`,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      progress = self.progress;
      section.style.setProperty('--rz-how-p', progress.toFixed(4));
      setStep(progress);
      controller?.setProgress(progress);
    },
  });

  if (stage && supportsWebGL()) {
    loadThree().then(async ({ mountDissolve }) => {
      await document.fonts?.ready;
      if (destroyed || !section.isConnected) return;
      const styles = getComputedStyle(section);
      controller = mountDissolve(stage, {
        edge: styles.getPropertyValue('--rz-how-edge').trim() || '#CEFF65',
        particles: styles.getPropertyValue('--rz-how-edge').trim() || '#CEFF65',
      });
      controller.setProgress(progress);
      section.classList.add('is-3d-ready');
    });
  }

  return () => {
    destroyed = true;
    controller?.destroy();
  };
}

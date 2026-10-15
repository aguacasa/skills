import { gsap } from '../core.js';
import { scrollToTarget } from '../global/smooth-scroll.js';

/**
 * Seven full-bleed product panels. The section pins and vertical scrolling drives the row
 * sideways (with parallax on each panel's tins); with reduced motion it is a native
 * swipeable row.
 */
export function initLineup(section) {
  const viewport = section.querySelector('[data-rz-lineup-viewport]');
  const track = section.querySelector('[data-rz-track]');
  const panels = gsap.utils.toArray('[data-rz-panel]', section);
  const dots = gsap.utils.toArray('[data-rz-dot]', section);
  if (!track || !panels.length) return;

  const setActive = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    section.style.setProperty('--rz-active', panels[index]?.style.getPropertyValue('--rz-c') || '');
  };
  setActive(0);

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-pinned');
    const distance = () => track.scrollWidth - viewport.clientWidth;
    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.round(self.progress * (panels.length - 1))),
      },
    });

    for (const panel of panels) {
      const art = panel.querySelector('[data-rz-art]');
      const scrollTrigger = { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true };
      if (art) gsap.fromTo(art, { rotate: 9, yPercent: 8 }, { rotate: -7, yPercent: -6, ease: 'none', scrollTrigger });
    }

    dots.forEach((dot, index) =>
      dot.addEventListener('click', () => {
        const trigger = slide.scrollTrigger;
        scrollToTarget(trigger.start + (trigger.end - trigger.start) * (index / (panels.length - 1)), { duration: 1.2 });
      })
    );

    return () => section.classList.remove('is-pinned');
  });

  media.add('(prefers-reduced-motion: reduce)', () => {
    const onScroll = () => {
      const index = Math.round(viewport.scrollLeft / (panels[0].offsetWidth || 1));
      setActive(Math.min(panels.length - 1, Math.max(0, index)));
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    dots.forEach((dot, index) =>
      dot.addEventListener('click', () => panels[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }))
    );
    return () => viewport.removeEventListener('scroll', onScroll);
  });

  return () => media.revert();
}

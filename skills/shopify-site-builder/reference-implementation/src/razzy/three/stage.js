import { DirectionalLight, Group, HemisphereLight, PerspectiveCamera, Scene, TextureLoader } from 'three';
import { createEnvironment, createLoop, createRenderer, disposeTree } from './shared.js';
import { createMetal, createTin, tinGeometries } from './tin.js';

/**
 * Product page stage: one tin that floats, follows the pointer and spins when dragged.
 *
 * @param {HTMLElement} container element the canvas fills
 * @param {{product: {color: string, label?: string}}} options
 */
export function mountTinStage(container, { product }) {
  const renderer = createRenderer(container, { maxPixelRatio: 2 });
  const environment = createEnvironment(renderer);
  const scene = new Scene();
  scene.environment = environment;
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);

  scene.add(new HemisphereLight('#ffffff', '#1b1d4a', 0.7));
  const key = new DirectionalLight('#ffffff', 1.8);
  key.position.set(3, 4, 6);
  const rim = new DirectionalLight('#CEFF65', 1.2);
  rim.position.set(-4, 2, -3);
  scene.add(key, rim);

  const loader = new TextureLoader();
  loader.setCrossOrigin('anonymous');
  const tin = createTin(tinGeometries(), createMetal(), product, loader, renderer.capabilities.getMaxAnisotropy());
  const spinner = new Group();
  const tilt = new Group();
  tilt.add(tin);
  spinner.add(tilt);
  scene.add(spinner);

  let cameraZ = 4.4;
  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    camera.aspect = width / height;
    cameraZ = camera.aspect < 0.85 ? 5.4 : 4.4;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const drag = { id: null, startX: 0, startY: 0, lastX: 0, horizontal: null };
  let yaw = 0;
  let yawVelocity = 0;

  const onPointerMove = (event) => {
    const rect = container.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    if (drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.lastX;
    if (drag.horizontal === null) {
      const totalX = Math.abs(event.clientX - drag.startX);
      const totalY = Math.abs(event.clientY - drag.startY);
      if (totalX + totalY > 6) drag.horizontal = totalX >= totalY;
    }
    // Vertical swipes on touch screens scroll the page instead of spinning the tin.
    if (drag.horizontal === false) return;
    drag.lastX = event.clientX;
    yaw += dx * 0.012;
    yawVelocity = dx * 0.6;
  };
  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    drag.id = event.pointerId;
    drag.startX = drag.lastX = event.clientX;
    drag.startY = event.clientY;
    drag.horizontal = null;
  };
  const onPointerUp = (event) => {
    if (drag.id !== event.pointerId) return;
    drag.id = null;
  };
  const onPointerLeave = () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  };
  container.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  container.addEventListener('pointerleave', onPointerLeave);

  const stopLoop = createLoop(container, (dt, time) => {
    pointer.x += (pointer.targetX - pointer.x) * 0.06;
    pointer.y += (pointer.targetY - pointer.y) * 0.06;

    if (drag.id === null) {
      yaw += yawVelocity * dt;
      yawVelocity *= 0.94;
    }

    spinner.rotation.y = yaw + Math.sin(time * 0.45) * 0.32 + pointer.x * 0.25;
    tilt.rotation.x = Math.sin(time * 0.6) * 0.05 + pointer.y * 0.12;
    tin.position.y = Math.sin(time * 0.9) * 0.04;

    camera.position.set(0, 0.15, cameraZ);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });

  return {
    destroy() {
      stopLoop();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      disposeTree(scene);
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

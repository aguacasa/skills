import { DirectionalLight, Group, HemisphereLight, PerspectiveCamera, Scene, TextureLoader, Vector3 } from 'three';
import { TAU, clamp01, createEnvironment, createLoop, createRenderer, disposeTree } from './shared.js';
import { createMetal, createTin, tinGeometries } from './tin.js';

/**
 * Seven tins orbiting the hero headline. With `dual`, objects nearer the camera than the
 * ring's center draw on a second canvas stacked above the HTML headline, so tins pass in
 * front of and behind the type.
 *
 * @param {HTMLElement} container element holding [data-rz-layer="back"|"front"] slots
 * @param {{products: Array<{title: string, url: string, color: string, label?: string}>, dual?: boolean, interactive?: HTMLElement}} options
 */
export function mountHero(container, { products, dual = true, interactive = container, occluder = null }) {
  const backRenderer = createRenderer(container.querySelector('[data-rz-layer="back"]'));
  const frontRenderer = dual
    ? createRenderer(container.querySelector('[data-rz-layer="front"]'))
    : null;
  const backEnvironment = createEnvironment(backRenderer);
  const frontEnvironment = frontRenderer ? createEnvironment(frontRenderer) : null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  scene.add(new HemisphereLight('#ffffff', '#1b1d4a', 0.7));
  const key = new DirectionalLight('#ffffff', 1.7);
  key.position.set(3, 4, 6);
  const rim = new DirectionalLight('#CEFF65', 1.4);
  rim.position.set(-5, 2, -3);
  scene.add(key, rim);

  const ring = new Group();
  scene.add(ring);

  const loader = new TextureLoader();
  loader.setCrossOrigin('anonymous');
  const anisotropy = backRenderer.capabilities.getMaxAnisotropy();
  const tinGeometry = tinGeometries();
  const metal = createMetal();

  const tins = products.map((product, index) => {
    const tin = createTin(tinGeometry, metal, product, loader, anisotropy);
    tin.userData = { product, angle: (index / products.length) * TAU, phase: index * 1.7 };
    ring.add(tin);
    return tin;
  });

  const layered = tins;
  const layout = { radius: 2.8, depth: 0.55, offsetY: 0, tinScale: 0.72, cameraZ: 8.4, cameraY: 0.3, lookY: 0, tilt: 0.3 };

  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const aspect = width / height;
    const portrait = aspect < 0.9;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    backRenderer.setSize(width, height);
    frontRenderer?.setSize(width, height);

    // Desktop: a wide, shallow ring that weaves through the headline. Portrait: a smaller ring
    // above the text.
    layout.radius = portrait ? 1.6 : Math.min(3.15, 1.9 * aspect);
    layout.depth = portrait ? 1.35 : 0.8;
    layout.offsetY = portrait ? 0.1 : 0.24;
    layout.tinScale = portrait ? 0.56 : 0.72;
    layout.cameraZ = portrait ? 10.5 : 8.4;
    layout.cameraY = portrait ? 0.2 : 0.3;
    layout.lookY = portrait ? 0 : 0;
    layout.tilt = portrait ? 0.95 : 0.56;
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // Pointer: parallax everywhere and drag to spin (mouse only). The tins are decorative.
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const drag = { down: false, lastX: 0 };
  let spin = 0;
  let spinVelocity = 0.16;
  let progress = 0;
  let smoothProgress = 0;

  const isControl = (target) => target instanceof Element && target.closest('a, button, input, select, textarea, label');

  const onPointerMove = (event) => {
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointer.targetX = x * 2 - 1;
    pointer.targetY = y * 2 - 1;

    if (drag.down) {
      const dx = event.clientX - drag.lastX;
      drag.lastX = event.clientX;
      spin += dx * 0.006;
      spinVelocity = dx * 0.4;
    }
  };
  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || isControl(event.target)) return;
    drag.down = true;
    drag.lastX = event.clientX;
  };
  const onPointerUp = () => {
    drag.down = false;
  };
  const onPointerLeave = () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    drag.down = false;
  };
  interactive.addEventListener('pointermove', onPointerMove, { passive: true });
  interactive.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  interactive.addEventListener('pointerleave', onPointerLeave);

  const worldPosition = new Vector3();
  const edgePoint = new Vector3();

  /**
   * A tin draws on the front canvas only while it is nearer than the ring's centre AND its
   * whole silhouette is below the headline (`occluder`), so it never switches layers while
   * overlapping the type.
   */
  function isInFront(tin, occluderBottom) {
    tin.getWorldPosition(worldPosition);
    if (worldPosition.z <= 0.15) return false;
    if (occluderBottom === null) return true;
    edgePoint.copy(worldPosition);
    edgePoint.y += 0.75 * tin.scale.y; // half the tin plus a margin for its tilt
    edgePoint.project(camera);
    const topPx = ((1 - edgePoint.y) / 2) * container.clientHeight;
    return topPx > occluderBottom;
  }

  function render() {
    if (!frontRenderer) {
      scene.environment = backEnvironment;
      backRenderer.render(scene, camera);
      return;
    }
    let occluderBottom = null;
    if (occluder) {
      const rect = occluder.getBoundingClientRect();
      occluderBottom = rect.bottom - container.getBoundingClientRect().top;
    }
    for (const object of layered) {
      object.userData.front = isInFront(object, occluderBottom);
    }
    for (const object of layered) object.visible = !object.userData.front;
    scene.environment = backEnvironment;
    backRenderer.render(scene, camera);
    for (const object of layered) object.visible = object.userData.front;
    scene.environment = frontEnvironment;
    frontRenderer.render(scene, camera);
    for (const object of layered) object.visible = true;
  }

  const stopLoop = createLoop(container, (dt, time) => {
    pointer.x += (pointer.targetX - pointer.x) * 0.06;
    pointer.y += (pointer.targetY - pointer.y) * 0.06;
    smoothProgress += (progress - smoothProgress) * 0.1;
    const p = smoothProgress;

    // Drag momentum eases back to a slow idle spin.
    if (!drag.down) spinVelocity += (0.16 - spinVelocity) * 0.035;
    spin += spinVelocity * dt;

    ring.rotation.x = layout.tilt + pointer.y * 0.16 - p * 0.4;
    ring.rotation.z = -0.1 + pointer.x * 0.06;
    ring.position.y = layout.offsetY + p * 0.9;
    const radius = layout.radius * (1 + p * 0.85);

    for (const tin of tins) {
      const data = tin.userData;
      const angle = data.angle + spin + p * 1.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * layout.depth;
      tin.position.set(x, Math.sin(time * 0.8 + data.phase) * 0.12, z);
      // Turn each tin roughly toward the camera so its label stays readable as it orbits.
      const yaw = Math.atan2(-x, layout.cameraZ - z) * 0.85;
      // Counter the ring's tilt so labels face the viewer rather than the sky.
      tin.rotation.set(
        -ring.rotation.x * 0.85 + Math.sin(time * 0.5 + data.phase) * 0.12,
        yaw + Math.sin(time * 0.6 + data.phase) * 0.18 + pointer.x * 0.25,
        Math.sin(time * 0.4 + data.phase) * 0.08
      );
      tin.scale.setScalar(layout.tinScale * (1 - p * 0.12));
    }

    camera.position.set(pointer.x * 0.25, layout.cameraY - pointer.y * 0.15, layout.cameraZ - p * 1.4);
    camera.lookAt(0, layout.lookY + p * 0.5, 0);
    render();
  });

  return {
    setProgress(value) {
      progress = clamp01(value);
    },
    destroy() {
      stopLoop();
      resizeObserver.disconnect();
      interactive.removeEventListener('pointermove', onPointerMove);
      interactive.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      interactive.removeEventListener('pointerleave', onPointerLeave);
      disposeTree(scene);
      backEnvironment.dispose();
      frontEnvironment?.dispose();
      for (const renderer of [backRenderer, frontRenderer]) {
        if (!renderer) continue;
        renderer.dispose();
        renderer.domElement.remove();
      }
    },
  };
}

import {
  CanvasTexture,
  NeutralToneMapping,
  PMREMGenerator,
  SRGBColorSpace,
  Shape,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const TAU = Math.PI * 2;

export const clamp01 = (value) => Math.min(1, Math.max(0, value));

/** Smoothstep easing on a 0–1 input, clamped. */
export const ease = (value) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

/**
 * Rounded rectangle centered on the origin. Quadratic corners read as the soft
 * "squircle" corners of the Razzy tin and sachets.
 */
export function roundedRect(width, height, radius) {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/** ShapeGeometry UVs default to raw positions; map them to 0–1 across the bounding box. */
export function normalizeUVs(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (position.getX(i) - min.x) / (max.x - min.x), (position.getY(i) - min.y) / (max.y - min.y));
  }
  uv.needsUpdate = true;
  return geometry;
}

export function createRenderer(parent, { maxPixelRatio = 1.75 } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  parent.appendChild(renderer.domElement);
  return renderer;
}

/** Studio-style reflections so the black tins read as metal. One per renderer (GL context). */
export function createEnvironment(renderer) {
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, 0.04).texture;
  room.dispose?.();
  pmrem.dispose();
  return texture;
}

/** Black sachet face printed with "ORAL STRIP", drawn with the site's own font. */
export function sachetTexture({ accent = '#CEFF65', size = 512 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d');
  const s = size / 512;

  g.fillStyle = '#131316';
  g.fillRect(0, 0, size, size);
  const sheen = g.createLinearGradient(0, 0, size, size);
  sheen.addColorStop(0, 'rgba(255,255,255,0.10)');
  sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(255,255,255,0.06)');
  g.fillStyle = sheen;
  g.fillRect(0, 0, size, size);

  g.fillStyle = '#ffffff';
  g.font = `800 ${118 * s}px "Razzy Sans", system-ui, sans-serif`;
  g.fillText('ORAL', 50 * s, 236 * s);
  g.fillText('STRIP', 50 * s, 350 * s);
  g.fillStyle = accent;
  g.fillRect(52 * s, 384 * s, 110 * s, 10 * s);
  g.font = `700 ${34 * s}px "Razzy Sans", system-ui, sans-serif`;
  g.fillText('RAZZY', 52 * s, 448 * s);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Runs `frame` on requestAnimationFrame only while `element` is on screen and the tab is visible. */
export function createLoop(element, frame) {
  let raf = 0;
  let onScreen = false;
  let last = performance.now();

  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame(dt, now / 1000);
  };
  const update = () => {
    const shouldRun = onScreen && !document.hidden;
    if (shouldRun && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', update);

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    observer.disconnect();
    document.removeEventListener('visibilitychange', update);
  };
}

/** Disposes every geometry, material and texture under `root`. */
export function disposeTree(root) {
  root.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value && value.isTexture) value.dispose();
      }
      if (material.uniforms) {
        for (const uniform of Object.values(material.uniforms)) uniform.value?.isTexture && uniform.value.dispose();
      }
      material.dispose();
    }
  });
}

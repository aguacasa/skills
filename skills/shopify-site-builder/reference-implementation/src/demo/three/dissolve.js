import {
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  ShapeGeometry,
} from 'three';
import {
  clamp01,
  createEnvironment,
  createLoop,
  createRenderer,
  disposeTree,
  ease,
  normalizeUVs,
  roundedRect,
  sachetTexture,
} from './shared.js';

const STRIP = { width: 1, height: 0.7, radius: 0.06 };
const EDGE_WIDTH = 0.08;

// Value noise + fBm, mirrored in JS below so particles leave the strip where it dissolves.
const NOISE_GLSL = /* glsl */ `
  float rzHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float rzNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(rzHash(i), rzHash(i + vec2(1.0, 0.0)), u.x), mix(rzHash(i + vec2(0.0, 1.0)), rzHash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float rzFbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) { value += amplitude * rzNoise(p); p *= 2.0; amplitude *= 0.5; }
    return clamp((value - 0.15) / 0.7, 0.0, 1.0);
  }
`;

const fract = (x) => x - Math.floor(x);
const hash = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
function noise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * ux;
  const b = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * ux;
  return a + (b - a) * uy;
}
function fbm(x, y) {
  let value = 0;
  let amplitude = 0.5;
  for (let i = 0; i < 5; i++) {
    value += amplitude * noise(x, y);
    x *= 2;
    y *= 2;
    amplitude *= 0.5;
  }
  return clamp01((value - 0.15) / 0.7);
}

const BEND_GLSL = /* glsl */ `
  // Curls the strip around its vertical axis, like it is resting on a tongue.
  vec3 rzBend(vec3 p, float bend) { p.z -= bend * 0.55 * p.x * p.x; return p; }
`;

function stripMaterial(uniforms) {
  return new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uBend;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPosition;
      ${BEND_GLSL}
      void main() {
        vUv = uv;
        vec3 p = rzBend(position, uBend);
        p.z += sin(p.x * 3.0 + uTime * 1.4) * 0.012 + sin(p.y * 4.0 + uTime) * 0.008;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vViewPosition = -mv.xyz;
        vNormalView = normalize(normalMatrix * normalize(vec3(uBend * 1.1 * position.x, 0.0, 1.0)));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uProgress;
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uFilm;
      uniform vec3 uEdge;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPosition;
      ${NOISE_GLSL}
      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main() {
        vec2 world = (vUv - 0.5) * vec2(${STRIP.width.toFixed(2)}, ${STRIP.height.toFixed(2)});
        if (roundedBox(world, vec2(${(STRIP.width / 2).toFixed(3)}, ${(STRIP.height / 2).toFixed(3)}), ${STRIP.radius.toFixed(3)}) > 0.0) discard;

        float n = rzFbm(vUv * vec2(6.0, 4.2) + 3.0);
        float threshold = uProgress * (1.0 + ${EDGE_WIDTH.toFixed(2)});
        if (n < threshold - ${EDGE_WIDTH.toFixed(2)}) discard;
        float edge = 1.0 - smoothstep(threshold - ${EDGE_WIDTH.toFixed(2)}, threshold, n);

        vec3 normal = normalize(vNormalView);
        vec3 view = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(normal, view)), 2.0);
        vec3 color = uFilm + fresnel * 0.35;
        color += 0.07 * vec3(
          sin(vUv.x * 12.0 + uTime),
          sin(vUv.y * 10.0 + uTime * 1.3 + 2.0),
          sin((vUv.x + vUv.y) * 8.0 + 4.0)
        );
        color = mix(color, uEdge, edge);
        float alpha = mix(0.72 + fresnel * 0.25, 1.0, edge) * uOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function particleMaterial(uniforms) {
  return new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uProgress;
      uniform float uBend;
      uniform float uSize;
      attribute float aSeed;
      attribute vec3 aDrift;
      varying float vAlpha;
      ${BEND_GLSL}
      void main() {
        float threshold = uProgress * (1.0 + ${EDGE_WIDTH.toFixed(2)});
        float life = clamp((threshold - aSeed) / 0.45, 0.0, 1.0);
        vec3 p = rzBend(position, uBend);
        vec3 drift = aDrift * life;
        drift.y += life * life * 1.4;
        drift.x += sin(life * 6.0 + aSeed * 20.0) * 0.08 * life;
        p += drift;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (1.0 - life * 0.6) / -mv.z;
        vAlpha = life > 0.0 ? (1.0 - life) * smoothstep(0.0, 0.06, life) : 0.0;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, (1.0 - smoothstep(0.15, 0.5, d)) * vAlpha);
      }
    `,
  });
}

/**
 * Scroll-driven "how it works" scene: a strip slides out of its sachet (peel), curls toward
 * the viewer (place), then dissolves into rising particles (dissolve). Drive it with setProgress(0–1).
 */
export function mountDissolve(container, { film = '#EAF7A8', edge = '#CEFF65', particles = '#CEFF65' } = {}) {
  const renderer = createRenderer(container, { maxPixelRatio: 2 });
  const environment = createEnvironment(renderer);
  const scene = new Scene();
  scene.environment = environment;
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 5.2);

  scene.add(new HemisphereLight('#ffffff', '#2a0a4a', 0.8));
  const key = new DirectionalLight('#ffffff', 1.6);
  key.position.set(2, 3, 5);
  scene.add(key);

  const rig = new Group();
  scene.add(rig);

  // Sachet
  const sachet = new Group();
  const sachetMaterial = new MeshPhysicalMaterial({ color: '#141416', metalness: 0.35, roughness: 0.42, clearcoat: 0.8, transparent: true });
  const faceMaterial = new MeshPhysicalMaterial({ map: sachetTexture({ accent: edge }), roughness: 0.4, clearcoat: 0.8, transparent: true });
  sachet.add(
    new Mesh(
      new ExtrudeGeometry(roundedRect(1.3, 1.3, 0.22), {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 16,
      }),
      sachetMaterial
    ),
    new Mesh(normalizeUVs(new ShapeGeometry(roundedRect(1.26, 1.26, 0.21), 16)).translate(0, 0, 0.051), faceMaterial)
  );
  rig.add(sachet);

  // Strip film
  const stripUniforms = {
    uProgress: { value: 0 },
    uBend: { value: 0 },
    uTime: { value: 0 },
    uOpacity: { value: 1 },
    uFilm: { value: new Color(film) },
    uEdge: { value: new Color(edge) },
  };
  const strip = new Mesh(new PlaneGeometry(STRIP.width, STRIP.height, 64, 40), stripMaterial(stripUniforms));
  rig.add(strip);

  // Particles share the strip's transform and are seeded with the same noise as its dissolve.
  const count = 1600;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const drifts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    positions[i * 3] = (u - 0.5) * STRIP.width;
    positions[i * 3 + 1] = (v - 0.5) * STRIP.height;
    positions[i * 3 + 2] = 0;
    seeds[i] = fbm(u * 6 + 3, v * 4.2 + 3);
    drifts[i * 3] = (Math.random() - 0.5) * 0.9;
    drifts[i * 3 + 1] = Math.random() * 0.5;
    drifts[i * 3 + 2] = (Math.random() - 0.2) * 0.8;
  }
  const particleGeometry = new BufferGeometry();
  particleGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  particleGeometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
  particleGeometry.setAttribute('aDrift', new Float32BufferAttribute(drifts, 3));
  const particleUniforms = {
    uProgress: stripUniforms.uProgress,
    uBend: stripUniforms.uBend,
    uSize: { value: 30 * renderer.getPixelRatio() },
    uColor: { value: new Color(particles) },
  };
  strip.add(new Points(particleGeometry, particleMaterial(particleUniforms)));

  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    camera.aspect = width / height;
    camera.position.z = width / height < 0.8 ? 6.6 : 5.2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const onPointerMove = (event) => {
    const rect = container.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let progress = 0;
  let smooth = 0;

  const stopLoop = createLoop(container, (dt, time) => {
    smooth += (progress - smooth) * 0.12;
    pointer.x += (pointer.targetX - pointer.x) * 0.05;
    pointer.y += (pointer.targetY - pointer.y) * 0.05;

    const peel = ease(smooth / 0.3);
    const place = ease((smooth - 0.3) / 0.32);
    const melt = clamp01((smooth - 0.62) / 0.34);

    sachet.position.set(0, -0.15 - place * 2.6, -0.05);
    sachet.rotation.set(-0.35 + peel * 0.15 - place * 0.5, 0.25 - peel * 0.2, -0.08 + place * 0.3);
    sachet.scale.setScalar(1 - place * 0.25);
    sachetMaterial.opacity = faceMaterial.opacity = Math.max(0, 1 - place * 1.6);
    sachet.visible = place < 0.999;

    // Inside the sachet → poking out of the top → laid on the tongue in the photo (lower
    // centre, tipped back), curled.
    const outY = -0.1 + peel * 0.72;
    strip.position.set(0, outY * (1 - place) - place * 0.3, (-0.07 + peel * 0.12) * (1 - place) + place * 0.7);
    strip.rotation.set(
      (-0.35 + peel * 0.15) * (1 - place) - place * 0.5,
      (0.25 - peel * 0.2) * (1 - place) + place * 0.18,
      -0.08 * (1 - place)
    );
    strip.scale.setScalar(1 - place * 0.12);

    stripUniforms.uBend.value = place;
    stripUniforms.uProgress.value = melt;
    stripUniforms.uTime.value = time;

    rig.rotation.y = Math.sin(time * 0.4) * 0.1 + pointer.x * 0.25;
    rig.rotation.x = pointer.y * 0.15;
    rig.position.y = Math.sin(time * 0.8) * 0.04;
    renderer.render(scene, camera);
  });

  return {
    setProgress(value) {
      progress = clamp01(value);
    },
    destroy() {
      stopLoop();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      disposeTree(scene);
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

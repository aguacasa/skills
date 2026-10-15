import {
  Color,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  ShapeGeometry,
  SRGBColorSpace,
} from 'three';
import { normalizeUVs, roundedRect } from './shared.js';

const extrude = (size, radius, depth, bevel, curveSegments, bevelSegments = 4) =>
  new ExtrudeGeometry(roundedRect(size, size, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
    curveSegments,
  });

/**
 * The Demo tin: a square, rounded metal tin standing upright with its lid facing +z.
 * The lid is slightly wider than the base so the seam between them catches light.
 */
export function tinGeometries() {
  const base = extrude(0.95, 0.22, 0.17, 0.016, 20).translate(0, 0, -0.205);
  const lid = extrude(0.98, 0.235, 0.085, 0.022, 24);
  const label = normalizeUVs(new ShapeGeometry(roundedRect(0.9, 0.9, 0.2), 24)).translate(0, 0, 0.1085);
  return { base, lid, label };
}

export function createMetal() {
  return new MeshPhysicalMaterial({
    color: '#17171b',
    metalness: 0.8,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
  });
}

/** Glossy printed lid label; shows the product colour until the label texture loads. */
export function createLabelMaterial(product, loader, anisotropy) {
  const material = new MeshPhysicalMaterial({
    color: new Color(product.color || '#054FB8'),
    roughness: 0.42,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.85,
  });
  if (product.label) {
    loader.load(product.label, (texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = anisotropy;
      material.map = texture;
      material.color.set('#ffffff');
      material.needsUpdate = true;
    });
  }
  return material;
}

/** A closed tin as one group (used by the hero ring). */
export function createTin(geometry, metal, product, loader, anisotropy) {
  const group = new Group();
  group.add(
    new Mesh(geometry.base, metal),
    new Mesh(geometry.lid, metal),
    new Mesh(geometry.label, createLabelMaterial(product, loader, anisotropy))
  );
  return group;
}

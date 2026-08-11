import { useMemo } from 'react';
import * as THREE from 'three';

/* Fresnel rim-light shell — a slightly larger, backside-rendered sphere whose
   opacity rises toward the silhouette edge. Standard cheap atmosphere-glow
   trick (same idea used in three.js's own earth-atmosphere example) instead
   of a real scattering simulation. */

const VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  uniform vec3 glowColor;
  uniform float power;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), power);
    gl_FragColor = vec4(glowColor, rim * intensity);
  }
`;

export default function AtmosphereGlow({ radius, color = '#7ec8ff', power = 2.4, intensity = 0.7, segments = 32 }) {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(color) },
      power: { value: power },
      intensity: { value: intensity },
    }),
    [color, power, intensity]
  );

  return (
    <mesh scale={[1.06, 1.06, 1.06]}>
      <sphereGeometry args={[radius, segments, segments]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TEXTURES } from './textures';

/* Additive-blended sprite behind the sun stands in for a bloom post-process
   pass (skipped — the postprocessing package's three.js peer range collides
   with the version @react-three/fiber 9 needs). A radial gradient texture
   drawn on a canvas, faded via vertex alpha, reads as a soft cinematic glow
   without a full screen-space bloom pipeline. */
function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,214,140,0.9)');
  gradient.addColorStop(0.35, 'rgba(255,170,80,0.45)');
  gradient.addColorStop(1, 'rgba(255,140,60,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function Sun({ quality = 'high', reveal = 1 }) {
  const meshRef = useRef();
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const sunTexture = useLoader(THREE.TextureLoader, TEXTURES.sun);
  const segments = quality === 'low' ? 24 : quality === 'medium' ? 40 : 64;
  const revealScale = Math.max(0.001, reveal);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Slow surface roll — reads as plasma drift rather than rigid rotation
      meshRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <group scale={revealScale}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.1, segments, segments]} />
        <meshBasicMaterial map={sunTexture} toneMapped={false} />
      </mesh>

      {/* Point light — illuminates every planet in the scene. Decay is
          softened well below physical inverse-square so outer planets
          (Uranus, Neptune) stay visible instead of vanishing into black —
          a deliberate stylized choice over strict photometric accuracy.
          Intensity ramps with `reveal` so the sun visibly glows to life
          during the boot sequence rather than just popping to full output. */}
      <pointLight color="#ffe1b0" intensity={130 * reveal} distance={0} decay={1} />

      {/* Soft additive glow halo */}
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite scale={[4.6, 4.6, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
      </sprite>
    </group>
  );
}

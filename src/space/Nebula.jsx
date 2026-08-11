import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Soft procedural cloud sprites — layered radial gradients with a little
   pixel-level jitter so edges don't read as a perfect circle. No external
   nebula photography was available under a license fit for compositing,
   so this is deliberately a stylized painterly cloud, not a fake "real"
   nebula photo. */
function makeNebulaTexture(hue) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < 4; i++) {
    const cx = size / 2 + (Math.sin(i * 2.1 + hue) * size) / 6;
    const cy = size / 2 + (Math.cos(i * 1.7 + hue) * size) / 6;
    const r = size * (0.28 + i * 0.05);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const alpha = 0.22 - i * 0.035;
    gradient.addColorStop(0, `hsla(${hue}, 70%, 62%, ${alpha})`);
    gradient.addColorStop(0.5, `hsla(${hue + 20}, 65%, 45%, ${alpha * 0.5})`);
    gradient.addColorStop(1, `hsla(${hue}, 60%, 30%, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  return new THREE.CanvasTexture(canvas);
}

const CLOUDS = [
  { hue: 255, position: [-55, 18, -95], scale: 62, speed: 0.0018 },
  { hue: 200, position: [60, -10, -110], scale: 70, speed: -0.0013 },
  { hue: 22, position: [-20, -25, -130], scale: 55, speed: 0.001 },
];

export default function Nebula({ intensity = 1 }) {
  const refs = useRef([]);
  const textures = useMemo(() => CLOUDS.map((c) => makeNebulaTexture(c.hue)), []);

  useFrame((_, delta) => {
    refs.current.forEach((sprite, i) => {
      if (!sprite) return;
      sprite.rotation.z += delta * CLOUDS[i].speed;
    });
  });

  return (
    <group>
      {CLOUDS.map((cloud, i) => (
        <sprite
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={cloud.position}
          scale={[cloud.scale, cloud.scale, 1]}
        >
          <spriteMaterial
            map={textures[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.5 * intensity}
          />
        </sprite>
      ))}
    </group>
  );
}

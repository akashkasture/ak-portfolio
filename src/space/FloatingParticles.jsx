import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function generateField(count) {
  const pos = new Float32Array(count * 3);
  const spd = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const radius = 20 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 40;
    pos[i * 3] = Math.cos(theta) * radius;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(theta) * radius;
    spd[i] = 0.02 + Math.random() * 0.05;
  }
  return [pos, spd];
}

function makeDotTexture() {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function FloatingParticles({ count = 260 }) {
  const pointsRef = useRef();
  const texture = useMemo(() => makeDotTexture(), []);

  const [[positions, speeds]] = useState(() => generateField(count));

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 6;
      if (arr[i * 3 + 1] > 20) arr[i * 3 + 1] = -20;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.14}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

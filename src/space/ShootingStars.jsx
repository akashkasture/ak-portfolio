import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POOL_SIZE = 2;

function makeStreakTexture() {
  const w = 256;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.85, 'rgba(255,255,255,0.35)');
  gradient.addColorStop(1, 'rgba(255,255,255,0.95)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, h * 0.35, w, h * 0.3);
  return new THREE.CanvasTexture(canvas);
}

function randomTrail() {
  const startX = -50 + Math.random() * 30;
  const startY = 20 + Math.random() * 20;
  const startZ = -40 + Math.random() * 40;
  const travel = 24 + Math.random() * 14;
  const angle = -0.5 - Math.random() * 0.35;
  return {
    start: new THREE.Vector3(startX, startY, startZ),
    end: new THREE.Vector3(startX + travel, startY + travel * Math.tan(angle), startZ),
    duration: 0.7 + Math.random() * 0.4,
  };
}

export default function ShootingStars({ enabled = true }) {
  const texture = useMemo(() => makeStreakTexture(), []);
  const spriteRefs = useRef([]);
  const [slots] = useState(() =>
    Array.from({ length: POOL_SIZE }, () => ({ active: false, elapsed: 0, ...randomTrail(), nextDelay: 6 + Math.random() * 18 }))
  );

  useFrame((_, delta) => {
    if (!enabled) return;
    slots.forEach((slot, i) => {
      const sprite = spriteRefs.current[i];
      if (!sprite) return;

      if (!slot.active) {
        slot.nextDelay -= delta;
        if (slot.nextDelay <= 0) {
          Object.assign(slot, randomTrail());
          slot.active = true;
          slot.elapsed = 0;
        } else {
          sprite.material.opacity = 0;
        }
        return;
      }

      slot.elapsed += delta;
      const t = slot.elapsed / slot.duration;
      if (t >= 1) {
        slot.active = false;
        slot.nextDelay = 10 + Math.random() * 20;
        sprite.material.opacity = 0;
        return;
      }

      sprite.position.lerpVectors(slot.start, slot.end, t);
      const dir = slot.end.clone().sub(slot.start).normalize();
      sprite.material.rotation = Math.atan2(dir.y, dir.x);
      sprite.material.opacity = Math.sin(Math.PI * t) * 0.9;
    });
  });

  return (
    <group>
      {slots.map((_, i) => (
        <sprite key={i} ref={(el) => (spriteRefs.current[i] = el)} scale={[6, 0.7, 1]}>
          <spriteMaterial map={texture} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

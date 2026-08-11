import { useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import OrbitPath from './OrbitPath';
import AtmosphereGlow from './AtmosphereGlow';

export default function Planet({ data, texturePath, cloudsPath, quality = 'high', timeScale = 1, onHover, onSelect, isSelected, glow, reveal = 1, ambientGlow = true }) {
  const orbitGroup = useRef();
  const spinRef = useRef();
  const cloudsRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, texturePath);
  const cloudsTexture = useLoader(THREE.TextureLoader, cloudsPath || texturePath);
  const segments = quality === 'low' ? 16 : quality === 'medium' ? 28 : 48;

  // Stagger starting orbital angle per-planet so they don't all launch aligned
  const startAngle = useMemo(() => (data.orbitRadius * 37) % (Math.PI * 2), [data.orbitRadius]);

  useFrame((_, delta) => {
    const dt = delta * timeScale;
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y += dt * data.orbitSpeed * 0.3;
    }
    if (spinRef.current) {
      spinRef.current.rotation.y += dt * data.rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += dt * data.rotationSpeed * 0.4;
    }
  });

  const setHover = (v) => {
    setHovered(v);
    onHover?.(v ? data : null);
  };

  return (
    <group ref={orbitGroup} rotation={[0, startAngle, 0]}>
      <OrbitPath radius={data.orbitRadius} />
      <group position={[data.orbitRadius, 0, 0]}>
        <group rotation={[0, 0, data.tilt]} scale={Math.max(0.001, reveal)}>
          <mesh
            ref={spinRef}
            scale={hovered || isSelected ? 1.12 : 1}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelect?.(data, e.point.clone()); }}
          >
            <sphereGeometry args={[data.size, segments, segments]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.9}
              metalness={0.05}
              emissive={data.color}
              emissiveIntensity={0.06}
            />
          </mesh>
          {cloudsPath && (
            <mesh ref={cloudsRef} scale={1.015}>
              <sphereGeometry args={[data.size, segments, segments]} />
              <meshBasicMaterial map={cloudsTexture} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          )}
          {glow && ambientGlow && <AtmosphereGlow radius={data.size} color={glow} power={2.6} intensity={hovered ? 1 : 0.55} />}
        </group>
      </group>
    </group>
  );
}

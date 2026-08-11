import { useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TEXTURES } from './textures';
import OrbitPath from './OrbitPath';
import AtmosphereGlow from './AtmosphereGlow';

function useRingGeometry(inner, outer, segments) {
  return useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, segments, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const radius = v3.length();
      const t = (radius - inner) / (outer - inner);
      uv.setXY(i, t, 0.5);
    }
    return geo;
  }, [inner, outer, segments]);
}

export default function Saturn({ data, quality = 'high', timeScale = 1, onHover, onSelect, isSelected }) {
  const orbitGroup = useRef();
  const spinRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [planetTex, ringTex] = useLoader(THREE.TextureLoader, [TEXTURES.saturn, TEXTURES.saturnRing]);
  const segments = quality === 'low' ? 20 : quality === 'medium' ? 32 : 48;
  const ringGeo = useRingGeometry(data.size * 1.35, data.size * 2.3, quality === 'low' ? 64 : 128);
  const startAngle = useMemo(() => (data.orbitRadius * 29) % (Math.PI * 2), [data.orbitRadius]);

  useFrame((_, delta) => {
    const dt = delta * timeScale;
    if (orbitGroup.current) orbitGroup.current.rotation.y += dt * data.orbitSpeed * 0.3;
    if (spinRef.current) spinRef.current.rotation.y += dt * data.rotationSpeed;
  });

  const setHover = (v) => {
    setHovered(v);
    onHover?.(v ? data : null);
  };

  return (
    <group ref={orbitGroup} rotation={[0, startAngle, 0]}>
      <OrbitPath radius={data.orbitRadius} />
      <group position={[data.orbitRadius, 0, 0]}>
        <group rotation={[0, 0, data.tilt]}>
          <mesh
            ref={spinRef}
            scale={hovered || isSelected ? 1.08 : 1}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelect?.(data); }}
          >
            <sphereGeometry args={[data.size, segments, segments]} />
            <meshStandardMaterial map={planetTex} roughness={0.85} metalness={0.05} emissive={data.color} emissiveIntensity={0.05} />
          </mesh>

          <mesh rotation={[Math.PI / 2 - 0.02, 0, 0]}>
            <primitive object={ringGeo} attach="geometry" />
            <meshBasicMaterial
              map={ringTex}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <AtmosphereGlow radius={data.size} color="#e8d9ad" power={2.8} intensity={hovered ? 0.9 : 0.4} />
        </group>
      </group>
    </group>
  );
}

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TEXTURES } from './textures';

export default function Starfield({ quality = 'high', timeScale = 1 }) {
  const skyRef = useRef();
  const milkyWay = useLoader(THREE.TextureLoader, TEXTURES.milkyWay);
  const starCount = quality === 'low' ? 1200 : quality === 'medium' ? 2600 : 4200;

  useFrame((_, delta) => {
    if (skyRef.current) skyRef.current.rotation.y += delta * timeScale * 0.0025;
  });

  return (
    <group>
      <mesh ref={skyRef}>
        <sphereGeometry args={[140, 48, 48]} />
        <meshBasicMaterial map={milkyWay} side={THREE.BackSide} toneMapped={false} opacity={0.55} transparent />
      </mesh>
      <Stars radius={90} depth={50} count={starCount} factor={3.2} saturation={0} fade speed={0.35} />
    </group>
  );
}

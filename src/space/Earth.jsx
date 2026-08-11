import { useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TEXTURES } from './textures';
import { PLANETS, MOON } from './planetData';
import OrbitPath from './OrbitPath';
import AtmosphereGlow from './AtmosphereGlow';

const data = PLANETS.find((p) => p.id === 'earth');

const DAY_NIGHT_VERTEX = `
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DAY_NIGHT_FRAGMENT = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDirection;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  void main() {
    float sunFacing = dot(vWorldNormal, sunDirection);
    float mixAmount = smoothstep(-0.15, 0.15, sunFacing);
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 nightColor = texture2D(nightMap, vUv).rgb * 1.5;
    gl_FragColor = vec4(mix(nightColor, dayColor, mixAmount), 1.0);
  }
`;

export default function Earth({ quality = 'high', timeScale = 1, onHover, onSelect, isSelected }) {
  const orbitGroup = useRef();
  const positionHolder = useRef();
  const spinRef = useRef();
  const cloudsRef = useRef();
  const moonOrbitRef = useRef();
  const [hovered, setHovered] = useState(false);

  const [dayMap, nightMap, cloudsMap, moonMap] = useLoader(THREE.TextureLoader, [
    TEXTURES.earthDay,
    TEXTURES.earthNight,
    TEXTURES.earthClouds,
    TEXTURES.moon,
  ]);

  const segments = quality === 'low' ? 24 : quality === 'medium' ? 36 : 56;
  const startAngle = useMemo(() => (data.orbitRadius * 51) % (Math.PI * 2), []);

  const uniforms = useMemo(
    () => ({
      dayMap: { value: dayMap },
      nightMap: { value: nightMap },
      sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    }),
    [dayMap, nightMap]
  );

  const worldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const dt = delta * timeScale;
    if (orbitGroup.current) orbitGroup.current.rotation.y += dt * data.orbitSpeed * 0.3;
    if (spinRef.current) {
      spinRef.current.rotation.y += dt * data.rotationSpeed;
      spinRef.current.getWorldPosition(worldPos);
      uniforms.sunDirection.value.copy(worldPos).negate().normalize();
    }
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * data.rotationSpeed * 0.6;
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += dt * 0.55;
  });

  const setHover = (v) => {
    setHovered(v);
    onHover?.(v ? data : null);
  };

  return (
    <group ref={orbitGroup} rotation={[0, startAngle, 0]}>
      <OrbitPath radius={data.orbitRadius} />
      <group ref={positionHolder} position={[data.orbitRadius, 0, 0]}>
        <group rotation={[0, 0, data.tilt]}>
          <mesh
            ref={spinRef}
            scale={hovered || isSelected ? 1.12 : 1}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelect?.(data); }}
          >
            <sphereGeometry args={[data.size, segments, segments]} />
            <shaderMaterial uniforms={uniforms} vertexShader={DAY_NIGHT_VERTEX} fragmentShader={DAY_NIGHT_FRAGMENT} />
          </mesh>
          <mesh ref={cloudsRef} scale={1.015}>
            <sphereGeometry args={[data.size, segments, segments]} />
            <meshBasicMaterial map={cloudsMap} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <AtmosphereGlow radius={data.size} color="#5fa8ff" power={2.2} intensity={hovered ? 1 : 0.6} />
        </group>

        {/* Moon — orbits Earth's position, independent of Earth's own spin/tilt */}
        <group ref={moonOrbitRef}>
          <group position={[1.35, 0, 0]}>
            <mesh rotation={[0, 0, 0.05]}>
              <sphereGeometry args={[0.16, quality === 'low' ? 12 : 20, quality === 'low' ? 12 : 20]} />
              <meshStandardMaterial map={moonMap} roughness={1} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export { MOON };

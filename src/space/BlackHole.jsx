import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Stylized black hole — a solid event horizon, a bright "photon ring" right
   at its edge, and a glowing accretion disk whose color runs hot-white near
   the hole out to cool blue/purple at the rim (a common non-physical but
   readable stand-in for relativistic Doppler beaming). True gravitational
   lensing needs screen-space raymarching against the whole scene; that's a
   much bigger perf/complexity trade than this background element earns, so
   the lensing here is the glow/ring illusion rather than a real distortion
   shader. */

function makeDiskTexture() {
  const width = 1024;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.06, 'rgba(255,240,220,0.95)');
  gradient.addColorStop(0.18, 'rgba(255,180,110,0.85)');
  gradient.addColorStop(0.4, 'rgba(255,110,70,0.6)');
  gradient.addColorStop(0.65, 'rgba(150,90,220,0.4)');
  gradient.addColorStop(0.85, 'rgba(80,90,220,0.2)');
  gradient.addColorStop(1, 'rgba(40,50,140,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Turbulence bands
  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width;
    const w = 4 + Math.random() * 14;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
    ctx.fillRect(x, 0, w, height);
  }

  return new THREE.CanvasTexture(canvas);
}

function makeGlowTexture(colorStops) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function useRingGeometry(inner, outer, segments) {
  return useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, segments, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const t = (v3.length() - inner) / (outer - inner);
      uv.setXY(i, t, 0.5);
    }
    return geo;
  }, [inner, outer, segments]);
}

export default function BlackHole({ quality = 'high', position = [-42, 0, -60], scale = 1.3 }) {
  const diskRef = useRef();
  const photonRef = useRef();
  const segments = quality === 'low' ? 48 : 96;
  const diskTexture = useMemo(() => makeDiskTexture(), []);
  const glowTexture = useMemo(
    () => makeGlowTexture([
      [0, 'rgba(255,150,90,0.55)'],
      [0.4, 'rgba(150,80,200,0.28)'],
      [1, 'rgba(40,30,90,0)'],
    ]),
    []
  );
  const photonTexture = useMemo(
    () => makeGlowTexture([
      [0, 'rgba(255,245,225,1)'],
      [0.35, 'rgba(255,200,150,0.6)'],
      [1, 'rgba(255,180,120,0)'],
    ]),
    []
  );

  const horizonRadius = 6 * scale;
  const diskGeo = useRingGeometry(horizonRadius * 1.35, horizonRadius * 4.2, segments);

  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.045;
    if (photonRef.current) photonRef.current.rotation.z -= delta * 0.02;
  });

  return (
    <group position={position}>
      {/* Ambient halo */}
      <sprite scale={[horizonRadius * 9, horizonRadius * 9, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Accretion disk, tilted for a 3/4 view */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <primitive object={diskGeo} attach="geometry" />
        <meshBasicMaterial map={diskTexture} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Photon ring — bright rim right at the horizon edge, stand-in for lensed light */}
      <mesh ref={photonRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[horizonRadius * 1.02, horizonRadius * 1.12, segments]} />
        <meshBasicMaterial map={photonTexture} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Event horizon — solid, occludes the disk behind it */}
      <mesh>
        <sphereGeometry args={[horizonRadius, segments, segments]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

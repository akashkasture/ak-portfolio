import { useEffect, useRef } from 'react';

function latLngToXY(lat, lng, cx, cy, r, rotY) {
  const latR = (lat * Math.PI) / 180;
  const lngR = ((lng + rotY) * Math.PI) / 180;
  const x = cx + r * Math.cos(latR) * Math.sin(lngR);
  const y = cy - r * Math.sin(latR);
  const depth = Math.cos(latR) * Math.cos(lngR);
  return { x, y, depth };
}

const CITIES = [
  { name: 'New York',  lat: 40.7,  lng: -74.0, color: '#818cf8' },
  { name: 'London',    lat: 51.5,  lng: -0.1,  color: '#06b6d4' },
  { name: 'Singapore', lat: 1.35,  lng: 103.8, color: '#34d399' },
  { name: 'Mumbai',    lat: 19.1,  lng: 72.9,  color: '#fbbf24' },
];

const ARCS = [[0,1],[1,2],[2,3],[3,0],[0,2]];

// Draw a tilted ellipse ring (orbital ring) at given inclination
function drawOrbitalRing(ctx, cx, cy, rx, ry, angleDeg, color, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.restore();
}

export default function HoloGlobe({ size = 300 }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const r  = size * 0.38;

    let rotY = 0;
    const arcProgress = ARCS.map(() => Math.random());
    const arcSpeeds   = ARCS.map(() => 0.004 + Math.random() * 0.003);
    let frame = 0;

    function draw() {
      frame++;
      ctx.clearRect(0, 0, size, size);

      // ── Sphere glassy interior ─────────────────────────────────────────
      const sphereGrad = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.3, r * 0.05,
        cx, cy, r
      );
      sphereGrad.addColorStop(0,   'rgba(129,140,248,0.18)');
      sphereGrad.addColorStop(0.45,'rgba(6,182,212,0.08)');
      sphereGrad.addColorStop(1,   'rgba(0,0,0,0.0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // ── Outer glow ring ────────────────────────────────────────────────
      ctx.save();
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur  = 24;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99,102,241,0.65)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.restore();

      // ── Orbital rings (armillary sphere style) ─────────────────────────
      const rings = [
        { ry: r * 0.18, angle:  20, color: 'rgba(99,102,241,0.45)',  a: 0.5 },
        { ry: r * 0.22, angle: -35, color: 'rgba(6,182,212,0.38)',   a: 0.45 },
        { ry: r * 0.12, angle:  55, color: 'rgba(52,211,153,0.32)',  a: 0.40 },
      ];
      for (const ring of rings) {
        drawOrbitalRing(ctx, cx, cy, r, ring.ry, ring.angle + rotY * 0.3, ring.color, ring.a);
      }

      // ── Sparse meridians (6 lines) ─────────────────────────────────────
      for (let lng = 0; lng < 360; lng += 60) {
        ctx.beginPath();
        let first = true;
        for (let lat = -85; lat <= 85; lat += 5) {
          const { x, y, depth } = latLngToXY(lat, lng, cx, cy, r, rotY);
          if (depth < 0) { first = true; continue; }
          if (first) { ctx.moveTo(x, y); first = false; }
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(99,102,241,0.20)';
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }

      // ── Equator + 2 parallels ─────────────────────────────────────────
      for (const lat of [0, 30, -30]) {
        const latR = (lat * Math.PI) / 180;
        const yr   = cy - r * Math.sin(latR);
        const xr   = r  * Math.cos(latR);
        if (xr < 2) continue;
        ctx.beginPath();
        ctx.ellipse(cx, yr, xr, xr * 0.15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = lat === 0
          ? 'rgba(6,182,212,0.38)'
          : 'rgba(99,102,241,0.18)';
        ctx.lineWidth = lat === 0 ? 1.0 : 0.7;
        ctx.stroke();
      }

      // ── Arcs between city pairs ────────────────────────────────────────
      ARCS.forEach(([a, b], idx) => {
        arcProgress[idx] += arcSpeeds[idx];
        if (arcProgress[idx] > 1) arcProgress[idx] = 0;

        const p1  = latLngToXY(CITIES[a].lat, CITIES[a].lng, cx, cy, r, rotY);
        const p2  = latLngToXY(CITIES[b].lat, CITIES[b].lng, cx, cy, r, rotY);
        if (p1.depth < -0.1 && p2.depth < -0.1) return;

        const visAlpha = Math.max(0.2, (Math.max(p1.depth, p2.depth) + 1) / 2);
        const t   = arcProgress[idx];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.42;
        const col  = CITIES[a].color;

        // Arc trail
        ctx.save();
        ctx.globalAlpha = visAlpha * 0.85;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        const steps = 30;
        for (let s = 1; s <= steps; s++) {
          const tt = (s / steps) * t;
          const px = (1-tt)*(1-tt)*p1.x + 2*(1-tt)*tt*midX + tt*tt*p2.x;
          const py = (1-tt)*(1-tt)*p1.y + 2*(1-tt)*tt*midY + tt*tt*p2.y;
          ctx.lineTo(px, py);
        }
        const arcGrd = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        arcGrd.addColorStop(0,   col + '10');
        arcGrd.addColorStop(0.5, col + 'dd');
        arcGrd.addColorStop(1,   col + '22');
        ctx.strokeStyle = arcGrd;
        ctx.lineWidth   = 1.8;
        ctx.shadowColor = col;
        ctx.shadowBlur  = 12;
        ctx.stroke();
        ctx.restore();

        // Moving data packet
        if (t > 0.04) {
          const pt = Math.min(t, 0.96);
          const px = (1-pt)*(1-pt)*p1.x + 2*(1-pt)*pt*midX + pt*pt*p2.x;
          const py = (1-pt)*(1-pt)*p1.y + 2*(1-pt)*pt*midY + pt*pt*p2.y;
          ctx.save();
          ctx.globalAlpha = visAlpha * 0.95;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur  = 18;
          ctx.fill();
          ctx.restore();
        }
      });

      // ── City markers ──────────────────────────────────────────────────
      CITIES.forEach((city) => {
        const { x, y, depth } = latLngToXY(city.lat, city.lng, cx, cy, r, rotY);
        if (depth < -0.05) return;
        const alpha = (depth + 1) / 2;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.07 + x * 0.04);

        // Outer halo (slow pulse)
        ctx.save();
        ctx.globalAlpha = alpha * 0.35 * pulse;
        ctx.beginPath();
        ctx.arc(x, y, 10 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = city.color;
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.restore();

        // Middle ring
        ctx.save();
        ctx.globalAlpha = alpha * 0.55;
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = city.color;
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle   = city.color;
        ctx.shadowColor = city.color;
        ctx.shadowBlur  = 20;
        ctx.fill();
        ctx.restore();

        // Label — only on front-facing cities
        if (depth > 0.15) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.88;
          ctx.font        = `600 ${Math.max(9, Math.round(size * 0.032))}px monospace`;
          ctx.fillStyle   = city.color;
          ctx.fillText(city.name, x + 7, y - 4);
          ctx.restore();
        }
      });

      rotY += 0.20;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: 'block' }}
      className="pointer-events-none"
    />
  );
}

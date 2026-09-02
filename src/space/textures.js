/* Planet/sun/moon/starfield textures are real photographic-derived maps from
   Solar System Scope (solarsystemscope.com/textures), distributed under
   CC BY 4.0 — free for commercial use with attribution. Credited in
   Settings > About. Served from /public/textures/planets so they're
   cached by the browser like any other static asset.

   Two resolutions ship. The 2k set is 7.3 MB, which is a defensible
   number on a desktop and an indefensible one on a phone, so every
   map also exists at 1024×512 (`sips -Z 1024`), totalling 1.4 MB —
   about a fifth of the bytes for a sphere that is, on a phone, never
   more than a couple of hundred pixels across.

   The choice is made from the quality tier the scene already carries,
   so nothing new has to be threaded through the tree: `high` is a
   desktop with a real GPU and gets the full maps, anything below it
   gets the small ones. */

const BASE = '/textures/planets';

const build = (prefix, dir) => ({
  sun: `${dir}/${prefix}_sun.jpg`,
  mercury: `${dir}/${prefix}_mercury.jpg`,
  venusSurface: `${dir}/${prefix}_venus_surface.jpg`,
  venusAtmosphere: `${dir}/${prefix}_venus_atmosphere.jpg`,
  earthDay: `${dir}/${prefix}_earth_daymap.jpg`,
  earthNight: `${dir}/${prefix}_earth_nightmap.jpg`,
  earthClouds: `${dir}/${prefix}_earth_clouds.jpg`,
  moon: `${dir}/${prefix}_moon.jpg`,
  mars: `${dir}/${prefix}_mars.jpg`,
  jupiter: `${dir}/${prefix}_jupiter.jpg`,
  saturn: `${dir}/${prefix}_saturn.jpg`,
  saturnRing: `${dir}/${prefix}_saturn_ring_alpha.png`,
  uranus: `${dir}/${prefix}_uranus.jpg`,
  neptune: `${dir}/${prefix}_neptune.jpg`,
  milkyWay: `${dir}/${prefix}_stars_milky_way.jpg`,
});

export const TEXTURES = build('2k', BASE);
const TEXTURES_1K = build('1k', `${BASE}/1k`);

/** The map for a quality tier. Everything below `high` gets the small set. */
export function texturesFor(quality) {
  return quality === 'high' ? TEXTURES : TEXTURES_1K;
}

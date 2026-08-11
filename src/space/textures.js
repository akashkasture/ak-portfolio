/* Planet/sun/moon/starfield textures are real photographic-derived maps from
   Solar System Scope (solarsystemscope.com/textures), distributed under
   CC BY 4.0 — free for commercial use with attribution. Credited in
   Settings > About. Served from /public/textures/planets so they're
   cached by the browser like any other static asset. */

const BASE = '/textures/planets';

export const TEXTURES = {
  sun: `${BASE}/2k_sun.jpg`,
  mercury: `${BASE}/2k_mercury.jpg`,
  venusSurface: `${BASE}/2k_venus_surface.jpg`,
  venusAtmosphere: `${BASE}/2k_venus_atmosphere.jpg`,
  earthDay: `${BASE}/2k_earth_daymap.jpg`,
  earthNight: `${BASE}/2k_earth_nightmap.jpg`,
  earthClouds: `${BASE}/2k_earth_clouds.jpg`,
  moon: `${BASE}/2k_moon.jpg`,
  mars: `${BASE}/2k_mars.jpg`,
  jupiter: `${BASE}/2k_jupiter.jpg`,
  saturn: `${BASE}/2k_saturn.jpg`,
  saturnRing: `${BASE}/2k_saturn_ring_alpha.png`,
  uranus: `${BASE}/2k_uranus.jpg`,
  neptune: `${BASE}/2k_neptune.jpg`,
  milkyWay: `${BASE}/2k_stars_milky_way.jpg`,
};

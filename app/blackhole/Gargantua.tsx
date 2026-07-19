'use client';

/*
 * Gargantua — real-time Schwarzschild black hole as a navigable portfolio.
 *
 * Pass 1 integrates null geodesics per pixel in 3D:
 *     a = -3/2 · RS · |p×v|² / r⁵ · p
 * with RK2 refinement near the photon sphere, a Novikov–Thorne flux
 * profile (ISCO = 3 RS), blackbody radiation shifted through Doppler
 * beaming and gravitational redshift, a domain-warped turbulent disk and
 * a lensed star field. Pass 2 is a dual-Kawase bloom chain; pass 3
 * composites with ACES, chromatic aberration, vignette and grain.
 *
 * The camera rides a radial rail: scrolling falls toward the horizon,
 * dragging orbits. Portfolio sections are shells at fixed r.
 */

import { useEffect, useRef, useState } from 'react';
import {
  profile,
  stats,
  projects,
  experience,
  skills,
  education,
} from '@/data/resume';

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || '/';

const fmtClock = (t: number) => {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/* ------------------------------------------------------------------ */
/* stations — portfolio sections pinned to orbital radii (units of rs) */
/* ------------------------------------------------------------------ */

type StationId = 'approach' | 'work' | 'experience' | 'skills' | 'contact';

const STATIONS: { id: StationId; r: number; label: string; sub: string }[] = [
  { id: 'approach', r: 26.0, label: 'APPROACH', sub: 'r = 26 rs · parking orbit' },
  { id: 'work', r: 17.0, label: 'ACCRETION DISK', sub: 'r = 17 rs · work' },
  { id: 'experience', r: 11.0, label: 'PHOTON SPHERE', sub: 'r = 11 rs · experience' },
  { id: 'skills', r: 6.8, label: 'INNER ORBIT', sub: 'r = 6.8 rs · skills' },
  { id: 'contact', r: 5.6, label: 'EVENT HORIZON', sub: 'r = 5.6 rs · contact' },
];

const R_MIN = 4.6;
const R_MAX = 34.0;

/* ------------------------------------------------------------------ */
/* shaders                                                             */
/* ------------------------------------------------------------------ */

const VERT = `#version 300 es
out vec2 vUv;
void main(){
  vec2 v = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2));
  vUv = v;
  gl_Position = vec4(v*2.0-1.0, 0.0, 1.0);
}`;

/* pass 1 — null-geodesic raytracer (adapted from a Schwarzschild
   raytracer reference implementation; GLSL ES 3.00, params baked) */
const RAY_FRAG = `#version 300 es
precision highp float;
out vec4 O;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform float uFov;
uniform int   uSteps;
uniform float uOffY;   // portrait: lift scene center above the content panel

#define RS 1.0
const float DIN  = 2.75;
const float DOUT = 26.0;
const float DOP_MAX = 1.85;
const float OP_NEAR = 0.90;
const float OP_FAR  = 0.80;

float hash1(vec3 p){
  p = fract(p*0.3183099 + vec3(0.10,0.17,0.13));
  p *= 17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}
vec3 hash3(vec3 p){
  p = fract(p*vec3(0.1031,0.1030,0.0973));
  p += dot(p, p.yxz+33.33);
  return fract((p.xxy+p.yxx)*p.zyx);
}
float vnoise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f*f*(3.0-2.0*f);
  float n000 = hash1(i);
  float n100 = hash1(i+vec3(1.0,0.0,0.0));
  float n010 = hash1(i+vec3(0.0,1.0,0.0));
  float n110 = hash1(i+vec3(1.0,1.0,0.0));
  float n001 = hash1(i+vec3(0.0,0.0,1.0));
  float n101 = hash1(i+vec3(1.0,0.0,1.0));
  float n011 = hash1(i+vec3(0.0,1.0,1.0));
  float n111 = hash1(i+vec3(1.0,1.0,1.0));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for(int i=0;i<5;i++){
    v += a*vnoise(p);
    p = p*2.03 + 11.3;
    a *= 0.5;
  }
  return v;
}

vec3 blackbody(float t){
  vec3 c = mix(vec3(0.55,0.06,0.01), vec3(1.00,0.42,0.10), smoothstep(0.00,0.55,t));
  c = mix(c, vec3(1.00,0.86,0.55), smoothstep(0.50,1.05,t));
  c = mix(c, vec3(0.85,0.92,1.25), smoothstep(1.05,1.90,t));
  return c;
}

mat3 layerRot(float ay, float ax){
  float cy = cos(ay), sy = sin(ay), cx = cos(ax), sx = sin(ax);
  return mat3(cy,0.0,-sy,  sy*sx,cx,cy*sx,  sy*cx,-sx,cy*cx);
}
vec3 starLayer(vec3 d, float scale, float thresh, mat3 rot, float sharp){
  vec3 p = rot*d*scale;
  vec3 id = floor(p);
  vec3 f = fract(p);
  float h = hash1(id);
  if(h < thresh) return vec3(0.0);
  vec3 sp = 0.15 + 0.70*hash3(id + 4.7);
  float dist = length(f - sp);
  float star = exp(-dist*dist*sharp);
  float bright = (h - thresh)/(1.0 - thresh);
  bright *= bright;
  vec3 tint = mix(vec3(0.72,0.84,1.0), vec3(1.0,0.86,0.70), hash1(id + 13.1));
  return star*bright*tint*4.0;
}
vec3 heroStars(vec3 d){
  vec3 p = d*14.0;
  vec3 id = floor(p);
  vec3 f = fract(p);
  float h = hash1(id + 91.7);
  if(h < 0.9975) return vec3(0.0);
  vec3 sp = 0.20 + 0.60*hash3(id + 3.3);
  float dist = length(f - sp);
  float glow = exp(-dist*dist*22.0)*0.85 + exp(-dist*dist*240.0)*1.5;
  vec3 tint = mix(vec3(0.70,0.82,1.0), vec3(1.0,0.80,0.60), step(0.5, hash1(id + 5.5)));
  return glow*tint;
}
vec3 milkyway(vec3 d){
  vec3 n = normalize(vec3(0.25,1.0,0.15));
  float w = dot(d,n);
  float band = exp(-w*w*7.0);
  vec3 p = d*2.6;
  float cloud = fbm(p*1.4 + 5.2);
  float dust  = fbm(p*2.3 + 9.1);
  vec3 col = mix(vec3(0.04,0.07,0.20), vec3(0.42,0.24,0.52), smoothstep(0.25,0.85,cloud));
  col *= band;
  col *= 1.0 - 0.62*smoothstep(0.45,0.85,dust);
  col *= 1.15;
  return col;
}
vec3 background(vec3 d){
  vec3 col = 0.04*vec3(0.10,0.13,0.28);
  col += milkyway(d);
  col += starLayer(d,  26.0, 0.952, layerRot(0.7,0.4), 120.0);
  col += starLayer(d,  47.0, 0.952, layerRot(2.1,1.1), 200.0);
  col += starLayer(d,  83.0, 0.952, layerRot(4.0,2.3), 320.0);
  col += starLayer(d, 150.0, 0.968, layerRot(5.3,0.9), 480.0);
  col += heroStars(d);
  return col;
}

/* Schwarzschild null-geodesic acceleration (c = G = 1, RS = 1) */
vec3 accAt(vec3 p, vec3 v){
  vec3 h = cross(p, v);
  float r2 = dot(p, p);
  return -1.5*RS*dot(h, h)/(r2*r2*sqrt(r2))*p;
}

/* accretion-disk plane crossing; true when the ray is absorbed */
bool diskCross(vec3 a, vec3 b, vec3 rayDir, inout vec3 col, inout float trans){
  if(a.y*b.y > 0.0) return false;
  float t = abs(a.y)/(abs(a.y) + abs(b.y) + 1e-5);
  vec3 q = mix(a, b, t);
  float qr = length(q.xz);
  if(qr <= DIN || qr >= DOUT) return false;
  float ang = atan(q.z, q.x);

  /* Novikov–Thorne style flux, ISCO = 3 RS */
  float x = max(qr, 3.001);
  float flux = max(pow(x/3.0, -3.0)*(1.0 - sqrt(3.0/x)), 0.0);
  float temp = pow(flux*10.0, 0.25);

  /* seamless rotating pattern coords (rotate cartesian, never atan-sample) */
  float omega = 1.1*pow(3.0/qr, 1.5);
  float rot = omega*uTime;
  float ca = cos(rot), sa = sin(rot);
  vec3 qp = vec3(ca*q.x + sa*q.z, 0.0, -sa*q.x + ca*q.z);
  vec2 rp = qp.xz/qr;

  /* turbulence: domain warp, inner detail, fine streaks, lane mask */
  vec3 pc = vec3(rp.x*3.0, rp.y*3.0, qr*0.85);
  vec3 warp = vec3(
    fbm(pc*1.5),
    fbm(pc*1.5 + vec3(5.2,1.3,2.8)),
    fbm(pc*1.5 + vec3(9.7,4.1,7.3)));
  float turb = fbm(pc*2.0 + warp*1.5);
  float innerDetail = 1.0 - smoothstep(4.0, 18.0, qr);
  turb = mix(0.50, turb*1.7, innerDetail);
  float streakN = fbm(vec3(rp.x*22.0, rp.y*22.0, qr*1.4));
  float streak = mix(0.95, mix(0.55, 1.15, smoothstep(0.25, 0.85, streakN)), innerDetail);
  float lane = fbm(vec3(rp.x*5.0, rp.y*5.0, qr*0.55) + warp*0.8);
  float laneMask = mix(0.85, mix(0.50, 1.30, smoothstep(0.15, 0.80, lane)), innerDetail);
  float radialGain = mix(0.38, 1.0, innerDetail);

  float I = flux*11.0*turb*streak*laneMask*radialGain;
  I += exp(-pow((qr-3.1)*3.0, 2.0))*2.8;                 // inner glow
  float outerFade = 1.0 - smoothstep(DOUT-14.0, DOUT, qr);
  I *= outerFade;

  /* relativistic beaming + gravitational redshift */
  float beta = sqrt(0.5/qr);
  float gamma = 1.0/sqrt(max(1.0 - beta*beta, 1e-4));
  vec3 tdir = normalize(vec3(-sin(ang), 0.0, cos(ang)));
  float dop = 1.0/(gamma*(1.0 - dot(tdir*beta, rayDir)));
  dop = clamp(dop, 0.50, DOP_MAX);
  float g = sqrt(max(1.0 - RS/qr, 0.0));

  vec3 dcol = blackbody(temp*dop*g) * I * (dop*dop*dop) * g;
  float alpha = mix(OP_FAR, OP_NEAR, 1.0 - smoothstep(4.0, 13.0, qr)) * outerFade;
  col += trans * alpha * dcol;
  trans *= 1.0 - alpha;
  if(trans < 0.02){ trans = 0.0; return true; }
  return false;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  p.y -= uOffY;
  vec3 ro = uCamPos;
  vec3 ww = normalize(-ro);
  vec3 uu = normalize(cross(ww, vec3(0.0,1.0,0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(p.x*uu + p.y*vv + uFov*ww);

  vec3 pos = ro;
  vec3 vel = rd;
  vec3 col = vec3(0.0);
  vec3 haloCol = vec3(0.0);
  float trans = 1.0;
  float minR = 1e5;
  float lastR = length(ro);

  for(int i=0;i<600;i++){
    if(i >= uSteps) break;
    float r = length(pos);
    lastR = r;
    if(r < 1.03*RS){ trans = 0.0; break; }                 // event horizon
    if(r > 45.0 && dot(pos,vel) > 0.0){ break; }           // escaped
    minR = min(minR, r);

    float absY = abs(pos.y);
    float dt = max(0.012, r*mix(0.02, 0.06, smoothstep(6.0, 20.0, r)));

    /* thin volumetric halo hugging the disk plane */
    if(absY < 0.45 && r > DIN && r < DOUT){
      float dens = exp(-absY*30.0)*0.03*(1.0 - smoothstep(10.0, DOUT-1.0, r));
      float xh = max(r, 3.001);
      float fluxh = max(pow(xh/3.0, -3.0)*(1.0 - sqrt(3.0/xh)), 0.0);
      vec3 glowc = blackbody(pow(fluxh*10.0, 0.25)*0.9);
      haloCol += trans * glowc * (fluxh*3.5) * dens * dt;
    }

    if(r < 4.4){
      /* near-critical refinement: two RK2 half-substeps */
      float hdt = dt*0.5;
      bool absorbed = false;
      for(int s = 0; s < 2; s++){
        vec3 k1 = accAt(pos, vel);
        vec3 vm = normalize(vel + k1*(hdt*0.5));
        vec3 pm = pos + vel*(hdt*0.5);
        vec3 k2 = accAt(pm, vm);
        vec3 pn = pos + vm*hdt;
        vel = normalize(vel + k2*hdt);
        if(diskCross(pos, pn, vel, col, trans)) absorbed = true;
        pos = pn;
        minR = min(minR, length(pos));
      }
      if(absorbed) break;
    }else{
      vec3 nvel = normalize(vel + accAt(pos, vel)*dt);
      vec3 npos = pos + nvel*dt;
      if(pos.y*npos.y < 0.0){
        /* segment crosses the disk plane: re-integrate it in four
           sub-steps so geodesic curvature doesn't shift the crossing
           point — coarse linear crossings shimmered the outer rings.
           Only crossing segments pay, so the step budget never starves. */
        float sdt = dt*0.25;
        bool absorbed = false;
        for(int s = 0; s < 4; s++){
          vec3 v2 = normalize(vel + accAt(pos, vel)*sdt);
          vec3 p2 = pos + v2*sdt;
          if(diskCross(pos, p2, v2, col, trans)) absorbed = true;
          pos = p2;
          vel = v2;
        }
        if(absorbed) break;
      }else{
        vel = nvel;
        if(diskCross(pos, npos, vel, col, trans)){ pos = npos; break; }
        pos = npos;
      }
    }
  }

  /* lensed background only in the final escape direction; deep-well rays
     dim continuously so the horizon stays pure black */
  vec3 bgAdd = vec3(0.0);
  if(trans > 0.0){
    float deep = clamp((lastR-1.03)*0.45, 0.45, 1.0);
    col += haloCol * deep;
    bgAdd = trans * background(vel) * deep;
  }
  /* photon ring from the tracked perigee (thin critical curve, bloom-fed) */
  vec3 ringAdd = vec3(1.0,0.92,0.80) * exp(-pow((minR-1.55)*4.0, 2.0)) * 0.09;

  vec3 outCol = col + bgAdd + ringAdd;
  outCol = clamp(max(outCol, vec3(0.0)), vec3(0.0), vec3(64.0));
  O = vec4(outCol, 1.0);
}`;

/* bloom: bright-pass, then dual-Kawase down/up */
const BRIGHT_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 O;
uniform sampler2D uTex;
void main(){
  vec3 c = texture(uTex, vUv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  O = vec4(c * smoothstep(0.55, 1.15, l), 1.0);
}`;

const DOWN_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 O;
uniform sampler2D uTex;
uniform vec2 uHalfPx;
void main(){
  vec4 s = texture(uTex, vUv) * 4.0;
  s += texture(uTex, vUv - uHalfPx);
  s += texture(uTex, vUv + uHalfPx);
  s += texture(uTex, vUv + vec2(uHalfPx.x, -uHalfPx.y));
  s += texture(uTex, vUv - vec2(uHalfPx.x, -uHalfPx.y));
  O = s / 8.0;
}`;

const UP_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 O;
uniform sampler2D uTex;
uniform vec2 uHalfPx;
void main(){
  vec4 s = texture(uTex, vUv + vec2(-uHalfPx.x*2.0, 0.0));
  s += texture(uTex, vUv + vec2(-uHalfPx.x,  uHalfPx.y)) * 2.0;
  s += texture(uTex, vUv + vec2(0.0,  uHalfPx.y*2.0));
  s += texture(uTex, vUv + vec2( uHalfPx.x,  uHalfPx.y)) * 2.0;
  s += texture(uTex, vUv + vec2( uHalfPx.x*2.0, 0.0));
  s += texture(uTex, vUv + vec2( uHalfPx.x, -uHalfPx.y)) * 2.0;
  s += texture(uTex, vUv + vec2(0.0, -uHalfPx.y*2.0));
  s += texture(uTex, vUv + vec2(-uHalfPx.x, -uHalfPx.y)) * 2.0;
  O = s / 12.0;
}`;

/* composite: scene + bloom, ACES, chromatic aberration, vignette, grain */
const COMP_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 O;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec2  uRes;
uniform float uTime;
uniform float uBloomStr;

vec3 aces(vec3 x){
  return clamp((x*(2.51*x + 0.03))/(x*(2.43*x + 0.59) + 0.14), 0.0, 1.0);
}
float ghash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453);
}
vec3 fetch(vec2 uv){
  return texture(uScene, uv).rgb + uBloomStr*texture(uBloom, uv).rgb;
}
void main(){
  vec2 uv = vUv;
  vec2 dir = uv - 0.5;
  float ca = 0.0028*dot(dir, dir);
  vec3 col;
  col.r = fetch(uv + dir*ca).r;
  col.g = fetch(uv).g;
  col.b = fetch(uv - dir*ca).b;

  col *= 0.95;
  col = aces(col);

  float aspect = uRes.x/max(uRes.y, 1.0);
  float vig = smoothstep(1.30, 0.30, length(dir*vec2(aspect, 1.0))*1.15);
  col *= vig;

  float g = ghash(gl_FragCoord.xy + fract(uTime*13.7)*97.0) - 0.5;
  col += g*0.045*(1.0 - 0.5*col);
  O = vec4(col, 1.0);
}`;

/* ------------------------------------------------------------------ */
/* content per station                                                 */
/* ------------------------------------------------------------------ */

function StationContent({ id }: { id: StationId }) {
  if (id === 'approach') {
    return (
      <div className="bh-station">
        <p className="bh-kicker">OBSERVER LOG · KATHMANDU, EARTH</p>
        <h1 className="bh-name">{profile.name}</h1>
        <p className="bh-title">{profile.title}</p>
        <p className="bh-copy">
          You are on a stable orbit around a portfolio with enough gravity to
          bend light. Everything I have shipped is down there, arranged by
          depth. Scroll to begin the descent — escape is optional.
        </p>
        <div className="bh-stats">
          {stats.map((s) => (
            <div key={s.label} className="bh-stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === 'work') {
    return (
      <div className="bh-station">
        <p className="bh-kicker">MATTER STREAMS DETECTED · {projects.length} BODIES</p>
        <h2 className="bh-h">Work in orbit</h2>
        <div className="bh-projects">
          {projects.map((p) => (
            <article key={p.name} className={`bh-proj bh-acc-${p.accent}`}>
              <header>
                <h3>{p.name}</h3>
                {p.badge && <span className="bh-badge">{p.badge}</span>}
              </header>
              <p className="bh-role">{p.role}</p>
              <p className="bh-desc">{p.description}</p>
              <p className="bh-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </p>
              {p.links.length > 0 && (
                <p className="bh-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    );
  }
  if (id === 'experience') {
    return (
      <div className="bh-station">
        <p className="bh-kicker">
          UNSTABLE ORBITS · TIME RUNS SLOWER HERE — CAREERS LOOK LONGER
        </p>
        <h2 className="bh-h">Experience</h2>
        <div className="bh-jobs">
          {experience.map((j) => (
            <article key={j.company + j.when} className="bh-job">
              <p className="bh-when">{j.when}</p>
              <h3>
                {j.role} <em>· {j.company}</em>
              </h3>
              <ul>
                {j.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="bh-edu">
          {education.map((e) => (
            <p key={e.degree}>
              <b>{e.degree}</b> — {e.school}
            </p>
          ))}
        </div>
      </div>
    );
  }
  if (id === 'skills') {
    return (
      <div className="bh-station">
        <p className="bh-kicker">SPECTROGRAPH · {skills.length} STABLE ELEMENTS</p>
        <h2 className="bh-h">Skills</h2>
        <p className="bh-copy">
          Compressed by four years of production pressure into something dense
          enough to hold its own orbit.
        </p>
        <div className="bh-skills">
          {skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bh-station">
      <p className="bh-kicker">FINAL STABLE COORDINATE · SIGNALS STILL ESCAPE FROM HERE</p>
      <h2 className="bh-h">Cross the horizon</h2>
      <p className="bh-copy">
        Nothing that falls in comes back — except email. I answer those.
        Kathmandu-based, remote-friendly, comfortable anywhere between a
        Flutter widget tree and a Postgres query plan.
      </p>
      <div className="bh-contact">
        <a className="bh-cta" href={`mailto:${profile.email}`}>
          TRANSMIT SIGNAL — {profile.email}
        </a>
        <a className="bh-out" href={profile.github} target="_blank" rel="noopener noreferrer">
          GITHUB ↗
        </a>
        <a className="bh-out" href={profile.playStore} target="_blank" rel="noopener noreferrer">
          GOOGLE PLAY ↗
        </a>
        <a className="bh-out" href={MAIN_URL}>
          ESCAPE TO APEX PORTFOLIO ⌂
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GL plumbing helpers                                                 */
/* ------------------------------------------------------------------ */

type RT = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };

function makeRT(gl: WebGL2RenderingContext, w: number, h: number, half: boolean): RT {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, half ? gl.RGBA16F : gl.RGBA8, w, h, 0,
    gl.RGBA, half ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fbo, tex, w, h };
}

function delRT(gl: WebGL2RenderingContext, rt: RT) {
  gl.deleteFramebuffer(rt.fbo);
  gl.deleteTexture(rt.tex);
}

/* ------------------------------------------------------------------ */
/* main component                                                      */
/* ------------------------------------------------------------------ */

export default function Gargantua() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [station, setStation] = useState<StationId>('approach');
  const [booted, setBooted] = useState(false);
  const [glOk, setGlOk] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  const rEl = useRef<HTMLSpanElement>(null);
  const tdEl = useRef<HTMLSpanElement>(null);
  const veEl = useRef<HTMLSpanElement>(null);
  const tauEl = useRef<HTMLSpanElement>(null);
  const earthEl = useRef<HTMLSpanElement>(null);
  const gaugeEl = useRef<HTMLDivElement>(null);

  /* mutable sim state, no re-renders */
  const sim = useRef({
    camR: R_MAX,
    camRT: STATIONS[0].r,
    incl: 0.24,
    inclT: 0.24,
    azi: 0.55,
    aziT: 0.55,
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastPinch: 0,
    idleT: 0,
    tau: 0,
    tEarth: 0,
    station: 'approach' as StationId,
  });

  const warpTo = (id: StationId) => {
    const st = STATIONS.find((s) => s.id === id)!;
    sim.current.camRT = st.r;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      setGlOk(false);
      setBooted(true);
      return;
    }
    const half = !!gl.getExtension('EXT_color_buffer_float');

    const mkShader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = mkShader(gl.VERTEX_SHADER, VERT);
    const mkProg = (fragSrc: string) => {
      const fs = mkShader(gl.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) return null;
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    };
    const rayP = mkProg(RAY_FRAG);
    const brightP = mkProg(BRIGHT_FRAG);
    const downP = mkProg(DOWN_FRAG);
    const upP = mkProg(UP_FRAG);
    const compP = mkProg(COMP_FRAG);
    if (!rayP || !brightP || !downP || !upP || !compP) {
      setGlOk(false);
      setBooted(true);
      return;
    }
    const loc = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const U = {
      ray: {
        res: loc(rayP, 'uRes'), time: loc(rayP, 'uTime'),
        cam: loc(rayP, 'uCamPos'), fov: loc(rayP, 'uFov'), steps: loc(rayP, 'uSteps'),
        offY: loc(rayP, 'uOffY'),
      },
      bright: { tex: loc(brightP, 'uTex') },
      down: { tex: loc(downP, 'uTex'), hp: loc(downP, 'uHalfPx') },
      up: { tex: loc(upP, 'uTex'), hp: loc(upP, 'uHalfPx') },
      comp: {
        scene: loc(compP, 'uScene'), bloom: loc(compP, 'uBloom'),
        res: loc(compP, 'uRes'), time: loc(compP, 'uTime'), str: loc(compP, 'uBloomStr'),
      },
    };

    const coarse = matchMedia('(pointer: coarse)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let steps = coarse ? 200 : 320;
    let scale = coarse ? 0.5 : 0.66;
    if (canvas.clientHeight > canvas.clientWidth) {
      /* portrait: steeper default orbit so the disk reads above the panel */
      sim.current.incl = sim.current.inclT = 0.38;
    }
    const dpr = Math.min(devicePixelRatio || 1, 2);

    let sceneRT: RT | null = null;
    let mips: RT[] = [];

    const rebuildRTs = () => {
      if (sceneRT) delRT(gl, sceneRT);
      mips.forEach((m) => delRT(gl, m));
      const w = canvas.width, h = canvas.height;
      sceneRT = makeRT(gl, w, h, half);
      mips = [];
      let mw = w, mh = h;
      for (let i = 0; i < 4; i++) {
        mw = Math.max(8, mw >> 1);
        mh = Math.max(8, mh >> 1);
        mips.push(makeRT(gl, mw, mh, half));
      }
    };

    const resize = () => {
      const w = Math.max(2, Math.floor(canvas.clientWidth * dpr * scale));
      const h = Math.max(2, Math.floor(canvas.clientHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        rebuildRTs();
      }
    };
    resize();
    addEventListener('resize', resize);

    /* --- interaction --- */
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.bh-ui')) return;
      sim.current.dragging = true;
      sim.current.lastX = e.clientX;
      sim.current.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      const s = sim.current;
      if (!s.dragging) return;
      s.aziT += (e.clientX - s.lastX) * 0.005;
      s.inclT = Math.min(1.3, Math.max(0.04, s.inclT + (e.clientY - s.lastY) * 0.004));
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.idleT = 0;
    };
    const onPointerUp = () => (sim.current.dragging = false);

    const onWheel = (e: WheelEvent) => {
      const panel = (e.target as HTMLElement).closest('.bh-panel-scroll');
      if (panel) {
        const el = panel as HTMLElement;
        const down = e.deltaY > 0;
        const atEnd = down
          ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2
          : el.scrollTop <= 0;
        if (!atEnd) return;
      }
      e.preventDefault();
      const s = sim.current;
      /* clamp per-event delta — fast trackpad flicks fired huge single
         jumps that the camera easing then chased in one visible lunge */
      const d = Math.max(-140, Math.min(140, e.deltaY));
      s.camRT = Math.min(R_MAX, Math.max(R_MIN, s.camRT * (1 + d * 0.001)));
      s.idleT = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        sim.current.lastPinch = Math.hypot(dx, dy);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const p = Math.hypot(dx, dy);
        const s = sim.current;
        if (s.lastPinch > 0) {
          s.camRT = Math.min(R_MAX, Math.max(R_MIN, s.camRT * (s.lastPinch / p)));
        }
        s.lastPinch = p;
        s.idleT = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const s = sim.current;
      if (e.key === 'ArrowDown' || e.key === 's') s.camRT = Math.max(R_MIN, s.camRT * 0.93);
      else if (e.key === 'ArrowUp' || e.key === 'w') s.camRT = Math.min(R_MAX, s.camRT * 1.075);
      else if (e.key === 'ArrowLeft') s.aziT -= 0.15;
      else if (e.key === 'ArrowRight') s.aziT += 0.15;
      else return;
      s.idleT = 0;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    addEventListener('pointermove', onPointerMove);
    addEventListener('pointerup', onPointerUp);
    addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    addEventListener('keydown', onKey);

    /* --- render loop --- */
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    let frameEMA = 16;
    let hudTick = 0;
    let bootTimer = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      frameEMA = frameEMA * 0.95 + (now - last) * 0.05;
      last = now;
      const s = sim.current;

      /* adaptive: shrink resolution first, then steps */
      if (frameEMA > 34) {
        if (scale > 0.34) {
          scale *= 0.85;
          frameEMA = 20;
          resize();
        } else if (steps > 140) {
          steps = Math.max(140, steps - 40);
          frameEMA = 20;
        }
      }

      if (!document.hidden && sceneRT) {
        const k = 1 - Math.exp(-dt * 2.6);
        s.camR += (s.camRT - s.camR) * k;
        s.incl += (s.inclT - s.incl) * (1 - Math.exp(-dt * 5));
        s.idleT += dt;
        /* proper time aboard vs coordinate time far away — circular-orbit
           dilation sqrt(1 - 1.5 rs/r), so the Earth clock pulls ahead */
        s.tau += dt;
        s.tEarth += dt / Math.sqrt(Math.max(1 - 1.5 / s.camR, 0.04));
        if (!reduced && s.idleT > 2.5 && !s.dragging) s.aziT += dt * 0.03;
        s.azi += (s.aziT - s.azi) * (1 - Math.exp(-dt * 5));

        const time = reduced ? (now - t0) * 0.00015 : (now - t0) * 0.001;
        const ci = Math.cos(s.incl), si = Math.sin(s.incl);
        const cx = s.camR * ci * Math.cos(s.azi);
        const cy = s.camR * si;
        const cz = s.camR * ci * Math.sin(s.azi);
        /* smoothstep the zoom curve — the old linear clamp had a kink at
           r = 12 that read as a sudden lurch mid-descent */
        const zt = Math.min(1, Math.max(0, (12 - s.camR) / 6.4));
        const fovDeg = 44 + 24 * zt * zt * (3 - 2 * zt);
        const fovK = 1 / Math.tan((fovDeg * Math.PI) / 360);

        /* pass 1 — geodesic raytrace into sceneRT */
        gl.bindFramebuffer(gl.FRAMEBUFFER, sceneRT.fbo);
        gl.viewport(0, 0, sceneRT.w, sceneRT.h);
        gl.useProgram(rayP);
        gl.uniform2f(U.ray.res, sceneRT.w, sceneRT.h);
        gl.uniform1f(U.ray.time, time);
        gl.uniform3f(U.ray.cam, cx, cy, cz);
        gl.uniform1f(U.ray.fov, fovK);
        gl.uniform1i(U.ray.steps, steps);
        gl.uniform1f(U.ray.offY, canvas.height > canvas.width ? 0.16 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        /* pass 2 — bright extract into mip0 */
        gl.bindFramebuffer(gl.FRAMEBUFFER, mips[0].fbo);
        gl.viewport(0, 0, mips[0].w, mips[0].h);
        gl.useProgram(brightP);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneRT.tex);
        gl.uniform1i(U.bright.tex, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        /* down chain */
        for (let i = 1; i < mips.length; i++) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, mips[i].fbo);
          gl.viewport(0, 0, mips[i].w, mips[i].h);
          gl.useProgram(downP);
          gl.bindTexture(gl.TEXTURE_2D, mips[i - 1].tex);
          gl.uniform1i(U.down.tex, 0);
          gl.uniform2f(U.down.hp, 0.5 / mips[i - 1].w, 0.5 / mips[i - 1].h);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        /* up chain, additive */
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        for (let i = mips.length - 2; i >= 0; i--) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, mips[i].fbo);
          gl.viewport(0, 0, mips[i].w, mips[i].h);
          gl.useProgram(upP);
          gl.bindTexture(gl.TEXTURE_2D, mips[i + 1].tex);
          gl.uniform1i(U.up.tex, 0);
          gl.uniform2f(U.up.hp, 0.5 / mips[i + 1].w, 0.5 / mips[i + 1].h);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        gl.disable(gl.BLEND);

        /* pass 3 — composite to screen */
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(compP);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneRT.tex);
        gl.uniform1i(U.comp.scene, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, mips[0].tex);
        gl.uniform1i(U.comp.bloom, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform2f(U.comp.res, canvas.width, canvas.height);
        gl.uniform1f(U.comp.time, time);
        gl.uniform1f(U.comp.str, half ? 0.8 : 0.45);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      /* boot splash lifts once real frames flow */
      bootTimer += dt;
      if (bootTimer > 1.4) setBooted(true);

      /* HUD @ ~12 Hz */
      hudTick += dt;
      if (hudTick > 0.08) {
        hudTick = 0;
        const r = s.camR;
        const td = Math.sqrt(Math.max(0, 1 - 1 / r));
        if (rEl.current) rEl.current.textContent = r.toFixed(2);
        if (tdEl.current) tdEl.current.textContent = td.toFixed(3);
        if (veEl.current) veEl.current.textContent = Math.sqrt(1 / r).toFixed(3);
        if (tauEl.current) tauEl.current.textContent = fmtClock(s.tau);
        if (earthEl.current) earthEl.current.textContent = fmtClock(s.tEarth);
        if (gaugeEl.current) {
          const t =
            (Math.log(r) - Math.log(R_MIN)) / (Math.log(R_MAX) - Math.log(R_MIN));
          gaugeEl.current.style.top = `${(1 - t) * 100}%`;
        }
        let best: StationId = 'approach';
        let bd = 1e9;
        for (const st of STATIONS) {
          const d = Math.abs(Math.log(r / st.r));
          if (d < bd) {
            bd = d;
            best = st.id;
          }
        }
        if (best !== s.station) {
          s.station = best;
          setStation(best);
        }
        document.documentElement.dataset.bhZone = r < 6.6 ? 'horizon' : 'space';
        /* continuous gravitational-redshift feel: 0 far out → 1 at R_MIN */
        const red = Math.min(1, Math.max(0, (11 - r) / (11 - R_MIN)));
        document.documentElement.style.setProperty('--bh-red', red.toFixed(3));
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerup', onPointerUp);
      removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      removeEventListener('keydown', onKey);
      delete document.documentElement.dataset.bhZone;
      document.documentElement.style.removeProperty('--bh-red');
      if (sceneRT) delRT(gl, sceneRT);
      mips.forEach((m) => delRT(gl, m));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  const active = STATIONS.find((s) => s.id === station)!;

  return (
    <div className="bh-stage">
      <canvas ref={canvasRef} className="bh-canvas" aria-hidden="true" />
      {!glOk && <div className="bh-fallback" aria-hidden="true" />}
      <div className="bh-grain" aria-hidden="true" />

      {/* boot splash */}
      <div className={`bh-boot ${booted ? 'done' : ''}`} aria-hidden={booted}>
        <p>GEODESIC INTEGRATOR</p>
        <p className="bh-boot-sub">
          integrating null geodesics per pixel · entering orbit…
        </p>
      </div>

      {/* corner chrome */}
      <header className="bh-ui bh-top">
        <div className="bh-brand">
          <span className="bh-brand-main">GEODESIC RAYTRACING</span>
          <span className="bh-brand-sub">SHREEDHAR PANDEYA · SINGULARITY PORTFOLIO</span>
        </div>
        <div className="bh-telemetry" role="status">
          <span>
            r <b><span ref={rEl}>26.00</span> rs</b>
          </span>
          <span>
            dτ/dt <b><span ref={tdEl}>0.980</span></b>
          </span>
          <span>
            v<sub>esc</sub> <b><span ref={veEl}>0.196</span> c</b>
          </span>
          <span className="bh-clock">
            τ ship <b><span ref={tauEl}>00:00:00</span></b>
          </span>
          <span className="bh-clock bh-clock-earth">
            t earth <b><span ref={earthEl}>00:00:00</span></b>
          </span>
        </div>
      </header>

      {/* content panel */}
      <main
        className={`bh-ui bh-panel ${panelOpen ? '' : 'bh-panel-closed'}`}
        key={station}
      >
        <div className="bh-panel-head">
          <span>{active.label}</span>
          <span className="bh-panel-r">{active.sub}</span>
          <button
            className="bh-panel-toggle"
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}
            aria-expanded={panelOpen}
          >
            {panelOpen ? '▁' : '▣'}
          </button>
        </div>
        {panelOpen && (
          <div className="bh-panel-scroll">
            <StationContent id={station} />
          </div>
        )}
      </main>

      {/* descent gauge */}
      <div className="bh-ui bh-gauge" aria-hidden="true">
        <div className="bh-gauge-line" />
        {STATIONS.map((s) => {
          const t =
            (Math.log(s.r) - Math.log(R_MIN)) / (Math.log(R_MAX) - Math.log(R_MIN));
          return (
            <button
              key={s.id}
              className={`bh-gauge-stop ${s.id === station ? 'on' : ''}`}
              style={{ top: `${(1 - t) * 100}%` }}
              onClick={() => warpTo(s.id)}
              aria-label={`Warp to ${s.label}`}
              title={s.label}
            />
          );
        })}
        <div ref={gaugeEl} className="bh-gauge-ship" style={{ top: '0%' }} />
      </div>

      {/* navigation */}
      <nav className="bh-ui bh-nav" aria-label="Descent stations">
        <p className="bh-nav-head">NAVIGATION</p>
        {STATIONS.map((s) => (
          <button
            key={s.id}
            className={s.id === station ? 'on' : ''}
            onClick={() => warpTo(s.id)}
          >
            <i aria-hidden="true" />
            {s.label}
          </button>
        ))}
        <a className="bh-nav-exit" href={MAIN_URL}>
          ⌂ APEX PORTFOLIO
        </a>
      </nav>

      <p className="bh-ui bh-hint" aria-hidden="true">
        drag — orbit&ensp;·&ensp;scroll — descend&ensp;·&ensp;pinch on touch
      </p>
    </div>
  );
}

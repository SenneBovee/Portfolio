// Senne Bovée — Riso Poster portfolio prototype.
// Full-bleed single-screen design. Nav switches the lower panel between
// Index (project grid), About, Shipped, Loadout, Contact. Project click
// opens a full-spread overlay.

// Palettes are arrays so TweakColor can show them as swatch stacks.
// Each palette: [paper, ink, accent1, accent2, accent3]
const PALETTES = {
  classic: ['#f1ebde', '#1b1b1b', '#e2522a', '#d99a3a', '#235e64'],
  bruise: ['#f1ebde', '#1b1b1b', '#7b3a8a', '#1e6d75', '#d99a3a'],
  mono: ['#f1ebde', '#1b1b1b', '#1b1b1b', '#6b6052', '#1b1b1b'],
  midnight: ['#15161a', '#f1ebde', '#e2522a', '#d99a3a', '#5dafa9']
};

const DISPLAY_FONTS = {
  'Anton': { stack: '"Anton", sans-serif', tracking: '0.01em', weight: 400, transform: 'uppercase' },
  'Bodoni Moda': { stack: '"Bodoni Moda", serif', tracking: '-0.01em', weight: 800, transform: 'none' },
  'Big Shoulders': { stack: '"Big Shoulders Display", sans-serif', tracking: '0.02em', weight: 800, transform: 'uppercase' },
  'Migra': { stack: '"DM Serif Display", serif', tracking: '-0.02em', weight: 400, transform: 'none' }
};

const GRID_DENSITIES = {
  compact: { cols: 12, rowH: 180, gap: 8, big: { c: 'span 8', r: 'span 2' }, small: { c: 'span 4', r: 'span 1' }, wide: { c: 'span 6', r: 'span 1' } },
  comfortable: { cols: 12, rowH: 220, gap: 10, big: { c: 'span 8', r: 'span 2' }, small: { c: 'span 4', r: 'span 1' }, wide: { c: 'span 6', r: 'span 1' } },
  spacious: { cols: 12, rowH: 300, gap: 14, big: { c: 'span 8', r: 'span 2' }, small: { c: 'span 4', r: 'span 1' }, wide: { c: 'span 6', r: 'span 1' } }
};

const HOVER_STYLES = ['lift', 'invert', 'outline'];
const CURSORS = ['default', 'crosshair', 'dot'];
const HEROES = ['turntable', 'still', 'marquee'];

function applyCursor(cursor) {
  if (cursor === 'default') return '';
  if (cursor === 'crosshair') return 'crosshair';
  if (cursor === 'dot') {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='12' cy='12' r='5' fill='%23e2522a' stroke='%231b1b1b' stroke-width='2'/></svg>`;
    return `url("data:image/svg+xml;utf8,${svg}") 12 12, auto`;
  }
  return '';
}

// ─────────────────────────── nav ───────────────────────────
function Nav({ active, setActive, t, isMobile }) {
  const items = ['Index', 'About', 'Shipped', 'Loadout', 'Contact'];
  return (
    <div style={{ padding: isMobile ? '8px 16px' : '9px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid var(--ink)`, position: 'relative', zIndex: 5, background: 'var(--paper)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, fontFamily: '"DM Mono", monospace', fontSize: isMobile ? 10 : 11, color: 'var(--ink)', letterSpacing: '0.12em', textTransform: 'uppercase', minWidth: 0 }}>
        <span style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '4px 8px', fontWeight: 600 }}>SB</span>
        <span style={{ whiteSpace: 'nowrap' }}>Senne Bovée</span>
        {!isMobile && <span style={{ color: 'var(--accent)' }}>Prop artist · 3D generalist</span>}
      </div>
      <nav style={{ display: 'flex', gap: isMobile ? 12 : 22, fontFamily: '"Space Grotesk", sans-serif', fontSize: isMobile ? 11 : 13, fontWeight: 500, alignItems: 'center', overflowX: 'auto' }}>
        {items.map((name) =>
        <button
          key={name}
          onClick={() => setActive(name)}
          style={{
            background: 'transparent',
            color: 'var(--ink)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
            padding: '2px 0',
            borderBottom: active === name ? `2px solid var(--accent)` : `2px solid transparent`
          }}>
          {name}</button>
        )}
        <a href="assets/CV.pdf" download style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '5px 12px', textDecoration: 'none' }}>CV ↓</a>
      </nav>
    </div>);

}

// ─────────────────────────── hero ───────────────────────────
function Hero({ projects, t, hover, isMobile }) {
  const hero = projects[0];
  const [rot, setRot] = React.useState(0);
  const drag = React.useRef(null);
  const onDown = (e) => {drag.current = { x: e.clientX, rot };e.preventDefault();};
  React.useEffect(() => {
    const onMove = (e) => {if (drag.current) setRot(drag.current.rot + (e.clientX - drag.current.x) * 0.6);};
    const onUp = () => {drag.current = null;};
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {window.removeEventListener('mousemove', onMove);window.removeEventListener('mouseup', onUp);};
  }, []);

  // marquee variant cycles the projects
  const [marqueeIdx, setMarqueeIdx] = React.useState(0);
  React.useEffect(() => {
    if (t.hero !== 'marquee') return;
    const id = setInterval(() => setMarqueeIdx((i) => (i + 1) % projects.length), 2200);
    return () => clearInterval(id);
  }, [t.hero, projects.length]);
  const marqueeProject = projects[marqueeIdx];

  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];

  return (
    <div style={{ position: 'relative', padding: isMobile ? '16px 20px 18px' : '8px 48px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 0.95fr', gap: isMobile ? 14 : 28, alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 8, opacity: 0.65 }}>PORTFOLIO</div>
          <h1 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: isMobile ? 64 : 116, lineHeight: 0.82, color: 'var(--ink)', margin: 0, letterSpacing: df.tracking, textTransform: df.transform }}>
            Senne<br />
            <span style={{ color: 'var(--accent)' }}>
              Bovée<sup style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, fontWeight: 500, color: 'var(--ink)', verticalAlign: 'top', marginLeft: 8, letterSpacing: 0, textTransform: 'uppercase' }}></sup>
            </span>
          </h1>
          <div style={{ marginTop: 10, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 3, background: 'var(--accent)', alignSelf: 'stretch' }} />
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: isMobile ? 13 : 14, lineHeight: 1.45, color: 'var(--ink)', margin: 0, maxWidth: 420 }}>
              <strong></strong> I’m a prop artist and 3D generalist with experience across the full 3D pipeline, from modeling and texturing to lighting and rendering. I’m passionate about making games and bringing my ideas to life.
            </p>
          </div>
          {/* meta strip */}
          <div style={{ marginTop: 12, display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 22, fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: `1px solid var(--ink)`, paddingTop: 8 }}>
            <span><span style={{ opacity: 0.55 }}>Based in</span> Antwerp, Belgium</span>
            <span><span style={{ opacity: 0.55 }}>Available from</span> <span style={{ color: 'var(--accent)' }}>June 2026</span></span>
            <span style={{ marginLeft: 'auto', opacity: 0.65 }}>ArtStation · Sketchfab · itch.io</span>
          </div>
        </div>

        {/* hero variant — hidden on mobile */}
        {!isMobile &&
        <div style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          {/* stacked paper offsets — only for still/marquee variants; turntable is on transparent bg */}
          {t.hero !== 'turntable' && <div style={{ position: 'absolute', width: 320, height: 380, background: 'var(--accent2)', transform: 'translate(14px, 14px) rotate(-3deg)' }} />}
          {t.hero !== 'turntable' && <div style={{ position: 'absolute', width: 320, height: 380, background: 'var(--accent3)', transform: 'translate(8px, 8px) rotate(2deg)' }} />}

          {t.hero === 'turntable' &&
          <div style={{ position: 'relative', width: 380, height: 380, background: 'transparent' }}>
              <babylon-viewer
              ref={(el) => {
                if (!el || el._wired) return;
                el._wired = true;
                const setup = () => {
                  try {
                    const cam = el.viewerDetails && el.viewerDetails.camera;
                    if (!cam) return false;
                    // Orthographic
                    cam.mode = 1;
                    // Zoom in further — tighter framing
                    if (!cam._zoomed) {
                      cam.radius = (cam.radius || 4) / 5;
                      cam._zoomed = true;
                    }
                    const r = cam.radius;
                    const aspect = el.clientWidth / el.clientHeight || 1;
                    const size = r * 0.60; // ~9% smaller visual scale
                    const yShift = size * 0.10; // pan view up → model sits lower in frame
                    cam.orthoTop = size + yShift;
                    cam.orthoBottom = -size + yShift;
                    cam.orthoLeft = -size * aspect;
                    cam.orthoRight = size * aspect;
                    if (!cam._spun) {
                      cam.alpha = (cam.alpha || 0) + Math.PI / 2;
                      cam._spun = true;
                    }
                    if (el.viewerDetails.scene) {
                      el.viewerDetails.scene.clearColor.set(0, 0, 0, 0);
                    }
                    // Pointer-driven tilt (inverted, halved) + idle oscillation
                    cam._baseAlpha = cam.alpha;
                    cam._baseBeta = cam.beta;
                    cam._targetAlpha = cam.alpha;
                    cam._targetBeta = cam.beta;
                    let pNx = 0,pNy = 0;
                    const onMove = (e) => {
                      pNx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
                      pNy = e.clientY / window.innerHeight - 0.5;
                    };
                    const onLeave = () => {pNx = 0;pNy = 0;};
                    window.addEventListener('pointermove', onMove);
                    window.addEventListener('pointerleave', onLeave);
                    window.addEventListener('blur', onLeave);
                    el._cleanup = () => {
                      window.removeEventListener('pointermove', onMove);
                      window.removeEventListener('pointerleave', onLeave);
                      window.removeEventListener('blur', onLeave);
                    };
                    // Rim lights are now baked into the GLB via KHR_lights_punctual,
                    // so no JS-side light setup needed here anymore.
                    // Material setup (textures, glass alpha-blend, unlit screen) is now
                    // authored directly in the GLB — no JS-side material manipulation needed.

                    // Fake the screen glow with a small green PointLight placed in front
                    // of the screen area. Position is derived from the loaded model's
                    // bounding box (screen sits roughly upper-center, front face).
                    // — REMOVED at user request: light + bloom not producing desired effect.
                    // Smooth ease loop — cursor-driven (inverted + halved) plus idle oscillation
                    const t0 = performance.now();
                    const tick = () => {
                      if (!el.isConnected) {if (el._cleanup) el._cleanup();return;}
                      const t = (performance.now() - t0) / 1000;
                      const oscA = Math.sin(t * 0.5) * 0.16; // horizontal
                      const oscB = Math.cos(t * 0.5) * 0.12; // vertical, 90° out of phase → circular
                      cam._targetAlpha = cam._baseAlpha + oscA - pNx * 0.45;
                      cam._targetBeta = cam._baseBeta + oscB - pNy * 0.225;
                      const k = 0.12;
                      cam.alpha += (cam._targetAlpha - cam.alpha) * k;
                      cam.beta += (cam._targetBeta - cam.beta) * k;
                      requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    return true;
                  } catch (e) {return false;}
                };
                let tries = 0;
                const id = setInterval(() => {
                  if (setup() || ++tries > 80) clearInterval(id);
                }, 150);
              }}
              source="assets/walkie-talkie.glb"
              environment-lighting="assets/leadenhall_market_1k.hdr"
              tone-mapping="neutral"
              exposure="1.1"
              clear-color="0 0 0 0"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: 'transparent', pointerEvents: 'none' }}>
              </babylon-viewer>
            </div>
          }

          {t.hero === 'still' &&
          <div style={{ position: 'relative', width: 320, height: 380, background: 'var(--paperSoft)', border: `2px solid var(--ink)` }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, var(--accent) 0%, transparent 60%)`, opacity: 0.2, mixBlendMode: 'multiply' }} />
              <image-slot id="hero-slot-still" placeholder="hero render — walkie-talkie" style={{ position: 'absolute', inset: 16, background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, display: 'block' }}></image-slot>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: 'var(--paper)', padding: '5px 10px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', transform: 'rotate(-2deg)' }}>Featured · 80.lv</div>
            </div>
          }

          {t.hero === 'marquee' &&
          <div key={marqueeIdx} style={{ position: 'relative', width: 320, height: 380, background: 'var(--paperSoft)', border: `2px solid var(--ink)`, animation: 'rfade .5s ease' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, var(--accent) 0%, transparent 60%)`, opacity: 0.2, mixBlendMode: 'multiply' }} />
              <image-slot id={`hero-mq-${marqueeProject.id}`} placeholder={marqueeProject.title} style={{ position: 'absolute', inset: 16, background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, display: 'block' }}></image-slot>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: 'var(--paper)', padding: '5px 10px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', transform: 'rotate(-2deg)' }}>{String(marqueeIdx + 1).padStart(2, '0')} · {marqueeProject.tag}</div>
              <div style={{ position: 'absolute', bottom: -16, right: -16, background: 'var(--ink)', color: 'var(--paper)', padding: '6px 12px', fontFamily: df.stack, fontWeight: df.weight, fontSize: 18, maxWidth: 240, textAlign: 'right', textTransform: df.transform, letterSpacing: df.tracking }}>{marqueeProject.title}</div>
            </div>
          }

          {/* hint */}
          <div style={{ position: 'absolute', top: 12, right: -4, fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.55, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            {t.hero === 'turntable' ? 'Interactive 3D — follows cursor' : t.hero === 'marquee' ? 'Auto-playing reel' : 'Featured render'}
          </div>
        </div>
        }
      </div>
    </div>);

}

// ─────────────────────────── index (project grid) ───────────────────────────
function Index({ projects, onPick, t, appReady, isMobile }) {
  const grid = isMobile ?
  { cols: 1, rowH: 250, gap: 10, big: { c: 'span 1', r: 'span 1' }, small: { c: 'span 1', r: 'span 1' }, wide: { c: 'span 1', r: 'span 1' } } :
  GRID_DENSITIES[t.density] || GRID_DENSITIES.comfortable;
  const accents = ['var(--accent)', 'var(--accent3)', 'var(--accent2)', 'var(--accent3)', 'var(--accent)', 'var(--accent2)', 'var(--accent3)'];
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingLeft: isMobile ? 20 : 48, paddingRight: isMobile ? 20 : 48, marginBottom: 14 }}>
        <h2 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: isMobile ? 24 : 32, color: 'var(--ink)', margin: 0, letterSpacing: df.tracking, textTransform: df.transform, whiteSpace: 'nowrap' }}>
          Selected work <span style={{ color: 'var(--accent)' }}>/07</span>
        </h2>
        <div style={{ flex: 1, height: 0, borderTop: `2px solid var(--ink)` }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridAutoRows: `${grid.rowH}px`, gap: grid.gap, padding: isMobile ? '0 20px' : '0 48px' }}>
        {projects.map((p, i) => {
          const span = isMobile ? { c: 'span 1', r: 'span 1' } : i === 0 ? grid.big : i < 3 ? grid.small : grid.wide;
          return (
            <Tile key={p.id} project={p} idx={i} accent={accents[i % accents.length]} onPick={onPick} t={t} df={df}
            span={span} appReady={appReady} />);

        })}
      </div>
    </div>);

}

function Tile({ project: p, idx, accent, onPick, t, df, span, appReady }) {
  const [hover, setHover] = React.useState(false);
  const hoverStyle = (() => {
    if (!hover) return {};
    if (t.hover === 'lift') return { transform: 'translate(-3px, -3px)', boxShadow: '6px 6px 0 var(--ink)' };
    if (t.hover === 'invert') return { filter: 'invert(1) hue-rotate(180deg)' };
    if (t.hover === 'outline') return { boxShadow: `0 0 0 4px var(--accent)`, transform: 'translateY(-2px)' };
    return {};
  })();

  return (
    <button onClick={() => onPick(p)}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    className={appReady ? "tile-pop" : undefined}
    style={{
      gridColumn: span.c, gridRow: span.r,
      position: 'relative', background: 'var(--paperSoft)', border: `2px solid var(--ink)`, borderRadius: 14,
      padding: 0, cursor: 'inherit', fontFamily: 'inherit', textAlign: 'left', overflow: 'hidden',
      transition: 'transform .15s, box-shadow .15s, filter .15s',
      ...(appReady ? { animationDelay: `${idx * 0.09}s` } : { transform: 'scale(0)', opacity: 0 }),
      ...hoverStyle
    }}>
      
      <image-slot id={`riso-${p.id}-bg`} src={window.workImg(`riso-${p.id}-bg`)} placeholder={`${p.title} — banner`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, display: 'block', backgroundSize: "cover", backgroundPosition: "center center" }}></image-slot>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 30%, ${accent} 0%, transparent 60%)`, opacity: 0.18, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <image-slot id={`riso-${p.id}-fg`} src={window.workImg(`riso-${p.id}-fg`)} placeholder="Logo" fit="contain" style={{ position: 'absolute', top: 14, left: 14, background: 'transparent', display: 'block', zIndex: 2, height: "2px", width: "1px" }}></image-slot>
      <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--ink)', color: 'var(--paper)', padding: '3px 7px', fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.18em', pointerEvents: 'none' }}>0{idx + 1}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: `linear-gradient(0deg, var(--paper) 70%, transparent 100%)`, pointerEvents: 'none' }}>
        <div style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: idx === 0 ? 32 : 22, color: 'var(--ink)', lineHeight: 1, letterSpacing: df.tracking, textTransform: df.transform }}>{p.title}</div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.16em', color: accent, marginTop: 4, textTransform: 'uppercase' }}>{p.year} · {p.tag}</div>
      </div>
    </button>);

}

// ─────────────────────────── About / Shipped / Loadout / Contact ───────────────────────────
function About({ t }) {
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];
  return (
    <div style={{ padding: '24px 48px 36px', display: 'grid', gridTemplateColumns: '320px 1fr 1fr', gap: 32 }}>
      <div>
        <image-slot id="senne-portrait" placeholder="self portrait / studio photo" style={{ display: 'block', width: '100%', aspectRatio: '4/5', background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, border: `2px solid var(--ink)` }}></image-slot>
        <div style={{ marginTop: 10, fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink)', opacity: 0.65, textTransform: 'uppercase' }}>Portrait</div>
      </div>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>about</div>
        <h2 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 56, lineHeight: 0.9, color: 'var(--ink)', margin: '6px 0 14px', letterSpacing: df.tracking, textTransform: df.transform }}>
          A prop artist with a generalist's toolkit.
        </h2>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
          {window.SENNE.about}
        </p>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', margin: '14px 0 0' }}>
          I love the part of the pipeline where modeling, texturing and lighting meet — props are where all three have to behave. Outside of the box: previously a freelance graphic designer (Belgian Podcast Awards, Nanex), which is where the obsession with composition came from.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8 }}>milestones</div>
        <div style={{ borderTop: `1.5px solid var(--ink)` }}>
          {window.SENNE.awards.concat([
          { year: '2026', title: '3D Generalist Intern @ Granstudio', sub: 'procedural city builder for VR' },
          { year: '2025', title: 'Fluvia Fire Escape — shipped', sub: 'project lead' },
          { year: '2022', title: 'Started Game Graphics Production', sub: 'Howest DAE Kortrijk' }]
          ).sort((a, b) => b.year.localeCompare(a.year)).map((m, i) =>
          <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid var(--ink)`, display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.06em' }}>{m.year}</div>
              <div>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.2 }}>{m.title}</div>
                <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: 'var(--ink)', opacity: 0.7, marginTop: 2 }}>{m.sub}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

function Shipped({ t }) {
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];
  const games = [
  { title: 'Snails & Potions', where: 'Steam', tag: 'DAE Game Projects 2024 Winner', blurb: 'A two-player party game. Free on Steam.', accent: 'var(--accent)' },
  { title: 'Fluvia Fire Escape', where: 'Internal', tag: 'Project lead · 2025', blurb: 'Serious game for fire-escape protocol training.', accent: 'var(--accent3)' },
  { title: 'GraviTag', where: 'itch.io', tag: 'Unwrap Gamejam · 2024', blurb: 'Gamejam entry — modeling & UI.', accent: 'var(--accent2)' }];

  return (
    <div style={{ padding: '24px 48px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 36, color: 'var(--ink)', margin: 0, letterSpacing: df.tracking, textTransform: df.transform }}>
          Shipped games <span style={{ color: 'var(--accent)' }}>/03</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {games.map((g, i) =>
        <div key={i} style={{ position: 'relative', background: 'var(--paperSoft)', border: `2px solid var(--ink)`, padding: 18 }}>
            <image-slot id={`shipped-${i}`} placeholder={`${g.title} key art`} style={{ display: 'block', width: '100%', aspectRatio: '16/9', background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, border: `1.5px solid var(--ink)` }}></image-slot>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: g.accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{g.where}</div>
              <div style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 28, color: 'var(--ink)', lineHeight: 1, marginTop: 4, letterSpacing: df.tracking, textTransform: df.transform }}>{g.title}</div>
              <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: 'var(--ink)', opacity: 0.7, marginTop: 6 }}>{g.tag}</div>
              <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, color: 'var(--ink)', marginTop: 8, lineHeight: 1.45 }}>{g.blurb}</div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <a href="#" style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, background: 'var(--ink)', color: 'var(--paper)', padding: '6px 12px', textDecoration: 'none', letterSpacing: '0.1em' }}>play ↗</a>
                <a href="#" style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, background: 'transparent', color: 'var(--ink)', padding: '6px 12px', textDecoration: 'none', border: `1.5px solid var(--ink)`, letterSpacing: '0.1em' }}>devlog</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

function Loadout({ t }) {
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];
  const tierColors = { daily: 'var(--accent)', often: 'var(--accent3)', sometimes: 'var(--ink)' };
  const tierLabels = { daily: 'daily driver', often: 'often', sometimes: 'sometimes' };
  return (
    <div style={{ padding: '24px 48px 32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 28 }}>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>loadout</div>
        <h2 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 56, lineHeight: 0.9, color: 'var(--ink)', margin: '6px 0 14px', letterSpacing: df.tracking, textTransform: df.transform }}>
          Software & strengths.
        </h2>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, lineHeight: 1.55, color: 'var(--ink)' }}>
          The tools I work in daily, organised by usage. The DAE curriculum means I'm comfortable jumping between them mid-project — but I prioritise depth in the ones I use most.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', opacity: 0.65, textTransform: 'uppercase', marginBottom: 8 }}>software</div>
        {window.SENNE.software.map((s, i) =>
        <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', padding: '10px 0', borderTop: `1px solid var(--ink)` }}>
            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 16, color: 'var(--ink)', fontWeight: 600 }}>{s.name}</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: tierColors[s.tier] }}>◆ {tierLabels[s.tier]}</div>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', opacity: 0.65, textTransform: 'uppercase', marginBottom: 8 }}>strengths</div>
        {[
        { k: 'Hard-surface props', v: 'modeling → bake → PBR' },
        { k: 'Stylised props', v: 'sculpt to handpaint' },
        { k: 'Texturing', v: 'Substance, real-material research' },
        { k: 'Lighting & rendering', v: 'Marmoset, Unreal, Maya' },
        { k: 'UI & layout', v: 'graphic design background' }].
        map((s, i) =>
        <div key={s.k} style={{ padding: '10px 0', borderTop: `1px solid var(--ink)` }}>
            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{s.k}</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.65, letterSpacing: '0.05em', marginTop: 3 }}>{s.v}</div>
          </div>
        )}
        <div style={{ marginTop: 14, fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Languages · Dutch (native) · English (C1) · French (B2)
        </div>
      </div>
    </div>);

}

function Contact({ t }) {
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];
  return (
    <div style={{ padding: '24px 48px 36px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>contact</div>
        <h2 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 88, lineHeight: 0.88, color: 'var(--ink)', margin: '6px 0 18px', letterSpacing: df.tracking, textTransform: df.transform }}>
          Get in <span style={{ color: 'var(--accent)' }}>touch</span>.
        </h2>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 16, lineHeight: 1.55, color: 'var(--ink)', maxWidth: 520 }}>
          Looking for a junior prop / 3D generalist role where visual creative work is part of the day. Available from June 2026, based in Belgium, open to relocation within the EU.
        </p>
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 18px', fontFamily: '"DM Mono", monospace', fontSize: 13, color: 'var(--ink)' }}>
          <span style={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase' }}>email</span><a href={`mailto:${window.SENNE.email}`} style={{ color: 'var(--ink)' }}>{window.SENNE.email}</a>
          <span style={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase' }}>phone</span><span>{window.SENNE.phone}</span>
          <span style={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase' }}>artstation</span><a href="#" style={{ color: 'var(--accent)' }}>{window.SENNE.links.artstation}</a>
          <span style={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase' }}>itch.io</span><a href="#" style={{ color: 'var(--accent)' }}>{window.SENNE.links.itch}</a>
          <span style={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase' }}>sketchfab</span><a href="#" style={{ color: 'var(--accent)' }}>{window.SENNE.links.sketchfab}</a>
        </div>
      </div>
      <div style={{ background: 'var(--paperSoft)', border: `2px solid var(--ink)`, padding: 24, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: 14, background: 'var(--paper)', padding: '0 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>Say hello</div>
        <div style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 26, color: 'var(--ink)', lineHeight: 1, letterSpacing: df.tracking, textTransform: df.transform }}>I'd love to hear from you.</div>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, lineHeight: 1.5, color: 'var(--ink)', margin: '10px 0 16px' }}>
          I reply within a day. For art directors and recruiters, I'm happy to send a PDF portfolio with full breakdown notes on request.
        </p>
        <button style={{ width: '100%', background: 'var(--ink)', color: 'var(--paper)', border: 'none', padding: '12px', fontFamily: '"DM Mono", monospace', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', cursor: 'inherit', textTransform: 'uppercase' }}>Send a message →</button>
        <button style={{ marginTop: 8, width: '100%', background: 'var(--paper)', color: 'var(--ink)', border: `1.5px solid var(--ink)`, padding: '12px', fontFamily: '"DM Mono", monospace', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', cursor: 'inherit', textTransform: 'uppercase' }}>Download CV ↓</button>
      </div>
    </div>);

}

// ─────────────────────────── spread overlay ───────────────────────────
function Expand({ project, onClose, t }) {
  if (!project) return null;
  const df = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS['Anton'];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,27,27,0.88)', zIndex: 100, padding: 32 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--paper)', border: `2px solid var(--ink)`, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1.3fr 1fr', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 12, background: 'var(--accent)', border: `1.5px solid var(--ink)`, color: 'var(--paper)', fontSize: 13, padding: '4px 10px', cursor: 'inherit', fontFamily: '"DM Mono", monospace', letterSpacing: '0.12em', zIndex: 1 }}>close ×</button>
        <div style={{ padding: 22, borderRight: `2px solid var(--ink)`, overflow: 'auto', height: "10000px" }}>
          <image-slot id={`riso-${project.id}-big`} placeholder={`${project.title} — beauty shot`} style={{ width: '100%', aspectRatio: '4/3', background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 8px, var(--paper) 8px, var(--paper) 16px)`, display: 'block', border: `1.5px solid var(--ink)` }}></image-slot>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
            {[1, 2, 3].map((i) =>
            <image-slot key={i} id={`riso-${project.id}-x${i}`} placeholder={`breakdown ${i}`} style={{ width: '100%', aspectRatio: '1/1', background: `repeating-linear-gradient(45deg, var(--paperSoft), var(--paperSoft) 6px, var(--paper) 6px, var(--paper) 12px)`, display: 'block', border: `1.5px solid var(--ink)` }}></image-slot>
            )}
          </div>
        </div>
        <div style={{ padding: 28, overflow: 'auto' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>Case study</div>
          <h3 style={{ fontFamily: df.stack, fontWeight: df.weight, fontSize: 64, lineHeight: 0.9, margin: '6px 0 4px', color: 'var(--ink)', letterSpacing: df.tracking, textTransform: df.transform }}>{project.title}</h3>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{project.year} · {project.kind}</div>
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, lineHeight: 1.55, marginTop: 18, color: 'var(--ink)' }}>{project.blurb}</p>
          <div style={{ marginTop: 22, fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink)', opacity: 0.55, textTransform: 'uppercase' }}>built with</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.software.map((s) => <span key={s} style={{ padding: '4px 10px', background: 'var(--ink)', color: 'var(--paper)', fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.06em' }}>{s}</span>)}
          </div>
          <div style={{ marginTop: 28, padding: 16, border: `1.5px dashed var(--ink)`, fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: 'var(--ink)' }}>
            <strong>Process</strong> — Blockout → high poly → retopo → bake → texture. Process notes and breakdown captions will sit here.
          </div>
        </div>
      </div>
    </div>);

}

// ─────────────────────────── main app ───────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "midnight",
  "displayFont": "Anton",
  "density": "comfortable",
  "hero": "turntable",
  "hover": "lift",
  "cursor": "default",
  "bgTop": "#f1ebde",
  "bgBottom": "#d99a3a"
} /*EDITMODE-END*/;

function useIsMobile(breakpoint = 760) {
  const [mobile, setMobile] = React.useState(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);
  return mobile;
}

function Splash({ onDone }) {
  const [progress, setProgress] = React.useState(0); // 0..1
  const [fading, setFading] = React.useState(false);
  const fillRef = React.useRef(null);

  React.useEffect(() => {
    const start = performance.now();
    const minMs = 1800; // hold at least 1.8s for animation to read
    const ceilMs = 2800; // soft progress reaches ~0.92 by here, then waits for model
    const safetyMs = 9000; // hard cap
    let modelLoaded = false;
    let rafId, doneTimer, safetyTimer;

    const checkModel = () => {
      const el = document.querySelector('babylon-viewer');
      if (el && el.viewerDetails && el.viewerDetails.model) modelLoaded = true;
    };

    const tick = () => {
      checkModel();
      const t = performance.now() - start;
      // Soft progress curve — eased ramp that asymptotes at 0.92 until model loads,
      // then snaps to 1.0 and we fade out.
      let p;
      if (modelLoaded && t >= minMs) {
        p = 1;
      } else {
        // ease-out toward 0.92 over ceilMs
        const x = Math.min(t / ceilMs, 1);
        p = (1 - Math.pow(1 - x, 2)) * 0.92;
      }
      setProgress(p);
      if (p >= 1) {
        // brief beat at 100%, then trigger fade
        doneTimer = setTimeout(() => {
          setFading(true);
          setTimeout(() => onDone && onDone(), 560);
        }, 220);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    safetyTimer = setTimeout(() => {
      modelLoaded = true; // give up waiting
    }, safetyMs);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(doneTimer);
      clearTimeout(safetyTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash${fading ? ' splash-fade' : ''}`} aria-hidden="true">
      <div className="splash-stack">
        <div className="splash-logo">
          <div className="layer track"></div>
          <div
            ref={fillRef}
            className="layer fill"
            style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}>
          </div>
        </div>
      </div>
    </div>);

}

function Site() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [section, setSection] = React.useState('Index');
  const [open, setOpen] = React.useState(null);
  const [appReady, setAppReady] = React.useState(false);
  const isMobile = useIsMobile(760);
  const ps = window.SENNE.projects;

  const palette = PALETTES[t.palette] || PALETTES.classic;
  const [paper, ink, accent, accent2, accent3] = palette;
  const paperSoft = palette === PALETTES.midnight ?
  '#1f2128' :
  palette === PALETTES.mono ?
  '#e8e0cd' :
  '#e8e0cd';

  const cursorVal = applyCursor(t.cursor);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--paper', paper);
    root.style.setProperty('--paperSoft', paperSoft);
    root.style.setProperty('--ink', ink);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent2', accent2);
    root.style.setProperty('--accent3', accent3);
  }, [paper, ink, accent, accent2, accent3, paperSoft]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)', cursor: cursorVal || 'auto' }}>
      {!appReady && <Splash onDone={() => setAppReady(true)} />}
      <div style={{ minWidth: isMobile ? 0 : 1280, maxWidth: 1920, margin: '0 auto', position: 'relative' }}>
        {/* subtle grain */}
        {/* gradient overlay removed */}
        <Nav active={section} setActive={setSection} t={t} isMobile={isMobile} />
        <Hero projects={ps} t={t} isMobile={isMobile} />
        {section === 'Index' && <Index projects={ps} onPick={setOpen} t={t} appReady={appReady} isMobile={isMobile} />}
        {section === 'About' && <About t={t} />}
        {section === 'Shipped' && <Shipped t={t} />}
        {section === 'Loadout' && <Loadout t={t} />}
        {section === 'Contact' && <Contact t={t} />}

        {/* footer strip */}
        <div style={{ padding: isMobile ? '12px 20px' : '12px 48px', borderTop: `2px solid var(--ink)`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 4 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>© Senne Bovée · 2026</span>
          <span>Antwerp · Belgium</span>
          <span>bovee.senne@gmail.com</span>
        </div>
      </div>

      <Expand project={open} onClose={() => setOpen(null)} t={t} />

      {/* ── Tweaks ────────────────────────────────────────────── */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="Theme"
            value={PALETTES[t.palette]}
            options={Object.values(PALETTES)}
            onChange={(p) => {
              const key = Object.keys(PALETTES).find((k) => PALETTES[k] === p) || 'classic';
              setTweak('palette', key);
            }} />
          
        </TweakSection>

        <TweakSection label="Typography">
          <TweakSelect label="Display font" value={t.displayFont} options={Object.keys(DISPLAY_FONTS)} onChange={(v) => setTweak('displayFont', v)} />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio label="Grid density" value={t.density} options={['compact', 'comfortable', 'spacious']} onChange={(v) => setTweak('density', v)} />
        </TweakSection>

        <TweakSection label="Hero">
          <TweakRadio label="Variant" value={t.hero} options={['turntable', 'still', 'marquee']} onChange={(v) => setTweak('hero', v)} />
          <TweakColor label="Background top" value={t.bgTop} options={['#f1ebde', '#e8e0cd', '#1b1b1b', '#e2522a', '#235e64', '#d99a3a']} onChange={(v) => setTweak('bgTop', v)} />
          <TweakColor label="Background bottom" value={t.bgBottom} options={['#d99a3a', '#e2522a', '#235e64', '#1b1b1b', '#f1ebde', '#7b3a8a']} onChange={(v) => setTweak('bgBottom', v)} />
        </TweakSection>

        <TweakSection label="Interactions">
          <TweakRadio label="Hover" value={t.hover} options={['lift', 'invert', 'outline']} onChange={(v) => setTweak('hover', v)} />
          <TweakRadio label="Cursor" value={t.cursor} options={['default', 'crosshair', 'dot']} onChange={(v) => setTweak('cursor', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

window.SenneSite = Site;
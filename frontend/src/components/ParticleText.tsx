'use client';
import { useEffect, useRef, useCallback } from 'react';

/* ─── Types ─── */
interface Particle {
  x: number;
  y: number;
  pactX: number;
  pactY: number;
  tagX: number;
  tagY: number;
  // Cursor interaction offset (additive, decays)
  cx: number;
  cy: number;
  radius: number;
  baseRadius: number;
  color: string;
  scatterX: number;
  scatterY: number;
  type: 'shared' | 'pactOnly' | 'child';
  parentIdx: number;
  spawnT: number;
}

/* ─── Helpers ─── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sampleText(
  lines: string[],
  fontSize: number,
  W: number,
  H: number,
  gap: number
): { x: number; y: number }[] {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${fontSize}px "Arial Black", Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lh = fontSize * 1.2;
  const total = lines.length * lh;
  const y0 = H / 2 - total / 2 + lh / 2;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lh));

  const d = ctx.getImageData(0, 0, W, H).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += gap) {
    for (let x = 0; x < W; x += gap) {
      if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }
  return pts;
}

/* ─── Component ─── */
export default function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const progressRef = useRef(0);
  const readyRef = useRef(false);

  const build = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Sample PACT ──
    const pactFS = Math.min(W * 0.24, 240);
    const pactGap = Math.max(5, Math.floor(pactFS / 28));
    const pactPts = shuffle(sampleText(['PACT'], pactFS, W, H, pactGap));

    // ── Sample tagline — keep densifying until we have enough ──
    const tagFS = Math.min(W * 0.075, 85);
    let tagGap = Math.max(3, Math.floor(tagFS / 18));
    let tagPts = shuffle(sampleText(['Trust verified', 'in seconds.'], tagFS, W, H, tagGap));

    while (tagPts.length < pactPts.length && tagGap > 2) {
      tagGap--;
      tagPts = shuffle(
        sampleText(['Trust verified', 'in seconds.'], tagFS, W, H, tagGap)
      );
    }

    console.log(
      `[ParticleHero] PACT: ${pactPts.length} pts (gap ${pactGap}), Tag: ${tagPts.length} pts (gap ${tagGap})`
    );

    const particles: Particle[] = [];
    const sharedN = Math.min(pactPts.length, tagPts.length);

    // 1) Shared particles — mapped between both states
    for (let i = 0; i < sharedN; i++) {
      particles.push(mk(pactPts[i], tagPts[i], 'shared', -1, 0, pactGap, W, H));
    }

    // 2) Extra PACT particles — scatter off-screen during transition
    for (let i = sharedN; i < pactPts.length; i++) {
      particles.push(
        mk(
          pactPts[i],
          {
            x: W / 2 + (Math.random() - 0.5) * W,
            y: H + 80 + Math.random() * 200,
          },
          'pactOnly',
          -1,
          0,
          pactGap,
          W,
          H
        )
      );
    }

    // 3) Extra tagline particles — multiply/spawn from existing PACT particles
    for (let i = sharedN; i < tagPts.length; i++) {
      const parentIdx = Math.floor(Math.random() * Math.max(1, sharedN));
      const spawnT = 0.05 + Math.random() * 0.4;
      particles.push(
        mk(
          pactPts[parentIdx] || { x: W / 2, y: H / 2 },
          tagPts[i],
          'child',
          parentIdx,
          spawnT,
          pactGap,
          W,
          H
        )
      );
    }

    particlesRef.current = particles;
    readyRef.current = true;
  }, []);

  function mk(
    pact: { x: number; y: number },
    tag: { x: number; y: number },
    type: Particle['type'],
    parentIdx: number,
    spawnT: number,
    gap: number,
    W: number,
    H: number
  ): Particle {
    const hue = 240; // Purple-Blue hue for #5C5CFF
    const sat = 100;
    const lgt = 68;
    const r = (gap / 2) * 0.55 + Math.random() * 0.4;

    return {
      x: pact.x,
      y: pact.y,
      pactX: pact.x,
      pactY: pact.y,
      tagX: tag.x,
      tagY: tag.y,
      cx: 0,
      cy: 0,
      radius: r,
      baseRadius: r,
      color: `#5C5CFF`, // Direct hex as requested
      // Scatter: random in all directions, with slight downward bias
      scatterX: (Math.random() - 0.5) * W * 0.4,
      scatterY: (Math.random() - 0.3) * H * 0.35,
      type,
      parentIdx,
      spawnT,
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    build();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (mouseRef.current = { x: -9999, y: -9999 });

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      progressRef.current = Math.max(0, Math.min(1, -r.top / scrollable));
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    onScroll();

    /* ── Animation Loop ── */
    const loop = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !readyRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);

      const prog = progressRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      /* ── Scroll phases ──
         0.00–0.08  PACT formed, cursor interactive
         0.08–0.60  morph: PACT → scatter → tagline
         0.60–0.85  tagline formed
         0.85–1.00  fade out                          */

      let morphT = 0;
      if (prog > 0.08) morphT = Math.min(1, (prog - 0.08) / 0.52);
      const easedM = easeInOutCubic(morphT);

      // Scatter peaks at transition midpoint
      const scatter = Math.sin(morphT * Math.PI) * 0.55;

      // Cursor strength fades as morph begins
      const cursorStr = Math.max(0, 1 - morphT * 3);

      // Fade out at the very end
      let globalA = 1;
      if (prog > 0.85) globalA = Math.max(0, 1 - (prog - 0.85) / 0.15);

      const intR = 130;
      const pushF = 10;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── Child visibility ──
        let alpha = 1;
        if (p.type === 'child') {
          const childT = (morphT - p.spawnT) / Math.max(0.01, 1 - p.spawnT);
          if (childT <= 0) continue; // not born yet
          alpha = Math.min(1, childT * 2.5);
        }
        if (p.type === 'pactOnly' && morphT > 0.6) {
          alpha = Math.max(0, 1 - (morphT - 0.6) / 0.4);
        }
        alpha *= globalA;
        if (alpha < 0.01) continue;

        // ── Compute base position (DIRECT interpolation — no spring lag) ──
        const baseX =
          p.pactX + (p.tagX - p.pactX) * easedM + p.scatterX * scatter;
        const baseY =
          p.pactY + (p.tagY - p.pactY) * easedM + p.scatterY * scatter;

        // ── Cursor interaction (additive offset that decays) ──
        if (cursorStr > 0.05) {
          const dx = (baseX + p.cx) - mouse.x;
          const dy = (baseY + p.cy) - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < intR * intR) {
            const dist = Math.sqrt(d2);
            const f = ((intR - dist) / intR) * cursorStr;
            const a = Math.atan2(dy, dx);
            p.cx += Math.cos(a) * f * pushF;
            p.cy += Math.sin(a) * f * pushF;
            p.radius = p.baseRadius * (1 + f * 2);
          } else {
            p.radius += (p.baseRadius - p.radius) * 0.12;
          }
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.12;
        }

        // Decay cursor offset
        p.cx *= 0.88;
        p.cy *= 0.88;

        // Final position: base + cursor offset
        p.x = baseX + p.cx;
        p.y = baseY + p.cy;

        // ── Draw ──
        ctx.globalAlpha = (0.72 + Math.random() * 0.04) * alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow on displaced dots
        const disp = Math.hypot(p.cx, p.cy);
        if (disp > 4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.globalAlpha = Math.min(0.18, disp * 0.005) * alpha;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // ── Scroll hint ──
      if (prog < 0.05) {
        const pulse = 0.35 + Math.sin(Date.now() / 700) * 0.35;
        ctx.fillStyle = `rgba(255,255,255,${pulse})`;
        ctx.font = '500 13px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scroll to explore', W / 2, H - 50);
        ctx.beginPath();
        ctx.moveTo(W / 2 - 7, H - 35);
        ctx.lineTo(W / 2, H - 28);
        ctx.lineTo(W / 2 + 7, H - 35);
        ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
    };
  }, [build]);

  /* ── Render ── */
  return (
    <div ref={wrapRef} style={{ height: '100vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030308]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] bg-[#5C5CFF]/10 blur-[120px] rounded-full" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-10"
          style={{ display: 'block', cursor: 'default' }}
        />
      </div>
    </div>
  );
}

'use client';
import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number; y: number;
  sourceX: number; sourceY: number;
  targetX: number; targetY: number;
  cx: number; cy: number;
  radius: number; baseRadius: number;
  scatterX: number; gravityDrop: number;
  delay: number;
  type: 'shared' | 'sourceOnly' | 'targetOnly';
  spawnT: number;
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(lines: string[], fs: number, W: number, H: number, gap: number) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${fs}px "Arial Black", Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lh = fs * 1.2;
  const total = lines.length * lh;
  const y0 = H / 2 - total / 2 + lh / 2; // Perfectly centered
  lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lh));
  const d = ctx.getImageData(0, 0, W, H).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += gap)
    for (let x = 0; x < W; x += gap)
      if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
  return pts;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const progRef = useRef(0);
  const smoothProgRef = useRef(0);
  const readyRef = useRef(false);

  const build = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pFS = Math.min(W * 0.24, 240);
    const pGap = Math.max(5, Math.floor(pFS / 28));
    const src = shuffle(sample(['PACT'], pFS, W, H, pGap));

    const tFS = Math.min(W * 0.075, 85);
    let tGap = Math.max(3, Math.floor(tFS / 18));
    let tgt = shuffle(sample(['Trust verified', 'in seconds.'], tFS, W, H, tGap));
    while (tgt.length < src.length && tGap > 2) {
      tGap--;
      tgt = shuffle(sample(['Trust verified', 'in seconds.'], tFS, W, H, tGap));
    }

    let minY = Infinity, maxY = -Infinity;
    for (const p of src) { if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; }
    const rangeY = maxY - minY || 1;

    const particles: Particle[] = [];
    const shared = Math.min(src.length, tgt.length);

    for (let i = 0; i < shared; i++) {
      const d = (1 - (src[i].y - minY) / rangeY) * 0.55;
      particles.push(mk(src[i], tgt[i], 'shared', d, 0, pGap, W, H));
    }
    for (let i = shared; i < src.length; i++) {
      const d = (1 - (src[i].y - minY) / rangeY) * 0.55;
      particles.push(mk(src[i], { x: src[i].x + (Math.random() - 0.5) * 300, y: H + 100 }, 'sourceOnly', d, 0, pGap, W, H));
    }
    for (let i = shared; i < tgt.length; i++) {
      const pi = Math.floor(Math.random() * Math.max(1, shared));
      const d = (1 - (src[pi].y - minY) / rangeY) * 0.55;
      particles.push(mk(src[pi], tgt[i], 'targetOnly', d, 0.15 + Math.random() * 0.4, pGap, W, H));
    }

    particlesRef.current = particles;
    readyRef.current = true;
  }, []);

  function mk(s: { x: number; y: number }, t: { x: number; y: number }, type: Particle['type'], delay: number, spawnT: number, gap: number, W: number, H: number): Particle {
    const r = (gap / 2) * 0.55 + Math.random() * 0.4;
    return {
      x: s.x, y: s.y, sourceX: s.x, sourceY: s.y, targetX: t.x, targetY: t.y,
      cx: 0, cy: 0, radius: r, baseRadius: r,
      scatterX: (Math.random() - 0.5) * W * 1.2,
      gravityDrop: H * 0.3 + Math.random() * H * 0.7,
      delay, type, spawnT,
    };
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    build();
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onScroll = () => { progRef.current = window.scrollY / window.innerHeight; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    onScroll();

    const loop = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !readyRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

      const dpr = window.devicePixelRatio || 1;
      const W = canvasRef.current!.width / dpr, H = canvasRef.current!.height / dpr;
      ctx.clearRect(0, 0, W, H);

      const rawProg = progRef.current;
      // Smooth the scroll progress (lerp toward real scroll)
      smoothProgRef.current += (rawProg - smoothProgRef.current) * 0.06;
      const prog = smoothProgRef.current;

      const mouse = mouseRef.current;
      const parts = particlesRef.current;
      const vh = window.innerHeight;

      // Calculate scrollOffset based on smooth prog
      const scrollOffset = prog > 1 ? (prog - 1) * vh : 0;

      // Fade out canvas only when reaching the very end of section 2
      let cAlpha = 1;
      if (prog > 1.8) cAlpha = Math.max(0, 1 - (prog - 1.8) / 0.2);
      if (cAlpha < 0.01) { rafRef.current = requestAnimationFrame(loop); return; }

      const cursorStr = Math.max(0, 1 - prog * 5);

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // Per-particle staggered progress
        const rawT = Math.max(0, Math.min(1, (prog - p.delay) / (1 - p.delay)));
        const t = ease(rawT);
        const arc = t * (1 - t) * 4; // Parabolic gravity arc, peaks at t=0.5

        // Alpha
        let alpha = 1;
        if (p.type === 'sourceOnly') alpha = Math.max(0, 1 - rawT * 2);
        else if (p.type === 'targetOnly') {
          alpha = rawT > p.spawnT ? Math.min(1, (rawT - p.spawnT) / (1 - p.spawnT) * 2.5) : 0;
        }
        alpha *= cAlpha;
        if (alpha < 0.01) continue;

        // Position: lerp + gravity arc
        const baseX = p.sourceX + (p.targetX - p.sourceX) * t + p.scatterX * arc * 0.5;
        const baseY = p.sourceY + (p.targetY - p.sourceY) * t + p.gravityDrop * arc;

        // Cursor interaction
        if (cursorStr > 0.05) {
          const dx = (baseX + p.cx) - mouse.x, dy = (baseY + p.cy) - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16900) { // 130^2
            const dist = Math.sqrt(d2);
            const f = ((130 - dist) / 130) * cursorStr;
            const a = Math.atan2(dy, dx);
            p.cx += Math.cos(a) * f * 10;
            p.cy += Math.sin(a) * f * 10;
            p.radius = p.baseRadius * (1 + f * 2);
          } else p.radius += (p.baseRadius - p.radius) * 0.12;
        } else p.radius += (p.baseRadius - p.radius) * 0.12;

        p.cx *= 0.88; p.cy *= 0.88;

        // Add a tiny bit of floating noise for that "premium" feel
        const time = Date.now() / 1000;
        const driftX = Math.sin(time + i) * 0.3;
        const driftY = Math.cos(time * 0.7 + i) * 0.3;

        // Final position: include scrollOffset to move with page
        p.x = baseX + p.cx + driftX;
        p.y = baseY + p.cy - scrollOffset + driftY;

        // Draw
        ctx.globalAlpha = (0.72 + Math.random() * 0.04) * alpha;
        ctx.fillStyle = '#5C5CFF';
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

      // Scroll hint
      if (prog < 0.04) {
        const pulse = 0.35 + Math.sin(Date.now() / 700) * 0.35;
        ctx.fillStyle = `rgba(255,255,255,${pulse})`;
        ctx.font = '500 13px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scroll to explore', W / 2, H - 50);
        ctx.beginPath();
        ctx.moveTo(W / 2 - 7, H - 35); ctx.lineTo(W / 2, H - 28); ctx.lineTo(W / 2 + 7, H - 35);
        ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
        ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
    };
  }, [build]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-20 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}

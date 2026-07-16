'use client';

import { useEffect, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- typewriter ---------- */
export function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reduced()) return;
    let i = 0;
    let chars = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const word = words[i];
      if (deleting) {
        chars--;
        if (chars === 0) {
          deleting = false;
          i = (i + 1) % words.length;
        }
      } else {
        chars++;
        if (chars === words[i].length) {
          deleting = true;
          setText(words[i].slice(0, chars));
          timer = setTimeout(tick, 2100);
          return;
        }
      }
      setText(words[i].slice(0, chars));
      timer = setTimeout(tick, deleting ? 42 : 74);
    }
    timer = setTimeout(tick, 2000);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <div className="typeline" aria-label={`I build ${words.join(', ')}`}>
      I build <strong>{text}</strong>
      <span className="caret" aria-hidden="true">
        ▍
      </span>
    </div>
  );
}

/* ---------- confetti burst on नमस्ते ---------- */
export function Namaste() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function burst(e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas || reduced()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const styles = getComputedStyle(document.documentElement);
    const colors = ['--mango', '--rhodo', '--teal'].map((v) =>
      styles.getPropertyValue(v).trim()
    );
    const cx = e.clientX;
    const cy = e.clientY;
    const parts = Array.from({ length: 90 }, () => {
      const a = Math.random() * Math.PI * 2;
      const v = 4 + Math.random() * 9;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 3,
        r: 3 + Math.random() * 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
      };
    });

    let raf = 0;
    function frame() {
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.011;
        if (p.life <= 0) continue;
        alive = true;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.globalAlpha = Math.max(p.life, 0);
        ctx!.fillStyle = p.c;
        ctx!.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx!.restore();
      }
      if (alive) raf = requestAnimationFrame(frame);
      else ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  return (
    <>
      <button className="namaste pop" style={{ ['--d' as string]: '0s' }} onClick={burst}>
        नमस्ते 🙏 click me
      </button>
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
    </>
  );
}

/* ---------- live Kathmandu clock ---------- */
export function KtmClock() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="clock">{time}</div>;
}

/* ---------- scroll progress bar ---------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={ref} className="progress" aria-hidden="true" />;
}

/* ---------- cursor-following gradient blob ---------- */
export function CursorBlob() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced()) return;
    const el = ref.current;
    if (!el) return;
    let x = -500;
    let y = -500;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    function frame() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el!.style.left = `${x}px`;
      el!.style.top = `${y}px`;
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-blob" aria-hidden="true" />;
}

/* ---------- scroll reveal ---------- */
export function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
}: {
  as?: 'div' | 'ul' | 'section';
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      style={{ ['--d' as string]: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

/* ---------- 3D tilt wrapper ---------- */
export function Tilt({
  className = '',
  accent,
  children,
}: {
  className?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    if (reduced()) return;
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-3px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <div
      ref={ref}
      className={className}
      data-accent={accent}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)' }}
    >
      {children}
    </div>
  );
}

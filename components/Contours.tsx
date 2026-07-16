'use client';

import { useEffect, useRef } from 'react';

export default function Contours() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let t = 0;
    let raf = 0;

    const css = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // layered pseudo-noise ridge line
    function ridge(x: number, seed: number) {
      return (
        Math.sin(x * 0.0032 + seed * 2.1 + t * 0.12) +
        0.55 * Math.sin(x * 0.0071 + seed * 4.7 - t * 0.08) +
        0.28 * Math.sin(x * 0.0163 + seed * 9.3 + t * 0.05)
      );
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const lines = 14;
      const ink = css('--ink') || '#1c1f26';
      const accent = css('--accent') || '#a86118';
      const dark = document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      for (let i = 0; i < lines; i++) {
        const yBase = H * (0.18 + (i / lines) * 0.95);
        ctx!.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const y = yBase + ridge(x, i) * (14 + i * 2.2);
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        const highlight = i === 4 || i === 9;
        ctx!.strokeStyle = highlight ? accent : ink;
        ctx!.globalAlpha = highlight ? (dark ? 0.32 : 0.26) : dark ? 0.07 : 0.08;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function loop() {
      t += 0.016;
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    draw();

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);

    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-scheme'],
    });

    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', onResize);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="contours" aria-hidden="true" />;
}

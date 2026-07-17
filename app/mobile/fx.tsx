'use client';

import { useEffect, useRef, useState } from 'react';

/* ---------- live Kathmandu clock (status bar) ---------- */
export function Uptime() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const up = () => setT(fmt.format(new Date()));
    up();
    const id = setInterval(up, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono">{t}</span>;
}

/* ---------- typed `flutter run` boot log ---------- */
type Seg = { t: string; c?: string };
const LOG: Seg[][] = [
  [{ t: '$ ', c: 'p' }, { t: 'flutter run --release' }],
  [{ t: 'Launching lib/main.dart on Pixel 8 in release mode...', c: 'dim' }],
  [{ t: '✓ ', c: 'ok' }, { t: 'Building APK — Clean Architecture + Bloc' }],
  [{ t: '✓ ', c: 'ok' }, { t: 'Offline sync engine attached' }],
  [{ t: '⚡ ', c: 'warn' }, { t: 'Hot reload ready · 0 rejections on store' }],
  [{ t: 'Syncing files to device...', c: 'dim' }],
  [{ t: '✓ ', c: 'ok' }, { t: 'App ready — shipped.' }],
];

export function BootLog() {
  const [done, setDone] = useState<Seg[][]>([]);
  const [cur, setCur] = useState('');
  const [li, setLi] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(LOG);
      setLi(LOG.length);
      return;
    }
    let line = 0;
    let ch = 0;
    let id: ReturnType<typeof setTimeout>;
    const plain = (l: Seg[]) => l.map((s) => s.t).join('');
    const tick = () => {
      if (line >= LOG.length) return;
      const full = plain(LOG[line]);
      ch++;
      setCur(full.slice(0, ch));
      if (ch >= full.length) {
        const entry = LOG[line];
        setDone((d) => [...d, entry]);
        setCur('');
        line++;
        ch = 0;
        setLi(line);
        id = setTimeout(tick, 320);
      } else {
        id = setTimeout(tick, 16);
      }
    };
    id = setTimeout(tick, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="md-run mono" aria-label="flutter run output">
      {done.map((l, i) => (
        <div className="line" key={i}>
          {l.map((s, j) => (
            <span key={j} className={s.c ?? ''}>
              {s.t}
            </span>
          ))}
        </div>
      ))}
      {li < LOG.length && (
        <div className="line">
          {cur}
          <span className="caret" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

/* ---------- phone showcase — cycles app screens ---------- */
export type ScreenApp = {
  name: string;
  role: string;
  initials: string;
  color: string;
};

export function PhoneShowcase({ apps }: { apps: ScreenApp[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % apps.length), 3000);
    return () => clearInterval(id);
  }, [apps.length]);

  const rows = [0, 1, 2, 3];
  return (
    <div className="md-phone-stage">
      <div className="md-phone">
        <div className="notch" />
        <div className="md-screen">
          <div className="sbar">
            <span>{apps[i]?.name.split(' ')[0]}</span>
            <span>▲ 5G ▮▮▮</span>
          </div>
          {apps.map((a, idx) => (
            <div
              key={a.name}
              className={`md-app${idx === i ? ' on' : ''}`}
              style={{ ['--sc' as string]: a.color }}
              aria-hidden={idx !== i}
            >
              <div className="top">
                <div className="ico">{a.initials}</div>
                <div className="nm">{a.name}</div>
                <div className="rl">{a.role}</div>
              </div>
              <div className="body">
                {rows.map((r) => (
                  <div className="row" key={r}>
                    <span className="b" />
                    <span className="l" />
                    <span className={`l s`} />
                  </div>
                ))}
              </div>
              <div className="nav">
                <i /><i /><i /><i />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- scroll reveal ---------- */
export function Rv({
  className = '',
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`md-rv ${className}`} style={{ ['--d' as string]: `${delay}s` }}>
      {children}
    </div>
  );
}

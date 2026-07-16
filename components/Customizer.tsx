'use client';

import { useEffect, useRef, useState } from 'react';

const SCHEMES = [
  { id: 'bronze', label: 'Bronze', swatch: '#a86118' },
  { id: 'forest', label: 'Forest', swatch: '#2e7d52' },
  { id: 'indigo', label: 'Indigo', swatch: '#4f5bd5' },
  { id: 'rose', label: 'Rose', swatch: '#b54a5e' },
  { id: 'graphite', label: 'Graphite', swatch: '#3a3f4a' },
];

const FONTS = [
  { id: 'grotesk', label: 'Grotesk', hint: 'Bricolage + Figtree', var: 'var(--f-bricolage)' },
  { id: 'editorial', label: 'Editorial', hint: 'Fraunces + Source Sans', var: 'var(--f-fraunces)' },
  { id: 'round', label: 'Rounded', hint: 'Sora + Onest', var: 'var(--f-sora)' },
];

export default function Customizer() {
  const [open, setOpen] = useState(false);
  const [scheme, setScheme] = useState('bronze');
  const [font, setFont] = useState('grotesk');
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    setScheme(root.dataset.scheme || 'bronze');
    setFont(root.dataset.font || 'grotesk');
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !fabRef.current?.contains(t)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pickScheme(id: string) {
    setScheme(id);
    document.documentElement.dataset.scheme = id;
    try {
      localStorage.setItem('scheme', id);
    } catch {}
  }

  function pickFont(id: string) {
    setFont(id);
    document.documentElement.dataset.font = id;
    try {
      localStorage.setItem('fontpair', id);
    } catch {}
  }

  return (
    <>
      <button
        ref={fabRef}
        className="fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="customizer"
        aria-label="Customize colors and fonts"
        title="Customize"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
          <circle cx="16" cy="8" r="2.2" />
          <circle cx="8" cy="16" r="2.2" />
        </svg>
      </button>

      {open && (
        <div id="customizer" ref={panelRef} className="customizer" role="dialog" aria-label="Appearance settings">
          <div className="cz-title">Appearance</div>

          <div className="cz-label">Accent</div>
          <div className="cz-swatches">
            {SCHEMES.map((s) => (
              <button
                key={s.id}
                className={`cz-swatch${scheme === s.id ? ' active' : ''}`}
                style={{ background: s.swatch }}
                onClick={() => pickScheme(s.id)}
                aria-pressed={scheme === s.id}
                aria-label={`${s.label} accent`}
                title={s.label}
              />
            ))}
          </div>

          <div className="cz-label">Type</div>
          <div className="cz-fonts">
            {FONTS.map((f) => (
              <button
                key={f.id}
                className={`cz-font${font === f.id ? ' active' : ''}`}
                onClick={() => pickFont(f.id)}
                aria-pressed={font === f.id}
              >
                <span className="cz-ag" style={{ fontFamily: f.var }}>
                  Ag
                </span>
                <span>
                  <span className="cz-font-name">{f.label}</span>
                  <span className="cz-font-hint">{f.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

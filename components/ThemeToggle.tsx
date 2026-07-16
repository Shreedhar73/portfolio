'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !(dark ?? false);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    setDark(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  }

  return (
    <button className="theme-btn" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme">
      {dark === null ? '◐' : dark ? '☀' : '☾'}
    </button>
  );
}

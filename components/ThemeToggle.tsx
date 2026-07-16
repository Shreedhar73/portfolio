'use client';

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  }

  return (
    <button className="theme-btn" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme">
      ◐
    </button>
  );
}

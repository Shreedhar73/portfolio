import type { Metadata } from 'next';
import { Unbounded, Figtree, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  weight: 'variable',
});
const body = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  weight: 'variable',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: 'variable',
});

export const metadata: Metadata = {
  title: 'Shreedhar Pandeya — Software Engineer',
  description:
    'Shreedhar Pandeya — software engineer in Kathmandu building offline-first Flutter apps and full-stack platforms with NestJS, React, and generative AI.',
};

const themeInit = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}

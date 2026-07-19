import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Figtree,
  JetBrains_Mono,
  Fraunces,
  Source_Sans_3,
  Sora,
  Onest,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--f-bricolage",
  weight: "variable",
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--f-figtree",
  weight: "variable",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  weight: "variable",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--f-fraunces",
  weight: "variable",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--f-source",
  weight: "variable",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--f-sora",
  weight: "variable",
});
const onest = Onest({
  subsets: ["latin"],
  variable: "--f-onest",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Shreedhar Pandeya — Software Engineer & Technical Lead",
  description:
    "Shreedhar Pandeya — software engineer and technical lead in Kathmandu. Builds and leads delivery of offline-first Flutter apps and full-stack platforms with NestJS, React, and generative AI.",
  openGraph: {
    title: "Shreedhar Pandeya — Software Engineer & Technical Lead",
    description:
      "Offline-first Flutter apps and full-stack platforms — built, led, and shipped from Kathmandu.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e16" },
  ],
};

const prefsInit = `
try {
  var root = document.documentElement;
  var t = localStorage.getItem('theme');
  if (t === 'dark' || t === 'light') root.dataset.theme = t;
  var s = localStorage.getItem('scheme');
  if (s) root.dataset.scheme = s;
  var f = localStorage.getItem('fontpair');
  if (f) root.dataset.font = f;
} catch (e) {}
`;

const fontVars = [bricolage, figtree, mono, fraunces, sourceSans, sora, onest]
  .map((f) => f.variable)
  .join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVars}>
        <script dangerouslySetInnerHTML={{ __html: prefsInit }} />
        <div className="stars" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

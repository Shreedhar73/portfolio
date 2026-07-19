import type { Metadata } from "next";
import "./blackhole.css";

export const metadata: Metadata = {
  title: "Shreedhar Pandeya — Singularity",
  description:
    "A portfolio you fall into. Real-time geodesic raytracing of a Schwarzschild black hole — scroll to descend through the accretion disk, past the photon sphere, to the event horizon.",
  openGraph: {
    title: "Shreedhar Pandeya — Singularity",
    description:
      "A portfolio you fall into. Drag to orbit, scroll to descend toward the event horizon.",
    type: "website",
  },
};

export default function BlackholeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bh-root">{children}</div>;
}

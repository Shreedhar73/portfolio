import type { Metadata } from 'next';
import './mobile.css';

export const metadata: Metadata = {
  title: 'Shreedhar Pandeya — Mobile Lead',
  description:
    'Flutter mobile lead in Kathmandu — owns architecture through release: offline-first apps with Clean Architecture and Bloc, shipped to Google Play and the App Store with zero rejections.',
  openGraph: {
    title: 'Shreedhar Pandeya — Mobile Lead',
    description: 'Offline-first Flutter apps — built, led, and shipped from Kathmandu.',
    type: 'website',
  },
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <div className="md-root">{children}</div>;
}

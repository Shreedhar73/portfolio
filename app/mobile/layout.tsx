import type { Metadata } from 'next';
import './mobile.css';

export const metadata: Metadata = {
  title: 'Shreedhar Pandeya — Mobile Engineer',
  description:
    'Flutter mobile engineer in Kathmandu — offline-first apps with Clean Architecture and Bloc, shipped to Google Play and the App Store with zero rejections.',
  openGraph: {
    title: 'Shreedhar Pandeya — Mobile Engineer',
    description: 'Offline-first Flutter apps, built and shipped from Kathmandu.',
    type: 'website',
  },
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <div className="md-root">{children}</div>;
}

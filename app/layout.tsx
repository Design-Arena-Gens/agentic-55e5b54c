import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentic SEO Review Generator',
  description:
    'Generate SEO and Google Discover?optimized review articles with affiliate links and AI images.',
  metadataBase: new URL('https://agentic-55e5b54c.vercel.app'),
  openGraph: {
    title: 'Agentic SEO Review Generator',
    description:
      'Generate SEO and Google Discover?optimized review articles with affiliate links and AI images.',
    url: 'https://agentic-55e5b54c.vercel.app',
    siteName: 'Agentic Generator',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Agentic SEO Review Generator'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic SEO Review Generator',
    description:
      'Generate SEO and Google Discover?optimized review articles with affiliate links and AI images.'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';

import Providers from './providers/providers';

import './styles/globals.css';
import './styles/utils.css';
import 'highlight.js/styles/base16/solarized-dark.css';

const montserrat = Montserrat({
  variable: '--font-main',
  subsets: ['latin', 'cyrillic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Comunicore',
  description: 'Форум для общения',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Providers from './providers/providers';

import './styles/globals.css';
import 'highlight.js/styles/base16/solarized-dark.css';

const montserrat = Montserrat({
  variable: '--font-main',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Comunicore',
  description: 'Форум для общения',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={montserrat.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

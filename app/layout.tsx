import { Providers } from '../components/providers/providers';
import { DM_Sans } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import './global.css';
import Navigation from '../components/header/navigation';
import { NextuiProviders } from './providers';

const font = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: 'safeLite',
  description: 'Multisig wallet dapp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <NextuiProviders>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </NextuiProviders>
      </body>
    </html>
  );
}

import { Providers } from "../components/providers/providers"
import { DM_Sans } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
import "./global.css";
import Navigation from "../components/header/navigation";

const dm_sans = DM_Sans({
  weight: 'variable',
  subsets: ["latin"]
});

export const metadata = {
  title: 'safeLite',
  description: 'Multisig wallet dapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dm_sans.className} style={{ color: 'white', backgroundColor: '#121312'}}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}

import { Providers } from "../components/providers/providers"
import { Inter } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
import "./global.css";
import Navigation from "../components/header/navigation";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}

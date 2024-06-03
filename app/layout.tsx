import { Providers } from "../components/providers/providers";
import { DM_Sans } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./global.css";
import Navigation from "../components/header/navigation";

const dm_sans = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
});

export const metadata = {
  title: "safeLite",
  description: "Multisig wallet dapp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white w-screen min-h-screen flex">
        <Providers>
          <header className="fixed top-0 inset-x-0 h-16">
            <Navigation />
          </header>
          <main className="flex justify-center items-center h-full w-screen pt-16 px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

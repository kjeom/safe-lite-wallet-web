import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  return (
    <div className="flex bg-background justify-between items-center p-4 text-center h-full">
      <Image width={160} height={34} alt="" src="/kaia_safe.png" />
      <Link href="/">
        <span>Home</span>
      </Link>
      |
      <Link href="/create-wallet">
        <span>Create Wallet</span>
      </Link>
      |
      <Link href="/execute-tx">
        <span>Execute Transaction</span>
      </Link>
      <ConnectButton />
    </div>
  );
}

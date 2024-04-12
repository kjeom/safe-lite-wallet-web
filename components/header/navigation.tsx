import { ConnectButton } from "@rainbow-me/rainbowkit";
import classes from "./Header.module.css";
import Link from "next/link";

export default function Navigation() {
  return (
    <div>
      <nav>
        <div>
          <Link href="/">
            <span>Home</span>
          </Link>
        </div>
        <div>
          <Link href="/create-wallet">
            <span>Create Wallet</span>
          </Link>
        </div>
        <div>
          <Link href="/execute-tx">
            <span>Execute Transaction</span>
          </Link>
        </div>
        <div>
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
}
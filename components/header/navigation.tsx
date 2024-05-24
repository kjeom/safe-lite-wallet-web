import { ConnectButton } from "@rainbow-me/rainbowkit";
import classes from "./Header.module.css";
import Link from "next/link";

export default function Navigation() {
  return (
    <div>
      <div style={{ width: '100%', height: 54, background: '#1C1C1C', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
        <div style={{ height: 54, paddingLeft: 45, paddingRight: 45, background: '#1C1C1C', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
        <div style={{width: 143, height: 29, position: 'relative'}}>
            <div style={{ width: 143, height: 29, left: 0, top: 0, position: 'absolute' }}>
              <img style={{ width: 143, height: 29, left: 0, top: 0, position: 'absolute',}} src="/kaia_safe_lite.png" />
            </div>
          </div>
        </div>
        <div style={{ height: 54, paddingLeft: 76, paddingRight: 76, background: '#1C1C1C', borderLeft: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Outfit', fontWeight: '500', wordWrap: 'break-word' }}>Home</div>
          </Link>
        </div>
        <div style={{ height: 54, paddingLeft: 40, paddingRight: 40, background: '#1C1C1C', borderLeft: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
          <Link href="/create-wallet" style={{ textDecoration: "none" }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Outfit', fontWeight: '500', wordWrap: 'break-word' }}>Create Wallet</div>
          </Link>
        </div>
        <div style={{ height: 54, paddingLeft: 40, paddingRight: 40, background: '#1C1C1C', borderLeft: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
          <Link href="/manage-wallet" style={{ textDecoration: "none" }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Outfit', fontWeight: '500', wordWrap: 'break-word' }}>Manage Wallet</div>
          </Link>
        </div>
        <div style={{ height: 54, paddingLeft: 24, paddingRight: 24, background: '#1C1C1C', borderLeft: '2px #303033 solid', borderRight: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
          <Link href="/execute-tx" style={{ textDecoration: "none" }}>
            <div style={{ textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Outfit', fontWeight: '500', wordWrap: 'break-word' }}>Execute Transaction</div>
          </Link>
        </div>
        <div style={{ paddingLeft: 24 }}>
          <ConnectButton />
        </div>
      </div>
      <div style={{ width: 1920, height: 2, position: 'relative', background: '#303033' }} />
    </div>


  );
}
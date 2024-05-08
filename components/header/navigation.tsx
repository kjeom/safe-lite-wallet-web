import { ConnectButton } from "@rainbow-me/rainbowkit";
import classes from "./Header.module.css";
import Link from "next/link";

export default function Navigation() {
  return (
    <div style={{width: '100%', height: 66, background: 'black', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
      <div style={{height: 64, paddingLeft: 45, paddingRight: 45, background: 'black', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
        <div style={{width: 160, height: 34, position: 'relative'}}>
          <div style={{width: 161, height: 31, left: 0, top: 0, position: 'absolute'}}>
            <img style={{width: 160, height: 34, left: 0, top: 0, position: 'absolute'}} src="/kaia_safe.png" />
          </div>
        </div>
      </div>
      <div style={{height: 64, paddingLeft: 76, paddingRight: 76, background: 'black', borderLeft: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
        <Link href="/" style={{ textDecoration: "none"}}>
          <div style={{textAlign: 'center', color: 'white', fontSize: 20, fontFamily: 'DM Sans', fontWeight: '500', wordWrap: 'break-word'}}>Home</div>
        </Link>
      </div>
      <div style={{height: 66, paddingLeft: 40, paddingRight: 40, background: 'black', borderLeft: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
        <Link href="/create-wallet" style={{ textDecoration: "none"}}>
          <div style={{textAlign: 'center', color: 'white', fontSize: 20, fontFamily: 'DM Sans', fontWeight: '500', wordWrap: 'break-word'}}>Create Wallet</div>
        </Link>
      </div>
      <div style={{height: 66, paddingLeft: 24, paddingRight: 24, background: 'black', borderLeft: '2px #303033 solid', borderRight: '2px #303033 solid', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
        <Link href="/execute-tx" style={{ textDecoration: "none"}}>
          <div style={{textAlign: 'center', color: 'white', fontSize: 20, fontFamily: 'DM Sans', fontWeight: '500', wordWrap: 'break-word'}}>Execute Transaction</div>
          </Link>
      </div>
      <div style={{paddingLeft: 24}}>
          <ConnectButton />
        </div>
    </div>
  );
}
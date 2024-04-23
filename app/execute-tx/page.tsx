"use client";

import { useSafeLite } from "@/hooks/useSafeLite";
import { useSignMessage } from "wagmi";

export default function ExecuteTx() {
    const safeLiteWallet = useSafeLite()

    return (
        <div>
            <h1>Execute Transaction</h1>
            <h2>{safeLiteWallet}</h2>
        </div>
    ); 
}
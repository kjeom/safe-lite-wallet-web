'use client';

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { signMessage, writeContract, readContract, verifyMessage, VerifyMessageReturnType, type VerifyMessageErrorType } from '@wagmi/core';
import { config } from '@/app/config/config';
import { parseGwei, parseEther } from 'viem'
import { ethers } from "ethers";
import { useState } from 'react';
import { useSafeLite } from "@/hooks/useSafeLite";
import * as safeLiteAbi from '@/abi/safeLite.json';


export default function ExecuteTx() {
    const { data: walletClient, isError, isLoading } = useWalletClient();
    const [toInput, setTo] = useState('');
    const [valueInput, setValue] = useState('');
    const [data, setData] = useState('');
    const safeLiteWallet = useSafeLite();

    const executeTransactionHandler = async () => {
        try {
            if (!safeLiteWallet) {
                alert("safeLiteWallet is not ready");
                return;
            }

            const nonce = await readContract(config, {
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'nonce',
                args: [],
            });
            console.log("nonce is: ", nonce);
            
            const hash = await readContract(config, {
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'getTransactionHash',
                args: [Number(nonce), toInput, valueInput, ""],
            });
            console.log("Transaction hash fetched: ", hash);
            console.log("nonce is", nonce)
            console.log("walletClient?.account.address: ", walletClient?.account.address);

            const signaturePromise = walletClient?.signMessage({
                message: { raw : hash },
            });
            const signature = await signaturePromise;
            console.log("hash is =", hash);
            console.log("signature is =", signature);

            const sortSignatures = (signers: string[], signatures: string[]): string[] => {
                const combined = signers.map((address, i) => ({ address, signature: signatures[i] }));
                combined.sort((a, b) => a.address.localeCompare(b.address));
                return combined.map((x) => x.signature);
            };

            const recoverAddress = await readContract(config, {
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'recover',
                args: [hash, signature],
            });
            console.log("Recovered address is : ", recoverAddress);

            const executeTransaction = await walletClient?.writeContract({
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'executeTransaction',
                args: [
                    toInput,
                    valueInput,
                    "",
                    sortSignatures(["0xC9bC7F8D3130D1B936A29c726e7A5D601401bd56"], [signature || ""]),
                ],

            });

            alert("suucced");
        } catch (error) {
            alert("failed" + error.message);
        }
    };

    return (
        <div>
            <h1>Execute Transaction</h1>
            <h1>{safeLiteWallet}</h1>
            <label htmlFor="to">To:</label>
            <input
                type="text"
                id="to"
                value={toInput}
                onChange={(e) => setTo(e.target.value)}
            />
            <br />
            <label htmlFor="value">Value:</label>
            <input
                type="number"
                id="value"
                value={valueInput}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <label htmlFor="data">Data:</label>
            <input
                type="text"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <br />
            <button onClick={executeTransactionHandler}>Execute Transaction</button>
        </div>
    ); 
}
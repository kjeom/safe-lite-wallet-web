'use client';

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { signMessage, writeContract, readContract, verifyMessage, VerifyMessageReturnType, type VerifyMessageErrorType } from '@wagmi/core';
import { config } from '@/app/config/config';
import { parseGwei } from 'viem'
import { ethers } from "ethers";
import { useState } from 'react';
import { useSafeLite } from "@/hooks/useSafeLite";
import * as safeLiteAbi from '@/abi/safeLite.json';


export default function ExecuteTx() {
    const { data: walletClient, isError, isLoading } = useWalletClient();
    const [toInput, setTo] = useState('');
    const [valueInput, setValue] = useState(0);
    const [data, setData] = useState('');
    const safeLiteWallet = useSafeLite();

    const executeTransactionHandler = async () => {
        try {
            if (!safeLiteWallet) {
                alert("safeLiteWallet is not ready");
                return;
            }

            // 논스 값 불러오기
            const nonce = await readContract(config, {
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'nonce',
                args: [],
            });
            console.log("nonce is: ", nonce);
            

            // 서명 값 받아오기, hash = getTransactionHash -> ethers.utils.arrayify(hash)
            const hash = await readContract(config, {
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'getTransactionHash',
                args: [Number(nonce), safeLiteWallet, BigInt(valueInput), "0x"],
            });
            console.log("Transaction hash fetched: ", hash);

            // 서명 값 넣어주기, owner1Sig = signMessage(ethers.utils.arrayify(hash))
            // const arrayifiedHash = ethers.utils.arrayify(hash);
            // console.log("Arrayified hash: ", arrayifiedHash);

            const signaturePromise = walletClient?.signMessage({
                message: { raw : hash },
            });
            const signature = await signaturePromise;
            console.log("hash is =", hash);
            console.log("signature is =", signature);

            // 서명 값 정렬하기
            const sortSignatures = (signers: string[], signatures: string[]): string[] => {
                const combined = signers.map((address, i) => ({ address, signature: signatures[i] }));
                combined.sort((a, b) => a.address.localeCompare(b.address));
                return combined.map((x) => x.signature);
            };

            try {
                const verifyResult = await verifyMessage(config, {
                    address: safeLiteWallet,
                    message: { raw : hash },
                    signature: signature || "",
                });
                console.log("verifyResult is =", verifyResult);
            } catch (error) {
                const verifyMessageError = error as VerifyMessageErrorType
                console.log("verifyResult is =", verifyMessageError);
            }

            // executeTransaction 호출
            const executeTransaction = walletClient?.writeContract({
                abi: safeLiteAbi.abi,
                address: safeLiteWallet,
                functionName: 'executeTransaction',
                args: [
                    toInput,
                    BigInt(valueInput),
                    "0x",
                    sortSignatures(["0xC9bC7F8D3130D1B936A29c726e7A5D601401bd56"], [signature || ""]),
                    // InvalidArrayError: Value로 인해서 sortSignatures 함수 호출
                ],
                gas: parseGwei('2'), 
                gasPrice: parseGwei('2'),
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
                onChange={(e) => setValue(parseInt(e.target.value))}
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
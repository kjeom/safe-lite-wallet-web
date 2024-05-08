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
    const [multiSigInput, setMultiSig] = useState('');
    const [toInput, setTo] = useState('');
    const [valueInput, setValue] = useState('');
    const [signature, setSignature] = useState('');
    const [wallet1, setWallet1] = useState('');
    const [wallet2, setWallet2] = useState('');
    const [wallet3, setWallet3] = useState('');
    const [sig1, setSig1] = useState('');
    const [sig2, setSig2] = useState('');
    const [sig3, setSig3] = useState('');

    const sortSignatures = (signers: string[], signatures: string[]): string[] => {
        const combined = signers.map((address, i) => ({ address, signature: signatures[i] }));
        combined.sort((a, b) => a.address.localeCompare(b.address));
        return combined.map((x) => x.signature);
    };

    const signTxHandler = async () => {
        const nonce = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'nonce',
            args: [],
        });
        console.log("nonce is: ", nonce);

        const hash = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'getTransactionHash',
            args: [Number(nonce), toInput, valueInput, ""],
        });
        console.log("Transaction hash fetched: ", hash);
        console.log("nonce is", nonce)
        console.log("walletClient?.account.address: ", walletClient?.account.address);

        const signaturePromise = walletClient?.signMessage({
            message: { raw: hash },
        });
        const signature = await signaturePromise;
        console.log("hash is =", hash);
        console.log("signature is =", signature);

        setSignature(signature || "");
    };

    const executeTxHandler = async () => {
        const executeTransaction = await walletClient?.writeContract({
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'executeTransaction',
            args: [
                toInput,
                valueInput,
                "",
                sortSignatures([wallet1, wallet2, wallet3], [sig1 || "", sig2 || "", sig3 || ""]),
            ],
        });
    };

    return (
        <div>
            <br></br>
            <br></br>
            <div style={{ width: 1920, height: 873, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 60, display: 'inline-flex' }}>
                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 44, display: 'flex' }}>
                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 46, display: 'flex' }}>
                        <div style={{ color: 'white', fontSize: 38, fontFamily: 'DM Sans', fontWeight: '900', wordWrap: 'break-word' }}>Execute Transaction</div>
                        <div style={{ paddingLeft: 60, paddingRight: 60, paddingTop: 40, paddingBottom: 40, background: '#1C1C1C', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
                            <div style={{ justifyContent: 'flex-start', alignItems: 'flex-end', gap: 242, display: 'inline-flex' }}>
                                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 60, display: 'inline-flex' }}>
                                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex' }}>
                                        <div style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word' }}>MultiSig Wallet Address</div>
                                        <input type="text" id="multiSig" value={multiSigInput} onChange={(e) => setMultiSig(e.target.value)} placeholder="multisig wallet address" style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word', width: 448, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                        </input>
                                    </div>
                                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 60, display: 'flex' }}>
                                        <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex' }}>
                                            <div style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word' }}>Sign Transaction</div>
                                            <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'flex' }}>
                                                <input type="text" id="to" value={toInput} onChange={(e) => setTo(e.target.value)} placeholder="To" style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word', width: 448, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <input type="number" id="value" value={valueInput} onChange={(e) => setValue(e.target.value)} placeholder="Value" style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word', width: 448, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <div style={{ color: 'black', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 448, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                    <div style={{ color: 'black', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word' }}> Signature is : {signature} </div>
                                                </div>
                                                <button onClick={() => navigator.clipboard.writeText(signature)} style={{ cursor: 'pointer', textAlign: 'center', color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '600', wordWrap: 'break-word', height: 56, paddingLeft: 40, paddingRight: 40, background: 'rgba(255, 255, 255, 0)', borderRadius: 4, overflow: 'hidden', border: '2px white solid', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>Signature Copy</button>
                                            </div>
                                        </div>
                                        <button onClick={signTxHandler} style={{ cursor: 'pointer', textAlign: 'center', color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '600', wordWrap: 'break-word', height: 56, paddingLeft: 40, paddingRight: 40, background: 'rgba(255, 255, 255, 0)', borderRadius: 4, overflow: 'hidden', border: '2px white solid', justifyContent: 'center', alignItems: 'center', display: 'inline-ex' }}>
                                            signTx
                                        </button>
                                    </div>
                                </div>
                                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 140, display: 'inline-flex' }}>
                                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex' }}>
                                        <div style={{ color: 'white', fontSize: 28, fontFamily: 'DM Sans', fontWeight: '400', wordWrap: 'break-word' }}>Execute Transaction</div>
                                        <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: 42, display: 'inline-flex' }}>
                                            <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'inline-flex' }}>
                                                <input type="text" id="wallet1" value={wallet1} onChange={(e) => setWallet1(e.target.value)} placeholder="Wallet 1" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <input type="text" id="wallet2" value={wallet2} onChange={(e) => setWallet2(e.target.value)} placeholder="Wallet 2" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <input type="text" id="wallet3" value={wallet3} onChange={(e) => setWallet3(e.target.value)} placeholder="Wallet 3" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                            </div>
                                            <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'inline-flex' }}>
                                                <input type="text" id="sig1" value={sig1} onChange={(e) => setSig1(e.target.value)} placeholder="Signature 1" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <input type="text" id="sig2" value={sig2} onChange={(e) => setSig2(e.target.value)} placeholder="Signature 2" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                                <input type="text" id="sig3" value={sig3} onChange={(e) => setSig3(e.target.value)} placeholder="Signature 3" style={{ color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '300', wordWrap: 'break-word', width: 400, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: 'black', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={executeTxHandler} style={{ cursor: 'pointer', textAlign: 'center', color: 'white', fontSize: 24, fontFamily: 'DM Sans', fontWeight: '600', wordWrap: 'break-word', height: 56, paddingLeft: 40, paddingRight: 40, background: 'rgba(255, 255, 255, 0)', borderRadius: 4, overflow: 'hidden', border: '2px white solid', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
                                        exeTx
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
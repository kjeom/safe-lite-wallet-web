'use client';

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { signMessage, writeContract, readContract } from '@wagmi/core';
import { config } from '@/app/config/config';
import { parseGwei, parseEther } from 'viem'
import { ethers } from "ethers";
import { useState } from 'react';
import { useSafeLite } from "@/hooks/useSafeLite";
import * as safeLiteAbi from '@/abi/safeLite.json';
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function ExecuteTx() {
    const { data: walletClient, isError, isLoading } = useWalletClient();
    const [multiSigInput, setMultiSig] = useState('');
    const [toInput, setTo] = useState('');
    const [valueInput, setValue] = useState('');
    const [signature, setSignature] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [error, setError] = useState('');

    const signTxHandler = async () => {
        const nonce = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'nonce',
            args: [],
        });
        // console.log("nonce is: ", nonce);

        const hash = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'getTransactionHash',
            args: [Number(nonce), toInput, ethers.utils.parseEther(valueInput), ""],
        });
        // console.log("Transaction hash fetched: ", hash);
        // console.log("nonce is", nonce)
        // console.log("walletClient?.account.address: ", walletClient?.account.address);

        const signaturePromise = walletClient?.signMessage({
            message: { raw: hash },
        });
        const signature = await signaturePromise;
        // console.log("hash is =", hash);
        // console.log("signature is =", signature);

        setSignature(signature || "");
    };

    const getTransactionInfoHandler = async () => {
        const nonce = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'nonce',
            args: [],
        });
        console.log("nonce is", nonce)

        const transaction = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'getTransaction',
            args: [transactionId],
        });
        console.log("Transaction info: ", transaction);
        setTransactionInfo(transaction);
    };

    const executeTxHandler = async () => {
        const nonce = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'nonce',
            args: [],
        });
        console.log("nonce is", nonce)

        const hash = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'getTransactionHash',
            args: [Number(nonce), toInput, ethers.utils.parseEther(valueInput), ""],
        });

        const signatureCount = await readContract(config, {
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'getSignatureCount',
            args: [Number(nonce)],
        });
        console.log("signatureCount is: ", signatureCount);

        const signature = await walletClient?.signMessage({
            message: { raw: hash },
        });

        const executeTransaction = await walletClient?.writeContract({
            abi: safeLiteAbi.abi,
            address: multiSigInput,
            functionName: 'signTransaction',
            args: [
                Number(nonce),
                toInput,
                ethers.utils.parseEther(valueInput),
                "",
                signature,
            ],
        });
    };

    return (
        <div style={{ backgroundColor: '#121312', minHeight: '100vh' }}>
            <br></br>
            <br></br>
            <div style={{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 44, display: 'flex' }}>
                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 46, display: 'flex' }}>
                        <div style={{ color: 'white', fontSize: 38, fontFamily: 'Outfit', fontWeight: '700', wordWrap: 'break-word' }}>Execute Transaction</div>
                        <div style={{ paddingLeft: 60, paddingRight: 60, paddingTop: 40, paddingBottom: 40, background: '#1C1C1C', borderRadius: 10, overflow: 'hidden', border: '1px #303033 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
                            <div style={{ justifyContent: 'flex-start', alignItems: 'flex-end', gap: 242, display: 'inline-flex' }}>
                                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 40, display: 'inline-flex' }}>
                                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex' }}>
                                        <div style={{ width: 400, color: 'white', fontSize: 24, fontFamily: 'Outfit', fontWeight: '400', wordWrap: 'break-word' }}>MultiSig Wallet Address</div>
                                        <Input variant="bordered" color="success" type="text" label="Multisig" size="lg" id="multiSig" value={multiSigInput} onChange={(e) => setMultiSig(e.target.value)} placeholder="your multisig wallet address" style={{ width: '100%' }} />
                                    </div>
                                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 60, display: 'flex' }}>
                                        <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex' }}>
                                            <div style={{ color: 'white', fontSize: 24, fontFamily: 'Outfit', fontWeight: '400', wordWrap: 'break-word' }}>Send Token</div>
                                            <div style={{ width: 400, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'flex' }}>
                                                <Input variant="bordered" color="success" type="text" label="To" size="lg" id="to" value={toInput} onChange={(e) => setTo(e.target.value)} placeholder="recipient's wallet address" style={{ width: '100%' }} />
                                                <Input variant="bordered" color="success" type="text" label="Value" size="lg" id="value" value={valueInput} onChange={(e) => setValue(e.target.value)} placeholder="the amount of tokens to send" endContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">KLAY</span>
                                                    </div>
                                                } />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 140, display: 'inline-flex' }}>
                                    <Button onClick={executeTxHandler} size="lg" color="success" variant="shadow" className="text-white">
                                        exeTx
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 40, display: 'flex', marginBottom: "200px" }}>
                            <h2 style={{ color: 'white', fontSize: 38, fontFamily: 'Outfit', fontWeight: '900', wordWrap: 'break-word' }}>Get Transaction Info</h2>
                            <Input type="text" placeholder="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                            <Button onClick={getTransactionInfoHandler} size="lg" color="success" variant="shadow" className="text-white">Get Transaction Info</Button>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {transactionInfo && (
                                <Table         
                                color="success"
                                selectionMode="single" 
                                defaultSelectedKeys={["2"]} 
                                aria-label="Transaction Info Table">
                                    <TableHeader>
                                        <TableColumn>To</TableColumn>
                                        <TableColumn>Value</TableColumn>
                                        <TableColumn>Data</TableColumn>
                                        <TableColumn>Executed</TableColumn>
                                        <TableColumn>Signature Count</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="1">
                                            <TableCell>{transactionInfo[0]}</TableCell>
                                            <TableCell>{ethers.utils.formatEther(transactionInfo[1])} KLAY</TableCell>
                                            <TableCell>{transactionInfo[2]}</TableCell>
                                            <TableCell>{transactionInfo[3] ? "Yes" : "No"}</TableCell>
                                            <TableCell>{Number(transactionInfo[4])}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
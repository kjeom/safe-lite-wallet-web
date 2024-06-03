"use client";

import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import {
  signMessage,
  writeContract,
  readContract,
  verifyMessage,
  VerifyMessageReturnType,
  type VerifyMessageErrorType,
} from "@wagmi/core";
import { config } from "@/app/config/config";
import { parseGwei, parseEther } from "viem";
import { ethers } from "ethers";
import { useState } from "react";
import { useSafeLite } from "@/hooks/useSafeLite";
import * as safeLiteAbi from "@/abi/safeLite.json";

export default function ExecuteTx() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [multiSigInput, setMultiSig] = useState("");
  const [toInput, setTo] = useState("");
  const [valueInput, setValue] = useState("");
  const [signature, setSignature] = useState("");
  const [wallet1, setWallet1] = useState("");
  const [wallet2, setWallet2] = useState("");
  const [wallet3, setWallet3] = useState("");
  const [sig1, setSig1] = useState("");
  const [sig2, setSig2] = useState("");
  const [sig3, setSig3] = useState("");

  const sortSignatures = (
    signers: string[],
    signatures: string[]
  ): string[] => {
    const combined = signers.map((address, i) => ({
      address,
      signature: signatures[i],
    }));
    combined.sort((a, b) => a.address.localeCompare(b.address));
    return combined.map((x) => x.signature);
  };

  const signTxHandler = async () => {
    const nonce = await readContract(config, {
      abi: safeLiteAbi.abi,
      address: multiSigInput,
      functionName: "nonce",
      args: [],
    });
    console.log("nonce is: ", nonce);

    const hash = await readContract(config, {
      abi: safeLiteAbi.abi,
      address: multiSigInput,
      functionName: "getTransactionHash",
      args: [Number(nonce), toInput, valueInput, ""],
    });
    console.log("Transaction hash fetched: ", hash);
    console.log("nonce is", nonce);
    console.log(
      "walletClient?.account.address: ",
      walletClient?.account.address
    );

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
      functionName: "executeTransaction",
      args: [
        toInput,
        valueInput,
        "",
        sortSignatures(
          [wallet1, wallet2, wallet3],
          [sig1 || "", sig2 || "", sig3 || ""]
        ),
      ],
    });
  };

  return (
    <div>
      <h1>Execute Transaction</h1>
      <section>
        <div>
          <h3>MultiSig Wallet Address</h3>
          <input
            type="text"
            id="multiSig"
            value={multiSigInput}
            onChange={(e) => setMultiSig(e.target.value)}
            placeholder="multisig wallet address"
            className="flex w-full mt-3"
          />
        </div>
        <br />
        <div className="grid grid-cols-[1fr_2fr] auto-rows-2 gap-6">
          <div className="flex flex-col gap-3">
            <h3>Sign Transaction</h3>
            <input
              type="text"
              id="to"
              value={toInput}
              onChange={(e) => setTo(gride.target.value)}
              placeholder="To"
            />
            <input
              type="number"
              id="value"
              value={valueInput}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value"
            />
            <div className="bg-white text-black rounded-md p-2 border border-solid border-slate-700">
              Signature is : {signature}
            </div>
            <button onClick={() => navigator.clipboard.writeText(signature)}>
              Signature Copy
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <h3>Execute Transaction</h3>
            <div>
              <input
                type="text"
                id="wallet1"
                value={wallet1}
                onChange={(e) => setWallet1(e.target.value)}
                placeholder="Wallet 1"
              />{" "}
              <input
                type="text"
                id="sig1"
                value={sig1}
                onChange={(e) => setSig1(e.target.value)}
                placeholder="Signature 1"
              />
            </div>
            <div>
              <input
                type="text"
                id="wallet2"
                value={wallet2}
                onChange={(e) => setWallet2(e.target.value)}
                placeholder="Wallet 2"
              />{" "}
              <input
                type="text"
                id="sig2"
                value={sig2}
                onChange={(e) => setSig2(e.target.value)}
                placeholder="Signature 2"
              />
            </div>
            <div>
              <input
                type="text"
                id="wallet3"
                value={wallet3}
                onChange={(e) => setWallet3(e.target.value)}
                placeholder="Wallet 3"
              />{" "}
              <input
                type="text"
                id="sig3"
                value={sig3}
                onChange={(e) => setSig3(e.target.value)}
                placeholder="Signature 3"
              />
            </div>
          </div>
          <button onClick={signTxHandler}>signTx</button>
          <button onClick={executeTxHandler}>exeTx</button>
        </div>
      </section>
    </div>
  );
}

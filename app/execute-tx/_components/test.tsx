'use client';

import { useState } from 'react';
import { useSafeLite } from '@/hooks/useSafeLite';
import {
  useSignMessage,
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
  useWalletClient,
} from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import safeLiteAbi from '@/abi/safeLite.json';

import { writeContract, getAccount } from '@wagmi/core';
import { parseEther } from 'viem';

const sortSignatures = (signers: string[], signatures: string[]): string[] => {
  const combined = signers.map((address, i) => ({
    address,
    signature: signatures[i],
  }));
  combined.sort((a, b) => a.address.localeCompare(b.address));
  return combined.map((x) => x.signature);
};

export default function ExecuteTx() {
  const { address } = useAccount();
  const safeLiteWallet = useSafeLite();
  const { signMessage } = useSignMessage();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [realSignature, setRealSignature] = useState<
    `0x${string}` | undefined
  >();
  const [txHashresult, setTxHash] = useState<`0x${string}` | undefined>();
  const { data: walletClient, isLoading } = useWalletClient();
  

  // Get the current nonce
  const { data: nonce } = useReadContract({
    address: safeLiteWallet,
    abi: safeLiteAbi.abi,
    functionName: 'nonce',
    args: [],
  });

  // Get the transaction hash
  const { data: txHash } = useReadContract({
    address: safeLiteWallet,
    abi: safeLiteAbi.abi,
    functionName: 'getTransactionHash',
    args: [nonce, address, parseEther(amount), '0x'],
  });

  const { data: sig, failureReason: reason } = useReadContract({
    address: safeLiteWallet,
    abi: safeLiteAbi.abi,
    functionName: 'recover',
    args: [txHash, realSignature],
  });

  console.log('signing transaction', sig);

  //console.log(reason);

  // const {
  //   data,
  //   failureReason: reasoncheck,
  //   error: checkError,
  // } = useSimulateContract({
  //   address: '0xea17af023a524f6c301d0412be8ab0c7fef2175c',
  //   abi: safeLiteAbi.abi,
  //   functionName: 'executeTransaction',
  //   args: [
  //     '0xf6A89edE38E4E32eac60E378D49a5054cb947029',
  //     ethers.utils.parseEther('1').toString(),
  //     '0x',
  //     [
  //       '0x37a0d67fa551bceac46dfce3457eecdbadded80bdbe3bf7f61939e10eb6adcb33ed69ccfa69ef8f1b9aaa49324074f2fad94ab98bf36c3e0ecaa5b9ad220f97d1b',
  //     ],
  //   ],
  // });

  // console.log('reason', reasoncheck);
  // console.log('checkError', checkError);

  const { writeContract, isError, isPending, isSuccess, failureReason, error } =
    useWriteContract();

  const handleExecuteTransaction = async () => {

    if (!safeLiteWallet) {
      alert("safeLiteWallet is not ready");
      return;
  }


    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();

    console.log('txHash', txHash);
    // console.log('Transaction', data);

    const signTransaction = async (signer: ethers.Signer): Promise<string> => {
      if (!txHash || typeof txHash !== 'string') {
        throw new Error('Transaction hash not available or not a string');
      }

      const signatures = await signer.signMessage(
        ethers.utils.arrayify(txHash)
      );
      return signatures;
    };

    const signatures : any = await signTransaction(signer);

    setRealSignature(signatures);

    console.log('signature', signatures);

    // const result = walletClient?.writeContract({
    //   abi: safeLiteAbi.abi,
    //   address: safeLiteAddress,
    //   functionName: 'executeTransaction',
    //   args: [recipient, value, data, [signature]],
    // });
    const to = recipient;
    const result = await writeContract({
      abi: safeLiteAbi.abi,
      address: safeLiteWallet,
      functionName: 'executeTransaction',
      args: [
        to,
        ethers.utils.parseEther('1').toString(),
        '0x',
        sortSignatures(
          ['0x718579A4952DF3Ffc46226f4071Dc40131ae0E3d'],
          [signatures]
        ),
      ],
    });

    console.log('isSuccess', isSuccess);
    console.log('failureReason', failureReason);
    console.log('error', error);
    //await writeContract(data!.request);
  };

  return (
    <div>
      <h1>Execute Transaction</h1>
      <input
        type='text'
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder='Recipient Address'
      />
      <input
        type='text'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder='Amount in ETH'
      />
      <button onClick={handleExecuteTransaction}>Execute</button>
    </div>
  );
}

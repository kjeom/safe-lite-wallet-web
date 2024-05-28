'use client';

import { useWalletClient } from 'wagmi';
import { readContract } from '@wagmi/core';
import { config } from '@/app/execute-tx/_components/config';

import { ethers } from 'ethers';
import { useState } from 'react';

import * as safeLiteAbi from '@/abi/safeLite.json';
import { Button, Input, Snippet } from '@nextui-org/react';

export default function ExecuteTx() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [multiSigInput, setMultiSig] = useState<any>('');
  const [toInput, setTo] = useState('');
  const [valueInput, setValue] = useState('');
  const [signature, setSignature] = useState('');
  const [wallet1, setWallet1] = useState('');
  const [wallet2, setWallet2] = useState('');

  const [sig1, setSig1] = useState('');
  const [sig2, setSig2] = useState('');

  const parseEther = ethers.utils.parseEther;

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
      functionName: 'nonce',
      args: [],
    });

    const hash: any = await readContract(config, {
      abi: safeLiteAbi.abi,
      address: multiSigInput,
      functionName: 'getTransactionHash',
      args: [Number(nonce), toInput, parseEther(valueInput || '0'), ''],
    });

    const signaturePromise = walletClient?.signMessage({
      message: { raw: hash },
    });
    const signature = await signaturePromise;

    setSignature(signature || '');
  };

  const executeTxHandler = async () => {
    const executeTransaction = await walletClient?.writeContract({
      abi: safeLiteAbi.abi,
      address: multiSigInput,
      functionName: 'executeTransaction',
      args: [
        toInput,
        parseEther(valueInput || '0'),
        '',
        sortSignatures([wallet1, wallet2], [sig1 || '', sig2 || '']),
      ],
    });

    //console.log('executeTransaction', executeTransaction);
  };

  return (
    <div className='bg-gray-900 min-h-screen flex flex-col text-white items-center justify-center'>
      <div className='text-white text-4xl font-bold mb-8'>
        Execute Transaction
      </div>
      <div className='bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl'>
        <div className='grid grid-cols-2 gap-8'>
          <div>
            <div className='mb-6'>
              <label
                htmlFor='multiSig'
                className='block text-xl font-semibold mb-2'
              >
                MultiSig Wallet Address
              </label>
              <Input
                type='text'
                id='multiSig'
                value={multiSigInput}
                onChange={(e) => setMultiSig(e.target.value)}
                placeholder='multisig wallet address'
                className='w-full  text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <div className='mb-6'>
                <div className='text-xl font-semibold mb-2'>
                  Sign Transaction
                </div>
                <div className='space-y-4'>
                  <Input
                    type='text'
                    id='to'
                    value={toInput}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder='To'
                    className='w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <Input
                    type='number'
                    id='value'
                    value={valueInput}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder='Value'
                    className='w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <div className='flex flex-col gap-2'>
                    <p>Signature is: </p>
                    <Snippet color='success'>{signature}</Snippet>
                  </div>
                </div>
              </div>
              <Button
                onClick={signTxHandler}
                className='px-6 py-3 text-white font-semibold bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-300'
              >
                signTx
              </Button>
            </div>
          </div>
          <div>
            <div className='mb-6'>
              <div className='text-xl font-semibold mb-2'>
                Execute Transaction
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <Input
                    type='text'
                    id='wallet1'
                    value={wallet1}
                    onChange={(e) => setWallet1(e.target.value)}
                    placeholder='Wallet 1'
                    className='w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <Input
                    type='text'
                    id='wallet2'
                    value={wallet2}
                    onChange={(e) => setWallet2(e.target.value)}
                    placeholder='Wallet 2'
                    className='w-full text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div className='space-y-4'>
                  <Input
                    type='text'
                    id='sig1'
                    value={sig1}
                    onChange={(e) => setSig1(e.target.value)}
                    placeholder='Signature 1'
                    className='w-full  text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <Input
                    type='text'
                    id='sig2'
                    value={sig2}
                    onChange={(e) => setSig2(e.target.value)}
                    placeholder='Signature 2'
                    className='w-full  text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={executeTxHandler}
              className=' text-white font-semibold bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-300'
            >
              exeTx
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

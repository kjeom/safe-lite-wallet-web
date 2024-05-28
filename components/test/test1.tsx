'use client';

import { useWalletClient, useWaitForTransactionReceipt } from 'wagmi';
import {
  signMessage,
  writeContract,
  readContract,
  verifyMessage,
  VerifyMessageReturnType,
  type VerifyMessageErrorType,
} from '@wagmi/core';
import { config } from '@/app/execute-tx/_components/config';
import { parseGwei, parseEther } from 'viem';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useSafeLite } from '@/hooks/useSafeLite';
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
        alert('safeLiteWallet is not ready');
        return;
      }

      // 논스 값 불러오기
      const nonce = await readContract(config, {
        abi: safeLiteAbi.abi,
        address: safeLiteWallet,
        functionName: 'nonce',
        args: [],
      });
      console.log('nonce is: ', nonce);

      // 서명 값 받아오기, hash = getTransactionHash -> ethers.utils.arrayify(hash)
      const hash: any = await readContract(config, {
        abi: safeLiteAbi.abi,
        address: safeLiteWallet,
        functionName: 'getTransactionHash',
        args: [nonce, walletClient?.account.address, parseEther('1'), ''],
      });
      console.log('Transaction hash fetched: ', hash);

      // 서명 값 넣어주기, owner1Sig = signMessage(ethers.utils.arrayify(hash))
      // const arrayifiedHash = ethers.utils.arrayify(hash);
      // console.log("Arrayified hash: ", arrayifiedHash);

      const signaturePromise = walletClient?.signMessage({
        message: { raw: hash },
      });
      const signature = await signaturePromise;
      console.log('hash is =', hash);
      console.log('signature is =', signature);

      // 서명 값 정렬하기
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

      console.log(
        sortSignatures(
          ['0x718579A4952DF3Ffc46226f4071Dc40131ae0E3d'],
          [signature || '']
        )
      );
      const recovered = await readContract(config, {
        abi: safeLiteAbi.abi,
        address: safeLiteWallet,
        functionName: 'recover',
        args: [hash, signature],
      });
      console.log('signature recover: ', recovered);

      console.log('toinput', toInput);
      console.log('address', walletClient?.account.address);

      // executeTransaction 호출
      const executeTransaction = await walletClient?.writeContract({
        abi: safeLiteAbi.abi,
        address: safeLiteWallet,
        functionName: 'executeTransaction',
        args: [
          walletClient?.account.address,
          parseEther('1'),
          '',
          sortSignatures(
            ['0x718579A4952DF3Ffc46226f4071Dc40131ae0E3d'],
            [signature || '']
          ),
          // InvalidArrayError: Value로 인해서 sortSignatures 함수 호출
        ],
        // gas: parseGwei('2'),
        // gasPrice: parseGwei('2'),
      });

      alert('suucced');
    } catch (error) {
      alert('failed');
    }
  };

  //! 멀티시그의 태생적 이유를 잊지말자..
  //! 만들어진 지갑에 코인이 있어야 한다.
  //! 그리고 이걸 대다수의 Owner가 싸인해서 허락을 받고 넘겨줘야 한다.

  return (
    <div>
      <h1>Execute Transaction</h1>
      <h1>{safeLiteWallet}</h1>
      <label htmlFor='to'>To:</label>
      <input
        type='text'
        id='to'
        value={toInput}
        onChange={(e) => setTo(e.target.value)}
      />
      <br />
      <label htmlFor='value'>Value:</label>
      <input
        type='number'
        id='value'
        value={valueInput}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* <br />
            <label htmlFor="data">Data:</label>
            <input
                type="text"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <br /> */}
      <button onClick={executeTransactionHandler}>Execute Transaction</button>
    </div>
  );
}

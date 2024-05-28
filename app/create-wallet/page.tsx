'use client';

import { useWalletClient, useWaitForTransactionReceipt } from 'wagmi';
import * as safeLiteAbi from '@/abi/safeLite.json';
import { useEffect, useState } from 'react';
import { isAddress } from 'web3-validator';
import { useSafeLite } from '@/hooks/useSafeLite';
import { Button, Card, CardBody, Input } from '@nextui-org/react';

export default function CreateWallet() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [safeLiteDeployTxHash, setSafeLiteDeployTxHash] = useState('');
  const result = useWaitForTransactionReceipt({
    hash: safeLiteDeployTxHash as `0x${string}`,
  });
  const [threshold, setThreshold] = useState(0);
  const [owners, setOwners] = useState<`0x${string}`[]>(['0x']);
  const safeLite = useSafeLite(
    result?.data?.contractAddress ? result?.data?.contractAddress : undefined
  );
  const safeLiteWallet = useSafeLite();

  const createHandler = async () => {
    let invalidAddr = '';
    owners.map((owner) => {
      if (!isAddress(owner)) {
        invalidAddr = owner;
      }
    });
    if (invalidAddr) {
      alert('Invalid address: ' + invalidAddr);
      return;
    }
    if (threshold <= 0 || threshold > owners.length) {
      alert('Invalid threshold: ' + threshold);
      return;
    }
    const contract = await walletClient?.deployContract({
      abi: safeLiteAbi.abi,
      bytecode: safeLiteAbi.bytecode as `0x${string}`,
      args: [1001, owners, threshold],
    });
    setSafeLiteDeployTxHash(contract ? contract : '');
    if (result.isFetched && result?.status !== 'success') {
      alert('Wallet Creation failed' + result?.error);
    }
    if (result.isFetched && result?.status == 'success') {
      alert('Wallet Creation succeed' + result?.error);
    }
    ``;
  };

  useEffect(() => {
    const newOwners = owners.slice();
    if (walletClient?.account.address) {
      newOwners[0] = walletClient?.account.address;
      setOwners(newOwners);
    }
  }, [walletClient?.account.address]);

  const ownerList = [];
  for (let i = 0; i < owners.length; i++) {
    ownerList.push(
      <li key={i}>
        <Input
          {...(i === 0 ? { readOnly: true } : {})}
          type='text'
          value={owners[i]}
          onChange={(e) => {
            const newOwners = owners.slice();
            newOwners[i] = e.target.value as `0x${string}`;
            setOwners(newOwners);
          }}
        />
      </li>
    );
  }

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-3xl font-bold mb-6'>Create Wallet</h1>
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-2'>Owners</h3>
          <div className='flex space-x-2 mb-2'>
            <Button
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
              onClick={() => {
                setOwners(owners.concat('' as `0x${string}`));
              }}
            >
              Add
            </Button>
            <Button
              className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
              onClick={() => {
                if (owners.length === 1) {
                  alert('Cannot delete the first owner');
                  return;
                }
                setOwners(owners.slice(0, owners.length - 1));
              }}
            >
              Delete
            </Button>
          </div>
          <ul className='space-y-2'>{ownerList}</ul>
        </div>
        <div className='mb-8'>
          <h3 className='text-xl font-semibold mb-2'>Threshold</h3>
          <Input
            type='number'
            value={String(threshold)}
            onChange={(e) => {
              setThreshold(parseInt(e.target.value));
            }}
            className='w-full px-3 py-2  rounded focus:outline-none focus:border-blue-500'
          />
        </div>

        <Button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
          onClick={createHandler}
        >
          Create
        </Button>
        <div className='mt-8'>
          <Card>
            <CardBody>
              <p>{safeLiteWallet}</p>
            </CardBody>
          </Card>

          {/* <h1 className='text-xl font-semibold'>{safeLiteWallet}</h1> */}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useReadContract, useWalletClient } from 'wagmi';
import * as safeLiteAbi from '@/abi/safeLite.json';
import { isAddress } from 'web3-validator';
import { useQueryClient } from '@tanstack/react-query';

export const useSafeLite = (address: `0x${string}` | undefined = undefined) => {
  const queryClient = useQueryClient();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const isOwner = useReadContract({
    abi: safeLiteAbi.abi,
    address,
    functionName: 'isOwner',
    args: [walletClient?.account.address],
  });

  if (address && isAddress(address) && isOwner.data === true) {
    queryClient.setQueryData(['safeLite'], () => {
      return address;
    });
  }

  const safeLite = queryClient.getQueryData(['safeLite']);
  return safeLite ? (safeLite as `0x${string}`) : undefined;
};

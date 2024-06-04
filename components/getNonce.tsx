import { ethers } from 'ethers';
import * as safeLiteAbi from '@/abi/safeLite.json';

export const getNonce = async (
  safeLiteAddress: string,
  provider: ethers.providers.Provider
): Promise<number> => {
  const contract = new ethers.Contract(
    safeLiteAddress,
    safeLiteAbi.abi,
    provider
  );

  try {
    const nonce: number = await contract.nonce();
    return nonce;
  } catch (error) {
    console.error('Failed to get nonce', error);
    throw error;
  }
};

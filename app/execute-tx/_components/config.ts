import { http, createConfig } from '@wagmi/core';
import { klaytnBaobab } from '@wagmi/core/chains';

export const config = createConfig({
  chains: [klaytnBaobab],
  transports: {
    [klaytnBaobab.id]: http(),
  },
  ssr: true,
});

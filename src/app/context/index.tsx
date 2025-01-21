'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { sepolia } from '@reown/appkit/networks';
import React, { useCallback, type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { projectId, wagmiAdapter } from '../config';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Bones X Demons',
  description: 'Bones X Demons',
  url: 'https://bonesxdemons.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
});

interface ContextProviderProps {
  children: ReactNode;
  cookies: string | null;
}

function ContextProvider({ children, cookies }: ContextProviderProps): JSX.Element {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
  const openModal = useCallback(() => {
    modal.open();
  }, []);
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
      <button onClick={openModal} className="hidden">
          Connect Wallet
        </button>
        {children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;

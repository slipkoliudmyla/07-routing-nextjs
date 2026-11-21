'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

let browserClient: QueryClient | undefined;

function getQueryClient() {
  const createClient = () =>
    new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

  if (typeof window === 'undefined') return createClient();

  browserClient ??= createClient();
  return browserClient;
}

export default function TanStackProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

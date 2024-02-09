import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

interface wrapperProps {
  children: ReactNode;
}

const createQueryWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: wrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return wrapper;
};

export { createQueryWrapper };

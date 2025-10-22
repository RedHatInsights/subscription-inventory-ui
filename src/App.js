import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { InventoryRoutes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 10 * 1000,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

const App = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.updateDocumentTitle('subscriptionInventory');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Notifications />
        <InventoryRoutes />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default connect()(App);

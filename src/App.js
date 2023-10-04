import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { InventoryRoutes } from './Routes';
import './App.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './components/Notifications';
import { useNavigate } from 'react-router-dom';
import { getPartialRouteFromPath } from './utilities/routeHelpers';
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
  const navigate = useNavigate();
  const chrome = useChrome();

  useEffect(() => {
    chrome.updateDocumentTitle('subscriptionInventory');
    const unregister = chrome.on('APP_NAVIGATION', (event) => {
      const partialURL = getPartialRouteFromPath(event.domEvent.href);
      navigate(partialURL);
    });
    return () => {
      unregister();
    };
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

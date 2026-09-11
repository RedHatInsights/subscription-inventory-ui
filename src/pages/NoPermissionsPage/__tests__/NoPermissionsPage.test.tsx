import React from 'react';
import { render } from '@testing-library/react';
import NoPermissionsPage from '../NoPermissionsPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <NoPermissionsPage />
    </Router>
  </QueryClientProvider>
);

describe('No Permissions Page', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<Page />);
    expect(getByText('You do not have access to Inventory')).toBeInTheDocument();
  });
});

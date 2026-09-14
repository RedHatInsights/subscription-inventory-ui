import React from 'react';
import { render } from '@testing-library/react';
import OopsPage from '../OopsPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <OopsPage />
    </Router>
  </QueryClientProvider>
);

describe('Oops Page', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<Page />);

    expect(getByText('This page is temporarily unavailable')).toBeInTheDocument();
  });
});

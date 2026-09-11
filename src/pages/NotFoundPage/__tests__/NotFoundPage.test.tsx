import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../NotFoundPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <NotFoundPage />
    </Router>
  </QueryClientProvider>
);

describe('Not Found Page', () => {
  it('renders correctly', async () => {
    render(<Page />);

    expect(
      screen.getByText(
        /Return to your subscription inventory to view the products to which your organization is subscribed/i
      )
    ).toBeInTheDocument();
  });
});

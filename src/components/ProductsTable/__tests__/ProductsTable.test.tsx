import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import ProductsTable from '../ProductsTable';
import useProducts from '../../../hooks/useProducts';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useProducts');
jest.mock('uuid', () => {
  return { v4: jest.fn(() => '00000000-0000-0000-0000-000000000000') };
});

const queryClient = new QueryClient();

const Table = () => (
  <QueryClientProvider client={queryClient}>
    <ProductsTable />
  </QueryClientProvider>
);

describe('ProductsTable', () => {
  def('loading', () => false);
  def('error', () => false);
  beforeEach(() => {
    (useProducts as jest.Mock).mockReturnValue({
      isLoading: get('loading'),
      error: get('error'),
      data: [
        {
          name: 'Space Blaster',
          productLine: 'blasters',
          quantity: 3,
          sku: 'ABC123'
        }
      ]
    });
  });

  it('renders correctly', () => {
    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  describe('when loading', () => {
    def('loading', () => true);

    it('renders the loading state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('when there is an error', () => {
    def('error', () => true);

    it('renders the error state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });
});

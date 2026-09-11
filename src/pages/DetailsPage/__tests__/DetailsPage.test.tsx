import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DetailsPage from '../DetailsPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSingleProduct from '../../../hooks/useSingleProduct';
import { Product } from '../../../hooks/useProducts';
import { useHasRelation } from '../../../hooks/useHasRelation';

jest.mock('../../../hooks/useHasRelation');
jest.mock('../../../hooks/useSingleProduct');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useParams: () => ({
    SKU: 'TESTSKU'
  })
}));

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DetailsPage />
    </Router>
  </QueryClientProvider>
);

const mockKesselCheck = (canReadProducts: boolean) => {
  (useHasRelation as jest.Mock).mockReturnValue({
    isLoading: false,
    has: canReadProducts
  });
};

const mockSingleProduct = (hasData: boolean) => {
  const data: Product = {
    name: hasData ? 'TEST Name' : '',
    productLine: hasData ? 'TEST Line' : '',
    quantity: hasData ? 3 : 0,
    sku: hasData ? 'TESTSKU' : '',
    serviceLevel: hasData ? 'TEST serviceLevel' : '',
    serviceType: hasData ? 'TEST serviceType' : '',
    capacity: hasData ? { name: 'test', quantity: '2' } : null,
    subscriptions: hasData
      ? [
          {
            number: '1234',
            contractNumber: '2345',
            quantity: '1',
            endDate: '2022-10-24T04:00:00.000Z',
            status: 'Active',
            startDate: '2021-10-24T04:00:00.000Z'
          }
        ]
      : [],
    virtLimit: hasData ? 'TEST VirtLimit' : null
  };

  (useSingleProduct as jest.Mock).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    error: false,
    data
  });

  queryClient.setQueryData(['singleProduct', 'TESTSKU'], data);
};

describe('Details Page', () => {
  it('loader shows correctly', async () => {
    (useHasRelation as jest.Mock).mockReturnValue({ isLoading: true, has: false });
    mockSingleProduct(true);
    const container = render(<Page />);
    expect(container).toHaveLoader();
  });
});

it('renders data', async () => {
  mockKesselCheck(true);
  mockSingleProduct(true);

  const { getAllByText } = render(<Page />);
  getAllByText('2345').forEach((el) => {
    expect(el).toBeInTheDocument();
  });
});

it("redirects when can't read products", async () => {
  mockKesselCheck(false);
  mockSingleProduct(false);
  render(<Page />);
  waitFor(() => expect(screen.getByAltText('no-permissions')).toBeInTheDocument());
});

it('renders not available for missing data', async () => {
  mockSingleProduct(false);
  mockKesselCheck(true);
  render(<Page />);
  expect(document.querySelector('.pf-v6-c-list').firstChild.textContent).toContain('Not Available');
});

it('handles errors', async () => {
  (useSingleProduct as jest.Mock).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    error: true,
    data: []
  });
  const { getAllByText } = render(<Page />);
  waitFor(() => expect(getAllByText('This page is temporarily unavailable')).toBeInTheDocument());
});

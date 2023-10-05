import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import DetailsPage from '../DetailsPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import useSingleProduct from '../../../hooks/useSingleProduct';
import { Product } from '../../../hooks/useProducts';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSingleProduct');
jest.mock('../../../hooks/useFeatureFlag', () => ({
  __esModule: true,
  default: jest.fn((_: string) => true)
}));
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  }),
  useParams: () => ({
    SKU: 'TESTSKU'
  })
}));

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Provider store={init().getStore()}>
        <Router>
          <DetailsPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

const mockAuthenticateUser = (
  isLoading: boolean,
  orgAdminStatus: boolean,
  canReadProducts: boolean
) => {
  (useUser as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: false,
    data: {
      isOrgAdmin: orgAdminStatus,
      canReadProducts
    }
  });

  queryClient.setQueryData('user', {
    isOrgAdmin: orgAdminStatus,
    canReadProducts
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
      : []
  };

  (useSingleProduct as jest.Mock).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    error: false,
    data
  });

  queryClient.setQueryData('singleProduct.TESTSKU', data);
};

describe('Details Page', () => {
  it('loader shows correctly', async () => {
    const isLoading = true;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, true);
    const container = render(<Page />);
    expect(container).toHaveLoader();
  });
});

it('renders data', async () => {
  const isLoading = false;
  const isOrgAdmin = true;
  const canReadProducts = true;
  mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
  mockSingleProduct(true);

  const { getAllByText } = render(<Page />);
  getAllByText('2345').forEach((el) => {
    expect(el).toBeInTheDocument();
  });
});

it("redirects when can't read products", async () => {
  const isLoading = false;
  const isOrgAdmin = true;
  const canReadProducts = false;
  mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
  mockSingleProduct(false);
  render(<Page />);
  waitFor(() => expect(screen.getByAltText('no-permissions')).toBeInTheDocument());
});

it('renders not available for missing data', async () => {
  const isLoading = false;
  const isOrgAdmin = true;
  const canReadProducts = true;

  mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
  mockSingleProduct(false);
  render(<Page />);
  expect(document.querySelector('.pf-c-list').firstChild.textContent).toContain('Not Available');
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

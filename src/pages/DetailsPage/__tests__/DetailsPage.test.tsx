import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DetailsPage from '../DetailsPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import useSingleProduct from '../../../hooks/useSingleProduct';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useSingleProduct');
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
      isSCACapable: true,
      canReadProducts
    }
  });

  queryClient.setQueryData('user', {
    isSCACapable: true,
    isOrgAdmin: orgAdminStatus,
    canReadProducts
  });
};

const mockSingleProduct = (hasUom: boolean) => {
  (useSingleProduct as jest.Mock).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    data: {
      name: 'TEST Name',
      productLine: 'TEST Line',
      quantity: 3,
      sku: 'TESTSKU',
      serviceLevel: '',
      serviceType: '',
      unitOfMeasure: hasUom ? { name: 'test', quantity: 2 } : null
    }
  });

  queryClient.setQueryData('singleProduct.TESTSKU', {
    name: 'TEST Name',
    productLine: 'TEST Line',
    quantity: 3,
    sku: 'TESTSKU',
    serviceLevel: 'TEST serviceLevel',
    serviceType: 'TEST serviceType',
    unitOfMeasure: hasUom ? { name: 'test', quantity: 2 } : null
  });
};

describe('Details Page', () => {
  it('loader shows correctly', async () => {
    window.insights = {};
    const isLoading = true;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, true);

    const { container } = render(<Page />);

    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  it('renders data', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    const canReadProducts = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
    mockSingleProduct(true);

    const { container } = render(<Page />);

    await waitFor(() => expect(useSingleProduct).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  it("redirects when can't read products", async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    const canReadProducts = false;
    mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
    mockSingleProduct(false);

    const { container } = render(<Page />);

    await waitFor(() => expect(useSingleProduct).toHaveBeenCalledTimes(2));
    expect(container).toMatchSnapshot();
  });

  it('renders not available for missing data', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    const canReadProducts = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, canReadProducts);
    mockSingleProduct(false);

    const { container } = render(<Page />);

    await waitFor(() => expect(useSingleProduct).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });
});

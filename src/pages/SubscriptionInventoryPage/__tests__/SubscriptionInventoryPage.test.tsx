import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SubscriptionInventoryPage from '../SubscriptionInventoryPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useUser');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const PageContainer = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Provider store={init().getStore()}>
        <Router>
          <SubscriptionInventoryPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

const mockAuthenticateUser = (
  isLoading: boolean,
  orgAdminStatus: boolean,
  isError: boolean,
  canReadProducts: boolean
) => {
  const user = {
    accountNumber: '8675309',
    canReadProducts: canReadProducts,
    isOrgAdmin: orgAdminStatus,
    isSCACapable: true
  };
  (useUser as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: isError,
    data: user
  });

  if (isError === false) {
    queryClient.setQueryData('user', user);
  }
};

jest.mock('../../../components/ProductsTable', () => () => <div>Products Table</div>);
jest.mock('../../NoPermissionsPage', () => () => <div>Not Authorized</div>);

describe('SubscriptionInventoryPage', () => {
  def('isLoading', () => false);
  def('isOrgAdmin', () => false);
  def('isError', () => false);
  def('canReadProducts', () => true);

  beforeEach(() => {
    window.insights = {};
    jest.resetAllMocks();
    mockAuthenticateUser(
      get('isLoading'),
      get('isOrgAdmin'),
      get('isError'),
      get('canReadProducts')
    );
  });

  it('renders correctly', async () => {
    const { container } = render(<PageContainer />);
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });

  describe('when the user call fails', () => {
    def('isError', () => true);

    it('renders an error message when user call fails', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when the user does not have proper permissions', () => {
    def('canReadProducts', () => false);

    it('redirects to not authorized page', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });
});

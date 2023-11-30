import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import SubscriptionInventoryPage from '../SubscriptionInventoryPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import useProducts from '../../../hooks/useProducts';
import useStatus from '../../../hooks/useStatus';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useProducts');
jest.mock('../../../hooks/useStatus');
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
  orgAdminStatus: boolean,
  isError: boolean,
  canReadProducts: boolean
) => {
  const user = {
    accountNumber: '8675309',
    canReadProducts: canReadProducts,
    isOrgAdmin: orgAdminStatus
  };
  (useUser as jest.Mock).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: isError,
    data: user
  });

  if (isError === false) {
    queryClient.setQueryData('user', user);
  }
};

// eslint-disable-next-line react/display-name
jest.mock('../../../components/StatusCountCards', () => () => <div>Status Count Cards</div>);
// eslint-disable-next-line react/display-name
jest.mock('../../../components/ProductsTable', () => () => <div>Products Table</div>);
// eslint-disable-next-line react/display-name
jest.mock('../../NoPermissionsPage', () => () => <div>Not Authorized</div>);
jest.mock('../../../components/PurchaseModal/onlineIcon.svg', () => 'Online Icon');
jest.mock('../../../components/PurchaseModal/salesIcon.svg', () => 'Sales Icon');
jest.mock('../../../components/PurchaseModal/partnersIcon.svg', () => 'Partners Icon');
jest.mock('../../../components/PurchaseModal/trainingIcon.svg', () => 'Training Icon');
jest.mock('../../../components/PurchaseModal/tryIcon.svg', () => 'Try Icon');

describe('SubscriptionInventoryPage', () => {
  def('orgAdmin', () => false);
  def('userError', () => false);
  def('canReadProducts', () => true);
  def('productsLoading', () => false);
  def('productsError', () => false);
  def('statusCardsLoading', () => false);
  def('statusCardsError', () => false);

  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthenticateUser(get('orgAdmin'), get('userError'), get('canReadProducts'));
    (useProducts as jest.Mock).mockReturnValue({
      isLoading: get('productsLoading'),
      error: get('productsError'),
      data: []
    });
    (useStatus as jest.Mock).mockReturnValue({
      isLoading: get('statusCardsLoading'),
      error: get('statusCardsError'),
      data: []
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<PageContainer />);
    expect(getByText('Subscriptions Inventory')).toBeInTheDocument();
  });

  describe('when the user call fails', () => {
    def('userError', () => true);

    it('renders an error message when user call fails', async () => {
      const { getByText } = render(<PageContainer />);
      expect(getByText('This page is temporarily unavailable')).toBeInTheDocument();
    });
  });

  describe('when the user does not have proper permissions', () => {
    def('canReadProducts', () => false);

    it('redirects to not authorized page', async () => {
      render(<PageContainer />);
      waitFor(() =>
        expect(screen.getByAltText('You do not have access to Inventory')).toBeInTheDocument()
      );
    });
  });

  describe('when the products call fails', () => {
    def('productsError', () => true);

    it('renders the error page', async () => {
      const { getByText } = render(<PageContainer />);
      expect(getByText('This page is temporarily unavailable')).toBeInTheDocument();
    });
  });

  describe('when the products are loading', () => {
    def('productsLoading', () => true);

    it('renders the loading component', async () => {
      const container = render(<PageContainer />);
      expect(container).toHaveLoader();
    });
  });

  describe('when the status cards call fails', () => {
    def('statusCardsError', () => true);

    it('renders the error page', async () => {
      const { getByText } = render(<PageContainer />);
      expect(getByText('This page is temporarily unavailable')).toBeInTheDocument();
    });
  });

  describe('when the status cards are loading', () => {
    def('statusCardsLoading', () => true);

    it('renders the loading component', async () => {
      const container = render(<PageContainer />);
      expect(container).toHaveLoader();
    });
  });
});

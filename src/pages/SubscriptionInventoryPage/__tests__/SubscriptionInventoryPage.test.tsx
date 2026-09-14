import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SubscriptionInventoryPage from '../SubscriptionInventoryPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAccountNumber from '../../../hooks/useAccountNumber';
import useProducts from '../../../hooks/useProducts';
import useStatus from '../../../hooks/useStatus';
import { def, get } from 'bdd-lazy-var';
import { useHasRelation } from '../../../hooks/useHasRelation';

jest.mock('../../../hooks/useAccountNumber');
jest.mock('../../../hooks/useHasRelation');
jest.mock('../../../hooks/useProducts');
jest.mock('../../../hooks/useStatus');

const queryClient = new QueryClient();

const PageContainer = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <SubscriptionInventoryPage />
    </Router>
  </QueryClientProvider>
);

const mockKesselCheck = (canReadProducts: boolean) => {
  (useHasRelation as jest.Mock).mockReturnValue({
    isLoading: false,
    has: canReadProducts
  });
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
  def('canReadProducts', () => true);
  def('productsLoading', () => false);
  def('productsError', () => false);
  def('statusCardsLoading', () => false);
  def('statusCardsError', () => false);

  beforeEach(() => {
    jest.resetAllMocks();
    mockKesselCheck(get('canReadProducts'));
    (useAccountNumber as jest.Mock).mockReturnValue({ data: '8675309' });
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

  it('renders the account number', async () => {
    const { getByText } = render(<PageContainer />);
    expect(getByText('Subscriptions for account 8675309')).toBeInTheDocument();
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

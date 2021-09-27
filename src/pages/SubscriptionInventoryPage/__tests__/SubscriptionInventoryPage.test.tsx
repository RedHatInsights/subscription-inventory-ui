import React from 'react';
import { render, waitFor } from '@testing-library/react';
import SubscriptionInventoryPage from '../SubscriptionInventoryPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';

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

const mockAuthenticateUser = (isLoading: boolean, orgAdminStatus: boolean, isError: boolean) => {
  (useUser as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: isError,
    data: {
      isOrgAdmin: orgAdminStatus,
      isSCACapable: true
    }
  });

  if (isError === false) {
    queryClient.setQueryData('user', { isSCACapable: true, isOrgAdmin: orgAdminStatus });
  }
};

describe('SubscriptionInventoryPage', () => {
  it('renders an error message when user call fails', async () => {
    window.insights = {};
    const isLoading = false;
    const isOrgAdmin = false;
    const isError = true;
    mockAuthenticateUser(isLoading, isOrgAdmin, isError);

    const { container } = render(<PageContainer />);
    await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
    expect(container).toMatchSnapshot();
  });
});

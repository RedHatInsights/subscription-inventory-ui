import React from 'react';
import { render } from '@testing-library/react';
import NoPermissionsPage from '../NoPermissionsPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from 'react-query';
import useUser from '../../../hooks/useUser';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/useUser');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: '/'
  })
}));

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Provider store={init().getStore()}>
        <Router>
          <NoPermissionsPage />
        </Router>
      </Provider>
    </Authentication>
  </QueryClientProvider>
);

const mockAuthenticateUser = (isLoading: boolean, orgAdminStatus: boolean) => {
  (useUser as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: false,
    data: {
      isOrgAdmin: orgAdminStatus
    }
  });

  queryClient.setQueryData('user', { isOrgAdmin: orgAdminStatus });
};

describe('No Permissions Page', () => {
  it('renders correctly', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    const { getByText } = render(<Page />);
    expect(getByText('You do not have access to Inventory')).toBeInTheDocument();
  });
});

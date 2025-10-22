import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../NotFoundPage';
import Authentication from '../../../components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUser from '../../../hooks/useUser';

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
          <NotFoundPage />
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

  queryClient.setQueryData(['user'], { isOrgAdmin: orgAdminStatus });
};

describe('Not Found Page', () => {
  it('renders correctly', async () => {
    const isLoading = false;
    const isOrgAdmin = true;
    mockAuthenticateUser(isLoading, isOrgAdmin);

    render(<Page />);

    expect(
      screen.getByText(
        /Return to your subscription inventory to view the products to which your organization is subscribed/i
      )
    ).toBeInTheDocument();
  });
});

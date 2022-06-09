import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';
import StatusCountCard, { StatusCardProps } from '../StatusCountCards';

const queryClient = new QueryClient();

const Cards: FunctionComponent<StatusCardProps> = ({ statusCardData, statusIsFetching }) => (
  <QueryClientProvider client={queryClient}>
    <StatusCountCard statusCardData={statusCardData} statusIsFetching={statusIsFetching} />
  </QueryClientProvider>
);

describe('StatusCountCard', () => {
  def('loading', () => false);
  def('error', () => false);
  def('fetching', () => false);
  def('data', () => [
    factories.status.build({
      active: 10,
      expiringSoon: 3,
      expired: 1,
      futureDated: 2
    })
  ]);

  it('renders correctly', () => {
    const { container } = render(
      <Cards statusCardData={get('data')} statusIsFetching={get('fetching')} />
    );

    expect(container).toMatchSnapshot();
  });
});

import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';
import StatusCountCard, { StatusCardProps } from '../StatusCountCards';

const queryClient = new QueryClient();

const Cards: FunctionComponent<StatusCardProps> = ({
  statusCardData,
  statusIsFetching,
  setFilter
}) => (
  <QueryClientProvider client={queryClient}>
    <StatusCountCard
      statusCardData={statusCardData}
      statusIsFetching={statusIsFetching}
      setFilter={setFilter}
    />
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

  const setFilter = jest.fn();

  it('can click active', () => {
    render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByText('Active'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click expiringSoon', () => {
    render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByText('Expiring soon'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click expired', () => {
    render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByText('Expired'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click futureDated', () => {
    render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByText('Future dated'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });
});

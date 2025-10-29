import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react';
import { def, get } from 'bdd-lazy-var';
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
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(container.querySelector('#active'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click expiringSoon', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(container.querySelector('#expiringSoon'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click expired', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(container.querySelector('#expired'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });

  it('can click futureDated', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={setFilter}
      />
    );

    fireEvent.click(container.querySelector('#futureDated'));
    expect(setFilter).toHaveBeenCalledTimes(1);
  });
});

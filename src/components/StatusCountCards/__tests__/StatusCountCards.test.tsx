import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';
import StatusCountCard, { StatusCardProps } from '../StatusCountCards';

const queryClient = new QueryClient();

const Cards: FunctionComponent<StatusCardProps> = ({ statusCardData, statusIsFetching }) => (
  <QueryClientProvider client={queryClient}>
    <StatusCountCard
      statusCardData={statusCardData}
      statusIsFetching={statusIsFetching}
      setFilter={() => {
        ('');
      }}
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

  it('renders correctly', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={() => {
          ('');
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('can click active', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={() => {
          'active';
        }}
      />
    );

    fireEvent.click(screen.getByText('Active'));
    expect(container).toMatchSnapshot();
  });

  it('can click expiringSoon', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={() => {
          'expiringSoon';
        }}
      />
    );

    fireEvent.click(screen.getByText('Expiring soon'));
    expect(container).toMatchSnapshot();
  });

  it('can click expired', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={() => {
          'expired';
        }}
      />
    );

    fireEvent.click(screen.getByText('Expired'));
    expect(container).toMatchSnapshot();
  });

  it('can click futureDated', () => {
    const { container } = render(
      <Cards
        statusCardData={get('data')}
        statusIsFetching={get('fetching')}
        setFilter={() => {
          'futureDated';
        }}
      />
    );

    fireEvent.click(screen.getByText('Future dated'));
    expect(container).toMatchSnapshot();
  });
});

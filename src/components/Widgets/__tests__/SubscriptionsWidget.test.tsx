import React from 'react';
import { render, screen } from '@testing-library/react';
import SubscriptionsWidget from '../SubscriptionsWidget';
import useStatus from '../../../hooks/useStatus';
import { BrowserRouter as Router } from 'react-router-dom';
jest.mock('../../../hooks/useStatus');

describe('SubscriptionsWidget', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the subscription cards when data is available', () => {
    (useStatus as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        active: 5,
        expiringSoon: 2,
        expired: 1,
        futureDated: 3
      }
    });

    render(
      <Router>
        <SubscriptionsWidget />
      </Router>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Active').closest('.pf-v5-c-alert')).toHaveClass('pf-m-success');
    expect(
      screen.getByText('Active').closest('.pf-v5-c-alert').querySelector('p')
    ).toHaveTextContent('5');

    expect(screen.getByText('Expiring soon')).toBeInTheDocument();
    expect(screen.getByText('Expiring soon').closest('.pf-v5-c-alert')).toHaveClass('pf-m-warning');
    expect(
      screen.getByText('Expiring soon').closest('.pf-v5-c-alert').querySelector('p')
    ).toHaveTextContent('2');

    expect(screen.getByText('Expired')).toBeInTheDocument();
    expect(screen.getByText('Expired').closest('.pf-v5-c-alert')).toHaveClass('pf-m-danger');
    expect(
      screen.getByText('Expired').closest('.pf-v5-c-alert').querySelector('p')
    ).toHaveTextContent('1');

    expect(screen.getByText('Future dated')).toBeInTheDocument();
    expect(screen.getByText('Future dated').closest('.pf-v5-c-alert')).toHaveClass('pf-m-custom');
    expect(
      screen.getByText('Future dated').closest('.pf-v5-c-alert').querySelector('p')
    ).toHaveTextContent('3');
  });

  it('renders the empty state when all subscription counts are zero', () => {
    (useStatus as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        active: 0,
        expiringSoon: 0,
        expired: 0,
        futureDated: 0
      }
    });

    render(
      <Router>
        <SubscriptionsWidget />
      </Router>
    );

    expect(screen.getByText('No connected subscriptions')).toBeInTheDocument();
    expect(
      screen.getByText('We cannot find any Red Hat subscriptions attached to your account')
    ).toBeInTheDocument();
  });
});

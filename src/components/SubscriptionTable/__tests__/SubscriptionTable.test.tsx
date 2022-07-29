import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SubscriptionTable, { SubscriptionTableProps } from '../SubscriptionTable';
import { render, fireEvent, screen } from '@testing-library/react';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';

const queryClient = new QueryClient();

const Table: FunctionComponent<SubscriptionTableProps> = ({ subscriptions }) => (
  <QueryClientProvider client={queryClient}>
    <SubscriptionTable subscriptions={subscriptions} />
  </QueryClientProvider>
);

describe('Subscription Table', () => {
  def('loading', () => false);
  def('error', () => false);
  def('fetching', () => false);
  def('data', () => [
    factories.subscription.build({
      number: '1234',
      contractNumber: '2345',
      quantity: '1',
      endDate: '2022-10-24T04:00:00.000Z',
      status: 'Active',
      startDate: '2021-10-24T04:00:00.000Z'
    })
  ]);

  it('renders correctly', async () => {
    const { container } = render(<Table subscriptions={get('data')} />);

    expect(container).toMatchSnapshot();
  });

  it('shows not available for missing values', () => {
    def('data', () => [
      factories.subscription.build({
        number: '',
        contractNumber: '',
        quantity: '',
        endDate: '',
        status: '',
        startDate: ''
      })
    ]);

    const { container } = render(<Table subscriptions={get('data')} />);

    expect(container).toMatchSnapshot();
  });

  describe('sorting and searching', () => {
    def('data', () => [
      factories.subscription.build({
        number: '1235',
        contractNumber: '2345',
        quantity: '1',
        endDate: '2022-10-26T04:00:00.000Z',
        status: 'Active',
        startDate: '2021-10-20T04:00:00.000Z'
      }),
      factories.subscription.build({
        number: '1234',
        contractNumber: '2344',
        quantity: '3',
        endDate: '2022-10-29T04:00:00.000Z',
        status: 'Active',
        startDate: '2021-10-23T04:00:00.000Z'
      }),
      factories.subscription.build({
        number: '1236',
        contractNumber: '2346',
        quantity: '4',
        endDate: '2022-10-27T04:00:00.000Z',
        status: 'Active',
        startDate: '2021-10-23T04:00:00.000Z'
      })
    ]);

    it('sorts by default', () => {
      const { container } = render(<Table subscriptions={get('data')} />);

      expect(container).toMatchSnapshot();
    });

    describe('sorting by clicked columns', () => {
      [
        'Subscription number',
        'Contract number',
        'Subscription quantity',
        'Start date',
        'End date'
      ].forEach((col) => {
        it(`sorts by ${col}`, () => {
          const { container } = render(<Table subscriptions={get('data')} />);

          fireEvent.click(screen.getByText(col));
          expect(container).toMatchSnapshot();
        });

        it(`sorts by ${col} reversed`, () => {
          const { container } = render(<Table subscriptions={get('data')} />);

          fireEvent.click(screen.getByText(col));
          fireEvent.click(screen.getByText(col));
          expect(container).toMatchSnapshot();
        });
      });
    });

    it('filters by subscription or contract number', () => {
      const { container } = render(<Table subscriptions={get('data')} />);

      const input = screen.getByPlaceholderText('Filter by subscription or contract number');
      fireEvent.change(input, { target: { value: '35' } });

      expect(container).toMatchSnapshot();
    });
  });

  describe('pagination', () => {
    def('data', () => [
      ...factories.subscription.buildList(10, {
        number: '1235',
        contractNumber: '2345',
        quantity: '1',
        endDate: '2022-10-26T04:00:00.000Z',
        status: 'Active',
        startDate: '2021-10-20T04:00:00.000Z'
      }),
      factories.subscription.build({
        number: '1236',
        contractNumber: '2346',
        quantity: '4',
        endDate: '2022-10-27T04:00:00.000Z',
        status: 'Active',
        startDate: '2021-10-23T04:00:00.000Z'
      })
    ]);

    it('pages', () => {
      const { container } = render(<Table subscriptions={get('data')} />);
      expect(container).toMatchSnapshot();
    });

    it('can change page', () => {
      const { container } = render(<Table subscriptions={get('data')} />);

      const nextPage = screen.getAllByLabelText('Go to next page')[0];
      fireEvent.click(nextPage);
      expect(container).toMatchSnapshot();
    });

    it('can change per page', () => {
      const { container } = render(<Table subscriptions={get('data')} />);

      const perPageArrow = screen.getAllByLabelText('Items per page')[0];
      fireEvent.click(perPageArrow);
      const perPageAmount = screen.getByText('20 per page');
      fireEvent.click(perPageAmount);
      expect(container).toMatchSnapshot();
    });
  });
});

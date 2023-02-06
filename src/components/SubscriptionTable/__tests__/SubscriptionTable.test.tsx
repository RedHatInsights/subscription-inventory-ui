import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SubscriptionTable, { SubscriptionTableProps } from '../SubscriptionTable';
import { render, fireEvent, screen } from '@testing-library/react';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';
import { Subscription } from '../../../hooks/useProducts';

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
  const data = [
    factories.subscription.build({
      number: '1234',
      contractNumber: '2345',
      quantity: '',
      endDate: '2022-10-24T04:00:00.000Z',
      status: 'Active',
      startDate: '2021-10-24T04:00:00.000Z'
    })
  ];

  it('renders correctly', async () => {
    const { getAllByText } = render(<Table subscriptions={data as Subscription[]} />);

    getAllByText('2345').forEach((el) => {
      expect(el).toBeInTheDocument();
    });
  });

  it('shows not available for missing values', () => {
    render(<Table subscriptions={data as Subscription[]} />);
    const table = screen.getByLabelText('subscriptions');
    expect(table.children[1].firstChild.childNodes[1].textContent).toEqual('Not Available');
  });

  describe('sorting and searching', () => {
    const formattedData: Record<string, string>[] = [
      {
        number: '1235',
        contractNumber: '2345',
        quantity: '1',
        endDate: '2022-10-26',
        status: 'Active',
        startDate: '2021-10-20'
      },
      {
        number: '1234',
        contractNumber: '2344',
        quantity: '3',
        endDate: '2022-10-29',
        status: 'Active',
        startDate: '2021-10-23'
      },
      {
        number: '1236',
        contractNumber: '2346',
        quantity: '4',
        endDate: '2022-10-27',
        status: 'Active',
        startDate: '2021-10-21'
      }
    ];

    it('sorts by default', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);
      const table = screen.getByLabelText('subscriptions');

      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(
        formattedData[1].contractNumber
      );
    });

    it('sorts by Contract Number, reverse', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);
      const table = screen.getByLabelText('subscriptions');

      fireEvent.click(screen.getByText('Contract number'));

      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(
        formattedData[2].contractNumber
      );
    });

    describe('sorting by clicked columns', () => {
      [
        ['Subscription quantity', 'quantity'],
        ['Start date', 'startDate'],
        ['End date', 'endDate']
      ].forEach((col, i) => {
        it(`sorts by ${col}`, () => {
          render(<Table subscriptions={formattedData as Subscription[]} />);

          const table = screen.getByLabelText('subscriptions');

          fireEvent.click(screen.getByText(col[0]));
          expect(table.children[1].firstChild.childNodes[i + 1].textContent).toEqual(
            formattedData.sort((a, b) => (a[col[1]] < b[col[1]] ? -1 : 1))[0][col[1]]
          );
        });

        it(`sorts by ${col} reversed`, () => {
          render(<Table subscriptions={formattedData as Subscription[]} />);

          const table = screen.getByLabelText('subscriptions');

          fireEvent.click(screen.getByText(col[0]));
          fireEvent.click(screen.getByText(col[0]));

          expect(table.children[1].firstChild.childNodes[i + 1].textContent).toEqual(
            formattedData.sort((a, b) => (a[col[1]] < b[col[1]] ? 1 : -1))[0][col[1]]
          );
        });
      });
    });

    it('filters by subscription or contract number', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);

      const input = screen.getByPlaceholderText('Filter by contract number');
      fireEvent.change(input, { target: { value: '35' } });

      expect(screen.queryByText('2344')).not.toBeInTheDocument();
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
      render(<Table subscriptions={get('data')} />);

      const table = screen.getByLabelText('subscriptions');

      expect(screen.getByText('of 2')).toBeInTheDocument();
      expect(table.querySelectorAll('tr').length).toBe(11);
    });

    it('can change page', () => {
      const { getByLabelText } = render(<Table subscriptions={get('data')} />);

      const table = screen.getByLabelText('subscriptions');

      const nextPage = screen.getAllByLabelText('Go to next page')[0];
      fireEvent.click(nextPage);

      expect(getByLabelText('Current page')).toHaveValue(2);
      expect(table.querySelectorAll('tr').length).toBe(2);
    });

    it('can change per page', () => {
      render(<Table subscriptions={get('data')} />);

      const table = screen.getByLabelText('subscriptions');

      const perPageArrow = screen.getAllByLabelText('Items per page')[0];
      fireEvent.click(perPageArrow);
      const perPageAmount = screen.getByText('20 per page');
      fireEvent.click(perPageAmount);
      expect(table.querySelectorAll('tr').length).toBe(12);
    });
  });
});

import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SubscriptionTable, { SubscriptionTableProps } from '../SubscriptionTable';
import { fireEvent, render, screen } from '@testing-library/react';
import { def, get } from 'bdd-lazy-var';
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
    expect(table.children[1].firstChild.childNodes[2].textContent).toEqual('Not Available');
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
          expect(table.children[1].firstChild.childNodes[i + 2].textContent).toEqual(
            formattedData.sort((a, b) => (a[col[1]] < b[col[1]] ? -1 : 1))[0][col[1]]
          );
        });

        it(`sorts by ${col} reversed`, () => {
          render(<Table subscriptions={formattedData as Subscription[]} />);

          const table = screen.getByLabelText('subscriptions');

          fireEvent.click(screen.getByText(col[0]));
          fireEvent.click(screen.getByText(col[0]));

          expect(table.children[1].firstChild.childNodes[i + 2].textContent).toEqual(
            formattedData.sort((a, b) => (a[col[1]] < b[col[1]] ? 1 : -1))[0][col[1]]
          );
        });
      });
    });

    it('filters by subscription or contract number', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);

      const input = screen.getByPlaceholderText('Filter by contract or subscription number');
      fireEvent.change(input, { target: { value: '35' } });

      expect(screen.queryByText('2344')).not.toBeInTheDocument();
    });
    it('filters by subscription number', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);

      const input = screen.getByPlaceholderText('Filter by contract or subscription number');

      fireEvent.change(input, { target: { value: '1234' } });

      const table = screen.getByLabelText('subscriptions');
      const rows = table.querySelectorAll('tbody tr');

      expect(rows).toHaveLength(1);
      expect(rows[0].children[1]).toHaveTextContent('1234');
      expect(rows[0].children[0]).toHaveTextContent('2344');
    });

    it('filters by contract number', () => {
      render(<Table subscriptions={formattedData as Subscription[]} />);

      const input = screen.getByPlaceholderText('Filter by contract or subscription number');

      fireEvent.change(input, { target: { value: '2346' } });

      const table = screen.getByLabelText('subscriptions');
      const rows = table.querySelectorAll('tbody tr');

      expect(rows).toHaveLength(1);
      expect(rows[0].children[0]).toHaveTextContent('2346');
      expect(rows[0].children[1]).toHaveTextContent('1236');
    });
    it('sorts by Subscription number ascending', () => {
      render(<Table subscriptions={[...formattedData] as Subscription[]} />);

      const table = screen.getByLabelText('subscriptions');

      fireEvent.click(screen.getByText('Subscription number'));

      const cells = table.querySelectorAll('tbody tr td:nth-child(2)');

      expect(Array.from(cells).map((cell) => cell.textContent)).toEqual(['1234', '1235', '1236']);
    });
    it('sorts by Subscription number descending', () => {
      render(<Table subscriptions={[...formattedData] as Subscription[]} />);

      const table = screen.getByLabelText('subscriptions');

      fireEvent.click(screen.getByText('Subscription number'));
      fireEvent.click(screen.getByText('Subscription number'));

      const cells = table.querySelectorAll('tbody tr td:nth-child(2)');

      expect(Array.from(cells).map((cell) => cell.textContent)).toEqual(['1236', '1235', '1234']);
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
      const { container } = render(<Table subscriptions={get('data')} />);

      const table = screen.getByLabelText('subscriptions');

      const perPageArrow = container.querySelectorAll('#options-menu-top-toggle')[0];
      fireEvent.click(perPageArrow);
      const perPageAmount = screen.getByText('20 per page');
      fireEvent.click(perPageAmount);
      expect(table.querySelectorAll('tr').length).toBe(12);
    });
  });
  it('renders subscription number next to contract number', () => {
    render(<Table subscriptions={data as Subscription[]} />);

    const table = screen.getByLabelText('subscriptions');
    const headers = table.querySelectorAll('thead th');
    const cells = table.querySelectorAll('tbody tr:first-child td');

    expect(headers[0]).toHaveTextContent('Contract number');
    expect(headers[1]).toHaveTextContent('Subscription number');
    expect(headers[2]).toHaveTextContent('Subscription quantity');

    expect(cells[0]).toHaveTextContent('2345');
    expect(cells[1]).toHaveTextContent('1234');
  });

  it('shows not available for missing subscription number', () => {
    const missingNumber = [
      factories.subscription.build({
        number: '',
        contractNumber: '',
        quantity: '1'
      })
    ];

    render(<Table subscriptions={missingNumber as Subscription[]} />);

    const table = screen.getByLabelText('subscriptions');
    const cells = table.querySelectorAll('tbody tr:first-child td');

    expect(cells[0]).toHaveTextContent('Not Available');
    expect(cells[1]).toHaveTextContent('Not Available');
    expect(cells[2]).toHaveTextContent('1');
  });
});

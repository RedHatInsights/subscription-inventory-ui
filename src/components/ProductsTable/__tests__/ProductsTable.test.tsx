import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductsTable, { ProductsTableProps } from '../ProductsTable';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';
import { Product } from '../../../hooks/useProducts';

const queryClient = new QueryClient();

const Table: FunctionComponent<ProductsTableProps> = ({ data, isFetching, filter, setFilter }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ProductsTable data={data} isFetching={isFetching} filter={filter} setFilter={setFilter} />
    </BrowserRouter>
  </QueryClientProvider>
);

const setFilter = jest.fn();

describe('ProductsTable', () => {
  def('loading', () => false);
  def('error', () => false);
  def('fetching', () => false);
  def('data', () => [
    factories.product.build({
      name: 'A',
      sku: 'MOCK123',
      quantity: 3,
      serviceLevel: 'Standard'
    })
  ]);

  it('renders correctly', () => {
    const { getAllByText } = render(
      <Table
        data={get('data')}
        isFetching={get('fetching')}
        filter={get('filter')}
        setFilter={setFilter}
      />
    );

    getAllByText('A').forEach((el) => {
      expect(el).toBeInTheDocument();
    });
  });

  it('renders the export button', () => {
    const { container } = render(
      <Table
        data={get('data')}
        isFetching={get('fetching')}
        filter={get('filter')}
        setFilter={setFilter}
      />
    );
    const buttonEl = container.querySelector('#export-button');
    expect(buttonEl).not.toBeNull();
    expect(buttonEl).toBeInTheDocument();
  });

  describe('when row column headings are clicked', () => {
    const formattedData = [
      {
        name: 'Z',
        sku: 'RH1234',
        quantity: 1,
        serviceLevel: 'Layered'
      },
      {
        name: 'A',
        sku: 'MOCK123',
        quantity: 3,
        serviceLevel: 'Standard'
      },
      {
        name: 'A',
        sku: 'MOCK123',
        quantity: 0,
        serviceLevel: 'Standard'
      },
      {
        name: '',
        sku: 'AMOCK1234',
        quantity: 2,
        serviceLevel: 'Standard'
      }
    ];

    it('sorts by name by default', () => {
      render(
        <Table
          data={formattedData as Product[]}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const table = screen.getByLabelText('Products');

      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(formattedData[0].name);
    });

    it('can sort by name, reversed', () => {
      render(
        <Table
          data={formattedData as Product[]}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const table = screen.getByLabelText('Products');

      fireEvent.click(screen.getByText('Name'));
      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(formattedData[0].name);
    });

    it('can sort by quantity', () => {
      render(
        <Table
          data={formattedData as Product[]}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const table = screen.getByLabelText('Products');

      fireEvent.click(screen.getByText('Quantity'));
      expect(parseInt(table.children[1].firstChild.childNodes[2].textContent)).toEqual(0);
    });

    it('can sort by quantity, reversed', () => {
      render(
        <Table
          data={formattedData as Product[]}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const table = screen.getByLabelText('Products');

      fireEvent.click(screen.getByText('Quantity'));
      fireEvent.click(screen.getByText('Quantity'));
      expect(parseInt(table.children[1].firstChild.childNodes[2].textContent)).toEqual(3);
    });

    describe('when using pagination', () => {
      def('data', () => [
        ...factories.product.buildList(10, {
          name: 'A',
          sku: 'MOCK123',
          quantity: 1,
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: 'Z',
          sku: 'RH123',
          quantity: 2,
          serviceLevel: 'Standard'
        })
      ]);

      it('can change page', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const nextPage = screen.getAllByLabelText('Go to next page')[0];
        fireEvent.click(nextPage);
        const currentPage = screen.getAllByLabelText('Current page');
        expect(currentPage[0]).toHaveValue(2);
      });
      it('can change per page', () => {
        const { container } = render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const table = screen.getByLabelText('Products');

        const perPageArrow = container.querySelectorAll('#options-menu-top-toggle')[0];
        fireEvent.click(perPageArrow);
        const perPageAmount = screen.getByText('20 per page');
        fireEvent.click(perPageAmount);
        expect(table.querySelectorAll('tr').length).toBe(12);
      });
      it('can sort by sku', () => {
        render(
          <Table
            data={formattedData as Product[]}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const table = screen.getByLabelText('Products');

        fireEvent.click(screen.getByText('SKU'));
        expect(table.children[1].firstChild.childNodes[1].textContent).toEqual('AMOCK1234');
      });

      it('can sort by sku, reversed', () => {
        render(
          <Table
            data={formattedData as Product[]}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const table = screen.getByLabelText('Products');

        fireEvent.click(screen.getByText('SKU'));
        fireEvent.click(screen.getByText('SKU'));
        expect(table.children[1].firstChild.childNodes[1].textContent).toEqual('RH1234');
      });

      it('can sort by serviceLevel', () => {
        render(
          <Table
            data={formattedData as Product[]}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const table = screen.getByLabelText('Products');

        fireEvent.click(screen.getByText('Service level'));
        expect(table.children[1].firstChild.childNodes[3].textContent).toEqual('Layered');
      });

      it('can sort by serviceLevel, reversed', () => {
        render(
          <Table
            data={formattedData as Product[]}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const table = screen.getByLabelText('Products');

        fireEvent.click(screen.getByText('Service level'));
        fireEvent.click(screen.getByText('Service level'));
        expect(table.children[1].firstChild.childNodes[3].textContent).toEqual('Standard');
      });
    });

    describe('when using pagination', () => {
      def('data', () => [
        ...factories.product.buildList(10, {
          name: 'A',
          sku: 'MOCK123',
          quantity: 1,
          productLine: 'letters',
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: 'Z',
          sku: 'RH123',
          quantity: 2,
          productLine: 'letters',
          serviceLevel: 'Standard'
        })
      ]);
    });

    describe('when the search is used', () => {
      def('data', () => [
        factories.product.build({
          name: 'Z',
          sku: 'RH123',
          quantity: 2,
          productLine: 'consonants',
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: 'A',
          sku: 'MOCK123',
          quantity: 1,
          productLine: 'vowels',
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: 'P',
          sku: 'Fake123',
          quantity: 1,
          productLine: 'consonants',
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: undefined,
          sku: undefined,
          quantity: 0,
          productLine: undefined,
          serviceLevel: undefined
        })
      ]);
    });

    describe('when the active filter is set', () => {
      def('data', () => [
        factories.product.build({
          name: 'Z',
          sku: 'RH123',
          quantity: 2,
          productLine: 'consonants',
          serviceLevel: 'Standard'
        }),
        factories.product.build({
          name: 'A',
          sku: 'MOCK123',
          quantity: 1,
          productLine: 'vowels',
          serviceLevel: 'Standard'
        })
      ]);

      it('renders with filter enabled', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={'active'}
            setFilter={() => {
              'active';
            }}
          />
        );

        expect(screen.getByText('Active')).toBeInTheDocument();
      });
      it('refines the results by product line', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={setFilter}
          />
        );

        const input = screen.getByPlaceholderText('Filter by Name or SKU');
        fireEvent.change(input, { target: { value: 'vowels' } });
        expect(screen.queryByText('consonants')).not.toBeInTheDocument();
      });

      it('renders status filter', async () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={'active'}
            setFilter={setFilter}
          />
        );

        expect(screen.getByRole('button', { name: 'close Active' }));
      });

      it('renders Clear filers', async () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={'active'}
            setFilter={setFilter}
          />
        );
        expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
      });
    });
    it('can be cleared', () => {
      render(
        <Table
          data={get('data')}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'Z' } });
      const clear = screen.getByLabelText('Reset');
      fireEvent.click(clear);
      expect(screen.queryByText('A')).toBeInTheDocument();
    });
    it('renders an empty state when no results are found', () => {
      render(
        <Table
          data={get('data')}
          isFetching={get('fetching')}
          filter={get('filter')}
          setFilter={setFilter}
        />
      );

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'ZZZ' } });
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    describe('when the expiringSoon filter is set', () => {
      def('filter', () => 'expiringSoon');

      it('renders with filter enabled', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={() => {
              'expiringSoon';
            }}
          />
        );

        expect(screen.getByText('Expiring soon')).toBeInTheDocument();
      });
    });

    describe('when the expired filter is set', () => {
      def('filter', () => 'expired');

      it('renders with filter enabled', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={() => {
              'expired';
            }}
          />
        );

        expect(screen.getByText('Expired')).toBeInTheDocument();
      });
    });

    describe('when the futureDated filter is set', () => {
      def('filter', () => 'futureDated');

      it('renders with filter enabled', () => {
        render(
          <Table
            data={get('data')}
            isFetching={get('fetching')}
            filter={get('filter')}
            setFilter={() => {
              'futureDated';
            }}
          />
        );

        expect(screen.getByText('Future dated')).toBeInTheDocument();
      });
    });
  });
});

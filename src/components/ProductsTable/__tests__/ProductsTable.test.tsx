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
      productLine: 'letters',
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
        productLine: 'letters',
        serviceLevel: 'Layered'
      },
      {
        name: 'A',
        sku: 'MOCK123',
        quantity: 3,
        productLine: 'vowels',
        serviceLevel: 'Standard'
      },
      {
        name: 'A',
        sku: 'MOCK123',
        quantity: 0,
        productLine: 'vowels',
        serviceLevel: 'Standard'
      },
      {
        name: '',
        sku: 'AMOCK1234',
        quantity: 2,
        productLine: 'consonants',
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

      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(
        formattedData[0].productLine
      );
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
      expect(table.children[1].firstChild.childNodes[0].textContent).toEqual(
        formattedData[0].name + formattedData[0].productLine
      );
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

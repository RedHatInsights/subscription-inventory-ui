import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsTable, { ProductsTableProps } from '../ProductsTable';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';

const queryClient = new QueryClient();

const Table: FunctionComponent<ProductsTableProps> = ({ data, isFetching }) => (
  <QueryClientProvider client={queryClient}>
    <ProductsTable data={data} isFetching={isFetching} />
  </QueryClientProvider>
);

describe('ProductsTable', () => {
  def('loading', () => false);
  def('error', () => false);
  def('fetching', () => false);
  def('data', () => [
    factories.product.build({ name: 'A', productLine: 'letters', sku: 'MOCK123', quantity: 3 })
  ]);

  it('renders correctly', () => {
    const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

    expect(container).toMatchSnapshot();
  });

  describe('when row column headings are clicked', () => {
    def('data', () => [
      factories.product.build({ name: 'Z', sku: 'RH1234', quantity: 1, productLine: 'letters' }),
      factories.product.build({
        name: undefined,
        sku: undefined,
        quantity: undefined,
        productLine: null
      }),
      factories.product.build({ name: 'A', sku: 'MOCK123', quantity: 3, productLine: 'vowels' }),
      factories.product.build({
        name: null,
        sku: undefined,
        quantity: 2,
        productLine: 'consonants'
      })
    ]);

    it('sorts by name by default', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      expect(container).toMatchSnapshot();
    });

    it('can sort by name, reversed', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      fireEvent.click(screen.getByText('Name'));
      expect(container).toMatchSnapshot();
    });

    it('can sort by quantity', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      fireEvent.click(screen.getByText('Quantity'));
      expect(container).toMatchSnapshot();
    });

    it('can sort by quantity, reversed', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      fireEvent.click(screen.getByText('Quantity'));
      fireEvent.click(screen.getByText('Quantity'));
      expect(container).toMatchSnapshot();
    });

    it('can sort by sku', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      fireEvent.click(screen.getByText('SKU'));
      expect(container).toMatchSnapshot();
    });

    it('can sort by sku, reversed', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      fireEvent.click(screen.getByText('SKU'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when using pagination', () => {
    def('data', () => [
      ...factories.product.buildList(10, {
        name: 'A',
        sku: 'MOCK123',
        quantity: 1,
        productLine: 'letters'
      }),
      factories.product.build({ name: 'Z', sku: 'RH123', quantity: 2, productLine: 'letters' })
    ]);

    it('can change page', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const nextPage = screen.getAllByLabelText('Go to next page')[0];
      fireEvent.click(nextPage);
      expect(container).toMatchSnapshot();
    });

    it('can change per page', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const perPageArrow = screen.getAllByLabelText('Items per page')[0];
      fireEvent.click(perPageArrow);
      const perPageAmount = screen.getByText('20 per page');
      fireEvent.click(perPageAmount);
      expect(container).toMatchSnapshot();
    });
  });

  describe('when the search is used', () => {
    def('data', () => [
      factories.product.build({ name: 'Z', sku: 'RH123', quantity: 2, productLine: 'consonants' }),
      factories.product.build({ name: 'A', sku: 'MOCK123', quantity: 1, productLine: 'vowels' }),
      factories.product.build({
        name: 'P',
        sku: 'Fake123',
        quantity: 1,
        productLine: 'consonants'
      }),
      factories.product.build({
        name: undefined,
        sku: undefined,
        quantity: 0,
        productLine: undefined
      })
    ]);

    it('refines the results by name', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'Z' } });
      expect(container).toMatchSnapshot();
    });

    it('refines the results by product line', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'vowels' } });
      expect(container).toMatchSnapshot();
    });

    it('can be cleared', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'Z' } });
      const clear = screen.getByLabelText('Reset');
      fireEvent.click(clear);
      expect(container).toMatchSnapshot();
    });

    it('renders an empty state when no results are found', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'ZZZ' } });
      expect(container).toMatchSnapshot();
    });

    it('refines the results by sku', () => {
      const { container } = render(<Table data={get('data')} isFetching={get('fetching')} />);

      const input = screen.getByPlaceholderText('Filter by Name or SKU');
      fireEvent.change(input, { target: { value: 'RH123' } });
      expect(container).toMatchSnapshot();
    });
  });
});

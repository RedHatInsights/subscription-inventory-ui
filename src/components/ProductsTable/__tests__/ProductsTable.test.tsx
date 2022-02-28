import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsTable from '../ProductsTable';
import useProducts from '../../../hooks/useProducts';
import { get, def } from 'bdd-lazy-var';
import factories from '../../../utilities/factories';

jest.mock('../../../hooks/useProducts');
jest.mock('uuid', () => {
  return { v4: jest.fn(() => '00000000-0000-0000-0000-000000000000') };
});

const queryClient = new QueryClient();

const Table = () => (
  <QueryClientProvider client={queryClient}>
    <ProductsTable />
  </QueryClientProvider>
);

describe('ProductsTable', () => {
  def('loading', () => false);
  def('error', () => false);
  def('data', () => [factories.product.build({ name: 'A', productLine: 'letters', quantity: 3 })]);

  beforeEach(() => {
    (useProducts as jest.Mock).mockReturnValue({
      isLoading: get('loading'),
      error: get('error'),
      data: get('data')
    });
  });

  it('renders correctly', () => {
    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  describe('when loading', () => {
    def('loading', () => true);

    it('renders the loading state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('when there is an error', () => {
    def('error', () => true);

    it('renders the error state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('when row column headings are clicked', () => {
    def('data', () => [
      factories.product.build({ name: 'Z', quantity: 1, productLine: 'letters' }),
      factories.product.build({ name: 'A', quantity: 3, productLine: 'letters' }),
      factories.product.build({ name: 'B', quantity: 2, productLine: 'letters' })
    ]);

    it('can sort by name', () => {
      const { container } = render(<Table />);

      const nameLabel = screen.getByText('Name');
      fireEvent.click(nameLabel);
      expect(container).toMatchSnapshot();
    });

    it('can sort by quantity', () => {
      const { container } = render(<Table />);

      const quantityLabel = screen.getByText('Quantity');
      fireEvent.click(quantityLabel);
      expect(container).toMatchSnapshot();
    });
  });

  describe('when using pagination', () => {
    def('data', () => [
      ...factories.product.buildList(10, { name: 'A', quantity: 1, productLine: 'letters' }),
      factories.product.build({ name: 'Z', quantity: 2, productLine: 'letters' })
    ]);

    it('can change page', () => {
      const { container } = render(<Table />);

      const nextPage = screen.getAllByLabelText('Go to next page')[0];
      fireEvent.click(nextPage);
      expect(container).toMatchSnapshot();
    });

    it('can change per page', () => {
      const { container } = render(<Table />);

      const perPageArrow = screen.getAllByLabelText('Items per page')[0];
      fireEvent.click(perPageArrow);
      const perPageAmount = screen.getByText('20 per page');
      fireEvent.click(perPageAmount);
      expect(container).toMatchSnapshot();
    });
  });
});

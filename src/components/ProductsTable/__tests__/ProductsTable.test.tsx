import React from 'react';
import { render } from '@testing-library/react';
import ProductsTable from '../ProductsTable';

describe('ProductsTable', () => {
  it('renders correctly', () => {
    const { container } = render(<ProductsTable />);

    expect(container).toMatchSnapshot;
  });
});

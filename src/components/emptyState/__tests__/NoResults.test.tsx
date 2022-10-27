import React from 'react';
import { render, screen } from '@testing-library/react';
import NoSearchResults from '../NoSearchResults';

it('renders correctly', () => {
  render(<NoSearchResults clearFilters={() => true} />);
  expect(
    screen.getByText(
      'No results match the filter criteria. Remove all filters or clear all filters to show results.'
    )
  ).toBeInTheDocument();
});

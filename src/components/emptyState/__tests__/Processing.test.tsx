import React from 'react';
import { render, screen } from '@testing-library/react';
import Processing from '../Processing';
import '@testing-library/jest-dom';

it('renders correctly', () => {
  render(<Processing />);
  const loader = screen.getByRole('progressbar');
  expect(loader).toBeVisible();
});

import React from 'react';
import { render } from '@testing-library/react';
import Processing from '../Processing';
import '@testing-library/jest-dom';

it('renders correctly', () => {
  const container = render(<Processing />);
  expect(container).toHaveLoader();
});

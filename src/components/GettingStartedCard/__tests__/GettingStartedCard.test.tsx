import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import GettingStartedCard from '../GettingStartedCard';

describe('GettingStartedCard', () => {
  it('renders a button', () => {
    render(<GettingStartedCard />);

    expect(document.body).toMatchSnapshot();
  });

  it('renders the card when the toggle is clicked', async () => {
    const { getByTestId } = render(<GettingStartedCard />);

    fireEvent.click(getByTestId('resources-toggle-button'));
    expect(document.body).toMatchSnapshot();
  });
});

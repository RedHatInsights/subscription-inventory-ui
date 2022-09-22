import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GettingStartedCard from '../GettingStartedCard';

describe('GettingStartedCard', () => {
  it('renders the card when the toggle is clicked', async () => {
    const { getByTestId } = render(<GettingStartedCard />);

    fireEvent.click(getByTestId('resources-toggle-button'));
    expect(
      screen.getByText('Activate a subscription purchased from a third party.')
    ).toBeInTheDocument();
  });
});

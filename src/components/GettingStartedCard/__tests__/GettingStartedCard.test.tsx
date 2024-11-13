import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GettingStartedCard from '../GettingStartedCard';

describe('GettingStartedCard', () => {
  it('Card should be open by default', async () => {
    const { getByTestId } = render(<GettingStartedCard />);
    const element = getByTestId('resources-toggle-button');
    const attributeValue = element.getAttribute('aria-expanded');
    expect(attributeValue).toBe('true');
  });

  it('closes the card when the toggle is clicked', async () => {
    const { getByTestId } = render(<GettingStartedCard />);
    const element = getByTestId('resources-toggle-button');
    fireEvent.click(element);
    const attributeValue = element.getAttribute('aria-expanded');
    expect(attributeValue).toBe('false');
  });
});

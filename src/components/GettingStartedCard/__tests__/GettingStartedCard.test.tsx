import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GettingStartedCard from '../GettingStartedCard';

describe('GettingStartedCard', () => {
  // This is an example of an unncessary test. If we write a test where 
  // we are checking the contents of the toggle button being selected and clicked,
  // then we don't need a test that checks if the button is there in the first place.

  // it('renders a button', () => {
  //   render(<GettingStartedCard />);

  //   expect(document.body).toMatchSnapshot();
  // });

  it('renders the card when the toggle is clicked', async () => {
    const { getByTestId } = render(<GettingStartedCard />);

    fireEvent.click(getByTestId('resources-toggle-button'));
    expect(screen.getByText('Activate a subscription purchased from a third party.')).toBeInTheDocument();
  });
});

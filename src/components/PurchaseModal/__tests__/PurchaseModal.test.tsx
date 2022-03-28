import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PurchaseModal from '../PurchaseModal';

jest.mock('../onlineIcon.svg', () => 'Online Icon');
jest.mock('../salesIcon.svg', () => 'Sales Icon');
jest.mock('../partnersIcon.svg', () => 'Partners Icon');
jest.mock('../trainingIcon.svg', () => 'Training Icon');
jest.mock('../tryIcon.svg', () => 'Try Icon');

describe('PurchaseModal', () => {
  it('renders a button', () => {
    render(<PurchaseModal />);

    expect(document.body).toMatchSnapshot();
  });

  it('renders a modal when the button is pressed', async () => {
    render(<PurchaseModal />);

    fireEvent.click(screen.getByText('Purchase subscriptions'));
    await screen.findAllByText('Red Hat Marketplace');
    expect(document.body).toMatchSnapshot();
  });
});

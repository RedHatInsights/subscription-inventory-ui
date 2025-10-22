import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ExportSubscriptions } from '../';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useExportSubscriptions from '../../../hooks/useExportSubscriptions';
import useNotifications from '../../../hooks/useNotifications';

const queryClient = new QueryClient();

const ExportButton = () => (
  <QueryClientProvider client={queryClient}>
    <ExportSubscriptions />
  </QueryClientProvider>
);

jest.mock('../../../hooks/useExportSubscriptions');
jest.mock('../../../hooks/useNotifications');

describe('Export Subscriptions', () => {
  it('renders correctly', () => {
    const { container } = render(<ExportButton />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('reacts to hovers', () => {
    const { container } = render(<ExportButton />);
    // hover to set color
    fireEvent.mouseEnter(container.querySelector('svg'));
    expect(container.querySelector('svg')).toHaveStyle({
      color: '#151515'
    });

    // unhover to remove color
    fireEvent.mouseLeave(container.querySelector('svg'));
    expect(container.querySelector('svg')).toHaveStyle({
      color: '#6a6e73'
    });
  });

  describe('when clicked', () => {
    window.URL.createObjectURL = jest.fn();

    jest.spyOn(window.URL, 'createObjectURL');
    jest.spyOn(document, 'createElement');
    (useExportSubscriptions as jest.Mock).mockReturnValue({
      data: { blob: 'info', filename: 'test' },
      refetch: jest.fn(),
      error: false
    });

    it('sets up the link', () => {
      const { container } = render(<ExportButton />);
      expect(document.createElement).toHaveBeenCalledTimes(2);

      fireEvent.click(container.querySelector('svg'));
      expect(document.createElement).toHaveBeenCalledTimes(3);
    });

    it('adds the blob', () => {
      const { container } = render(<ExportButton />);
      fireEvent.click(container.querySelector('svg'));
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });

    describe('on error', () => {
      const addErrorNotification = jest.fn();
      (useExportSubscriptions as jest.Mock).mockReturnValue({
        data: {},
        refetch: jest.fn(),
        error: true
      });
      (useNotifications as jest.Mock).mockReturnValue({
        addErrorNotification
      });

      it('shows the notification', () => {
        const { container } = render(<ExportButton />);
        fireEvent.click(container.querySelector('svg'));
        expect(addErrorNotification).toHaveBeenCalledTimes(1);
      });
    });
  });
});

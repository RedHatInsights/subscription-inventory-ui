import React from 'react';
import { render, screen } from '@testing-library/react';
import ExternalLink from '../ExternalLink';

describe('External Link', () => {
  it('renders correctly with href and text', () => {
    const props = {
      href: 'foo.com',
      children: 'This is text for an external link'
    };

    const { getByRole } = render(<ExternalLink {...props} />);
    expect(getByRole('link')).toHaveAttribute('href', 'foo.com');
    expect(screen.getByText('This is text for an external link')).toBeInTheDocument();
  });
});

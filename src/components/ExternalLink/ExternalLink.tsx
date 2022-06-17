import React, { FC, ReactNode } from 'react';
import { Button } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

interface ExternalLinkProps {
  children: ReactNode | string;
  href: string;
  variant?: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({ children, href, variant = 'link' }) => {
  return (
    <Button
      variant={variant}
      component="a"
      href={href}
      target="_blank"
      isInline
      icon={<ExternalLinkAltIcon />}
      iconPosition="right"
    >
      {children}
    </Button>
  );
};

export default ExternalLink;

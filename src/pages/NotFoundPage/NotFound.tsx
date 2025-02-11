import React from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import WrenchIcon from '@patternfly/react-icons/dist/dynamic/icons/wrench-icon';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  function handleClick() {
    navigate('/');
  }
  return (
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText="Your organization currently has no subscriptions for this product"
        icon={<EmptyStateIcon icon={WrenchIcon} color="grey" />}
        headingLevel="h5"
      />
      <EmptyStateBody>
        Return to your subscription inventory to view the products to which your organization is
        subscribed.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button variant="primary" onClick={handleClick}>
          Return to Subscriptions Inventory
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NotFound;

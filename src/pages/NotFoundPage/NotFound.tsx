import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';
import {useHistory}from "react-router-dom";

const NotFound: React.FC = () => {
    let history = useHistory();
    function handleClick() {
      history.push("/");
    }
    return (
      <EmptyState variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={WrenchIcon} color="grey" />
        <Title headingLevel="h5" size="lg">
          Your organization currently has no subscriptions for this product
        </Title>
        <EmptyStateBody>
          Return to your subscription inventory to view the products to which your organization is
          subscribed.
        </EmptyStateBody>
        <Button variant="primary" onClick={handleClick} >
          Return to Subscription Inventory
        </Button>
      </EmptyState>
    );
  };

  export default NotFound
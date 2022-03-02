import React, { FunctionComponent } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageSection, Title } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import ProductsTable from '../../components/ProductsTable';

const SubscriptionInventoryPage: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');

  const Page: FunctionComponent = () => {
    return (
      <>
        <PageHeader>
          <PageHeaderTitle title="Subscription Inventory" />
        </PageHeader>
        <Main>
          <PageSection variant="light">
            <Title headingLevel="h2">All subscriptions for account {user.accountNumber}</Title>
            <ProductsTable />
          </PageSection>
        </Main>
      </>
    );
  };

  if (user.canReadProducts) {
    return <Page />;
  } else {
    return <Redirect to="/no-permissions" />;
  }
};

export default withRouter(SubscriptionInventoryPage);

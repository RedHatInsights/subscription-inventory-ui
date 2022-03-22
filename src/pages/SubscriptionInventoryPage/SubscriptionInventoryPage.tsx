import React, { FunctionComponent } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { PageSection, Title } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import ProductsTable from '../../components/ProductsTable';
import { Processing } from '../../components/emptyState';
import useProducts from '../../hooks/useProducts';

const SubscriptionInventoryPage: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const { isFetching, isLoading, error, data } = useProducts();

  const Page: FunctionComponent = () => {
    return (
      <>
        <PageHeader>
          <PageHeaderTitle title="Subscription Inventory" />
        </PageHeader>
        <Main>
          <PageSection variant="light">
            <Title headingLevel="h2">All subscriptions for account {user.accountNumber}</Title>
            <>
              {isLoading && !error && <Processing />}

              {!isLoading && !error && <ProductsTable data={data} isFetching={isFetching} />}

              {error && <Unavailable />}
            </>
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

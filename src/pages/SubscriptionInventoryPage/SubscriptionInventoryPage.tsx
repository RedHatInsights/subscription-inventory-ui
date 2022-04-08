import React, { FunctionComponent } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { PageSection, Split, SplitItem, Title } from '@patternfly/react-core';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import ProductsTable from '../../components/ProductsTable';
import { Processing } from '../../components/emptyState';
import useProducts from '../../hooks/useProducts';
import PurchaseModal from '../../components/PurchaseModal';
import GettingStartedCard from '../../components/GettingStartedCard';
import { Stack } from '@patternfly/react-core';
import { StackItem } from '@patternfly/react-core';

const SubscriptionInventoryPage: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const { isFetching, isLoading, error, data } = useProducts();

  const Page: FunctionComponent = () => {
    return (
      <>
        <PageHeader>
          <Split hasGutter>
            <SplitItem isFilled>
              <PageHeaderTitle title="Subscription Inventory" />
            </SplitItem>
            <SplitItem>
              <PurchaseModal />
            </SplitItem>
          </Split>
        </PageHeader>
        <Main>
          <Stack hasGutter>
            <StackItem>
              <GettingStartedCard />
            </StackItem>
            <StackItem>
              <PageSection variant="light">
                <Title headingLevel="h2">All subscriptions for account {user.accountNumber}</Title>
                <>
                  {isLoading && !error && <Processing />}

                  {!isLoading && !error && <ProductsTable data={data} isFetching={isFetching} />}

                  {error && <Unavailable />}
                </>
              </PageSection>
            </StackItem>
          </Stack>
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

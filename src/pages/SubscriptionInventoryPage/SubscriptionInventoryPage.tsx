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
import useStatus from '../../hooks/useStatus';
import PurchaseModal from '../../components/PurchaseModal';
import GettingStartedCard from '../../components/GettingStartedCard';
import { Stack } from '@patternfly/react-core';
import { StackItem } from '@patternfly/react-core';
import StatusCountCards from '../../components/StatusCountCards';

const SubscriptionInventoryPage: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const statusCardData = useStatus();
  const productData = useProducts();

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
              <>
                {statusCardData.isLoading && !statusCardData.error && <Processing />}

                {!statusCardData.isLoading && !statusCardData.error && (
                  <StatusCountCards
                    statusCardData={statusCardData.data}
                    statusIsFetching={statusCardData.isFetching}
                  />
                )}

                {statusCardData.error && <Unavailable />}
              </>
            </StackItem>
            <StackItem>
              <PageSection variant="light">
                <Title headingLevel="h2">All subscriptions for account {user.accountNumber}</Title>
                <>
                  {productData.isLoading && !productData.error && <Processing />}

                  {!productData.isLoading && !productData.error && (
                    <ProductsTable data={productData.data} isFetching={productData.isFetching} />
                  )}

                  {productData.error && <Unavailable />}
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

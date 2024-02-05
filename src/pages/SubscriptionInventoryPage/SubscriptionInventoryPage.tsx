import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [filter, setFilter] = useState<string>('');

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const productData = useProducts(filter);
  const statusCardData = useStatus();
  const redirectRoute = '/no-permissions';
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.canReadProducts) {
      navigate(redirectRoute);
    }
  }, [user.canReadProducts]);

  const Page: FunctionComponent = () => {
    return (
      <>
        <PageHeader>
          <Split hasGutter>
            <SplitItem isFilled>
              <PageHeaderTitle title="Subscriptions Inventory" />
            </SplitItem>
            <SplitItem>
              <PurchaseModal />
            </SplitItem>
          </Split>
        </PageHeader>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <GettingStartedCard />
            </StackItem>
            {!statusCardData.error && !productData.error && (
              <>
                <StackItem>
                  <>
                    {statusCardData.isLoading && <Processing />}

                    {!statusCardData.isLoading && (
                      <StatusCountCards
                        statusCardData={statusCardData.data}
                        statusIsFetching={statusCardData.isFetching}
                        setFilter={setFilter}
                        filter={filter}
                      />
                    )}
                  </>
                </StackItem>
                <StackItem>
                  <PageSection variant="light">
                    <Title headingLevel="h2">
                      All subscriptions for account {user.accountNumber}
                    </Title>
                    <>
                      {productData.isLoading && <Processing />}

                      {!productData.isLoading && (
                        <ProductsTable
                          data={productData.data}
                          isFetching={productData.isFetching}
                          filter={filter}
                          setFilter={setFilter}
                        />
                      )}
                    </>
                  </PageSection>
                </StackItem>
              </>
            )}
            {(statusCardData.error || productData.error) && <Unavailable />}
          </Stack>
        </PageSection>
      </>
    );
  };

  return <Page />;
};

export default SubscriptionInventoryPage;

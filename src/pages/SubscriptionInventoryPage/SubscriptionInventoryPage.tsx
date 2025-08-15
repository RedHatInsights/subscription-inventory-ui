import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Split } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { SplitItem } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import ProductsTable from '../../components/ProductsTable';
import { Processing } from '../../components/emptyState';
import useProducts from '../../hooks/useProducts';
import useStatus from '../../hooks/useStatus';
import PurchaseModal from '../../components/PurchaseModal';
import GettingStartedCard from '../../components/GettingStartedCard';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import StatusCountCards from '../../components/StatusCountCards';
import NoPermissionsPage from '../NoPermissionsPage';
const SubscriptionInventoryPage: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<string>(() => searchParams.get('status') || '');

  if (!user.canReadProducts) {
    return <NoPermissionsPage />;
  }

  useEffect(() => {
    setFilter(searchParams.get('status') || '');
  }, [searchParams]);
  const productData = useProducts(filter);
  const statusCardData = useStatus();
  const updateFilter = (newFilter: string) => {
    if (newFilter) {
      searchParams.set('status', newFilter);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };
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
                {statusCardData.isLoading && <Processing />}
                {!statusCardData.isLoading && (
                  <StatusCountCards
                    statusCardData={statusCardData.data}
                    statusIsFetching={statusCardData.isFetching}
                    setFilter={updateFilter}
                    filter={filter}
                  />
                )}
              </StackItem>
              <StackItem>
                <Title headingLevel="h2" className="pf-v5-u-mb-md">
                  All subscriptions for account {user.accountNumber}
                </Title>
              </StackItem>
              <StackItem>
                {productData.isLoading && <Processing />}
                {!productData.isLoading && (
                  <ProductsTable
                    data={productData.data}
                    isFetching={productData.isFetching}
                    filter={filter}
                    setFilter={updateFilter}
                  />
                )}
              </StackItem>
            </>
          )}
          {(statusCardData.error || productData.error) && <Unavailable />}
        </Stack>
      </PageSection>
    </>
  );
};
export default SubscriptionInventoryPage;

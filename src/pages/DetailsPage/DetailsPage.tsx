import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  List,
  ListItem,
  PageSection,
  Title
} from '@patternfly/react-core';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React, { FunctionComponent, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Processing } from '../../components/emptyState';
import useSingleProduct from '../../hooks/useSingleProduct';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import NotFound from '../NotFoundPage/NotFound';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import SubscriptionTable from '../../components/SubscriptionTable';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { HttpError } from '../../utilities/errors';
import Section from '@redhat-cloud-services/frontend-components/Section';

const DetailsPage: FunctionComponent = () => {
  const { SKU } = useParams<{ SKU: string }>();

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const { isLoading, error, data } = useSingleProduct(SKU);
  const tableIsEnabled = useFeatureFlag('subscriptionInventory.detailsTable');
  const missingText = 'Not Available';
  const redirectRoute = '/no-permissions';
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.canReadProducts) {
      navigate(redirectRoute);
    }
  }, [user.canReadProducts]);

  const Page: FunctionComponent = () => (
    <>
      <PageHeader>
        {isLoading && !error && <Processing />}

        {!isLoading && !error && (
          <>
            <Breadcrumb>
              <BreadcrumbItem render={() => <Link to="../">Subscriptions Inventory</Link>} />
              <BreadcrumbItem isActive>{data.name} </BreadcrumbItem>
            </Breadcrumb>
            <PageHeaderTitle title={data.name} />
            <List isPlain>
              <ListItem className="pf-v5-u-mt-md">
                <b>SKU: </b>
                {data.sku || missingText}
              </ListItem>
              <ListItem className="pf-v5-u-mt-0">
                <b>Quantity: </b>
                {data.quantity ?? missingText}
              </ListItem>
              <ListItem className="pf-v5-u-mt-0">
                <b>Support level: </b>
                {data.serviceLevel || missingText}
              </ListItem>
              <ListItem className="pf-v5-u-mt-0">
                <b>Support type: </b>
                {data.serviceType || missingText}
              </ListItem>
              <ListItem className="pf-v5-u-mt-0">
                <b>Capacity: </b>
                {data.capacity ? (
                  <>
                    {data.capacity.name} <Badge isRead>{data.capacity.quantity}</Badge>
                  </>
                ) : (
                  <>Not Available</>
                )}
              </ListItem>
            </List>
          </>
        )}
      </PageHeader>
      {tableIsEnabled && !error && (
        <Section>
          <PageSection variant="light">
            <Title headingLevel="h2">Subscription details</Title>
            {isLoading && !error && <Processing />}
            {!isLoading && !error && <SubscriptionTable subscriptions={data?.subscriptions} />}
          </PageSection>
        </Section>
      )}

      {error && (error as HttpError).status == 404 && <NotFound />}
      {error && (error as HttpError).status != 404 && <Unavailable />}
    </>
  );

  return <Page />;
};

export default DetailsPage;

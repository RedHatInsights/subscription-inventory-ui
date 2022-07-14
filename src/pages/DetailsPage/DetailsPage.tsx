import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  List,
  ListItem,
  PageSection,
  Title
} from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React, { FunctionComponent } from 'react';
import { Link, Redirect, useParams, withRouter } from 'react-router-dom';
import { Processing } from '../../components/emptyState';
import useSingleProduct from '../../hooks/useSingleProduct';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';
import SubscriptionTable from '../../components/SubscriptionTable';
import useFeatureFlag from '../../hooks/useFeatureFlag';

const DetailsPage: FunctionComponent = () => {
  const { SKU } = useParams<{ SKU: string }>();

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const { isLoading, error, data } = useSingleProduct(SKU);
  const tableIsEnabled = useFeatureFlag('subscriptionInventory.detailsTable');

  const missingText = 'Not Available';

  const Page: FunctionComponent = () => (
    <>
      <PageHeader>
        {isLoading && !error && <Processing />}

        {!isLoading && !error && (
          <>
            <Breadcrumb>
              <BreadcrumbItem render={() => <Link to="/">Subscription Inventory</Link>} />
              <BreadcrumbItem isActive>{data.name} </BreadcrumbItem>
            </Breadcrumb>
            <PageHeaderTitle title={data.name} />
            <List isPlain>
              <ListItem className="pf-u-mt-md">
                <b>SKU: </b>
                {data.sku || missingText}
              </ListItem>
              <ListItem className="pf-u-mt-0">
                <b>Quantity: </b>
                {data.quantity ?? missingText}
              </ListItem>
              <ListItem className="pf-u-mt-0">
                <b>Support level: </b>
                {data.serviceLevel || missingText}
              </ListItem>
              <ListItem className="pf-u-mt-0">
                <b>Support type: </b>
                {data.serviceType || missingText}
              </ListItem>
              <ListItem className="pf-u-mt-0">
                <b>Unit of Measure: </b>
                {data.unitOfMeasure ? (
                  <>
                    {data.unitOfMeasure.name} <Badge isRead>{data.unitOfMeasure.quantity}</Badge>
                  </>
                ) : (
                  <>Not Available</>
                )}
              </ListItem>
            </List>
          </>
        )}

        {error && <Unavailable />}
      </PageHeader>
      {tableIsEnabled && (
        <Main>
          <PageSection variant="light">
            <Title headingLevel="h2">Subscriptions</Title>
            {isLoading && !error && <Processing />}
            {!isLoading && !error && <SubscriptionTable subscriptions={data?.subscriptions} />}
            {error && <Unavailable />}
          </PageSection>
        </Main>
      )}
    </>
  );

  if (user.canReadProducts) {
    return <Page />;
  } else {
    return <Redirect to="/no-permissions" />;
  }
};

export default withRouter(DetailsPage);

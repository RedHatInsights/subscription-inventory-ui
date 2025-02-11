import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';
import { Breadcrumb } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';
import { BreadcrumbItem } from '@patternfly/react-core/dist/dynamic/components/Breadcrumb';
import { List } from '@patternfly/react-core/dist/dynamic/components/List';
import { ListItem } from '@patternfly/react-core/dist/dynamic/components/List';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
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
import { HttpError } from '../../utilities/errors';
import Section from '@redhat-cloud-services/frontend-components/Section';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

const DetailsPage: FunctionComponent = () => {
  const { SKU } = useParams<{ SKU: string }>();

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');
  const { isLoading, error, data } = useSingleProduct(SKU);
  const missingText = 'Not Available';
  const redirectRoute = '../no-permissions';
  const docsLink =
    'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_rhel_system_registration/adv-reg-rhel-config-vm-sub_';
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
              <ListItem className="pf-v5-u-mt-0">
                <b>
                  Virtual Guest Limit{' '}
                  <Popover
                    aria-label="Learn more about Virtual Guest Limit"
                    bodyContent={
                      <p>
                        The maximum number of virtual machines that can run on a system at no
                        additional cost if the system using this subscription is deployed as a
                        hypervisor to host virtual machines. When this field displays a non-zero
                        value, usage of the virt-who utility is required for proper subscription
                        reporting. Learn more about working with virtual machines and
                        hypervisor-based subscriptions.{' '}
                        <a href={docsLink} target="_blank" rel="noreferrer">
                          <ExternalLinkAltIcon />
                        </a>
                      </p>
                    }
                  >
                    <QuestionCircleIcon onClick={(e) => e.stopPropagation()} />
                  </Popover>
                  :{' '}
                </b>
                {data.virtLimit != undefined && data.virtLimit != '' ? data.virtLimit : missingText}
              </ListItem>
            </List>
          </>
        )}
      </PageHeader>
      {!error && (
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

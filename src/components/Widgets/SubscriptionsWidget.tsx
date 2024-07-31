import React, { useMemo } from 'react';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import useStatus from '../../hooks/useStatus';
import { QueryClient, QueryClientProvider } from 'react-query';
import './SubscriptionsWidget.scss';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertVariant } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Gallery } from '@patternfly/react-core/dist/dynamic/layouts/Gallery';
import { Link } from 'react-router-dom';
import EmptyStateSubscriptionsIcon from './public/images/SubscriptionsWidgetEmptyStateIcon';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
const queryClient = new QueryClient();
const SubscriptionsWidget = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SubsWidget />
    </QueryClientProvider>
  );
};
const cardData = {
  active: {
    title: 'Active',
    variant: AlertVariant.success
  },
  expiringSoon: {
    title: 'Expiring soon',
    variant: AlertVariant.warning
  },
  expired: {
    title: 'Expired',
    variant: AlertVariant.danger
  },
  futureDated: {
    title: 'Future dated',
    customIcon: <OutlinedCalendarAltIcon />
  }
};
const SubsWidget = () => {
  const statusCardData = useStatus();
  const isCardDataEmpty = useMemo(
    () =>
      !statusCardData.isLoading &&
      statusCardData?.data &&
      Object.keys(cardData).every((name: keyof typeof cardData) => statusCardData.data[name] === 0),
    [statusCardData]
  );
  return (
    <div className="subscription-inventory">
      {isCardDataEmpty ? (
        <EmptyState variant={EmptyStateVariant.lg}>
          <EmptyStateIcon icon={EmptyStateSubscriptionsIcon} />
          <Title headingLevel="h4" size="lg">
            No connected subscriptions
          </Title>
          <EmptyStateBody>
            <Stack>
              <StackItem>
                We cannot find any Red Hat subscriptions attached to your account
              </StackItem>
            </Stack>
          </EmptyStateBody>
        </EmptyState>
      ) : (
        <Gallery hasGutter>
          {['active', 'expiringSoon', 'expired', 'futureDated'].map(
            (name: keyof typeof cardData) => {
              return (
                <Link
                  to={`/subscriptions/inventory?status=${name}`}
                  className="alert-link"
                  rel="noopener noreferrer"
                  target="_blank"
                  key={name}
                >
                  <Alert isInline {...cardData[name]}>
                    {!statusCardData.isLoading && statusCardData?.data ? (
                      <p>{statusCardData.data[name]}</p>
                    ) : (
                      <Spinner size="md" />
                    )}
                  </Alert>
                </Link>
              );
            }
          )}
        </Gallery>
      )}
    </div>
  );
};
export default SubscriptionsWidget;

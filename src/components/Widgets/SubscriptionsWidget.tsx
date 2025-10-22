import React, { useMemo } from 'react';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import useStatus from '../../hooks/useStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './SubscriptionsWidget.scss';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertVariant } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Gallery } from '@patternfly/react-core/dist/dynamic/layouts/Gallery';
import { Link } from 'react-router-dom';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import EmptyStateSubscriptionsIcon from './public/images/SubscriptionsWidgetEmptyStateIcon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

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
export const SubsWidget = () => {
  const statusCardData = useStatus();
  const isCardDataEmpty = useMemo(
    () =>
      !statusCardData.isLoading &&
      statusCardData?.data &&
      Object.keys(cardData).every((name: keyof typeof cardData) => statusCardData.data[name] === 0),
    [statusCardData]
  );
  const isCardError = statusCardData.isError;

  return (
    <div className="subscription-inventory-widget">
      {isCardDataEmpty ? (
        <EmptyState
          variant={EmptyStateVariant.lg}
          icon={EmptyStateSubscriptionsIcon}
          titleText="No connected subscriptions"
          headingLevel="h4"
        >
          <EmptyStateBody>
            <Stack>
              <StackItem>
                We cannot find any Red Hat subscriptions attached to your account
              </StackItem>
            </Stack>
          </EmptyStateBody>
        </EmptyState>
      ) : isCardError ? (
        <EmptyState
          variant={EmptyStateVariant.lg}
          icon={ExclamationCircleIcon}
          titleText="Whoops!"
          headingLevel="h4"
        >
          <EmptyStateBody>
            <Stack>
              <StackItem>Something went wrong, try again later</StackItem>
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
                  target="_self"
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

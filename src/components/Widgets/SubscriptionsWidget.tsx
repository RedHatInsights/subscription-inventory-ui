import React, { useMemo } from 'react';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import useStatus from '../../hooks/useStatus';
import { QueryClient, QueryClientProvider } from 'react-query';
import './SubscriptionsWidget.scss';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  Stack,
  StackItem,
  Title,
  Alert,
  Gallery
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import EmptyStateSubscriptionsIcon from './public/images/SubscriptionsWidgetEmptyStateIcon';
import { Spinner } from '@patternfly/react-core';

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
    variant: 'success'
  },
  expiringSoon: {
    title: 'Expiring soon',
    variant: 'warning'
  },
  expired: {
    title: 'Expired',
    variant: 'danger'
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
        <EmptyState variant={EmptyStateVariant.large}>
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
        <Gallery
          hasGutter
          className="pf-v5-u-p-md"
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          {['active', 'expiringSoon', 'expired', 'futureDated'].map(
            (name: keyof typeof cardData) => {
              return (
                <Link
                  to="/subscriptions/inventory"
                  style={{ flex: 1, textDecoration: 'none' }}
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

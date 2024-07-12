import React, { FunctionComponent } from 'react';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Gallery } from '@patternfly/react-core/dist/dynamic/layouts/Gallery';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import { StatusCard } from '../../hooks/useStatus';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';

interface StatusCardProps {
  statusCardData: StatusCard | undefined;
  statusIsFetching: boolean;
  setFilter(filter: string): void;
  filter?: string;
}
const StatusCountCards: FunctionComponent<StatusCardProps> = ({
  statusCardData,
  setFilter,
  filter
}) => {
  const cardData = {
    active: {
      friendlyName: 'Active',
      icon: <CheckCircleIcon color="var(--pf-v5-global--success-color--100)" />
    },
    expiringSoon: {
      friendlyName: 'Expiring soon',
      icon: <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />
    },
    expired: {
      friendlyName: 'Expired',
      icon: <ExclamationCircleIcon className="pf-u-danger-color-100" />
    },
    futureDated: { friendlyName: 'Future dated', icon: <OutlinedCalendarAltIcon /> }
  };
  return (
    <Grid hasGutter>
      <Gallery hasGutter style={{ display: 'flex', flexDirection: 'row' }}>
        {['active', 'expiringSoon', 'expired', 'futureDated'].map((name: keyof typeof cardData) => (
          <Card
            id={`${name}-card`}
            style={{ flex: 1 }}
            isSelected={filter === name}
            isClickable
            key={name}
            onClick={() => setFilter(name)}
          >
            <CardHeader>{cardData[name].friendlyName}</CardHeader>
            <CardBody>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>{cardData[name].icon}</FlexItem>
                <FlexItem>{statusCardData ? statusCardData[name] : '0'}</FlexItem>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Gallery>
    </Grid>
  );
};
export { StatusCountCards as default, StatusCardProps };

import React, { FunctionComponent } from 'react';
import { Card, CardBody, Flex, FlexItem, Gallery, Grid } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import { StatusCard } from '../../hooks/useStatus';
import { CardHeader } from '@patternfly/react-core';

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
        {['active', 'expiringSoon', 'expired', 'futureDated'].map((name: keyof typeof cardData) => {
          return (
            <Card
              id={`${name}-card`}
              style={{ flex: 1 }}
              isSelected={filter == name}
              isClickable
              key={name}
            >
              <CardHeader
                selectableActions={{
                  selectableActionId: name,
                  onClickAction: () => setFilter(name),
                  selectableActionAriaLabelledby: `${name}-set-filter`,
                  name: `${name}-card`
                }}
              >
                {cardData[name].friendlyName}
              </CardHeader>
              <CardBody>
                <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>{cardData[name].icon}</FlexItem>
                  <FlexItem>{statusCardData[name]}</FlexItem>
                </Flex>
              </CardBody>
            </Card>
          );
        })}
      </Gallery>
    </Grid>
  );
};

export { StatusCountCards as default, StatusCardProps };

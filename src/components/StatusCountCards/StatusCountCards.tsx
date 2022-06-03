import React, { FunctionComponent } from 'react';
import { Card, CardBody, Flex, FlexItem, Gallery, Grid } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import { StatusCard } from '../../hooks/useStatus';

interface StatusCardProps {
  statusCardData: StatusCard | undefined;
  statusIsFetching: boolean;
}

const StatusCountCards: FunctionComponent<StatusCardProps> = ({ statusCardData }) => {
  const cardTitles = {
    active: 'Active',
    expiringSoon: 'Expiring soon',
    expired: 'Expired',
    futureDated: 'Future dated'
  };

  const getStatusCard = (statusCard: StatusCard): StatusCard => {
    const { active, expiringSoon, expired, futureDated } = statusCard;
    return statusCard;
  };

  const statusCard = getStatusCard(statusCardData);

  return (
    <Grid hasGutter>
      <Gallery hasGutter style={{ display: 'flex', flexDirection: 'row' }}>
        <Card style={{ flex: 1 }}>
          <CardBody>{cardTitles.active}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <CheckCircleIcon color="var(--pf-global--success-color--100)" />
              </FlexItem>
              <FlexItem>{statusCard.active}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card style={{ flex: 1 }}>
          <CardBody>{cardTitles.expiringSoon}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />
              </FlexItem>
              <FlexItem>{statusCard.expiringSoon}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card style={{ flex: 1 }}>
          <CardBody>{cardTitles.expired}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ExclamationCircleIcon className="pf-u-danger-color-100" />
              </FlexItem>
              <FlexItem>{statusCard.expired}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card style={{ flex: 1 }}>
          <CardBody>{cardTitles.futureDated}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <OutlinedCalendarAltIcon />
              </FlexItem>
              <FlexItem>{statusCard.futureDated}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </Gallery>
    </Grid>
  );
};

export { StatusCountCards as default, StatusCardProps };

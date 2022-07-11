import React, { FunctionComponent, useState } from 'react';
import { Card, CardBody, Flex, FlexItem, Gallery, Grid } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import OutlinedCalendarAltIcon from '@patternfly/react-icons/dist/js/icons/outlined-calendar-alt-icon';
import { StatusCard } from '../../hooks/useStatus';

interface StatusCardProps {
  statusCardData: StatusCard | undefined;
  statusIsFetching: boolean;
  setFilter(filter: string): void;
}

const StatusCountCards: FunctionComponent<StatusCardProps> = ({ statusCardData, setFilter }) => {
  const cardTitles = {
    active: 'Active',
    expiringSoon: 'Expiring soon',
    expired: 'Expired',
    futureDated: 'Future dated'
  };
  
  const handleSetFilter = (filter: string) => {
    setFilter(filter);
  };

  return (
    <Grid hasGutter>
      <Gallery hasGutter style={{ display: 'flex', flexDirection: 'row' }}>
        <Card 
         id="active-card" 
         filter = "active"
         onClick={() => handleSetFilter("active")}
         hasSelectableInput
         isSelectableRaised
         style={{ flex: 1 }}>
          <CardBody>{cardTitles.active}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <CheckCircleIcon color="var(--pf-global--success-color--100)" />
              </FlexItem>
              <FlexItem>{statusCardData.active}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card 
         id='expiringSoon-card'
         onClick={() => handleSetFilter("expiringSoon")}
         hasSelectableInput
         isSelectableRaised
         style={{ flex: 1 }}>
          <CardBody>{cardTitles.expiringSoon}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />
              </FlexItem>
              <FlexItem>{statusCardData.expiringSoon}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card 
         id='expired-card'
         onClick={() => handleSetFilter("expired")}
         hasSelectableInput
         isSelectableRaised
         style={{ flex: 1 }}>
          <CardBody>{cardTitles.expired}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ExclamationCircleIcon className="pf-u-danger-color-100" />
              </FlexItem>
              <FlexItem>{statusCardData.expired}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
        <Card
          id='futureDated-card'
          onClick={() => handleSetFilter("futureDated")}
          hasSelectableInput
          isSelectableRaised
          style={{ flex: 1 }}>
          <CardBody>{cardTitles.futureDated}</CardBody>
          <CardBody>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <OutlinedCalendarAltIcon />
              </FlexItem>
              <FlexItem>{statusCardData.futureDated}</FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </Gallery>
    </Grid>
  );
};

export {StatusCountCards as default, StatusCardProps};

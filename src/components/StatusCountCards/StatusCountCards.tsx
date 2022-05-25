import React, { FunctionComponent } from 'react';
import {
  Card,
  CardBody,
  Divider,
  Flex,
  FlexItem,
  Gallery,
  Grid,
  GridItem
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

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

  const cardData = {
    iconWithCount: [
      {
        title: cardTitles.active,
        content: [
          {
            icon: <CheckCircleIcon color="var(--pf-global--success-color--100)" />,
            count: statusCard.active
          }
        ],
        layout: 'icon'
      },
      {
        title: cardTitles.expiringSoon,
        content: [
          {
            icon: <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />,
            count: statusCard.expiringSoon
          }
        ],
        layout: 'icon'
      },
      {
        title: cardTitles.expired,
        content: [
          {
            icon: <ExclamationCircleIcon className="pf-u-danger-color-100" />,
            count: statusCard.expired
          }
        ],
        layout: 'icon'
      },
      {
        title: cardTitles.futureDated,
        content: [
          {
            icon: <CheckCircleIcon color="var(--pf-global--success-color--100)" />,
            count: statusCard.futureDated
          }
        ],
        layout: 'icon'
      }
    ]
  };

  const renderContent = (content, layout) => {
    return (
      <Flex display={{ default: 'inlineFlex' }}>
        {content.map(({ icon, count }, index: number) => (
          <React.Fragment key={index}>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>{icon}</FlexItem>
              <FlexItem>{count}</FlexItem>
            </Flex>
            {content.length > 1 && index === 0 && (
              <Divider
                key={`${index}_d`}
                orientation={{
                  default: 'vertical'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Flex>
    );
  };
  return (
    <Grid hasGutter>
      {Object.keys(cardData).map((cardGroup, groupIndex) => {
        const galleryWidth = '350px';
        let cardAlign;
        let titleAlign;
        return (
          <GridItem key={groupIndex}>
            <Gallery
              hasGutter
              style={{ '--pf-l-gallery--GridTemplateColumns--min': galleryWidth } as any}
            >
              {cardData[cardGroup].map(({ title, content, layout }, cardIndex) => (
                <Card
                  style={{ textAlign: cardAlign }}
                  key={`${groupIndex}${cardIndex}`}
                  component="div"
                >
                  <CardBody style={{ textAlign: titleAlign }}>{title}</CardBody>
                  <CardBody>{renderContent(content, layout)}</CardBody>
                </Card>
              ))}
            </Gallery>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export { StatusCountCards as default, StatusCardProps };

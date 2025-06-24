import React, { FunctionComponent, useState } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardFooter } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import ExternalLink from '../ExternalLink';
import onlineIcon from './onlineIcon.svg';
import salesIcon from './salesIcon.svg';
import partnersIcon from './partnersIcon.svg';
import trainingIcon from './trainingIcon.svg';
import tryIcon from './tryIcon.svg';

const PurchaseModal: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  interface SectionHeadingProps {
    icon: string;
    title: string;
  }

  const SectionHeading: FunctionComponent<SectionHeadingProps> = ({ icon, title }) => {
    return (
      <Flex
        alignItems={{ default: 'alignItemsFlexStart' }}
        grow={{ default: 'grow' }}
        spaceItems={{ default: 'spaceItemsXs' }}
      >
        <FlexItem style={{ height: '30px' }}>
          <img src={icon} style={{ height: '30px' }} />
        </FlexItem>
        <FlexItem>
          <Title headingLevel="h2" size="lg">
            {title}
          </Title>
        </FlexItem>
      </Flex>
    );
  };

  interface PurchaseCardProps {
    body: string;
    ctaHref: string;
    ctaText: string;
    title: string;
  }

  const PurchaseCard: FunctionComponent<PurchaseCardProps> = ({
    body,
    ctaHref,
    ctaText,
    title
  }) => {
    return (
      <Card isFullHeight>
        <CardTitle>{title}</CardTitle>
        <CardBody>{body}</CardBody>
        <CardFooter>
          <ExternalLink href={ctaHref} variant="primary">
            {ctaText}
          </ExternalLink>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleToggle}>
        Purchase subscriptions
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleToggle}
        title="Purchase Subscriptions"
        variant={ModalVariant.medium}
        className="pf-v6-u-p-lg"
      >
        <Grid hasGutter className="pf-v6-u-m-0">
          <GridItem span={12}>
            <SectionHeading icon={onlineIcon} title="Online" />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="A simpler way to buy and manage enterprise software, with automated deployment to any cloud."
              ctaHref="https://marketplace.redhat.com"
              ctaText="Go to the Marketplace"
              title="Red Hat Marketplace"
            />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="Easily configure and buy Red Hat Enterprise Linux in our online store."
              ctaHref="https://www.redhat.com/store"
              ctaText="Go to the Red Hat Store"
              title="Red Hat Store"
            />
          </GridItem>
          <GridItem span={6}>
            <SectionHeading icon={salesIcon} title="Sales" />
          </GridItem>
          <GridItem span={6}>
            <SectionHeading icon={partnersIcon} title="Partners" />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="Get expert help configuring Red Hat Enterprise Linux to suit your needs."
              ctaHref="https://www.redhat.com/en/contact/sales"
              ctaText="Contact Sales"
              title="From a Red Hatter"
            />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="Find and work with an authorized Red Hat partner"
              ctaHref="https://redhat.secure.force.com/finder"
              ctaText="Search for partners"
              title="Through our partners"
            />
          </GridItem>
          <GridItem span={6}>
            <SectionHeading icon={trainingIcon} title="Training" />
          </GridItem>
          <GridItem span={6}>
            <SectionHeading icon={tryIcon} title="Try" />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="Get access to more than 1,000 instructor-led recordings, training courses, and up to 400 hours of hands-on labs - which can all be completed online at your own pace."
              ctaHref="https://www.redhat.com/training/learning-subscription"
              ctaText="Learn more"
              title="Red Hat Learning Subscription"
            />
          </GridItem>
          <GridItem span={6}>
            <PurchaseCard
              body="Our no-cost trials help you gain hands-on experience, prepare for a certification, or assess if a product is right for your organization."
              ctaHref="https://www.redhat.com/en/products/trials"
              ctaText="Go to product trial center"
              title="Red Hat product trial center"
            />
          </GridItem>
        </Grid>
      </Modal>
    </>
  );
};

export default PurchaseModal;

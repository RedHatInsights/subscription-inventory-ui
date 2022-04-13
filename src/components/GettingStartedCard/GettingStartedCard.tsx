import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Flex,
  Grid,
  Label,
  Level,
  List,
  ListItem
} from '@patternfly/react-core';
import ExternalLink from '../ExternalLink';
import ArrowRightIcon from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import ClipboardCheckIcon from '@patternfly/react-icons/dist/js/icons/clipboard-check-icon';
import RouteIcon from '@patternfly/react-icons/dist/js/icons/route-icon';
import RocketIcon from '@patternfly/react-icons/dist/js/icons/rocket-icon';
import GraduationCapIcon from '@patternfly/react-icons/dist/js/icons/graduation-cap-icon';
// import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

const GettingStartedCard: FunctionComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onExpand = () => {
    setIsExpanded(!isExpanded);
  };

  interface ResourceListItem {
    key: string;
    href: string;
    text: string;
  }

  interface ResourceListProps {
    items: ResourceListItem[];
  }

  const ResourceList: FunctionComponent<ResourceListProps> = ({ items }) => {
    return (
      <List isPlain>
        {items.map((item) => {
          return (
            <ListItem key={item.key}>
              <ExternalLink href={item.href} variant="link">
                {item.text}
              </ExternalLink>
            </ListItem>
          );
        })}
      </List>
    );
  };

  interface ResourceItemButtonProps {
    href: string;
    text: string;
  }

  const ResourceItemButton: FunctionComponent<ResourceItemButtonProps> = ({ href, text }) => {
    return (
      <Button
        href={href}
        component="a"
        variant="link"
        isInline
        icon={<ArrowRightIcon />}
        iconPosition="right"
      >
        {text}
      </Button>
    );
  };

  interface ResourceItemProps {
    labelIcon: JSX.Element;
    labelTitle: string;
    labelText: string;
    resourceList: JSX.Element;
    button: JSX.Element;
  }

  const ResourceItem: FunctionComponent<ResourceItemProps> = ({
    labelIcon,
    labelTitle,
    labelText,
    resourceList,
    button
  }) => {
    return (
      <Flex
        spaceItems={{ default: 'spaceItemsLg' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
        direction={{ default: 'column' }}
      >
        <Flex
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          direction={{ default: 'column' }}
          grow={{ default: 'grow' }}
        >
          <Label icon={labelIcon} color="blue">
            {labelTitle}
          </Label>
          <p>{labelText}</p>
          {resourceList}
        </Flex>
        {button}
      </Flex>
    );
  };
  return (
    <Card id="getting-started-card" isExpanded={isExpanded}>
      <CardHeader
        onExpand={onExpand}
        toggleButtonProps={{
          id: 'resources-toggle-button',
          'aria-label': 'Actions',
          'aria-labelledby': 'titleId resources-toggle-button',
          'aria-expanded': isExpanded,
          'data-testid': 'resources-toggle-button'
        }}
      >
        {isExpanded && <CardTitle id="getting-started-title">Getting started resources</CardTitle>}
        {!isExpanded && (
          <Level hasGutter>
            <CardTitle id="getting-started-title">Getting started resources</CardTitle>
          </Level>
        )}
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <Grid md={6} lg={3} hasGutter>
            <ResourceItem
              labelIcon={<ClipboardCheckIcon />}
              labelTitle="Activate a subscription"
              labelText="Activate a subscription purchased from a third party."
              resourceList={
                <ResourceList
                  items={[
                    {
                      key: 'subscription-activation',
                      href: 'https://access.redhat.com/subscriptions/activate/redhat',
                      text: 'Subscription Activation'
                    },
                    {
                      key: 'activate-dell-tag',
                      href: 'https://access.redhat.com/subscriptions/activate/dell',
                      text: 'Activate a Dell Service Tag'
                    }
                  ]}
                />
              }
              button={
                <ResourceItemButton
                  href="https://access.redhat.com/support/contact/customerService"
                  text="Contact Red Hat Customer Service"
                />
              }
            />
            <ResourceItem
              labelIcon={<RouteIcon />}
              labelTitle="Explore subscription benefits"
              labelText="Explore the benefits of your Red Hat subscription."
              resourceList={
                <ResourceList
                  items={[
                    {
                      key: 'subscription-benefits',
                      href: 'https://www.redhat.com/en/about/value-of-subscription',
                      text: 'Benefits of a Red Hat subscription'
                    },
                    {
                      key: 'subscription-model-faq',
                      href: 'https://www.redhat.com/en/about/subscription-model-faq',
                      text: 'Red Hat subscription model FAQs'
                    }
                  ]}
                />
              }
              button={
                <ResourceItemButton
                  href="https://www.redhat.com/en/contact"
                  text="Talk to a Red Hatter"
                />
              }
            />
            <ResourceItem
              labelIcon={<RocketIcon />}
              labelTitle="Manage users"
              labelText="Grant and manage access permissions for individuals."
              resourceList={
                <ResourceList
                  items={[
                    {
                      key: 'manage-users',
                      href: 'https://access.redhat.com/start/how-to-create-and-manage-users',
                      text: 'How To Create and Manage Users'
                    },
                    {
                      key: 'add-single-user',
                      href: 'https://access.redhat.com/start/how-to-create-and-manage-users#singleuser',
                      text: 'Add a Single User'
                    },
                    {
                      key: 'add-multiple-users',
                      href: 'https://access.redhat.com/start/how-to-create-and-manage-users#multipleusers',
                      text: 'Add Multiple Users'
                    }
                  ]}
                />
              }
              button={
                <ResourceItemButton
                  href="https://access.redhat.com/articles/1757953"
                  text="View all Roles and Permissions"
                />
              }
            />
            <ResourceItem
              labelIcon={<GraduationCapIcon />}
              labelTitle="Learning Subscriptions"
              labelText="Looking for learning content and subscriptions?"
              resourceList={
                <ResourceList
                  items={[
                    {
                      key: 'learning-content',
                      href: 'https://www.redhat.com/en/services/training-and-certification',
                      text: 'Go to your learning content'
                    },
                    {
                      key: 'contact-training',
                      href: 'https://www.redhat.com/en/services/training-and-certification/contact-us',
                      text: 'Contact Red Hat Training'
                    }
                  ]}
                />
              }
              button={
                <ResourceItemButton
                  href="https://www.redhat.com/en/services/training-and-certification"
                  text="View all Training & Certification"
                />
              }
            />
          </Grid>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default GettingStartedCard;

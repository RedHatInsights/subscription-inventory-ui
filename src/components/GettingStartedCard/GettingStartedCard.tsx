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

  return (
    <Card id="getting-started-card" isExpanded={isExpanded}>
      <CardHeader
        onExpand={onExpand}
        toggleButtonProps={{
          id: 'toggle-button',
          'aria-label': 'Actions',
          'aria-labelledby': 'titleId toggle-button',
          'aria-expanded': isExpanded
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
                <Label icon={<ClipboardCheckIcon />} color="blue">
                  Activate a subscription
                </Label>
                <p>Activate a subscription purchased from a third party.</p>
                <List isPlain>
                  <ListItem>
                    <ExternalLink
                      href="https://access.redhat.com/subscriptions/activate/redhat"
                      variant="link"
                    >
                      Subscription Activation
                    </ExternalLink>
                  </ListItem>
                  <ListItem>
                    <ExternalLink
                      href="https://access.redhat.com/subscriptions/activate/dell"
                      variant="link"
                    >
                      Activate a Dell Service Tag
                    </ExternalLink>
                  </ListItem>
                </List>
              </Flex>
              <Button
                href="#"
                component="a"
                variant="link"
                isInline
                icon={<ArrowRightIcon />}
                iconPosition="right"
              >
                Contact Red hat Customer Service
              </Button>
            </Flex>
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
                <Label icon={<RouteIcon />} color="blue">
                  Explore subscription benefits
                </Label>
                <p>Explore the benefits of your Red Hat subscription.</p>
                <List isPlain>
                  <ListItem>
                    <ExternalLink
                      href="https://www.redhat.com/en/about/subscription-model-faq"
                      variant="link"
                    >
                      Red Hat subscription model FAQs
                    </ExternalLink>
                  </ListItem>
                </List>
              </Flex>
              <Button
                href="https://www.redhat.com/en/contact"
                component="a"
                variant="link"
                isInline
                icon={<ArrowRightIcon />}
                iconPosition="right"
              >
                Talk to a Red Hatter
              </Button>
            </Flex>
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
                <Label icon={<RocketIcon />} color="blue">
                  Manage users
                </Label>
                <p>Grant and manage access permissions for individuals.</p>
                <List isPlain>
                  <ListItem>
                    <ExternalLink
                      href="https://access.redhat.com/start/how-to-create-and-manage-users"
                      variant="link"
                    >
                      How To Create and Manage Users
                    </ExternalLink>
                  </ListItem>
                  <ListItem>
                    <ExternalLink
                      href="https://access.redhat.com/start/how-to-create-and-manage-users#singleuser"
                      variant="link"
                    >
                      Add a Single User
                    </ExternalLink>
                  </ListItem>
                  <ListItem>
                    <ExternalLink
                      href="https://access.redhat.com/start/how-to-create-and-manage-users#multipleusers"
                      variant="link"
                    >
                      Add Multiple Users
                    </ExternalLink>
                  </ListItem>
                </List>
              </Flex>
              <Button
                href="https://access.redhat.com/articles/1757953"
                component="a"
                variant="link"
                isInline
                icon={<ArrowRightIcon />}
                iconPosition="right"
              >
                View all Roles and Permissions
              </Button>
            </Flex>
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
                <Label icon={<GraduationCapIcon />} color="blue">
                  Learning subscriptions
                </Label>
                <p>Looking for learning content and subscriptions?</p>
                <List isPlain>
                  <ListItem>
                    <ExternalLink
                      href="https://www.redhat.com/en/services/training-and-certification"
                      variant="link"
                    >
                      Go to your learning content
                    </ExternalLink>
                  </ListItem>
                  <ListItem>
                    <ExternalLink
                      href="https://www.redhat.com/en/services/training-and-certification/contact-us"
                      variant="link"
                    >
                      Contact Red Hat Training
                    </ExternalLink>
                  </ListItem>
                </List>
              </Flex>
              <Button
                href="https://www.redhat.com/en/services/training-and-certification"
                component="a"
                variant="link"
                isInline
                icon={<ArrowRightIcon />}
                iconPosition="right"
              >
                View all Training & Certification
              </Button>
            </Flex>
          </Grid>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default GettingStartedCard;

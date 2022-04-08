import React, { FunctionComponent, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Level,
  Label,
  Grid,
  Flex,
  List,
  ListItem,
  Button
} from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

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
                <Label icon={<InfoCircleIcon />} color="blue">
                  Set up your cluster
                </Label>
                <p>Continue setting up your cluster to access all you cain in the Console</p>
                <List isPlain>
                  <ListItem>
                    <a href="#">Add identity provider</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Configure alert receivers</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Configure default ingress certificate</a>
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
                View all set up cluster steps
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
                <Label icon={<InfoCircleIcon />} color="purple">
                  Guided tours
                </Label>
                <p>Tour some of the key features around the console</p>
                <List isPlain>
                  <ListItem>
                    <a href="#">Tour the console</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Getting started with Serverless</a>
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
                View all guided tours
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
                <Label icon={<InfoCircleIcon />} color="green">
                  Quick starts
                </Label>
                <p>Get started with features using our step-by-step documentation</p>
                <List isPlain>
                  <ListItem>
                    <a href="#">Getting started with Serverless</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Explore virtualization</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Build pipelines</a>
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
                View all quick starts
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
                <Label icon={<InfoCircleIcon />} color="orange">
                  Learning resources
                </Label>
                <p>Learn about new features within the Console and get started with demo apps</p>
                <List isPlain>
                  <ListItem>
                    <a href="#">See what is possible with the Explore page</a>
                  </ListItem>
                  <ListItem>
                    <a href="#">
                      OpenShift 4.5: Top Tasks
                      <ExternalLinkAltIcon />
                    </a>
                  </ListItem>
                  <ListItem>
                    <a href="#">Try a demo app</a>
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
                View all learning resources
              </Button>
            </Flex>
          </Grid>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

export default GettingStartedCard;

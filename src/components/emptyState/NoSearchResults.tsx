import React, { FunctionComponent } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

interface NoSearchResultsProps {
  clearFilters: () => void;
}

const NoSearchResults: FunctionComponent<NoSearchResultsProps> = ({ clearFilters }) => {
  return (
    <EmptyState variant={EmptyStateVariant.sm}>
      <EmptyStateHeader
        titleText="No results found"
        icon={<EmptyStateIcon icon={SearchIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all filters to show
        results.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button variant="link" onClick={clearFilters}>
          Clear all filters
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NoSearchResults;

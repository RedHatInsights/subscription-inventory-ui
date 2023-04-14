import { Flex, FlexItem, Pagination, PaginationVariant } from '@patternfly/react-core';
import { NoSearchResults } from '../emptyState';
import { SearchInput } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { parseInt } from 'lodash';
import React, { FunctionComponent } from 'react';
import { Subscription } from '../../hooks/useProducts';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
}

interface TypeCorrectedSubscription {
  contractNumber: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
}

const printDate = (date: Date) => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${date.getUTCFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

const safeParseInt: (n: string) => number = (n: string) => {
  if (n == '') {
    return -1;
  } else {
    return parseInt(n);
  }
};

const safeParseDate: (d: string) => Date = (d: string) => {
  if (d == '') {
    return new Date(0);
  } else {
    return new Date(d);
  }
};

const SubscriptionTable: FunctionComponent<SubscriptionTableProps> = ({ subscriptions }) => {
  const castData: TypeCorrectedSubscription[] = subscriptions.map((subscription) => {
    return {
      contractNumber: safeParseInt(subscription.contractNumber),
      startDate: safeParseDate(subscription.startDate),
      endDate: safeParseDate(subscription.endDate),
      quantity: safeParseInt(subscription.quantity)
    };
  });

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = React.useState('');

  const clearFilters = () => {
    setSearchValue('');
  };

  const columnNames = {
    contractNumber: 'Contract number',
    quantity: 'Subscription quantity',
    startDate: 'Start date',
    endDate: 'End date'
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const sortSubscriptions = (
    subscriptions: TypeCorrectedSubscription[],
    index: number
  ): TypeCorrectedSubscription[] => {
    const keys = [
      'contractNumber',
      'quantity',
      'startDate',
      'endDate'
    ] as (keyof TypeCorrectedSubscription)[];
    return subscriptions.sort((a: TypeCorrectedSubscription, b: TypeCorrectedSubscription) => {
      let result = 0;
      const aValue = a[keys[index]];
      const bValue = b[keys[index]];

      if (aValue < bValue) {
        result = -1;
      } else if (aValue > bValue) {
        result = 1;
      }

      return activeSortDirection == 'asc' ? result : -1 * result;
    });
  };

  const filter = (
    subscriptions: TypeCorrectedSubscription[],
    search: string
  ): TypeCorrectedSubscription[] => {
    search = search.trim();
    return subscriptions.filter((subscription) => {
      const cn =
        subscription.contractNumber != -1
          ? subscription.contractNumber.toString()
          : 'Not Available';
      return cn.includes(search);
    });
  };

  const getPage = (subscriptions: TypeCorrectedSubscription[]) => {
    const first = (page - 1) * perPage;
    const last = first + perPage;
    return subscriptions.slice(first, last);
  };

  const sortedSubscriptions = sortSubscriptions(castData, activeSortIndex);
  const filteredSubscriptions = filter(sortedSubscriptions, searchValue);
  const pagedSubscriptions = getPage(filteredSubscriptions);

  const pagination = (variant = PaginationVariant.top) => {
    return (
      <Pagination
        itemCount={subscriptions.length}
        perPage={perPage}
        page={page}
        onSetPage={(_e: React.MouseEvent, p: number) => {
          setPage(p);
        }}
        onPerPageSelect={(_e: React.MouseEvent, p: number) => {
          setPerPage(p);
          setPage(1);
        }}
        variant={variant}
      />
    );
  };

  return (
    <>
      <Flex
        direction={{ default: 'column', md: 'row' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <FlexItem>
          {castData.length > 0 && (
            <SearchInput
              placeholder="Filter by contract number"
              value={searchValue}
              onChange={(_: React.FormEvent, val: string) => setSearchValue(val)}
              onClear={() => setSearchValue('')}
            />
          )}
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
      </Flex>
      {/* @ts-ignore */}
      <TableComposable aria-label="subscriptions" variant="compact">
        <Thead>
          {/* @ts-ignore */}
          <Tr>
            <Th sort={getSortParams(0)} width={20}>
              {columnNames.contractNumber}
            </Th>
            <Th sort={getSortParams(1)} width={25}>
              {columnNames.quantity}
            </Th>
            <Th sort={getSortParams(2)} width={15}>
              {columnNames.startDate}
            </Th>
            <Th sort={getSortParams(3)} width={15}>
              {columnNames.endDate}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {pagedSubscriptions.map((subscription, i) => (
            <React.Fragment key={i}>
              {/* @ts-ignore */}
              <Tr>
                <Td dataLabel={columnNames.contractNumber}>
                  {subscription.contractNumber == -1
                    ? 'Not Available'
                    : subscription.contractNumber}
                </Td>
                <Td dataLabel={columnNames.quantity}>
                  {subscription.quantity == -1 ? 'Not Available' : subscription.quantity}
                </Td>
                <Td dataLabel={columnNames.startDate}>
                  {subscription.startDate == new Date(0)
                    ? 'Not Available'
                    : printDate(subscription.startDate)}
                </Td>
                <Td dataLabel={columnNames.endDate}>
                  {subscription.endDate == new Date(0)
                    ? 'Not Available'
                    : printDate(subscription.endDate)}
                </Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </TableComposable>
      {pagedSubscriptions.length == 0 && <NoSearchResults clearFilters={clearFilters} />}
    </>
  );
};

export { SubscriptionTable as default, SubscriptionTableProps };

import React, { FunctionComponent, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Chip } from '@patternfly/react-core/dist/dynamic/components/Chip';
import { ChipGroup } from '@patternfly/react-core/dist/dynamic/components/Chip';
import { Product } from '../../hooks/useProducts';
import { NoSearchResults } from '../emptyState';
import { Link } from 'react-router-dom';
import { ExportSubscriptions } from '../ExportSubscriptions';
interface ProductsTableProps {
  data: Product[] | undefined;
  isFetching: boolean;
  filter: string;
  setFilter(filter: string): void;
}
const ProductsTable: FunctionComponent<ProductsTableProps> = ({
  data,
  isFetching,
  filter,
  setFilter
}) => {
  console.log('Current filter:', filter);
  console.log('Data:', data);

  const columnNames = {
    name: 'Name',
    sku: 'SKU',
    quantity: 'Quantity',
    serviceLevel: 'Service level'
  };
  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc'>('asc');
  const getSortableRowValues = (product: Product): (string | number)[] => {
    const { name, sku, quantity, serviceLevel } = product;
    return [name, sku, quantity, serviceLevel];
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
  const sortProducts = (products: Product[], sortIndex: number) => {
    const sortedProducts = products.sort((a, b) => {
      const aValue = getSortableRowValues(a)[sortIndex] || '';
      const bValue = getSortableRowValues(b)[sortIndex] || '';
      let result = 0;
      if (aValue < bValue) {
        result = -1;
      } else if (aValue > bValue) {
        result = 1;
      }
      return activeSortDirection === 'asc' ? result : -1 * result;
    });
    return sortedProducts;
  };
  const filterMap = new Map<string, string>([
    ['active', 'Active'],
    ['expiringSoon', 'Expiring soon'],
    ['expired', 'Expired'],
    ['futureDated', 'Future dated']
  ]);
  const removeFilter = () => {
    setFilter('');
  };
  const sortedProducts = data ? sortProducts(data, activeSortIndex) : [];
  const filteredProducts = sortedProducts.filter((product) => {
    if (!filter) return true;
    // Log the product and its subscriptions
    console.log('Filtering product:', product);
    const result = product.subscriptions?.some(
      (subscription) => subscription.status.toLowerCase() === filter.toLowerCase()
    );
    // Log the result of the filtering condition
    console.log(`Filtering product ${product.name} with filter "${filter}" resulted in:`, result);
    return result;
  });
  return (
    <>
      <Flex
        direction={{ default: 'column', md: 'row' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <Flex>
          <FlexItem>
            <ExportSubscriptions />
          </FlexItem>
        </Flex>
      </Flex>
      <Flex>
        <FlexItem>
          <ChipGroup categoryName="Status">
            {filter != '' && (
              <Chip id="status-chip" key={filter} onClick={removeFilter}>
                {filterMap.get(filter)}
              </Chip>
            )}
          </ChipGroup>
        </FlexItem>
        <FlexItem>
          {filter != '' && (
            <Button variant="link" isInline onClick={removeFilter}>
              Clear filters
            </Button>
          )}
        </FlexItem>
      </Flex>
      <Table aria-label="Products">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)} width={50}>
              {columnNames.name}
            </Th>
            <Th sort={getSortParams(1)} width={10}>
              {columnNames.sku}
            </Th>
            <Th sort={getSortParams(2)} width={10}>
              {columnNames.quantity}
            </Th>
            <Th sort={getSortParams(3)} width={15}>
              {columnNames.serviceLevel}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.map((datum, rowIndex) => (
            <Tr key={rowIndex}>
              <Td dataLabel={columnNames.name}>
                <TextContent>
                  <Text component={TextVariants.h3}>
                    <Link to={`${datum.sku}`}>{datum.name}</Link>
                    <br />
                    <Text component={TextVariants.small}>{datum.productLine}</Text>
                  </Text>
                </TextContent>
              </Td>
              <Td dataLabel={columnNames.sku}>{datum.sku}</Td>
              <Td dataLabel={columnNames.quantity}>{datum.quantity}</Td>
              <Td dataLabel={columnNames.serviceLevel}>{datum.serviceLevel}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {filteredProducts.length === 0 && <NoSearchResults clearFilters={removeFilter} />}
    </>
  );
};
export { ProductsTable as default, ProductsTableProps };

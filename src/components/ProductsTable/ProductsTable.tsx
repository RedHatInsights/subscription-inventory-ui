import React, { FunctionComponent, useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import { LabelGroup } from '@patternfly/react-core/dist/dynamic/components/Label';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Product } from '../../hooks/useProducts';
import { NoSearchResults } from '../emptyState';
import { Link } from 'react-router-dom';
import { ExportSubscriptions } from '../ExportSubscriptions';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';

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
  const columnNames = {
    name: 'Name',
    sku: 'SKU',
    quantity: 'Quantity',
    serviceLevel: 'Service level'
  };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc'>('asc');
  const validFilters = ['active', 'expiringSoon', 'expired', 'futureDated'];
  useEffect(() => {
    if (filter && !validFilters.includes(filter)) {
      setFilter('');
    }
  }, [filter, setFilter]);
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
  const handleSetPage = (_event: React.MouseEvent, page: number) => {
    setPage(page);
  };
  const handlePerPageSelect = (_event: React.MouseEvent, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };
  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
  };
  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
  };
  const filterDataBySearchTerm = (data: Product[], searchValue: string): Product[] => {
    return data.filter((entry: Product) => {
      const searchTerm = searchValue.toLowerCase().trim();
      const name = (entry.name || '').toLowerCase();
      const sku = (entry.sku || '').toLowerCase();
      return name.includes(searchTerm) || sku.includes(searchTerm);
    });
  };
  const countProducts = (data: Product[], searchValue: string): number => {
    const filteredData = filterDataBySearchTerm(data, searchValue);
    return filteredData.length;
  };
  const pagination = (variant = PaginationVariant.top) => (
    <Pagination
      isDisabled={isFetching}
      itemCount={countProducts(data, searchValue)}
      perPage={perPage}
      page={page}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      variant={variant}
    />
  );
  const getPage = (products: Product[]) => {
    const first = (page - 1) * perPage;
    const last = first + perPage;
    return products.slice(first, last);
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
  const searchedProducts = filterDataBySearchTerm(sortedProducts, searchValue);
  const paginatedProducts = getPage(searchedProducts);
  return (
    <>
      <Stack hasGutter>
        {/* Search + export + pagination */}
        <StackItem>
          <Flex
            direction={{ default: 'column', md: 'row' }}
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
            alignItems={{ default: 'alignItemsCenter' }}
            flexWrap={{ default: 'wrap' }}
          >
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <SearchInput
                  placeholder="Filter by Name or SKU"
                  value={searchValue}
                  onChange={(_: React.FormEvent, v: string) => handleSearch(v)}
                  onClear={clearSearch}
                  isDisabled={data?.length === 0}
                />
              </FlexItem>
              <FlexItem>
                <ExportSubscriptions />
              </FlexItem>
            </Flex>
            <FlexItem>{pagination()}</FlexItem>
          </Flex>
        </StackItem>
        {/* Status chip + clear filters */}
        {filter !== '' && validFilters.includes(filter) && (
          <StackItem>
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <LabelGroup categoryName="Status">
                <Label id="status-chip" key={filter} onClick={removeFilter}>
                  {filterMap.get(filter)}
                </Label>
              </LabelGroup>
              <Button variant="link" isInline onClick={removeFilter}>
                Clear filters
              </Button>
            </Flex>
          </StackItem>
        )}
      </Stack>
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
          {paginatedProducts.map((datum, rowIndex) => (
            <Tr key={rowIndex}>
              <Td dataLabel={columnNames.name}>
                <Content>
                  <Content component={ContentVariants.h3}>
                    <Link to={`${datum.sku}`}>{datum.name}</Link>
                    <br />
                  </Content>
                </Content>
              </Td>
              <Td dataLabel={columnNames.sku}>{datum.sku}</Td>
              <Td dataLabel={columnNames.quantity}>{datum.quantity}</Td>
              <Td dataLabel={columnNames.serviceLevel}>{datum.serviceLevel}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {paginatedProducts.length === 0 && <NoSearchResults clearFilters={clearSearch} />}
      {pagination(PaginationVariant.bottom)}
    </>
  );
};
export { ProductsTable as default, ProductsTableProps };

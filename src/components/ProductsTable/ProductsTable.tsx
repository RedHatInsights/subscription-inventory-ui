import React, { FunctionComponent, useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { SearchInput } from '@patternfly/react-core/dist/dynamic/components/SearchInput';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Chip } from '@patternfly/react-core/dist/dynamic/components/Chip';
import { ChipGroup } from '@patternfly/react-core/dist/dynamic/components/Chip';
import { Product } from '../../hooks/useProducts';
import { NoSearchResults } from '../emptyState';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const columnNames = {
    name: 'Name',
    sku: 'SKU',
    quantity: 'Quantity',
    serviceLevel: 'Service level'
  };
  const [page, setPage] = useState(parseInt(queryParams.get('page') || '1', 10));
  const [perPage, setPerPage] = useState(parseInt(queryParams.get('perPage') || '10', 10));
  const [searchValue, setSearchValue] = useState(queryParams.get('search') || '');
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');
  useEffect(() => {
    const querySearch = queryParams.get('search');
    const queryFilter = queryParams.get('filter');
    if (querySearch) {
      setSearchValue(querySearch);
    }
    if (queryFilter) {
      setFilter(queryFilter);
    } else {
      setFilter('');
    }
  }, [location.search]);
  const updateQueryParams = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        searchParams.set(key, params[key]);
      } else {
        searchParams.delete(key);
      }
    });
    navigate({ search: searchParams.toString() }, { replace: true });
  };
  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
    updateQueryParams({ search: searchValue, page: '1' });
  };
  const clearSearch = () => {
    setSearchValue('');
    setPage(1);
    updateQueryParams({ search: '', page: '1' });
  };
  const handleSetPage = (_event: React.MouseEvent, page: number) => {
    setPage(page);
    updateQueryParams({ page: page.toString() });
  };
  const handlePerPageSelect = (_event: React.MouseEvent, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
    updateQueryParams({ perPage: perPage.toString(), page: '1' });
  };
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
    const sortedProducts = products.sort((a: any, b: any) => {
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
  const filterDataBySearchTerm = (data: Product[], searchValue: string): Product[] => {
    return data.filter((entry: Product) => {
      const searchTerm = searchValue.toLowerCase().trim();
      const name = (entry.name || '').toLowerCase();
      const productLine = (entry.productLine || '').toLowerCase();
      const sku = (entry.sku || '').toLowerCase();
      return (
        name.includes(searchTerm) || productLine.includes(searchTerm) || sku.includes(searchTerm)
      );
    });
  };
  const countProducts = (data: Product[], searchValue: string): number => {
    const filteredData = filterDataBySearchTerm(data, searchValue);
    return filteredData.length;
  };
  const pagination = (variant = PaginationVariant.top) => {
    return (
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
  };
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
    updateQueryParams({ filter: '' });
  };
  useEffect(() => {
    if (filter) {
      updateQueryParams({ filter });
    }
  }, [filter]);
  const sortedProducts = sortProducts(data, activeSortIndex);
  const searchedProducts = filterDataBySearchTerm(sortedProducts, searchValue);
  const paginatedProducts = getPage(searchedProducts);

  return (
    <>
      <Flex
        direction={{ default: 'column', md: 'row' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <Flex>
          <FlexItem>
            <SearchInput
              placeholder="Filter by Name or SKU"
              value={searchValue}
              onChange={(_: React.FormEvent, v: string) => handleSearch(v)}
              onClear={clearSearch}
              isDisabled={data.length == 0}
            />
          </FlexItem>
          <FlexItem>
            <ExportSubscriptions />
          </FlexItem>
        </Flex>
        <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
      </Flex>
      <Flex>
        <FlexItem>
          {filter != '' && (
            <ChipGroup categoryName="Status">
              <Chip id="status-chip" key={filter} onClick={removeFilter}>
                {filterMap.get(filter)}
              </Chip>
            </ChipGroup>
          )}
        </FlexItem>
        <FlexItem>
          {filter != '' && (
            <Button variant="link" isInline onClick={removeFilter}>
              Clear filters
            </Button>
          )}
        </FlexItem>
      </Flex>
      {/* @ts-ignore */}
      <Table aria-label="Products">
        <Thead>
          {/* @ts-ignore */}
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
            <React.Fragment key={rowIndex}>
              {/* @ts-ignore */}
              <Tr>
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
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
      {paginatedProducts.length == 0 && <NoSearchResults clearFilters={clearSearch} />}
      {pagination(PaginationVariant.bottom)}
    </>
  );
};

export { ProductsTable as default, ProductsTableProps };

import React, { FunctionComponent, useState } from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import {
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
  SearchInput,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { Product } from '../../hooks/useProducts';

interface ProductsTableProps {
  data: Product[] | undefined;
  isFetching: boolean;
}

const ProductsTable: FunctionComponent<ProductsTableProps> = ({ data, isFetching }) => {
  const columnNames = { name: 'Name', quantity: 'Quantity' };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  const getSortableRowValues = (product: Product): (string | number)[] => {
    const { name, quantity } = product;
    return [name, quantity];
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const sortProducts = (products: Product[], sortIndex: number) => {
    if (sortIndex == null) return products;

    const sortedProducts = products.sort((a: any, b: any) => {
      const aValue = getSortableRowValues(a)[sortIndex];
      const bValue = getSortableRowValues(b)[sortIndex];
      if (typeof aValue === 'number') {
        // Numeric sort
        if (activeSortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === 'asc') {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
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
      return (entry.name || '').toLowerCase().includes(searchValue.toLowerCase().trim());
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

  const sortedProducts = sortProducts(data, activeSortIndex);
  const searchedProducts = filterDataBySearchTerm(sortedProducts, searchValue);
  const paginatedProducts = getPage(searchedProducts);

  return (
    <>
      <Flex
        direction={{ default: 'column', md: 'row' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <FlexItem>
          {data.length > 0 && (
            <SearchInput
              placeholder="Filter by Name"
              value={searchValue}
              onChange={handleSearch}
              onClear={clearSearch}
            />
          )}
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>{pagination()}</FlexItem>
      </Flex>
      {/* @ts-ignore */}
      <TableComposable aria-label="Products">
        <Thead>
          {/* @ts-ignore */}
          <Tr>
            <Th sort={getSortParams(0)}>{columnNames.name}</Th>
            <Th sort={getSortParams(1)}>{columnNames.quantity}</Th>
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
                      {datum.name}
                      <br />
                      <Text component={TextVariants.small}>{datum.productLine}</Text>
                    </Text>
                  </TextContent>
                </Td>
                <Td dataLabel={columnNames.quantity}>{datum.quantity}</Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </TableComposable>
      {pagination(PaginationVariant.bottom)}
    </>
  );
};

export { ProductsTable as default, ProductsTableProps };

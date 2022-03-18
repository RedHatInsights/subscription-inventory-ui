import React, { FunctionComponent, useState } from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { v4 as uuid } from 'uuid';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
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
import { Processing } from '../../components/emptyState';
import useProducts, { Product } from '../../hooks/useProducts';

const ProductsTable: FunctionComponent = () => {
  const columnNames = { name: 'Name', quantity: 'Quantity' };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const { isFetching, isLoading, error, data } = useProducts();
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

  const Results: FunctionComponent = () => {
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
        <TableComposable aria-label="Products" ouiaId={uuid()} ouiaSafe={true}>
          <Thead>
            <Tr ouiaId={uuid()} ouiaSafe={true}>
              <Th sort={getSortParams(0)}>{columnNames.name}</Th>
              <Th sort={getSortParams(1)}>{columnNames.quantity}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.map((datum, rowIndex) => (
              <Tr key={rowIndex} ouiaId={uuid()} ouiaSafe={true}>
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
            ))}
          </Tbody>
        </TableComposable>
        {pagination(PaginationVariant.bottom)}
      </>
    );
  };

  if (isLoading && !error) {
    return <Processing />;
  } else if (!isLoading && !error) {
    return <Results />;
  } else {
    return <Unavailable />;
  }
};

export default ProductsTable;

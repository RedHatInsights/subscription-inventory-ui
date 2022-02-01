import React, { FunctionComponent } from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { v4 as uuid } from 'uuid';
import useProducts from '../../hooks/useProducts';

const ProductsTable: FunctionComponent = () => {
  const columnNames = { name: 'Name', count: 'Quantity' };
  const data = useProducts();

  return (
    <TableComposable aria-label="Products" ouiaId={uuid()} ouiaSafe={true}>
      <Thead>
        <Tr ouiaId={uuid()} ouiaSafe={true}>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.count}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((datum) => (
          <Tr key={datum.name} ouiaId={uuid()} ouiaSafe={true}>
            <Td dataLabel={columnNames.name}>
              {datum.name}
              <br />
              {datum.productLine}
            </Td>
            <Td dataLabel={columnNames.count}>{datum.count}</Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default ProductsTable;

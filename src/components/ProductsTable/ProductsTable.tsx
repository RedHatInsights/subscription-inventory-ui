import React, { FunctionComponent } from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { v4 as uuid } from 'uuid';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { Processing } from '../../components/emptyState';
import useProducts from '../../hooks/useProducts';

const ProductsTable: FunctionComponent = () => {
  const columnNames = { name: 'Name', quantity: 'Quantity' };
  const { isLoading, error, data } = useProducts();

  if (isLoading && !error) {
    return <Processing />;
  } else if (!isLoading && !error) {
    return (
      <TableComposable aria-label="Products" ouiaId={uuid()} ouiaSafe={true}>
        <Thead>
          <Tr ouiaId={uuid()} ouiaSafe={true}>
            <Th>{columnNames.name}</Th>
            <Th>{columnNames.quantity}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((datum) => (
            <Tr key={datum.name} ouiaId={uuid()} ouiaSafe={true}>
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
    );
  } else {
    return <Unavailable />;
  }
};

export default ProductsTable;

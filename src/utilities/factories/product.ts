import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { Product } from '../../hooks/useProducts';

export default Factory.define<Product>(() => ({
  name: faker.vehicle.model(),
  productLine: faker.vehicle.vehicle(),
  quantity: faker.datatype.number(),
  sku: faker.datatype.uuid(),
  serviceLevel: faker.datatype.string(),
  serviceType: faker.datatype.string(),
  unitOfMeasure: uOMFake
}));

const uOMFake = {
  name: faker.datatype.string(),
  quantity: faker.datatype.string()
};

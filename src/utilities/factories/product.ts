import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { Product } from '../../hooks/useProducts';

export default Factory.define<Product>(() => ({
  name: faker.vehicle.model(),
  productLine: faker.vehicle.vehicle(),
  quantity: faker.number.int(),
  sku: faker.string.uuid(),
  serviceLevel: faker.string.sample(),
  serviceType: faker.string.sample(),
  capacity: capacityFake
}));

const capacityFake = {
  name: faker.string.sample(),
  quantity: faker.string.sample()
};

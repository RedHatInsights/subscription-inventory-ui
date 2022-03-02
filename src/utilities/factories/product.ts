import Faker from 'faker';
import { Factory } from 'fishery';
import { Product } from '../../hooks/useProducts';

export default Factory.define<Product>(() => ({
  name: Faker.vehicle.model(),
  productLine: Faker.vehicle.vehicle(),
  quantity: Faker.datatype.number(),
  sku: Faker.datatype.uuid()
}));

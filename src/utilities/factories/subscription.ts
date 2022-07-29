import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { Subscription } from '../../hooks/useProducts';

export default Factory.define<Subscription>(() => ({
  quantity: faker.datatype.string(),
  number: faker.random.numeric(3),
  contractNumber: faker.random.numeric(3),
  status: faker.datatype.string(),
  endDate: faker.datatype.string(),
  startDate: faker.datatype.string()
}));

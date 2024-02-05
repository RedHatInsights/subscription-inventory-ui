import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { Subscription } from '../../hooks/useProducts';

export default Factory.define<Subscription>(() => ({
  quantity: faker.string.sample(),
  number: faker.string.numeric(3),
  contractNumber: faker.string.numeric(3),
  status: faker.string.sample(),
  endDate: faker.string.sample(),
  startDate: faker.string.sample()
}));

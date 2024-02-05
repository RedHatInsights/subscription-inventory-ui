import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { StatusCard } from '../../hooks/useStatus';

export default Factory.define<StatusCard>(() => ({
  active: faker.number.int(),
  expiringSoon: faker.number.int(),
  expired: faker.number.int(),
  futureDated: faker.number.int()
}));

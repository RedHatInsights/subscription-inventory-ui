import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { StatusCard } from '../../hooks/useStatus';

export default Factory.define<StatusCard>(() => ({
  active: faker.datatype.number(),
  expiringSoon: faker.datatype.number(),
  expired: faker.datatype.number(),
  futureDated: faker.datatype.number()
}));

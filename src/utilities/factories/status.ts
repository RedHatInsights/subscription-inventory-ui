import Faker from 'faker';
import { Factory } from 'fishery';
import { StatusCard } from '../../hooks/useStatus';

export default Factory.define<StatusCard>(() => ({
  active: Faker.datatype.number(),
  expiringSoon: Faker.datatype.number(),
  expired: Faker.datatype.number(),
  futureDated: Faker.datatype.number()
}));

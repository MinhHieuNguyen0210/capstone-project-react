import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar, mockImgCover } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  foodImg: mockImgCover(index + 1),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.lorem.word(),
  company: faker.company.companyName(),
  isVerified: faker.datatype.boolean(),
  status: sample(['Shipping', 'Pending']),
  statusProduct: sample(['Erorr', 'Available']),
  price: faker.commerce.price(),
  date: faker.datatype.datetime(),
  description: faker.lorem.word(),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer'
  ])
}));

export default users;

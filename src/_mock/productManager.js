import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  productImage: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: sample(['Air Force 1', 'Air Max 1','Air Jordan 1','Air Flight 89.','Flyknit Racer']),
  productGender: sample(['MALE', 'Female']),
  brand: sample(['PUMA', 'ADJ']),
  category: sample(['SPORT', 'RUNNING SHOES']),
  sellPrice: sample(['100.000', '200.000']),
  originalPrice: sample(['500.000', '300.000']),
  importPrice: sample(['500.000', '300.000']),
  description: sample(['Tốt', 'Đẹp']),
  createDate: sample(['1/5/2022', '5/6/2022']),
  updateDate: sample(['6/5/2022', '5/6/2022']),
  
}));

export default products;

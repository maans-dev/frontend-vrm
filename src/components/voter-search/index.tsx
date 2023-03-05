import { FunctionComponent } from 'react';
import SearchOptions from './search-options';
import SearchResults from './search-results';
import { VoterSearchResult } from './types';
import { faker } from '@faker-js/faker';

export type Props = {
  prop?: string;
};

const searchResults: VoterSearchResult[] = [];

for (let i = 0; i < 10; i++) {
  searchResults.push({
    darn: faker.datatype.number({ min: 12345674, max: 99999999 }),
    dob: faker.date.past(65, '2005-01-01T00:00:00.000Z'),
    name: `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()}, ${faker.address.cityName()}, ${faker.address.county()}, ${faker.address.zipCode(
      '####'
    )}`,
    livingVd: {
      name: faker.random.words(2),
      number: faker.datatype.number({ min: 12345674, max: 99999999 }),
    },
    colour: faker.color.human(),
    status: faker.helpers.arrayElement(['Registered', 'Not Registered']),
    registeredVd: {
      name: faker.random.words(2),
      number: faker.datatype.number({ min: 12345674, max: 99999999 }),
    },
    involvement: faker.helpers.arrayElements([
      'Activist',
      'Member',
      'Public Rep',
      'Staff',
    ]),
  });
}

const VoterSearch: FunctionComponent<Props> = () => {
  return (
    <>
      {/* <SearchOptions /> */}
      <SearchResults results={searchResults} />
    </>
  );
};

export default VoterSearch;

import { FunctionComponent, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  EuiBasicTableColumn,
  formatDate,
  EuiBasicTable,
  EuiText,
  EuiSpacer,
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  Criteria,
} from '@elastic/eui';
import moment from 'moment';

type VoterSearchResult = {
  darn: number;
  dob: Date;
  name: string;
  address: string;
  livingVd: {
    name: string;
    number: number;
  };
  colour: string;
  status: 'Registered' | 'Not Registered';
  registeredVd: {
    name: string;
    number: number;
  };
  involvement: ('Activist' | 'Member' | 'Public Rep' | 'Staff')[];
};

const voters: VoterSearchResult[] = [];

for (let i = 0; i < 10; i++) {
  voters.push({
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

export type Props = {
  prop?: string;
};

const SearchResults: FunctionComponent<Props> = () => {
  const [sortField, setSortField] = useState<keyof VoterSearchResult>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const onTableChange = ({ sort }: Criteria<VoterSearchResult>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const columns: Array<EuiBasicTableColumn<VoterSearchResult>> = [
    {
      field: 'darn',
      name: 'DARN',
      valign: 'top',
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'dob',
      name: 'DOB (Age)',
      valign: 'top',
      dataType: 'date',
      render: (dob: VoterSearchResult['dob']) =>
        `${moment(dob).format('D MMM YYYY')} (${moment().diff(
          dob,
          'years',
          false
        )})`,
    },
    {
      field: 'name',
      name: 'Full Name',
      valign: 'top',
    },
    {
      field: 'address',
      name: 'Address',
      valign: 'top',
    },
    {
      field: 'livingVd',
      valign: 'top',
      name: 'Living VD',
      render: (vd: VoterSearchResult['livingVd']) => (
        <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
          {vd.name}
          <EuiSpacer size="xs" />({vd.number})
        </EuiText>
      ),
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'colour',
      name: 'Colour Code',
      valign: 'top',
      render: (color: VoterSearchResult['colour']) => (
        <EuiBadge color={color}>{color}</EuiBadge>
      ),
      mobileOptions: {
        header: false,
        enlarge: true,
      },
    },
    {
      field: 'status',
      name: 'Reg Status',
      valign: 'top',
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'registeredVd',
      name: 'Registered VD',
      valign: 'top',
      render: (vd: VoterSearchResult['registeredVd']) => (
        <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
          {vd.name}
          <EuiSpacer size="xs" />({vd.number})
        </EuiText>
      ),
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'involvement',
      name: 'Involvement',
      valign: 'top',
      width: '200px',
      render: (involvement: VoterSearchResult['involvement']) => (
        <EuiFlexGrid gutterSize="s" columns={2}>
          {involvement.map(item => (
            <EuiFlexItem key={item} grow={false}>
              <EuiBadge color="hollow" key={item}>
                {item}
              </EuiBadge>
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
      ),
      mobileOptions: {
        show: false,
      },
    },
  ];

  return (
    <EuiBasicTable
      tableCaption="Voter search results"
      items={voters}
      rowHeader="darn"
      columns={columns}
      compressed
      // responsive={false}
      tableLayout="auto"
      sorting={{
        sort: {
          field: sortField,
          direction: sortDirection,
        },
        enableAllColumns: true,
      }}
      onChange={onTableChange}
    />
  );
};

export default SearchResults;

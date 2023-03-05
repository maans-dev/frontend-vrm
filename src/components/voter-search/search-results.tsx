import { FunctionComponent, useState } from 'react';
import {
  EuiBasicTableColumn,
  EuiBasicTable,
  EuiText,
  EuiSpacer,
  EuiBadge,
  EuiFlexItem,
  EuiFlexGrid,
  Criteria,
} from '@elastic/eui';
import moment from 'moment';
import router from 'next/router';
import { VoterSearchResult } from './types';

export type Props = {
  results?: VoterSearchResult[];
};

const SearchResults: FunctionComponent<Props> = ({ results }) => {
  const [sortField, setSortField] = useState<keyof VoterSearchResult>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const onTableChange = ({ sort }: Criteria<VoterSearchResult>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const getRowProps = (voter: VoterSearchResult) => {
    const { darn } = voter;
    return {
      'data-test-subj': `row-${darn}`,
      className: 'customRowClass',
      onClick: () => router.push('/canvass/voter'),
    };
  };

  const columns: Array<EuiBasicTableColumn<VoterSearchResult>> = [
    {
      field: 'darn',
      name: 'DARN',
      valign: 'top',
      mobileOptions: {
        show: false,
      },
      css: { minWidth: '80px' },
    },
    {
      field: 'name',
      name: 'Full Name',
      valign: 'top',
      mobileOptions: {
        header: false,
        render: item => (
          <EuiText size="s">
            <strong>{item.name}</strong>
          </EuiText>
        ),
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
      mobileOptions: {
        header: false,
      },
    },
    {
      field: 'address',
      name: 'Address',
      valign: 'top',
      css: { minWidth: '150px' },
      mobileOptions: {
        header: false,
      },
    },
    {
      field: 'livingVd',
      valign: 'top',
      name: 'Living VD',
      css: { minWidth: '100px' },
      render: (vd: VoterSearchResult['livingVd']) => (
        <EuiText size="relative" css={{ textTransform: 'capitalize' }}>
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
      },
    },
    {
      field: 'status',
      name: 'Reg Status',
      valign: 'top',
      css: { minWidth: '90px' },
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'registeredVd',
      name: 'Registered VD',
      valign: 'top',
      css: { minWidth: '100px' },
      render: (vd: VoterSearchResult['registeredVd']) => (
        <EuiText size="relative" css={{ textTransform: 'capitalize' }}>
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
      css: { minWidth: '100px' },
      render: (involvement: VoterSearchResult['involvement']) => (
        <EuiFlexGrid gutterSize="s" columns={1}>
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
      items={results}
      rowHeader="darn"
      columns={columns}
      // compressed
      // responsive={false}
      tableLayout="auto"
      sorting={{
        sort: {
          field: sortField,
          direction: sortDirection,
        },
        enableAllColumns: true,
      }}
      rowProps={getRowProps}
      onChange={onTableChange}
    />
  );
};

export default SearchResults;

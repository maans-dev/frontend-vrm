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
  useIsWithinBreakpoints,
  EuiHealth,
} from '@elastic/eui';
import moment from 'moment';
import router from 'next/router';
import { VoterSearchResult } from './types';
import { css, Global } from '@emotion/react';

export type Props = {
  results?: VoterSearchResult[];
};

const SearchResults: FunctionComponent<Props> = ({ results }) => {
  const [sortField, setSortField] = useState<keyof VoterSearchResult>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const isMobile = useIsWithinBreakpoints(['xs', 's']);

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
        width: '100%',
        render: item => (
          <EuiHealth color={item.colour} textSize="s">
            <strong>{item.name}</strong>
          </EuiHealth>
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
        show: true,
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
        show: false,
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
    <>
      {isMobile ? (
        <Global
          styles={css`
            .voter-search .euiTable {
              line-height: 1.4rem;
            }
            .voter-search .euiTable.euiTable--responsive .euiTableRow {
              padding: 5px;
              box-shadow: none;
              border: 1px solid lightgrey;
            }
            .voter-search .euiTableCellContent {
              padding: 0;
              font-size: 12px;
            }
            .voter-search .euiTableRow td:nth-child(n + 3) {
              margin-left: 20px;
            }
          `}
        />
      ) : null}
      <EuiBasicTable
        className="voter-search"
        tableCaption="Voter search results"
        items={results}
        rowHeader="darn"
        columns={columns}
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
        noItemsMessage={
          <>
            <EuiText>No voter&apos;s found. Please search again.</EuiText>
          </>
        }
      />
    </>
  );
};

export default SearchResults;

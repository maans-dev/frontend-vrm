import { FunctionComponent } from 'react';
import {
  EuiBasicTableColumn,
  EuiBasicTable,
  EuiBadge,
  Criteria,
  useIsWithinBreakpoints,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTablePagination,
} from '@elastic/eui';
import moment from 'moment';
import router from 'next/router';
import { css } from '@emotion/react';
import { Person } from '@lib/domain/person';
import VoterAdd from '@components/voter-add';
import { renderName } from '@lib/person/utils';

export type Props = {
  results?: Person[];
  pageCount: number;
  itemsPerPage: number;
  onChangeItemsPerPage: (pageSize: number) => void;
  activePage: number;
  onChangePage: (pageNumber: number) => void;
};

const SearchResults: FunctionComponent<Props> = ({
  results,
  pageCount,
  itemsPerPage,
  onChangeItemsPerPage,
  activePage,
  onChangePage,
}) => {
  // const [sortField, setSortField] = useState<keyof Person>('name');
  // const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const isMobile = useIsWithinBreakpoints(['xs', 's']);

  const onTableChange = ({ sort }: Criteria<Person>) => {
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      // setSortField(sortField);
      // setSortDirection(sortDirection);
    }
  };

  const getRowProps = (voter: Person) => {
    return {
      'data-test-subj': `row-${voter.key}`,
      className: 'voter-search-row',
      css: {
        borderLeft: isMobile
          ? `5px solid #${voter.colourCode.colour} !important`
          : null,
      },
      onClick: () => {
        router.push(`voter/${voter.key}`);
      },
    };
  };

  const columns: Array<EuiBasicTableColumn<Person>> = [
    {
      field: 'key',
      name: 'DARN',
      valign: 'top',
      mobileOptions: {
        show: false,
      },
      css: { minWidth: '100px' },
    },
    {
      field: 'surname',
      name: 'Surname',
      valign: 'top',
      css: { minWidth: '120px' },
      mobileOptions: {
        header: false,
        width: '100%',
        render: (item: Person) => <strong>{renderName(item)}</strong>,
      },
    },
    {
      field: 'firstName',
      name: 'First Name',
      valign: 'top',
      css: { minWidth: '120px' },
      mobileOptions: {
        show: false,
        header: false,
      },
    },
    {
      field: 'givenName',
      name: 'Preferred Name',
      valign: 'top',
      css: { minWidth: '120px' },
      mobileOptions: {
        show: false,
        header: false,
      },
    },
    {
      field: 'dob',
      name: 'DOB (Age)',
      valign: 'top',
      dataType: 'date',
      width: '150px',
      render: (dob: Person['dob']) =>
        `${moment(dob, 'YYYYMMDD').format('D MMM YYYY')} (${moment().diff(
          moment(dob, 'YYYYMMDD'),
          'years',
          false
        )})`,
      mobileOptions: {
        show: true,
        header: false,
      },
    },
    {
      field: 'address.formatted',
      name: 'Address',
      valign: 'top',
      css: { minWidth: '150px' },
      mobileOptions: {
        header: false,
      },
    },
    {
      field: 'livingStructure',
      valign: 'top',
      name: 'Living VD',
      css: { minWidth: '100px' },
      render: (vd: Person['livingStructure']) => {
        if (!vd?.votingDistrict) return null;
        return (
          <div>
            {vd?.votingDistrict} ({vd?.votingDistrict_id})
          </div>
        );
      },
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'colourCode',
      name: 'Colour Code',
      valign: 'top',
      render: (color: Person['colourCode'], person: Person) => (
        <EuiBadge
          // css={{ color: 'white !important' }}
          color={person?.deceased ? '#cccccc' : `#${color.colour}`}>
          {person?.deceased ? 'Deceased' : color?.description}
        </EuiBadge>
      ),
      mobileOptions: {
        header: false,
        show: false,
      },
    },
    {
      field: 'iec.regStatus',
      name: 'Reg Status',
      valign: 'top',
      css: { minWidth: '120px' },
      render: (regStatus: Person['iec']['regStatus']) => {
        switch (regStatus) {
          case 'VERIFIED':
            return 'Registered';
          case 'REJECTED':
            return 'Not Registered';
          default:
            return regStatus;
        }
      },
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'registeredStructure',
      name: 'Registered VD',
      valign: 'top',
      css: { minWidth: '100px' },
      render: (vd: Person['registeredStructure']) => {
        if (!vd?.votingDistrict) return null;
        return (
          <div>
            {vd?.votingDistrict} ({vd?.votingDistrict_id})
          </div>
        );
      },
      mobileOptions: {
        show: false,
      },
    },
    // {
    //   field: 'involvement',
    //   name: 'Involvement',
    //   valign: 'top',
    //   css: { minWidth: '100px' },
    //   render: () => (
    //     <EuiFlexGrid gutterSize="s" columns={1}>
    //       {/* {involvement.map(item => ( */}
    //       <EuiFlexItem key={1} grow={false}>
    //         <EuiBadge color="hollow">???</EuiBadge>
    //       </EuiFlexItem>
    //       {/* ))} */}
    //     </EuiFlexGrid>
    //   ),
    //   mobileOptions: {
    //     show: false,
    //   },
    // },
  ];

  return (
    <>
      <EuiBasicTable
        className="voter-search"
        css={
          isMobile
            ? css`
                .euiTable {
                  line-height: 1.4rem;
                }
                .euiTable.euiTable--responsive .euiTableRow {
                  padding: 5px;
                  padding-left: 10px;
                  border: 1px solid lightgrey;
                }
                .euiTableCellContent {
                  padding: 0;
                  font-size: 12px;
                }
              `
            : css`
                .euiTable {
                  background-color: white !important;
                }
              `
        }
        tableCaption="Voter search results"
        items={results}
        rowHeader="darn"
        columns={columns}
        tableLayout="auto"
        // sorting={{
        //   sort: {
        //     field: sortField,
        //     direction: sortDirection,
        //   },
        //   enableAllColumns: true,
        // }}
        rowProps={getRowProps}
        onChange={onTableChange}
        noItemsMessage={
          <>
            <EuiSpacer />
            <VoterAdd notFound />
            <EuiSpacer />
          </>
        }
      />
      <EuiSpacer size="m" />
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={true}>
          {results.length > 0 && (
            <EuiTablePagination
              aria-label="Pager"
              pageCount={pageCount}
              itemsPerPageOptions={[10, 20, 50, 100]}
              itemsPerPage={itemsPerPage}
              onChangeItemsPerPage={onChangeItemsPerPage}
              activePage={activePage}
              onChangePage={onChangePage}
            />
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      {results?.length > 0 && <VoterAdd />}
    </>
  );
};

export default SearchResults;

import { FunctionComponent } from 'react';
import {
  EuiBasicTableColumn,
  EuiBasicTable,
  EuiBadge,
  Criteria,
  useIsWithinBreakpoints,
  EuiSpacer,
} from '@elastic/eui';
import moment from 'moment';
import router from 'next/router';
import { css } from '@emotion/react';
import { Person } from '@lib/domain/person';
import VoterAdd from '@components/voter-add';

export type Props = {
  results?: Person[];
};

const SearchResults: FunctionComponent<Props> = ({ results }) => {
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
    const isCapturePage = router.pathname.includes('/capture/');

    return {
      'data-test-subj': `row-${voter.key}`,
      className: 'voter-search-row',
      css: {
        borderLeft: isMobile
          ? `5px solid #${voter.colourCode.colour} !important`
          : null,
      },
      onClick: () => {
        if (isCapturePage) {
          router.push(`/capture/voter-capture/${voter.key}`);
        } else {
          router.push(`/canvass/voter/${voter.key}`);
        }
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
      css: { minWidth: '80px' },
    },
    {
      name: 'Full Name',
      valign: 'top',
      render: (item: Person) => (
        <div>
          {item.salutation} {item.firstName} {item.surname}
        </div>
      ),
      mobileOptions: {
        header: false,
        width: '100%',
        render: (item: Person) => (
          <strong>
            {item.salutation} {item.firstName} {item.surname}
          </strong>
        ),
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
      render: (color: Person['colourCode']) => (
        <EuiBadge
          // css={{ color: 'white !important' }}
          color={`#${color.colour}`}>
          {color.description}
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
      css: { minWidth: '90px' },
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
            : null
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
      <EuiSpacer />
      {results?.length > 0 && <VoterAdd />}
    </>
  );
};

export default SearchResults;

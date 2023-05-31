import { EuiBasicTable, EuiText } from '@elastic/eui';
import { MyActivityReport } from '@lib/domain/person-history';
import React, { FunctionComponent, useEffect, useState } from 'react';

export interface Props {
  report: MyActivityReport[];
}

const ActivityReportTable: FunctionComponent<Props> = ({ report }) => {
  const [reportItems, setReportItems] = useState<MyActivityReport[]>();
  const columns = [
    {
      field: 'name',
      name: '',
    },
    {
      field: 'prev7days',
      name: 'Prev 7 Days',
    },
    {
      field: 'prev30days',
      name: 'Prev 30 Days',
      mobileOptions: {
        show: false,
      },
    },
    {
      field: 'ytd',
      name: 'Year to Date',
    },
  ];

  useEffect(() => {
    setReportItems(report);
  }, [report]);

  const items = reportItems?.map(item => ({
    id: item.person,
    name:
      item.name === 'canvassed'
        ? 'Canvassed'
        : item.name === 'votersCanvassed'
        ? 'Voters Canvassed'
        : item.name === 'captures'
        ? 'Captures'
        : item.name,
    prev7days: item.prev7days,
    prev30days: item.prev30days,
    ytd: item.ytd,
  }));

  return (
    <>
      {reportItems && reportItems.length > 0 ? (
        <EuiBasicTable items={items} columns={columns} tableLayout="auto" />
      ) : (
        <EuiText textAlign="center">No results</EuiText>
      )}
    </>
  );
};

export default ActivityReportTable;

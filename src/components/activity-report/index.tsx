import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiText,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { MyActivityReport } from '@lib/domain/person-history';
import React, { FunctionComponent, useEffect, useState } from 'react';
import startCase from 'lodash/startCase';

export interface Props {
  report: MyActivityReport[];
}

const ActivityReportTable: FunctionComponent<Props> = ({ report }) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [reportItems, setReportItems] = useState<MyActivityReport[]>();
  const columns: Array<EuiBasicTableColumn<MyActivityReport>> = [
    {
      field: 'name',
      name: '',
    },
    {
      field: 'prev7days',
      name: isMobile ? '7 Days' : 'Prev 7 Days',
    },
    {
      field: 'prev30days',
      name: isMobile ? '30 Days' : 'Prev 30 Days',
    },
    {
      field: 'ytd',
      name: isMobile ? 'YTD' : 'Year to Date',
    },
  ];

  useEffect(() => {
    setReportItems(report);
  }, [report]);

  const items = reportItems?.map(item => ({
    id: item.person,
    name: startCase(item.name),
    prev7days: item.prev7days,
    prev30days: item.prev30days,
    ytd: item.ytd,
  }));

  return (
    <>
      {reportItems && reportItems.length > 0 ? (
        <EuiBasicTable
          css={
            isMobile
              ? css`
                  .euiTableCellContent {
                    padding: 0;
                    font-size: 12px;
                  }
                `
              : null
          }
          responsive={false}
          items={items}
          columns={columns}
          tableLayout="auto"
        />
      ) : (
        <EuiText textAlign="center">No results</EuiText>
      )}
    </>
  );
};

export default ActivityReportTable;

import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCommentList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiSuperDatePicker,
  EuiTablePagination,
  EuiText,
  OnTimeChangeProps,
} from '@elastic/eui';
import { css } from '@emotion/react';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { PersonEvent } from '@lib/domain/person-history';
import PersonHistoryItem from './person-history-item';
import usePersonHistoryOrActivityFetcher from '@lib/fetcher/person/person.history';
import dateMath from '@elastic/datemath';

export type Props = {
  personKey: number;
  // myActivity?: PersonHistoryResponse;
  mode?: 'history' | 'activity';
};

const PersonHistory: FunctionComponent<Props> = ({
  personKey,
  mode = 'history',
}) => {
  const [start, setStart] = useState('now/y');
  const [end, setEnd] = useState('now/y');

  const [startMoment, setStartMoment] = useState(dateMath.parse(start));
  const [endMoment, setEndMoment] = useState(
    dateMath.parse(end, { roundUp: true })
  );

  const [activePage, setActivePage] = useState(0);
  const [rowSize, setRowSize] = useState(10);

  const { history, isLoading } = usePersonHistoryOrActivityFetcher(
    personKey,
    startMoment.format('YYYY-MM-DD HH:mm'),
    endMoment.format('YYYY-MM-DD HH:mm'),
    rowSize,
    rowSize * activePage,
    mode
  );

  const [pageCount, setPageCount] = useState(0);

  const changeItemsPerPage = (pageSize: number) => {
    setPageCount(Math.ceil(history.count / pageSize));
    setRowSize(pageSize);
    setActivePage(0);
  };

  const eventsInternal = history?.values?.map(event => {
    return {
      ...event,
      canvassedBy: {
        ...event.canvassedBy,
        date: moment(event?.canvassedBy?.date),
      },
      createdBy: {
        ...event.createdBy,
        date: moment(event.createdBy.date),
      },
      modifiedBy: {
        ...event.modifiedBy,
        date: moment(event.modifiedBy.date),
      },
    };
  });

  const onTimeChange = ({ start, end }: OnTimeChangeProps) => {
    setStart(start);
    setEnd(end);
  };

  useEffect(() => {
    if (history) setPageCount(Math.ceil(history.count / rowSize));
  }, [history, rowSize]);

  useEffect(() => {
    setStartMoment(dateMath.parse(start));
    setEndMoment(dateMath.parse(end, { roundUp: true }));
  }, [start, end]);

  return (
    <>
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={true}>
          <EuiSuperDatePicker
            // compressed
            width="full"
            isLoading={isLoading}
            start={start}
            end={end}
            onTimeChange={onTimeChange}
            showUpdateButton="iconOnly"
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiCommentList
        aria-label="History"
        gutterSize="m"
        css={css`
          .euiCommentEvent__header {
            font-size: 12px;
            padding: 0px;
          }
          .euiTimeline {
            position: relative;
          }
        `}>
        <>
          {history?.values?.length
            ? orderBy(eventsInternal, ['createdBy.date'], ['desc'])?.map(
                (entry: PersonEvent) => {
                  return (
                    <PersonHistoryItem
                      event={entry}
                      key={entry.key}
                      mode={mode}
                    />
                  );
                }
              )
            : !isLoading && (
                <EuiText textAlign="center">No events found</EuiText>
              )}
        </>
      </EuiCommentList>

      <EuiSpacer />

      {pageCount > 0 && (
        <EuiFlexGroup justifyContent="spaceAround">
          <EuiFlexItem grow={true}>
            <EuiTablePagination
              aria-label="Pager"
              pageCount={pageCount}
              itemsPerPageOptions={[10, 20, 50, 100]}
              itemsPerPage={rowSize}
              onChangeItemsPerPage={changeItemsPerPage}
              activePage={activePage}
              onChangePage={(pageNumber: number) => setActivePage(pageNumber)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  );
};

export default PersonHistory;

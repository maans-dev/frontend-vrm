import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCommentList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSpacer,
} from '@elastic/eui';
import Membership from './history-item';
import { css } from '@emotion/react';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import dateMath from '@elastic/datemath';
import useMembershipHistoryFetcher from '@lib/fetcher/person/membership.history';
import { PersonEvent } from '@lib/domain/person-history';
import SpinnerEmbed from '@components/spinner/spinner-embed';

export type Props = {
  personKey: number;
};

const MembershipEvents: FunctionComponent<Props> = ({ personKey }) => {
  const [start] = useState('now-10y');
  const [end] = useState('now/y');

  const [startMoment] = useState(dateMath.parse(start));
  const [endMoment] = useState(dateMath.parse(end, { roundUp: true }));

  const [activePage, setActivePage] = useState(0);
  const [rowSize] = useState(4);

  const [pageCount, setPageCount] = useState(0);
  //TODO
  const { history, isLoading, error } = useMembershipHistoryFetcher(
    personKey,
    startMoment.format('YYYY-MM-DD HH:mm'),
    endMoment.format('YYYY-MM-DD HH:mm'),
    rowSize,
    rowSize * activePage
  );

  useEffect(() => {
    if (history) setPageCount(Math.ceil(history.count / rowSize));
  }, [history, rowSize]);

  const events = history?.values;
  if ((!events && !isLoading) || (events && events.length === 0 && !isLoading))
    return <>No Membership Events</>;

  const eventsInternal = events?.map(event => {
    return {
      ...event,
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

  return (
    <div css={{ position: 'relative', minHeight: '300px' }}>
      <SpinnerEmbed show={isLoading} />

      <EuiCommentList
        aria-label="History"
        gutterSize="m"
        css={css`
          .euiCommentEvent__header {
            font-size: 12px;
            padding: 0px;
          }
        `}>
        {orderBy(eventsInternal, ['createdBy.date'], ['desc'])?.map(
          (entry: PersonEvent) => {
            return <Membership event={entry} key={entry.key} />;
          }
        )}
      </EuiCommentList>

      <EuiSpacer />

      {!isLoading && (
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            <EuiPagination
              aria-label="Pager"
              pageCount={pageCount}
              activePage={activePage}
              onPageClick={(pageNumber: number) => setActivePage(pageNumber)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </div>
  );
};

export default MembershipEvents;

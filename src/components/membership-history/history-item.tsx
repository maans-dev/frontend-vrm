import {
  EuiAvatar,
  EuiButtonIcon,
  EuiComment,
  EuiFlexGrid,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { PersonEvent } from '@lib/domain/person-history';
import { Moment } from 'moment';
import { FunctionComponent, useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { useSession } from 'next-auth/react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { JSONTree } from 'react-json-tree';

export type Props = {
  event: PersonEvent;
};

const Membership: FunctionComponent<Props> = ({ event }) => {
  const { data: session, status } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);
  const [isExpanded, setIsExpanded] = useState(false);
  // const isSystemEntry = event.metaData.type === 'system';
  const isSystemEntry = false;
  const isMemberEntry = true;

  const { euiTheme } = useEuiTheme();

  const [paymentData] = useState(() => {
    if (event?.metaData?.person?.membership?.update?.payment)
      return event?.metaData?.person?.membership?.update?.payment;
    if (event?.metaData?.person?.membership?.payment)
      return event?.metaData?.person?.membership?.payment;
  });

  const [eventText] = useState(() => {
    switch (event?.type?.name) {
      case 'membership-new':
        return 'activated membership';
      case 'membership-renew':
        return 'renewed membership';
      case 'membership-resigned':
        return 'recorded resignation of membership';
      case 'membership-terminated':
        return 'recorded cancellation of membership';
      case 'membership-expired':
        return 'User expired';
      case 'membership-capture':
        return 'edited membership';
      case 'membership-extended':
        return 'recorded membership extension';
      case 'membership-comment':
        return 'added a membership comment';
    }
    return event?.type?.description ?? 'edited membership';
  });

  function formatTimestamp(timestamp: Moment) {
    return timestamp?.format('D MMM YYYY');
  }

  const paymentMeta = paymentData && (
    <EuiFlexGrid
      css={{ maxWidth: '280px' }}
      columns={2}
      gutterSize="none"
      alignItems="center">
      <EuiFlexItem grow={false}>Membership number</EuiFlexItem>
      <EuiFlexItem grow={false}>
        <strong>{paymentData?.membershipNumber}</strong>
      </EuiFlexItem>
      <EuiFlexItem>Years/Amount</EuiFlexItem>
      <EuiFlexItem>
        <strong>
          {paymentData.years} {paymentData.years > 1 ? 'years' : 'year'} / R
          {paymentData.amount}
        </strong>
      </EuiFlexItem>
      <EuiFlexItem>Payment type</EuiFlexItem>
      <EuiFlexItem>
        <strong>{paymentData.type}</strong>
      </EuiFlexItem>
      <EuiFlexItem>Payment reference</EuiFlexItem>
      <EuiFlexItem>
        <strong>{paymentData.referenceNumber}</strong>
      </EuiFlexItem>
      {paymentData.recruitedBy && (
        <>
          <EuiFlexItem>Referred by</EuiFlexItem>
          <EuiFlexItem>
            {paymentData.recruitedBy?.firstName ? (
              <strong>
                {paymentData.recruitedBy?.firstName}{' '}
                {paymentData.recruitedBy?.surname}
              </strong>
            ) : (
              <strong>{paymentData.recruitedBy}</strong>
            )}
          </EuiFlexItem>
        </>
      )}
    </EuiFlexGrid>
  );

  const cancelationMeta = [
    'membership-terminated',
    'membership-resigned',
  ].includes(event.type.name) && (
    <>
      <EuiText size="xs">{event.type?.description}</EuiText>
      {event.metaData?.person?.membership?.statusComments && (
        <EuiText size="xs">
          <strong>Comment: </strong>{' '}
          {event.metaData?.person?.membership?.statusComments}
        </EuiText>
      )}
    </>
  );

  const jsonMeta = hasRole(Roles.SuperUser) && (
    <>
      <EuiSpacer size="m" />
      <EuiText size="s">
        <strong>Event metadata:</strong>
      </EuiText>
      <JSONTree
        data={event.metaData}
        hideRoot
        shouldExpandNodeInitially={() => true}
        invertTheme={true}
        theme={{
          scheme: 'monokai',
          author: 'wimer hazenberg (http://www.monokai.nl)',
          base00: '#272822',
          base01: '#383830',
          base02: '#49483e',
          base03: '#75715e',
          base04: '#a59f85',
          base05: '#f8f8f2',
          base06: '#f5f4f1',
          base07: '#f9f8f5',
          base08: '#f92672',
          base09: '#fd971f',
          base0A: '#f4bf75',
          base0B: '#a6e22e',
          base0C: '#a1efe4',
          base0D: '#66d9ef',
          base0E: '#ae81ff',
          base0F: '#cc6633',
        }}
      />
    </>
  );

  const renderMetaData = [paymentMeta, cancelationMeta, jsonMeta];

  return (
    <EuiComment
      css={css`
        .euiCommentEvent__headerUsername {
          text-transform: capitalize;
        }
      `}
      username={
        isSystemEntry
          ? ''
          : event?.createdBy?.givenName
          ? `${event?.createdBy?.givenName?.toLowerCase()} ${event?.createdBy?.surname?.toLowerCase()}`
          : `${event?.createdBy?.firstName?.toLowerCase()}  ${event?.createdBy?.surname?.toLowerCase()}`
      }
      event={<>{eventText} on</>}
      timestamp={formatTimestamp(event.createdBy.date as Moment)}
      timelineAvatarAriaLabel={
        isSystemEntry ? 'system' : event.createdBy.firstName
      }
      timelineAvatar={
        isSystemEntry ? (
          <EuiAvatar
            name="system"
            iconType="bell"
            size="m"
            color={euiTheme.colors.warning}
          />
        ) : (
          <EuiAvatar
            name={event?.createdBy?.firstName}
            iconType={isMemberEntry ? CiUser : 'editorComment'}
            size="m"
            color={euiTheme.colors.lightShade}
            onClick={() => console.log(event)}
          />
        )
      }
      actions={
        renderMetaData && (
          <EuiButtonIcon
            // title="expand"
            aria-label="expand"
            color="text"
            iconType="arrowDown"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )
      }
      eventColor={isSystemEntry ? 'warning' : 'primary'}>
      {isExpanded && renderMetaData && (
        <EuiText size="xs">
          <p>{renderMetaData}</p>
        </EuiText>
      )}
    </EuiComment>
  );
};

export default Membership;

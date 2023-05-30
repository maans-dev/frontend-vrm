import {
  EuiAvatar,
  EuiButtonIcon,
  EuiComment,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiToolTip,
  useEuiTheme,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { CategoryEnum, PersonEvent } from '@lib/domain/person-history';
import { Moment } from 'moment';
import { FunctionComponent, useState } from 'react';
import { RiUserAddLine } from 'react-icons/ri';
import { JSONTree } from 'react-json-tree';
import { useSession } from 'next-auth/react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { renderName } from '@lib/person/utils';

export type Props = {
  event: PersonEvent;
  onClick?: (event: PersonEvent) => void;
};

const EventTitle: FunctionComponent<Props> = ({ event, onClick }) => {
  if (event.category.name === 'canvass') {
    const dateDiff = (event.canvassedBy.date as Moment).diff(
      event.createdBy.date,
      'd'
    );

    const isCapturedBy =
      event.canvassedBy.key !== event.createdBy.key || dateDiff !== 0;

    if (isCapturedBy) {
      return (
        <EuiText
          css={{ cursor: 'default' }}
          size="xs"
          onClick={() => onClick(event)}>
          Canvassed ({event.type.description}) by{' '}
          {renderName(event.canvassedBy)} on{' '}
          {(event.canvassedBy.date as Moment).format('D MMM YYYY')} - Captured
          by {renderName(event.createdBy)} on{' '}
          <EuiToolTip
            content={(event.createdBy.date as Moment).format('HH:mm:ss')}>
            <EuiLink>
              {(event.createdBy.date as Moment).format('D MMM YYYY')}
            </EuiLink>
          </EuiToolTip>
        </EuiText>
      );
    }

    return (
      <EuiText
        css={{ cursor: 'default' }}
        size="xs"
        onClick={() => onClick(event)}>
        Canvassed ({event.type.description}) by {renderName(event.createdBy)} on{' '}
        {(event.createdBy.date as Moment).format('D MMM YYYY')}
      </EuiText>
    );
  }

  if (event.category.name === 'personcreate') {
    return (
      <EuiText
        css={{ cursor: 'default' }}
        size="xs"
        onClick={() => onClick(event)}>
        Person added by {renderName(event.createdBy)} on{' '}
        <EuiToolTip
          content={(event.createdBy.date as Moment).format('HH:mm:ss')}>
          <EuiLink>
            {(event.createdBy.date as Moment).format('D MMM YYYY')}
          </EuiLink>
        </EuiToolTip>
      </EuiText>
    );
  }

  if (event.category.category === CategoryEnum.Admin) {
    return (
      <EuiText
        css={{ cursor: 'default' }}
        size="xs"
        onClick={() => onClick(event)}>
        Edited by {renderName(event.createdBy)} on{' '}
        <EuiToolTip
          content={(event.createdBy.date as Moment).format('HH:mm:ss')}>
          <EuiLink>
            {(event.createdBy.date as Moment).format('D MMM YYYY')}
          </EuiLink>
        </EuiToolTip>
      </EuiText>
    );
  }

  return (
    <EuiText
      css={{ cursor: 'default' }}
      size="xs"
      onClick={() => onClick(event)}>
      Edited by {renderName(event.createdBy)} on{' '}
      <EuiToolTip content={(event.createdBy.date as Moment).format('HH:mm:ss')}>
        <EuiLink>
          {(event.createdBy.date as Moment).format('D MMM YYYY')}
        </EuiLink>
      </EuiToolTip>
    </EuiText>
  );
};

const PersonHistoryItem: FunctionComponent<Props> = ({ event }) => {
  const { data: session, status } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSystemEntry = false;

  const { euiTheme } = useEuiTheme();

  const renderMetaData = (
    <>
      {event?.activity?.type?.category === 'CAMPAIGN' && (
        <>
          <EuiText size="s">
            <strong>Campaign:</strong> {event.activity.name}
          </EuiText>
        </>
      )}
      {hasRole(Roles.SuperUser) && (
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
      )}
    </>
  );

  const getAvatarIcon = () => {
    const dateDiff = (event.canvassedBy.date as Moment).diff(
      event.createdBy.date,
      'd'
    );

    const isCapturedBy =
      event.category.name === 'canvass' &&
      (event.canvassedBy?.key !== event.createdBy.key || dateDiff !== 0);

    if (isCapturedBy) return 'importAction';
    if (event.category.name === 'canvass') return 'inputOutput';
    if (event.category.name === 'personcreate') return RiUserAddLine;
    if (event.category.name === 'datacleanup') return 'tableDensityExpanded';
    if (event.category.name === 'membership') return 'users';
    return 'editorComment';
  };

  const isExpandable = () => {
    return (
      hasRole(Roles.SuperUser) ||
      (!hasRole(Roles.VoterEdit) &&
        event?.activity?.type?.category === 'CAMPAIGN')
    );
  };

  return (
    <EuiComment
      css={css`
        .euiCommentEvent__headerUsername {
          text-transform: capitalize;
        }
      `}
      username={null}
      event={
        <EventTitle
          event={event}
          onClick={event => {
            console.log(event);
            isExpandable() && setIsExpanded(!isExpanded);
          }}
        />
      }
      // timestamp={formatTimestamp(event.modifiedBy.date as Moment)}
      // timelineAvatarAriaLabel={
      //   isSystemEntry ? 'system' : event.createdBy.firstName
      // }
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
            name={event.category.description}
            iconType={getAvatarIcon()}
            size="m"
            color={euiTheme.colors.lightShade}
          />
        )
      }
      actions={
        renderMetaData &&
        isExpandable() && (
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

export default PersonHistoryItem;

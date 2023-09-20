import {
  useEuiTheme,
  EuiBasicTableColumn,
  EuiText,
  EuiComment,
  EuiAvatar,
  EuiButtonIcon,
  EuiBasicTable,
  EuiSpacer,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { Roles } from '@lib/domain/auth';
import { Archives, PersonEvent } from '@lib/domain/person-history';
import { Moment } from 'moment';
import { useSession } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';
import { RiUserAddLine } from 'react-icons/ri';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { EventTitle } from './person-history-item';
import { JSONTree } from 'react-json-tree';

export type Props = {
  event?: PersonEvent;
  mode?: 'history' | 'activity';
  key: string;
  onClick?: (event: PersonEvent) => void;
};

interface FieldChange {
  key?: string;
  field: string;
  tableName: string;
  previous_value: object;
  changed_to_value: object;
}

const PersonHistoryTable: FunctionComponent<Props> = ({ event, mode }) => {
  const { data: session } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSystemEntry = false;

  const { euiTheme } = useEuiTheme();

  const findChanges = (archives: Archives[]) => {
    const fieldChanges = [];
    const prettifyTableName = name => {
      return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    if (archives) {
      for (const archive of archives) {
        const { previous_json, modified_json, current_json, tableName } =
          archive;
        const allKeys = new Set([
          ...Object.keys(previous_json || {}),
          ...Object.keys(modified_json || {}),
          ...Object.keys(current_json || {}),
          ...Object.keys(tableName),
        ]);
        allKeys.forEach(key => {
          const previousValue = previous_json?.[key];
          const modifiedValue = modified_json?.[key];
          const currentValue = current_json?.[key];

          const formattedPreviousValue = previousValue ?? '-';
          const formattedModifiedValue = modifiedValue ?? '-';
          const formattedCurrentValue = currentValue ?? '-';

          if (formattedPreviousValue !== formattedCurrentValue) {
            fieldChanges.push({
              field: key,
              previous_value: formattedPreviousValue,
              changed_to_value:
                formattedModifiedValue !== '-'
                  ? formattedModifiedValue
                  : formattedCurrentValue,
              tableName: prettifyTableName(tableName),
            });
          }
        });
      }

      return fieldChanges;
    }
  };

  const formatField = (field: string) => {
    if (field) {
      return field?.replace(/_/g, ' ');
    }
  };

  const changes: FieldChange[] = findChanges(event?.archives);

  const columns: Array<EuiBasicTableColumn<FieldChange>> = [
    {
      field: 'field',
      name: 'Field',
      render: (field: string) => (
        <EuiText size="xs">
          {/* <strong> */}
          {formatField(field)}
          {/* </strong> */}
        </EuiText>
      ),
    },
    {
      field: 'previous_value',
      name: 'Previous value',
      render: (previousValue, item) =>
        item.field === 'metadata_json' ? (
          <JSONTree
            data={previousValue}
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
            invertTheme={true}
          />
        ) : (
          <EuiText size="xs">{previousValue}</EuiText>
        ),
    },
    {
      field: 'changed_to_value',
      name: 'Change to',
      render: (changedValue, item) =>
        item.field === 'metadata_json' ? (
          <JSONTree
            data={changedValue}
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
            invertTheme={true}
          />
        ) : (
          <EuiText size="xs">{changedValue}</EuiText>
        ),
    },
  ];

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

  const CustomTable = ({ tableName, data, columns }) => {
    return (
      <div>
        <EuiSpacer size="s" />
        <EuiText size="s" style={{ marginLeft: '5px' }}>
          <strong> Table: {tableName}</strong>
        </EuiText>
        <EuiSpacer size="s" />
        <EuiBasicTable items={data} columns={columns} />
      </div>
    );
  };

  return (
    <>
      <EuiComment
        css={css`
          .euiCommentEvent__headerUsername {
            text-transform: capitalize;
          }
        `}
        username={null}
        event={
          <EventTitle
            mode={mode}
            event={event}
            onClick={event => {
              console.log(event);
              isExpandable() && setIsExpanded(!isExpanded);
            }}
          />
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
              name={event.category.description}
              iconType={getAvatarIcon()}
              size="m"
              color={euiTheme.colors.lightShade}
            />
          )
        }
        actions={
          hasRole(Roles.SuperUser) &&
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
        {isExpanded && (
          <div>
            {changes
              ?.reduce((acc, change) => {
                if (!acc.includes(change.tableName)) {
                  acc.push(change.tableName);
                }
                return acc;
              }, [])
              .map((tableName, index) => (
                <>
                  <EuiSpacer size="xs" />
                  <CustomTable
                    key={index}
                    tableName={tableName}
                    data={changes.filter(item => item.tableName === tableName)}
                    columns={columns}
                  />
                </>
              ))}
          </div>
        )}
      </EuiComment>
    </>
  );
};

export default PersonHistoryTable;

import {
  EuiAvatar,
  EuiButtonIcon,
  EuiComment,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { CiUser } from 'react-icons/ci';
import { Comment } from '@lib/domain/person';
import { renderName } from '@lib/person/utils';

export type Props = {
  comment: Comment;
  onArchive: (comment: Comment) => void;
};

const Commenter: FunctionComponent<Props> = ({ comment, onArchive }) => {
  const isSystemComment = comment.type === 'system';
  const isMemberComment = comment.type === 'membership';

  const { euiTheme } = useEuiTheme();

  function formatTimestamp(timestamp) {
    return moment(timestamp).format('D MMM YYYY');
  }

  return (
    <EuiComment
      username={renderName(comment.createdBy)}
      event={isSystemComment ? <>{comment.value}</> : 'added a comment'}
      timestamp={formatTimestamp(comment.created)}
      timelineAvatarAriaLabel={renderName(comment.createdBy)}
      timelineAvatar={
        isSystemComment ? (
          <EuiAvatar
            name={renderName(comment.createdBy)}
            iconType="bell"
            size="m"
            color={euiTheme.colors.warning}
          />
        ) : (
          <EuiAvatar
            name={renderName(comment.createdBy)}
            iconType={isMemberComment ? CiUser : 'editorComment'}
            size="m"
            color={euiTheme.colors.lightShade}
          />
        )
      }
      eventColor={isSystemComment ? 'warning' : null}
      actions={
        !isSystemComment ? (
          <EuiButtonIcon
            title="Archive"
            aria-label="Archive"
            color="primary"
            iconType="trash"
            iconSize="s"
            size="xs"
            onClick={() => onArchive(comment)}
          />
        ) : null
      }>
      {!isSystemComment ? (
        <EuiText size="xs">
          <p>{comment?.value}</p>
        </EuiText>
      ) : null}
    </EuiComment>
  );
};

export default Commenter;

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
import { useSession } from 'next-auth/react';
import { hasRole } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';

export type Props = {
  comment: Comment;
  onArchive: (comment: Comment) => void;
};

const Commenter: FunctionComponent<Props> = ({ comment, onArchive }) => {
  const isSystemComment = comment.type === 'system';
  const isMemberComment = comment.type === 'membership';
  const { data: session } = useSession();

  const { euiTheme } = useEuiTheme();

  const canDelete = (darn: number) => {
    const isAdmin = hasRole(Roles.SuperUser, session?.user?.roles);
    return isAdmin || (session?.user?.darn === darn && !isSystemComment);
  };

  function formatTimestamp(timestamp) {
    return moment(timestamp).format('D MMM YYYY');
  }

  return (
    <EuiComment
      username={renderName(comment.createdBy)}
      event={isSystemComment ? <>{comment.value}</> : 'added a comment'}
      timestamp={formatTimestamp(comment.createdBy.date)}
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
        canDelete(comment?.createdBy?.key) ? (
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

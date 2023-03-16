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

export type Props = {
  comment: Comment;
};

const Commenter: FunctionComponent<Props> = ({ comment }) => {
  // console.log(comment, 'comment i');
  const isSystemComment = comment.type === 'system';
  const isMemberComment = comment.type === 'membership';

  const { euiTheme } = useEuiTheme();

  return (
    <EuiComment
      username={`${comment.createdBy.firstName}  ${comment.createdBy.surname}`}
      event={isSystemComment ? <>{comment.value}</> : 'added a comment'}
      timestamp={moment(comment.created).fromNow()}
      timelineAvatarAriaLabel={comment.createdBy.firstName}
      timelineAvatar={
        isSystemComment ? (
          <EuiAvatar
            name={comment.createdBy.firstName}
            iconType="bell"
            size="m"
            color={euiTheme.colors.warning}
          />
        ) : (
          <EuiAvatar
            name={comment.createdBy.firstName}
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
          />
        ) : null
      }>
      {!isSystemComment ? (
        <EuiText size="xs">
          <p>{comment.value}</p>
        </EuiText>
      ) : null}
    </EuiComment>
  );
};

export default Commenter;

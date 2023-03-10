import {
  EuiAvatar,
  EuiButtonIcon,
  EuiComment,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { IComment } from './types';
import { CiUser } from 'react-icons/ci';

export type Props = {
  comment: IComment;
};

const Comment: FunctionComponent<Props> = ({ comment }) => {
  const isSystemComment = comment.type === 'system';
  const isMemberComment = comment.type === 'member';

  const { euiTheme } = useEuiTheme();

  return (
    <EuiComment
      username={comment.user}
      event={isSystemComment ? <>{comment.message}</> : 'added a comment'}
      timestamp={moment(comment.date).fromNow()}
      timelineAvatarAriaLabel={comment.user}
      timelineAvatar={
        isSystemComment ? (
          <EuiAvatar
            name={comment.user}
            iconType="bell"
            size="m"
            color={euiTheme.colors.warning}
          />
        ) : (
          <EuiAvatar
            name={comment.user}
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
          <p>{comment.message}</p>
        </EuiText>
      ) : null}
    </EuiComment>
  );
};

export default Comment;

import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiAvatar,
  EuiButtonEmpty,
  EuiComment,
  EuiCommentList,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  useEuiTheme,
} from '@elastic/eui';
import Commenter from './comment';
import { css, Global } from '@emotion/react';
import { Comment } from '@lib/domain/person';
import { CommentsUpdate, PersonUpdate } from '@lib/domain/person-update';
// import { CommentsType } from '@lib/domain/comments';

export type Props = {
  comments: Comment[];
  onCommentChange: (update: PersonUpdate<CommentsUpdate>) => void;
};

const Comments: FunctionComponent<Props> = ({ comments }) => {
  const [newComment, setNewComment] = useState('');
  const [comment, setComment] = useState<Partial<Comment>[]>([]);

  useEffect(() => {
    setComment(comments);
  }, [comments]);

  const { euiTheme } = useEuiTheme();

  if (!comments) return <></>;

  const handleAddComment = () => {
    const newCommentObj = {
      value: newComment,
      createdBy: {
        firstName: 'Current',
        surname: 'User',
      },
      created: new Date(),
      type: 'person',
    };

    setComment(prevComments => [...prevComments, newCommentObj]);

    setNewComment('');
  };

  return (
    <>
      <Global
        styles={css`
          .euiCommentEvent__header {
            font-size: 10px;
            padding: 0 8px !important;
          }
        `}
      />
      <EuiCommentList aria-label="Comments" gutterSize="m">
        {comment?.map((comment: Comment, i) => {
          return (
            <Commenter
              comment={comment}
              key={i}
              // handleArchive={handleArchiveComment}
            />
          );
        })}
        <EuiComment
          username="Current User"
          timelineAvatarAriaLabel="Current User"
          timelineAvatar={
            <EuiAvatar
              name="Current User"
              iconType="editorComment"
              size="m"
              color={euiTheme.colors.lightShade}
            />
          }>
          <EuiFlexGroup gutterSize="xs" responsive={false}>
            <EuiFlexItem grow={true}>
              <EuiFieldText
                compressed
                fullWidth
                placeholder="Enter a new comment..."
                onChange={e => setNewComment(e.target.value)}
                value={newComment}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                size="s"
                onClick={handleAddComment}
                disabled={!newComment}>
                Add
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiComment>
      </EuiCommentList>
    </>
  );
};

export default Comments;

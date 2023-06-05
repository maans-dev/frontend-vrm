import { FunctionComponent, useContext, useEffect, useState } from 'react';
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
import { css } from '@emotion/react';
import { Comment } from '@lib/domain/person';
import { CommentsUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import router from 'next/router';
// import { CommentsType } from '@lib/domain/comments';

export type Props = {
  comments: Comment[];
  onCommentChange?: (update: PersonUpdate<CommentsUpdate>) => void;
  onMembershipCommentChange?: (update: PersonUpdate<CommentsUpdate>) => void;
};

const Comments: FunctionComponent<Props> = ({
  comments,
  onCommentChange,
  onMembershipCommentChange,
}) => {
  const [newComment, setNewComment] = useState('');
  const [comment, setComment] = useState<Partial<Comment>[]>([]);
  const { nextId } = useContext(CanvassingContext);

  useEffect(() => {
    if (router.pathname.includes('/membership')) {
      setComment(comments?.filter(c => !c.archived && c.type === 'membership'));
    } else {
      setComment(comments?.filter(c => !c.archived && c.type === 'person'));
    }
  }, [comments]);

  const { euiTheme } = useEuiTheme();

  useCanvassFormReset(() => {
    if (router.pathname.includes('/membership')) {
      setComment(comments?.filter(c => !c.archived && c.type === 'membership'));
    } else {
      setComment(comments?.filter(c => !c.archived && c.type === 'person'));
    }
  });

  if (!comments) return <></>;

  const handleAddComment = () => {
    const newCommentObj = {
      key: nextId(),
      value: newComment,
      createdBy: {
        firstName: 'Current',
        surname: 'User',
      },
      created: new Date(),
      type: 'person',
    };

    setComment(prevComments => {
      return [...prevComments, newCommentObj];
    });
    if (onCommentChange) {
      onCommentChange({
        field: 'comments',
        data: {
          type: newCommentObj.type,
          value: newCommentObj.value,
          key: newCommentObj.key,
        },
      });
    }
    if (onMembershipCommentChange) {
      onMembershipCommentChange({
        field: 'comments',
        data: {
          type: 'membership',
          value: newComment,
          key: newCommentObj.key,
        },
      });
    }
    setNewComment('');
  };

  const handleArchive = (comment: Comment) => {
    setComment(prev => prev.filter(c => c.key !== comment.key));
    if (onCommentChange) {
      onCommentChange({
        field: 'comments',
        data: {
          key: comment.key,
          type: null,
          value: null,
          archived: typeof comment.key === 'number' ? null : true,
        },
      });
    }
    if (onMembershipCommentChange) {
      onMembershipCommentChange({
        field: 'comments',
        data: {
          type: 'membership',
          value: newComment,
          archived: typeof comment.key === 'number' ? null : true,
          key: comment.key,
        },
      });
    }
  };

  return (
    <>
      {/* <Global
        styles={css`
          .euiCommentEvent__header {
            font-size: 10px;
            padding: 0 8px !important;
          }
        `}
      /> */}
      <EuiCommentList
        aria-label="Comments"
        gutterSize="m"
        css={css`
          .euiCommentEvent__header {
            font-size: 12px;
          }
        `}>
        {comment?.map((comment: Comment) => {
          return (
            <Commenter
              comment={comment}
              key={comment.key}
              onArchive={handleArchive}
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

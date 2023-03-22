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
import { CommentsType } from '@lib/domain/comments';

export type Props = {
  comments: Comment[];
  onCommentChange: (update: PersonUpdate<CommentsUpdate>) => void;
};

const Comments: FunctionComponent<Props> = ({ comments }) => {
  // const [comment, setComment] = useState<CommentsType[]>(
  //   comments.map(comment => ({
  //     key: comment.key,
  //     type: comment.type,
  //     value: comment.value,
  //   }))
  // );
  const { euiTheme } = useEuiTheme();

  if (!comments) return <></>;

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
        {comments?.map((comment: Comment, i) => {
          return <Commenter comment={comment} key={i} />;
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
                onChange={() => null}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty size="s">Add</EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiComment>
      </EuiCommentList>
    </>
  );
};

export default Comments;

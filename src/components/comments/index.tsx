import { FunctionComponent } from 'react';
import {
  EuiAvatar,
  EuiButton,
  EuiComment,
  EuiCommentList,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  useEuiTheme,
} from '@elastic/eui';
import { IComment } from './types';
import Comment from './comment';
import { css, Global } from '@emotion/react';

export type Props = {
  comments: IComment[];
};

const Comments: FunctionComponent<Props> = ({ comments }) => {
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
        {comments?.map((item: IComment, i) => {
          return <Comment comment={item} key={i} />;
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
          <EuiFlexGroup gutterSize="xs">
            <EuiFlexItem grow={true}>
              <EuiFieldText
                compressed
                fullWidth
                placeholder="Enter a new comment..."
                onChange={() => null}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton fullWidth size="s">
                Add comment
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiComment>
      </EuiCommentList>
    </>
  );
};

export default Comments;

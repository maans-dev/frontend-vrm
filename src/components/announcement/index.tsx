import React from 'react';
import { EuiText } from '@elastic/eui';

interface Props {
  textColor: string;
  backgroundColor: string;
  message: string;
}

const Announcement: React.FunctionComponent<Props> = props => {
  const { textColor, backgroundColor, message } = props;
  return (
    <div>
      <EuiText
        size="s"
        color={textColor}
        textAlign="center"
        css={{
          background: backgroundColor,
          padding: '10px',
          width: '100%',
        }}>
        <strong>{message}</strong>
      </EuiText>
    </div>
  );
};

export default Announcement;

import React from 'react';
import { EuiText } from '@elastic/eui';

interface Props {
  top: string;
  textColor: string;
  backgroundColor: string;
  message: string;
  zIndex?: number;
}

const Announcement: React.FunctionComponent<Props> = props => {
  const { top, textColor, backgroundColor, message, zIndex } = props;
  return (
    <div
      style={{
        display: 'block',
        position: 'sticky',
        top,
        zIndex: zIndex ?? 99,
      }}>
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

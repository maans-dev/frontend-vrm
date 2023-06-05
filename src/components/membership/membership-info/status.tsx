import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiText,
  IconColor,
} from '@elastic/eui';
import { FunctionComponent } from 'react';

export interface Props {
  status: string;
  colour: IconColor;
}

const Status: FunctionComponent<Props> = ({ status, colour }) => {
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiText size="s">
          <p>Status:</p>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiHealth color={colour}>
          <EuiText size="s">
            <strong>{status}</strong>
          </EuiText>
        </EuiHealth>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Status;

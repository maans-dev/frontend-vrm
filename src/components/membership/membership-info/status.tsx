import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiText,
  IconColor,
} from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';

export interface Props {
  status: string;
  colour: IconColor;
}

const Status: FunctionComponent<Props> = ({ status, colour }) => {
  const { person } = useContext(MembershipContext);
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiText size="s">
          <p>Status:</p>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiHealth color={person.pubRep ? 'success' : colour}>
          <EuiText size="s">
            <strong>
              {person.pubRep ? 'Active (Public Representative)' : status}
            </strong>
          </EuiText>
        </EuiHealth>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Status;

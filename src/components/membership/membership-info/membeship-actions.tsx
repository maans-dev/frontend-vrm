import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';

const MembershipActions: FunctionComponent = () => {
  const { membership, onActivate, onRenew, onCancel } =
    useContext(MembershipContext);
  return (
    <EuiFlexGroup alignItems="center">
      {(membership?.status === 'NotAMember' || !membership?.status) && (
        <EuiFlexItem>
          <EuiButton
            onClick={onActivate}
            // disabled={disabled}
            size="s"
            color="primary"
            fill>
            Activate
          </EuiButton>
        </EuiFlexItem>
      )}

      {membership?.status && membership?.status !== 'NotAMember' && (
        <EuiFlexItem>
          <EuiButton
            onClick={onRenew}
            // disabled={disabled}
            size="s"
            color="primary"
            fill>
            Renew
          </EuiButton>
        </EuiFlexItem>
      )}

      {membership?.status && membership?.status !== 'NotAMember' && (
        <EuiFlexItem>
          <EuiButton
            onClick={onCancel}
            // disabled={disabled}
            size="s"
            color="primary"
            fill>
            Cancel
          </EuiButton>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  );
};

export default MembershipActions;

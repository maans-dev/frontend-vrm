import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';
import { Roles } from '@lib/domain/auth';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';

const MembershipActions: FunctionComponent = () => {
  const { membership, onActivate, onRenew, onCancel, hasRole, person } =
    useContext(MembershipContext);
  return (
    <EuiFlexGroup alignItems="center">
      {(['NotAMember', 'Resigned', 'Terminated'].includes(membership?.status) ||
        !membership?.status) && (
        <EuiFlexItem>
          {!hasRole(Roles.MembershipAdmin) &&
            !(membership?.status === 'NotAMember' || !membership?.status) && (
              <EuiText color="subdued" textAlign="center" size="xs">
                Please contact your Provincial Director or the Federal
                Membership office to re-activate this member.
              </EuiText>
            )}
          {((['Resigned', 'Terminated'].includes(membership?.status) &&
            hasRole(Roles.MembershipAdmin)) ||
            membership?.status === 'NotAMember' ||
            !membership?.status) && (
            <EuiButton onClick={onActivate} size="s" color="primary" fill>
              Activate
            </EuiButton>
          )}
        </EuiFlexItem>
      )}
      {person?.pubRep ? (
        <EuiFlexItem>
          <EuiText color="subdued" textAlign="center" size="xs">
            To edit this membership record please contact your Provincial
            Director or the Federal Membership team.
          </EuiText>
        </EuiFlexItem>
      ) : null}
      {!person?.pubRep && ['Expired', 'Active'].includes(membership?.status) && (
        <>
          <EuiFlexItem>
            <EuiButton onClick={onRenew} size="s" color="primary" fill>
              Renew
            </EuiButton>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiButton onClick={onCancel} size="s" color="primary" fill>
              Cancel
            </EuiButton>
          </EuiFlexItem>
        </>
      )}
    </EuiFlexGroup>
  );
};

export default MembershipActions;

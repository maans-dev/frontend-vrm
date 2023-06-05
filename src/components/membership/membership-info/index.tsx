import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiSpacer,
} from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';
import InfoGrid from './info-grid';
import MembershipOptions from './membership-options';
import MembershipActions from './membeship-actions';
import Status from './status';

const MembershipInfo: FunctionComponent = () => {
  const { membership, statusColour, showMembershipInfo, payment } =
    useContext(MembershipContext);
  return (
    <>
      <EuiFormFieldset legend={{ children: 'Membership Info' }}>
        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
          <EuiFlexItem>
            <Status
              status={membership?.status || 'NotAMember'}
              colour={statusColour}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <MembershipActions />
          </EuiFlexItem>
        </EuiFlexGroup>

        {(showMembershipInfo || payment) && (
          <>
            <EuiSpacer size="s" />

            {showMembershipInfo && (
              <InfoGrid
                membershipNumber={membership?.payment?.membershipNumber}
                renewalDate={membership?.payment?.date}
                joinDate={membership?.initialJoin}
                expiryDate={membership?.expiry}
              />
            )}

            <EuiSpacer size="m" />

            <MembershipOptions />
          </>
        )}
      </EuiFormFieldset>
    </>
  );
};

export default MembershipInfo;

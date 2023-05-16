import { FunctionComponent } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import MembershipCheckbox from './membership-checkbox';
import MembershipInfo from './membership-info';

export interface Props {
  status: string;
  onAbroadChange: (update: boolean) => void;
  onDawnChange: (update: boolean) => void;
  onYouthChange: (update) => void;
  dawnOptOut: boolean;
  daAbroadInternal: boolean;
  daYouth: boolean;
  expired: string;
  initialJoin: string;
  newRenewal: string;
  membershipNumber: string;
  gender: string;
  dob: string;
}

const MembershipPanel: FunctionComponent<Props> = ({
  status,
  onAbroadChange,
  onDawnChange,
  onYouthChange,
  daAbroadInternal,
  daYouth,
  dawnOptOut,
  expired,
  initialJoin,
  newRenewal,
  membershipNumber,
  gender,
  dob,
}) => {
  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <MembershipInfo
            status={status}
            expired={expired}
            initialJoin={initialJoin}
            newRenewal={newRenewal}
            membershipNumber={membershipNumber}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiFlexItem>
        <MembershipCheckbox
          onAbroadChange={onAbroadChange}
          onDawnChange={onDawnChange}
          onYouthChange={onYouthChange}
          daAbroadInternal={daAbroadInternal}
          daYouth={daYouth}
          dawnOptOut={dawnOptOut}
          gender={gender}
          dob={dob}
        />
      </EuiFlexItem>
    </>
  );
};

export default MembershipPanel;

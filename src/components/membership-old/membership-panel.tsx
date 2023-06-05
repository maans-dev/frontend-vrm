import { FunctionComponent } from 'react';
import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiHealth,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import MembershipCheckbox from './membership-checkbox';
import moment from 'moment';
import MembershipActivationForm from './activate-form';
import CancelMembershipForm from './cancel-form';
import { Membership, Person, Structure } from '@lib/domain/person';
import { getMembershipStatusColor } from '@lib/membership/utils';

export interface Props {
  status: string;
  onDawnChange: (update: boolean) => void;
  onYouthChange: (update) => void;
  dawnOptOut: boolean;
  daYouth: boolean;
  expired: string;
  initialJoin: string;
  newRenewal: string;
  membershipNumber: string;
  gender: string;
  dob: string;
  id_number: string;
  handleMembershipCancellation: (update) => void;
  handleMembershipActivation: (update) => void;
  handleRecruitedPerson: (person: Partial<Person>) => void;
  isActivationModalVisible: boolean;
  setIsActivationModalVisible: (value: boolean) => void;
  isCancellationModalVisible: boolean;
  setIsCanellationModalVisible: (value: boolean) => void;
  isDaAbroadModalVisible: boolean;
  setIsDaAbroadModalVisible: (value: boolean) => void;
  membershipUpdate: Partial<Membership>;
  onDaAbroadSubmit: (update: Partial<Membership>) => void;
  handleBranchChange: (
    ward: string | number,
    votingDistrict_id: string | number,
    type: string,
    override: boolean
  ) => void;
  setBranchUpdate: (update: Partial<Membership>) => void;
  overriddenBranchStructure: Partial<Structure>;
  setOverriddenBranchStructure: (update: Partial<Structure>) => void;
  setIsBranchOverrideModalVisible: (value: boolean) => void;
  isBranchOverrideModalVisible: boolean;
  isPermissionChecked: boolean;
  setIsPermissionChecked: (value: boolean) => void;
  isDaAbroadChecked: boolean;
  setIsDaAbroadChecked: (value: boolean) => void;
}

const MembershipPanel: FunctionComponent<Props> = ({
  status,
  onDawnChange,
  onYouthChange,
  daYouth,
  dawnOptOut,
  expired,
  initialJoin,
  newRenewal,
  membershipNumber,
  gender,
  dob,
  id_number,
  handleMembershipCancellation,
  handleMembershipActivation,
  handleRecruitedPerson,
  isActivationModalVisible,
  setIsActivationModalVisible,
  isCancellationModalVisible,
  setIsCanellationModalVisible,
  membershipUpdate,
  onDaAbroadSubmit,
  handleBranchChange,
  isDaAbroadModalVisible,
  setIsDaAbroadModalVisible,
  overriddenBranchStructure,
  setOverriddenBranchStructure,
  isBranchOverrideModalVisible,
  setIsBranchOverrideModalVisible,
  isPermissionChecked,
  setIsPermissionChecked,
  isDaAbroadChecked,
  setIsDaAbroadChecked,
  setBranchUpdate,
}) => {
  const membershipStatus = (
    <>
      <EuiFlexGroup alignItems="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <p>Status:</p>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiHealth color={getMembershipStatusColor(status)}>
            <EuiText size="s">
              <strong>{status}</strong>
            </EuiText>
          </EuiHealth>
        </EuiFlexItem>
        <EuiFlexItem>
          <MembershipActivationForm
            id_number={id_number}
            status={status}
            handleRecruitedPerson={handleRecruitedPerson}
            isActivationModalVisible={isActivationModalVisible}
            setIsActivationModalVisible={setIsActivationModalVisible}
            handleMembershipActivation={handleMembershipActivation}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          {status !== 'NotAMember' ? (
            <CancelMembershipForm
              handleMembershipCancellation={handleMembershipCancellation}
              isCancellationModalVisible={isCancellationModalVisible}
              setIsCanellationModalVisible={setIsCanellationModalVisible}
            />
          ) : null}
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
  const membershipInfo = (
    <>
      <EuiSpacer size="xs" />

      <EuiFlexGrid columns={4} gutterSize="s">
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p style={{ whiteSpace: 'nowrap' }}>Membership Number:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong>{membershipNumber ? membershipNumber : 'Unknown'}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Renewal date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong style={{ whiteSpace: 'nowrap' }}>
                {newRenewal
                  ? moment(newRenewal).format('YYYY-MM-DD')
                  : 'Unknown'}
              </strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Initial Join Date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong>{initialJoin || 'Unknown'}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Expiry date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong style={{ whiteSpace: 'nowrap' }}>
                {expired || 'Unknown'}
              </strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGrid>
    </>
  );

  return (
    <>
      <EuiFormFieldset legend={{ children: 'Membership Info' }}>
        {membershipStatus}
        <EuiSpacer size="xs" />
        {status !== 'NotAMember' && membershipInfo}
        <>
          {status !== 'NotAMember' || membershipUpdate ? (
            <>
              <EuiFlexItem>
                <EuiSpacer />
                <MembershipCheckbox
                  onDawnChange={onDawnChange}
                  onYouthChange={onYouthChange}
                  daYouth={daYouth}
                  dawnOptOut={dawnOptOut}
                  gender={gender}
                  dob={dob}
                  onDaAbroadSubmit={onDaAbroadSubmit}
                  handleBranchChange={handleBranchChange}
                  isDaAbroadModalVisible={isDaAbroadModalVisible}
                  setIsDaAbroadModalVisible={setIsDaAbroadModalVisible}
                  overriddenBranchStructure={overriddenBranchStructure}
                  setOverriddenBranchStructure={setOverriddenBranchStructure}
                  isBranchOverrideModalVisible={isBranchOverrideModalVisible}
                  setIsBranchOverrideModalVisible={
                    setIsBranchOverrideModalVisible
                  }
                  isPermissionChecked={isPermissionChecked}
                  setIsPermissionChecked={setIsPermissionChecked}
                  isDaAbroadChecked={isDaAbroadChecked}
                  setIsDaAbroadChecked={setIsDaAbroadChecked}
                  setBranchUpdate={setBranchUpdate}
                />
              </EuiFlexItem>
              <EuiSpacer size="s" />
            </>
          ) : null}
        </>
      </EuiFormFieldset>

      <EuiSpacer />
    </>
  );
};

export default MembershipPanel;

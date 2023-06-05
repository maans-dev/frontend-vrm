import { FunctionComponent, useEffect, useState } from 'react';
import MembershipPanel from './membership-panel';
import MembershipEvents from '@components/membership-history';
import {
  EuiButtonIcon,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import BranchInfo from './branch-info';
import Comments from '@components/comments';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { PersonUpdate, MembershipUpdate } from '@lib/domain/person-update';
import { Membership, Person, Structure } from '@lib/domain/person';
import moment from 'moment';
import { getCancellationTypeLabel } from '@lib/membership/utils';

export interface Props {
  personMembership: Membership;
  person: Partial<Person>;
  selectAddress: (tabIndex: number) => void;
  onMembershipChange: (update: PersonUpdate<MembershipUpdate>) => void;
}

const MembershipOld: FunctionComponent<Props> = ({
  selectAddress,
  onMembershipChange,
  personMembership,
  person,
}) => {
  const [daAbroadInternal, setDaAbroadInternal] = useState(
    Boolean(personMembership?.daAbroad)
  );
  const [dawnOptOutInternal, setDawnOptOutInternal] = useState(
    personMembership?.dawnOptOut
  );
  const [youth, setYouth] = useState(personMembership?.daYouth);
  const [membershipUpdate, setMembershipUpdate] =
    useState<Partial<Membership>>(null);
  const [isActivationModalVisible, setIsActivationModalVisible] =
    useState(false);
  const [isCancellationModalVisible, setIsCanellationModalVisible] =
    useState(false);
  const [isDaAbroadModalVisible, setIsDaAbroadModalVisible] = useState(false);
  const [isBranchOverrideModalVisible, setIsBranchOverrideModalVisible] =
    useState(false);
  const [overriddenBranchStructure, setOverriddenBranchStructure] =
    useState<Partial<Structure>>(null);
  const [isPermissionChecked, setIsPermissionChecked] = useState<boolean>(
    personMembership?.branchOverride ? personMembership?.branchOverride : false
  );
  const [isDaAbroadChecked, setIsDaAbroadChecked] = useState<boolean>(
    personMembership?.daAbroad
  );
  const [recruitedPerson, setRecruitedPerson] = useState<Partial<Person>>();
  const [branchUpdate, setBranchUpdate] = useState<Partial<Membership>>();

  const onYouthChange = () => {
    setYouth(prevYouth => !prevYouth);
    const youthValue = !youth;

    let updatedMembership = { ...membershipUpdate };

    if (youthValue) {
      updatedMembership = {
        ...updatedMembership,
        daYouth: true,
      };
    } else if (!youthValue) {
      updatedMembership = {
        ...updatedMembership,
        daYouth: false,
      };
    }

    setMembershipUpdate(updatedMembership);

    const membershipChangeData = {
      field: 'membership',
      data: updatedMembership,
    };

    if (!updatedMembership.type) {
      membershipChangeData.data.type = 'membership-capture';
    }

    onMembershipChange(membershipChangeData);
  };

  const onDawnChange = () => {
    setDawnOptOutInternal(prev => !prev);
    const dawnOptOutValue = !dawnOptOutInternal;

    let updatedMembership = { ...membershipUpdate };

    if (dawnOptOutValue) {
      updatedMembership = {
        ...updatedMembership,
        dawnOptOut: true,
      };
    } else {
      updatedMembership = {
        ...updatedMembership,
        dawnOptOut: false,
      };
    }

    setMembershipUpdate(updatedMembership);
    console.log(updatedMembership.dawnOptOut, 'sss');

    const membershipChangeData = {
      field: 'membership',
      data: updatedMembership,
    };

    if (!updatedMembership.type) {
      membershipChangeData.data.type = 'membership-capture';
    }

    onMembershipChange(membershipChangeData);
  };

  const handleMembershipCancellation = (data: Partial<Membership>) => {
    // Delete the payment object
    if (membershipUpdate?.payment) {
      delete membershipUpdate.payment;
    }
    setMembershipUpdate(prevState => {
      const updatedMembership = { ...prevState };

      if (data) {
        updatedMembership.type = data.type;
        updatedMembership.statusComments = data.statusComments;
      }

      // // Delete the payment object
      if (updatedMembership.payment) {
        // console.log({ updatedMembership, membershipUpdate });
        delete updatedMembership.payment;
      }

      onMembershipChange({
        field: 'membership',
        data: updatedMembership,
      });

      // Return updatedMembership for the state update
      return updatedMembership;
    });
  };

  const handleMembershipActivation = (update: Partial<Membership>) => {
    setMembershipUpdate(prevState => {
      if (membershipUpdate?.statusComments) {
        delete membershipUpdate['statusComments'];
      }
      if (update === null) {
        onMembershipChange({
          field: 'membership',
          data: null,
        });
        return null;
      } else {
        let membershipType;
        switch (personMembership.status) {
          case 'Active':
          case 'Expired':
            membershipType = 'membership-renew';
            break;
          case 'NotAMember':
            membershipType = 'membership-new';
            break;
          case 'Terminated':
          case 'Resigned':
            membershipType = 'membership-renew';
            break;
          default:
            return prevState;
        }
        if (membershipType) {
          const updatedMembership = {
            ...prevState,
            type: membershipType,
            payment: update.payment,
          };
          onMembershipChange({
            field: 'membership',
            data: updatedMembership,
          });
          return updatedMembership;
        }
      }
      return prevState;
    });
  };

  const onDaAbroadSubmit = (update: Partial<Membership>) => {
    const updatedMembership = {
      ...membershipUpdate,
      ...update,
    };
    // setMembershipUpdate(updatedMembership);
    setBranchUpdate(updatedMembership);

    onMembershipChange({
      field: 'membership',
      data: updatedMembership,
    });
  };

  const handleBranchReset = () => {
    // do reset
    // console.log('handleBranchReset');
    onMembershipChange({
      field: 'membership',
      data: null,
    });
  };

  const handleBranchChange = (
    ward: string,
    votingDistrict_id: number,
    type: string,
    override?: boolean
  ) => {
    if (
      ward === null &&
      votingDistrict_id === null &&
      type === null &&
      override == null
    ) {
      handleBranchReset();
    }
    // console.log({ ward, votingDistrict_id, type, override });
    const updatedMembership = {
      type: 'membership-capture',
      daAbroad: false,
      branchOverride: override,
      structure: {
        ...(type.toLowerCase() === 'votingdistrict'
          ? { votingDistrict_id: Number(votingDistrict_id) }
          : {}),
        ...(type.toLowerCase() === 'ward' ? { ward: Number(ward) } : {}),
      },
    };

    setMembershipUpdate(updatedMembership);

    onMembershipChange({
      field: 'membership',
      data: updatedMembership,
    });
  };

  useCanvassFormReset(() => {
    setDaAbroadInternal(personMembership?.daAbroad);
    setDawnOptOutInternal(personMembership?.dawnOptOut);
    setYouth(personMembership?.daYouth);
    setIsPermissionChecked(
      personMembership?.branchOverride
        ? personMembership?.branchOverride
        : false
    );
  });

  const handleDelete = () => {
    setMembershipUpdate(null);
    handleMembershipActivation(null);
  };

  const handleEditModalToggle = () => {
    if (membershipUpdate.payment) {
      setIsActivationModalVisible(!isActivationModalVisible);
    }
    if (membershipUpdate.statusComments) {
      setIsCanellationModalVisible(!isCancellationModalVisible);
    }
  };

  const editButtons = (
    <>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem>
            <EuiButtonIcon
              iconType="pencil"
              aria-label="Edit"
              onClick={() => handleEditModalToggle()}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Delete"
              color="danger"
              onClick={handleDelete}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </>
  );

  useEffect(() => {
    if (branchUpdate === null && !membershipUpdate) {
      handleBranchReset();
    }
    if (membershipUpdate) {
      setMembershipUpdate(membershipUpdate);
    }
  }, [branchUpdate, membershipUpdate]);

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={2}>
          <MembershipPanel
            status={personMembership?.status}
            daYouth={youth}
            onDawnChange={onDawnChange}
            dawnOptOut={dawnOptOutInternal}
            onYouthChange={onYouthChange}
            expired={personMembership?.expiry}
            initialJoin={personMembership?.initialJoin}
            newRenewal={personMembership?.payment?.date}
            membershipNumber={personMembership?.payment?.membershipNumber}
            gender={person?.gender}
            dob={person?.dob}
            id_number={person?.idNumber}
            handleMembershipCancellation={handleMembershipCancellation}
            handleMembershipActivation={handleMembershipActivation}
            handleRecruitedPerson={setRecruitedPerson}
            isActivationModalVisible={isActivationModalVisible}
            setIsActivationModalVisible={setIsActivationModalVisible}
            isCancellationModalVisible={isCancellationModalVisible}
            setIsCanellationModalVisible={setIsCanellationModalVisible}
            membershipUpdate={membershipUpdate}
            onDaAbroadSubmit={onDaAbroadSubmit}
            handleBranchChange={handleBranchChange}
            isDaAbroadModalVisible={isDaAbroadModalVisible}
            setIsDaAbroadModalVisible={setIsDaAbroadModalVisible}
            isBranchOverrideModalVisible={isBranchOverrideModalVisible}
            setIsBranchOverrideModalVisible={setIsBranchOverrideModalVisible}
            overriddenBranchStructure={overriddenBranchStructure}
            setOverriddenBranchStructure={setOverriddenBranchStructure}
            setBranchUpdate={setBranchUpdate}
            isPermissionChecked={isPermissionChecked}
            setIsPermissionChecked={setIsPermissionChecked}
            isDaAbroadChecked={isDaAbroadChecked}
            setIsDaAbroadChecked={setIsDaAbroadChecked}
          />

          {membershipUpdate || personMembership?.status !== 'NotAMember' ? (
            <EuiFormFieldset legend={{ children: 'Branch Info' }}>
              <BranchInfo
                setIsDaAbroadModalVisible={setIsDaAbroadModalVisible}
                setIsBranchOverrideModalVisible={
                  setIsBranchOverrideModalVisible
                }
                selectAddress={selectAddress}
                branchUpdate={branchUpdate}
                setBranchUpdate={setBranchUpdate}
                overriddenBranchStructure={overriddenBranchStructure}
                setOverriddenBranchStructure={setOverriddenBranchStructure}
                setIsPermissionChecked={setIsPermissionChecked}
                isPermissionChecked={isPermissionChecked}
                setIsDaAbroadChecked={setIsDaAbroadChecked}
                handleBranchChange={handleBranchChange}
                isBranchOverrideModalVisible={isBranchOverrideModalVisible}
              />
            </EuiFormFieldset>
          ) : null}

          <EuiSpacer size="m" />
          {membershipUpdate?.payment && !membershipUpdate?.statusComments && (
            <EuiFormFieldset legend={{ children: 'Payment Information' }}>
              <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                <EuiFlexItem>
                  <EuiFlexGrid columns={2} gutterSize="s">
                    <EuiText size="s">Membership Number:</EuiText>
                    <strong>{membershipUpdate.payment.membershipNumber}</strong>
                    <EuiText size="s">Date:</EuiText>
                    <strong>
                      {moment(membershipUpdate.payment.date).format(
                        'YYYY/MM/DD'
                      )}
                    </strong>
                    <EuiText size="s">Amount:</EuiText>
                    <strong>R {membershipUpdate.payment.amount}</strong>
                    <EuiText size="s">Years:</EuiText>
                    <strong>
                      {membershipUpdate.payment.years}{' '}
                      {membershipUpdate.payment.years === 1 ? 'year' : 'years'}
                    </strong>
                    <EuiText size="s">Type:</EuiText>
                    <strong>{membershipUpdate.payment.type}</strong>

                    <EuiText size="s">Recruited By:</EuiText>
                    <strong>
                      {recruitedPerson?.givenName} {recruitedPerson?.surname}
                    </strong>
                  </EuiFlexGrid>
                </EuiFlexItem>
                {editButtons}
              </EuiFlexGroup>
            </EuiFormFieldset>
          )}
          {membershipUpdate?.statusComments && (
            <EuiFormFieldset legend={{ children: 'Cancellation Information' }}>
              <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                <EuiFlexItem>
                  <EuiFlexGrid columns={2} gutterSize="s">
                    <EuiText size="s">Type:</EuiText>
                    <strong>
                      {getCancellationTypeLabel(membershipUpdate?.type)}
                    </strong>
                    <EuiText size="s">Reason / Comment</EuiText>
                    <strong>{membershipUpdate?.statusComments}</strong>
                  </EuiFlexGrid>
                </EuiFlexItem>
                {editButtons}
              </EuiFlexGroup>
            </EuiFormFieldset>
          )}
        </EuiFlexItem>

        <EuiFlexItem grow={1}>
          <EuiFormFieldset legend={{ children: 'Membership Events' }}>
            <MembershipEvents personKey={person?.key} />
          </EuiFormFieldset>

          <EuiSpacer size="m" />

          <EuiFormFieldset legend={{ children: 'Membership Comments' }}>
            <Comments
              comments={person?.comments}
              onMembershipCommentChange={onMembershipChange}
            />
          </EuiFormFieldset>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default MembershipOld;

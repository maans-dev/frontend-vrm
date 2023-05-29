import { FunctionComponent, useEffect, useState } from 'react';
import MembershipPanel from './membership-panel';
import MembershipEvents from '@components/membership-history';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiSpacer,
} from '@elastic/eui';
import BranchInfo from './branch-info';
import MemberManagementButtons from './membership-buttons';
import Comments from '@components/comments';
import { Comment, Structure } from '@lib/domain/person';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';

export interface Props {
  status: string;
  id_number: string;
  darn: number;
  selectAddress: (tabIndex: number) => void;
  daAbroad: boolean;
  daYouth: boolean;
  dawnOptOut: boolean;
  expired: string;
  initialJoin: string;
  newRenewal: string;
  membershipNumber: string;
  comments: Comment[];
  onMembershipChange: (update) => void;
  gender: string;
  dob: string;
  abroadCountry: string | null;
  branchOverride: boolean;
  membershipStructure: Partial<Structure>;
}

const Membership: FunctionComponent<Props> = ({
  id_number,
  darn,
  status,
  selectAddress,
  daAbroad,
  daYouth,
  dawnOptOut,
  expired,
  initialJoin,
  newRenewal,
  membershipNumber,
  comments,
  onMembershipChange,
  gender,
  dob,
  abroadCountry,
  branchOverride,
  membershipStructure,
}) => {
  const [daAbroadInternal, setDaAbroadInternal] = useState(Boolean(daAbroad));
  const [selectedCountry, setSelectedCountry] = useState<string>(null);
  const [dawnOptOutInternal, setDawnOptOutInternal] = useState(dawnOptOut);
  const [youth, setYouth] = useState(daYouth);
  const [override, setOverride] = useState(
    branchOverride ? branchOverride : false
  );

  useEffect(() => {
    if (override) {
      setDaAbroadInternal(!override);
    }
  }, [override]);

  useEffect(() => {
    if (selectedCountry && daAbroadInternal == true) {
      onMembershipChange({
        field: 'membership',
        data: {
          type: 'membership-capture',
          daAbroad: true,
          branchOverride: false,
          structure: {
            country_code: selectedCountry['country_code'],
          },
        },
      });
    }
    if (daAbroadInternal) {
      setOverride(!daAbroadInternal);
    }
  }, [selectedCountry, daAbroadInternal]);

  const onYouthChange = () => {
    setYouth(prevYouth => !prevYouth);
    if (youth === daYouth) {
      onMembershipChange({
        field: 'membership',
        data: {
          type: 'membership-capture',
          daYouth: !youth,
        },
      });
    }
    if (youth !== daYouth) {
      onMembershipChange({
        field: 'membership',
        data: {
          type: 'membership-capture',
          ...(youth ? { daYouth: !youth } : {}),
        },
      });
    }
  };

  const onDawnChange = () => {
    setDawnOptOutInternal(prev => !prev);
    if (dawnOptOutInternal === dawnOptOut) {
      onMembershipChange({
        field: 'membership',
        data: {
          type: 'membership-capture',
          dawnOptOut: !dawnOptOutInternal,
        },
      });
    }
    if (dawnOptOutInternal !== dawnOptOut) {
      onMembershipChange({
        field: 'membership',
        data: {
          type: 'membership-capture',
          ...(dawnOptOutInternal ? { dawnOptOut: !dawnOptOutInternal } : {}),
        },
      });
    }
  };

  const handleCancelForm = update => {
    let data = null;

    switch (update.comments.type) {
      case 'membership-resigned':
        data = {
          type: 'membership-resigned',
          statusComments: update.comments.value,
        };
        break;
      case 'membership-terminated':
        data = {
          type: 'membership-terminated',
          statusComments: update.comments.value,
        };
        break;
      default:
        break;
    }

    onMembershipChange({
      field: 'membership',
      data: null,
    });

    if (data) {
      onMembershipChange({
        field: 'membership',
        data,
      });
    }
  };

  const handleMembershipStatus = update => {
    const payment = update.payment;
    let membershipType;

    switch (status) {
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
        return;
    }

    onMembershipChange({
      field: 'membership',
      data: {
        type: membershipType,
        payment: payment,
      },
    });
  };

  const handleBranchChange = (ward, votingDistrict_id, type) => {
    // console.log('handleBranchChange', {
    //   ward,
    //   votingDistrict_id,
    //   type,
    //   override,
    //   branchOverride,
    // });
    onMembershipChange({
      field: 'membership',
      data: {
        type: 'membership-capture',
        daAbroad: false,
        branchOverride: override,
        structure: {
          ...(type.toLowerCase() === 'votingdistrict'
            ? { votingDistrict_id: Number(votingDistrict_id) }
            : {}),
          ...(type.toLowerCase() === 'ward' ? { ward: Number(ward) } : {}),
        },
      },
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

  const handleSelectCountry = (country_code: string) => {
    setSelectedCountry(country_code);
  };

  const handleAbroadChange = update => {
    setDaAbroadInternal(update);
  };

  useCanvassFormReset(() => {
    setDaAbroadInternal(daAbroad);
    setDawnOptOutInternal(dawnOptOut);
    setYouth(daYouth);
    setOverride(branchOverride ? branchOverride : false);
  });

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={2}>
          <EuiFormFieldset legend={{ children: 'Membership Info' }}>
            <MembershipPanel
              status={status}
              onAbroadChange={handleAbroadChange}
              daAbroadInternal={daAbroadInternal}
              daYouth={youth}
              onDawnChange={onDawnChange}
              dawnOptOut={dawnOptOutInternal}
              onYouthChange={onYouthChange}
              expired={expired}
              initialJoin={initialJoin}
              newRenewal={newRenewal}
              membershipNumber={membershipNumber}
              gender={gender}
              dob={dob}
            />
          </EuiFormFieldset>

          <EuiSpacer size="m" />

          <EuiFormFieldset legend={{ children: 'Branch Info' }}>
            <BranchInfo
              status={status}
              membershipStructure={membershipStructure}
              selectAddress={selectAddress}
              isDaAbroadSelected={daAbroadInternal}
              onCountrySelect={handleSelectCountry}
              handleBranchChange={handleBranchChange}
              abroadCountry={abroadCountry}
              branchOverride={override}
              onBranchOverride={setOverride}
              onBranchReset={handleBranchReset}
            />
          </EuiFormFieldset>

          <EuiSpacer size="m" />

          <EuiFlexGroup>
            <EuiFlexItem grow={true}>
              <MemberManagementButtons
                status={status}
                id_number={id_number}
                handleMembershipStatus={handleMembershipStatus}
                handleCancelForm={handleCancelForm}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={1}>
          <EuiFormFieldset legend={{ children: 'Membership Events' }}>
            <MembershipEvents personKey={darn} />
          </EuiFormFieldset>

          <EuiSpacer size="m" />

          <EuiFormFieldset legend={{ children: 'Membership Comments' }}>
            <Comments
              comments={comments}
              onMembershipCommentChange={onMembershipChange}
            />
          </EuiFormFieldset>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default Membership;

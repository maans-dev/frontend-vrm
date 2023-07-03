import { CanvassingContext } from '@lib/context/canvassing.context';
import {
  Membership,
  MembershipPayment,
  Person,
  ProvinceEnum,
  Structure,
} from '@lib/domain/person';
import {
  PersonUpdate,
  GeneralUpdate,
  MembershipUpdate,
} from '@lib/domain/person-update';
import { StructureType } from '@lib/domain/stuctures';
import useCountryFetcher from '@lib/fetcher/countries/countries';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';

export interface Branch {
  label: string | React.ReactNode;
  description: string | React.ReactNode;
  showConfirmCallout: boolean;
  structure: Partial<Structure>;
}

export interface CancellationInfo {
  type: 'membership-terminated' | 'membership-resigned';
  comment: string;
}

export type MembershipContextType = {
  person: Partial<Person>;
  onSelectAddressTab: () => void;
  personAge: number;
  membership: Membership;
  statusColour: string;
  isDawnOptOutSelected: boolean;
  setIsDawnOptOutSelected: (selected: boolean) => void;
  isDaYouthSelected: boolean;
  setIsDaYouthSelected: (selected: boolean) => void;
  hasBranchOverride: boolean;
  isBranchOverrideSelected: boolean;
  setIsBranchOverrideSelected: (selected: boolean) => void;
  onSelectBranchOverride: () => void;
  onDeleteBranchOverride: () => void;
  showBranchOverrideModal: boolean;
  setShowBranchOverrideModal: (show: boolean) => void;
  hasDaAbroad: boolean;
  isDaAbroadSelected: boolean;
  onSelectDaAbroad: () => void;
  onDeleteDaAbroad: () => void;
  setIsDaAbroadSelected: (selected: boolean) => void;
  membershipBranch: Partial<Structure>;
  personStructure: Partial<Structure>;
  branch: Branch;
  showDaAbroadModal: boolean;
  setShowDaAbroadModal: (show: boolean) => void;
  updatedBranch: Branch;
  setUpdatedBranch: (branch: Branch) => void;
  canEditBranch: boolean;
  canDeleteBranch: boolean;
  getStructureDescription: (structure: Partial<Structure>) => string;
  showMembershipInfo: boolean;
  onActivate: () => void;
  onRenew: () => void;
  onCancel: () => void;
  isActivationModalVisible: boolean;
  isRenewModalVisible: boolean;
  isCancelModalVisible: boolean;
  setIsActivationModalVisible: (show: boolean) => void;
  setIsRenewModalVisible: (show: boolean) => void;
  setIsCancelModalVisible: (show: boolean) => void;
  onSavePayment: (payment: MembershipPayment) => void;
  payment: MembershipPayment;
  setPayment: (payment: MembershipPayment) => void;
  updateType: string;
  setUpdateType: (string) => void;
  cancellationInfo: CancellationInfo;
  setCancellationInfo: (info: CancellationInfo) => void;
  onChange: (update: PersonUpdate<GeneralUpdate>) => void;
  hasRole: (role: Roles) => boolean;
};

export const MembershipContext = createContext<Partial<MembershipContextType>>(
  {}
);

const MembershipProvider: FunctionComponent<
  Pick<MembershipContextType, 'person' | 'onSelectAddressTab'>
> = ({ children, person, onSelectAddressTab }) => {
  const { setUpdatePayload, data: contextData } = useContext(CanvassingContext);
  const { data: session } = useSession();
  const hasRole = (role: string) =>
    hasRoleUtil(role, session?.user?.roles, false);

  const onChange = (update: PersonUpdate<MembershipUpdate>) => {
    if (update.field === 'comments') {
      update.data.type = 'membership';
    } else {
      update.data.type = updateType;
    }
    setUpdatePayload(update);
  };

  const membership = person?.membership;
  const personAge = moment().diff(moment(person.dob), 'years');
  const [membershipBranch, setMembershipBranch] = useState(
    membership?.structure
  );

  const [personStructure, setPersonStructure] = useState(
    person?.address?.structure
  );

  const { countries } = useCountryFetcher(
    membershipBranch?.type === 'COUNTRY' ? membershipBranch.country_code : null
  );

  const [isDaYouthSelected, setIsDaYouthSelected] = useState(
    membership?.daYouth
  );

  const [branch, setBranch] = useState<Branch>(null);

  const [updatedBranch, setUpdatedBranch] = useState<Branch>(null);

  const [hasBranchOverride, setHasBranchOverride] = useState(
    hasRole(Roles.MembershipAdmin)
  );

  const [isBranchOverrideSelected, setIsBranchOverrideSelected] = useState(
    membership?.branchOverride === true
  );

  const [canEditBranch, setCanEditBranch] = useState(false);
  const [canDeleteBranch, setCanDeleteBranch] = useState(false);

  const onSelectBranchOverride = () => {
    onDeleteDaAbroad();
    setIsBranchOverrideSelected(true);
    setShowBranchOverrideModal(true);
  };

  const onDeleteBranchOverride = () => {
    // setPersonStructure(undefined);
    setIsBranchOverrideSelected(false);
    setUpdatedBranch(undefined);
    setBranch(undefined);
  };

  const [showBranchOverrideModal, setShowBranchOverrideModal] = useState(false);

  const [hasDaAbroad, setHasDaAbroad] = useState(true);

  const [isDaAbroadSelected, setIsDaAbroadSelected] = useState(
    membership?.daAbroad === true
  );

  const [isDawnOptOutSelected, setIsDawnOptOutSelected] = useState(
    membership?.dawnOptOut
  );

  const [statusColour, setStatusColour] = useState(() => {
    switch (person.membership.status) {
      case null:
      case 'NotAMember':
        return 'subdued';
      case 'Resigned':
      case 'Terminated':
        return 'warning';
      case 'Expired':
        return 'danger';
      case 'Active':
        return 'success';
      default:
        return '';
    }
  });

  const [showDaAbroadModal, setShowDaAbroadModal] = useState(false);

  const onSelectDaAbroad = () => {
    onDeleteBranchOverride();
    setIsDaAbroadSelected(true);
    setShowDaAbroadModal(true);
  };

  const onDeleteDaAbroad = () => {
    // setMembershipBranch(undefined);
    setIsDaAbroadSelected(false);
    setUpdatedBranch(undefined);
    setBranch(undefined);
  };

  const [showMembershipInfo, setShowMembershipInfo] = useState(false);
  const [isActivationModalVisible, setIsActivationModalVisible] =
    useState(false);
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  const onActivate = () => {
    setIsActivationModalVisible(true);
  };

  const onRenew = () => {
    setIsRenewModalVisible(true);
  };

  const onCancel = () => {
    setIsCancelModalVisible(true);
  };

  const [payment, setPayment] = useState<MembershipPayment>();
  const onSavePayment = (payment: MembershipPayment) => {
    setPayment(payment);
    setCancellationInfo(undefined);
  };

  const [updateType, setUpdateType] = useState('membership-capture');
  const [cancellationInfo, setCancellationInfo] = useState<CancellationInfo>();

  const getStructureDescription = (structure: Partial<Structure>) => {
    let description: string = StructureType.Unkown;
    const getProvince = (structure: Partial<Structure>) => {
      if ('province' in structure) return structure.province;
      if ('province_enum' in structure)
        return ProvinceEnum[structure.province_enum];
      return 'Unknown';
    };
    switch (structure.type.toLowerCase() as StructureType) {
      case StructureType.Constituency:
        description = `Constiteuncy, ${getProvince(structure)}`;
        break;
      case StructureType.Province:
        description = `Province, ${getProvince(structure)}`;
        break;
      case StructureType.Municipality:
        description = `Municipality, ${getProvince(structure)}`;
        break;
      case StructureType.Region:
        description = `Region, ${getProvince(structure)}`;
        break;
      case StructureType.VotingDistrict:
        description = `Voting district, ${getProvince(structure)}`;
        break;
      case StructureType.Ward:
        description = `Ward, ${getProvince(structure)}`;
        break;
    }
    return description;
  };

  useCanvassFormReset(() => {
    setMembershipBranch(membership?.structure);
    setPersonStructure(person?.address?.structure);
    setIsDaYouthSelected(membership?.daYouth);
    // setBranch(null);
    // setUpdatedBranch(null);
    setHasBranchOverride(hasRole(Roles.MembershipAdmin));
    setIsBranchOverrideSelected(membership?.branchOverride === true);
    setCanEditBranch(false);
    setCanDeleteBranch(false);
    setHasDaAbroad(true);
    setIsDaAbroadSelected(membership?.daAbroad === true);
    setIsDawnOptOutSelected(membership?.dawnOptOut);
    // setShowMembershipInfo(false);
    setPayment(null);
    setUpdateType('membership-capture');
    setCancellationInfo(null);
  });

  // handle reload
  useEffect(() => {
    setMembershipBranch(membership?.structure);
    setPersonStructure(person?.address?.structure);
    setIsDaYouthSelected(membership?.daYouth);
    setBranch(null);
    setUpdatedBranch(null);
    setHasBranchOverride(hasRole(Roles.MembershipAdmin));
    setIsBranchOverrideSelected(membership?.branchOverride === true);
    setCanEditBranch(false);
    setCanDeleteBranch(false);
    setHasDaAbroad(true);
    setIsDaAbroadSelected(membership?.daAbroad === true);
    setIsDawnOptOutSelected(membership?.dawnOptOut);
    setShowMembershipInfo(false);
    setPayment(null);
    setUpdateType('membership-capture');
    setCancellationInfo(null);
    setStatusColour(() => {
      switch (person.membership.status) {
        case null:
        case 'NotAMember':
          return 'subdued';
        case 'Resigned':
        case 'Terminated':
          return 'warning';
        case 'Expired':
          return 'danger';
        case 'Active':
          return 'success';
        default:
          return '';
      }
    });
  }, [person]);

  useEffect(() => {
    setShowMembershipInfo(
      (typeof updatedBranch === 'undefined' && typeof branch === 'undefined') ||
        (membership?.status && membership?.status !== 'NotAMember')
    );
  }, [membership?.status, updatedBranch, branch]);

  // Set default membership branch
  useEffect(() => {
    // Has a membership branch
    if (
      contextData?.address?.structure?.votingDistrict_id &&
      !contextData?.address?.structure?.deleted &&
      !isBranchOverrideSelected
    ) {
      setUpdatedBranch({
        label: `${contextData?.address?.votingDistrict} (${contextData?.address?.structure?.votingDistrict_id})`,
        description: `Voting district, ${contextData?.address?.province}`,
        showConfirmCallout: true,
        structure: contextData?.address?.structure,
      });
      return;
    }

    if (
      contextData?.address?.structure?.deleted &&
      (!isBranchOverrideSelected || !isDaAbroadSelected)
    ) {
      setBranch(undefined);
      setUpdatedBranch(undefined);
      return;
    }

    if (membershipBranch?.key) {
      if (membershipBranch.type === 'COUNTRY' && isDaAbroadSelected) {
        setBranch({
          label: countries?.[0]?.country || membershipBranch?.country_code,
          description: '',
          showConfirmCallout: false,
          structure: membershipBranch,
        });
        return;
      } else {
        if (
          membershipBranch.type !== 'COUNTRY' &&
          membershipBranch?.votingDistrict_id ===
            personStructure?.votingDistrict_id &&
          !contextData?.address?.structure?.deleted
        ) {
          setBranch({
            label:
              membershipBranch.type.toLowerCase() === 'ward'
                ? membershipBranch.formatted
                : `${membershipBranch.votingDistrict} (${membershipBranch.votingDistrict_id})`,
            description: getStructureDescription(membershipBranch),
            showConfirmCallout: false,
            structure: membershipBranch,
          });
          return;
        }

        if (
          membershipBranch.type !== 'COUNTRY' &&
          membershipBranch?.votingDistrict_id !==
            personStructure?.votingDistrict_id &&
          isBranchOverrideSelected
        ) {
          setBranch({
            label:
              membershipBranch.type.toLowerCase() === 'ward'
                ? membershipBranch.formatted
                : `${membershipBranch.votingDistrict} (${membershipBranch.votingDistrict_id})`,
            description: getStructureDescription(membershipBranch),
            showConfirmCallout: false,
            structure: membershipBranch,
          });
          return;
        }

        // fallback
        setBranch(undefined);
        if (personStructure?.key && !contextData?.address?.structure?.deleted) {
          // has a person structure so set it as the updated branch to force a save
          setUpdatedBranch({
            label:
              personStructure.type.toLowerCase() === 'ward'
                ? personStructure.formatted
                : `${personStructure.votingDistrict} (${personStructure.votingDistrict_id})`,
            description: getStructureDescription(personStructure),
            showConfirmCallout: true,
            structure: personStructure,
          });
          return;
        }
        if (
          contextData?.address?.structure?.votingDistrict_id &&
          !contextData?.address?.structure?.deleted
        ) {
          // has a person structure so set it as the updated branch to force a save
          setUpdatedBranch({
            label: `${contextData?.address?.votingDistrict} (${contextData?.address?.structure?.votingDistrict_id})`,
            description: `Voting district, ${contextData?.address?.province}`,
            showConfirmCallout: true,
            structure: contextData?.address?.structure,
          });
        }
        return;
      }
    }

    // no membership branch
    if (!membershipBranch?.key) {
      if (personStructure?.key) {
        // has a person structure so set it as the updated branch to force a save
        setUpdatedBranch({
          label: `${personStructure.votingDistrict} (${personStructure.votingDistrict_id})`,
          description: getStructureDescription(personStructure),
          showConfirmCallout: true,
          structure: personStructure,
        });
      }
      if (contextData?.address?.structure?.votingDistrict_id) {
        // has a person structure so set it as the updated branch to force a save
        setUpdatedBranch({
          label: `${contextData?.address?.votingDistrict} (${contextData?.address?.structure?.votingDistrict_id})`,
          description: `Voting district, ${contextData?.address?.province}`,
          showConfirmCallout: true,
          structure: contextData?.address?.structure,
        });
      }
    }
  }, [
    // branch,
    membershipBranch,
    personStructure,
    countries,
    isDaAbroadSelected,
    isBranchOverrideSelected,
    contextData?.address?.structure,
    contextData?.address?.structure?.deleted,
  ]);

  // Handle branch editable/deletable
  useEffect(() => {
    if (
      updatedBranch &&
      updatedBranch?.structure?.type !== 'COUNTRY' &&
      !isBranchOverrideSelected
    ) {
      setCanEditBranch(false);
      setCanDeleteBranch(false);
      return;
    }

    if (
      (branch &&
        branch?.structure?.type !== 'COUNTRY' &&
        isBranchOverrideSelected) ||
      (updatedBranch &&
        updatedBranch?.structure?.type !== 'COUNTRY' &&
        isBranchOverrideSelected)
    ) {
      setCanEditBranch(true);
      if (
        updatedBranch &&
        updatedBranch?.structure?.votingDistrict_id !==
          personStructure?.votingDistrict_id
      ) {
        setCanDeleteBranch(true);
      } else {
        setCanDeleteBranch(false);
      }
      return;
    }

    if (
      (branch && branch?.structure?.type === 'COUNTRY' && isDaAbroadSelected) ||
      (updatedBranch &&
        updatedBranch?.structure?.type === 'COUNTRY' &&
        isDaAbroadSelected)
    ) {
      setCanEditBranch(true);
      if (updatedBranch) {
        setCanDeleteBranch(true);
      } else {
        setCanDeleteBranch(false);
      }
      return;
    }

    setCanEditBranch(false);
    setCanDeleteBranch(false);
  }, [
    branch,
    isBranchOverrideSelected,
    isDaAbroadSelected,
    updatedBranch,
    personStructure,
  ]);

  // Handle branch update payload
  useEffect(() => {
    if (!updatedBranch || !updatedBranch?.structure) return;

    if (updatedBranch.structure?.type === 'COUNTRY') {
      if (
        membership?.structure?.country_code !==
        updatedBranch?.structure?.country_code
      ) {
        onChange({
          field: 'membership',
          data: {
            daAbroad: isDaAbroadSelected,
            branchOverride: hasRole(Roles.MembershipAdmin)
              ? isBranchOverrideSelected
              : null,
            structure: {
              country_code: updatedBranch?.structure?.country_code,
            },
          },
        });
      }
      return;
    }

    if (
      membership?.structure?.votingDistrict_id !==
      updatedBranch?.structure?.votingDistrict_id
    ) {
      onChange({
        field: 'membership',
        data: {
          daAbroad: isDaAbroadSelected,
          branchOverride: hasRole(Roles.MembershipAdmin)
            ? isBranchOverrideSelected
            : null,
          structure: {
            ...(updatedBranch?.structure?.type?.toLowerCase() === 'ward'
              ? { ward: +updatedBranch.structure.ward }
              : {
                  votingDistrict_id: +updatedBranch.structure.votingDistrict_id,
                }),
          },
        },
      });
    }
  }, [membership?.structure?.votingDistrict_id, updatedBranch]);

  // Handle payment update payload
  useEffect(() => {
    if (!payment) {
      onChange({
        field: 'membership',
        data: {
          payment: undefined,
        },
      });
      return;
    }

    const updatedPayment = {
      ...payment,
    };

    if ((payment?.recruitedBy as Partial<Person>)?.key) {
      updatedPayment.recruitedBy = (payment.recruitedBy as Partial<Person>).key;
    }

    onChange({
      field: 'membership',
      data: {
        payment: updatedPayment,
      },
    });
  }, [payment]);

  // Handle cancellation update payload
  useEffect(() => {
    if (!cancellationInfo) {
      onChange({
        field: 'membership',
        data: {
          statusComments: undefined,
        },
      });
      return;
    }

    onChange({
      field: 'membership',
      data: {
        statusComments: cancellationInfo.comment,
      },
    });
  }, [cancellationInfo]);

  // debug output
  useEffect(() => {
    console.log('[MEMBERSHIP CONTEXT]', {
      // person,
      membership,
      membershipBranch,
      canEditBranch,
      canDeleteBranch,
      updateType,
      // personAge,
      isBranchOverrideSelected,
      isDaAbroadSelected,
      branch,
      updatedBranch,
      personStructure,
      payment,
      cancellationInfo,
      isDaYouthSelected,
      isDawnOptOutSelected,
      hasDaAbroad,
      hasBranchOverride,
    });
  }, [
    membership,
    person,
    personAge,
    branch,
    updatedBranch,
    membershipBranch,
    canEditBranch,
    canDeleteBranch,
    isBranchOverrideSelected,
    isDaAbroadSelected,
    personStructure,
    payment,
    updateType,
    cancellationInfo,
    isDaYouthSelected,
    isDawnOptOutSelected,
    hasDaAbroad,
    hasBranchOverride,
    contextData?.address?.structure,
  ]);

  return (
    <MembershipContext.Provider
      value={{
        person,
        onSelectAddressTab,
        membership,
        statusColour,
        personAge,
        isDawnOptOutSelected,
        setIsDawnOptOutSelected,
        isDaYouthSelected,
        setIsDaYouthSelected,
        hasBranchOverride,
        isBranchOverrideSelected,
        setIsBranchOverrideSelected,
        onSelectBranchOverride,
        onDeleteBranchOverride,
        showBranchOverrideModal,
        setShowBranchOverrideModal,
        hasDaAbroad,
        isDaAbroadSelected,
        setIsDaAbroadSelected,
        membershipBranch,
        personStructure,
        branch,
        showDaAbroadModal,
        setShowDaAbroadModal,
        updatedBranch,
        setUpdatedBranch,
        onDeleteDaAbroad,
        onSelectDaAbroad,
        canEditBranch,
        canDeleteBranch,
        getStructureDescription,
        showMembershipInfo,
        onActivate,
        onRenew,
        onCancel,
        isActivationModalVisible,
        isRenewModalVisible,
        isCancelModalVisible,
        setIsActivationModalVisible,
        setIsRenewModalVisible,
        setIsCancelModalVisible,
        onSavePayment,
        payment,
        setPayment,
        setUpdateType,
        cancellationInfo,
        setCancellationInfo,
        onChange,
        hasRole,
      }}>
      {children}
    </MembershipContext.Provider>
  );
};

export default MembershipProvider;

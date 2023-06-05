import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiLink,
  EuiCallOut,
  EuiButtonIcon,
} from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { Membership, Structure } from '@lib/domain/person';
import useCountryFetcher from '@lib/fetcher/countries/countries';
import { getStructureDescription } from '@lib/structure/utils';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
export interface Props {
  setIsDaAbroadModalVisible: (value: boolean) => void;
  selectAddress: (tabIndex: number) => void;
  branchUpdate: Partial<Membership>;
  setBranchUpdate: (update: Partial<Membership>) => void;
  overriddenBranchStructure: Partial<Structure>;
  setIsBranchOverrideModalVisible: (value: boolean) => void;
  setOverriddenBranchStructure: (update: Partial<Structure>) => void;
  setIsPermissionChecked: (value: boolean) => void;
  isPermissionChecked: boolean;
  setIsDaAbroadChecked: (value: boolean) => void;
  handleBranchChange: (
    ward: string | number,
    votingDistrict_id: string | number,
    type: string,
    override?: boolean
  ) => void;
  isBranchOverrideModalVisible: boolean;
}

interface BranchInfoProps {
  label: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const BranchInfo: FunctionComponent<Props> = ({
  selectAddress,
  setIsDaAbroadModalVisible,
  branchUpdate,
  setBranchUpdate,
  overriddenBranchStructure,
  setIsBranchOverrideModalVisible,
  setOverriddenBranchStructure,
  setIsPermissionChecked,
  isPermissionChecked,
  handleBranchChange,
  setIsDaAbroadChecked,
  isBranchOverrideModalVisible,
}) => {
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [branchLable, setBranchLable] = useState<string>(null);
  const [branchDescription, setBranchDescription] = useState<string>(null);
  const { person: originalPerson } = useContext(CanvassingContext);
  const { countries } = useCountryFetcher(countryCode);

  const handleEditCountryCode = () => {
    setIsDaAbroadModalVisible(true);
  };

  const handleDeleteCountryCode = () => {
    setBranchUpdate(null);
    setIsDaAbroadChecked(false);
  };

  const handleEditBranchOverride = () => {
    setIsBranchOverrideModalVisible(true);
  };

  const handleDeleteBranchOverride = () => {
    setOverriddenBranchStructure(null);
    setIsPermissionChecked(false);
    setBranchUpdate(null);
  };

  const BranchInfo: FunctionComponent<BranchInfoProps> = ({
    label,
    description,
    onEdit,
    onDelete,
  }) => (
    <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
      <EuiFlexItem grow={false}>
        <EuiFlexGroup direction="column" gutterSize="xs">
          <EuiFlexItem>
            <EuiText size="s" color="primary">
              <strong>{label}</strong>
            </EuiText>
          </EuiFlexItem>
          {description && (
            <EuiFlexItem>
              <EuiText size="s">
                <strong>{description}</strong>
              </EuiText>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem>
            <EuiButtonIcon
              iconType="pencil"
              aria-label="Edit"
              onClick={onEdit}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Delete"
              color="danger"
              onClick={onDelete}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const renderBranchChanges = () => {
    if (branchUpdate?.daAbroad) {
      return (
        <BranchInfo
          label={countryName}
          onEdit={handleEditCountryCode}
          onDelete={handleDeleteCountryCode}
        />
      );
    }
    if (overriddenBranchStructure && !branchUpdate?.daAbroad) {
      return (
        <BranchInfo
          label={branchLable}
          description={branchDescription}
          onEdit={handleEditBranchOverride}
          onDelete={handleDeleteBranchOverride}
        />
      );
    }
  };

  const defaultBranch = () => {
    //Person has no structure
    if (
      !originalPerson?.address?.structure.key &&
      !originalPerson?.membership?.structure.key &&
      !branchUpdate &&
      !overriddenBranchStructure
    ) {
      return (
        <>
          <EuiText size="s" color="danger">
            No geocoded address found.
          </EuiText>
          <EuiLink color="primary" onClick={() => selectAddress(1)}>
            <EuiText size="s">
              Add a geocoded address for this person here.
            </EuiText>
          </EuiLink>
        </>
      );
    }
    //Person has membership structure
    if (
      originalPerson?.membership?.structure?.key &&
      !branchUpdate &&
      !overriddenBranchStructure &&
      originalPerson?.membership?.branchOverride === true &&
      isPermissionChecked &&
      !isBranchOverrideModalVisible
    ) {
      return (
        <>
          <EuiText size="s" color="primary">
            <strong>
              {originalPerson?.membership?.structure?.votingDistrict} (
              {originalPerson?.membership?.structure?.votingDistrict_id})
            </strong>
          </EuiText>
          <EuiText size="s">
            <strong>
              {getStructureDescription(originalPerson?.membership?.structure)}
            </strong>
          </EuiText>
          <EuiSpacer size="xs" />
        </>
      );
    }
    //Person has no membership structure
    if (
      originalPerson?.address?.structure &&
      !originalPerson?.membership?.structure?.key &&
      !branchUpdate &&
      !overriddenBranchStructure &&
      !originalPerson?.membership?.daAbroad === true &&
      !isPermissionChecked
    ) {
      return (
        <>
          <EuiText size="s" color="primary">
            <strong>
              {originalPerson?.address?.structure?.votingDistrict} (
              {originalPerson?.address?.structure?.votingDistrict_id})
            </strong>
          </EuiText>
          <EuiText>
            <strong>
              {getStructureDescription(originalPerson?.address?.structure)}
            </strong>
          </EuiText>
          <EuiSpacer size="xs" />

          <EuiCallOut
            size="s"
            title="Please confirm branch by saving this record."
            color="warning"
            iconType="alert"
          />
        </>
      );
    }
    //Person is DA Abroad
    if (
      originalPerson?.address?.structure &&
      originalPerson?.membership?.structure?.key &&
      originalPerson?.membership?.daAbroad === true &&
      !branchUpdate &&
      !overriddenBranchStructure
    ) {
      return (
        <>
          <EuiText size="s">
            <strong>{countryName}</strong>
          </EuiText>
        </>
      );
    }
    //Da Abroad from payload is true but no membership structure
    if (
      originalPerson?.address?.structure &&
      !originalPerson?.membership?.structure?.key &&
      originalPerson?.membership?.daAbroad === true &&
      !branchUpdate &&
      !overriddenBranchStructure
    ) {
      return (
        <>
          <EuiText size="s" color="primary">
            <strong>
              {originalPerson?.address?.structure?.votingDistrict} (
              {originalPerson?.address?.structure?.votingDistrict_id})
            </strong>
          </EuiText>
          <EuiText>
            <strong>
              {getStructureDescription(originalPerson?.address?.structure)}
            </strong>
          </EuiText>
          <EuiSpacer size="xs" />

          <EuiCallOut
            size="s"
            title="Please confirm branch by saving this record."
            color="warning"
            iconType="alert"
          />
        </>
      );
    }
  };

  useEffect(() => {
    if (countries) {
      setCountryName(countries[0].country);
    }
    if (overriddenBranchStructure) {
      setBranchLable(
        `${overriddenBranchStructure.votingDistrict} (${overriddenBranchStructure.votingDistrict_id})`
      );
      setBranchDescription(getStructureDescription(overriddenBranchStructure));
    }
    if (!branchUpdate && originalPerson?.membership?.daAbroad === true) {
      setCountryCode(originalPerson?.membership?.structure?.country_code);
    }
    if (branchUpdate) {
      setCountryCode(branchUpdate?.structure?.country_code);
    }
    //If No Membership Branch set update
    if (
      originalPerson?.address?.structure.key &&
      !originalPerson?.membership?.key &&
      !branchUpdate &&
      !overriddenBranchStructure &&
      !originalPerson?.membership?.daAbroad === true &&
      !isPermissionChecked
    ) {
      handleBranchChange(
        originalPerson?.address?.structure?.ward?.toString(),
        originalPerson?.address?.structure?.votingDistrict_id?.toString(),
        originalPerson?.address?.structure?.type,
        isPermissionChecked
      );
    }
    if (
      originalPerson?.address?.structure &&
      !originalPerson?.membership?.structure?.key &&
      originalPerson?.membership?.daAbroad === true &&
      !branchUpdate &&
      !overriddenBranchStructure
    ) {
      handleBranchChange(
        originalPerson?.address?.structure?.ward?.toString(),
        originalPerson?.address?.structure?.votingDistrict_id?.toString(),
        originalPerson?.address?.structure?.type
      );
    }
  }, [
    branchUpdate,
    countries,
    isPermissionChecked,
    originalPerson?.address?.structure,
    originalPerson?.membership?.daAbroad,
    originalPerson?.membership?.key,
    originalPerson?.membership?.structure?.country_code,
    overriddenBranchStructure,
  ]);

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <p>Branch:</p>
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem>
          {renderBranchChanges()}
          {defaultBranch()}
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default BranchInfo;

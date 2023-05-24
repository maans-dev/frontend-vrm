import CountrySearch from '@components/country-search';
import Structres from '@components/structure-search';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiCheckbox,
  htmlIdGenerator,
  EuiLink,
  EuiCallOut,
} from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { Structure } from '@lib/domain/person';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { getStructureDescription } from '@lib/structure/utils';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
export interface Props {
  membershipStructure: Partial<Structure>;
  selectAddress: (tabIndex: number) => void;
  isDaAbroadSelected: boolean;
  onCountrySelect: (country_code: string) => void;
  handleBranchChange: (
    ward: string,
    votingDistrict_id: string,
    type: string
  ) => void;
  abroadCountry: string | null;
  branchOverride: boolean;
  onBranchOverride: (update) => void;
  onBranchReset: () => void;
}

const BranchInfo: FunctionComponent<Props> = ({
  selectAddress,
  isDaAbroadSelected,
  onCountrySelect,
  handleBranchChange,
  abroadCountry,
  branchOverride,
  onBranchOverride,
  membershipStructure,
  onBranchReset,
}) => {
  const [country, setCountry] = useState('');
  const { person: originalPerson } = useContext(CanvassingContext);
  const [personAddressStructure, setPersonAddressStructure] = useState<
    Partial<Structure>
  >(originalPerson?.address?.structure || null);
  const [overriddenBranchStructure, setOverriddenBranchStructure] =
    useState<Partial<Structure>>(null);
  const [branchLable, setBranchLable] = useState<string>(null);
  const [branchDescription, setBranchDescription] = useState<string>(null);
  const [personHasNoStructures, setPersonHasNoStructures] = useState(false);
  const [noMembershipStructure, setNoMembershipStructure] = useState(false);
  const [userHasSelectedDaAbroad, setUserHasSelectedDaAbroad] = useState(false);
  const [userHasDeselectedDaAbroad, setUserHasDeselectedDaAbroad] =
    useState(false);
  const [
    userHasDeselectedOverridePermission,
    setUserHasDeselectedOverridePermission,
  ] = useState(false);
  const [
    userHasSelectedOverridePermission,
    setUserHasSelectedOverridePermission,
  ] = useState(false);

  // console.log('BranchInfo debug', {
  //   country,
  //   abroadCountry,
  //   membershipStructure,
  //   personAddressStructure,
  //   personHasNoStructures,
  //   isDaAbroadSelected,
  //   noMembershipStructure,
  //   userHasSelectedDaAbroad,
  //   userHasDeselectedDaAbroad,
  //   overriddenBranchStructure,
  //   userHasSelectedOverridePermission,
  //   userHasDeselectedOverridePermission,
  // });

  useEffect(() => {
    // reset state & remove update payload
    onBranchReset();
    setBranchLable(null);
    setBranchDescription(null);
    setPersonHasNoStructures(false);
    setNoMembershipStructure(false);

    setUserHasSelectedDaAbroad(() => {
      return (
        originalPerson?.membership?.daAbroad === false &&
        isDaAbroadSelected === true
      );
    });

    setUserHasDeselectedDaAbroad(
      originalPerson?.membership?.daAbroad === true &&
        isDaAbroadSelected === false
    );

    setUserHasSelectedOverridePermission(
      originalPerson?.membership?.branchOverride === false &&
        branchOverride === true
    );

    setUserHasDeselectedOverridePermission(
      originalPerson?.membership?.branchOverride === true &&
        branchOverride === false
    );

    if (
      membershipStructure?.key &&
      !userHasSelectedDaAbroad &&
      !overriddenBranchStructure &&
      !userHasSelectedOverridePermission &&
      !userHasDeselectedOverridePermission &&
      !isDaAbroadSelected &&
      membershipStructure.votingDistrict_id
    ) {
      // has membership structure
      setBranchLable(
        `${membershipStructure.votingDistrict} (${membershipStructure.votingDistrict_id})`
      );

      setBranchDescription(getStructureDescription(membershipStructure));
      // console.log('DISPLAY membership structure');
      return;
    }

    if (
      !country &&
      isDaAbroadSelected &&
      membershipStructure.type === 'COUNTRY'
    ) {
      // is DA Abroad is selected and country is set
      setBranchLable(abroadCountry);
      setBranchDescription(null);
      // console.log('DISPLAY abroadCountry');
      return;
    }

    if (
      personAddressStructure?.key &&
      !overriddenBranchStructure &&
      !userHasSelectedOverridePermission &&
      !isDaAbroadSelected
    ) {
      // no membership structure but has an address structure
      setNoMembershipStructure(true);
      setBranchLable(
        `${personAddressStructure.votingDistrict} (${personAddressStructure.votingDistrict_id})`
      );

      setBranchDescription(getStructureDescription(personAddressStructure));

      // User is prompted to save here, so ensure the update payload is set.
      handleSelectStructure(
        personAddressStructure.ward.toString(), // TODO: point out this typeissue to DA
        personAddressStructure.votingDistrict_id.toString(), // TODO: point out this typeissue to DA
        personAddressStructure.type
      );
      // console.log('DISPLAY personAddressStructure');
      return;
    }

    if (overriddenBranchStructure && !userHasDeselectedOverridePermission) {
      // has selected an overridden structure
      setNoMembershipStructure(true);
      setBranchLable(
        `${overriddenBranchStructure.votingDistrict} (${overriddenBranchStructure.votingDistrict_id})`
      );

      setBranchDescription(getStructureDescription(overriddenBranchStructure));

      // User is prompted to save here, so ensure the update payload is set.
      handleSelectStructure(
        overriddenBranchStructure.ward.toString(), // TODO: point out this typeissue to DA
        overriddenBranchStructure.votingDistrict_id.toString(), // TODO: point out this typeissue to DA
        overriddenBranchStructure.type
      );
      // console.log('DISPLAY overriddenBranchStructure');
      return;
    }

    if (isDaAbroadSelected && country) {
      setBranchLable(country);
      setBranchDescription(null);
      // console.log('DISPLAY country');
      return;
    }

    // neither sttructure is present
    setPersonHasNoStructures(true);
    // console.log('DISPLAY no structures');
  }, [
    membershipStructure?.key,
    personAddressStructure?.key,
    isDaAbroadSelected,
    abroadCountry,
    userHasSelectedDaAbroad,
    userHasDeselectedDaAbroad,
    overriddenBranchStructure,
    branchOverride,
    userHasSelectedOverridePermission,
    userHasDeselectedOverridePermission,
    country,
  ]);

  useEffect(() => {
    setPersonAddressStructure(originalPerson?.address?.structure || null);
  }, [originalPerson?.address?.structure]);

  // Reset country when user selects Da Abroad
  useEffect(() => {
    if (userHasSelectedDaAbroad) setCountry('');
  }, [userHasSelectedDaAbroad]);

  useCanvassFormReset(() => {
    setOverriddenBranchStructure(null);
    setCountry('');
  });

  const handleSelectStructure = (
    ward: string,
    votingDistrict_id: string,
    type: string
  ) => {
    // console.log('handleSelectStructure', { ward, votingDistrict_id, type });

    handleBranchChange(ward, votingDistrict_id, type);
  };

  const handleSelectDaAbroadCountry = (label: string, country_code: string) => {
    // console.log('handleSelectDaAbroadCountry', label, country_code);
    setCountry(label);
    onCountrySelect(country_code);
  };

  const renderNoAddress = () => {
    if (!personHasNoStructures) return;

    if (userHasSelectedDaAbroad || isDaAbroadSelected) {
      return (
        <EuiText size="s" color="danger">
          Select a country
        </EuiText>
      );
    }

    if (userHasSelectedOverridePermission) {
      return (
        <EuiText size="s" color="danger">
          Select a voting district or ward
        </EuiText>
      );
    }

    return (
      <>
        <EuiText size="s" color="danger">
          No Address
        </EuiText>
        <EuiLink color="primary" onClick={() => selectAddress(1)}>
          <EuiText size="s">Add the address for this person here</EuiText>
        </EuiLink>
      </>
    );
  };

  const renderBranch = () => {
    if (personHasNoStructures) return;

    return (
      <>
        <EuiText size="s" color="primary">
          <strong>{branchLable}</strong>
        </EuiText>
        <EuiText>
          <strong>{branchDescription}</strong>
        </EuiText>
        <EuiSpacer size="xs" />
        {noMembershipStructure && (
          <EuiCallOut
            size="s"
            title="Please save member record to confirm branch"
            color="warning"
            iconType="alert"
          />
        )}
      </>
    );
  };

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <p>Branch:</p>
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiText size="s">
                <div
                  style={{ display: 'flex', flexDirection: 'column' }}
                  className="ward-text country-text">
                  {renderNoAddress()}
                  {renderBranch()}
                </div>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiCheckbox
        label={
          <EuiText size="s">
            <p style={{ whiteSpace: 'nowrap' }}>
              Permission to have a different branch given
            </p>
          </EuiText>
        }
        id={htmlIdGenerator()()}
        checked={branchOverride}
        onChange={() => {
          onBranchOverride(!branchOverride);
        }}
      />

      {branchOverride && !isDaAbroadSelected && (
        <>
          <EuiSpacer />
          <EuiFlexItem>
            <Structres
              onSelect={(lable, data) => setOverriddenBranchStructure(data)} // TODO: fix the typing here!
            />
          </EuiFlexItem>
          <EuiSpacer size="s" />
        </>
      )}

      {isDaAbroadSelected && !branchOverride && (
        <>
          <EuiSpacer />
          <CountrySearch onSelect={handleSelectDaAbroadCountry} />
          <EuiSpacer size="s" />
        </>
      )}
    </>
  );
};

export default BranchInfo;

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
} from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { Ward } from '@lib/domain/ward';
import { FunctionComponent, useContext, useEffect, useState } from 'react';

export interface Props {
  ward: Ward[];
  selectAddress: (tabIndex: number) => void;
  daAbroad: boolean;
  onCountrySelect: (country_code: string) => void;
  handleBranchChange: (
    ward: string,
    votingDistrict_id: string,
    type: string
  ) => void;
  abroadCountry: string | null;
  branchOverride: boolean;
  onBranchOverride: (update) => void;
}

const BranchInfo: FunctionComponent<Props> = ({
  ward,
  selectAddress,
  daAbroad,
  onCountrySelect,
  handleBranchChange,
  abroadCountry,
  branchOverride,
  onBranchOverride,
}) => {
  const [country, setCountry] = useState('');
  const [selectedVotingDistrictOrWard, setSelectedVotingDistrictOrWard] =
    useState(null);

  const { person: originalPerson } = useContext(CanvassingContext);

  const handleSelectStructure = (label, description, value) => {
    setSelectedVotingDistrictOrWard({ label, value });
    handleBranchChange(
      description.ward,
      description.votingDistrict_id,
      description.type
    );
  };

  const handleSelectCountry = (label: string, country_code: string) => {
    const countryTextElement = document.querySelector(
      '.country-text'
    ) as HTMLElement;

    if (countryTextElement) {
      countryTextElement.innerHTML = `
        <span>
          <EuiText size="s" color="primary">
            <strong>${label}</strong>
          </EuiText>
        </span>
      `;
    }
    onCountrySelect(country_code);
    setCountry(label);
  };

  const isAbroadCountryZa = abroadCountry === 'South Africa';
  const hasWard = ward !== null;
  const hasUserSelectedDaAbroad =
    originalPerson?.membership?.daAbroad === false && daAbroad === true;
  const hasUserDeselectedDaAbroad =
    originalPerson?.membership?.daAbroad === true && daAbroad === false;
  const hasUserSelectedBranchOverride =
    (!('branchOverride' in originalPerson?.membership) ||
      originalPerson.membership?.branchOverride) &&
    branchOverride === true;

  const renderBranch = () => {
    if (selectedVotingDistrictOrWard) {
      return (
        <EuiText size="s">
          <div
            style={{ display: 'flex', flexDirection: 'column' }}
            className="ward-text country-text">
            <span>
              <EuiText size="s" color="primary">
                <strong>{selectedVotingDistrictOrWard?.label}</strong>
              </EuiText>
            </span>
            <span style={{ marginTop: '4px' }}>
              <EuiText size="s" color="primary">
                <strong>{selectedVotingDistrictOrWard?.value}</strong>
              </EuiText>
            </span>
          </div>
        </EuiText>
      );
    }

    if (
      isAbroadCountryZa &&
      hasWard &&
      !hasUserSelectedDaAbroad &&
      !hasUserSelectedBranchOverride
    ) {
      return (
        <EuiText size="s">
          <div
            style={{ display: 'flex', flexDirection: 'column' }}
            className="ward-text country-text">
            <span>
              <EuiText size="s" color="primary">
                <strong>
                  {ward?.map(w => `${w.municipality} (${w.ward})`).join(', ')}
                </strong>
              </EuiText>
            </span>
            <span style={{ marginTop: '4px' }}>
              <EuiText size="s" color="primary">
                <strong>
                  {ward?.map(w => `Voting District, ${w.province}`)}
                </strong>
              </EuiText>
            </span>
          </div>
        </EuiText>
      );
    }
    if (!isAbroadCountryZa && daAbroad) {
      return (
        <EuiText size="s" color="primary">
          <strong>{abroadCountry}</strong>
        </EuiText>
      );
    }
    if (
      (!isAbroadCountryZa && !hasWard) ||
      (hasUserDeselectedDaAbroad && !hasUserSelectedBranchOverride)
    ) {
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
    }
    if (hasUserSelectedDaAbroad && !country) {
      return (
        <EuiText size="s" color="danger">
          Select a country
        </EuiText>
      );
    }
    if (country) {
      return (
        <EuiText size="s">
          <strong>{country}</strong>
        </EuiText>
      );
    }
    if (hasUserSelectedBranchOverride) {
      return (
        <EuiText size="s" color="danger">
          Select a Voting District or Ward
        </EuiText>
      );
    }
  };

  useEffect(() => {
    if (daAbroad) setSelectedVotingDistrictOrWard(null);
  }, [daAbroad]);

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
            <EuiFlexItem grow={false}>{renderBranch()}</EuiFlexItem>
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
          if (!!branchOverride) setSelectedVotingDistrictOrWard(null);
        }}
      />

      {branchOverride && !daAbroad && (
        <>
          <EuiSpacer />
          <EuiFlexItem>
            <Structres onSelect={handleSelectStructure} />
          </EuiFlexItem>
          <EuiSpacer size="s" />
        </>
      )}

      {daAbroad && !branchOverride && (
        <>
          <EuiSpacer />
          <CountrySearch onSelect={handleSelectCountry} />
          <EuiSpacer size="s" />
        </>
      )}
    </>
  );
};

export default BranchInfo;

import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiFlexGrid,
  EuiCheckableCard,
  htmlIdGenerator,
  EuiForm,
  EuiSpacer,
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCheckbox,
} from '@elastic/eui';
import moment from 'moment';
import CountrySearch from '@components/country-search';
import { Membership, Structure } from '@lib/domain/person';
import Structres from '@components/structure-search';
import { getStructureDescription } from '@lib/structure/utils';
import { CanvassingContext } from '@lib/context/canvassing.context';

export interface Props {
  onDawnChange: (update: boolean) => void;
  onYouthChange: (update: boolean) => void;
  daYouth: boolean;
  dawnOptOut: boolean;
  gender: string;
  dob: string;
  onDaAbroadSubmit: (update: Partial<Membership>) => void;
  handleBranchChange: (
    ward: string | number,
    votingDistrict_id: string | number,
    type: string,
    override: boolean
  ) => void;
  isDaAbroadModalVisible: boolean;
  setIsDaAbroadModalVisible: (value: boolean) => void;
  overriddenBranchStructure: Partial<Structure>;
  setOverriddenBranchStructure: (update: Partial<Structure>) => void;
  setIsBranchOverrideModalVisible: (value: boolean) => void;
  isBranchOverrideModalVisible: boolean;
  setIsPermissionChecked: (value: boolean) => void;
  isPermissionChecked: boolean;
  isDaAbroadChecked: boolean;
  setIsDaAbroadChecked: (value: boolean) => void;
  setBranchUpdate: (update: Partial<Membership>) => void;
}

const MembershipCheckbox: FunctionComponent<Props> = ({
  daYouth,
  dawnOptOut,
  onDawnChange,
  onYouthChange,
  gender,
  dob,
  onDaAbroadSubmit,
  handleBranchChange,
  isDaAbroadModalVisible,
  setIsDaAbroadModalVisible,
  overriddenBranchStructure,
  setOverriddenBranchStructure,
  isBranchOverrideModalVisible,
  setIsBranchOverrideModalVisible,
  setIsPermissionChecked,
  isPermissionChecked,
  isDaAbroadChecked,
  setIsDaAbroadChecked,
  setBranchUpdate,
}: Props) => {
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState();
  const [branchLable, setBranchLable] = useState<string>(null);
  const [branchDescription, setBranchDescription] = useState<string>(null);
  const { person: originalPerson } = useContext(CanvassingContext);
  const [branchOverrideInternal, setIsBranchOverrideInternal] = useState<
    Partial<Structure> | undefined
  >(undefined);

  const closeDaAbroadModal = () => {
    setIsDaAbroadModalVisible(false);
    if (isDaAbroadChecked && !country) setIsDaAbroadChecked(false);
  };

  const showDaAbroadModal = () => {
    if (isDaAbroadChecked) {
      setIsDaAbroadChecked(false);
      setIsDaAbroadModalVisible(true);
    }
    if (!isDaAbroadChecked) {
      setIsDaAbroadModalVisible(true);
      setIsDaAbroadChecked(true);
    }
  };

  const closeBranchOverrideModal = () => {
    setIsBranchOverrideModalVisible(false);
    if (!overriddenBranchStructure) {
      setIsPermissionChecked(false);
    }
  };

  const showBranchOverrideModal = () => {
    if (isPermissionChecked) setIsPermissionChecked(false);
    if (!isPermissionChecked) {
      setBranchUpdate(null);
      setIsBranchOverrideModalVisible(true);
      setIsPermissionChecked(true);
    }
    if (isDaAbroadChecked) {
      setBranchUpdate(null);
      setIsDaAbroadChecked(false);
      setIsBranchOverrideModalVisible(true);
      setIsPermissionChecked(true);
    }
  };

  const handleDaAbroadSubmit = () => {
    const updatedData = {
      daAbroad: true,
      branchOverride: false,
      structure: {
        country_code: countryCode,
      },
    };
    setIsDaAbroadChecked(true);
    setIsDaAbroadModalVisible(!isDaAbroadModalVisible);

    onDaAbroadSubmit(updatedData);
    if (overriddenBranchStructure && isPermissionChecked) {
      setOverriddenBranchStructure(null);
      setIsPermissionChecked(false);
    }
  };

  const handleSelectDaAbroadCountry = (label: string, country_code) => {
    setCountry(label);
    setCountryCode(country_code.country_code);
  };

  const handleSelectBranchOverride = () => {
    if (branchOverrideInternal)
      setOverriddenBranchStructure(branchOverrideInternal);
    // setIsPermissionChecked(!isPermissionChecked);
    setIsBranchOverrideModalVisible(false);
    handleBranchChange(
      branchOverrideInternal?.ward,
      branchOverrideInternal?.votingDistrict_id,
      branchOverrideInternal?.type,
      isPermissionChecked
    );
  };

  const daAbroadForm = (
    <EuiForm>
      {country && (
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
                      <strong>{country}</strong>
                    </div>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
        </>
      )}

      <CountrySearch onSelect={handleSelectDaAbroadCountry} />
    </EuiForm>
  );

  const branchOverrideForm = (
    <EuiForm>
      {branchOverrideInternal && branchLable && branchDescription && (
        <>
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiText size="s">
                <p>Branch:</p>
              </EuiText>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiText size="s" color="primary">
                <strong>{branchLable}</strong>
              </EuiText>
              <EuiText>
                <strong>{branchDescription}</strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
        </>
      )}

      <EuiFlexItem>
        <Structres
          onSelect={(label, data) => setIsBranchOverrideInternal(data)} // TODO: fix the typing here!
        />
      </EuiFlexItem>
    </EuiForm>
  );

  let daAbroadModal;
  let branchOverrideModal;

  if (isDaAbroadModalVisible) {
    daAbroadModal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeDaAbroadModal} initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle size="m">Country Search </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>{daAbroadForm}</EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeDaAbroadModal}>Cancel</EuiButtonEmpty>

            <EuiButton onClick={handleDaAbroadSubmit} fill>
              Set Branch
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  if (isBranchOverrideModalVisible) {
    branchOverrideModal = (
      <EuiOverlayMask>
        <EuiModal
          onClose={closeBranchOverrideModal}
          initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle size="m">Structure Search</EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>{branchOverrideForm}</EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeBranchOverrideModal}>
              Cancel
            </EuiButtonEmpty>

            <EuiButton
              onClick={handleSelectBranchOverride}
              disabled={!branchOverrideInternal}
              fill>
              Set Branch
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  function isAbove31(dateStr) {
    const age = moment().diff(moment(dateStr), 'years');
    return age > 31 ? true : false;
  }

  const renderActions = (
    <EuiFlexGroup direction="column" gutterSize="s">
      <EuiFlexItem>
        {/* <EuiButton onClick={showDaAbroadModal} size="s" fill>
          <EuiText size="s">DA Abroad</EuiText>
        </EuiButton> */}
        <EuiCheckbox
          label={
            <EuiText size="s">
              <p style={{ whiteSpace: 'nowrap' }}>DA Abroad</p>
            </EuiText>
          }
          // disabled={branchUpdate ? true : false}
          id={htmlIdGenerator()()}
          checked={isDaAbroadChecked}
          onChange={showDaAbroadModal}
        />
      </EuiFlexItem>
      {originalPerson?.membership?.status !== 'NotAMember' ? (
        <EuiFlexItem>
          <EuiCheckbox
            label={
              <EuiText size="s">
                <p style={{ whiteSpace: 'nowrap' }}>
                  Permission to have a different branch given
                </p>
              </EuiText>
            }
            // disabled={overriddenBranchStructure?.type ? true : false}
            id={htmlIdGenerator()()}
            checked={isPermissionChecked && !isDaAbroadChecked}
            onChange={showBranchOverrideModal}
          />
        </EuiFlexItem>
      ) : null}
    </EuiFlexGroup>
  );

  const renderCards = (
    <>
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="DA Youth"
        checkableType="checkbox"
        aria-label="DA Youth"
        disabled={isAbove31(dob)}
        checked={!isAbove31(dob) && daYouth}
        onChange={() => onYouthChange(daYouth)}
      />
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="DAWN Opt-out"
        checkableType="checkbox"
        aria-label="DAWN Opt-out"
        disabled={gender === 'M'}
        checked={Boolean(dawnOptOut)}
        onChange={() => onDawnChange(!dawnOptOut)}
      />
    </>
  );

  useEffect(() => {
    if (branchOverrideInternal) {
      setBranchLable(
        `${branchOverrideInternal.votingDistrict} (${branchOverrideInternal.votingDistrict_id})`
      );
      setBranchDescription(getStructureDescription(branchOverrideInternal));
    }
  }, [branchOverrideInternal]);

  return (
    <>
      <EuiFlexGrid columns={3}>
        {daAbroadModal}
        {branchOverrideModal}
        {renderCards}
        {renderActions}
      </EuiFlexGrid>
      <EuiFlexGrid columns={1}></EuiFlexGrid>
    </>
  );
};

export default MembershipCheckbox;

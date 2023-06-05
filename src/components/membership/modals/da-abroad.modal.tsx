import CountrySearch from '@components/country-search';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { FunctionComponent, useContext, useState } from 'react';
import { MembershipContext } from '../membership.context';

// export interface Props {
//   show: boolean;
// }

interface Country {
  name: string;
  code: string;
}

const DaAbroadModal: FunctionComponent = () => {
  const {
    isDaAbroadSelected,
    showDaAbroadModal,
    setShowDaAbroadModal,
    updatedBranch,
    setUpdatedBranch,
    setIsDaAbroadSelected,
  } = useContext(MembershipContext);

  const [selectedCountry, setSelectedCountry] = useState<Country>();

  const handleSetBranch = () => {
    setUpdatedBranch({
      label: selectedCountry.name,
      description: '',
      showConfirmCallout: false,
      structure: {
        country_code: selectedCountry.code,
        type: 'COUNTRY',
      },
    });
    setIsDaAbroadSelected(true);
    setShowDaAbroadModal(false);
    setSelectedCountry(undefined);
  };

  const handleClose = () => {
    setShowDaAbroadModal(false);
    setSelectedCountry(undefined);
    if (
      isDaAbroadSelected &&
      (updatedBranch?.structure?.type !== 'COUNTRY' ||
        !updatedBranch?.structure?.country_code)
    ) {
      setIsDaAbroadSelected(false);
    }
  };

  if (!showDaAbroadModal) return <></>;

  return (
    <EuiOverlayMask>
      <EuiModal onClose={handleClose} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="m">Country Search </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            {selectedCountry && (
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
                            <strong>{selectedCountry.name}</strong>
                          </div>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size="m" />
              </>
            )}

            <CountrySearch
              onSelect={(label, country) =>
                setSelectedCountry({
                  name: label,
                  code: (country as any)?.country_code, // TODO: This needs to be fixed inside CountrySearch!
                })
              }
            />
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleClose}>Cancel</EuiButtonEmpty>

          <EuiButton onClick={handleSetBranch} disabled={!selectedCountry} fill>
            Set Branch
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export default DaAbroadModal;

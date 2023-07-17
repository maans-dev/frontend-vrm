import {
  EuiButton,
  EuiButtonEmpty,
  EuiCheckableCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPanel,
  EuiSpacer,
  EuiSuperSelect,
  EuiText,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { Address } from '@lib/domain/person';
import { GeocodedAddressSource, Province } from '@lib/domain/person-enum';
import { FunctionComponent, useEffect, useState } from 'react';

export type Props = {
  results: Partial<Address>[];
  onClose: (address: Partial<Address>) => void;
  setGeoCodeAddress?: (update: boolean) => void;
};

const SearchResultsModal: FunctionComponent<Props> = ({
  results,
  onClose,
  setGeoCodeAddress,
}) => {
  const [address, setAddress] = useState<Partial<Address>>(
    results.length === 1 ? results[0] : null
  );
  const [addressInternal, setAddressInternal] = useState<Partial<Address>>(
    results.length === 1 ? results[0] : null
  );

  const onUpdateAddress = (field: string, value: string) => {
    setAddress(a => {
      const updatedAddress = {
        ...a,
        [field]: value,
      };
      return updatedAddress;
    });
  };

  const setSelectedAddress = (option: Partial<Address>) => {
    if (!option?.geocodeSource) {
      if (option.latitude && option.longitude) {
        option.geocodeSource = GeocodedAddressSource.GEOCODED_ADDRESS;
      } else {
        option.geocodeSource = GeocodedAddressSource.UNGEOCODED;
      }

      if (option?.service?.type === 'VOTING_DISTRICT') {
        option.geocodeSource = GeocodedAddressSource.GEOCODED_VD;
      }
    }

    setAddress({
      ...option,
      buildingName: '',
      buildingNo: '',
      comment: '',
    });
    setAddressInternal({
      ...option,
      buildingName: '',
      buildingNo: '',
      comment: '',
    });
  };

  const doClose = (address: Partial<Address>) => {
    if (typeof setGeoCodeAddress === 'function') {
      setGeoCodeAddress(false);
    }
    setAddress(null);
    setAddressInternal(null);
    if (onClose) onClose(address);
  };

  const options = results.map((result, i) => (
    <EuiFlexItem key={i} grow={true}>
      <EuiCheckableCard
        css={css`
          .euiSplitPanel__inner {
            padding: 7px;
          }
        `}
        id={i.toString()}
        label={
          <EuiText size="xs">
            {result?.service?.emoji}{' '}
            {result.formatted ? (
              result.formatted
            ) : result?.service?.type === 'VOTING_DISTRICT' ? (
              <>
                {result?.votingDistrict} ({result?.votingDistrict_id})
              </>
            ) : (
              <>{result.formatted}</>
            )}
          </EuiText>
        }
        onChange={() => setSelectedAddress(result)}></EuiCheckableCard>
    </EuiFlexItem>
  ));

  const renderAddressFields = () => (
    <>
      <EuiForm fullWidth>
        <EuiFlexGroup responsive={false} gutterSize="s">
          <EuiFlexItem grow={3}>
            <EuiFormRow label="Unit Number" display="rowCompressed">
              <EuiFieldText
                name="Unit Number"
                compressed
                value={address?.buildingNo}
                onChange={e => {
                  const inputValue = e.target.value;
                  const numericValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                  onUpdateAddress('buildingNo', numericValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={9}>
            <EuiFormRow label="Unit Name" display="rowCompressed">
              <EuiFieldText
                name="Unit Name"
                compressed
                value={address?.buildingName}
                onChange={e => {
                  const uppercaseValue = e.target.value.toUpperCase();
                  onUpdateAddress('buildingName', uppercaseValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFlexGroup responsive={false} gutterSize="s">
          <EuiFlexItem grow={3}>
            <EuiFormRow label="Street No" display="rowCompressed">
              <EuiFieldText
                name="Street Number"
                compressed
                value={address?.streetNo}
                disabled={!!addressInternal?.streetNo}
                onChange={e => {
                  const inputValue = e.target.value;
                  const numericValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                  onUpdateAddress('streetNo', numericValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={9}>
            <EuiFormRow label="Street Name" display="rowCompressed">
              <EuiFieldText
                name="Street Name"
                compressed
                disabled={!!addressInternal?.streetName}
                value={address?.streetName}
                onChange={e => {
                  const uppercaseValue = e.target.value.toUpperCase();
                  onUpdateAddress('streetName', uppercaseValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFormRow label="Suburb" display="rowCompressed">
          <EuiFieldText
            name="Suburb"
            compressed
            value={address?.suburb}
            disabled={!!addressInternal?.suburb}
            onChange={e => {
              const uppercaseValue = e.target.value.toUpperCase();
              onUpdateAddress('suburb', uppercaseValue);
            }}
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFlexGroup responsive={false} gutterSize="s">
          <EuiFlexItem grow={8}>
            <EuiFormRow label="City" display="rowCompressed">
              <EuiFieldText
                name="City"
                compressed
                value={address?.city}
                disabled={!!addressInternal?.city}
                onChange={e => {
                  const uppercaseValue = e.target.value.toUpperCase();
                  onUpdateAddress('city', uppercaseValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={4}>
            <EuiFormRow label="Postal code" display="rowCompressed">
              <EuiFieldText
                name="Postal code"
                compressed
                disabled={!!addressInternal?.postalCode}
                value={address?.postalCode}
                onChange={e => {
                  const inputValue = e.target.value;
                  const numericValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                  onUpdateAddress('postalCode', numericValue);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFormRow label="Province" display="rowCompressed">
          <EuiSuperSelect
            compressed
            disabled={!!addressInternal?.province_enum}
            options={Object.entries(Province).map(([value, label]) => {
              return {
                value: value,
                inputDisplay: label,
              };
            })}
            valueOfSelected={address?.province_enum}
            onChange={value => onUpdateAddress('province_enum', value)}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFormRow label="Comment" display="rowCompressed">
          <EuiFieldText
            name="Comment"
            autoComplete="no"
            compressed
            value={address?.comment}
            onChange={e => onUpdateAddress('comment', e.target.value)}
          />
        </EuiFormRow>
        <EuiSpacer />
      </EuiForm>
    </>
  );

  const renderBody = () => {
    if (address) {
      return renderAddressFields();
    }

    return (
      <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
        {options}
      </EuiFlexGroup>
    );
  };

  const renderHeaderTitle = () =>
    address ? (
      <>
        <p>Complete address details</p>
        <EuiSpacer />
        <EuiPanel paddingSize="m" hasShadow={false} hasBorder={true}>
          <EuiText size="xs">
            {address?.service?.emoji}{' '}
            {address.formatted ? (
              address.formatted
            ) : address?.service?.type === 'VOTING_DISTRICT' ? (
              <>
                {address.votingDistrict} ({address?.votingDistrict_id})
              </>
            ) : (
              <>{address.formatted}</>
            )}
          </EuiText>
        </EuiPanel>
      </>
    ) : (
      'Select a location'
    );

  useEffect(() => {
    if (results.length === 1 && !address) {
      setAddress(results[0]);
      setAddressInternal(results[0]);
    }
  }, [address, results]);

  return (
    <>
      {results.length > 0 && (
        <EuiModal
          css={css`
            .euiModalHeader {
              padding-inline: 24px;
            }
          `}
          onClose={() => doClose(null)}>
          <EuiModalHeader>
            <EuiModalHeaderTitle size="s">
              {renderHeaderTitle()}
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>{renderBody()}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={() => doClose(null)}>
              Cancel
            </EuiButtonEmpty>
            {address && (
              <EuiButton onClick={() => doClose(address)} fill>
                Use Address
              </EuiButton>
            )}
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

export default SearchResultsModal;

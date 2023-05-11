import {
  EuiButton,
  EuiButtonEmpty,
  EuiCheckableCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { Address } from '@lib/domain/person';
import { GeocodedAddressSource } from '@lib/domain/person-enum';
import { FunctionComponent, useEffect, useState } from 'react';
import { MdHowToVote } from 'react-icons/md';

export type Props = {
  results?: Partial<Address>[];
  onClose: (address: Partial<Address>) => void;
};

const SearchResultsModal: FunctionComponent<Props> = ({ results, onClose }) => {
  const [address, setAddress] = useState<Partial<Address>>(
    results.length === 1 ? results[0] : null
  );
  const [addressInternal, setAddressInternal] = useState<Partial<Address>>(
    results.length === 1 ? results[0] : null
  );

  useEffect(() => {
    if (results.length === 1) setAddress(results[0]);
    if (results.length === 1) setAddressInternal(results[0]);
  }, [address, addressInternal, results]);

  const onUpdateAddress = (field: string, value: string) => {
    setAddress(a => ({
      ...a,
      [field]: value,
    }));
  };

  const setSelectedAddress = (option: Partial<Address>) => {
    if (option.latitude && option.longitude) {
      option.geocodeSource = GeocodedAddressSource.GEOCODED_ADDRESS;
    } else {
      option.geocodeSource = GeocodedAddressSource.UNGEOCODED;
    }

    if (option?.service?.type === 'VOTING_DISTRICT') {
      option.geocodeSource = GeocodedAddressSource.GEOCODED_VD;
    }

    setAddress({ ...option, buildingName: '', buildingNo: '' });
    setAddressInternal({ ...option, buildingName: '', buildingNo: '' });
  };

  const doClose = (address: Partial<Address>) => {
    setAddress(null);
    setAddressInternal(null);
    onClose(address);
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
            ) : result.service.type === 'VOTING_DISTRICT' ? (
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
                onChange={e => onUpdateAddress('buildingNo', e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={9}>
            <EuiFormRow label="Unit Name" display="rowCompressed">
              <EuiFieldText
                name="Unit Name"
                compressed
                value={address?.buildingName}
                onChange={e => onUpdateAddress('buildingName', e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFlexGroup responsive={false} gutterSize="s">
          <EuiFlexItem grow={3}>
            <EuiFormRow label="Street Number" display="rowCompressed">
              <EuiFieldText
                name="Street Number"
                compressed
                value={address?.streetNo}
                onChange={e => onUpdateAddress('streetNo', e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={9}>
            <EuiFormRow label="Street Name" display="rowCompressed">
              <EuiFieldText
                name="Street Name"
                compressed
                value={address?.streetName}
                onChange={e => onUpdateAddress('streetName', e.target.value)}
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
            onChange={e => onUpdateAddress('suburb', e.target.value)}
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
                onChange={e => onUpdateAddress('city', e.target.value)}
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
                onChange={e => onUpdateAddress('postalCode', e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiFormRow label="Province" display="rowCompressed">
          <EuiFieldText
            name="Province"
            compressed
            value={address?.province}
            disabled={!!addressInternal?.province}
            onChange={e => onUpdateAddress('province', e.target.value)}
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
            ) : address.service.type === 'VOTING_DISTRICT' ? (
              <>
                {address?.votingDistrict} ({address?.votingDistrict_id})
              </>
            ) : (
              <>{address.formatted}</>
            )}
          </EuiText>
          {/* {address.service.type !== 'VOTING_DISTRICT' && (
            <EuiText size="xs">
              <EuiFlexGroup responsive={false} gutterSize="s">
                <EuiFlexItem grow={false}>
                  <EuiIcon type={MdHowToVote} />
                </EuiFlexItem>
                <EuiFlexItem>
                  {address?.votingDistrict} ({address?.votingDistrict_id})
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiText>
          )} */}
        </EuiPanel>
      </>
    ) : (
      'Select a location'
    );

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

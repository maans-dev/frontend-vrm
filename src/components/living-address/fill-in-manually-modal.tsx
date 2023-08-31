import {
  EuiButton,
  EuiButtonEmpty,
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
  EuiSpacer,
  EuiSuperSelect,
} from '@elastic/eui';
import { FunctionComponent, useEffect, useState } from 'react';
import { Address } from '@lib/domain/person';
import omit from 'lodash/omit';
import { GeocodedAddressSource, Province } from '@lib/domain/person-enum';
import { useSession } from 'next-auth/react';
import { appsignal } from '@lib/appsignal';
import SearchResultsModal from './search-results-modal';

function generateAddressString(updatedAddress: Partial<Address>) {
  let addressString = '';

  if (updatedAddress.streetNo && updatedAddress.streetName) {
    addressString = `${updatedAddress.streetNo}`;
  }

  if (updatedAddress.streetName) {
    addressString = `${addressString} ${updatedAddress.streetName}`;
  }

  if (updatedAddress.suburb) {
    addressString = `${addressString} ${updatedAddress.suburb}`;
  }

  if (updatedAddress.city) {
    addressString = `${addressString} ${updatedAddress.city}`;
  }

  if (updatedAddress.province_enum) {
    addressString = `${addressString} ${updatedAddress.province_enum}`;
  }

  return addressString.toLowerCase();
}

export type Props = {
  address: Partial<Address>;
  onSubmit: (address: Partial<Address>) => void;
  onAddressChange?: (selectedAddress: Partial<Address>) => void;
  removeResults?: boolean;
  onClose?: (address: Partial<Address>) => void;
  onOpen?: () => void;
};

const FillInManuallyModal: FunctionComponent<Props> = ({
  address,
  onSubmit,
  removeResults,
  onClose,
  onOpen,
}) => {
  const { data: session } = useSession();
  const [updatedAddress, setUpdatedAddress] = useState(() => {
    const update: any = {
      ...omit(address, [
        'key',
        'type',
        'formatted',
        'service',
        'emoji',
        'created',
        'createdBy',
        'key_hash',
        'key_text',
        'modified',
        'modifiedBy',
        'person',
        'structure',
      ]),
    };

    update.structure = {
      deleted: true,
    };

    return update;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  //Fill In Manually Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => {
    setIsModalVisible(true);
    if (onOpen) onOpen();
  };
  //GeoCode Address Modal
  const [isGeoCodeVisible, setIsGeoCodeVisible] = useState(false);
  const [error, setError] = useState<string>(null);

  const submit = () => {
    closeModal();
    onSubmit({
      ...updatedAddress,
      geocodeSource: GeocodedAddressSource.UNGEOCODED,
    });
  };

  const onUpdateAddress = (field: string, value: string) => {
    // TODO: shouldn't use any here. Need to define proper update type that matches the reqiored payload.
    const update: any = {
      ...omit(updatedAddress, [
        'key',
        'type',
        'formatted',
        'service',
        'emoji',
        'created',
        'createdBy',
        'key_hash',
        'key_text',
        'modified',
        'modifiedBy',
        'person',
        'structure',
      ]),
      [field]: value,
    };

    update.structure = {
      deleted: true,
    };

    setUpdatedAddress(update);
  };

  const onReset = () => {
    setUpdatedAddress(prevState => ({
      ...prevState,
      streetNo: '',
      streetName: '',
      suburb: '',
      city: '',
      postalCode: '',
      buildingName: '',
      buildingNo: '',
      comment: '',
    }));
  };

  const doGeoCodeSearch = async (value: string) => {
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/address/geocode/forward/`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        address: value,
        username: session?.user?.darn,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setSearchResults([]);
      const errJson = await response.clone().text();
      appsignal.sendError(
        new Error(`Unable to forward geocode this address: ${errJson}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            address: value,
            username: session.user.darn,
          });
          span.setTags({ user_darn: session?.user?.darn?.toString() });
        }
      );
      return;
    }

    const respPayload = await response.clone().json();
    const results = respPayload?.data?.results?.values;

    if (results) {
      const vd = await doVotingDistrictSearch(results[0]);
      results[0].votingDistrict_id = +vd.votingDistrict_id;
      results[0].votingDistrict = vd.votingDistrict;
      results[0].province = vd.province;
      results[0].structure = vd;
      results[0].buildingNo = updatedAddress?.buildingNo ?? '';
      results[0].buildingName = updatedAddress?.buildingName ?? '';
      results[0].comment = updatedAddress?.comment ?? '';
      results[0].geocodeSource = GeocodedAddressSource.GEOCODED_ADDRESS;
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const doVotingDistrictSearch = async (address: Partial<Address>) => {
    setError(null);
    const latitude = address.latitude;
    const longitude = address.longitude;
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/structures/votingdistricts?latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'GET',
    });

    if (!response.ok) {
      // throw 'Unable to load Voting District for this address';
      const errJson = JSON.parse(await response.clone().text());
      setError(
        `Unable to load Voting District for this address: ${errJson.message}`
      );

      appsignal.sendError(
        new Error(
          `Unable to load Voting District for this address: ${errJson.message}`
        ),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            user: session.user.darn,
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }

    const structureInfo = await response.clone().json();

    if (structureInfo.length === 0) {
      setError(
        `Unable to load Voting District for this address: No VD found at ${latitude}, ${longitude}`
      );
      appsignal.sendError(
        new Error(
          `Unable to load Voting District for this address: No VD found at ${latitude}, ${longitude}`
        ),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            user: session.user.darn,
          });
          span.setTags({ user_darn: session?.user?.darn?.toString() });
        }
      );
      return;
    }

    return structureInfo[0];
  };

  const handleGeoCodeButtonClick = () => {
    doGeoCodeSearch(generateAddressString(updatedAddress));
    closeModal();
    setIsGeoCodeVisible(true);
  };

  useEffect(() => {
    const update: any = {
      ...omit(address, [
        'key',
        'type',
        'formatted',
        'service',
        'emoji',
        'created',
        'createdBy',
        'key_hash',
        'key_text',
        'modified',
        'modifiedBy',
        'person',
        'structure',
      ]),
    };

    update.structure = {
      deleted: true,
    };
    setUpdatedAddress(update);
  }, [address]);

  return (
    <>
      {isGeoCodeVisible && (
        <SearchResultsModal
          results={searchResults}
          onClose={onClose}
          setGeoCodeAddress={setIsGeoCodeVisible}
        />
      )}

      <EuiButtonEmpty href="#" onClick={showModal} size="xs">
        {removeResults ? 'Edit manually' : 'Fill in manually'}
      </EuiButtonEmpty>
      {isModalVisible && (
        <EuiModal onClose={closeModal} initialFocus=".unit-number">
          <EuiModalHeader>
            <EuiModalHeaderTitle>Fill in manually</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiForm fullWidth>
              <EuiFlexGroup responsive={false} gutterSize="s">
                <EuiFlexItem grow={3}>
                  <EuiFormRow label="Unit Number" display="rowCompressed">
                    <EuiFieldText
                      className="unit-number"
                      name="Unit Number"
                      compressed
                      value={updatedAddress?.buildingNo}
                      onChange={e => {
                        const inputValue = e.target.value;
                        const numbersOnly = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                        onUpdateAddress('buildingNo', numbersOnly);
                      }}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={9}>
                  <EuiFormRow label="Unit Name" display="rowCompressed">
                    <EuiFieldText
                      name="Unit Name"
                      compressed
                      value={updatedAddress?.buildingName}
                      onChange={e => {
                        const uppercaseValue = e.target.value.toUpperCase();
                        onUpdateAddress('buildingName', uppercaseValue.trim());
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
                      value={updatedAddress?.streetNo}
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
                      value={updatedAddress?.streetName}
                      onChange={e => {
                        const uppercaseValue = e.target.value.toUpperCase();
                        onUpdateAddress('streetName', uppercaseValue.trim());
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
                  value={updatedAddress?.suburb}
                  onChange={e => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    onUpdateAddress('suburb', uppercaseValue.trim());
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
                      value={updatedAddress?.city}
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
                      value={updatedAddress?.postalCode}
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
                  options={Object.entries(Province).map(([value, label]) => {
                    return {
                      value: value,
                      inputDisplay: label,
                    };
                  })}
                  valueOfSelected={updatedAddress?.province_enum}
                  onChange={value => onUpdateAddress('province_enum', value)}
                />
              </EuiFormRow>
              <EuiSpacer />

              <EuiFormRow label="Comment" display="rowCompressed">
                <EuiFieldText
                  name="Comment"
                  autoComplete="no"
                  compressed
                  value={updatedAddress?.comment}
                  onChange={e => onUpdateAddress('comment', e.target.value)}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiFlexGroup justifyContent="spaceBetween">
              <EuiFlexItem grow={false}>
                <EuiButton onClick={handleGeoCodeButtonClick} fill>
                  Geocode Address
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty onClick={onReset}>Reset</EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton onClick={submit} fill>
                  Use Address
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

export default FillInManuallyModal;

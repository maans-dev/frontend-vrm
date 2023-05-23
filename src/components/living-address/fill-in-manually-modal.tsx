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
import { FaPen } from 'react-icons/fa';
import { FunctionComponent, useEffect, useState } from 'react';
import { Address } from '@lib/domain/person';
import omit from 'lodash/omit';
import { GeocodedAddressSource, Province } from '@lib/domain/person-enum';

export type Props = {
  address: Partial<Address>;
  onSubmit: (address: Partial<Address>) => void;
};

const FillInManuallyModal: FunctionComponent<Props> = ({
  address,
  onSubmit,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
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
      <EuiButton iconType={FaPen} onClick={showModal}>
        Fill in manually
      </EuiButton>
      {isModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Fill in manually</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiForm fullWidth>
              <EuiFlexGroup responsive={false} gutterSize="s">
                <EuiFlexItem grow={3}>
                  <EuiFormRow label="Unit Number" display="rowCompressed">
                    <EuiFieldText
                      name="Unit Number"
                      compressed
                      value={updatedAddress?.buildingNo}
                      onChange={e =>
                        onUpdateAddress('buildingNo', e.target.value)
                      }
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={9}>
                  <EuiFormRow label="Unit Name" display="rowCompressed">
                    <EuiFieldText
                      name="Unit Name"
                      compressed
                      value={updatedAddress?.buildingName}
                      onChange={e =>
                        onUpdateAddress('buildingName', e.target.value)
                      }
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
                      onChange={e =>
                        onUpdateAddress('streetNo', e.target.value)
                      }
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={9}>
                  <EuiFormRow label="Street Name" display="rowCompressed">
                    <EuiFieldText
                      name="Street Name"
                      compressed
                      value={updatedAddress?.streetName}
                      onChange={e =>
                        onUpdateAddress('streetName', e.target.value)
                      }
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
                      value={updatedAddress?.city}
                      onChange={e => onUpdateAddress('city', e.target.value)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={4}>
                  <EuiFormRow label="Postal code" display="rowCompressed">
                    <EuiFieldText
                      name="Postal code"
                      compressed
                      value={updatedAddress?.postalCode}
                      onChange={e =>
                        onUpdateAddress('postalCode', e.target.value)
                      }
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
            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
            <EuiButton onClick={submit} fill>
              Use Address
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </>
  );
};

export default FillInManuallyModal;

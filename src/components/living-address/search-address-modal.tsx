import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { FaPen } from 'react-icons/fa';
import { FunctionComponent, useState } from 'react';
import AddressOptions from './address-options';

export type Props = {
  onSubmit?: (options) => void;
};

const SearchAddressModal: FunctionComponent<Props> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  const submit = () => {
    closeModal();
  };

  return (
    <>
      <EuiButton iconType={FaPen} onClick={showModal}>
        Fill in manually
      </EuiButton>
      {isModalVisible && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Address Search</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <AddressOptions />
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

export default SearchAddressModal;

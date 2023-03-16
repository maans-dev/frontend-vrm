import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
} from '@elastic/eui';
import { PersonSearchParams } from '@lib/domain/person-search';
import { FunctionComponent, useState } from 'react';
import SearchOptions from './search-options';

export type Props = {
  onSubmit?: (params: Partial<PersonSearchParams>) => void;
};

const SearchOptionsModal: FunctionComponent<Props> = ({ onSubmit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>();
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const submit = () => {
    if (!searchParams) return;
    onSubmit(searchParams);
    closeModal();
    setSearchParams(null);
  };

  const reset = () => {
    if (!searchParams) return;
    setSearchParams(null);
  };

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="s">Search for a voter</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <SearchOptions onChange={params => setSearchParams(params)} />
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={reset}>Reset</EuiButtonEmpty>

          <EuiButton
            iconType="search"
            type="submit"
            onClick={submit}
            fill
            disabled={!searchParams}>
            Search
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }
  return (
    <>
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton iconType="search" onClick={showModal} size="s">
            Search again
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      {modal}
    </>
  );
};

export default SearchOptionsModal;

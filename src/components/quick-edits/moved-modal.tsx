import React, { FunctionComponent } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiText,
} from '@elastic/eui';

interface Props {
  setIsMovedModalVisible: (visible: boolean) => void;
  handleSaveMoved: () => void;
}

const MovedModal: FunctionComponent<Props> = ({
  setIsMovedModalVisible,
  handleSaveMoved,
}) => {
  return (
    <EuiModal
      onClose={() => setIsMovedModalVisible(false)}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Save now or continue?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          Voter has moved, so no additional changes are required.
        </EuiText>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={() => setIsMovedModalVisible(false)}>
          Continue
        </EuiButtonEmpty>
        <EuiButton onClick={handleSaveMoved} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};

export default MovedModal;

import React, { FunctionComponent } from 'react';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiText,
  EuiButton,
  EuiButtonEmpty,
} from '@elastic/eui';

interface Props {
  setIsDeceasedModalVisible: (visible: boolean) => void;
  handleContinueDeceased: () => void;
  handleSaveDeceased: () => void;
}

const DeceasedModal: FunctionComponent<Props> = ({
  setIsDeceasedModalVisible,
  handleContinueDeceased,
  handleSaveDeceased,
}) => {
  return (
    <EuiModal
      onClose={() => setIsDeceasedModalVisible(false)}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Save now or continue?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          Voter is deceased, so no additional changes are required.
        </EuiText>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={handleContinueDeceased}>
          Continue
        </EuiButtonEmpty>
        <EuiButton onClick={handleSaveDeceased} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};

export default DeceasedModal;

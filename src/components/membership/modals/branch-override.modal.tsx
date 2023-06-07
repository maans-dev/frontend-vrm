import Structres from '@components/structure-search';
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
import { Structure } from '@lib/domain/person';
import { FunctionComponent, useContext, useState } from 'react';
import { MembershipContext } from '../membership.context';

const BranchOverrideModal: FunctionComponent = () => {
  const {
    isBranchOverrideSelected,
    showBranchOverrideModal,
    setShowBranchOverrideModal,
    updatedBranch,
    setUpdatedBranch,
    setIsBranchOverrideSelected,
    getStructureDescription,
    personStructure,
  } = useContext(MembershipContext);

  const [selectedOverrideBranch, setSelectedOverrideBranch] =
    useState<Partial<Structure>>();

  const handleSetBranch = () => {
    setUpdatedBranch({
      label: `${selectedOverrideBranch.votingDistrict} (${selectedOverrideBranch.votingDistrict_id})`,
      description: getStructureDescription(selectedOverrideBranch),
      showConfirmCallout: false,
      structure: {
        votingDistrict_id: selectedOverrideBranch.votingDistrict_id,
        type: selectedOverrideBranch?.type,
      },
    });

    setShowBranchOverrideModal(false);
    setSelectedOverrideBranch(undefined);
  };

  const handleClose = () => {
    setShowBranchOverrideModal(false);
    setSelectedOverrideBranch(undefined);
    if (
      isBranchOverrideSelected &&
      (!updatedBranch?.structure?.votingDistrict_id ||
        updatedBranch?.structure?.votingDistrict_id ===
          personStructure?.votingDistrict_id)
    ) {
      setIsBranchOverrideSelected(false);
    }
  };

  if (!showBranchOverrideModal) return <></>;

  return (
    <EuiOverlayMask>
      <EuiModal onClose={handleClose} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="m">Structure Search </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            {selectedOverrideBranch && (
              <>
                <EuiFlexGroup>
                  <EuiFlexItem grow={false}>
                    <EuiText size="s">
                      <p>Branch:</p>
                    </EuiText>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiText size="s" color="primary">
                      <strong>
                        {selectedOverrideBranch.votingDistrict} (
                        {selectedOverrideBranch.votingDistrict_id})
                      </strong>
                    </EuiText>
                    <EuiText>
                      <strong>
                        {getStructureDescription(selectedOverrideBranch)}
                      </strong>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size="m" />
              </>
            )}

            <EuiFlexItem>
              <Structres
                onSelect={(label, data) => setSelectedOverrideBranch(data)}
              />
            </EuiFlexItem>
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleClose}>Cancel</EuiButtonEmpty>

          <EuiButton
            onClick={handleSetBranch}
            disabled={!selectedOverrideBranch}
            fill>
            Set Branch
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export default BranchOverrideModal;

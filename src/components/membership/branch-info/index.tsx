import {
  EuiButtonIcon,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiLink,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { MembershipContext } from '../membership.context';

const BranchInfo: FunctionComponent = () => {
  const {
    canEditBranch,
    canDeleteBranch,
    branch,
    updatedBranch,
    setShowDaAbroadModal,
    setShowBranchOverrideModal,
    onDeleteDaAbroad,
    onDeleteBranchOverride,
    onSelectAddressTab,
  } = useContext(MembershipContext);

  const [branchToDisplay, setBranchToDisplay] = useState(
    updatedBranch || branch
  );

  const handleEdit = () => {
    if (branchToDisplay?.structure?.type === 'COUNTRY') {
      setShowDaAbroadModal(true);
    } else {
      setShowBranchOverrideModal(true);
    }
  };

  const handleDelete = () => {
    if (branchToDisplay?.structure?.type === 'COUNTRY') {
      onDeleteDaAbroad();
    } else {
      onDeleteBranchOverride();
    }
  };

  useEffect(() => {
    if (updatedBranch || branch) {
      setBranchToDisplay(updatedBranch || branch);
    } else {
      setBranchToDisplay({
        label: (
          <EuiText size="s" color="danger">
            No geocoded address found.
          </EuiText>
        ),
        description: (
          <EuiLink color="primary" onClick={() => onSelectAddressTab()}>
            <EuiText size="s">
              Add a geocoded address for this person here.
            </EuiText>
          </EuiLink>
        ),
        showConfirmCallout: false,
        structure: null,
      });
    }
  }, [branch, updatedBranch]);

  return (
    <EuiFormFieldset legend={{ children: 'Branch Info' }}>
      <EuiFlexGroup gutterSize="l">
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <p>Branch:</p>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem grow={false}>
            <EuiFlexGroup direction="column" gutterSize="xs">
              <EuiFlexItem>
                <EuiText size="s" color="primary">
                  <strong>{branchToDisplay?.label}</strong>
                </EuiText>
              </EuiFlexItem>
              {branchToDisplay?.description && (
                <EuiFlexItem>
                  <EuiText size="s">
                    <strong>{branchToDisplay?.description}</strong>
                  </EuiText>
                  {branchToDisplay.showConfirmCallout && (
                    <>
                      <EuiSpacer size="xs" />
                      <EuiCallOut
                        size="s"
                        title="Please confirm branch by saving this record."
                        color="warning"
                        iconType="alert"
                      />
                    </>
                  )}
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
          {canEditBranch && (
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s">
                <EuiFlexItem>
                  <EuiButtonIcon
                    iconType="pencil"
                    aria-label="Edit"
                    onClick={handleEdit}
                  />
                </EuiFlexItem>
                {canDeleteBranch && (
                  <EuiFlexItem>
                    <EuiButtonIcon
                      iconType="trash"
                      aria-label="Delete"
                      color="danger"
                      onClick={handleDelete}
                    />
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiFlexGroup>
    </EuiFormFieldset>
  );
};

export default BranchInfo;

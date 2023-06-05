import {
  EuiButtonIcon,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiText,
} from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';

const CancellationInfo: FunctionComponent = () => {
  const {
    cancellationInfo,
    setCancellationInfo,
    setUpdateType,
    setIsCancelModalVisible,
  } = useContext(MembershipContext);
  return (
    <>
      <EuiFormFieldset legend={{ children: 'Cancellation Info' }}>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem>
            <EuiFlexGrid columns={2} gutterSize="s">
              <EuiText size="s">Type:</EuiText>
              <strong>{cancellationInfo.type}</strong>
              <EuiText size="s">Comment / Reason:</EuiText>
              <strong>{cancellationInfo.comment}</strong>
            </EuiFlexGrid>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem>
                <EuiButtonIcon
                  iconType="pencil"
                  aria-label="Edit"
                  onClick={() => setIsCancelModalVisible(true)}
                />
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiButtonIcon
                  iconType="trash"
                  aria-label="Delete"
                  color="danger"
                  onClick={() => {
                    setCancellationInfo(undefined);
                    setUpdateType('membership-capture');
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormFieldset>
    </>
  );
};

export default CancellationInfo;

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFormFieldset,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiOverlayMask,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiTextArea,
} from '@elastic/eui';
import { Membership } from '@lib/domain/person';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

export interface Props {
  handleMembershipCancellation: (update: Partial<Membership>) => void;
  isCancellationModalVisible: boolean;
  setIsCanellationModalVisible: (value: boolean) => void;
}

const CancelMembershipForm: FunctionComponent<Props> = ({
  handleMembershipCancellation,
  isCancellationModalVisible,
  setIsCanellationModalVisible,
}) => {
  const [type, setType] = useState<string>('membership-terminated');
  const [comment, setComment] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);

  const closeModal = () => setIsCanellationModalVisible(false);

  const showModal = () => setIsCanellationModalVisible(true);

  const handleCommentChange = event => {
    setComment(event.target.value);
  };

  const payload = useMemo(() => {
    let data = null;

    if (type && type.length > 1 && comment && comment.length > 3) {
      switch (type) {
        case 'membership-resigned':
          data = {
            type: 'membership-resigned',
            statusComments: comment,
          };
          break;
        case 'membership-terminated':
          data = {
            type: 'membership-terminated',
            statusComments: comment,
          };
          break;
        default:
          break;
      }

      if (comment && type) {
        setFormCompleted(true);
      }

      return data;
    } else {
      return null;
    }
  }, [type, comment, setFormCompleted]);

  const handleSubmit = () => {
    handleMembershipCancellation(payload);
    setIsCanellationModalVisible(false);
  };

  const resetForm = useCallback(() => {
    setComment('');
    setFormCompleted(false);
  }, [setComment]);

  const cancelForm = (
    <>
      <EuiFormFieldset
        legend={{
          children: 'Cancel Membership',
        }}>
        <EuiFormRow label="Type" display="rowCompressed">
          <EuiSelect
            options={[
              { value: 'membership-terminated', text: 'Terminated' },
              { value: 'membership-resigned', text: 'Resigned' },
            ]}
            compressed
            onChange={event => setType(event.target.value)}
            value={type}
          />
        </EuiFormRow>

        <EuiFormRow label="Reason / Comment">
          <EuiTextArea value={comment} onChange={handleCommentChange} />
        </EuiFormRow>
      </EuiFormFieldset>
    </>
  );

  let modal;

  if (isCancellationModalVisible) {
    modal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
          <EuiSpacer size="m" />
          <EuiModalBody>{cancelForm}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={resetForm}>Reset</EuiButtonEmpty>
            <EuiButton onClick={handleSubmit} fill disabled={!formCompleted}>
              Cancel Membership
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  return (
    <>
      <EuiButton onClick={showModal} size="s" style={{ height: '25px' }}>
        <EuiText size="xs">Cancel</EuiText>
      </EuiButton>
      {modal}
    </>
  );
};

export default CancelMembershipForm;

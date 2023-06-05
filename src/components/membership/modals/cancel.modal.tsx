import PersonSearch from '@components/person-search';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiDatePicker,
  EuiFieldText,
  EuiFormFieldset,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSelect,
  EuiTextArea,
} from '@elastic/eui';
import { Membership, MembershipPayment, Person } from '@lib/domain/person';
import moment from 'moment';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { CancellationInfo, MembershipContext } from '../membership.context';

const CancelModal: FunctionComponent = () => {
  const {
    person,
    isCancelModalVisible,
    setIsCancelModalVisible,
    setUpdateType,
    cancellationInfo,
    setCancellationInfo,
    setPayment,
  } = useContext(MembershipContext);
  const [type, setType] = useState<CancellationInfo['type']>(
    cancellationInfo?.type || 'membership-terminated'
  );
  const [comment, setComment] = useState<string>(
    cancellationInfo?.comment || ''
  );
  const [formValid, setFormValid] = useState(false);

  const handleClose = () => {
    setIsCancelModalVisible(false);
    handleReset();
  };

  const handleReset = () => {
    setType('membership-terminated');
    setComment('');
  };

  const handleSave = () => {
    setCancellationInfo({
      type,
      comment,
    });
    setUpdateType(type);
    setPayment(undefined);
    setIsCancelModalVisible(false);
    handleReset();
  };

  useEffect(() => {
    if (!cancellationInfo) return;
    setType(cancellationInfo?.type || 'membership-terminated');
    setComment(cancellationInfo?.comment || '');
  }, [cancellationInfo]);

  useEffect(() => {
    setFormValid(comment !== '');
  }, [comment]);

  if (!isCancelModalVisible) return <></>;

  return (
    <EuiOverlayMask>
      <EuiModal onClose={handleClose} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="m">Cancel membership </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiFormFieldset>
            <EuiFormRow label="Type" display="rowCompressed">
              <EuiSelect
                options={[
                  { value: 'membership-terminated', text: 'Terminated' },
                  { value: 'membership-resigned', text: 'Resigned' },
                ]}
                compressed
                onChange={e =>
                  setType(e.target.value as CancellationInfo['type'])
                }
                value={type}
              />
            </EuiFormRow>

            <EuiFormRow label="Reason / Comment">
              <EuiTextArea
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </EuiFormRow>
          </EuiFormFieldset>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleReset}>Reset</EuiButtonEmpty>

          <EuiButton onClick={handleSave} disabled={!formValid} fill>
            Add cancellation info
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export default CancelModal;

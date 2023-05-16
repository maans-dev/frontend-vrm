import {
  EuiCallOut,
  EuiFormFieldset,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiTextArea,
} from '@elastic/eui';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

export interface Props {
  handleCancelForm: (update) => void;
}

const CancelMembershipForm: FunctionComponent<Props> = ({
  handleCancelForm,
}) => {
  const [type, setType] = useState<string>('membership-terminated');
  const [comment, setComment] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);

  const handleCommentChange = event => {
    setComment(event.target.value);
  };

  const payload = useMemo(() => {
    if (type.length > 1 && comment.length > 3) {
      return {
        comments: {
          type: type,
          value: comment,
        },
      };
    } else {
      return null;
    }
  }, [type, comment]);

  useEffect(() => {
    if (type.length > 1 && comment.length > 3) {
      setFormCompleted(true);
      handleCancelForm(payload);
    } else {
      setFormCompleted(false);
    }
  }, [comment?.length, handleCancelForm, payload, type?.length]);

  return (
    <>
      {!formCompleted && (
        <>
          <EuiCallOut color="warning" iconType="alert">
            Please fill out all form fields.
          </EuiCallOut>
          <EuiSpacer size="m" />
        </>
      )}
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
};

export default CancelMembershipForm;

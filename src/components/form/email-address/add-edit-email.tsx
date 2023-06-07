import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from '@elastic/eui';
import { EmailContact } from '@lib/domain/email-address';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  emailContact?: EmailContact;
  onUpdate?: (data: EmailContact) => void;
};

const AddEditEmail: FunctionComponent<Props> = ({ emailContact, onUpdate }) => {
  const [email, setEmail] = useState(emailContact?.value || '');
  const { nextId, data } = useContext(CanvassingContext);
  const [isInvalid, setIsInvalid] = useState(false);
  const [duplicateEntry, setDuplicateEntry] = useState(false);

  function isEmail(value: string): boolean {
    const pattern =
      /^[A-Za-z0-9.!#$%&''*+-/=?^_`{|}~]+@[A-Za-z0-9.-]+[.][A-Za-z]+$/i;
    const valid = pattern.test(value);
    return valid;
  }

  const handleUpdate = () => {
    if (!isEmail(email)) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);

    if (emailContact) {
      // do edit
      onUpdate({
        ...emailContact,
        value: email,
      });
    } else {
      // do add
      onUpdate({
        key: nextId(),
        value: email,
        type: 'HOME',
        category: 'EMAIL',
        canContact: true,
      });
      setEmail('');
    }
  };

  useEffect(() => {
    if (
      data &&
      data.contacts &&
      data.contacts.length > 0 &&
      data.contacts[0].value === email
    ) {
      setDuplicateEntry(true);
    } else {
      setDuplicateEntry(false);
    }
  }, [data, email]);

  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem>
        <EuiFormRow
          display="rowCompressed"
          isInvalid={isInvalid}
          error="Enter a valid email address">
          <EuiFieldText
            compressed
            placeholder="Enter an email address"
            value={email}
            isInvalid={isInvalid}
            type="email"
            onChange={e => setEmail(e.target.value.replace(/\s+/g, ''))}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            disabled={!email || duplicateEntry}
            size="s"
            css={{ minWidth: '50px' }}
            onClick={handleUpdate}>
            {emailContact?.key ? 'Save' : 'Add'}
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditEmail;

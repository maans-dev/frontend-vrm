import { FunctionComponent, useContext, useState } from 'react';
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
  const [email, setEmail] = useState(emailContact?.value || null);
  const { nextId } = useContext(CanvassingContext);

  const handleUpdate = () => {
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

  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText
            compressed
            placeholder="Enter an email address"
            value={email}
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            disabled={!email}
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

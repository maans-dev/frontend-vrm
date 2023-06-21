import { FunctionComponent, useContext } from 'react';
import { EuiButton, EuiFlexItem, EuiPanel } from '@elastic/eui';
import { EmailContact } from '@lib/domain/email-address';
import EmailAddressLine from './email-address';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  emailContacts: EmailContact[];
  onUpdate: (update: EmailContact) => void;
};

const EmailAddress: FunctionComponent<Props> = ({
  emailContacts,
  onUpdate,
}) => {
  const { nextId } = useContext(CanvassingContext);
  const addNewField = () => {
    const newEmailContact = {
      value: '',
      type: 'CUSTOM',
      key: nextId(),
      category: 'EMAIL',
      canContact: true,
      confirmed: true,
    };
    onUpdate(newEmailContact);
  };

  return (
    <EuiPanel hasShadow={false} paddingSize="none">
      {emailContacts?.map(emailContact => (
        <EmailAddressLine
          emailContact={emailContact}
          border={true}
          onUpdate={onUpdate}
          key={emailContact.key}
        />
      ))}
      <EuiFlexItem>
        <EuiButton
          id="add-email-button"
          onClick={addNewField}
          fill
          size="s"
          iconType="plusInCircle"
          iconSide="right"
          style={{ alignSelf: 'flex-end' }}>
          Add a new email address
        </EuiButton>
      </EuiFlexItem>
    </EuiPanel>
  );
};

export default EmailAddress;

import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import EmailAddressLine from './emaill-address';
import AddEditEmail from './add-edit-email';
import { EmailContact } from '@lib/domain/email-address';

export type Props = {
  emailContacts: EmailContact[];
  onUpdate: (update: EmailContact) => void;
};

const EmailAddress: FunctionComponent<Props> = ({
  emailContacts,
  onUpdate,
}) => {
  return (
    <EuiPanel hasShadow={false} paddingSize="none">
      {emailContacts.map(emailContact => (
        <EmailAddressLine
          emailContact={emailContact}
          key={emailContact.key}
          border={true}
          onUpdate={onUpdate}
        />
      ))}
      <AddEditEmail onUpdate={onUpdate} />
    </EuiPanel>
  );
};

export default EmailAddress;

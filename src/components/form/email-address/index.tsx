import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import EmailAddressLine from './emaill-address';
import AddEditEmail from './add-edit-email';
import { Contact } from '@lib/domain/person';

export type Props = {
  contacts: Contact[];
};

const EmailAddress: FunctionComponent<Props> = ({ contacts }) => {
  function filterContactsByEmail(contacts: Contact[]): Contact[] {
    return contacts.filter(
      contact => contact.contact && contact.contact.type === 'EMAIL'
    );
  }

  const filteredContacts = filterContactsByEmail(contacts);
  return (
    <EuiPanel hasBorder={true} paddingSize="s">
      {filteredContacts.map((contact: Contact, i) => (
        <EmailAddressLine contact={contact} key={i} border={true} />
      ))}
      <AddEditEmail />
    </EuiPanel>
  );
};

export default EmailAddress;

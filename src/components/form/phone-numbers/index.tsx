import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import PhoneNumberLine from './phone-number';
import AddEditNumber from './add-edit-number';
import { Contact } from '@lib/domain/person';

export type Props = {
  contacts: Contact[];
};

const PhoneNumbers: FunctionComponent<Props> = ({ contacts }) => {
  function filterContactsByNumber(contacts: Contact[]): Contact[] {
    return contacts.filter(contact => contact.contact.type !== 'EMAIL');
  }
  const filteredContacts = filterContactsByNumber(contacts);
  return (
    <EuiPanel hasBorder={true} paddingSize="s">
      {filteredContacts.map((contact: Contact, i) => (
        <PhoneNumberLine contact={contact} key={i} border={true} />
      ))}
      <AddEditNumber />
    </EuiPanel>
  );
};

export default PhoneNumbers;

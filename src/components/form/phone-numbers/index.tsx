import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import PhoneNumberLine from './phone-number';
import AddEditNumber from './add-edit-number';
import { PhoneContact } from '@lib/domain/phone-numbers';

export type Props = {
  phoneContacts: PhoneContact[];
  onUpdate: (data: PhoneContact) => void;
};

const PhoneNumbers: FunctionComponent<Props> = ({
  phoneContacts,
  onUpdate,
}) => {
  return (
    <EuiPanel hasShadow={false} paddingSize="none">
      {phoneContacts.map(phoneContact => (
        <PhoneNumberLine
          phoneContact={phoneContact}
          key={phoneContact.key}
          border={true}
          onUpdate={onUpdate}
        />
      ))}
      <AddEditNumber onUpdate={onUpdate} />
    </EuiPanel>
  );
};

export default PhoneNumbers;

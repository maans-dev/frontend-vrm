import { FunctionComponent, useContext } from 'react';
import { EuiButton, EuiFlexItem, EuiPanel } from '@elastic/eui';
import { PhoneContact } from '@lib/domain/phone-numbers';
import PhoneNumberLine from './phone-number';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useAnalytics } from '@lib/hooks/useAnalytics';

export type Props = {
  phoneContacts: PhoneContact[];
  onUpdate: (data: PhoneContact) => void;
};

const PhoneNumbers: FunctionComponent<Props> = ({
  phoneContacts,
  onUpdate,
}) => {
  const { nextId } = useContext(CanvassingContext);
  const { trackCustomEvent } = useAnalytics();
  const addNewField = () => {
    const newPhoneContact: PhoneContact = {
      value: '',
      type: '',
      key: nextId(),
      category: 'PHONE',
      canContact: true,
      confirmed: true,
    };
    onUpdate(newPhoneContact);

    trackCustomEvent('Contact Details', 'Add a new phone number');
  };

  return (
    <EuiPanel hasShadow={false} paddingSize="none">
      {phoneContacts?.map(phoneContact => (
        <PhoneNumberLine
          phoneContact={phoneContact}
          key={phoneContact.key}
          border={true}
          onUpdate={onUpdate}
        />
      ))}
      <EuiFlexItem>
        <EuiButton
          id="add-phone-button"
          onClick={addNewField}
          fill
          size="s"
          iconType="plusInCircle"
          iconSide="right"
          style={{ alignSelf: 'flex-end' }}>
          Add a new phone number
        </EuiButton>
      </EuiFlexItem>
    </EuiPanel>
  );
};

export default PhoneNumbers;

import EmailAddress from '@components/form/email-address';
import PhoneNumbers from '@components/form/phone-numbers';
import { EuiComboBox, EuiFormRow } from '@elastic/eui';
import { EmailContact } from '@lib/domain/email-address';
import { Contact } from '@lib/domain/person';
import { Language } from '@lib/domain/person-enum';
import {
  EmailUpdate,
  LanguageUpdate,
  PersonUpdate,
  PhoneUpdate,
} from '@lib/domain/person-update';
import { PhoneContact } from '@lib/domain/phone-numbers';
import { FunctionComponent, useState } from 'react';

interface Props {
  language: string;
  contacts: Contact[];
  onLanguageChange: (update: PersonUpdate<LanguageUpdate>) => void;
  onPhoneChange: (update: PersonUpdate<PhoneUpdate>) => void;
  onEmailChange: (update: PersonUpdate<EmailUpdate>) => void;
}

function getLanguageEnumValue(language: string): Language {
  switch (language) {
    case 'AFRIKAANS':
      return Language.AFRIKAANS;
    case 'ENGLISH':
      return Language.ENGLISH;
    case 'ISINDEBELE':
      return Language.ISINDEBELE;
    case 'ISIXHOSA':
      return Language.ISIXHOSA;
    case 'ISIZULU':
      return Language.ISIZULU;
    case 'SEPEDI':
      return Language.SEPEDI;
    case 'SESOTHO':
      return Language.SESOTHO;
    case 'SETSWANA':
      return Language.SETSWANA;
    case 'SISWATI':
      return Language.SISWATI;
    case 'TSHIVENDA':
      return Language.TSHIVENDA;
    case 'XITSONGA':
      return Language.XITSONGA;
    default:
      throw new Error(`Invalid language: ${language}`);
  }
}

const ContactDetails: FunctionComponent<Props> = ({
  language,
  contacts,
  onLanguageChange,
  onPhoneChange,
  onEmailChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    getLanguageEnumValue(language)
  );
  const languageOptions = Object.values(Language).map(languageOption => ({
    label: languageOption,
    value: languageOption,
  }));
  const handleLanguageChange = (
    selectedOptions: {
      label: string;
      value: string;
    }[]
  ) => {
    const selectedLanguageValue = selectedOptions[0]?.value;
    if (selectedLanguageValue) {
      setSelectedLanguage(selectedLanguageValue as Language);

      onLanguageChange({
        field: 'language',
        data:
          language !== selectedLanguageValue
            ? (selectedLanguageValue as Language)
            : null,
      });
    }
  };
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>(
    contacts
      .filter(contact => contact.category !== 'EMAIL')
      .map(contact => ({
        key: contact.key,
        value: contact?.value,
        type: contact.type,
        canContact: contact.canContact,
      }))
  );
  const handlePhoneNumberChange = (data: PhoneContact) => {
    if (phoneContacts.find(contact => contact?.key === data.key)) {
      if (data?.deleted) {
        // Remove
        setPhoneContacts([...phoneContacts.filter(c => c.key !== data.key)]);
      } else {
        // Update
        setPhoneContacts(
          phoneContacts.map(contact =>
            contact.key === data.key ? data : contact
          )
        );
      }
    } else {
      // Add
      setPhoneContacts([...phoneContacts, data]);
    }

    const update = { ...data };
    const prev = contacts.find(contact => contact.key === update.key);
    if (prev) {
      if (prev.value === update.value || prev.value === update.value)
        delete update.value;
      if (prev.type === update.type) delete update.type;
      if (prev.canContact === update.canContact) delete update.canContact;
    }
    onPhoneChange({ field: 'contacts', data: update });
  };
  const [emailContacts, setEmailContacts] = useState<EmailContact[]>(
    contacts
      .filter(contact => contact.category === 'EMAIL')
      .map(contact => ({
        key: contact.key,
        value: contact?.value || contact.value,
        type: contact.type,
        canContact: contact.canContact,
      }))
  );
  const handleEmailChange = (data: EmailContact) => {
    if (emailContacts.find(contact => contact?.key === data.key)) {
      if (data?.deleted) {
        // Remove
        setEmailContacts([...emailContacts.filter(c => c.key !== data.key)]);
      } else {
        // Update
        setEmailContacts(
          emailContacts.map(contact =>
            contact.key === data.key ? data : contact
          )
        );
      }
    } else {
      // Add
      setEmailContacts([...emailContacts, data]);
    }

    const update = { ...data };
    const prev = contacts.find(contact => contact.key === update.key);
    if (prev) {
      if (prev.value === update.value || prev.value === update.value)
        delete update.value;
      if (prev.type === update.type) delete update.type;
      if (prev.canContact === update.canContact) delete update.canContact;
    }
    onEmailChange({ field: 'contacts', data: update });
  };

  return (
    <>
      <EuiFormRow display="rowCompressed" label="Language">
        <EuiComboBox
          compressed
          isClearable={false}
          aria-label="Select voter language(s)"
          placeholder="Select voter language(s)"
          singleSelection={{ asPlainText: true }}
          options={languageOptions}
          selectedOptions={[
            { value: selectedLanguage, label: selectedLanguage },
          ]}
          onChange={handleLanguageChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone Numbers">
        <PhoneNumbers
          phoneContacts={phoneContacts}
          onUpdate={handlePhoneNumberChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Email Addresses">
        <EmailAddress
          emailContacts={emailContacts}
          onUpdate={handleEmailChange}
        />
      </EuiFormRow>
    </>
  );
};

export default ContactDetails;

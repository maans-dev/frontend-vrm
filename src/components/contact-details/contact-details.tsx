import PhoneNumbers from '@components/form/phone-numbers';
import {
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui';
import { EmailContact } from '@lib/domain/email-address';
import { Contact } from '@lib/domain/person';
import { Language, Salutation } from '@lib/domain/person-enum';
import {
  EmailUpdate,
  GivenNameUpdate,
  LanguageUpdate,
  PersonUpdate,
  PhoneUpdate,
} from '@lib/domain/person-update';
import { PhoneContact } from '@lib/domain/phone-numbers';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { FunctionComponent, useEffect, useState } from 'react';
import EmailAddress from '@components/form/email-address';
import { useAnalytics } from '@lib/hooks/useAnalytics';

interface Props {
  language: string;
  salutation: Salutation;
  contacts: Contact[];
  deceased: boolean;
  givenName: string;
  onLanguageChange: (update: PersonUpdate<LanguageUpdate>) => void;
  onSalutationChange: (update: PersonUpdate<LanguageUpdate>) => void;
  onPhoneChange: (update: PersonUpdate<PhoneUpdate>) => void;
  onEmailChange: (update: PersonUpdate<EmailUpdate>) => void;
  onPersonChange: (update: PersonUpdate<GivenNameUpdate>) => void;
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
    case null:
      return null;
    default:
      return Language.ENGLISH;
  }
}

const ContactDetails: FunctionComponent<Props> = ({
  language,
  salutation,
  contacts,
  onLanguageChange,
  onSalutationChange,
  onPhoneChange,
  onEmailChange,
  deceased,
  givenName,
  onPersonChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    getLanguageEnumValue(language)
  );
  const languageOptions = Object.values(Language).map(languageOption => ({
    label: languageOption,
    value: languageOption,
  }));
  const [givenNameInternal, setGivenNameInternal] = useState<string>(
    givenName || ''
  );
  const { trackCustomEvent } = useAnalytics();

  const [selectedSalutation, setSelectedSalutation] =
    useState<Salutation>(salutation);

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
      trackCustomEvent('Contact Details', 'Language change');
    }
  };

  const handleSalutationChange = (
    selectedOptions: {
      label: string;
      value: string;
    }[]
  ) => {
    const selected = selectedOptions[0]?.value;
    if (selected) {
      setSelectedSalutation(selected as Salutation);

      onSalutationChange({
        field: 'salutation',
        data: salutation !== selected ? (selected as Language) : null,
      });
      trackCustomEvent('Contact Details', 'Salutation selected');
    }
  };

  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>(
    contacts
      ?.filter(contact => contact.category !== 'EMAIL')
      .map(contact => ({
        key: contact.key,
        value: contact?.value,
        type: contact.type,
        category: contact.category,
        canContact: contact.canContact,
      }))
  );
  const handlePhoneNumberChange = (data: PhoneContact) => {
    if (phoneContacts?.find(contact => contact?.key === data.key)) {
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
      ?.filter(contact => contact.category === 'EMAIL')
      .map(contact => ({
        key: contact.key,
        value: contact?.value || contact.value,
        type: contact.type,
        category: contact.category,
        canContact: contact.canContact,
      }))
  );
  const handleEmailChange = (data: EmailContact) => {
    if (emailContacts?.find(contact => contact?.key === data.key)) {
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
  const handleGivenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGivenNameInternal(e.target.value);
    const update: PersonUpdate<GivenNameUpdate> = {
      field: 'givenName',
      data: e.target.value,
    };
    onPersonChange(update);
  };
  useCanvassFormReset(() => {
    setSelectedLanguage(getLanguageEnumValue(language));
    setGivenNameInternal(givenName);
    setPhoneContacts(
      contacts
        ?.filter(contact => contact.category !== 'EMAIL')
        .map(contact => ({
          key: contact.key,
          value: contact?.value,
          type: contact.type,
          category: contact.category,
          canContact: contact.canContact,
        }))
    );
    setEmailContacts(
      contacts
        ?.filter(contact => contact.category === 'EMAIL')
        .map(contact => ({
          key: contact.key,
          value: contact?.value || contact.value,
          type: contact.type,
          category: contact.category,
          canContact: contact.canContact,
        }))
    );
  });

  useEffect(() => {
    setSelectedLanguage(getLanguageEnumValue(language));
    setGivenNameInternal(givenName);
    setPhoneContacts(
      contacts
        ?.filter(contact => contact.category !== 'EMAIL')
        .map(contact => ({
          key: contact.key,
          value: contact?.value,
          type: contact.type,
          category: contact.category,
          canContact: contact.canContact,
        }))
    );
    setEmailContacts(
      contacts
        ?.filter(contact => contact.category === 'EMAIL')
        .map(contact => ({
          key: contact.key,
          value: contact?.value || contact.value,
          type: contact.type,
          category: contact.category,
          canContact: contact.canContact,
        }))
    );
  }, [contacts, deceased, givenName, language]);

  return (
    <>
      <EuiFlexGroup responsive={true}>
        <EuiFlexItem grow={false} style={{ width: '160px' }}>
          <EuiFormRow display="rowCompressed" label="Salutation">
            <EuiComboBox
              compressed
              isClearable={false}
              aria-label="Salutation"
              placeholder="Select salutation"
              singleSelection={{ asPlainText: true }}
              options={Object.values(Salutation).map(option => ({
                label: option,
                value: option,
              }))}
              selectedOptions={
                selectedSalutation
                  ? [{ value: selectedSalutation, label: selectedSalutation }]
                  : []
              }
              onChange={handleSalutationChange}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiFormRow display="rowCompressed" label="Preferred name">
            <EuiFieldText
              id="preferredName"
              name="preferredName"
              compressed
              autoComplete="off"
              value={givenNameInternal}
              placeholder="Enter a preferred name"
              onChange={handleGivenNameChange}
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="m" />

      <EuiFormRow display="rowCompressed" label="Language">
        <EuiComboBox
          compressed
          isClearable={false}
          aria-label="Select voter language(s)"
          placeholder="Select voter language(s)"
          singleSelection={{ asPlainText: true }}
          options={languageOptions}
          selectedOptions={
            selectedLanguage
              ? [{ value: selectedLanguage, label: selectedLanguage }]
              : []
          }
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

import EmailAddress from '@components/form/email-address';
import PhoneNumbers from '@components/form/phone-numbers';
import { EuiComboBox, EuiFormRow } from '@elastic/eui';
import { Contact } from '@lib/domain/person';
import { Language } from '@lib/domain/person-enum';
import { LanguageUpdate, PersonUpdate } from '@lib/domain/person-update';
import { FunctionComponent, useState } from 'react';

interface Props {
  language: string;
  contacts: Contact[];
  onLanguageChange: (update: PersonUpdate<LanguageUpdate>) => void;
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
        <PhoneNumbers contacts={contacts} />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Email Addresses">
        <EmailAddress contacts={contacts} />
      </EuiFormRow>
    </>
  );
};

export default ContactDetails;

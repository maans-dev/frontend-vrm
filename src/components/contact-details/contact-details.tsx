import EmailAddress from '@components/form/email-address';
import PhoneNumbers from '@components/form/phone-numbers';
import { EuiComboBox, EuiFormRow } from '@elastic/eui';
import { Contact, Contact2 } from '@lib/domain/person';
import { FunctionComponent } from 'react';

export type Props = {
  language: string;
  contacts: Contact[];
};

const languages = [
  { value: 'AFRIKAANS' },
  { value: 'ENGLISH' },
  { value: 'ISINDEBELE' },
  { value: 'ISIXHOSA' },
  { value: 'ISIZULU' },
  { value: 'SEPEDI' },
  { value: 'SESOTHO' },
  { value: 'SETSWANA' },
  { value: 'SISWATI' },
  { value: 'TSHIVENDA' },
  { value: 'XITSONGA' },
];

const ContactDetails: FunctionComponent<Props> = ({ language, contacts }) => {
  const getSelectedOption = (value: string) => {
    const option = languages.find(option => option.value === value);
    return option
      ? [{ value: option.value.toUpperCase(), label: option.value }]
      : [];
  };
  const selectedOptions = getSelectedOption(language);

  const options = languages.map(language => ({
    label: language.value,
    value: language.value,
  }));

  return (
    <>
      <EuiFormRow display="rowCompressed" label="Language">
        <EuiComboBox
          compressed
          isClearable={false}
          aria-label="Select voter language(s)"
          placeholder="Select voter language(s)"
          singleSelection={{ asPlainText: true }}
          options={options}
          selectedOptions={selectedOptions}
          onChange={() => null}
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

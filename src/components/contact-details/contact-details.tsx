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
  { value: 'AFRIKAANS', text: 'Afrikaans' },
  { value: 'ENGLISH', text: 'English' },
  { value: 'ISINDEBELE', text: 'IsiNdebele' },
  { value: 'ISIXHOSA', text: 'IsiXhosa' },
  { value: 'ISIZULU', text: 'IsiZulu' },
  { value: 'SEPEDI', text: 'Sepedi' },
  { value: 'SESOTHO', text: 'Sesotho' },
  { value: 'SETSWANA', text: 'Setswana' },
  { value: 'SISWATI', text: 'Siswati' },
  { value: 'TSHIVENDA', text: 'Tshivenda' },
  { value: 'XITSONGA', text: 'Xitsonga' },
];

const ContactDetails: FunctionComponent<Props> = ({ language, contacts }) => {
  const getSelectedOption = (value: string) => {
    const option = languages.find(option => option.value === value);
    return option ? [{ label: option.text }] : [];
  };
  const selectedOptions = getSelectedOption(language);
  const getOptions = (value: string) => {
    const options = languages.filter(option => option.value !== value);
    return options.map(option => ({ label: option.text }));
  };
  const options = getOptions(language);

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

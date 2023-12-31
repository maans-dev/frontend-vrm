import { validatePhoneInput } from '@components/form/form-utils';
import { Contact } from '@lib/domain/person';
import { useState, useEffect } from 'react';

export const usePhoneValidation = (
  phoneContactValue: string,
  phoneType: string,
  updatedContacts: Contact[],
  personContacts: Contact[]
): { isValid: boolean; validationError: string } => {
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const { valid, errorText } = validatePhoneInput(
      phoneContactValue,
      phoneType,
      updatedContacts,
      personContacts
    );
    setValidationError(errorText);
    setIsValid(valid);
  }, [phoneType, phoneContactValue, updatedContacts, personContacts]);

  return { isValid, validationError };
};

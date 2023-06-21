import { isEmail } from '@components/form/form-utils';
import { Contact } from '@lib/domain/person';
import { useState, useEffect } from 'react';

export const useEmailValidation = (
  value: string,
  updatedContacts: Contact[],
  personContacts: Contact[]
): { isValid: boolean; validationError: string } => {
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const { valid, errorText } = isEmail(
      value,
      updatedContacts,
      personContacts
    );
    setValidationError(errorText);
    setIsValid(valid);
  }, [value, updatedContacts, personContacts]);

  return { isValid, validationError };
};

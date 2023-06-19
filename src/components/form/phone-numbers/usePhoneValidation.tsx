import { validatePhoneInput } from '@components/form/form-utils';
import { useState, useEffect } from 'react';

export const usePhoneValidation = (
  phoneContactValue: string,
  phoneType: string
): { isValid: boolean; validationError: string } => {
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const { valid, errorText } = validatePhoneInput(
      phoneContactValue,
      phoneType
    );
    setValidationError(errorText);
    setIsValid(valid);
  }, [phoneType, phoneContactValue]);

  return { isValid, validationError };
};

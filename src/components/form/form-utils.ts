import { Contact } from '@lib/domain/person';

export function isEmail(value: string): boolean {
  const pattern =
    /^[A-Za-z0-9.!#$%&''*+-/=?^_`{|}~]+@[A-Za-z0-9.-]+[.][A-Za-z]+$/i;
  const valid = pattern.test(value);
  return valid;
}

export function isPhoneNumber(value: string): boolean {
  const pattern = /^((?:\+27|27|0027)|0)(\d{9})$/i;
  const valid = pattern.test(value);
  return valid;
}

export function isCellPhoneNumber(value: string): boolean {
  if (isPhoneNumber(value)) {
    for (const p of [/^0[67]/i, /^08[1-4]/i]) {
      if (p.test(value)) return true;
    }
  }
  return false;
}

export function isIntlPhoneNumber(value: string): boolean {
  const pattern = /^(?:\+[1-9])(\d{4,18})$/;
  const excludePattern = /^(?:\+27|27|0027)(\d{0,18})$/;
  const cleanedPhoneNumber = value ? value.trim() : '';

  return (
    pattern.test(cleanedPhoneNumber) && !excludePattern.test(cleanedPhoneNumber)
  );
}

export const validatePhoneInput = (
  inputValue: string,
  selectedPhoneType: string
) => {
  let valid = false;
  let errorText = '';

  if (inputValue) {
    switch (selectedPhoneType) {
      case 'CELL':
        valid = isCellPhoneNumber(inputValue);
        errorText = valid ? '' : 'Enter a valid mobile number';
        break;
      case 'WORK':
      case 'HOME':
        valid = isPhoneNumber(inputValue);
        errorText = valid ? '' : 'Enter a valid phone number';
        break;
      case 'INTERNATIONAL':
        valid = isIntlPhoneNumber(inputValue);
        errorText = valid ? '' : 'Enter a valid international number';
        break;
      default:
        valid = false;
        errorText = 'Please select a phone type';
    }
  } else {
    valid = false;
    errorText = 'Enter a phone number';
  }

  return { valid, errorText: valid ? '' : errorText };
};

export const validateContactInformation = (
  updatedContacts: Contact[],
  personContacts: Contact[]
) => {
  let isValid = true;
  let emailErrorText = '';
  let phoneErrorText = '';

  const emailContacts = updatedContacts.filter(
    contact => contact.category === 'EMAIL'
  );

  const uniqueEmails = new Set<string>();
  const duplicateEmails: Contact[] = [];

  for (const contact of emailContacts) {
    if (contact.deleted || contact.canContact || contact.confirmed) {
      continue;
    }
    if (!isEmail(contact.value)) {
      isValid = false;
      emailErrorText = 'Please enter a valid email address';
      break;
    }

    const isDuplicateInUpdated =
      emailContacts.filter(c => c.value === contact.value).length > 1;

    const isDuplicateInPerson = personContacts.some(
      c => c.value === contact.value
    );

    if (isDuplicateInUpdated || isDuplicateInPerson) {
      duplicateEmails.push(contact);
    } else {
      uniqueEmails.add(contact.value);
    }
  }

  if (duplicateEmails.length > 0) {
    isValid = false;
    emailErrorText = 'Duplicate email addresses found';
  }

  if (isValid) {
    const phoneContacts = updatedContacts.filter(
      contact => contact.category !== 'EMAIL'
    );

    const uniquePhoneNumbers = new Set<string>();
    const duplicatePhoneNumbers: Contact[] = [];

    for (const contact of phoneContacts) {
      if (contact.deleted || contact.canContact || contact.confirmed) {
        continue;
      }
      const contactType =
        contact?.type ||
        personContacts?.find(personContact => personContact.key === contact.key)
          ?.type;

      const { valid: contactIsValid, errorText: contactValidationError } =
        validatePhoneInput(contact.value, contactType);

      if (!contactIsValid) {
        isValid = false;
        phoneErrorText = contactValidationError;
        break;
      }

      const isDuplicateInUpdated =
        phoneContacts.filter(c => c.value === contact.value).length > 1;

      const isDuplicateInPerson = personContacts.some(
        c => c.value === contact.value && c.type === contactType
      );

      if (isDuplicateInUpdated || isDuplicateInPerson) {
        duplicatePhoneNumbers.push(contact);
      } else {
        uniquePhoneNumbers.add(contact.value);
      }
    }

    if (duplicatePhoneNumbers.length > 0) {
      isValid = false;
      phoneErrorText = 'Duplicate phone numbers found';
    }
  }

  const errorText = isValid ? '' : `${emailErrorText} ${phoneErrorText}`;

  return { isValid, errorText };
};

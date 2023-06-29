import { Contact } from '@lib/domain/person';

export function isEmail(
  value: string,
  updatedContacts?: Contact[],
  personContacts?: Contact[]
): { valid: boolean; errorText: string } {
  const emailContacts =
    updatedContacts?.filter(contact => contact.category === 'EMAIL') || [];

  const uniqueEmails = new Set<string>();
  const duplicateEmails: Contact[] = [];

  for (const contact of emailContacts) {
    const isDuplicateInUpdated =
      emailContacts.filter(c => c.value === contact.value).length > 1;

    const isDuplicateInPerson =
      personContacts?.some(c => c.value === contact.value) || false;

    if (isDuplicateInUpdated || isDuplicateInPerson) {
      duplicateEmails.push(contact);
    } else {
      uniqueEmails.add(contact.value);
    }
  }

  if (duplicateEmails.length > 0) {
    return { valid: false, errorText: 'Duplicate email addresses found' };
  }

  const pattern =
    /^[A-Za-z0-9.!#$%&''*+-/=?^_`{|}~]+@[A-Za-z0-9.-]+[.][A-Za-z]+$/i;
  const valid = pattern.test(value);
  const errorText = valid ? '' : 'Enter a valid email address';

  return { valid, errorText };
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
  selectedPhoneType: string,
  updatedContacts?: Contact[],
  personContacts?: Contact[]
) => {
  const phoneContacts =
    updatedContacts?.filter(contact => contact.category !== 'EMAIL') || [];

  const uniquePhoneNumbers = new Set<string>();
  const duplicatePhoneNumbers: Contact[] = [];

  for (const contact of phoneContacts) {
    const isDuplicateInUpdated =
      phoneContacts.filter(c => contact.value && c.value === contact.value)
        .length > 1;

    const isDuplicateInPerson =
      personContacts?.some(
        c => c.value === contact.value && c.type === selectedPhoneType
      ) || false;

    if (isDuplicateInUpdated || isDuplicateInPerson) {
      duplicatePhoneNumbers.push(contact);
    } else {
      if (contact?.value) {
        uniquePhoneNumbers.add(contact.value);
      }
    }
  }

  let isValid = true;
  let phoneErrorText = '';

  if (
    duplicatePhoneNumbers.length > 0 &&
    duplicatePhoneNumbers.map(n => n.value)?.includes(inputValue)
  ) {
    isValid = false;
    phoneErrorText = 'Duplicate phone numbers found';
  } else if (inputValue) {
    switch (selectedPhoneType) {
      case 'CELL':
        isValid = isCellPhoneNumber(inputValue);
        phoneErrorText = isValid ? '' : 'Enter a valid mobile number';
        break;
      case 'WORK':
      case 'HOME':
        isValid = isPhoneNumber(inputValue);
        phoneErrorText = isValid ? '' : 'Enter a valid phone number';
        break;
      case 'INTERNATIONAL':
        isValid = isIntlPhoneNumber(inputValue);
        phoneErrorText = isValid ? '' : 'Enter a valid international number';
        break;
      default:
        isValid = false;
        phoneErrorText = 'Please select a phone type';
    }
  } else {
    isValid = false;
    phoneErrorText = 'Enter a phone number';
  }

  return { valid: isValid, errorText: isValid ? '' : phoneErrorText };
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
    if (contact.deleted || typeof contact.key === 'string') {
      continue;
    }

    const { valid: emailIsValid, errorText: emailValidationError } = isEmail(
      contact.value,
      updatedContacts,
      personContacts
    );

    if (!emailIsValid) {
      isValid = false;
      emailErrorText = emailValidationError;
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
      if (contact.deleted || typeof contact.key === 'string') {
        continue;
      }

      const contactType =
        contact?.type ||
        personContacts?.find(personContact => personContact.key === contact.key)
          ?.type;

      const { valid: phoneIsValid, errorText: phoneValidationError } =
        validatePhoneInput(
          contact.value,
          contactType,
          updatedContacts,
          personContacts
        );

      if (!phoneIsValid) {
        isValid = false;
        phoneErrorText = phoneValidationError;
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

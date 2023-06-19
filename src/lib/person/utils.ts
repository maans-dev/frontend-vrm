import { Person } from '@lib/domain/person';

export interface Names {
  salutation?: string;
  givenName?: string;
  firstName?: string;
  surname: string;
}
export const renderName = (names: Names | Partial<Person>) => {
  const title = names?.salutation ? `${names?.salutation} ` : '';
  if (names?.givenName) return `${title}${names.givenName} ${names.surname}`;
  if (!names?.surname) return 'Unknown';
  return `${title}${names.firstName} ${names.surname}`;
};

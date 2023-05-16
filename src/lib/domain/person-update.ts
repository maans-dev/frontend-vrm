import { CommentsType } from './comments';
import { EmailContact } from './email-address';
import { Address, Affiliation, Field, Membership, Person } from './person';
import { Language } from './person-enum';
import { PhoneContact } from './phone-numbers';

export interface PersonUpdateRequest extends Person {
  username: number;
  field: Field[];
}

export interface PersonUpdate<T> {
  field: string;
  data: T;
}

export type GeneralUpdate =
  | CanvassUpdate
  | AffiliateUpdate
  | LanguageUpdate
  | PhoneUpdate
  | EmailUpdate
  | DeceasedUpdate
  | GivenNameUpdate
  | CommentsUpdate
  | FieldsUpdate
  | AddressUpdate
  | MembershipUpdate;

export type KeyedUpdate =
  | CanvassUpdate
  | AffiliateUpdate
  | PhoneUpdate
  | EmailUpdate
  | CommentsUpdate
  | FieldsUpdate;

export type AffiliateUpdate = Pick<Affiliation, 'key' | 'name'>;
export type LanguageUpdate = Language;
export type PhoneUpdate = Pick<
  Partial<PhoneContact>,
  'key' | 'type' | 'value' | 'canContact' | 'deleted' | 'confirmed'
>;
export type EmailUpdate = Pick<
  Partial<EmailContact>,
  'key' | 'type' | 'value' | 'canContact' | 'deleted' | 'confirmed'
>;
export type DeceasedUpdate = boolean;
export type GivenNameUpdate = string;
export type FieldsUpdate = Pick<Partial<Field>, 'key' | 'field' | 'value'>;
export type CommentsUpdate = Pick<
  Partial<CommentsType>,
  'key' | 'type' | 'value' | 'archived'
>;
export type CanvassUpdate = {
  key?: number;
  date?: string | Date;
  activity?: string;
  type?: string | 'FACE' | 'TELE';
};
export type AddressUpdate = Partial<Address>;

type AssertHasFields = (
  fields: ReadonlyArray<string>,
  value: unknown
) => asserts value is Record<string, unknown>;
export const assertHasFields: AssertHasFields = (fields, value) => {
  if (typeof value !== 'object') throw new Error('Not an object');
  for (const field of fields) {
    if (field in value === false) throw new Error(`Missing field [${field}]`);
  }
};
export type MembershipUpdate = Partial<Membership>;

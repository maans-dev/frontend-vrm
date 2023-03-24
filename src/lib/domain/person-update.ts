import { CommentsType } from './comments';
import { EmailContact } from './email-address';
import { Affiliation, Field, Person } from './person';
import { Language } from './person-enum';
import { PhoneContact } from './phone-numbers';
import { VoterTagsType } from './voter-tags';

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
  | VoterTagsUpdate
  | CommentsUpdate;

export type KeyedUpdate =
  | CanvassUpdate
  | AffiliateUpdate
  | PhoneUpdate
  | EmailUpdate
  | VoterTagsUpdate
  | CommentsUpdate;

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
export type VoterTagsUpdate = VoterTagsType;
export type CommentsUpdate = Pick<
  Partial<CommentsType>,
  'key' | 'type' | 'value' | 'archived'
>;
export type CanvassUpdate = {
  key?: number;
  date?: Date;
  activity?: string;
  type?: string | 'FACE' | 'TELE';
};

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

import { CommentsType } from './comments';
import { EmailContact } from './email-address';
import { Affiliation, Field } from './person';
import { Language } from './person-enum';
import { PhoneContact } from './phone-numbers';
import { VoterTagsType } from './voter-tags';

export interface PersonUpdate<T> {
  field: string;
  data: T;
}

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
export type GeneralUpdate = AffiliateUpdate &
  LanguageUpdate &
  PhoneUpdate &
  EmailUpdate;
export type VoterTagsUpdate = Pick<
  Partial<VoterTagsType>,
  'key' | 'field' | 'value' 
>;
export type CommentsUpdate = Pick<
Partial<CommentsType>,
'key' | 'type' | 'value' | 'archived' 
>;

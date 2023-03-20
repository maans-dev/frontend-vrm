import { Affiliation } from './person';
import { Language } from './person-enum';
import { PhoneContact } from './phone-numbers';

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

export type GeneralUpdate = AffiliateUpdate & LanguageUpdate & PhoneUpdate;

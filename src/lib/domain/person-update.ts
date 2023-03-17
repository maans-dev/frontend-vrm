import { Affiliation } from './person';
import { Language } from './person-enum';

export interface PersonUpdate<T> {
  field: string;
  data: T;
}

export type AffiliateUpdate = Pick<Affiliation, 'key' | 'name'>;
export type LanguageUpdate = Language;

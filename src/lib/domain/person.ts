import { Moment } from 'moment';
import { GeocodedAddressSource, Province } from './person-enum';

export interface Person {
  key: number;
  idNumber: string;
  salutation: string;
  firstName: string;
  givenName: string;
  surname: string;
  gender: string;
  affiliation: Affiliation;
  affiliation_date: string;
  livingStructure: LivingStructure;
  livingStructure_date: Date;
  registeredStructure: RegisteredStructure;
  registeredStructure_date: Date;
  address: Address;
  address_date: Date;
  language: string;
  race: string;
  dob: string;
  citizenship: string;
  deceased: boolean;
  colourCode: ColourCode;
  enabled: boolean;
  createdBy: number;
  created: Date;
  modifiedBy: string;
  modified: Date;
  membership: Membership;
  canvassedBy: CanvassedBy;
  canvassed: Date;
  event: string;
  comments: Comment[];
  contacts: Contact[];
  fields: Field[];
}

export interface Membership {
  daAbroad: boolean;
  daYouth: boolean;
  dawnOptOut: boolean;
  expired: string;
  expiry: string;
  initialJoin: string;
  newRenewal: string;
  key?: string;
  type?: string;
  payment: {
    amount: number;
    date: string;
    key: string;
    membershipNumber: string;
    receiptNumber: string;
    recruitedBy: number;
    referenceNumber: string;
    type: string;
    years: number;
  };
  branchOverride: boolean;
  person: number;
  status: string;
  status_json: null | any;
  structure: Structure;
}

export interface PartyTags {
  key: string;
  category: string;
  type: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  value?: Partial<Value>;
  isNew?: boolean;
  createdBy: number;
  modifiedBy: number;
  created: string;
  modified: string;
}

export interface Value {
  values: boolean[];
  default?: boolean;
}

export interface Key {
  key: number;
  firstName: string;
  surname: string;
}

export interface MetaData {
  refresh: string;
}

export interface Type {
  key: string;
  createdBy: number;
  modifiedBy: number;
  modified: Date;
  created: Date;
  category: string;
  name: string;
  description: string;
  metaData: MetaData;
}
export interface Activity {
  key: string;
  type: Type;
  name: string;
}

export interface CanvassedBy {
  key: number;
  surname: null | string;
  firstName: null | string;
  givenName: null | string;
  date?: Date | Moment;
  activity: Activity;
}

export interface Campaign {
  key: string;
  name: string;
  type: Type;
  description: any;
  active: boolean;
  createdBy: number;
  modifiedBy: number;
  created: string;
  modified: string;
}

export interface CampaignMetaData {
  key: string;
  createdBy: number;
  modifiedBy: number;
  modified: string;
  created: string;
  category: string;
  name: string;
  description: string;
  metaData?: unknown;
}

export interface Affiliation {
  key: string;
  name: string;
  description: string;
  confirmed: boolean;
  active: boolean;
  createdBy: number;
  modifiedBy: number;
  created: Date;
  modified: Date;
}

export interface LivingStructure {
  key: string;
  province: string;
  municipality: string;
  municipalityCatB: string;
  region_code: string;
  region: string;
  constituency_code: string;
  constituency: string;
  constituencyHead: string;
  ward: number;
  wardCouncillor: string;
  prCouncillor: string;
  votingDistrict_id: number;
  votingDistrict: string;
  active: boolean;
}

export interface RegisteredStructure {
  key: string;
  province: string;
  municipality: string;
  municipalityCatB: string;
  region_code: string;
  region: string;
  constituency_code: string;
  constituency: string;
  constituencyHead: string;
  ward: number;
  wardCouncillor: string;
  prCouncillor: string;
  votingDistrict_id: number;
  votingDistrict: string;
  active: boolean;
}

export enum ProvinceEnum {
  EC = 'Eastern Cape',
  FS = 'Free State',
  GT = 'Gauteng',
  KZN = 'Kwazulu-Natal',
  LP = 'Limpopo',
  MP = 'Mapumalanga',
  NW = 'North West',
  NC = 'Northern Cape',
  WC = 'Western Cape',
  FC = 'Foreign Country',
}

export interface Structure {
  key: string;
  formatted: string;
  province?: string;
  province_enum?: ProvinceEnum;
  municipality: string;
  municipalityCatB: string;
  region_code: string;
  region: string;
  type: string;
  constituency_code: string;
  constituency: string;
  constituencyHead: string;
  ward: string | number;
  wardCouncillor?: string;
  prCouncillor: string;
  votingDistrict_id: number | string;
  votingDistrict: string;
  active: boolean;
  deleted?: boolean;
  country_code: string;
  key_hash?: null | string;
  key_text?: null | string;
  latitude?: null | number;
  longitude?: null | number;
  search_hash?: null | string;
  search_text?: null | string;
  municipalityShortName?: string;
  municipalityType?: string;
  municipalityWardCount?: number;
  ward_num?: number;
}

export interface Address {
  key: string;
  type: string;
  formatted: string;
  geocodeSource?: GeocodedAddressSource;
  province?: string;
  province_enum?: Province;
  city: string;
  comment: string;
  suburb: string;
  buildingNo: string;
  buildingName: string;
  streetName: string;
  streetNo: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  structure: Partial<Structure>;
  createdBy: number;
  modifiedBy: number;
  created: Date;
  modified: Date;
  deleted: boolean;
  // TODO: the fields below are actually from the geocoding API. This should probably be split off into it's own type
  votingDistrict_id?: number | string;
  votingDistrict?: string;
  service?: {
    type: string;
    emoji: string;
  };
}

export interface ColourCode {
  key: number;
  name: string;
  description: string;
  colour: string;
  active: boolean;
  createdBy: number;
  created: Date;
  modified: Date;
  modifieBby: number;
}

export interface CreatedBy {
  key?: number;
  firstName: string;
  surname: string;
}

export interface ModifiedBy {
  key: number;
  firstName: string;
  surname: string;
}

export interface Comment {
  key: string | number;
  person: number;
  type?: string;
  value: string;
  archived: boolean;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
  created: any;
  modified: any;
}

export interface Contact {
  key: string;
  category: string;
  type: string;
  person: number;
  value: string;
  canContact: boolean;
  confirmed: string;
  createdBy: number;
  modifiedBy: number;
  created: string;
  modified: string;
}

export interface Value {
  values: boolean[];
  default?: boolean;
}

export interface FieldMetaData {
  key: string;
  category: string;
  type: string;
  code: string;
  name: string;
  description: string;
  active_status: boolean;
  value: Value;
  createdBy: number;
  modifiedBy: number;
  created: Date;
  modified: Date;
  readOnly: boolean;
}

export interface Field {
  key: string | number;
  person: number;
  field?: Partial<FieldMetaData>;
  value?: boolean;
  deleted?: boolean;
  created: Date;
  modified: Date;
  createdBy: number;
  modifiedBy: number;
}

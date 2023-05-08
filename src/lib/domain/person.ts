export interface Person {
  key: number;
  idNumber: string;
  salutation: string;
  firstName: string;
  givenName: string;
  surname: string;
  gender: string;
  affiliation: Affiliation;
  affiliation_date: Date;
  livingStructure: LivingStructure;
  livingStructure_date: Date;
  registeredStructure: RegisteredStructure;
  registeredStructure_date: Date;
  address: Address;
  address_date: Date;
  language: string;
  race: string;
  dob: number;
  citizenship: string;
  deceased: boolean;
  colourCode: ColourCode;
  enabled: boolean;
  createdBy: number;
  created: Date;
  modifiedBy: string;
  modified: Date;
  canvassedBy: CanvassedBy;
  canvassed: Date;
  event: string;
  comments: Comment[];
  contacts: Contact[];
  fields: Field[];
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
  key: Key;
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

export interface Structure {
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
  deleted?: boolean;
}

export interface Address {
  key: string;
  type: string;
  formatted: string;
  province: string;
  city: string;
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

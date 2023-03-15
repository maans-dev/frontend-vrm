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
  modifiedBy: string; //TODO: this field should contain a name
  modified: Date;
  canvassedBy: number;
  canvassed: Date;
  event: string;
  comments: Comment[];
  contacts: Contact[];
  fields: Field[];
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
}

export interface Address {
  key: string;
  type: string;
  formatted: string;
  province: string;
  city: string;
  suburb: string;
  streetName: string;
  streetNo: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  structure: Structure;
  createdBy: number;
  modifiedBy: number;
  created: Date;
  modified: Date;
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
  key: number;
  firstName: string;
  surname: string;
}

export interface ModifiedBy {
  key: number;
  firstName: string;
  surname: string;
}

export interface Comment {
  key: string;
  person: number;
  type: string;
  value: string;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
  created: any;
  modified: any;
}

export interface Contact2 {
  key: string;
  type: string;
  value: string;
  source?: any;
  created: Date;
  modified: Date;
  createdBy: number;
  canContact: boolean;
  modifiedBy: number;
}

export interface Contact {
  key: string;
  type: string;
  person: number;
  contact: Contact2;
  canContact: boolean;
  confirmed: Date;
  createdBy: number;
  modifiedBy: number;
  created: Date;
  modified: Date;
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
  key: string;
  person: number;
  field: Partial<FieldMetaData>;
  value: unknown;
  created: Date;
  modified: Date;
  createdBy: number;
  modifiedBy: number;
}

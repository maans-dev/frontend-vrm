import { Moment } from 'moment';
import { ModifiedBy } from './person';

export interface PersonHistoryResponse {
  count: number;
  values: PersonEvent[];
}

export interface PersonEvent {
  key: string;
  activity: Activity;
  person: number;
  category: Category;
  type: CategoryClass;
  metaData: ValueMetaData;
  status_id: null;
  status_json: StatusJSON | null;
  status: Status;
  latitude: null;
  longitude: null;
  source: null;
  canvassedBy: CanvassedBy;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
  recruitedBy: RecruitedBy;
}

export interface Activity {
  key: string;
  name: string;
  type: CategoryClass;
  active: boolean;
  status: Status;
  criteria: null;
  metaData: null;
  status_id: null;
  description: null;
  status_json: null;
  results_number: null;
  criteria_number: null;
}

export enum Status {
  Done = 'DONE',
  Error = 'ERROR',
}

export interface CategoryClass {
  key: string;
  name: TypeEnum;
  active: boolean;
  category: CategoryEnum;
  metaData: CategoryMetaData | null;
  description: Description;
}

export interface Category {
  key: string;
  name: 'canvass' | 'personcreate' | 'membership' | 'datacleanup' | string;
  active: boolean;
  category: CategoryEnum;
  metaData: CategoryMetaData | null;
  description: Description;
}

export enum CategoryEnum {
  Campaign = 'CAMPAIGN',
  Canvass = 'CANVASS',
  Voterinteraction = 'VOTERINTERACTION',
  Admin = 'ADMIN',
}

export enum Description {
  CanvassVoterInteraction = 'Canvass Voter Interaction',
  CurrentCampaigns = 'Current campaigns',
  Telephone = 'Telephone',
}

export interface CategoryMetaData {
  refresh: Refresh;
}

export enum Refresh {
  The1Day = '1 day',
}

export enum TypeEnum {
  Canvass = 'canvass',
  Current = 'current',
  Phone = 'phone',
  MembershipRew = 'membership-new',
  MembershipRenew = 'membership-renew',
  MembershipResigned = 'membership-resigned',
  MembershipRerminated = 'membership-terminated',
  MembershipExpired = 'membership-expired',
  MembershipCapture = 'membership-capture',
  MembershipExtended = 'membership-extended',
  MembershipComment = 'membership-comment',
}

export interface CanvassedBy {
  key: number;
  surname: Surname;
  firstName: FirstName;
  givenName: null | string;
  date?: Date | Moment;
}

export interface RecruitedBy {
  key: number;
  surname: Surname;
  firstName: FirstName;
  givenName: null | string;
  date?: Date | Moment;
}

export interface CreatedBy {
  key: number;
  surname: Surname;
  firstName: FirstName;
  givenName: null | string;
  date?: Date | Moment;
}

export enum FirstName {
  Ryan = 'RYAN',
  SamuelJacobus = 'SAMUEL JACOBUS',
}

export enum Surname {
  Cloete = 'CLOETE',
  Purchase = 'PURCHASE',
}

export interface ValueMetaData {
  person: Person;
}

export interface Person {
  key: number;
  address: Address;
  canvass: Canvass;
  membership?: any; // TODO: complete type for this object
  fields?: FieldElement[];
}

export interface Address {
  city?: string;
  suburb?: string;
  province?: string;
  streetNo?: string;
  structure?: Structure;
  postalCode?: string;
  streetName?: string;
  search_hash?: string;
  search_text?: string;
  deleted?: boolean;
  latitude?: number;
  longitude?: number;
  buildingNo?: string;
  buildingName?: string;
  ward?: string;
  region?: string;
  distance?: number;
  ward_num?: number;
  region_code?: string;
  constituency?: string;
  municipality?: string;
  province_enum?: string;
  votingDistrict?: string;
  municipalityCatB?: string;
  municipalityType?: string;
  constituency_code?: string;
  votingDistrict_id?: string;
  municipalityShortName?: string;
  municipalityWardCount?: number;
}

export interface Structure {
  deleted?: boolean;
  votingDistrict?: number;
  votingDistrict_id?: number;
}

export interface Canvass {
  key: number;
  date: Date;
  type: TypeEnum;
  activity: string;
}

export interface FieldElement {
  key?: string;
  value: boolean;
  field?: FieldField;
}

export interface FieldField {
  key: string;
}

export interface StatusJSON {
  data: Data;
  name: string;
  status: number;
  message: string;
}

export interface Data {
  name: string;
}

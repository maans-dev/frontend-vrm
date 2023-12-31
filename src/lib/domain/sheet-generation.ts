export interface SheetGeneration {
  key: string;
  name: string;
  structures: Structure[];
  campaign: Campaign;
  files: SheetGenFile[];
  status: string;
  metaData: any;
  active: boolean;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
  requestReason: string;
  rejectedReason: string;
  results_number: number | string;
  message?: string;
  type: SheetType;
}

interface SheetType {
  active: boolean;
  name;
}
export interface SheetGenFile {
  key: string;
  name_text: string;
}

interface Structure {
  key: string;
  key_text: string;
  key_hash: string;
  search_text: string;
  search_hash: string;
  type: string;
  country_code: string;
  province_enum: string;
  municipality: string;
  municipalityCatB: string;
  region_code: string;
  region: string;
  constituency_code: string;
  constituency: string;
  constituencyHead: string;
  ward: string;
  wardCouncillor: string;
  prCouncillor: string;
  votingDistrict_id: string;
  votingDistrict: string;
  latitude: string;
  longitude: string;
  formatted: string;
  active: boolean;
  province: string;
}
interface Campaign {
  key: string;
  name: string;
  type: string;
  description: any;
  active: boolean;
}
export interface Files {
  key?: string;
  name?: string;
  link?: string;
  expiry?: string;
}
interface CreatedBy {
  date: string;
  key: number;
  firstName: string;
  surname: string;
}
interface ModifiedBy {
  key: number;
  date: string;
  firstName: string;
  surname: string;
}

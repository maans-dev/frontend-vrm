export interface Structure {
  province_enum: string;
  province: string;
  region_code?: string;
  region?: string;
  constituency_code?: string;
  constituency?: string;
  type: string;
  municipalityCatB?: string;
  municipality?: string;
  municipalityShortName?: string;
  municipalityType?: string;
  municipalityWardCount?: number;
  ward?: string;
  ward_num?: number;
  votingDistrict_id?: string;
  votingDistrict?: string;
}

export enum StructureType {
  VotingDistrict = 'votingdistrict',
  Ward = 'ward',
  Constituency = 'constituency',
  Municipality = 'municipality',
  Region = 'region',
  Province = 'province',
  Unkown = 'unknown',
}

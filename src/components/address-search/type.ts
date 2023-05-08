export interface IAddressInfo {
  city: string;
  formatted: string;
  latitude: number;
  longitude: number;
  postalCode: string;
  province: string;
  service: string;
  streetName: string;
  streetNo: string;
  structure: IStructure;
  suburb: string;
  type: string;
}

export interface IStructure {
  constituency: string;
  constituency_code: string;
  emoji: string;
  municipality: string;
  municipalityCatB: string;
  municipalityShortName: string;
  province: string;
  province_enum: string;
  region: string;
  region_code: string;
  service: string;
  votingDistrict: string;
  votingDistrict_id: string;
  ward: string;
}

export type PartyTags = PartyTags2[] | PartyTags[];

export interface PartyTags2 {
  key: string;
  category: string;
  type: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  value?: Value;
  createdBy: number;
  modifiedBy: number;
  created: string;
  modified: string;
}

export interface Value {
  values: boolean[];
  default: boolean;
}

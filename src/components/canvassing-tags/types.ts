interface FieldSubset {
  category: string;
  code: string;
  description: string;
  active: boolean;
}
export interface ITags {
  fields: {
    field: FieldSubset;
  }[];
}

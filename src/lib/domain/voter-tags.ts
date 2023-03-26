export type VoterTagsType = {
  key?: string | number;
  person?: number;
  field?: {
    key: string | number;
    description?: string;
    isNew?: boolean;
  };
  value?: boolean;
};

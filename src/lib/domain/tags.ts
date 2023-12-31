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

export const CanvassingTagCodes = ['WR', 'ASTREG', 'DR', 'WV', 'CNVT', 'IRWNR'];

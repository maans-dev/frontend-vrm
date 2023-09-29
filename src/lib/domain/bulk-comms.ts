import { Campaign, CreatedBy, ModifiedBy, Structure } from './person';
import { SheetGenFile } from './sheet-generation';

type BulkCommsType = {
  active: boolean;
  category: string;
  description: string;
  key: string;
  metaData: {
    delimiter: string;
  };
  modified: string;
  name: string;
};

export interface BulkComms {
  key: string;
  cost: string;
  sender: string;
  name: string;
  structures: Structure[];
  campaign: Campaign;
  files: SheetGenFile[];
  status: string;
  metaData: {
    cost: number;
    files: string[];
    sender: string;
    message: string;
  };
  active: boolean;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
  requestReason: string;
  rejectedReason: string | null;
  results_number: number | string;
  message: string | undefined;
  messageCharacters: string;
  type: BulkCommsType;
}

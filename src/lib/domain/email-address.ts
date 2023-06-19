export interface EmailContact {
  key: string | number;
  value: string;
  type?: 'WORK' | 'HOME' | string;
  category: 'PHONE' | 'CUSTOM' | string;
  canContact?: boolean;
  confirmed?: boolean;
  deleted?: boolean;
}

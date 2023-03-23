export interface PhoneContact {
  key: string | number;
  value: string;
  type: 'CELL' | 'WORK' | 'HOME' | 'INTERNATIONAL' | 'CUSTOM' | string;
  category: 'PHONE' | 'CUSTOM' | string;
  canContact?: boolean;
  confirmed?: boolean;
  deleted?: boolean;
}

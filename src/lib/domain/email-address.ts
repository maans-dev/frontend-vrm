export interface EmailContact {
  key: string | number;
  value: string;
  type?: 'EMAIL' | string;
  canContact: boolean;
  confirmed?: boolean;
  deleted?: boolean;
}

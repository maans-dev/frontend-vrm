import { Moment } from 'moment';

export interface MembershipEvent {
  key: string;
  createdBy: PersonReference;
  modifiedBy: PersonReference;
  modified: string | Moment;
  created: string | Moment;
  category: string;
  name: 'new' | 'expired' | 'renew' | 'resigned' | 'terminated' | 'comment';
  description: string;
  metaData: MetaData;
}

export interface MetaData {
  type: 'system' | 'member';
  payment?: Payment;
  reason?: string;
}

export interface Payment {
  membershipNumber: string;
  years: number;
  amount: number;
  type: string;
  reference: string;
  referredBy: ReferredBy | null;
}

export interface ReferredBy {
  key: number;
  firstName: string;
  surname: string;
}

export interface PersonReference {
  key: number;
  firstName: string;
  surname: string;
}

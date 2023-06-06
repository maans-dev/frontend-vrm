import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  export interface Session {
    accessToken: string;
    error?: string;
    disclosureAccepted?: boolean;
    user: {
      givenName: string;
      surname: string;
      dob: number;
      idNumber: string;
      darn: number;
      roles: string[];
    } & DefaultSession['user'];
  }

  export interface User {
    user: {
      darn_number: number;
      givenname_text: string;
      firstname_text: string;
      surname_text: string;
      dob_number: string;
    } & DefaultUser['user'];
  }

  export interface Profile {
    roles: string[];
  }

  export interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    id: string;
    darn: number;
    givenName: string;
    surname: string;
    dob: string;
    roles: string;
  }
}

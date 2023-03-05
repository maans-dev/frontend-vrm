export interface VoterSearchResult {
  darn: number;
  dob: Date;
  name: string;
  address: string;
  livingVd: {
    name: string;
    number: number;
  };
  colour: string;
  status: 'Registered' | 'Not Registered';
  registeredVd: {
    name: string;
    number: number;
  };
  involvement: ('Activist' | 'Member' | 'Public Rep' | 'Staff')[];
}

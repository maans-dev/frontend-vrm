export interface PersonSearchParams {
  identity: string;
  dob: number | string;
  surname: string;
  firstName: string;
  email: string;
  phone: string;
  contactability?: string;
}

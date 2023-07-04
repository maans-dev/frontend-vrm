export interface PersonSearchParams {
  identity: string;
  dob: number | string;
  surname: string;
  firstName: string;
  names: string;
  email: string;
  phone: string;
  contactability?: string;
  eligible?: boolean;
}

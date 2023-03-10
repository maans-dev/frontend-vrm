export interface IComment {
  message: string;
  date: Date;
  user: string;
  type: 'user' | 'member' | 'system';
}

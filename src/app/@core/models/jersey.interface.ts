import { TimestampInterface } from './timestamp.interface';

export interface IJersey extends TimestampInterface {
  _id: string;
  name: string;
  color?: string;
  thumbnail?: string;
}

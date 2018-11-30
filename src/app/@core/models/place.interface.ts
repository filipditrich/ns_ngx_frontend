import { TimestampInterface } from './timestamp.interface';

export interface IPlace extends TimestampInterface {
  _id: string;
  name: string;
}

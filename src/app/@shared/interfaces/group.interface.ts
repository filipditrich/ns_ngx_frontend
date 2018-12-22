import { TimestampInterface } from './timestamp.interface';

export interface IGroup extends TimestampInterface {
  _id: string;
  name: string;
}

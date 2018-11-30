import { IUser } from './user.interface';

export interface TimestampInterface {
  createdBy?: IUser;
  createdAt?: Date;
  updatedBy?: IUser;
  updatedAt?: Date;
}

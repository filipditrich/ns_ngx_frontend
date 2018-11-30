import { UserRoles } from '../enums/user.enum';
import { ITeam } from './team.interface';

export interface IUser {
  _id: string; // TODO: ObjectId?
  token?: string;
  name: string;
  username: string;
  email: string;
  roles: UserRoles[];
  team: ITeam;
  number: Number;
}

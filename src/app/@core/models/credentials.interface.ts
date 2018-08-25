import {Team} from '../enums/team.enum';
import {UserRoles} from '../enums/user.enum';

export interface ICredentials {
  username: string;
  password: string;
}


/**
 * Registration related interfaces
 */
export interface IRegistrationRequest {
  email: string;
  name: string;
}

export interface IRegistrationCredentials {
  username: string;
  password: string;
  name: string;
  email?: string;
  team: Team;
  roles?: UserRoles;

}

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
  team: string;
  roles?: UserRoles;
}

export interface ICredentialReset {
  email?: string;
  username?: string;
}

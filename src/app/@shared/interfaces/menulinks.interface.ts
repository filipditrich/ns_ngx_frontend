import { UserRoles } from '../enums/user.enum';

export interface IMenuGroup {
  id: string;
  title: string;
  children: IMenuLink[];
}

export interface IMenuLink {
  id: string;
  path: string;
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  roles: UserRoles[];
}

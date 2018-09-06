import {Injectable} from "@angular/core";

@Injectable()
export class RoleCheckService {
  private userRoles;
  constructor() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.userRoles = user.roles;
  }

  isAdmin() {
    return this.userRoles.indexOf('admin') >= 0;
  }

  isPlayer() {
    return this.userRoles.indexOf('player') >= 0;
  }
}

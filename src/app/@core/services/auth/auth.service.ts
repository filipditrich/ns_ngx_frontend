import { Injectable } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static storeUserData(user: IUser, token: string) {
    user.token = token;
    user.roles.sort();
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  public static logOut() {
    return new Promise(resolve => {
      sessionStorage.removeItem('user');
      resolve();
    });
  }

  constructor() { }

  isTokenValid() {
    const token = this.loadToken();
    return token ? !new JwtHelperService().isTokenExpired(token) : false;
  }

  loadToken() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user).token : false;
  }

}

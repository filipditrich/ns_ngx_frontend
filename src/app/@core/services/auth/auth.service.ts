import { Injectable } from '@angular/core';
import { IUser } from '../../../@shared/interfaces/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public static storeUserData(user: IUser, token: string) {
    user.token = token;
    user.roles.sort();
    localStorage.setItem('user', JSON.stringify(user));
  }

  public static logOut() {
    return new Promise(resolve => {
      localStorage.removeItem('user');
      resolve();
    });
  }

  constructor() { }

  isTokenValid() {
    const token = this.loadToken();
    return token ? !new JwtHelperService().isTokenExpired(token) : false;
  }

  loadToken() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : false;
  }

}

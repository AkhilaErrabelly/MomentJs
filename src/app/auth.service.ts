import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Constants } from './Constants';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  //VALIDATE_USER: string;
  constructor(private http: Http) { }
  userRoles: any = {
    'admin': 'Administrator',
    'manager': 'Manager',
    'outReachAgent': 'Outreach Agent',
    'system': 'System'
  };

  hasAuthenticated() {
    return !!window.sessionStorage.getItem('auth_key');
  }

  getLoggedInUserName() {
    return window.localStorage.getItem('user_name');
  }

  getLoggedInUserFullName() {
    return window.sessionStorage.getItem('user_fullName');
  }

  getLoggedInUserRole() {
    return window.sessionStorage.getItem('user_role');
  }

  getLoggedInUserId() {
    return window.sessionStorage.getItem('user_id');
  }

  getLoggedInUserFirstName() {
    return window.sessionStorage.getItem('user_firstName');
  }

  getAvailableRoles() {
    return this.userRoles;
  }

  authenticatenow(usercreds) {
    var headers = new Headers();
    var creds = '?username=' + usercreds.username + '&password=' + usercreds.password;
    var url = Constants.VALIDATE_USER + creds;
    //var url = Constants.VALIDATE_USER;


    headers.append('Content-Type', 'application/json');
    return new Promise((resolve, reject) => {
      this.http.post(url, creds, { headers: headers }).subscribe((data) => {
        let userInfo;
        if (data.ok) {
          userInfo = data.json()[0];
          console.log("userInfo: " + JSON.stringify(userInfo));
          window.sessionStorage.setItem('auth_key', this.token());
          window.sessionStorage.setItem('user_firstName', userInfo.FNAME);
          window.sessionStorage.setItem('user_fullName', userInfo.FNAME + ' ' + userInfo.LNAME);
          window.localStorage.setItem('user_name', userInfo.USER_NAME);
          window.sessionStorage.setItem('user_role', userInfo.USER_ROLE_NAME);
          window.sessionStorage.setItem('user_id', userInfo.USER_ID);
          this.isAuthenticated = true;
        }
        else {
          console.log("Error occured during authentication api call. Details:  " + JSON.stringify(data));
        }
        resolve(userInfo);
      },
    this.handleError(reject));
    });
  }

  private handleError(reject) {
    return function (error: any) {
      let msg = JSON.parse(error._body)
      let errMsg = (msg) ? msg.Message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.log(errMsg); // log to console instead
      reject(errMsg);
    }
  }

  private randomSequence() {
    let i = Math.random().toString(36).substr(2);
    console.log("randomSequence output: " + i);
    return i;
  };

  private token() {
    let i = this.randomSequence() + this.randomSequence();
    console.log("token: " + i);
    return i; // longer and strengthen
  };
}

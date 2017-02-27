import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './app/login/login.component.html',
  styleUrls: ['./app/login/login.css']
})
export class LoginComponent implements OnInit {
  errorMsg: string;
  saveMessage:any;
  localUser = {
    username: '',
    password: ''
  }
  constructor(private auth: AuthService, private router: Router) {
    if(auth.hasAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
  }

 login() {
    let checknow = this.auth.authenticatenow(this.localUser);

    checknow.then((res: any) => {
   /*   console.log("response from authenticatenow call : " + JSON.stringify(res));*/ 
      let roles = this.auth.getAvailableRoles();
      if (roles.outReachAgent == res.USER_ROLE_NAME) {
        this.router.navigate(['/outreach'], {queryParams: {}});
      } else if (roles.manager == res.USER_ROLE_NAME || roles.admin == res.USER_ROLE_NAME) {
        this.router.navigate(['/measure-summary-reports'], {queryParams: {}});
      } else {
        console.log('Invalid user');

        this.router.navigate(['/login']);
        this.errorMsg = 'Failed to login';
      }


    }, (reason)=>{
      console.log("Error from authenticatenow call : " + JSON.stringify(reason));
      this.errorMsg = reason;
    })
  }
}

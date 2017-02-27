import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import { LoginComponent } from './login/login.component';
import {Location} from '@angular/common';
import {AuthService} from './auth.service';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  directives: [ROUTER_DIRECTIVES]//, DATEPICKER_DIRECTIVES, FormsModule]
})
export class AppComponent  implements OnInit {
  title = 'Angular poc';
  constructor(private location:Location,
   private router: Router,
    private authService: AuthService) {
       location.go(location.path());
  }

  ngOnInit() {
    $("#wrapper").on('click', '#menu-toggle', function(e) {
      console.log("click on #menu-toggle");
        //e.preventDefault();
        e.stopPropagation();

        $("#wrapper").toggleClass("toggled");
    });
     $("#wrapper").on('click', '#menu-toggle-2', function(e) {
        //e.preventDefault();
        e.stopPropagation();
        $("#wrapper").toggleClass("toggled-2");
        $('#menu ul').hide();
    });
 }

  isRouterActive(routerPath: string) {
    if(this.location.path().indexOf(routerPath) >= 0) {
      return true;
    }
    return false;
  }

  logout() {
    window.sessionStorage.removeItem('auth_key');
    this.router.navigate(['/login']);
  }

  getUserFullName() {
    return this.authService.getLoggedInUserFullName();
  }

  getUserRole() {
    return this.authService.getLoggedInUserRole();
  }

  getRoles(){
    return this.authService.getAvailableRoles();
  }

  isManager(){
    return this.getUserRole() == this.getRoles().manager;
  }

  isAdministrator(){
    return this.getUserRole() == this.getRoles().admin;
  }

  isAgent(){
    return this.getUserRole() == this.getRoles().outReachAgent;
  }
}

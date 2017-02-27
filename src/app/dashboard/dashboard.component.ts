import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app/dashboard/dashboard.component.html',
  styleUrls: ['./app/dashboard/dashboard.css'],
  directives: [ROUTER_DIRECTIVES]
})

export class DashboardComponent {

  constructor(private router: Router) {}
}

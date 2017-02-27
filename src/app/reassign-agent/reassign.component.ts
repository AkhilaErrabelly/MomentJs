  
import {Component, ChangeDetectorRef} from '@angular/core';
import {Router, ROUTER_DIRECTIVES } from '@angular/router';
import {UserService} from '../services/user.service';
import {AuthService} from '../auth.service';
import {QueuingService} from '../services/queuing.service';
import {DATEPICKER_DIRECTIVES, TimepickerComponent} from '../../ng2-bootstrap/ng2-bootstrap';
import {TimerWrapper} from '@angular/core/src/facade/async';
import { FormControl, FormArray, FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
@Component({
  templateUrl :'./app/reassign-agent/reassign.html',
    styleUrls  : ['./app/reassign-agent/reassign.css'],
    directives : [ROUTER_DIRECTIVES, DATEPICKER_DIRECTIVES, TimepickerComponent],
    providers: [UserService, AuthService, QueuingService]
})

export class ReassignAgentComponent {
  activeUsers: any;

  fromAgentId: number;
  toAgentId: number = undefined;
  fromDate: any = new Date();
  toDate: any;
  jQuery: any;

  formSubmitted: boolean = false;
  fromDateOpen: boolean = false;
  toDateOpen: boolean = false;
  calendarClicked: boolean = false;
  isReAssignSuccess: boolean = false;
  assignError: boolean = false;
   reassignAgentSaveSuccessful: boolean = false;

  constructor(private userService: UserService,
    private authService: AuthService,
    private queuingService : QueuingService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.init();
  }

  ngAfterViewInit() {
    var comp = this;
    TimerWrapper.setTimeout(() => {
      this.jQuery('datepicker').parent().on('click', function() {
        comp.calendarClicked = true;
      });
      this.jQuery('.input-group-addon').on('click', function() {
        comp.calendarClicked = true;
      });
    }, 2000);
  }

  private init() {
    let oneWeekFromNow = new Date();
    oneWeekFromNow.setDate( oneWeekFromNow.getDate() + 7);
    this.toDate = oneWeekFromNow;

    this.userService.getActiveUsers("agent").subscribe((response1)=>{
        this.activeUsers = response1;
    });

    this.jQuery = $ || {};
    var comp = this;


    this.jQuery(document.body).click(function(event) {
      TimerWrapper.setTimeout(() => {
        if(comp.calendarClicked) {
          comp.calendarClicked = false;
        } else {
          comp.fromDateOpen = comp.toDateOpen = false;
        }
      }, 100);
    });
  }

  getFromAgents() {
    let fromAgents = this.activeUsers;
    if(this.toAgentId) {
      fromAgents = this.activeUsers.filter((agent) => {
        return agent.User_ID != this.toAgentId
      });
    }
    return fromAgents;
  }

  getToAgents() {
    this.toAgentId = undefined;
    let toAgents = this.activeUsers;
    if(this.fromAgentId) {
      toAgents = this.activeUsers.filter((agent) => {
        return agent.User_ID != this.fromAgentId
      });
    }
    return toAgents;
  }

  reAssignAgetns() {
    this.formSubmitted = true;
    this.assignError =  false;
    if(this.validateReAssignDetails()) {
      this.queuingService.reAssignAgentCalls(
        this.fromAgentId,
        this.toAgentId,
        this.getFormattedDate(this.fromDate),
        this.getFormattedDate(this.toDate)
      ).subscribe((response) => {
        this.isReAssignSuccess = true;
         this.reassignAgentSaveSuccessful = true;
      }, (error)=> {
        this.assignError = true;
       
      });
    }
  }

  validateReAssignDetails() {
    let loggedInUserId = Number( this.authService.getLoggedInUserId());
    return this.fromAgentId != loggedInUserId && this.toAgentId != loggedInUserId;
  }

  getFormattedDate(dt) {
    if(dt) {
      return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    }
    return;
  }
    refreshPage() {
    window.location.reload();
  }
  print() {
    window.print();
  }
}

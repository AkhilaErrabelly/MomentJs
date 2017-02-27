import {arrayLooseIdentical} from '@angular/core/src/linker/view_utils';
import {Date} from '@angular/platform-browser/src/facade/lang';
import {filter} from 'rxjs/operator/filter';
import {Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES } from '@angular/router';
import {UserService} from '../services/user.service';
import {AuthService} from '../auth.service';
import {MeasureCompletionReportsService} from './measure-completion-reports.service';
import {DATEPICKER_DIRECTIVES, TimepickerComponent} from '../../ng2-bootstrap/ng2-bootstrap';
import {TimerWrapper} from '@angular/core/src/facade/async';
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormBuilder, FormGroup, Validators, ValidatorFn} from '@angular/forms';


@Component({
  templateUrl: './app/measure-completion-reports/measure-completion-reports.html',
  styleUrls: ['./app/measure-completion-reports/measure-completion-reports.css'],
  directives : [ROUTER_DIRECTIVES, DATEPICKER_DIRECTIVES, TimepickerComponent],
  providers: [MeasureCompletionReportsService, UserService]
})
export class MeasureCompletionReportsComponent implements AfterViewInit {
  filters: Array<any> = [
    { 'name': "Agent", 'reportBy': 'Agent' },
    { 'name': "Measure", 'reportBy': 'Measure' }
  ];

  reportBy: string = this.filters[0].reportBy;
  jQuery: any;
  formSubmitted: boolean = false;
  fromDateOpen: boolean = false;
  toDateOpen: boolean = false;
  calendarClicked: boolean = false;
  datePickerOpen: boolean = false;
  toDate: any = new Date();
  fromDate: any = new Date(this.toDate.getFullYear(), this.toDate.getMonth(),-60);
  measureCompletionReportsDetails: Array<any>;
  currentSortColumn: string;
    currentSortOrder: string;

  constructor(
    private measureCompletionReportsService: MeasureCompletionReportsService,
    private userService: UserService,
    private authService: AuthService,
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.jQuery = $ || {};
    var comp = this;


    this.jQuery(document.body).click(function (event) {
      TimerWrapper.setTimeout(() => {
        if (comp.calendarClicked) {
          comp.calendarClicked = false;
        } else {
          comp.fromDateOpen = comp.toDateOpen = false;
        }
      }, 100);
    });
  }
 ngOnInit(){
     this.formSubmitted = true;
    this.measureCompletionReportsService.getMeasureCompletionReports(
      this.getFormattedDate(this.fromDate),
      this.getFormattedDate(this.toDate)
    ).subscribe((response) => {
      this.measureCompletionReportsDetails = response;
    });
 }
  ngAfterViewInit() {
    var comp = this;
    TimerWrapper.setTimeout(() => {
      this.jQuery('datepicker').parent().on('click', function () {
        comp.calendarClicked = true;
      });
      this.jQuery('.input-group-addon').on('click', function () {
        comp.calendarClicked = true;
      });
    }, 2000);
  }
  getFormattedDate(dt) {
    if (dt) {
      var st = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
      return st;
    }
  }
  getMeasureCompletionReports() {
    this.formSubmitted = true;
    this.measureCompletionReportsService.getMeasureCompletionReports(
      this.getFormattedDate(this.fromDate),
      this.getFormattedDate(this.toDate)
    ).subscribe((response) => {
      this.measureCompletionReportsDetails = response;
    });
  }

  print(){
    let ele: any = document.querySelector('.navbar');
    ele.style.display = 'none';
    ele = document.querySelector('#sidebar-wrapper');
    ele.style.display = 'none';
    ele = document.querySelector('.panel-wrapper');
    ele.style.display = 'none';
    window.print();
    return;
    }
       private getSortClass(sortByColumn){
     let sortClass = ['fa fa-sort'];
     if(sortByColumn == this.currentSortColumn) {
       sortClass = this.currentSortOrder == 'ASC' ? ['fa fa-sort-desc'] : ['fa fa-sort-asc'];
     }
     return sortClass;
    }
       sortColumn(data, sortByColumn, type) {
      if(sortByColumn == this.currentSortColumn) {
        this.currentSortOrder = this.currentSortOrder == 'ASC' ? 'DESC' : 'ASC';
      } else {
        this.currentSortColumn = sortByColumn;
        this.currentSortOrder = 'ASC';
      }
      data.sort((obj1, obj2) => {
        if(type == 'number') {
          let val1 = (obj1[sortByColumn]);
          let val2 = (obj2[sortByColumn]);
          if(this.currentSortOrder == 'ASC') {
            if(val1 < val2) {
              return -1
            } else if(val1 > val2) {
              return 1;
            }
            return 0;
          } else {
            if(val1 < val2) {
              return 1
            } else if(val1 > val2) {
              return -1;
            }
            return 0;
          }
        } else {
          let val1 = obj1[sortByColumn].toLowerCase();
          let val2 = obj2[sortByColumn].toLowerCase();
          if(this.currentSortOrder == 'ASC') {
            if(val1 < val2) {
              return -1
            } else if(val1 > val2) {
              return 1;
            }
            return 0;
          } else {
            if(val1 < val2) {
              return 1
            } else if(val1 > val2) {
              return -1;
            }
            return 0;
          }
        }

      })
       }

}

import { arrayLooseIdentical } from '@angular/core/src/linker/view_utils';
import { Date } from '@angular/platform-browser/src/facade/lang';
import { filter } from 'rxjs/operator/filter';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { UserService } from '../services/user.service';
import { JvionDateService } from '../services/JvionDate.service';
import { AuthService } from '../auth.service';
import { JvionDiscrepencyReportService } from './jvion-discrepency-report.service';
import { DATEPICKER_DIRECTIVES, TimepickerComponent } from '../../ng2-bootstrap/ng2-bootstrap';
import { TimerWrapper } from '@angular/core/src/facade/async';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { DateExtensions } from '../utils/dateExtensions';

@Component({
  templateUrl: './app/jvion-discrepency-report/jvion-discrepency-report.html',
  styleUrls: ['./app/jvion-discrepency-report/jvion-discrepency-report.css'],
  directives: [ROUTER_DIRECTIVES, DATEPICKER_DIRECTIVES, TimepickerComponent],
  providers: [JvionDiscrepencyReportService, UserService, JvionDateService]
})
export class JvionDiscrepencyReportComponent implements AfterViewInit {
  jQuery: any;
  dateJvion: string;
  formSubmitted: boolean = false;
  fromDateOpen: boolean = false;
  toDateOpen: boolean = false;
  calendarClicked: boolean = false;
  datePickerOpen: boolean = false;
  toDate: any = new Date();
  fromDate: any = new Date(this.toDate.getFullYear(), this.toDate.getMonth(),-60);
  jvionDiscrepencyReportsDetails: Array<any>;
  currentSortColumn: string;
  currentSortOrder: string;

  constructor(
    private jvionDiscrepencyReportService: JvionDiscrepencyReportService,
    private userService: UserService,
    private authService: AuthService,
    private jvionDateService: JvionDateService,
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.setDefaultFilterDates();
    this.jvionDateService.getJVIONDate().subscribe((response) => {
      this.dateJvion = this.getFormattedDate(new Date(response[0].Column1));
    });

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

  private setDefaultFilterDates() {
    this.router.routerState.queryParams.subscribe((params) => {
      if (params['fromDate'] && params['toDate']) {
        this.fromDate = new Date(params['fromDate']);
        this.toDate = new Date(params['toDate']);
      } 
    });
  }
  ngOnInit(){
    this.jvionDiscrepencyReportService.getJvionReconcilationDiscrepancyReport(
      this.getFormattedDate(this.fromDate),
      this.getFormattedDate(this.toDate)
    ).subscribe((response) => {
      this.jvionDiscrepencyReportsDetails = response;
      
      this.jvionDiscrepencyReportsDetails.forEach((value) =>{
        //console.log("---------------debugging start--------------");
        //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
        value.APPT_DT_TM = DateExtensions.getDate(value.APPT_DT_TM);
        //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
        //console.log("---------------debugging end--------------");
      })
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
  getJvionReconcilationDiscrepancyReport() {
    this.formSubmitted = true;
    this.jvionDiscrepencyReportService.getJvionReconcilationDiscrepancyReport(
      this.getFormattedDate(this.fromDate),
      this.getFormattedDate(this.toDate)
    ).subscribe((response) => {
      this.jvionDiscrepencyReportsDetails = response;
    });
  }
  print() {
    window.print();
  }
  private getSortClass(sortByColumn) {
    let sortClass = ['fa fa-sort'];
    if (sortByColumn == this.currentSortColumn) {
      sortClass = this.currentSortOrder == 'ASC' ? ['fa fa-sort-desc'] : ['fa fa-sort-asc'];
    }
    return sortClass;
  }
  sortColumn(data, sortByColumn, type) {
    if (sortByColumn == this.currentSortColumn) {
      this.currentSortOrder = this.currentSortOrder == 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.currentSortColumn = sortByColumn;
      this.currentSortOrder = 'ASC';
    }
    data.sort((obj1, obj2) => {
      if (type == 'number') {
        let val1 = (obj1[sortByColumn]);
        let val2 = (obj2[sortByColumn]);
        if (this.currentSortOrder == 'ASC') {
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1;
          }
          return 0;
        } else {
          if (val1 < val2) {
            return 1
          } else if (val1 > val2) {
            return -1;
          }
          return 0;
      }}
        if (type == 'date') {
        let val1 = (obj1[sortByColumn]);
        let val2 = (obj2[sortByColumn]);
        if (this.currentSortOrder == 'ASC') {
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1;
          }
          return 0;
        } else {
          if (val1 < val2) {
            return 1
          } else if (val1 > val2) {
            return -1;
          }
          return 0;
        }
      } else {
        let val1 = obj1[sortByColumn].toLowerCase();
        let val2 = obj2[sortByColumn].toLowerCase();
        if (this.currentSortOrder == 'ASC') {
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1;
          }
          return 0;
        } else {
          if (val1 < val2) {
            return 1
          } else if (val1 > val2) {
            return -1;
          }
          return 0;
        }
      }
    })

  }

  jsonToCSVConvertor(data, name) {
    this.jvionDiscrepencyReportService.jsonToCSVConvertor(data, name)
  }
}

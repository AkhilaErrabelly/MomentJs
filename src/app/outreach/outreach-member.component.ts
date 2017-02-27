import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { OutreachMemberModel, CallStatusModel } from '../services/outreach-member.model';
import { OutreachMemberService } from '../services/outreach-member.service';
import { DATEPICKER_DIRECTIVES, TimepickerComponent } from '../../ng2-bootstrap/ng2-bootstrap';
import { NgModel, NgIf, NgFor } from "@angular/common";
import { TimerWrapper } from '@angular/core/src/facade/async';
import { AuthService } from '../auth.service';
import { PhonePipe } from './orderBy.pipe';
import { DateExtensions } from '../utils/dateExtensions';


@Component({
  templateUrl: './app/outreach/outreach-member.html',
  styleUrls: ['./app/outreach/outreach.css'],
  directives: [ROUTER_DIRECTIVES, DATEPICKER_DIRECTIVES, TimepickerComponent],
  providers: [OutreachMemberService],
  pipes: [PhonePipe]
})

export class OutreachMemberComponent implements AfterViewInit {
  mmpID: number;
  outReachMembersInfo: any; //OutreachMemberModel;
  faxInfo: any;
  callStatusList: any; //Array<CallStatusModel>;
  callsHistoryInfo: any;
  currentCallInfoSaved: any;
  otherProviderindex: number = -1;
  calendarClicked: boolean = false;
  callInfoSaveSuccessful: boolean = false;
  savingCallInfo: boolean = false;
  jQuery: any;
  params: any;
  todaysDate: any = new Date();

  constructor(
    private router: Router,
    private outreachMemberService: OutreachMemberService,
    private authService: AuthService) {
    this.outReachMembersInfo = [];
    router.routerState.queryParams.subscribe((params) => {
      if (!params['mmpId']) {
        return;
      }
      // read value from queryString and + for converting string to number.
      this.mmpID = +params['mmpId'];
      this.params = params;

      outreachMemberService.getAgentOutreach(this.mmpID).subscribe((response) => {
        //todo: convert response to a new OutreachMemberModel.
        this.outReachMembersInfo = response;

        this.outReachMembersInfo.forEach((value) => {
          //console.log("---------------debugging start--------------");
          value.MSR_DUE_DT = DateExtensions.getDate(value.MSR_DUE_DT);
          value.MSR_CMPL_DT = DateExtensions.getDate(value.MSR_CMPL_DT);
          value.ENROLL_TERM_DT = DateExtensions.getDate(value.ENROLL_TERM_DT);
          value.ENROLL_EFF_DT = DateExtensions.getDate(value.ENROLL_EFF_DT);
          value.APPT_DT_TM = DateExtensions.getDate(value.APPT_DT_TM);
          value.NEXT_CALL_DT = DateExtensions.getDate(value.NEXT_CALL_DT);
          console.log("---------------debugging start--------------");
          console.log("value.MEM_DOB before momentjs conversion: ", value.MEM_DOB);
          value.MEM_DOB = DateExtensions.getDate(value.MEM_DOB);
          console.log("value.MEM_DOB after momentjs conversion: ", value.MEM_DOB);
        })
        this.callsHistoryInfo = {};
        this.callStatusList = {};
        for (let i = 0; i < this.outReachMembersInfo.length; i++) {
          // first get Call Status List
          outreachMemberService.getCallStatusList(this.outReachMembersInfo[i].MMP_ID).subscribe((response) => {
            //todo: convert response to a new CallStatus.
            this.callStatusList[this.outReachMembersInfo[i].MMP_ID] = response;
          });

          this.initializeDefaultValues(this.outReachMembersInfo[i]);
          this.outReachMembersInfo[i].previousStatus = this.outReachMembersInfo[i].APPT_STAT;
          if (this.outReachMembersInfo[0].PDR_KEY != this.outReachMembersInfo[i].PDR_KEY) {
            this.otherProviderindex = i;
          }
          outreachMemberService.getCallHistory(this.outReachMembersInfo[i].MMP_ID).subscribe((response) => {
            //todo: convert response to a new OutreachMemberModel.
            if (response && response) {
              this.callsHistoryInfo[this.outReachMembersInfo[i].MMP_ID] = response;
            }
            this.callsHistoryInfo[this.outReachMembersInfo[i].MMP_ID].forEach((value) => {
              //console.log("---------------debugging start--------------");
              //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
              value.APPT_DT_TM = DateExtensions.getDate(value.APPT_DT_TM);
              //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
              //console.log("---------------debugging end--------------");
            })
          });
        }
      });
    });

    this.jQuery = $ || {};
    var comp = this;
    this.jQuery(document.body).click(function (event) {
      TimerWrapper.setTimeout(() => {
        if (comp.calendarClicked) {
          comp.calendarClicked = false;
        } else {
          comp.outReachMembersInfo.forEach(function (info, index) {
            info.datePickerOpen = info.timePickerPickerOpen = false;
          });
        }
      }, 100);
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

  initializeDefaultValues(info) {
    if (info.APPT_STAT == 'Open' || info.APPT_STAT == 'Completed') {
      //info.backUp_APPT_DT_TM = new Date(info.APPT_DT_TM);
      info.backUp_APPT_DT_TM = DateExtensions.getDate(info.APPT_DT_TM);
      info.APPT_TM = undefined;
      info.APPT_DT_TM = undefined;
    } else {
      info.APPT_TM = this.getApptTime(info.APPT_DT_TM);
      info.APPT_DT_TM = this.getApptDate(info.APPT_DT_TM);
    }

    if (info.PDT_TYPE.toLowerCase().indexOf('medicaid') >= 0) {
      info.IS_TRPT_ELG = 'Y';
    } else {
      info.IS_TRPT_ELG = 'N';
    }
  }

  goBack() {
    let queryParamStr = '?';

    if (this.params.filterValue) {
      queryParamStr += '&filterValue=' + this.params.filterValue;
    }
    if (this.params.activeTab) {
      queryParamStr += '&activeTab=' + this.params.activeTab;
    }
    if (this.params.currentSortColumn) {
      queryParamStr += '&currentSortColumn=' + this.params.currentSortColumn;
    }
    if (this.params.currentSortOrder) {
      queryParamStr += '&currentSortOrder=' + this.params.currentSortOrder;
    }
    if (this.params.currentPage) {
      queryParamStr += '&currentPage=' + this.params.currentPage;
    }
    if (this.params.currentSortType) {
      queryParamStr += '&currentSortType=' + this.params.currentSortType;
    }
    this.router.navigateByUrl('/outreach' + queryParamStr);

    /*this.router.navigate(['/outreach'], {
      queryParams: {
        'filterValue': this.params['filterValue'],
        'activeTab': this.params['activeTab'],
        'currentSortColumn': this.params['currentSortColumn'],
        'currentSortOrder': this.params['currentSortOrder'],
        'currentPage': this.params['currentPage'],
        'currentSortType': this.params['currentSortType']
      }
    });*/
    //this.router.navigate(['/outreach']);
  }

  private filterOutReachMemberInfo(serviceResponse: Array<any>) {
    let result = serviceResponse.filter((item) => {
      if (item.MMP_ID == this.mmpID) {
        return item;
      }
    });
    return result;

  }

  getProviderDetails(index) {
    if (index != 0) {
      index = this.otherProviderindex;
    }
    return this.outReachMembersInfo[index];
  }


  setCallInfoDate($event, callInfo) {
    let dateTime = callInfo.apptDateTime;
    if (!dateTime) {
      callInfo.apptDateTime = $event;
    } else {
      callInfo.apptDateTime = $event + dateTime.substring(dateTime.indexOf(' '));
    }
  }

  setCallInfoTime($event, callInfo) {
    let dateTime = callInfo.apptDateTime;
    if (!dateTime) {
      callInfo.apptDateTime = $event;
    } else {
      callInfo.apptDateTime = dateTime.substring(0, dateTime.indexOf(' ') + 1) + $event;
    }
  }

  saveCallInfo(outreachMemberInfo) {
    this.savingCallInfo = true;
    //var  APPT_DT_TM = DateExtensions.getDate(APPT_DT_TM);
    if ((outreachMemberInfo.APPT_DT_TM && outreachMemberInfo.APPT_TM && outreachMemberInfo.APPT_STAT == 'Scheduled') || (outreachMemberInfo.APPT_STAT != 'Scheduled')) {
      if ((outreachMemberInfo.APPT_STAT == 'Open' || outreachMemberInfo.APPT_STAT == 'Completed') && outreachMemberInfo.backUp_APPT_DT_TM) {
        outreachMemberInfo.APPT_DT_TM = outreachMemberInfo.backUp_APPT_DT_TM;
      }
      console.log("save value for APPT_DT_TM: ", outreachMemberInfo.APPT_DT_TM)
      this.outreachMemberService.saveCallInfo(outreachMemberInfo).subscribe((response) => {
        this.callInfoSaveSuccessful = true;
        this.currentCallInfoSaved = outreachMemberInfo;
        if (outreachMemberInfo.CALL_STAT == 'Deceased' || outreachMemberInfo.CALL_STAT == 'Mentally/Physically Incapable' || outreachMemberInfo.CALL_STAT == 'Outreached - No Assistance Needed' || outreachMemberInfo.CALL_STAT == 'Possible Exclusion' || outreachMemberInfo.CALL_STAT == 'Termed' || outreachMemberInfo.CALL_STAT == 'Wrong Number') {
          this.goBack();
        }
      });
    }
  }

  getApptDate(dtStr) {
    let dt = DateExtensions.getDate(dtStr);
    return dt.toString() == 'Invalid Date' ? '' : dt;
  }

  getApptTime(dtStr) {
    let dt = DateExtensions.getDate(dtStr);
    let hours, minutes, meridian;
    hours = dt.getHours();
    minutes = dt.getMinutes();
    meridian = ' AM'
    if (hours >= 12) {
      if (hours > 13) {
        hours = hours - 12;
      }
      meridian = ' PM'
    }
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + meridian;
  }

  getFormattedDate(dt) {
    if (dt) {
      return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();;
    }
    return;
  }

  getTimeComponent(dateObj) {
    if (dateObj) {
      let hours = ('0' + dateObj.getHours()).slice(-2);
      let minutes = ('0' + dateObj.getMinutes()).slice(-2);
      let seconds = ('0' + dateObj.getSeconds()).slice(-2);
      return hours + ' : ' + minutes + ' : ' + seconds;
    }
    return;
  }

  onApptStatusChange($event, info) {
    if ((info.previousStatus == 'Open' && $event.srcElement.value == 'Scheduled') || $event.srcElement.value == 'Open' || info.nextStatus == 'Open') {
      if (!info.backUp_APPT_DT_TM) {
        info.backUp_APPT_DT_TM = info.APPT_DT_TM;
      }
      info.APPT_DT_TM = undefined;
      info.APPT_TM = undefined;
    }
    info.previousStatus = $event.srcElement.value;
  }
  print() {
    let ele: any = document.querySelector('.navbar');
    ele.style.display = 'none';
    ele = document.querySelector('#sidebar-wrapper');
    ele.style.display = 'none';
    ele = document.querySelector('.panel-wrapper');
    ele.style.display = 'none';
    window.print();
  }

  getFaxInfo(memKey, providerKey) {
    this.outreachMemberService.getFaxInfo(memKey, providerKey).subscribe((response) => {
      this.faxInfo = response;
      this.faxInfo.forEach((value) => {
        //console.log("---------------debugging start--------------");
        //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
        value.APPT_DT_TM = DateExtensions.getDate(value.APPT_DT_TM);
        value.MSR_DUE_DT = DateExtensions.getDate(value.MSR_DUE_DT);
        //console.log("jvionDiscrepencyReportsDetails  APPT_DT_TM before: " + value.APPT_DT_TM);
        //console.log("---------------debugging end--------------");
      })
    });
  }

  getTimeSlots() {
    var end, hour, i, mark, meridian, minute, ref, ref1, results;
    end = 19 * 60;
    var step_minutes = 15;
    results = [];
    for (mark = i = 7 * 60, ref = end, ref1 = step_minutes; ref1 > 0 ? i < ref : i > ref; mark = i += ref1) {
      hour = Math.floor(mark / 60);
      minute = mark % 60;
      hour = hour % 24;
      if (String(minute).length === 1) {
        minute = '0' + minute;
      }
      meridian = 12 <= hour ? ' PM' : ' AM';
      hour = hour % 12;
      if (!hour) {
        hour = 12;
      }
      results.push(('0' + hour).slice(-2) + ':' + minute + meridian);
    }

    return results;
  }
  onAppointmentTimeChange($event, currentInfo) {
    let dt = DateExtensions.getDate(currentInfo.APPT_DT_TM);
    currentInfo.APPT_TM = $event;
    let hours = parseInt($event.substring(0, $event.indexOf(':')));
    let minutes = parseInt($event.substring($event.indexOf(':') + 1, $event.indexOf(' ')));
    if ($event.indexOf('PM') > 0 && hours != 12) {
      hours = hours + 12;
    }
    dt.setHours(hours);
    dt.setMinutes(minutes);
    currentInfo.APPT_DT_TM = dt;
    console.log("onAppointmentTimeChange's  currentInfo.APPT_DT_TM: ", currentInfo.APPT_DT_TM);
  }

  refreshPage() {
    if (this.currentCallInfoSaved.APPT_STAT == 'Completed') {
      // to go back to referer tab.
      let refererTab = this.params['activeTab'] ? this.params['activeTab'] : 1;
      this.router.navigate(['/outreach'], { queryParams: { 'activeTab': refererTab } });
    } else {
      window.location.reload();
    }
  }
  refreshModelPage() {
    window.location.reload();
  }

  onCallInfoCommentChange($event, currentInfo) {
    currentInfo.COMMENT = $event;
  }

  getMinScheduleDate(info) {
    let dt: any = new Date();
    if (info.CALL_STAT == 'Other') {
      return '';
    }
    return dt;
  }

  getApptDateDisableStatus(info) {
    // not disabled 1) CALL_STAT == other
    if (info.APPT_STAT == 'Open')
      return true;

    if (info.CALL_STAT == 'Other')
      return false;

    if (info.APPT_STAT == 'Completed')
      return true;
  }

  getApptDateBindingValue(info) {
    return (info.APPT_STAT == 'Open' || info.APPT_STAT == 'Completed') && info.CALL_STAT != 'Other' ? '' : this.getFormattedDate(info.APPT_DT_TM)
  }

  getApptTimeBindingValue(info) {
    return (info.APPT_STAT == 'Open' || info.APPT_STAT == 'Completed') && info.CALL_STAT != 'Other' ? '' : info.APPT_TM
  }

  getPhoneNumber() {
    // convert userName to lowercase for string comparision.
    var userName = this.authService.getLoggedInUserFirstName().toLowerCase();
    var phoneNumber = '';

    switch (userName) {
      case "mercy":
        phoneNumber = "(313) 293-6446";
        break;
      case "rebecca":
        phoneNumber = "(313) 293-6591";
        break;
      case "tiffany":
        phoneNumber = "(313) 293-6457";
        break;
      case "devon":
        phoneNumber = "(313) 293-6451";
        break;
      default:
        phoneNumber = "(313) 293-6446";
    }

    return phoneNumber;
  }
}

import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';
import {AuthService} from '../auth.service';

@Injectable ()
export class OutreachMemberService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
      private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getAgentOutreach(mmpID :number) {
      let url = this.baseUrl + '/GetAgentOutreach?mmpID=' + mmpID ;
      return  this.http.get(url)
      .map(this.extractData)
    }

    getCallStatusList(mmpID :number){
      let url = this.baseUrl + '/GetCallStatusList?mmpID=' + mmpID ;
      return  this.http.get(url)
      .map(this.extractData)
    }

    getCallHistory(mmpID :number){
      let url = this.baseUrl + '/GetCallHistory?mmpID=' + mmpID ;
      return  this.http.get(url)
      .map(this.extractData)
    }

    saveCallInfo(memberInfo) {
      let url = this.baseUrl + '/UpdateOutreach';
      return  this.http.post(url + this.getCallInfoParams(memberInfo), {})
      .map(this.extractData)
    }

    getFaxInfo(memberKey, providerKey) {
      let url = this.baseUrl + '/GetFaxInfo';
      return  this.http.get(url + '?memberKey=' + memberKey + '&providerKey=' +providerKey)
      .map(this.extractData)
    }

    private getCallInfoParams(memberInfo) {
      var userName = this.authService.getLoggedInUserName();
      let data = `?mmpID= ${memberInfo.MMP_ID}&isTransportElg=${!memberInfo.IS_TRPT_ELG?'NA':memberInfo.IS_TRPT_ELG}&isTransportArg=${!memberInfo.IS_TRPT_ARG?'NA':memberInfo.IS_TRPT_ARG}&callStat=${memberInfo.CALL_STAT}&comment=${encodeURIComponent(memberInfo.COMMENT)}&apptStat=${memberInfo.APPT_STAT}
      &apptDateTime=${this.getFormattedDate(memberInfo.APPT_DT_TM)} ${this.getTimeComponent(memberInfo.APPT_DT_TM)}&userName=${userName}`;
      return data;
    }
    private extractData(res: Response) {
      let body = [];
      if(res.status == 200) {
        body = res.json();
      }
      return body;
    }

    private getFormattedDate(dt) {
      if(dt) {
        return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
      }
      return '';
    }

    private getTimeComponent(dateObj) {
      if(dateObj) {
        let hours = ('0' + dateObj.getHours()).slice(-2);
        let minutes = ('0' + dateObj.getMinutes()).slice(-2);
        let seconds = ('0' + dateObj.getSeconds()).slice(-2);
        let result = hours + ' : ' +  minutes + ' : ' + seconds;
        console.log("save TimeComponent: ", result);
        return  result;
      }
      return '';
    }   
}

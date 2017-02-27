import {Json} from '@angular/platform-browser-dynamic/esm/src/facade/lang';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';
import { QueuingGetModel, FilterTypeModel, ActiveUsersGetModel, FilterDetailsModel, FilterDetailsSaveModel,PdrGetmodel,PdrSaveModel, CreateFilterAllocationModel } from './queuing.model';
import {SystemSettingGetModel} from './common.model';
import {AuthService} from '../auth.service';

@Injectable()
export class QueuingService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
      private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getSelectedFilter(){
        var url = this.baseUrl + '/getselectedfilter'
        return this.http.get(url)
        .map(this.extractData)
        .map((item, i)=>{
            return new FilterTypeModel(item[i].FLTR_TYPE_ID, item[i].FLTR_TYPE,
              item[i].SETTING_VAL, item[i].SYS_SETTING_ID);
        })
    }

    getcategories(filterType: string) {
      var url = this.baseUrl + '/getfiltertype' + '?filterType=' + filterType;
      return  this.http.get(url)
      .map(this.extractData)
      .map(this.convertToQueuingGetModel)
    }

    getFilterDetails(filterType: string, filterDate :any) {
      var url = this.baseUrl + '/getFilterDetails' + '?filterType=' + filterType + (filterDate ? '&filterDate=' + this.getFormattedDate(filterDate) : '');
      return  this.http.get(url)
      .map(this.extractData)
      .map(this.convertToFilterDetailsModel)
    }
    getAgentsPotentialAssignment(){
        var url = this.baseUrl + '/GetAgentsPotentialAssignment' ;
         return  this.http.get(url)
           .map(this.extractData)

    }

    postFilterDetails(filterDetails: Array<CreateFilterAllocationModel>) {
      var url = this.baseUrl + '/CreateFilterAllocation';
      return this.http.post(url, filterDetails)
      .map(this.extractData)
    }
    getPDRAgent() {
      var url = this.baseUrl + '/GetPDRAgent';
      return this.http.get(url)
      .map(this.extractData)
    }
    upsertPDRAgent(agentSaveDetails: Array<PdrSaveModel>){
      var url = this.baseUrl + '/UpsertPDRAgent';
      console.log("agentSaveDetails: " + JSON.stringify(agentSaveDetails));
     return this.http.post(url,agentSaveDetails)
      .map(this.extractData)
    }

    getSystemSetting(settingName: string){
      let url = this.baseUrl + '/getsystemsetting' + '?settingName=' + settingName;
      return  this.http.get(url)
      .map(this.extractData)
      .map(this.convertToSystemSettingGetModel);
    }

    getActiveUsers(agent:any){
      let url = this.baseUrl + '/GetActiveUsers' + '?usertype=' + agent;
      return this.http.get(url)
      .map(this.extractData)
    }

    reAssignAgentCalls(fromAgentId: number,
      toAgentId: number,
      fromDate: string,
      toDate: string){
      let url = this.baseUrl + '/ReassignAgentCalls' + '?fromAgentID=' + fromAgentId +
        '&toAgentID=' + toAgentId + '&fromDate=' + fromDate + '&toDate=' + toDate +
        '&userID=' + this.authService.getLoggedInUserId();
      return this.http.post(url, null)
      .map(this.extractData)
    }

    private convertToSystemSettingGetModel(values: [any]){
      let castedValues = new Array<SystemSettingGetModel>();
      values.forEach((value,index)=>{
          let item = new SystemSettingGetModel();
          item.SETTING_NAME = value.SYS_SETTING_ID;
          item.SETTING_NAME = value.SETTING_NAME;
          item.SETTING_VAL = value.SETTING_VAL // TODO: should conver to number.

          castedValues.push(item);
      })
      return  castedValues[0]; //assuming only one object is valid.

    }

    private convertToQueuingGetModel(values) {
      let castedValues = new Array<QueuingGetModel>();
      values.forEach((value,index)=>{
          castedValues.push(new QueuingGetModel(value.CAT_ID, value.CAT_TYPE));
      })
      return  castedValues;
    }

    private convertToFilterDetailsModel(values){
        let castedValues = new Array<FilterDetailsModel>();
        values.forEach((value,index)=>{
          castedValues.push(new FilterDetailsModel(value.FLTR_ID, value.FLTR_TYPE_ID, value.FLTR_TYPE, value.FLTR_INCLD,
          value.FLTR_PRCNT, value.CAT_ID, value.CAT_TYPE, value.REC_COUNT));
        });
      return  castedValues;
    }

    private extractData(res: Response) {
      let body = res.json();
      return body || [];
    }

    private getFormattedDate(dt) {
      if(dt) {
        return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear() +
        ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
      }
      return '';
    }
}

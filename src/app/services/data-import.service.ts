import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';
import {DataImportSaveModel, DataImportSystemSettingGetModel, DataImportSystemSettingSaveModel} from './data-import.model';
import {SystemSettingGetModel} from './common.model'


@Injectable()
export class DataImportService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getImportConfig() {
      let url = this.baseUrl + '/GetImportConfig';
      // todo: need to test this functionality with hardcoded data(if server endpoint is not avaible) and actual endpoint
      return  this.http.get(url)
      .map(this.extractData);

    /** .subscribe(
        data => { return data; },
        err => this.logError(err),
        () => console.log("get rquest completed successfully")
      ); */
    }

    postImportConfig(body: Array<DataImportSaveModel>){
      let url = this.baseUrl + '/UpdateImportConfig';
      return this.http.post(url, body, this.options)
      .map(this.extractData);

      /** .subscribe(
        data => {}, // todo: figure this out.
        err => this.logError(err),
        ()=> "post completed successfully")*/
    };
    getSystemSetting(settingName: string){
        let url = this.baseUrl + '/getsystemsetting' + '?settingName=' + settingName;
        return this.http.get(url)
        .map(this.extractData)
        .map(this.convertToSystemSettingGetModel);
    }

    private convertToSystemSettingGetModel(values: [any]){
        let castedValues = new Array<SystemSettingGetModel>();
        values.forEach((value,index)=>{
        let item = new SystemSettingGetModel();
        item.SYS_SETTING_ID = value.SYS_SETTING_ID;
        item.SETTING_NAME = value.SETTING_NAME;
        item.SETTING_VAL = value.SETTING_VAL // TODO: should conver to number.
        castedValues.push(item);
      })
      return castedValues[0];
    }//assuming only one object is valid.

    postSystemSetting(setting: DataImportSystemSettingSaveModel ){
      let url = this.baseUrl + '/UpdateSystemSetting';
      let params = '?systemSettingId='+ setting.systemSettingId + '&settingValue='+ setting.settingValue + '&updatedBy=' + setting.UpdatedBy;
      console.log("url + params: " + url + params);
      return this.http.post(url + params, {})
      .map(this.extractData);
    }

    private extractData(res: Response) {
      let body = res.json();
      return body || [];
    }

    private logError(err) {
     console.error('There was an error: ' + err);
    }
}

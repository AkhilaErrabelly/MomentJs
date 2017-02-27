import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Json} from '@angular/platform-browser-dynamic/esm/src/facade/lang';
import { Constants } from '../Constants';
import { AuthService } from '../auth.service';
@Injectable()
export class OutreachPerformanceService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
        private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }
 getOutreachPerformanceReport(reportBy:string, dateFrom: string, dateTo: string, userID : number){
   let url = this.baseUrl + '/OutreachPerformanceReport' + '?reportBy=' +   reportBy + '&dateFrom=' + dateFrom + ' &dateTo=' + dateTo + "&userID=" + this.authService.getLoggedInUserId(); ;
     return this.http.get(url)
      .map(this.extractData)
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
import {Json} from '@angular/platform-browser-dynamic/esm/src/facade/lang';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';

@Injectable()
export class ReassignAgentService
{
baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;
    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
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
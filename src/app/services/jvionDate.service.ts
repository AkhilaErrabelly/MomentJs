import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Json} from '@angular/platform-browser-dynamic/esm/src/facade/lang';
import { Constants } from '../Constants';
import { AuthService } from '../auth.service';
@Injectable()
export class JvionDateService{
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;
    constructor(private http: Http,
        private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
        }

     getJVIONDate(){
       let url = this.baseUrl + '/getJVIONDate' ;
       return this.http.get(url)
        .map(this.extractData)
 }
 private extractData(res: Response) {
      let body = res.json();
      return body || [];
 }
}
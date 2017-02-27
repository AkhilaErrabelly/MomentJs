import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';
import {AuthService} from '../auth.service';

@Injectable()
export class OutreachService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
      private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    getCallList(callType) {
      var userName = this.authService.getLoggedInUserName();
      let url = this.baseUrl + '/GetCallList?callType=' + callType + '&userName=' + userName;
      return  this.http.get(url)
      .map(this.extractData);
    }

    private extractData(res: Response) {
      let body = [];
      if(res.status == 200) {
        body = res.json();
      }
      return body;
    }

    private logError(err) {
     console.error('There was an error: ' + err);
    }
}

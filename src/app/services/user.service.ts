import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../Constants';
import { UserModel} from './user.model';

@Injectable()
export class UserService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;
    
    constructor(private http: Http) {
        
    }
    getActiveUsers(usertype:string){
         var url = this.baseUrl + '/GetActiveUsers'+'?usertype=' + usertype;
         return this.http.get(url)
         .map(this.extractData)
         .map(this.convertToUserModel)
    }

    private convertToUserModel(values){
        let castedValues = new Array<UserModel>();
        values.forEach((value,index)=>{
          castedValues.push(new UserModel(value.User_ID, value.USER_ROLE_ID, value.USER_ROLE_NAME, value.FNAME, value.LNAME));
        });
      return  castedValues;
    }
    
    private extractData(res: Response) {
      let body = res.json();
      return body || [];
    }
}
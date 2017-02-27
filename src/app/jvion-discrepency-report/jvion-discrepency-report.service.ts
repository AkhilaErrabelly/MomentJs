import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Json} from '@angular/platform-browser-dynamic/esm/src/facade/lang';
import { Constants } from '../Constants';
import { AuthService } from '../auth.service';
@Injectable()
export class JvionDiscrepencyReportService {
    baseUrl: string = Constants.SERVER;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
        private authService: AuthService) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

  getJvionReconcilationDiscrepancyReport(dateFrom: string, dateTo: string){
   let url = this.baseUrl + '/JvionReconcilationDiscrepancyReport?dateFrom=' + dateFrom + ' &dateTo=' + dateTo + "&userID=" + this.authService.getLoggedInUserId();;
     return this.http.get(url)
      .map(this.extractData)
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || [];
  }

  jsonToCSVConvertor(JSONData, ReportTitle) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

      var CSV = '';

      var row = '';

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {

          //Now convert each value to string and comma-seprated
          row += index + ',';
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + '\r\n';

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          var row = '';

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
      }

      //Generate a file name
      var fileName = ReportTitle.replace(/ /g, '_');

      //Initialize file format you want csv or xls
      var windowObj: any = window;
      var uri = 'data:text/csv;charset=utf-8,' + windowObj.escape(CSV);

      // Generate a temp <a /> tag
      var link:any = document.createElement('a');
      link.href = uri;

      // Set the visibility hidden so it will not effect on your web-layout
      link.style.visibility= 'hidden';
      link.download = fileName + '.csv';

      // This part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}

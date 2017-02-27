import {Component, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import {Router, ROUTER_DIRECTIVES } from '@angular/router';
import {DataImportService} from '../services/data-import.service';
import {AuthService} from '../auth.service';
import {DataImportSaveModel, DataImportGetModel, DataImportSystemSettingGetModel, DataImportSystemSettingSaveModel} from '../services/data-import.model';
import{SystemSettingGetModel} from '../services/common.model'
import {DATEPICKER_DIRECTIVES, TimepickerComponent} from '../../ng2-bootstrap/ng2-bootstrap';
import {TimerWrapper} from '@angular/core/src/facade/async';
//import {moment} from '../../moment/moment';

declare var $:any;
@Component({
    selector: 'data-import',
    templateUrl: './app/data-import/data-import.component.html',
    styleUrls: ['./app/data-import/data-import.css'],
    directives: [ROUTER_DIRECTIVES,DATEPICKER_DIRECTIVES, TimepickerComponent],
    providers: [DataImportService]
})
export class DataImportComponent implements AfterViewInit{
    selectedProcess: string;
    isSaved:boolean = false;
    saveMessage: string;
    errorMessage: string;
    dataImportSaveSuccessful: boolean = false;
    importConfigsData:any;
    manualImportsData: any;
    automaticImportsData: any;
    datePickerOpen: boolean = false;
    timePickerPickerOpen: boolean = false;
    showMeridian: boolean = false;
    calendarClicked: boolean = false;
    //systemsetiings
    weeklyCallcapacity: any = {};
    filterAssignTime: any = {};
    importSourcePath:any = {};

    dt: Date = new Date();
    jQuery: any;
    moment: any;

    constructor(
      private router: Router,
      private dataImportService: DataImportService,
      private authService: AuthService){
        this.dataImportService.getImportConfig().subscribe((response) => {
        this.manualImportsData = {};
        this.automaticImportsData = {};
        this.importConfigsData = response;
       // console.log("this.importConfigsData: "+ JSON.stringify(this.importConfigsData));
        this.setManualImportConfigsData();
        this.setAutomaticImportConfigsData();
      });
      this.jQuery = $ || {};
      var comp = this;


      this.jQuery(document.body).click(function(event) {
        TimerWrapper.setTimeout(() => {
          if(comp.calendarClicked) {
            comp.calendarClicked = false;
          } else {
              comp.manualImportsData.mmp.datePickerOpen = comp.manualImportsData.mmp.timePickerPickerOpen = false;
              comp.manualImportsData.measure.datePickerOpen = comp.manualImportsData.measure.timePickerPickerOpen = false;
              comp.manualImportsData.performance.datePickerOpen = comp.manualImportsData.performance.timePickerPickerOpen = false;
              comp.automaticImportsData.mmp.datePickerOpen = comp.automaticImportsData.mmp.timePickerPickerOpen = false;
              comp.automaticImportsData.measure.datePickerOpen = comp.automaticImportsData.measure.timePickerPickerOpen = false;
              comp.automaticImportsData.performance.datePickerOpen = comp.automaticImportsData.performance.timePickerPickerOpen = false;
          }
        }, 100);

      });
    }
//systemsettings

    ngAfterViewInit() {
      var comp = this;
      TimerWrapper.setTimeout(() => {
        this.jQuery('datepicker').parent().on('click', function() {
          comp.calendarClicked = true;
        });
        this.jQuery('.input-group-addon').on('click', function() {
          comp.calendarClicked = true;
        });
      }, 2000);

    }

    setManualImportConfigsData() {
      if(this.importConfigsData) {
        this.importConfigsData.forEach((obj, index) => {
          if(obj.IMPORT_TYPE == 'manual') {
            this.manualImportsData[obj.IMPORT_FILE_TYPE] = obj;
            let date = new Date(this.manualImportsData[obj.IMPORT_FILE_TYPE].IMPORT_DT_TM);
            this.manualImportsData[obj.IMPORT_FILE_TYPE].IMPORT_DT_TM = date.getFullYear() >= 2099 ? undefined : date;
            // business logic: disable the checkbox, date and timepicker when IMPORT_DT_TM's year is greater or equal to 2099.
            this.manualImportsData[obj.IMPORT_FILE_TYPE].selected = date.getFullYear() < 2099;
            //this.manualImportsData[obj.IMPORT_FILE_TYPE].disabled = date.getFullYear() >= 2099;
          }
        });

       // console.log("in setManualImportConfigsData() this.manualImportsData: "+ JSON.stringify(this.manualImportsData));
      }
    }


    setAutomaticImportConfigsData() {
      if(this.importConfigsData) {
        this.importConfigsData.forEach((obj, index) => {
          if(obj.IMPORT_TYPE == 'automatic') {
            this.automaticImportsData[obj.IMPORT_FILE_TYPE] = obj;
            let date = new Date(this.automaticImportsData[obj.IMPORT_FILE_TYPE].IMPORT_DT_TM);
            this.automaticImportsData[obj.IMPORT_FILE_TYPE].IMPORT_DT_TM = date.getFullYear() >= 2099 ? undefined : date;
            // business logic: disable the checkbox, date and timepicker when IMPORT_DT_TM's year is greater or equal to 2099.
            this.automaticImportsData[obj.IMPORT_FILE_TYPE].selected = date.getFullYear() < 2099;
            //this.automaticImportsData[obj.IMPORT_FILE_TYPE].disabled = date.getFullYear() >= 2099
            }
        });

        //console.log("in setAutomaticImportConfigsData() this.automaticImportsData: "+ JSON.stringify(this.automaticImportsData));
      }
    }


    saveConfig(){
        let userId = this.authService.getLoggedInUserId();
        let manualModelsToSave = this.prepareSaveModel(userId, this.manualImportsData);
        let automaticModelsToSave = this.prepareSaveModel(userId, this.automaticImportsData);
        let postBody = manualModelsToSave.concat(automaticModelsToSave);

        this.dataImportService.postImportConfig(postBody).subscribe((res)=>{
            if(res){
                this.isSaved = true;
                 this.dataImportSaveSuccessful = true;
                console.log("Config save: successful");
            }else{
                console.log("Config save: failed");
            }
        });
    }

    prepareSaveModel(userId: any, importsData: any): Array<DataImportSaveModel>{
        let saveModels = new Array<DataImportSaveModel>();

        // mmp. Save if checked/selected.
        if(importsData.mmp.selected && this.validDate(importsData.mmp.IMPORT_DT_TM)){
          let mmp = importsData.mmp;
          let mmpToSave = new DataImportSaveModel();
          mmpToSave.ImportConfigID = mmp.IMPORT_CONFIG_ID;
          mmpToSave.ImportDateTime = mmp.IMPORT_DT_TM;
          mmpToSave.UpdatedBy =  userId;
          saveModels.push(mmpToSave);
        }

        // measure. Save if checked/selected.
        if(importsData.measure.selected && this.validDate(importsData.measure.IMPORT_DT_TM)){
          let measure = importsData.measure;
          let measureToSave = new DataImportSaveModel();
          measureToSave.ImportConfigID = measure.IMPORT_CONFIG_ID;
          measureToSave.ImportDateTime = measure.IMPORT_DT_TM;
          measureToSave.UpdatedBy = userId;
          saveModels.push(measureToSave);
        }

        // performance. Save if checked/selected.
        if(importsData.performance.selected && this.validDate(importsData.performance.IMPORT_DT_TM)){
          let performance = importsData.performance;
          let performanceToSave = new DataImportSaveModel();
          performanceToSave.ImportConfigID = performance.IMPORT_CONFIG_ID;
          performanceToSave.ImportDateTime = performance.IMPORT_DT_TM;
          performanceToSave.UpdatedBy = userId;
          saveModels.push(performanceToSave);
        }
      return  saveModels;
    }  

    getTimeComponent(dateObj) {
      if(dateObj) {
        let hours = ('0' + dateObj.getHours()).slice(-2);
        let minutes = ('0' + dateObj.getMinutes()).slice(-2);
        return hours + ' : ' +  minutes;
      }
      return;
    }

    validDate(dt) {
      return dt.getUTCFullYear() < 2099
    }

    getMaxDate() {
      return new Date('2099-12-31T24:00:00');
    }

    getFormattedDate(dt) {
      if(dt) {
        return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
      }
      return;
    }

    setCalendarClicked() {
      this.calendarClicked = true;
    }

    setInputDate(event) {
        //this.value = event.target.value;
    }
  	setDate(date){
		    //this.selDate = date;
	  }
    refreshPage() {
    window.location.reload();
  }
}

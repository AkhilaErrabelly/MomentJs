import {Component,OnInit} from '@angular/core';
// using dataimport services for both system-settings and import-settings
import {Router, ROUTER_DIRECTIVES } from '@angular/router';
import {DataImportService} from '../services/data-import.service';
import {AuthService} from '../auth.service';
import {DataImportSaveModel, DataImportGetModel, DataImportSystemSettingGetModel, DataImportSystemSettingSaveModel} from '../services/data-import.model';
import{SystemSettingGetModel} from '../services/common.model';
import {AppComponent} from '../app.component';



@Component ({
    selector : 'system-settings',
    templateUrl : './app/system-settings/system-settings.html',
    styleUrls :[ './app/data-import/data-import.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [DataImportService]

})
// using dataimport services for both system-settings and import-settings
export class SystemSettingsComponent implements OnInit{
     selectedProcess: string;
    isSaved:boolean = false;
    saveMessage: string;
    errorMessage: string;

    importConfigsData:any;
    manualImportsData: any;
    importSystemSettings: DataImportSystemSettingGetModel = new DataImportSystemSettingGetModel();
    weeklyCallSystemSettings:DataImportSystemSettingGetModel = new DataImportSystemSettingGetModel();
    assignTimeSystemSettings:DataImportSystemSettingGetModel = new DataImportSystemSettingGetModel();
    automaticImportsData: any;
    showMeridian: boolean = false;
    //systemsetiings
    weeklyCallcapacity: any = {};
    filterAssignTime: any = {};
    importSourcePath:any = {};
     systemSettingSaveSuccessful: boolean = false;

    dt: Date = new Date();
    jQuery: any;
    moment: any;
    public hideForManager = false;
  
 

      constructor(
      private router: Router,
      private dataImportService: DataImportService,
      private authService: AuthService){
        this.dataImportService.getImportConfig().subscribe((response) => {
        this.manualImportsData = {};
        this.automaticImportsData = {};
      
       
       
      });
      this.jQuery = $ || {};
      var comp = this;
      
    }
      ngOnInit(){
        this.setweeklyCallcapacityFromService();
        this.setFilterAssignTimeFromService();
        this.setimportSourcePathFromService();
        
    }

  getUserName() {
    return this.authService.getLoggedInUserName();
  }

  getUserRole() {
    return this.authService.getLoggedInUserRole();
  }

  getRoles(){
    return this.authService.getAvailableRoles();
  }

  isManager(){
    return this.getUserRole() == this.getRoles().manager;
  }
  isAdministrator(){
    return this.getUserRole() == this.getRoles().admin;
  }

  isAgent(){
    return this.getUserRole() == this.getRoles().outReachAgent;
  }

//systemsettings
    saveSystemSettings() {
      let userId = this.authService.getLoggedInUserId();
      if(this.importSystemSettings.selected){ // save if checkbox is checked.
        let systemSettingsToSave = new DataImportSystemSettingSaveModel()
        systemSettingsToSave.SETTING_NAME = this.importSourcePath.SETTING_NAME;
        systemSettingsToSave.settingValue = this.importSourcePath.SETTING_VAL;
        systemSettingsToSave.systemSettingId = this.importSourcePath.SYS_SETTING_ID;
        systemSettingsToSave.UpdatedBy = userId;

        this.dataImportService.postSystemSetting(systemSettingsToSave).subscribe((res)=>{
            if(res){
                this.isSaved = true;
                 this.systemSettingSaveSuccessful =true;
                console.log("System Settings save: successful");
                 this.saveMessage ="Saved succesfully";

            }else{

                if(this.importSystemSettings.selected){
                  this.importSystemSettings.selected= !this.importSystemSettings.selected;
                   this.errorMessage = "Please select";

                }
                console.log("System Settings save: failed");
            }
        });
      }
      if(this.weeklyCallSystemSettings.selected){ // save if checkbox is checked.
        let systemSettingsToSave = new DataImportSystemSettingSaveModel()
        systemSettingsToSave.SETTING_NAME = this.weeklyCallcapacity.SETTING_NAME;
        systemSettingsToSave.settingValue = this.weeklyCallcapacity.SETTING_VAL;
        systemSettingsToSave.systemSettingId = this.weeklyCallcapacity.SYS_SETTING_ID;
        systemSettingsToSave.UpdatedBy = userId;

        this.dataImportService.postSystemSetting(systemSettingsToSave).subscribe((res)=>{
            if(res){
                this.isSaved = true;
                this.systemSettingSaveSuccessful =true;
                console.log("System Settings save: successful");
                this.saveMessage ="Saved succesfully";
            }else{
                console.log("System Settings save: failed");
            }
        });
      }
      if(this.assignTimeSystemSettings.selected){ // save if checkbox is checked.
        let systemSettingsToSave = new DataImportSystemSettingSaveModel()
        systemSettingsToSave.SETTING_NAME = this.filterAssignTime.SETTING_NAME;
        systemSettingsToSave.settingValue = this.filterAssignTime.SETTING_VAL;
        systemSettingsToSave.systemSettingId = this.filterAssignTime.SYS_SETTING_ID;
        systemSettingsToSave.UpdatedBy = userId;

        this.dataImportService.postSystemSetting(systemSettingsToSave).subscribe((res)=>{
            if(res){
                this.isSaved = true;
                this.systemSettingSaveSuccessful =true;
                console.log("System Settings save: successful");
                 this.saveMessage ="Saved succesfully";
            }else{
                console.log("System Settings save: failed");
                this.errorMessage = "Please select";
            }
        });
      }
    }

    //systemsettings
    setimportSourcePathFromService(){
      this.dataImportService.getSystemSetting("ImportSourcePath").subscribe((response)=>{
            this.importSourcePath = response;
        });
    }
    //systemsettings
    setweeklyCallcapacityFromService(){
        this.dataImportService.getSystemSetting("WeeklyCallCapacity").subscribe((response)=>{
            this.weeklyCallcapacity = response;
        });
    }
  //systemsettings
    setFilterAssignTimeFromService(){
        this.dataImportService.getSystemSetting("FilterAssignTime").subscribe((response)=>{
            this.filterAssignTime = response;
        });
    }
      refreshPage() {
    window.location.reload();
  }

}
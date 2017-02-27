import { Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { TimerWrapper } from '@angular/core/src/facade/async';
import { DATEPICKER_DIRECTIVES, TimepickerComponent } from '../../ng2-bootstrap/ng2-bootstrap';
import { FilterTypeModel, QueuingGetModel, FilterDetailsModel, FilterDetailsSaveModel, PdrSaveModel, CreateFilterAllocationModel } from '../services/queuing.model';
import { UserModel } from '../services/user.model';
import { QueuingService } from '../services/queuing.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth.service';
import { DataImportSystemSettingSaveModel } from '../services/data-import.model';
import { DataImportService } from '../services/data-import.service';

@Component({
    selector: 'que-filter',
    templateUrl: './app/filters/queuing.component.html',
    styleUrls: ['./app/filters/queuing.css'],
    providers: [QueuingService, UserService, DataImportService],
    directives: [REACTIVE_FORM_DIRECTIVES, DATEPICKER_DIRECTIVES, TimepickerComponent],

})
export class QueuingComponent implements OnInit, AfterViewInit {
    filters: Array<any> = [
        { 'name': "Visit Type", 'type': 'VT' },
        // {'name': "Measure Category", 'type': 'MC' },
        { 'name': "Measure", 'type': 'CC' },
        //{'name':  "Provider's Last Name", 'type': 'PLN' }
    ];

    selectedFilter: string; // get value from api
    filterByDate: any = new Date(new Date().getFullYear(), 11, 31);;
    sysSettingId: number;
    edited: any;
    isSaveSuccessful: boolean = false;
    saveMessage: string = "";
    moreThanValidCount: boolean = false;
    zeroPercentage: boolean = false;
    submittingDetails: boolean = false;
    queuingFilterSaveSuccessful :boolean = false;
    lessThanError: boolean = false;
    calendarClicked: boolean = false;
    datePickerOpen: boolean = false;
    timePickerPickerOpen: boolean = false;
    noSelection: boolean = true;
    invalidPercentage: boolean = false;
    pdrAgents: Array<any>;
    agentPotentials: Array<any>;
    filterDetailsRows: Array<RowDetails>;
    fromDateOpen: boolean = false;
    toDateOpen: boolean = false;
    filterDetails: Array<FilterDetailsModel>;
    users: Array<UserModel>;
    weeklyCallcapacity: number;

    jQuery: any;

    constructor(
        private queuingService: QueuingService,
        private userService: UserService,
        private authService: AuthService,
        private _fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dataImportService: DataImportService) {

        this.selectedFilter = 'VT';
        this.jQuery = $ || {};
        var comp = this;

        this.jQuery(document.body).click(function (event) {
            TimerWrapper.setTimeout(() => {
                if (comp.calendarClicked) {
                    comp.calendarClicked = false;
                } else {
                    comp.fromDateOpen = comp.toDateOpen = false;
                }
            }, 100);
        });
    }

    ngAfterViewInit() {
        var comp = this;
        TimerWrapper.setTimeout(() => {
            this.jQuery('datepicker').parent().on('click', function () {
                comp.calendarClicked = true;
            });
            this.jQuery('.input-group-addon').on('click', function () {
                comp.calendarClicked = true;
            });
        }, 2000);
    }

    ngOnInit() {
        this.queuingService.getSelectedFilter().subscribe((response) => {
            this.selectedFilter = response.FLTR_TYPE;
            this.filterByDate =  new Date(new Date().getFullYear(), 11, 31);(response.SETTING_VAL);
            this.sysSettingId = response.SYS_SETTING_ID;
            this.onFilterChange(this.selectedFilter);
        });
        this.userService.getActiveUsers("agent").subscribe((response1) => {
            this.users = response1;
        })
        this.setweeklyCallcapacityFromService();

        //get PDR Agents by calling its service
        this.queuingService.getPDRAgent().subscribe((response) => {
            this.pdrAgents = response;
            console.log("this.pdrAgents: " + JSON.stringify(this.pdrAgents));
        });
        this.queuingService.getAgentsPotentialAssignment().subscribe((response) => {
            this.agentPotentials = response;
            console.log("this.agentsPotentials " + JSON.stringify(this.agentPotentials));
        })
    }

    onFilterChange(type) {
        this.selectedFilter = type;
        this.moreThanValidCount = false;
        this.queuingService.getFilterDetails(this.selectedFilter,
            this.filterByDate).subscribe((response) => {
                this.filterDetails = response;
                this.filterDetailsRows = this.generateRowDetails(response)
            });
    }

    onDateFilterChange($event) {
        this.filterByDate = $event;
        this.onFilterChange(this.selectedFilter);
    }

    notValidPercentage() {
        return false;
    }

    invalidLessPercentage() {
        return true;
    }

    private generateRowDetails(values: Array<FilterDetailsModel>): Array<RowDetails> {
        let rows = new Array<RowDetails>();

        values.forEach((value, index) => {
            // same as row.
            let row = new RowDetails(value.CAT_ID, value.CAT_TYPE, value.FLTR_TYPE_ID,
                value.FLTR_INCLD == 'Y', value.FLTR_PRCNT, this.users, this.users.length,
                this.weeklyCallcapacity, value.REC_COUNT);
            rows.push(row);
        });

        return rows;
    }


    validateAllocationCount() {
        this.moreThanValidCount = false;
        this.noSelection = true;
        this.zeroPercentage = false;
        let total = 0;
        let result = true;
        let currentValue;
        let lastSelecteEle;
        var error;
        let totalweeklyCallcapacity = this.weeklyCallcapacity * this.users.length;
        for (let key in this.filterDetailsRows) {
            if (this.filterDetailsRows[key].isIncluded) {
                this.noSelection = false;
                currentValue = (this.filterDetailsRows[key].recordCount * this.filterDetailsRows[key].percentage) / 100;
                total = total + currentValue;
                if (this.filterDetailsRows[key].percentage <= 0) {
                    this.zeroPercentage = true;
                }
                if (total > totalweeklyCallcapacity) {
                    this.moreThanValidCount = true;
                    break;
                }
            }
        }
        return !this.moreThanValidCount && !this.zeroPercentage && !this.noSelection && !this.invalidPercentage;
    }

    onRowSelectionChange(rowObject) {
        if (rowObject.isIncluded) {
            rowObject.percentage = 0;
            this.cdr.detectChanges();
        }
    }

    setweeklyCallcapacityFromService() {
        this.queuingService.getSystemSetting("WeeklyCallcapacity").subscribe((response) => {
            this.weeklyCallcapacity = parseInt(response.SETTING_VAL, 0);
        });
    }



    saveFilterDetails() {
        // validate morethan 100 on all groups.
        //TODO: this is just a WORKAROUND. Has to re-done in write wy by grouping all groups to one form and validate;

        this.submittingDetails = true;
        if (this.validateAllocationCount()) {
            let detailsToSave: Array<CreateFilterAllocationModel> = this.convertToCreateFilterAllocationModel();
            this.queuingService.postFilterDetails(detailsToSave).subscribe((res) => {
                console.log("response from postFilterDetails: " + res);
                console.log("Filter Details save: successful");
                this.isSaveSuccessful = true;
                this.saveMessage = <any>res;
                this.submittingDetails = true;
                  this.queuingFilterSaveSuccessful=true;

            },
                error => {
                    console.log("error: " + <any>error);
                    this.saveMessage = <any>error;
                    this.submittingDetails = true;
                });
            this.saveSystemSetting();
        } else {
            document.body.scrollIntoView();
        }
    }

    saveSystemSetting() {
        let userId = this.authService.getLoggedInUserId();
        let systemSettingsToSave = new DataImportSystemSettingSaveModel()
        systemSettingsToSave.SETTING_NAME = '';
        systemSettingsToSave.settingValue = this.getFormattedDate(this.filterByDate);
        systemSettingsToSave.systemSettingId = this.sysSettingId;
        systemSettingsToSave.UpdatedBy = userId;

        this.dataImportService.postSystemSetting(systemSettingsToSave).subscribe((res) => {
            console.log("System Settings saved successfully");
        });
    }

    saveUpsertPDRAgent() {
        let agentSaveDetails: Array<PdrSaveModel> = this.convertToUpsertPDRAgent();
        this.queuingService.upsertPDRAgent(agentSaveDetails).subscribe((res) => {
            console.log("response from PDR Save: " + res);
            this.isSaveSuccessful = true;
            this.saveMessage = <any>res;
        })
    }
    private convertToUpsertPDRAgent(): Array<PdrSaveModel> {
        let userId = this.authService.getLoggedInUserId();
        return this.pdrAgents.map((vl) => {
            return new PdrSaveModel(vl.PDR_ID, vl.User_ID, userId);
        })
    }

    private convertToCreateFilterAllocationModel(): Array<CreateFilterAllocationModel> {
        let saveModels: Array<CreateFilterAllocationModel> = [];
        let userId = this.authService.getLoggedInUserId();
        let currentItems = this.filterDetailsRows;

        currentItems.forEach((value) => {
            if (value.isIncluded) {
                let saveModel = new CreateFilterAllocationModel(value.filterTypeId,
                    value.categoryId,
                    value.isIncluded,
                    value.percentage,
                    [],
                    Number(userId));
                saveModels.push(saveModel);
            }
        });

        return saveModels;
    }

    getFormattedDate(dt) {
        if (dt) {
            return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
        }
        return;
    }

    getAllocationCount(rowObject) {
        return (rowObject.percentage && Math.round((rowObject.recordCount * rowObject.percentage) / 100)) || 0;

    }

    getAllocationTotalCount() {
        let total = 0;
        this.filterDetailsRows.forEach((row)=>{
            total = total + this.getAllocationCount(row);
        })
        return total;
    }
    getAgentPotentialsTotalCount(){
        let total = 0;
        this.agentPotentials.forEach((potential)=>{
            total = total + potential.Calls_Count;
        })
        return total;
    }

    refreshPage() {
    window.location.reload();
  }

}

export class RowDetails {
    categoryId: number;
    type: string = "";
    filterTypeId: number;
    isIncluded: boolean = true;
    _percentage: number;
    agentsToAllocate: Array<any>;
    allocatedAgents: Array<any>;
    selectedAgent: any;
    allocationCount: any;
    weeklyCallCapacity: number;
    recordCount: number;
    agentsCount: number;
    constructor(
        categoryId: number,
        type: string,
        filterTypeId: number,
        isIncluded: boolean,
        percentage: number,
        agentsToAllocate: Array<any>,
        agentsCount: number,
        weeklyCallCapacity: number,
        recordCount: number,
        allocatedAgents?: Array<any>) {
        this.agentsToAllocate = agentsToAllocate;
        this.allocatedAgents = allocatedAgents;
        this.categoryId = categoryId;
        this.isIncluded = isIncluded;
        this.percentage = percentage;
        this.weeklyCallCapacity = weeklyCallCapacity;
        this.recordCount = recordCount;
        this.agentsCount = agentsCount;
        //   this.allocationCount = this.calculateAllocationCount(weeklyCallCapacity, agentsCount);
        this.type = type;
        this.filterTypeId = filterTypeId;
    }

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
        // this.allocationCount = this.calculateAllocationCount(this.weeklyCallCapacity, this.agentsCount);
    }

    // private calculateAllocationCount(weeklyCallCapacity: number, agentsCount: number){
    //     let totalWeeklyCallCapacity = agentsCount* weeklyCallCapacity;
    //     let count = Math.round((this.percentage/100)* totalWeeklyCallCapacity);
    //    return  count;
    // }
}

import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {OutreachModel} from '../services/outreach.model';
import {OutreachService} from '../services/outreach.service';
import {orderBy} from './orderBy.pipe';
import {PaginationDirective} from './pagination.directive';
import {NgModel,NgIf, NgFor, NgClass,FORM_DIRECTIVES, ControlValueAccessor} from "@angular/common";
import { DateExtensions } from '../utils/dateExtensions';

@Component({
    templateUrl: './app/outreach/outreach.component.html',
    styleUrls: ['./app/outreach/outreach.css'],
    directives: [ROUTER_DIRECTIVES, PaginationDirective],
    providers: [OutreachService, NgModel],
    pipes: [orderBy]
})

export class OutreachComponent {
    //model: OutreachModel = new OutreachModel();
    callsData: any;
    jQuery: any;
    currentSortColumn: string;
    currentSortOrder: string;
    currentSortType: string;
    filteredData: Array<any>;
    filterValue: string = '';
    filterValueInitial: string;
    filterValueFollowUp: string;
    filterValueReminders: string;

    activeTab: number = 1;
    currentPage:number = 1;
    totalItems:number;
    maxSize:number = 10;
    paginationData: any;

    constructor(private router: Router,
      private outreachService: OutreachService){
        this.jQuery = $ || {};
        var comp = this;
        this.filteredData = [];
        this.callsData = {};

        this.initPagination();
        outreachService.getCallList('initial').subscribe((response) => {
          this.callsData['initialCalls'] = response;
           this.callsData['initialCalls'].forEach((value) =>{
               value.MSR_DUE_DT = DateExtensions.getDate(value.MSR_DUE_DT);
          this.paginationData['initialCalls'].totalItems = response.length;
          this.filterData(this.filterValueInitial, 'initialCalls');
          this.sortColumn(this.callsData['initialCalls'], this.currentSortColumn, this.currentSortType, this.currentSortOrder);
      })
        });

        outreachService.getCallList('Follow-up').subscribe((response) => {
          this.callsData['followUpCalls'] = response;
          this.paginationData['followUpCalls'].totalItems = response.length;
          this.filterData(this.filterValueFollowUp, 'followUpCalls');
          this.sortColumn(this.callsData['followUpCalls'], this.currentSortColumn, this.currentSortType, this.currentSortOrder);
        });

        outreachService.getCallList('Reminder').subscribe((response) => {
          this.callsData['reminderCalls'] = response;
          this.paginationData['reminderCalls'].totalItems = response.length;
          this.filterData(this.filterValueReminders, 'reminderCalls');
          this.sortColumn(this.callsData['reminderCalls'], this.currentSortColumn, this.currentSortType, this.currentSortOrder);
        });

        router.routerState.queryParams.subscribe((params)=>{
          let activeTab = +params['activeTab'];
          this.activeTab = activeTab || 1;
          this.currentSortColumn = params['currentSortColumn'];
          this.currentSortOrder = params['currentSortOrder'];
          this.currentPage = params['currentPage'] || 1;
          this.currentSortType = params['currentSortType']
          this.setFilterDetails(params['filterValue'], params['currentPage'] || 1);
        });

    }

    private setFilterDetails(filterValue, page) {
        if(this.activeTab == 1) {
          this.filterValue = filterValue;
          this.filterValueInitial = this.filterValue;
          this.paginationData['initialCalls'].currentPage = page;
        } else if(this.activeTab == 2) {
          this.filterValue = filterValue;
          this.filterValueFollowUp = this.filterValue;
          this.paginationData['followUpCalls'].currentPage = page;
        } else if(this.activeTab == 3) {
          this.filterValue = filterValue;
          this.filterValueReminders = this.filterValue;
          this.paginationData['reminderCalls'].currentPage = page;
        }
    }

    private getCurrentPage() {
        var page = 1;
        if(this.activeTab == 1) {
          page = this.paginationData['initialCalls'].currentPage;
        } else if(this.activeTab == 2) {
          page = this.paginationData['followUpCalls'].currentPage;
        } else if(this.activeTab == 3) {
          page = this.paginationData['reminderCalls'].currentPage;
        }
        return page;
    }

    private initPagination() {
      this.paginationData = {
        initialCalls: {
            currentPage: 1
          },
        followUpCalls: {
            currentPage: 1
          },
        reminderCalls: {
          currentPage: 1
        },
      };
    }

    private getSortClass(sortByColumn){
     let sortClass = ['fa fa-sort'];
     if(sortByColumn == this.currentSortColumn) {
       sortClass = this.currentSortOrder == 'ASC' ? ['fa fa-sort-desc'] : ['fa fa-sort-asc'];
     }
     return sortClass;
    }

    onInfoClick(MMP_ID){
      let queryParamStr = '?mmpId=' + MMP_ID;

      if(this.filterValue) {
        queryParamStr += '&filterValue=' + this.filterValue;
      }
      if(this.activeTab) {
        queryParamStr += '&activeTab=' + this.activeTab;
      }
      if(this.currentSortColumn) {
        queryParamStr += '&currentSortColumn=' + this.currentSortColumn;
      }
      if(this.currentSortOrder) {
        queryParamStr += '&currentSortOrder=' + this.currentSortOrder;
      }
      if(this.currentPage) {
        queryParamStr += '&currentPage=' + this.getCurrentPage();
      }
      if(this.currentSortType) {
        queryParamStr += '&currentSortType=' + this.currentSortType;
      }

      this.router.navigateByUrl('/outreachmember' + queryParamStr);
      /*this.router.navigate(['/outreachmember'], {
        queryParams: {
          'mmpId': MMP_ID,
          'filterValue': this.filterValue || '',
          'activeTab': this.activeTab,
          'currentSortColumn': this.currentSortColumn || '',
          'currentSortOrder': this.currentSortOrder || '',
          'currentPage': this.getCurrentPage(),
          'currentSortType': this.currentSortType || ''
        }
      });*/
      /*let navigationExtras: NavigationExtras = {
            preserveQueryParams: true,
            preserveFragment: true
          };
      this.router.navigate(['/outreachmember', {'mmpId': MMP_ID}], navigationExtras);*/
    }

    sortColumn(data, sortByColumn, type, order) {
      if(!sortByColumn) return;
      this.currentSortType = type;
      if(sortByColumn == this.currentSortColumn) {
        this.currentSortOrder = this.currentSortOrder == 'ASC' ? 'DESC' : 'ASC';
      } else {
        this.currentSortColumn = sortByColumn;
        this.currentSortOrder = 'ASC';
      }
      if(order) this.currentSortOrder = order;
      data.sort((obj1, obj2) => {
        if(type == 'date') {
          let val1 = (new Date(obj1[sortByColumn])).getTime();
          let val2 = (new Date(obj2[sortByColumn])).getTime();
          if(this.currentSortOrder == 'ASC') {
            if(val1 < val2) {
              return -1
            } else if(val1 > val2) {
              return 1;
            }
            return 0;
          } else {
            if(val1 < val2) {
              return 1
            } else if(val1 > val2) {
              return -1;
            }
            return 0;
          }
        } else {
          let val1 = obj1[sortByColumn].toLowerCase();
          let val2 = obj2[sortByColumn].toLowerCase();
          if(this.currentSortOrder == 'ASC') {
            if(val1 < val2) {
              return -1
            } else if(val1 > val2) {
              return 1;
            }
            return 0;
          } else {
            if(val1 < val2) {
              return 1
            } else if(val1 > val2) {
              return -1;
            }
            return 0;
          }
        }
      })

    }

    getFilterData(type) {
      let filteredList;
      if (!this.filteredData[type]) {
        this.filteredData[type] = this.callsData[type];
        filteredList = this.getRecordsForPage(this.callsData[type], this.paginationData[type].currentPage);
      } else {
          filteredList = this.getRecordsForPage(this.filteredData[type], this.paginationData[type].currentPage);
      }
      return filteredList;
    }


    filterData($event, type) {
      //this.initPagination();
      this.filterValue = $event;
      if(!$event) {
        this.filteredData[type] = this.callsData[type];
        return;
      }
      this.filteredData[type] = [];
      this.callsData[type].forEach((obj, index) => {
        for(var k in obj) {
          if((obj[k] + '').toLowerCase().indexOf($event.toLowerCase()) >= 0) {
            this.filteredData[type].push(obj);
            break;
          }
        }
      });
    }

    pageChanged($event) {
      //this.filteredData['followUpCalls'] = this.getRecordsForPage(this.filteredData['followUpCalls'], this.currentPage)
    }

    private getRecordsForPage(records, pageNo) {
      if(!records || !records.length) {
        return;
      }
      let lastIndex = pageNo * this.maxSize;
      let startIndex = lastIndex -  this.maxSize;
      if(records.length < startIndex) {
        console.log("Start index is beyon boundary");
        return [];
      } else {
        return records.slice(startIndex, lastIndex);
      }
    }

    showPagination(type) {
      return this.filteredData && this.filteredData[type] && this.filteredData[type].length;
    }
}

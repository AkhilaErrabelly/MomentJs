export class QueuingGetModel{
    CAT_ID: number;
    CAT_TYPE: string;

    constructor(CAT_ID: number, CAT_TYPE: string){
        this.CAT_ID = CAT_ID;
        this.CAT_TYPE = CAT_TYPE;
    }
}

export class FilterTypeModel{
    FLTR_TYPE_ID: number;
    FLTR_TYPE: string;
    SETTING_VAL: string;
    SYS_SETTING_ID: number;

    constructor(filterTypeId: number, filterType: string, filterDate: string, sysSettingId: number){
        this.FLTR_TYPE = filterType;
        this.FLTR_TYPE_ID = filterTypeId;
        this.SETTING_VAL = filterDate;
        this.SYS_SETTING_ID = sysSettingId;
    }
}
export class FilterDetailsModel{
    FLTR_ID: number;
    FLTR_TYPE_ID: number;
    FLTR_TYPE: string;
    FLTR_INCLD: any;
    FLTR_PRCNT: number;
    CAT_ID: number;
    CAT_TYPE: string;
    REC_COUNT: number;

    constructor(filterId: number,
        filterTypeId: number,
        filterType: string,
        isFilterIncluded: any,
        filterPercentage: number,
        categoryId: number,
        categoryType: string,
        recordCount: number){
            this.FLTR_ID = filterId;
            this.FLTR_TYPE_ID = filterTypeId;
            this.FLTR_TYPE = filterType;
            this.FLTR_INCLD = isFilterIncluded;
            this.FLTR_PRCNT = filterPercentage;
            this.CAT_ID = categoryId;
            this.CAT_TYPE = categoryType;
            this.REC_COUNT = recordCount;
        }
}

export class FilterDetailsSaveModel{
    FLTR_TYPE_ID: number;
    CAT_ID: number;
    FLTR_INCLD: any;
    FLTR_PRCNT: number;
    USER_ID: string;

    constructor(
        filterTypeId: number,
        categoryId: number,
        isFilterIncluded: boolean,
        filterPercentage: number,
        Agents: Array<number>,
        filterByUser: number){
            this.FLTR_TYPE_ID = filterTypeId;
            this.CAT_ID = categoryId;
            this.FLTR_INCLD = isFilterIncluded? 'Y': 'N';
            this.FLTR_PRCNT = filterPercentage;
            this.USER_ID = filterByUser.toString();
        }
    static convertArrayToString(value: Array<number>){
        return value.join(",");
    }
}

export class CreateFilterAllocationModel{
  filterTypeId: number;
  IdSelectedFilterType: number;
  filterIncluded: string;
  filterPercent: number;
  filterByUser: number;

    constructor(
        filterTypeId: number,
        categoryId: number,
        isFilterIncluded: boolean,
        filterPercentage: number,
        Agents: Array<number>,
        filterByUser: number){
            this.filterTypeId = filterTypeId;
            this.IdSelectedFilterType = categoryId;
            this.filterIncluded = isFilterIncluded? 'Y': 'N';
            this.filterPercent = filterPercentage;
            this.filterByUser = filterByUser;
        }
    static convertArrayToString(value: Array<number>){
        return value.join(",");
    }
}

export class ActiveUsersGetModel{
    User_ID: number;
    USER_ROLE_ID: number;
    USER_ROLE_NAME: string;
    FNAME: string;
    LNAME: string;
    constructor(userId:number, userRoleId :number,userRoleName:string,fName: string, lName : string){
        this.User_ID = userId;
        this.USER_ROLE_ID = userRoleId ;
        this. USER_ROLE_NAME=userRoleName;
        this.FNAME =fName;
        this. LNAME = lName;
    }
}
export class PdrGetmodel{
    PDR_ID : string;
    USER_ID :number;
    constructor(
        providerLastName : string,
        UserId : number

    ){
   this.PDR_ID = providerLastName;
   this. USER_ID = UserId  ;
    }
}
export class PdrSaveModel{
     PDR_ID: string;
    AGENT_ID: number;
    PDR_AGENT_BY_USER: number;
     constructor(
          providerLastName :string,
          userId : number,
          PdrloggedInUser : number
     ){
         this.PDR_ID =   providerLastName ;
         this.AGENT_ID =userId;
      this.PDR_AGENT_BY_USER = PdrloggedInUser;
     }

}

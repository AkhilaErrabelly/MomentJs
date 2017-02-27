export class OutreachMemberModel {
    MMP_ID: number;
    MMP_STAT: string;
    MEM_NAME: string;
    MEM_SEX: string;
    MEM_DOB: string;
    MEM_PHO_NO: string;
    MEM_ADD1: any;
    MEM_ADD2: any;
    MEM_CITY: string;
    MEM_STATE: string;
    MEM_ZIP: string;
    SUB_KEY: string;
    PDT_TYPE: string;
    MEM_GRP: string;
    ENROLL_EFF_DT: string;
    ENROLL_TERM_DT: string;
    MSR_DUE_DT: string;
    MSR_CMPL_DT: string;
    YEAR: string;
    MSR_KEY: string;
    MSR_DESC: string;
    STRN: string;
    MSR_CC_TYPE: string;
    THC_OUTREACH: string;
    OUTREACH_TO: string;
    MSR_CAT_TYPE: string;
    MSR_VISIT_TYPE: string;
    FREQ: string;
    RANKING: string;
    COMN_DEF: string;
    IMP: string;
    PDR_KEY: string;
    PDR_NAME: string;
    PDR_PHO_NO: string;
    PDR_FAX: string;
    PDR_ADD: string;
    PDR_CITY: string;
    PDR_STATE: string;
    PDR_ZIP: string;
    IS_TRPT_ELG: string;
    IS_TRPT_ARG: string;
    CALL_STAT: string;
    COMMENT: string;
    NEXT_CALL_DT: string;
    APPT_STAT: string;
    APPT_DT_TM: string;
    FNAME: string;
    LNAME: string;
    UPT_DT: string;
    constructor(
        mmpId: number,
        mmpStat: string,
        memberName: string,
        memberSex: string,
        memberDOB: string,
        memberPhoneNo: string,
        memberAdd1: string,
        memberAdd2: string,
        memberCity: string,
        memberState: string,
        memberZip: string,
        subscriberKey: string,
        productType: string,
        memberGroup: string,
        enrollEFFDate: string,
        enrollTermDate: string,
        measureDueDate: string,
        measureCompleteDate: string,
        measureYear: string,
        measureKey: string,
        measureDescription: string,
        stratification: string,
        measureCustomCAtType: string,
        thcOutreach: string,
        outreachTho: string,
        measureCatType: string,
        measureVisitType: string,
        frequency: string,
        ranking: string,
        comnDefination: string,
        imp: string,
        providerKey: string,
        providerName: string,
        providerPhone: string,
        providerFax: string,
        providerAddress: string,
        providerCity: string,
        providerState: string,
        providerZip: string,
        transportEligible: string,
        transportProvided: string,
        callStatus: string,
        comment: string,
        nextCallDate: string,
        appointmentStatus: string,
        appointmentDateTime: string,
        firstName: string,
        lastName: string,
        lastUpdated: string
    ) {
        this.MMP_ID = mmpId;
        this.MMP_STAT = mmpStat;
        this.MEM_NAME = memberName;
        this.MEM_SEX = memberSex;
        this.MEM_DOB = memberDOB;
        this.MEM_PHO_NO = memberPhoneNo;
        this.MEM_ADD1 = memberAdd1;
        this.MEM_ADD2 = memberAdd2;
        this.MEM_CITY = memberCity;
        this.MEM_STATE = memberState;
        this.MEM_ZIP = memberZip;
        this.SUB_KEY = subscriberKey;
        this.PDT_TYPE = productType;
        this.MEM_GRP = memberGroup;
        this.ENROLL_EFF_DT = enrollEFFDate;
        this.ENROLL_TERM_DT = enrollTermDate;
        this.MSR_DUE_DT = measureDueDate;
        this.MSR_CMPL_DT = measureCompleteDate;
        this.YEAR = measureYear;
        this.MSR_KEY = measureKey;
        this.MSR_DESC = measureDescription;
        this.STRN = stratification;
        this.MSR_CC_TYPE = measureCustomCAtType;
        this.THC_OUTREACH = thcOutreach;
        this.OUTREACH_TO = outreachTho;
        this.MSR_CAT_TYPE = measureCatType;
        this.MSR_VISIT_TYPE = measureVisitType;
        this.FREQ = frequency;
        this.RANKING = ranking;
        this.COMN_DEF = comnDefination;
        this.IMP = imp;
        this.PDR_KEY = providerKey;
        this.PDR_NAME = providerName;
        this.PDR_PHO_NO = providerPhone;
        this.PDR_FAX = providerFax;
        this.PDR_ADD = providerAddress;
        this.PDR_CITY = providerCity;
        this.PDR_STATE = providerState;
        this.PDR_ZIP = providerZip;
        this.IS_TRPT_ELG = transportEligible;
        this.IS_TRPT_ARG = transportProvided;
        this.CALL_STAT = callStatus;
        this.COMMENT = comment;
        this.NEXT_CALL_DT = nextCallDate;
        this.APPT_STAT = appointmentStatus;
        this.APPT_DT_TM = appointmentDateTime;
        this.FNAME = firstName;
        this.LNAME = lastName;
        this.UPT_DT = lastUpdated;
    }
}
/** This Model represents each record in call history.
*/
export class CallDetailsModel{
    IS_TRPT_ELG: string;
    IS_TRPT_ARG: string;
    CALL_STAT: string;
    COMMENT: string;
    APPT_STAT: string;
    APPT_DT_TM: Date;
    FNAME: string;
    LNAME: string;
    fullName: string;
    CRT_DT: Date;
    constructor(
        isTransportEligible: string,
        isTransportProvided: string,
        callStatus: string,
        comment: string,
        appointmentStatus: string,
        appointmentDatetime: string,
        firstName: string,
        lastName: string,
        createdDatetime: string){
            this.APPT_DT_TM = new Date(appointmentDatetime);
            this.APPT_STAT = appointmentStatus;
            this.CALL_STAT = callStatus;
            this.COMMENT = comment;
            this.CRT_DT = new Date(createdDatetime);
            this.FNAME = firstName;
            this.LNAME = lastName;
            this.fullName = firstName + ' ' + lastName;
    }
}

export class CallStatusModel{
    CALL_STAT_ID: number;
    CALL_STAT: string;

    constructor(id: number, status: string){
        this.CALL_STAT = status;
        this.CALL_STAT_ID = id;
    }
}
export class CallInfoDetails {
    mmpID : number ;
     isTransportElg:string ;
     isTransportArg:string;
     callStat:string;
     comment:string;
      apptStat:string;
       apptDateTime:any; 
       userName:string;
       constructor (){
           
       }
}
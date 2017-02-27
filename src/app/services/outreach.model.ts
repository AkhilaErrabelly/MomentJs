export class OutreachModel{
    open: Array<OutreachOpenModel>;
    scheduled: Array<OutreachScheduledModel>;
    newCalls: Array<OutreachNewModel>;

    constructor(){

    }
}

export class OutreachBaseModel{
    measureDueDate: string;
    measureKey: string;
    stratification: string;
    productType: string;
    providerName: string;
    memberName: string;
    gender: string;
    dateOfBirth: string;
    
    constructor(measureDueDate: string,
    measureKey: string,
    stratification: string,
    productType: string,
    providerName: string,
    memberName: string,
    gender: string,
    dateOfBirth: string){
        this.measureDueDate = measureDueDate;
        this.measureKey = measureKey;
        this.stratification = stratification;
        this.productType = productType;
        this.providerName = providerName;
        this.memberName = memberName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
    }
}

export class OutreachOpenModel extends OutreachBaseModel{
    callStatus: string;
    
    constructor(measureDueDate: string,
    measureKey: string,
    stratification: string,
    callStatus: string,
    productType: string,
    providerName: string,
    memberName: string,
    gender: string,
    dateOfBirth: string) {
        super(measureDueDate,
        measureKey,
        stratification,
        productType,
        providerName,
        memberName,
        gender,
        dateOfBirth)
        this.callStatus = callStatus ;
    }
    
    public static generateSampleData(){
        let data = new Array<OutreachOpenModel>();
        data.push(new OutreachOpenModel("12/31/2016", "AAP", "45 - 64 years",	"No Answer", "Medicaid HMO", "PATTERSON DAVID G", "GRABOWSKI, MARY P", "F", "4/16/1963"));
        data.push(new OutreachOpenModel("12/31/2016", "CDC", "Eye Exam",	"Left Message", "Medicaid HMO", "BLACK, LINWOOD W", "MORRIS, SANDRA ARLENE", "F", "1/16/1961"));
        data.push(new OutreachOpenModel("12/31/2016", "AWC", "Total", "Busy", "Commercial HMO", "SCHRECK, PAULA K", "BAYLESS, LAUREN", "F", "2/1/2001"));
        data.push(new OutreachOpenModel("12/31/2016", "CDC", "HbA1c Testing", "Call Back Later", "Commercial HMO", "FRETZ, JENNIFER E", "HARPER, RUSSELL", "M", "2/11/1961"));
        data.push(new OutreachOpenModel("12/31/2016", "AWC", "Total", "Re-schedule appointment", "Medicaid HMO", "MIRZA, SHAKEELA F", "STONG, SOPHIA GRACE", "F", "8/26/1998"));
        data.push(new OutreachOpenModel("12/31/2016", "ABA", "Total", "No Answer", "Commercial HMO", "NAMAN, TED R", "NELSON, TUNIESIA", "F", "12/4/1968"));
        data.push(new OutreachOpenModel("12/31/2016", "AWC", "Total", "Left Message", "Commercial HMO", "FRETZ, JENNIFER E", "HIGHTOWER, MICHAEL", "M", "5/11/2002"));
        data.push(new OutreachOpenModel("12/31/2016", "CDC", "HbA1c Less Than 7.0", "Busy", "Medicaid HMO", "COSTANTINO, THOMAS G", "SLATER, RANDAL", "M", "5/6/1956"));
        data.push(new OutreachOpenModel("12/31/2016", "AWC", "Total", "Call Back Later", "Medicaid HMO", "SABERI, MOHAMMAD S", "CHANEY, ANTHONY MICHAEL", "M", "11/1/2004"));
        data.push(new OutreachOpenModel("12/31/2016", "AAP", "20 - 44 years", "Re-schedule appointment", "Medicaid HMO", "RICE, SUSAN", "LEWIS, WINDY", "F", "10/9/1989"));

        return data;
    }
}

export class OutreachScheduledModel extends OutreachBaseModel{
    appointmentDate: string;
    
    constructor(measureDueDate: string,
    measureKey: string,
    stratification: string,
    appointmentDate: string,    
    productType: string,
    providerName: string,
    memberName: string,
    gender: string,
    dateOfBirth: string) {
        super(measureDueDate,
        measureKey,
        stratification,
        productType,
        providerName,
        memberName,
        gender,
        dateOfBirth);
        this.appointmentDate = appointmentDate;
    }

    public static generateSampleData(){
        let data = new Array<OutreachScheduledModel>();
        data.push(new OutreachScheduledModel("12/20/2015", "CWP", "Total",	"9/15/2016", "Medicaid HMO", "CRISTESCU, EVA", "MARIAN, MARA", "F", "9/25/2010"));
        data.push(new OutreachScheduledModel("12/31/2016", "ABA", "Total",	"9/15/2016", "Medicaid HMO", "MATHEW , NEETHU", "LIGGINS, JUWAN RENEE", "F", "1/4/1970"));
        data.push(new OutreachScheduledModel("12/31/2016",	"CAP",	"12 - 19 years","9/20/2016","Medicaid HMO",	"HAQUE, MOHAMMED",	"LALONE, DOMMANIQUE R","F","11/28/2002"));
        data.push(new OutreachScheduledModel("12/31/2016",	"CCS",	"Total"	,"9/21/2016","Commercial POS",	"SMITH, SABRINA R","MALEH, JOUHAINA",	"F","8/26/1956"));
        data.push(new OutreachScheduledModel("12/20/2015","CWP","Total","9/22/2016","Medicaid HMO","HADDAD, JIRIES T","SALEH, DAOUD RADWAN","	M ","11/2/2006"	));
        data.push(new OutreachScheduledModel("12/31/2016","ABA","Total","9/23/2016","Commercial HMO","MARISTELA JR, GEORGE  T","AMBROZY, RITA","F","7/14/1954"	));
        data.push(new OutreachScheduledModel("12/31/2016","ABA","Total","9/24/2016","Commercial HMO","SURAPANENI, KIRANMAYI P","WATERS, PAMELA","F","7/15/1960"));	
 data.push(new OutreachScheduledModel("12/31/2016",	"COL",	"Total",	"10/10/2016",	"Commercial HMO",	"ELIAS, GEORGE A",	"NICHOLSON, RONNIE",	"M",	"12/17/1958"));	
 data.push(new OutreachScheduledModel("12/31/2016",	"ABA",	"Total",	"10/11/2016",	"Commercial POS",	"PERRIN, DARRLYN VANESSA",	"ROCKWELL, CHRISTINA",	"F","10/14/1985"));	
 data.push(new OutreachScheduledModel("12/31/2016",	"ABA",	"Total",	"10/12/2016",	"Commercial HMO",	"SULIMAN, NABIL",	"LEVANDOWSKI, SHERYL",	"F",	"7/6/1958"));	
 data.push(new OutreachScheduledModel("12/31/2016",	"ABA",	"Total",	"10/13/2016",	"Medicaid HMO",	"SURAPANENI, KIRANMAYI P",	"CARR, DONNA R",	"F",	"2/19/1962"));	
 data.push(new OutreachScheduledModel("12/31/2016",	"ABA",	"Total",	"10/14/2016",	"Commercial POS",	"SHORT, JEREMIAH ANTONIO",	"LIPPERT, BENJAMIN E",	"M",	"6/12/1980"));	
        return data;
    }
}

export class OutreachNewModel extends OutreachBaseModel{
    enrollTermDate: string;

    constructor(measureDueDate: string,
    measureKey: string,
    stratification: string,
    enrollTermDate: string,
    productType: string,
    providerName: string,
    memberName: string,
    gender: string,
    dateOfBirth: string) {
        super(measureDueDate,
        measureKey,
        stratification,
        productType,
        providerName,
        memberName,
        gender,
        dateOfBirth);
        this.enrollTermDate = enrollTermDate;
    }

    public static generateSampleData(){
        let data = new Array<OutreachNewModel>();
        data.push(new OutreachNewModel("12/20/2015", "CDC", "HbA1c Greater Than 9.0", "11/10/2016", "Commercial HMO", "KHATER, MONA", "BOOMER, MARYANN", "F", "1/11/1962"));
        data.push(new OutreachNewModel("12/31/2016", "AAP", "20 - 44 years", "11/11/2016", "Medicaid HMO", "CHANEY, GLORIA", "MAYS, DONALD DEANDRE", "M", "1/23/1989"));

        return data;
    }
}
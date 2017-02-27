import {SystemSettingGetModel} from './common.model';

export class DataImportSaveModel{
    ImportConfigID: string;
    ImportDateTime: Date;
    UpdatedBy: string;

    constructor(){
        
    }
} 

export class DataImportGetModel{
    IMPORT_CONFIG_ID: number;
    IMPORT_TYPE: string;
    IMPORT_DT_TM: Date;
    IMPORT_FILE_TYPE: string;
    UPT_BY: number;
    UPT_DT: Date;
    constructor(){        
    }
}

export class DataImportSystemSettingGetModel extends SystemSettingGetModel{
    
}

export class DataImportSystemSettingSaveModel{    
    systemSettingId: number;
    SETTING_NAME: string;
    settingValue: string;
    selected: boolean;
    UpdatedBy: number;
    constructor(){

    }
}
export class WeeklyCallCapacity{
   CALL_CPCTY: number;
}
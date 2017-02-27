declare var moment: any;

// logic for Dates localization.
export class DateExtensions {
    static localFormat = 'YYYY-MM-DD[T]HH:mm:ss';

    public static getDate(dt): Date {
        return this.getFormattedDate(dt, this.localFormat);
    }

    public static getFormattedDate(dt, format:string){
        let d = moment(dt).format(format);
        return moment(d).toDate();
    }
}
export class UserModel{
    User_ID: number;
    USER_ROLE_ID: number;
    USER_ROLE_NAME: string;
    FNAME: string;
    LNAME: string;
    fullName: string;
    
    constructor(
        userId: number,
        userRoleId: number,
        userRoleName: string,
        fName: string,
        lName: string){
            this.User_ID = userId;
            this.USER_ROLE_ID = userRoleId;
            this.USER_ROLE_NAME = userRoleName;
            this.FNAME = fName;
            this.LNAME = lName;
            this.fullName = fName + " " + lName;
    }
}
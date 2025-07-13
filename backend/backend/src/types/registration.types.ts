


export interface Registration{
    token:string;
    email:string;
    name:string;
    status:boolean;
    time:Date;
}




export enum RegistrationTokenStatus{
    UNEXIST = "unexist",
    ALREADY_USED = "already_used",
    EXPIRED = "expired",
    VALID = "valid"
}
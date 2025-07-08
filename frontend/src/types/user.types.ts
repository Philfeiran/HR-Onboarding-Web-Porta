import type OnboardingStatusType  from "./onboardingStatus.types";


export interface UserType{
    _id:string;
    username:string;
    email:string;
    password:string;
    house:string
    role: "admin" | "user" | "hr"

    isOnboarded:boolean;

    onboardingStatus:OnboardingStatusType;
    // createdAt:Date;
    // updatedAt:Date;
    // __v:number;
    // token:string;
}
import { type Registration, RegistrationTokenStatus } from "../types/registration.types";
import { getCollection } from "../db/dbService";
import { config } from "../config/loadConfig";
import {Collection, ObjectId} from 'mongodb';
import { v4 as uuidv4 } from 'uuid';


// 先设置高一点方便测试
const expireHours:number = 1000 * 60 * 60 * 24;


export class RegistrationModel{
    private collectionName:string;
    private databaseName:string;
    private collection!:Collection<Registration>;

    constructor(){
        this.collectionName = config.registrationCollectionName!;
        this.databaseName = config.employeeDatabaseName!;
        this.getCollection();
    }

    private async getCollection(){
        this.collection = await getCollection(this.databaseName,this.collectionName);
    }


    async createRegistration(name:string,email:string){
        let token = uuidv4();
        const registration:Registration = {
            token,
            email:email,
            name:name,
            status:false,
            time:new Date()
        }
        const result = await this.collection.insertOne(registration);
        return token;
    }

    

    async verifyRegistration(token:string){
        const result = await this.collection.findOne({token:token});
        // console.log(result);
        // 改成enum？
        if (!result){
            return RegistrationTokenStatus.UNEXIST;
        }
        if (result.status){
            return RegistrationTokenStatus.ALREADY_USED;
        }
        if (result.time.getTime() + expireHours < Date.now()){
            return RegistrationTokenStatus.EXPIRED;
        }
        return RegistrationTokenStatus.VALID;
    }

    async setRegistrationStatus(token:string){
        const result = await this.collection.updateOne({token:token},{
            $set:{
                status:true
            }
        });
    }


    async getAllRegistration(){
        const result:Registration[] = await this.collection.find({}).toArray();
        return result;
    }
    
    



}
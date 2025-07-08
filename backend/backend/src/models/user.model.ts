import { getCollection } from "../db/dbService";
import { config } from "../config/loadConfig";
import {Collection, ObjectId} from 'mongodb';
import {type User} from '../types/user.types';


export class UserModel{

    private collectionName: string;
    private databaseName:string;

    private collection!: Collection<User>;

    constructor(){
        this.collectionName = config.dbUserCollectionName!;
        this.databaseName = config.dbUserDatabaseName!;
        this.getCollection()
    }

    private async getCollection(){
        this.collection = await getCollection(this.databaseName,this.collectionName);
    }

    async duplicateCheck(email:string,userName:string){
        const user = await this.collection.findOne({$or:[{email},{userName}]});
        return user !== null;
    }

    async createUser(userName:string,email:string,password:string,role:"HR" | "Employee"){
        const userData = {userName,email,password,role};
        const result = await this.collection.insertOne(userData);
        return result;
    }

    async getUserByEmail(email:string){
        const user = await this.collection.findOne({email});
        return user;
    }







    
}







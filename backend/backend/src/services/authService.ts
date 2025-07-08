import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserModel} from '../models/user.model';
import {config} from '../config/loadConfig';
import {User} from '../types/user.types';
import {InsertOneResult} from 'mongodb';

const SALT_ROUNDS = parseInt(config.passwordSaltRounds!);


export class AuthService{

    private userModel: UserModel;

    // JWT Info
    private readonly jwtSecret: string;
    private readonly jwtExpiration: string;



    constructor(){
        this.userModel = new UserModel();
        this.jwtSecret = config.jwtSecret!;
        this.jwtExpiration = config.jwtExpiration!;
    }

    async registerUser(userName:string,email:string,password:string,role:"HR" | "Employee"):Promise<{user:InsertOneResult,token:string}>{
        console.log(userName,email);
        const duplicateCheck = await this.userModel.duplicateCheck(email,userName);
        if(duplicateCheck){
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password,SALT_ROUNDS);
        const result = await this.userModel.createUser(userName,email,hashedPassword,role);

        const token = await this.signToken(userName,role);
        return {user:result,token};
    }

    async loginUser(email:string,password:string):Promise<{user:any,token:string}>{
        const user = await this.userModel.getUserByEmail(email);
        if(!user){
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }

        const token = await this.signToken(user.userName,user.role);
        return {user,token};
    }


    private async signToken(userName:string,role:"HR" | "Employee"):Promise<string>{
        const payload = {userName,role};
        const token = jwt.sign(payload,this.jwtSecret,{expiresIn: this.jwtExpiration as any});
        return token;
    }

    async verifyToken(token:string):Promise<{userName:string,role:"HR" | "Employee"}>{
        const decoded = jwt.verify(token,this.jwtSecret) as {userName:string,role:"HR" | "Employee"};
        return decoded;
    }
}
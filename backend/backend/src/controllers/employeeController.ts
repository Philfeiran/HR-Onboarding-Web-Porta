import {Request,Response,NextFunction} from 'express';
import {EmployeeModel} from '../models/employee.model';


export class EmployeeController{
    private employeeModel:EmployeeModel;

    constructor(){
        this.employeeModel = new EmployeeModel();
    }

    async getAllEmployee(req:Request,res:Response,next:NextFunction): Promise<void>{
        try{
            const result = await this.employeeModel.getAllEmployee();
            // console.log(result);
            res.status(200);
            res.json(result);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}
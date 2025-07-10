import { Request, Response, NextFunction } from "express";
import { EmployeeModel } from "../models/employee.model";

export class EmployeeController {
  private employeeModel: EmployeeModel;

  constructor() {
    this.employeeModel = new EmployeeModel();
  }

  async getAllEmployee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.employeeModel.getAllEmployee();
      // console.log(result);
      res.status(200);
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getEmployeeByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    
    const email = req.params.email;
    try {
      const result = await this.employeeModel.getEmployeeByEmail(email);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

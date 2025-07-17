import { Request, Response, NextFunction } from "express";
import { EmployeeModel } from "../models/employee.model";
import { ObjectId } from "mongodb";

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

  async submitOnboardingApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, dataToSubmit } = req.body;
      console.log(email);
      console.log(dataToSubmit);
      
      if (!email || !dataToSubmit) {
        res
          .status(400)
          .json({ message: "Email and employee data are required" });
        return;
      }
      await this.employeeModel.updateEmployeeByEmail(email, dataToSubmit);
      res
        .status(201)
        .json({ message: "Onboarding application submitted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateEmployeePersonalInformationByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, dataToUpdate } = req.body;
      if (!email || !dataToUpdate) {
        res
          .status(400)
          .json({ message: "Email and employee data are required" });
        return;
      }
      await this.employeeModel.updateEmployeeByEmail(email, dataToUpdate);
      res.status(200).json({
        message: "Employee personal information updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getEmployeeById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.params.id;
    try {
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid employee ID" });
        return;
      }
      const result = await this.employeeModel.getEmployeeById(id);
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

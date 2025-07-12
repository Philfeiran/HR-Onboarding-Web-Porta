import { Request, Response, NextFunction } from "express";
import { RegistrationModel } from "../models/registration.model";
import { EmployeeModel } from "@src/models/employee.model";
import type Employee from "@src/types/employee.types";

export class RegistrationController {
  private registrationModel: RegistrationModel;

  constructor() {
    this.registrationModel = new RegistrationModel();
  }

  async createRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);
      const { name, email } = req.body;
      if (!name || !email) {
        console.log("Missing required fields");
        res.status(400);
        res.json({ error: "Missing required fields" });
        return;
      }

      const result = await this.registrationModel.createRegistration(
        name,
        email
      );

      console.log(result);
      res.status(200);
      res.json({ token: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async verifyRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      const result = await this.registrationModel.verifyRegistration(token);
      res.status(200);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }

  async getAllRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.registrationModel.getAllRegistration();
      res.status(200);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }

  async setRegistrationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      const result = await this.registrationModel.setRegistrationStatus(token);
      res.status(200);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
}

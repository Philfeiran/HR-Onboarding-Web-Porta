import { Request, Response, NextFunction } from "express";
import { RegistrationModel } from "../models/registration.model";
import { sendEmail } from "../services/emailService";
import { config } from "../config/loadConfig";
import { RegistrationTokenStatus } from "../types/registration.types";

export class RegistrationController {
  private registrationModel: RegistrationModel;

  constructor() {
    this.registrationModel = new RegistrationModel();
  }

  

  // async createRegistration(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     console.log(req.body);
  //     const { name, email } = req.body;
  //     if (!name || !email) {
  //       console.log("Missing required fields");
  //       res.status(400);
  //       res.json({ error: "Missing required fields" });
  //       return;
  //     }

  //     const result = await this.registrationModel.createRegistration(
  //       name,
  //       email
  //     );

  //     console.log(result);
  //     res.status(200);
  //     res.json({ token: result });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }


  async sendRegistrationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        console.log("Missing required fields");
        res.status(400);
        res.json({ error: "Missing required fields" });
        return;
      }


      const token = await this.registrationModel.createRegistration(
        name,
        email
      );


      //generate token
      const url = `${config.frontendUrl}/registration?token=${token}`;

      await sendEmail({name,url,email});
      res.status(200);
      res.json({ message: "Email sent successfully" });

    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  
  

  async verifyRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(400).json({
          error: "Missing token",
          message: "缺少token参数"
        });
        return;
      }

      const tokenStatus: RegistrationTokenStatus = await this.registrationModel.verifyRegistration(token);
      
      if (tokenStatus === RegistrationTokenStatus.UNEXIST) {
        res.status(400).json({
          error: "Invalid token",
          message: "无效的token",
          status: tokenStatus
        });
        return;
      }
      
      if (tokenStatus === RegistrationTokenStatus.ALREADY_USED) {
        res.status(400).json({
          error: "Token already used",
          message: "token已使用",
          status: tokenStatus
        });
        return;
      }
      
      if (tokenStatus === RegistrationTokenStatus.EXPIRED) {
        res.status(400).json({
          error: "Token expired",
          message: "token已过期",
          status: tokenStatus
        });
        return;
      }
      
      // Token is valid
      res.status(200).json({
        message: "Token is valid",
        status: tokenStatus
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        error: "Internal server error",
        message: "服务器内部错误"
      });
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

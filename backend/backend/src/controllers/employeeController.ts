import { Request, Response, NextFunction } from 'express';
import { EmployeeModel } from '../models/employee.model';
import type Employee from '../types/employee.types';

export class EmployeeController {
  private employeeModel: EmployeeModel;

  constructor() {
    this.employeeModel = new EmployeeModel();
  }

  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee: Employee = req.body;
      const result = await this.employeeModel.createEmployee(employee);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employees = await this.employeeModel.getAllEmployee();
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const employee = await this.employeeModel.getEmployeeByEmail(email);
      if (!employee) {
        res.status(404).json({ message: "Employee not found" });
      } else {
        res.json(employee);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateEmployeeByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const employeeData: Partial<Employee> = req.body;
      const result = await this.employeeModel.updateEmployeeByEmail(email, employeeData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async submitOnboardingApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email, dataToSubmit} = req.body;
      if (!email || !dataToSubmit) {
        res.status(400).json({ message: "Email and employee data are required" });
      } else {
        // 添加提交时间和状态
        const applicationData = {
          ...dataToSubmit,
          status: "Pending",
          submittedAt: new Date(),
          statusUpdatedAt: new Date()
        };
        await this.employeeModel.updateEmployeeByEmail(email, applicationData);
        res.status(201).json({ message: "Onboarding application submitted successfully" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // HR相关方法
  // 获取所有onboarding申请
  async getAllOnboardingApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await this.employeeModel.getAllOnboardingApplications();
      res.json({
        message: "获取所有onboarding申请成功",
        applications
      });
    } catch (error) {
      next(error);
    }
  }

  // 根据状态获取申请
  async getApplicationsByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.params;
      if (!["Pending", "Approved", "Rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status. Must be Pending, Approved, or Rejected" });
      } else {
        const applications = await this.employeeModel.getApplicationsByStatus(status as "Pending" | "Approved" | "Rejected");
        res.json({
          message: `获取${status}状态的申请成功`,
          applications
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // 更新申请状态（审批或拒绝）
  async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, status, reviewedBy } = req.body;
      if (!email || !status || !reviewedBy) {
        res.status(400).json({ message: "Email, status, and reviewedBy are required" });
      } else if (!["Pending", "Approved", "Rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status. Must be Pending, Approved, or Rejected" });
      } else {
        const result = await this.employeeModel.updateApplicationStatus(email, status, reviewedBy);
        if (result.matchedCount === 0) {
          res.status(404).json({ message: "Employee not found" });
        } else {
          res.json({ 
            message: `申请状态更新为${status}成功`,
            result 
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  // 添加HR反馈
  async addHRFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, comment, reviewedBy } = req.body;
      if (!email || !comment || !reviewedBy) {
        res.status(400).json({ message: "Email, comment, and reviewedBy are required" });
      } else {
        const result = await this.employeeModel.addHRFeedback(email, comment, reviewedBy);
        if (result.matchedCount === 0) {
          res.status(404).json({ message: "Employee not found" });
        } else {
          res.json({ 
            message: "HR反馈添加成功",
            result 
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  // 审批申请（同时更新状态和添加反馈）
  async approveApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, reviewedBy, comment } = req.body;
      if (!email || !reviewedBy) {
        res.status(400).json({ message: "Email and reviewedBy are required" });
      } else {
        // 更新状态为Approved
        await this.employeeModel.updateApplicationStatus(email, "Approved", reviewedBy);
        
        // 如果有评论，添加反馈
        if (comment) {
          await this.employeeModel.addHRFeedback(email, comment, reviewedBy);
        }
        
        res.json({ message: "申请审批成功" });
      }
    } catch (error) {
      next(error);
    }
  }

  // 拒绝申请（同时更新状态和添加反馈）
  async rejectApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, reviewedBy, comment } = req.body;
      if (!email || !reviewedBy) {
        res.status(400).json({ message: "Email and reviewedBy are required" });
      } else {
        // 更新状态为Rejected
        await this.employeeModel.updateApplicationStatus(email, "Rejected", reviewedBy);
        
        // 如果有评论，添加反馈
        if (comment) {
          await this.employeeModel.addHRFeedback(email, comment, reviewedBy);
        }
        
        res.json({ message: "申请拒绝成功" });
      }
    } catch (error) {
      next(error);
    }
  }
}


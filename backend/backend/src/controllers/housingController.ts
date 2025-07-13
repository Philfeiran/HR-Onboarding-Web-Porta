import { Request, Response, NextFunction } from "express";
import { HousingModel } from "../models/housing.model";
import type { CreateFacilityReportRequest, AddCommentRequest, UpdateReportStatusRequest } from "../types/housing.types";

export class HousingController {
  private housingModel: HousingModel;

  constructor() {
    this.housingModel = new HousingModel();
  }

  // Housing Details Methods
  async getHousingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.params.email;
      const result = await this.housingModel.getHousingDetailsByEmail(email);
      
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Housing details not found" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async createHousingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const housingData = req.body;
      const result = await this.housingModel.createHousingDetails(housingData);
      res.status(201).json({ message: "Housing details created successfully", result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateHousingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, housingData } = req.body;
      if (!email || !housingData) {
        res.status(400).json({ message: "Email and housing data are required" });
        return;
      }
      
      const result = await this.housingModel.updateHousingDetails(email, housingData);
      res.status(200).json({ message: "Housing details updated successfully", result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Facility Reports Methods
  async createFacilityReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, employeeEmail }: CreateFacilityReportRequest = req.body;
      
      if (!title || !description || !employeeEmail) {
        res.status(400).json({ message: "Title, description, and employee email are required" });
        return;
      }

      const report = {
        title,
        description,
        createdBy: employeeEmail,
        status: "Open" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: []
      };

      const result = await this.housingModel.createFacilityReport(report);
      res.status(201).json({ message: "Facility report created successfully", result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getFacilityReportsByEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.params.email;
      const reports = await this.housingModel.getFacilityReportsByEmployee(email);
      res.status(200).json(reports);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getFacilityReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reportId = req.params.reportId;
      const report = await this.housingModel.getFacilityReportById(reportId);
      
      if (report) {
        res.status(200).json(report);
      } else {
        res.status(404).json({ message: "Facility report not found" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async addCommentToReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reportId, description, userEmail }: AddCommentRequest = req.body;
      
      if (!reportId || !description || !userEmail) {
        res.status(400).json({ message: "Report ID, description, and user email are required" });
        return;
      }

      const comment = {
        reportId,
        description,
        createdBy: userEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.housingModel.addCommentToReport(reportId, comment);
      res.status(200).json({ message: "Comment added successfully", result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateReportStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reportId, status }: UpdateReportStatusRequest = req.body;
      
      if (!reportId || !status) {
        res.status(400).json({ message: "Report ID and status are required" });
        return;
      }

      const result = await this.housingModel.updateFacilityReportStatus(reportId, status);
      res.status(200).json({ message: "Report status updated successfully", result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // HR Methods
  async getAllFacilityReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await this.housingModel.getAllFacilityReports();
      res.status(200).json(reports);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
} 
import http from "../utils/https";
import { endpoints } from "../configs/config";
import type { 
  HousingDetails, 
  FacilityReport, 
  CreateFacilityReportRequest, 
  AddCommentRequest, 
  UpdateReportStatusRequest 
} from "../types/housing.types";

export const housingService = {
  // Housing Details
  async getHousingDetails(email: string): Promise<HousingDetails> {
    try {
      const response = await http.get(endpoints.getHousingDetailsEndpoint(email));
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch housing details");
    }
  },

  async createHousingDetails(housingData: HousingDetails): Promise<void> {
    try {
      const response = await http.post(endpoints.createHousingDetailsEndpoint, housingData);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to create housing details");
    }
  },

  async updateHousingDetails(email: string, housingData: Partial<HousingDetails>): Promise<void> {
    try {
      const response = await http.put(endpoints.updateHousingDetailsEndpoint, { email, housingData });
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to update housing details");
    }
  },

  // Facility Reports
  async createFacilityReport(reportData: CreateFacilityReportRequest): Promise<void> {
    try {
      const response = await http.post(endpoints.createFacilityReportEndpoint, reportData);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to create facility report");
    }
  },

  async getFacilityReportsByEmployee(email: string): Promise<FacilityReport[]> {
    try {
      const response = await http.get(endpoints.getFacilityReportsByEmployeeEndpoint(email));
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch facility reports");
    }
  },

  async getFacilityReportById(reportId: string): Promise<FacilityReport> {
    try {
      const response = await http.get(endpoints.getFacilityReportByIdEndpoint(reportId));
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch facility report");
    }
  },

  async addCommentToReport(commentData: AddCommentRequest): Promise<void> {
    try {
      const response = await http.post(endpoints.addCommentToReportEndpoint, commentData);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to add comment");
    }
  },

  async updateReportStatus(statusData: UpdateReportStatusRequest): Promise<void> {
    try {
      const response = await http.put(endpoints.updateReportStatusEndpoint, statusData);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to update report status");
    }
  },

  // HR Methods
  async getAllHousingDetails(): Promise<HousingDetails[]> {
    try {
      const response = await http.get(endpoints.getAllHousingDetailsEndpoint);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch all housing details");
    }
  },

  async getAllFacilityReports(): Promise<FacilityReport[]> {
    try {
      const response = await http.get(endpoints.getAllFacilityReportsEndpoint);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch all facility reports");
    }
  },
}; 
import { Request, Response } from 'express';
import { visaStatusModel, DocumentUploadRequest, DocumentApprovalRequest } from '../models/visaStatus.model';

export const visaStatusController = {
  async getVisaStatus(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const visaStatus = await visaStatusModel.getVisaStatus(employeeId);
      if (!visaStatus) {
        return res.status(404).json({ message: 'Visa status not found' });
      }
      res.json(visaStatus);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getVisaStatusByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const visaStatus = await visaStatusModel.getVisaStatusByEmail(email);
      if (!visaStatus) {
        return res.status(404).json({ message: 'Visa status not found' });
      }
      res.json(visaStatus);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async createVisaStatus(req: Request, res: Response) {
    try {
      const { employeeId, employeeEmail } = req.body;
      if (!employeeId || !employeeEmail) {
        return res.status(400).json({ message: 'Employee ID and email are required' });
      }
      const existingVisaStatus = await visaStatusModel.getVisaStatus(employeeId);
      if (existingVisaStatus) {
        return res.status(409).json({ message: 'Visa status already exists for this employee' });
      }
      const newVisaStatus = await visaStatusModel.createVisaStatus({
        employeeId,
        employeeEmail,
      });
      res.status(201).json(newVisaStatus);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async uploadDocument(req: Request, res: Response) {
    try {
      const { employeeId, documentType, fileName, fileUrl } = req.body;
      if (!employeeId || !documentType || !fileName || !fileUrl) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const uploadRequest: DocumentUploadRequest = {
        employeeId,
        documentType,
        fileName,
        fileUrl,
      };
      await visaStatusModel.uploadDocument(uploadRequest);
      res.json({ message: 'Document uploaded successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async approveDocument(req: Request, res: Response) {
    try {
      const { employeeId, documentType, status, feedback } = req.body;
      console.log('Approval request:', { employeeId, documentType, status, feedback });
      
      if (!employeeId || !documentType || !status) {
        return res.status(400).json({ message: 'Employee ID, document type, and status are required' });
      }
      const approvalRequest: DocumentApprovalRequest = {
        employeeId,
        documentType,
        status,
        feedback,
      };
      await visaStatusModel.approveDocument(approvalRequest);
      res.json({ message: 'Document status updated successfully' });
    } catch (error) {
      console.error('Error in approveDocument:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },

  async getPendingDocuments(req: Request, res: Response) {
    try {
      const pendingDocuments = await visaStatusModel.getPendingDocuments();
      res.json(pendingDocuments);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAllVisaStatuses(req: Request, res: Response) {
    try {
      const allVisaStatuses = await visaStatusModel.getAllVisaStatuses();
      res.json(allVisaStatuses);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default visaStatusController; 
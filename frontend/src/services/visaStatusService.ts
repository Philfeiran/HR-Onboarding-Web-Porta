import https from '../utils/https';
import { endpoints } from '../configs/config';
import type { 
  VisaStatusData, 
  DocumentUploadRequest, 
  DocumentApprovalRequest,
  DocumentType 
} from '../types/visaStatus.types';

export const visaStatusService = {
  // Get visa status for an employee
  async getVisaStatus(employeeId: string): Promise<VisaStatusData> {
    const response = await https.get(endpoints.getVisaStatusEndpoint(employeeId));
    return response.data;
  },

  // Upload a document
  async uploadDocument(request: DocumentUploadRequest): Promise<void> {
    const formData = new FormData();
    formData.append('documentType', request.documentType);
    formData.append('file', request.file);
    formData.append('employeeId', request.employeeId);

    await https.post(endpoints.uploadDocumentEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download I-983 template (empty or sample)
  async downloadI983Template(templateType: 'empty' | 'sample'): Promise<Blob> {
    const response = await https.get(`${endpoints.getAllVisaStatusesEndpoint}/i983-template/${templateType}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document status for HR approval
  async getDocumentStatus(employeeId: string, documentType: DocumentType) {
    const response = await https.get(`${endpoints.getVisaStatusEndpoint(employeeId)}/document/${documentType}`);
    return response.data;
  },

  // HR approves or rejects a document
  async approveDocument(request: DocumentApprovalRequest): Promise<void> {
    await https.post(endpoints.approveDocumentEndpoint, request);
  },

  // Get all pending documents for HR
  async getPendingDocuments(): Promise<any[]> {
    try {
      const response = await https.get(endpoints.getPendingDocumentsEndpoint);
      console.log('Pending documents response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      return [];
    }
  },
}; 
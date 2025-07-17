import https from '../utils/https';
import type { 
  VisaStatusData, 
  DocumentUploadRequest, 
  DocumentApprovalRequest,
  DocumentType 
} from '../types/visaStatus.types';

const BASE_URL = '/api/visa-status';

export const visaStatusService = {
  // Get visa status for an employee
  async getVisaStatus(employeeId: string): Promise<VisaStatusData> {
    const response = await https.get(`${BASE_URL}/${employeeId}`);
    return response.data;
  },

  // Upload a document
  async uploadDocument(request: DocumentUploadRequest): Promise<void> {
    const formData = new FormData();
    formData.append('documentType', request.documentType);
    formData.append('file', request.file);
    formData.append('employeeId', request.employeeId);

    await https.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download I-983 template (empty or sample)
  async downloadI983Template(templateType: 'empty' | 'sample'): Promise<Blob> {
    const response = await https.get(`${BASE_URL}/i983-template/${templateType}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document status for HR approval
  async getDocumentStatus(employeeId: string, documentType: DocumentType) {
    const response = await https.get(`${BASE_URL}/${employeeId}/document/${documentType}`);
    return response.data;
  },

  // HR approves or rejects a document
  async approveDocument(request: DocumentApprovalRequest): Promise<void> {
    await https.post(`${BASE_URL}/approve`, request);
  },

  // Get all pending documents for HR
  async getPendingDocuments(): Promise<any[]> {
    try {
      const response = await https.get(`${BASE_URL}/pending`);
      console.log('Pending documents response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      return [];
    }
  },
}; 
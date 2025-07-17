export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';

export interface VisaDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  hrFeedback?: string;
  fileUrl?: string;
}

export interface OPTVisaStatus {
  optReceipt: VisaDocument;
  optEad: VisaDocument;
  i983: VisaDocument;
  i20: VisaDocument;
}

export interface VisaStatusData {
  employeeId: string;
  workAuthorizationType: 'F1(CPT/OPT)' | 'H1-B' | 'L2' | 'H4' | 'Other';
  optVisaStatus?: OPTVisaStatus;
  lastUpdated: string;
}

export type DocumentType = 'optReceipt' | 'optEad' | 'i983' | 'i20';

export interface DocumentUploadRequest {
  documentType: DocumentType;
  file: File;
  employeeId: string;
}

export interface DocumentApprovalRequest {
  documentType: DocumentType;
  status: 'approved' | 'rejected';
  feedback?: string;
  employeeId: string;
} 
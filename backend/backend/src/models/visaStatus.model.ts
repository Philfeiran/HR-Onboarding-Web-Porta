import { Collection, ObjectId } from 'mongodb';
import { getCollection } from '../db/dbService';
import { config } from '../config/loadConfig';

export interface VisaDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export interface OPTVisaStatus {
  optReceipt: VisaDocument;
  optEad: VisaDocument;
  i983: VisaDocument;
  i20: VisaDocument;
}

export interface VisaStatusData {
  employeeId: string;
  employeeEmail: string;
  optVisaStatus?: OPTVisaStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentUploadRequest {
  employeeId: string;
  documentType: 'optReceipt' | 'optEad' | 'i983' | 'i20';
  fileName: string;
  fileUrl: string;
}

export interface DocumentApprovalRequest {
  employeeId: string;
  documentType: 'optReceipt' | 'optEad' | 'i983' | 'i20';
  status: 'approved' | 'rejected';
  feedback?: string;
}

class VisaStatusModel {
  async getVisaStatus(employeeId: string): Promise<VisaStatusData | null> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    return await collection.findOne({ employeeId });
  }

  async getVisaStatusByEmail(employeeEmail: string): Promise<VisaStatusData | null> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    return await collection.findOne({ employeeEmail });
  }

  async createVisaStatus(visaStatus: Omit<VisaStatusData, 'createdAt' | 'updatedAt'>): Promise<VisaStatusData> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    const now = new Date();
    const newVisaStatus: VisaStatusData = {
      ...visaStatus,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(newVisaStatus);
    return { ...newVisaStatus, _id: result.insertedId } as VisaStatusData;
  }

  async updateVisaStatus(employeeId: string, updates: Partial<VisaStatusData>): Promise<VisaStatusData | null> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await collection.updateOne(
      { employeeId },
      { $set: updateData }
    );
    return await this.getVisaStatus(employeeId);
  }

  async uploadDocument(request: DocumentUploadRequest): Promise<void> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    const visaStatus = await this.getVisaStatus(request.employeeId);
    if (!visaStatus) {
      throw new Error('Visa status not found for employee');
    }
    const document: VisaDocument = {
      id: new ObjectId().toString(),
      fileName: request.fileName,
      fileUrl: request.fileUrl,
      uploadDate: new Date(),
      status: 'pending',
    };
    const updatePath = `optVisaStatus.${request.documentType}`;
    await collection.updateOne(
      { employeeId: request.employeeId },
      { $set: { [updatePath]: document, updatedAt: new Date() } }
    );
  }

  async approveDocument(request: DocumentApprovalRequest): Promise<void> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    
    // First check if the visa status exists
    const existingVisaStatus = await this.getVisaStatus(request.employeeId);
    if (!existingVisaStatus) {
      throw new Error(`Visa status not found for employee ID: ${request.employeeId}`);
    }
    
    // Check if the document exists
    if (!existingVisaStatus.optVisaStatus || !existingVisaStatus.optVisaStatus[request.documentType]) {
      throw new Error(`Document ${request.documentType} not found for employee ID: ${request.employeeId}`);
    }
    
    const updatePath = `optVisaStatus.${request.documentType}`;
    const updateData: any = {
      [`${updatePath}.status`]: request.status,
      updatedAt: new Date(),
    };
    if (request.feedback) {
      updateData[`${updatePath}.feedback`] = request.feedback;
    }
    
    const result = await collection.updateOne(
      { employeeId: request.employeeId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error(`Failed to update document status for employee ID: ${request.employeeId}`);
    }
  }

  async getPendingDocuments(): Promise<any[]> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    const visaStatuses = await collection.find({
      $or: [
        { 'optVisaStatus.optReceipt.status': 'pending' },
        { 'optVisaStatus.optEad.status': 'pending' },
        { 'optVisaStatus.i983.status': 'pending' },
        { 'optVisaStatus.i20.status': 'pending' },
      ],
    }).toArray();

    const pendingDocuments: any[] = [];
    
    visaStatuses.forEach(visaStatus => {
      if (visaStatus.optVisaStatus) {
        Object.entries(visaStatus.optVisaStatus).forEach(([documentType, document]) => {
          if (document.status === 'pending') {
            pendingDocuments.push({
              employeeId: visaStatus.employeeId,
              employeeName: visaStatus.employeeEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              employeeEmail: visaStatus.employeeEmail,
              documentType: documentType,
              status: document.status,
              uploadedAt: document.uploadDate,
              fileName: document.fileName,
              fileUrl: document.fileUrl,
            });
          }
        });
      }
    });

    return pendingDocuments;
  }

  async getAllVisaStatuses(): Promise<VisaStatusData[]> {
    const collection = await getCollection<VisaStatusData>(config.dbUserDatabaseName!, 'visaStatus');
    return await collection.find({}).toArray();
  }
}

export const visaStatusModel = new VisaStatusModel(); 
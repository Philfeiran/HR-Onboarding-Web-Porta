# Visa Status Management Feature

## Overview

The Visa Status Management feature allows employees with OPT (Optional Practical Training) visas to manage their work authorization documents and track the approval process. This feature is specifically designed for F1(CPT/OPT) visa holders and provides a step-by-step workflow for document submission and approval.

## Features

### For Employees (OPT Visa Holders)

1. **Document Upload Workflow**
   - Sequential document upload (one document at a time)
   - Only allows upload of next document after previous one is approved
   - Support for PDF, JPG, JPEG, and PNG file formats

2. **Document Types**
   - **OPT Receipt**: Initial document from onboarding application
   - **OPT EAD**: Employment Authorization Document
   - **I-983**: Training Plan form (with downloadable templates)
   - **I-20**: Updated student visa document

3. **Status Tracking**
   - Real-time status updates for each document
   - Clear next steps and instructions
   - HR feedback display for rejected documents

4. **I-983 Template Downloads**
   - Empty template for filling out
   - Sample template for reference
   - Direct download functionality

### For HR

1. **Document Approval System**
   - Review uploaded documents
   - Approve or reject with feedback
   - Track all pending documents

2. **Status Management**
   - Update document status
   - Provide feedback for rejections
   - Monitor overall visa status progress

## Technical Implementation

### Frontend Components

1. **VisaStatusPage** (`frontend/src/pages/employeesPage/pages/visaStatusPage/VisaStatusPage.tsx`)
   - Main component for employee visa status management
   - Handles document uploads and status display
   - Implements sequential workflow logic

2. **Types** (`frontend/src/types/visaStatus.types.ts`)
   - TypeScript interfaces for visa status data
   - Document status and approval types
   - API request/response types

3. **Service** (`frontend/src/services/visaStatusService.ts`)
   - API communication layer
   - Document upload/download functions
   - Status management functions

### Backend Requirements

The backend should implement the following API endpoints:

```
GET /api/visa-status/:employeeId
POST /api/visa-status/upload
GET /api/visa-status/i983-template/:type
GET /api/visa-status/:employeeId/document/:documentType
POST /api/visa-status/approve
GET /api/visa-status/pending
```

### Database Schema

```typescript
interface VisaStatusData {
  employeeId: string;
  workAuthorizationType: 'F1(CPT/OPT)' | 'H1-B' | 'L2' | 'H4' | 'Other';
  optVisaStatus?: {
    optReceipt: VisaDocument;
    optEad: VisaDocument;
    i983: VisaDocument;
    i20: VisaDocument;
  };
  lastUpdated: string;
}

interface VisaDocument {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  uploadedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  hrFeedback?: string;
  fileUrl?: string;
}
```

## Workflow

### Document Submission Process

1. **OPT Receipt**
   - Employee uploads OPT receipt from onboarding
   - Status: Pending → HR Review
   - If approved: Proceed to OPT EAD
   - If rejected: Show feedback, allow resubmission

2. **OPT EAD**
   - Employee uploads Employment Authorization Document
   - Status: Pending → HR Review
   - If approved: Proceed to I-983
   - If rejected: Show feedback, allow resubmission

3. **I-983 Training Plan**
   - Employee downloads templates (empty/sample)
   - Employee fills out and uploads completed form
   - Status: Pending → HR Review
   - If approved: Proceed to I-20
   - If rejected: Show feedback, allow resubmission

4. **I-20**
   - Employee uploads updated I-20 from school
   - Status: Pending → HR Review
   - If approved: All documents complete
   - If rejected: Show feedback, allow resubmission

### Status Messages

Each document type has specific status messages:

- **Pending**: "Waiting for HR to approve [document]"
- **Approved**: Next step instructions
- **Rejected**: "Please review HR feedback and resubmit"
- **Not Submitted**: Initial upload instructions

## Security Considerations

1. **File Upload Security**
   - File type validation (PDF, JPG, JPEG, PNG only)
   - File size limits
   - Secure file storage

2. **Access Control**
   - Only OPT visa holders can access the feature
   - HR role required for approval actions
   - Employee can only view their own documents

3. **Data Privacy**
   - Secure document storage
   - Encrypted file transfers
   - Audit trail for document changes

## UI/UX Features

1. **Responsive Design**
   - Mobile-friendly interface
   - Material-UI components
   - Consistent styling with the rest of the application

2. **User Experience**
   - Clear progress indicators
   - Intuitive document upload flow
   - Helpful status messages and instructions

3. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode support

## Integration Points

1. **Employee Dashboard**
   - Link to visa status management for OPT holders
   - Status overview in dashboard

2. **Onboarding Application**
   - OPT receipt from onboarding form
   - Work authorization type detection

3. **HR Dashboard**
   - Pending document approvals
   - Employee visa status overview

## Future Enhancements

1. **Email Notifications**
   - Status change notifications
   - Reminder emails for pending actions

2. **Document Preview**
   - In-browser document viewing
   - Thumbnail generation

3. **Bulk Operations**
   - HR bulk approval/rejection
   - Batch document processing

4. **Advanced Analytics**
   - Processing time tracking
   - Document approval rates
   - Compliance reporting

## Testing

### Unit Tests
- Component rendering
- Status logic validation
- File upload handling

### Integration Tests
- API endpoint testing
- Document workflow testing
- User role validation

### E2E Tests
- Complete document submission flow
- HR approval process
- Error handling scenarios

## Deployment Notes

1. **Environment Variables**
   - File upload configuration
   - API endpoint URLs
   - Storage service credentials

2. **Dependencies**
   - File upload handling
   - PDF generation for templates
   - Image processing for thumbnails

3. **Monitoring**
   - File upload success rates
   - API response times
   - Error tracking

## Support and Maintenance

1. **Documentation**
   - User guides for employees
   - HR approval procedures
   - Technical documentation

2. **Troubleshooting**
   - Common issues and solutions
   - Error code reference
   - Contact information for support

3. **Updates**
   - Regular security updates
   - Feature enhancements
   - Bug fixes and improvements 
import { Router } from 'express';
import { visaStatusController } from '../controllers/visaStatusController';

const router = Router();

// Get all visa statuses
router.get('/', visaStatusController.getAllVisaStatuses);
// Get pending documents for HR
router.get('/pending', visaStatusController.getPendingDocuments);
// Get visa status by email
router.get('/email/:email', visaStatusController.getVisaStatusByEmail);
// Get visa status by employee ID
router.get('/:employeeId', visaStatusController.getVisaStatus);
// Create new visa status
router.post('/', visaStatusController.createVisaStatus);
// Upload document
router.post('/upload', visaStatusController.uploadDocument);
// Approve or reject document
router.post('/approve', visaStatusController.approveDocument);

export default router; 
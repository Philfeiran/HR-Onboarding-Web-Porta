import { Router, Request, Response, NextFunction } from 'express';
import { HousingController } from '../controllers/housingController';
import { authenticate, requireHR, requireRole } from '../middleware/authMiddleware';

const router = Router();
const housingController = new HousingController();

// Housing Details Routes
// Get housing details for an employee
router.get('/details/:email', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.getHousingDetails(req, res, next);
});

// Create housing details (HR only)
router.post('/details', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.createHousingDetails(req, res, next);
});

// Update housing details (HR only)
router.put('/details', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.updateHousingDetails(req, res, next);
});

// Facility Reports Routes
// Create a new facility report (Employees only)
router.post('/facility-reports', authenticate, requireRole('Employee'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.createFacilityReport(req, res, next);
});

// Get facility reports for an employee
router.get('/facility-reports/:email', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.getFacilityReportsByEmployee(req, res, next);
});

// Get a specific facility report by ID
router.get('/facility-reports/report/:reportId', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.getFacilityReportById(req, res, next);
});

// Add a comment to a facility report
router.post('/facility-reports/comment', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.addCommentToReport(req, res, next);
});

// Update facility report status (HR only)
router.put('/facility-reports/status', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.updateReportStatus(req, res, next);
});

// Get all facility reports (HR only)
router.get('/facility-reports', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await housingController.getAllFacilityReports(req, res, next);
});

export default router; 
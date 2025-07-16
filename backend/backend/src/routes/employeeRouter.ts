import { Router, Request, Response, NextFunction } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { authenticate, requireHR, requireRole } from '../middleware/authMiddleware';

const router = Router();
const employeeController = new EmployeeController();

// 获取所有员工 - 需要认证
// router.get('/employees', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await employeeController.getAllEmployee(req, res, next);
// });

// 获取所有员工 - 需要HR权限
router.get('', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.getAllEmployee(req, res, next);
});

// 获取员工信息 - 需要认证
router.get('/:email', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.getEmployeeByEmail(req, res, next);
});

// 提交入职申请 - 需要认证
router.post('/onboarding-application', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.submitOnboardingApplication(req, res, next);
});

// ========== HR相关路由 ==========

// 获取所有onboarding申请 - 需要HR权限
router.get('/hr/onboarding-applications', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.getAllOnboardingApplications(req, res, next);
});

// 根据状态获取申请 - 需要HR权限
router.get('/hr/applications/:status', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.getApplicationsByStatus(req, res, next);
});

// 更新申请状态 - 需要HR权限
router.put('/hr/application-status', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.updateApplicationStatus(req, res, next);
});

// 添加HR反馈 - 需要HR权限
router.post('/hr/feedback', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.addHRFeedback(req, res, next);
});

// 审批申请 - 需要HR权限
router.post('/hr/approve', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.approveApplication(req, res, next);
});

// 拒绝申请 - 需要HR权限
router.post('/hr/reject', authenticate, requireHR, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await employeeController.rejectApplication(req, res, next);
});

export default router; 
import { Router, Request, Response, NextFunction } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { authenticate, requireHR } from '../middleware/authMiddleware';

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


export default router; 
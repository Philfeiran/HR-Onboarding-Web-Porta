import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    await authController.registerUser(req, res, next);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    await authController.loginUser(req, res, next);
});

export default router;
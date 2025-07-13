import { Router, Request, Response, NextFunction } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import { authenticate,requireHR } from '../middleware/authMiddleware';

const router = Router();
const registrationController = new RegistrationController();

router.post('/sendEmail',authenticate,requireHR,async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.sendRegistrationEmail(req,res,next);
});

// 这个路由不需要身份验证，因为用户还没有注册
router.post('/verify',async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.verifyRegistration(req,res,next);
});

// router.post('/setStatus',async (req:Request,res:Response,next:NextFunction): Promise<void> => {
//     await registrationController.setRegistrationStatus(req,res,next);
// });

router.get('',authenticate,requireHR,async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.getAllRegistration(req,res,next);
});

export default router;
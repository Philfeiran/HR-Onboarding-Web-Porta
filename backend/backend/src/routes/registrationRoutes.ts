import { Router, Request, Response, NextFunction } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import { authenticate,requireHR } from '../middleware/authMiddleware';

const router = Router();
const registrationController = new RegistrationController();

router.post('/create',authenticate,requireHR,async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.createRegistration(req,res,next);
});
router.post('/verify',async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.verifyRegistration(req,res,next);
});

router.get('',authenticate,requireHR,async (req:Request,res:Response,next:NextFunction): Promise<void> => {
    await registrationController.getAllRegistration(req,res,next);
});

export default router;
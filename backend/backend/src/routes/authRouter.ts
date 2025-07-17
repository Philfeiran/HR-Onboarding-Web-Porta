import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.registerUser(req, res, next);
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.loginUser(req, res, next);
  }
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.logoutUser(req, res, next);
  }
);

router.get("/me", authenticate, (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.post(
  "/check-email",
  (req: Request, res: Response, next: NextFunction) => {
    authController.checkEmailExists(req, res, next);
  }
);

router.post(
  "/check-username",
  (req: Request, res: Response, next: NextFunction) => {
    authController.checkUsernameExists(req, res, next);
  }
);

export default router;

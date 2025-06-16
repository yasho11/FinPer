import { Router } from "express";
import { register, login, authUser, UpdateUser } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/authUser', authenticate ,authUser);
router.put('/auth/UpdateUser', authenticate ,UpdateUser)
export default router;
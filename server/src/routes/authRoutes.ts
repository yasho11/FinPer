import { Router } from "express";
import { register, login, authUser, UpdateUser } from "../controllers/authController";

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/authUser', authUser);
router.put('/auth/UpdateUser', UpdateUser)
export default router;
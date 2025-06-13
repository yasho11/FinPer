import { Router } from "express";
import { createOrUpdateBudget, getUserBudgets, getBudgetByMonth } from "../controllers/budgetController";

const router = Router();

router.post('/budget', createOrUpdateBudget);
router.get('/budget', getUserBudgets);
router.get('/budget/:month', getBudgetByMonth);

export default router;

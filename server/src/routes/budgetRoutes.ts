import { Router } from "express";
import {
  createOrUpdateBudget,
  getUserBudgets,
  getBudgetByMonth,
  getBudgetSummaryByMonth,
  deleteBudgetByMonth,
} from "../controllers/budgetController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Apply authenticate middleware to all budget routes
router.use(authenticate);
router.post("/budget", createOrUpdateBudget);
router.get("/budgets", getUserBudgets);
router.get("/budget/:month", getBudgetByMonth);
router.get("/budget/:month/summary", getBudgetSummaryByMonth);
router.delete("/budget/:month", deleteBudgetByMonth);

export default router;

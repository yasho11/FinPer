import { Router } from "express";
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getCategoryWiseSummary,
} from "../controllers/expenseController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Use authenticate middleware for all expense routes
router.use(authenticate);
router.post("/expense", addExpense);
router.get("/expenses", getExpenses);
router.get("/expense/:id", getExpenseById);
router.put("/expense/:id", updateExpense);
router.delete("/expense/:id", deleteExpense);
router.get("/expenses/summary/category", getCategoryWiseSummary);

export default router;

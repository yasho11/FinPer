import { Request, Response } from "express";
import Budget from "../models/budget.model";
import { verifyToken } from "../utils/token";

//! Helper to calculate 50/30/20 split
const calculateBudgetSplit = (totalIncome: number)=> ({
    needs: totalIncome * 0.5,
    wants: totalIncome * 0.3,
    savings: totalIncome * 0.2,
});


//?------------------------------------------------------------------

//! @name: CreateorupdateBudget

export const createOrUpdateBudget = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const userId = verifyToken(token);
    const { totalIncome, month } = req.body;

    if (!totalIncome || !month) {
      return res.status(400).json({ msg: "Total income and month are required" });
    }

    const { needs, wants, savings } = calculateBudgetSplit(totalIncome);

    // 🔄 Check if budget exists → update, else → create
    const [budget, created] = await Budget.findOrCreate({
      where: { userId, month },
      defaults: { totalIncome, needs, wants, savings, userId, month },
    });

    if (!created) {
      budget.totalIncome = totalIncome;
      budget.needs = needs;
      budget.wants = wants;
      budget.savings = savings;
      await budget.save();
    }

    res.status(created ? 201 : 200).json({ msg: created ? "Budget created" : "Budget updated", budget });
  } catch (err) {
    res.status(500).json({ msg: "Error creating/updating budget", error: err });
  }
};



//?------------------------------------------------------------------

//! @name: getUserBudgets
//! 2desc: Get all budgets of logged-in user

export const getUserBudgets = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const userId = verifyToken(token);

    const budgets = await Budget.findAll({ where: { userId } });

    res.status(200).json({ budgets });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch budgets", error: err });
  }
};


//?----------------------------------------------------------------------

//! @name: getBudgetByMonth

export const getBudgetByMonth = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const userId = verifyToken(token);
    const { month } = req.params;

    const budget = await Budget.findOne({ where: { userId, month } });

    if (!budget) return res.status(404).json({ msg: "No budget for that month" });

    res.status(200).json({ budget });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching monthly budget", error: err });
  }
};
import { Request, Response } from 'express';
import Expense from '../models/expense.model';
import Budget from '../models/budget.model';
import { verifyToken } from '../utils/token';

type Category = 'needs' | 'wants' | 'savings';

//?------------------------------------------------------------------------
//! Name: addExpense
//! Desc: Adds new expense and checks budget overflow per category and month
//?------------------------------------------------------------------------
export const addExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id
    const { amount, category, name, date } = req.body as {
      amount: number;
      category: Category;
      name: string;
      date: string; // YYYY-MM-DD
    };

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be a positive number' });
    }

    // Extract month from date (YYYY-MM)
    const month = date.slice(0, 7);

    // Find the budget for the user and month
    const budget = await Budget.findOne({ where: { userId, month } });
    if (!budget) {
      return res.status(400).json({ msg: `No budget set for month ${month}` });
    }

    // Fetch all expenses for the user, category and month
    const expenses = await Expense.findAll({
      where: {
        userId,
        category,
        date: { $like: `${month}%` } // Sequelize syntax depends on your ORM setup, adjust if needed
      }
    });

    // Calculate total spent in this category for the month
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate remaining budget in category
    const categoryBudget = budget[category]; // needs/wants/savings amount from budget
    const predictedBalance = categoryBudget - (totalSpent + amount);

    // Create expense linked to this budget
    const expense = await Expense.create({
      userId,
      budgetId: budget.id,
      amount,
      category,
      name,
      date
    });

    let msg = 'Expense added successfully';
    if (predictedBalance < 0) {
      msg += `. Warning: Over budget for category "${category}" by ${Math.abs(predictedBalance)}`;
    }

    return res.status(201).json({ msg, expense });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to add expense', error: err });
  }
};

//?------------------------------------------------------------------------
//! Name: getExpenses
//! Desc: Gets all user expenses (optionally filtered by category/month)
//?------------------------------------------------------------------------
export const getExpenses = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { category, month } = req.query as { category?: Category; month?: string };

    const whereClause: any = { userId };
    if (category) whereClause.category = category;
    if (month) whereClause.date = { $like: `${month}%` };

    const expenses = await Expense.findAll({ where: whereClause });

    return res.status(200).json({ expenses });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to get expenses', error: err });
  }
};

//?------------------------------------------------------------------------
//! Name: getExpenseById
//! Desc: Gets a single expense by ID
//?------------------------------------------------------------------------
export const getExpenseById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    return res.status(200).json({ expense });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch expense', error: err });
  }
};

//?------------------------------------------------------------------------
//! Name: updateExpense
//! Desc: Updates an existing expense
//?------------------------------------------------------------------------
export const updateExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const { amount, category, name, date } = req.body as Partial<{
      amount: number;
      category: Category;
      name: string;
      date: string;
    }>;

    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (amount !== undefined) {
      if (amount <= 0) return res.status(400).json({ msg: 'Amount must be positive' });
      expense.amount = amount;
    }
    if (category) expense.category = category;
    if (name) expense.name = name;
    if (date) expense.date = new Date(date);

    await expense.save();

    return res.status(200).json({ msg: 'Expense updated', expense });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update expense', error: err });
  }
};

//?------------------------------------------------------------------------
//! Name: deleteExpense
//! Desc: Deletes a specific expense
//?------------------------------------------------------------------------
export const deleteExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    await expense.destroy();
    return res.status(200).json({ msg: 'Expense deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete expense', error: err });
  }
};

//?------------------------------------------------------------------------
//! Name: getCategoryWiseSummary
//! Desc: Returns total spent per category for current month
//?------------------------------------------------------------------------
export const getCategoryWiseSummary = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });

    const userId = verifyToken(token);
    const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    // Get all expenses for user in this month
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: { $like: `${thisMonth}%` }
      }
    });

    // Summarize amounts by category
    const summary: { [key in Category]?: number } = {};
    expenses.forEach(e => {
      summary[e.category] = (summary[e.category] || 0) + e.amount;
    });

    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to generate summary', error: err });
  }
};

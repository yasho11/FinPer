import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";
import Budget from "./budget.model";

export type ExpenseCategory = 'needs' | 'wants' | 'savings';


export interface IExpense extends Model{
    id?: number;
    userId: number;
    budgetId?: number;
    category: ExpenseCategory;
    name: string;
    amount: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;

}

const Expense = sequelize.define<IExpense> ("Expense",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    budgetId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM("needs", "wants", "savings"),
        allowNull: false,
    },
            
      // Item name (e.g. "Netflix", "Groceries")
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

        // Amount spent
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
        min: 0,
        },
    },

    // Date of the expense
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },       


});

Expense.belongsTo(User, {foreignKey: "userId"});
Expense.belongsTo(Budget, {foreignKey: "budgetId", constraints: false});

export default Expense;
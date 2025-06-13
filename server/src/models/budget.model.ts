import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

// Define the attributes for the Budget model
interface BudgetAttributes {
  id?: number;
  userId: number;
  month: string; // You had this as `number`, but it should be `string` like "2025-06"
  totalIncome: number;
  needs: number;
  wants: number;
  savings: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
type BudgetCreationAttributes = Optional<BudgetAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Define the Budget interface
export interface IBudget extends Model<BudgetAttributes, BudgetCreationAttributes>, BudgetAttributes {}

// Define the Budget model using sequelize.define
const Budget = sequelize.define<IBudget>("Budget", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING, // e.g., "2025-06"
    allowNull: false,
  },
  totalIncome: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  needs: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  wants: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  savings: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'budgets',
  timestamps: true, // includes createdAt and updatedAt
});

// Optional: Set up association (if not already in your associations file)
Budget.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Budget;

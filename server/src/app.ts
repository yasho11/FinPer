import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import budgetRoutes from './routes/budgetRoutes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', budgetRoutes);

export default app;

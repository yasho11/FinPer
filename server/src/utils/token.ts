import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// 🔐 Generate token with 7 days validity
export const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// 🔎 Verify token and extract user ID
export const verifyToken = (token: string): number => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

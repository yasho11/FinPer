import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  if (!token){ 
     res.status(401).json({ msg: "Unauthorized" });
    return;}

  try {
    const userId = verifyToken(token);
    req.body.userId = userId; // or req.user = userId;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
    return ;
  }
};

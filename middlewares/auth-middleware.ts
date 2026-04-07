import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import env from "dotenv";

env.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    req.user = { id: decoded.id };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

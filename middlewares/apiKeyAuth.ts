import { Request, Response, NextFunction } from "express";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["token"] as string;

  if (!token) {
    return res.status(401).json({ message: "API Key não fornecida" });
  }

  if (token !== process.env.API_KEY) {
    return res.status(403).json({ message: "API Key inválida" });
  }

  next();
}

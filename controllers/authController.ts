import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

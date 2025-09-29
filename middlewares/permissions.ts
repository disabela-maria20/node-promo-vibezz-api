import { Request, Response, NextFunction } from "express";

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.permissions.includes(permission)) {
      return res
        .status(403)
        .json({ message: "Acesso negado: precisa da permissão " + permission });
    }

    next();
  };
}

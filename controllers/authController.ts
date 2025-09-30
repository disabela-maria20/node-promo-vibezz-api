import { Request, RequestHandler, Response } from "express";
import * as authService from "../services/authService";
import * as userRepo from "../repositories/userRepository";
import bcrypt from "bcryptjs";

export interface AuthRequest extends Request {
  user?: { id: number; permissions: string[] };
}

export const register: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { name, email, password, permission } = req.body;

    const createdBy = req.user!.id;

    const creatorPermissions = req.user!.permissions;
    if (!creatorPermissions.includes("ADMIN")) {
      return res
        .status(403)
        .json({ message: "Apenas ADMIN pode cadastrar usuários" });
    }

    const allowedPermissions = ["ADMIN", "USER"];
    if (!allowedPermissions.includes(permission)) {
      return res.status(400).json({ message: "Permissão inválida" });
    }

    const user = await authService.register(
      name,
      email,
      password,
      permission,
      createdBy
    );
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login: RequestHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const me: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await userRepo.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const permissions = await userRepo.findPermissionsByUserId(userId);
    res.json({ id: user.id, name: user.name, email: user.email, permissions });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listCreatedUsers: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  try {
    const adminId = req.user!.id;

    if (!req.user!.permissions.includes("ADMIN")) {
      return res
        .status(403)
        .json({ message: "Apenas ADMIN pode listar usuários" });
    }

    const users = await userRepo.findUsersCreatedBy(adminId);
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const adminId = req.user!.id;
    const userId = Number(req.params.id);

    if (!req.user!.permissions.includes("ADMIN")) {
      return res
        .status(403)
        .json({ message: "Apenas ADMIN pode excluir usuários" });
    }

    const deleted = await userRepo.deleteUserByIdAndCreator(userId, adminId);

    if (deleted === 0) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado ou não foi criado por você" });
    }

    res.json({ message: "Usuário deletado com sucesso" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const editUser: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const adminId = req.user!.id;
    const userId = Number(req.params.id);
    const { name, email, password, permission } = req.body;

    if (!req.user!.permissions.includes("ADMIN")) {
      return res
        .status(403)
        .json({ message: "Apenas ADMIN pode editar usuários" });
    }

    const updatedData: any = { name, email };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updated = await userRepo.updateUserByIdAndCreator(
      userId,
      adminId,
      updatedData
    );

    if (updated === 0) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado ou não foi criado por você" });
    }

    if (permission) {
      await userRepo.assignPermission(userId, permission);
    }

    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

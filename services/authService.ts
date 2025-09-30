import * as userRepo from "../repositories/userRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo123";

export async function register(
  name: string,
  email: string,
  password: string,
  permission: string,
  createdBy: number
) {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw new Error("Email já cadastrado");

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await userRepo.createUser(
    name,
    email,
    hashedPassword,
    createdBy
  );

  await userRepo.assignPermission(userId, permission);

  return { id: userId, name, email, permission, createdBy };
}

export async function login(email: string, password: string) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Credenciais inválidas");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Credenciais inválidas");

  const permissions = await userRepo.findPermissionsByUserId(user.id);

  const token = jwt.sign({ id: user.id, permissions }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, permissions },
  };
}

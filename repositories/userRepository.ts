import { pool } from "../config/db";

export async function findByEmail(email: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return (rows as any[])[0];
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
) {
  const [result]: any = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [name, email, hashedPassword]
  );
  return result.insertId;
}

export async function findPermissionsByUserId(userId: number) {
  const [rows] = await pool.query(
    `SELECT p.name FROM permissions p
     JOIN user_permissions up ON p.id = up.permission_id
     WHERE up.user_id = ?`,
    [userId]
  );
  return (rows as any[]).map((r) => r.name);
}

export async function assignPermission(userId: number, permissionName: string) {
  const [perm]: any = await pool.query(
    "SELECT id FROM permissions WHERE name = ?",
    [permissionName]
  );

  if (!perm || perm.length === 0) {
    throw new Error(`Permissão '${permissionName}' não encontrada`);
  }

  const permissionId = perm[0].id;

  await pool.query(
    "INSERT IGNORE INTO user_permissions (user_id, permission_id) VALUES (?, ?)",
    [userId, permissionId]
  );
}

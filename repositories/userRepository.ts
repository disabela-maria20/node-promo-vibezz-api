import { pool } from "../config/db";

// Busca usuário pelo e-mail
export async function findByEmail(email: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return (rows as any[])[0];
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
  createdBy: number
) {
  const [result]: any = await pool.query(
    "INSERT INTO users (name, email, password, created_by) VALUES (?,?,?,?)",
    [name, email, hashedPassword, createdBy]
  );
  return result.insertId;
}

// Busca usuário pelo ID
export async function findById(id: number) {
  const [rows] = await pool.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id]
  );
  return (rows as any[])[0];
}

// Busca permissões de um usuário pelo ID
export async function findPermissionsByUserId(userId: number) {
  const [rows] = await pool.query(
    `SELECT p.name FROM permissions p
     JOIN user_permissions up ON p.id = up.permission_id
     WHERE up.user_id = ?`,
    [userId]
  );
  return (rows as any[]).map((r) => r.name);
}

// Atribui uma permissão a um usuário
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

export async function findUsersCreatedBy(adminId: number) {
  const [users] = await pool.query(
    "SELECT id, name, email FROM users WHERE created_by = ?",
    [adminId]
  );

  const result = [];

  for (const user of users as any[]) {
    const permissions = await findPermissionsByUserId(user.id);
    result.push({
      id: user.id,
      name: user.name,
      email: user.email,
      permissions,
    });
  }

  return result;
}

export async function deleteUserByIdAndCreator(
  userId: number,
  creatorId: number
) {
  const [result]: any = await pool.query(
    "DELETE FROM users WHERE id = ? AND created_by = ?",
    [userId, creatorId]
  );
  return result.affectedRows;
}

export async function updateUserByIdAndCreator(
  userId: number,
  creatorId: number,
  data: { name?: string; email?: string; password?: string }
) {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.password) {
    fields.push("password = ?");
    values.push(data.password);
  }

  if (fields.length === 0) return 0;

  values.push(userId, creatorId);

  const [result]: any = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ? AND created_by = ?`,
    values
  );

  return result.affectedRows;
}

export async function listPermissions(adminId: number) {
  const [rows] = await pool.query("SELECT id, name FROM permissions", adminId);
  return rows as any[];
}

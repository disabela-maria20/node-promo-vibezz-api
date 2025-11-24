import { RequestHandler } from "express";
import { pool } from "../config/db";
import { CreatePromotionDTO } from "../types";

export async function listPromotion() {
  const [rows] = await pool.query(
    "SELECT id, name, draw_completed, start_date, end_date FROM promotions"
  );
  return rows as any[];
}

export async function findPromotion(id: number) {
  const [rows]: any = await pool.query(
    "SELECT * FROM promotions WHERE id = ?",
    [id]
  );

  return rows[0] ?? null;
}

export const createdPromotion = async (
  data: CreatePromotionDTO,
  banner: string | null,
  terms: string | null
) => {
  const {
    name,
    description,
    start_date,
    end_date,
    winners_quantity,
    created_by_user,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO promotions
    (name, description, start_date, end_date, winners_quantity, created_by_user, banner, terms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      name,
      description,
      start_date,
      end_date,
      winners_quantity,
      created_by_user,
      banner,
      terms,
    ]
  );

  return result[0];
};

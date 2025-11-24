import { RequestHandler, Request } from "express";
import * as promo from "../repositories/promotionRepository";

export const listPromotion: RequestHandler = async (req, res) => {
  try {
    const promotion = await promo.listPromotion();
    res.json(promotion);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const findPromotion: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const promotion = await promo.findPromotion(id);

    if (!promotion)
      return res.status(404).json({ message: "Promoção não encontrada" });

    return res.json(promotion);
  } catch (err: any) {
    return res.status(500).json({
      message: "Erro ao buscar promoção",
      error: err.message,
    });
  }
};

export const createdPromotion: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      end_date,
      winners_quantity,
      created_by_user,
    } = req.body;

    if (
      !name ||
      !start_date ||
      !end_date ||
      !winners_quantity ||
      !created_by_user
    ) {
      return res.status(400).json({
        message: "Campos obrigatórios não foram preenchidos.",
      });
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const bannerFile = files?.banner?.[0];
    const termsFile = files?.terms?.[0];

    const banner = bannerFile ? `uploads/${bannerFile.filename}` : null;

    const terms = termsFile ? `uploads/${termsFile.filename}` : null;

    const id = await promo.createdPromotion(
      {
        name,
        description,
        start_date,
        end_date,
        winners_quantity,
        created_by_user,
      },
      banner,
      terms
    );

    return res.status(201).json({
      message: "Promoção criada com sucesso!",
      promotion_id: id,
      banner_url: banner,
      terms_url: terms,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar promoção.",
      error: error.message,
    });
  }
};

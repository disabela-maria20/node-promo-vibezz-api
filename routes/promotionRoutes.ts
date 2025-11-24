import { Router } from "express";
import * as promotionController from "../controllers/promotionController";
import { authenticate } from "../middlewares/auth";
import { apiKeyAuth } from "../middlewares/apiKeyAuth";
import { upload } from "../middlewares/upload";

const router = Router();

router.use(apiKeyAuth);
router.get("/list-promotion", authenticate, promotionController.listPromotion);
router.get(
  "/find-promotion/:id",
  authenticate,
  promotionController.findPromotion
);
router.post(
  "/created-promotion/",
  authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "terms", maxCount: 1 },
  ]),
  promotionController.createdPromotion
);
export default router;

import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/permissions";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// rota que só usuários logados podem acessar
router.get("/me", authenticate, (req, res) => {
  res.json((req as any).user);
});

// rota que só ADMIN pode acessar
router.get(
  "/admin-only",
  authenticate,
  requirePermission("ADMIN"),
  (req, res) => {
    res.json({ message: "Área restrita para admins" });
  }
);

export default router;

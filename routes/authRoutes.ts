import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { requirePermission } from "../middlewares/permissions";
import { apiKeyAuth } from "../middlewares/apiKeyAuth";

const router = Router();

router.use(apiKeyAuth);

router.post("/login", authController.login);
router.post("/register", authenticate, authController.register);
router.get("/me", authenticate, authController.me);
router.get("/created-users", authenticate, authController.listCreatedUsers);
router.delete("/users/:id", authenticate, authController.deleteUser);
router.put("/users/:id", authenticate, authController.editUser);
router.get("/permissions", authenticate, authController.listPermission);

router.get(
  "/admin-only",
  authenticate,
  requirePermission("ADMIN"),
  (req, res) => {
    res.json({ message: "Área restrita para admins" });
  }
);

export default router;

import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// const password = "123456";
// const hashed = bcrypt.hashSync(password, 10);
// console.log(hashed);

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno do servidor" });
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

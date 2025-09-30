import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const password = "123456";
const hashed = bcrypt.hashSync(password, 10);
console.log(hashed);
// importar rotas
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ---- MIDDLEWARES GLOBAIS ----
app.use(helmet()); // segurança básica (headers HTTP)
app.use(cors()); // permitir chamadas de front-ends
app.use(express.json()); // interpretar JSON do body

// ---- ROTAS ----
app.use("/auth", authRoutes); // todas as rotas de autenticação

// ---- TRATAMENTO DE ERROS GLOBAL ----
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

// ---- INICIAR SERVIDOR ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

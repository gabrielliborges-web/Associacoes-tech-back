import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/user.routes";
import passwordsRoutes from "./routes/passwordReset.routes";
import usuariosRoutes from "./routes/usuario.routes";
import associacoesRoutes from "./routes/associacao.routes";
import associacaoUsuarioRoutes from "./routes/associacaoUsuario.routes";
import associadoRoutes from "./routes/associado.routes";
import { setupSwagger } from "./config/swagger";

const app: Application = express();

setupSwagger(app);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("/auth", authRoutes);
app.use("/user", usersRoutes);
app.use("/password-reset", passwordsRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/associacoes", associacoesRoutes);
app.use("/associacoes", associacaoUsuarioRoutes); // rotas com mergeParams
app.use("/", associadoRoutes);

app.get("/", (req, res) => {
  res.send("Desafio-movie-back ON");
});

export default app;

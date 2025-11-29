import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/user.routes";
import passwordsRoutes from "./routes/passwordReset.routes";
import categoriaRoutes from "./routes/categoria.routes";
import produtoRoutes from "./routes/produto.routes";
import compraRoutes from "./routes/compra.routes";
import vendaRoutes from "./routes/venda.routes";
import entradaFinanceiraRoutes from "./routes/entradaFinanceira.routes";
import movimentacaoRoutes from "./routes/movimentacao.routes";
import configuracaoRoutes from "./routes/configuracao.routes";
import despesaRoutes from "./routes/despesa.routes";
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
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/compras", compraRoutes);
app.use("/vendas", vendaRoutes);
app.use("/entradas", entradaFinanceiraRoutes);
app.use("/movimentacoes", movimentacaoRoutes);
app.use("/config", configuracaoRoutes);
app.use("/despesas", despesaRoutes);

app.get("/", (req, res) => {
  res.send("Desafio-movie-back ON");
});

export default app;

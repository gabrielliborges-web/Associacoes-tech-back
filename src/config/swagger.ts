import { Application } from "express";
import fs from "fs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciador MKP API",
      version: "1.0.0",
      description: "Documentação da API do Gerenciador MKP",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/docs/*.ts"],
};

// ------------------------------
// 1) FUNÇÃO PARA O EXPRESS USAR
// ------------------------------
export function setupSwagger(app: Application) {
  const specs = swaggerJsdoc(options);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}

// ------------------------------
// 2) MODO GERADOR (executado via npm run swagger:generate)
// ------------------------------
if (require.main === module) {
  const specs = swaggerJsdoc(options);

  fs.writeFileSync("./swagger.json", JSON.stringify(specs, null, 2));
  console.log("swagger.json gerado com sucesso!");
}

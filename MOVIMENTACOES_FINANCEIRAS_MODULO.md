# 💼 Módulo de Movimentações Financeiras (Extrato) - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão do projeto:

```
src/
├── controllers/
│   └── movimentacao.controller.ts       ✅ Controllers das rotas
├── docs/
│   └── movimentacao.docs.ts             ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── movimentacao.routes.ts           ✅ Definição das rotas HTTP
├── services/
│   └── movimentacao.service.ts          ✅ Lógica de negócio
├── validators/
│   └── movimentacao.schema.ts           ✅ Validação com Zod
└── app.ts                               ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/movimentacao.service.ts`)

Implementadas as seguintes funções:

- **`registrar(data)`** - Cria movimentação com cálculo automático de saldo
- **`listMovimentacoes(filters?)`** - Lista movimentações com filtros opcionais
- **`getById(id)`** - Obtém uma movimentação específica
- **`getSaldoAtual(usuarioId)`** - Retorna saldo acumulado do usuário
- **`getDashboardResumo(usuarioId)`** - Retorna resumo para dashboard
- **`registrarAjuste(dto, userId)`** - Registra movimentação manual de ajuste

#### Regras de Negócio Implementadas:

✅ Validar valor maior que zero
✅ Calcular saldoApos automaticamente:

- Se entrada: saldoAnterior + valor
- Se saída: saldoAnterior - valor
  ✅ Buscar saldo anterior da última movimentação
  ✅ Usar saldoInicial da tabela Configuracao se não houver movimentações
  ✅ Registrar movimentações de vendas, compras, entradas
  ✅ Suportar ajustes manuais
  ✅ Agrupar movimentações por tipo
  ✅ Calcular totais de entradas e saídas
  ✅ Calcular lucro (entradas - saídas)
  ✅ Retornar 5 últimas movimentações para dashboard
  ✅ Ordenação por data ascendente (para extrato cronológico)
  ✅ Transações para garantir consistência
  ✅ Tratamento de erros com status HTTP apropriados

---

### 2️⃣ **Controller Layer** (`controllers/movimentacao.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /movimentacoes com filtros
- **`show(req, res)`** - Handle GET /movimentacoes/:id
- **`dashboardResumo(req, res)`** - Handle GET /movimentacoes/dashboard/resumo
- **`saldoAtual(req, res)`** - Handle GET /movimentacoes/saldo-atual
- **`registrarAjuste(req, res)`** - Handle POST /movimentacoes/ajuste

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message }` ou `{ message, errors[] }`)
✅ Extração de usuarioId do token autenticado
✅ Filtros opcionais para listagem
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/movimentacao.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-listMovimentacoesSchema - // Para filtros de listagem
  idParamSchema - // Para parâmetros ID
  ajusteSchema; // Para criação de ajuste manual
```

#### Validações:

✅ **DataInicio**: DateTime ISO 8601 opcional
✅ **DataFim**: DateTime ISO 8601 opcional
✅ **Tipo**: String opcional (busca parcial)
✅ **UsuarioId**: Número opcional
✅ **Entrada**: Boolean opcional ("true" ou "false" como string na query)
✅ **IDs**: Validação numérica em parâmetros de rota
✅ **Descrição** (ajuste): String obrigatória, mínimo 3 caracteres, máximo 500
✅ **Valor** (ajuste): Número positivo obrigatório
✅ **Entrada** (ajuste): Boolean obrigatório

---

### 4️⃣ **Routes** (`routes/movimentacao.routes.ts`)

Rotas implementadas:

```
GET    /movimentacoes                    → list()              [Autenticado]
GET    /movimentacoes/:id                → show()              [Autenticado]
GET    /movimentacoes/saldo-atual        → saldoAtual()        [Autenticado]
GET    /movimentacoes/dashboard/resumo   → dashboardResumo()   [Autenticado]
POST   /movimentacoes/ajuste             → registrarAjuste()   [Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth`
✅ Validação automática com schemas
✅ Rotas específicas (/saldo-atual, /dashboard/resumo) antes de genéricas (:id)
✅ Filtros opcionais na listagem

---

### 5️⃣ **Documentation** (`docs/movimentacao.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema MovimentacaoFinanceira (com exemplo completo)
✅ Schema MovimentacaoDashboardResumo
✅ Schema SaldoAtualResponse
✅ Schema CreateAjusteDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de request e response
✅ Códigos de resposta (200, 201, 400, 401, 404)
✅ Segurança com Bearer Token
✅ Explicação de cálculo de saldoApos
✅ Exemplo de extrato com múltiplas movimentações

---

## 🔄 Integração com Outros Módulos

### Registrar Movimentação (Função Interna)

Utilizada por Vendas, Compras e Entradas Financeiras:

```typescript
await movimentacaoService.registrar({
  usuarioId,
  tipo: "venda", // ou "compra", "entrada_financeira", etc
  referenciaId: venda.id, // ID da venda
  descricao: `Venda #${venda.id}`,
  valor: total,
  entrada: true, // true para entrada, false para saída
});
```

### Tipos de Movimentação Suportados:

- **venda** - Entrada de venda
- **compra** - Saída de compra
- **entrada_financeira** - Entrada manual
- **cancelamento_venda** - Reversão de venda (saída)
- **reversao_entrada** - Reversão de entrada (saída)
- **ajuste** - Ajuste manual

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import movimentacaoRoutes from "./routes/movimentacao.routes";

// ...

app.use("/movimentacoes", movimentacaoRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint                          | Auth | Descrição                          |
| ------ | --------------------------------- | ---- | ---------------------------------- |
| GET    | `/movimentacoes`                  | ✅   | Lista extrato completo com filtros |
| GET    | `/movimentacoes/:id`              | ✅   | Obtém uma movimentação específica  |
| GET    | `/movimentacoes/saldo-atual`      | ✅   | Retorna apenas saldo acumulado     |
| GET    | `/movimentacoes/dashboard/resumo` | ✅   | Retorna resumo para dashboard      |
| POST   | `/movimentacoes/ajuste`           | ✅   | Registra ajuste manual             |

---

## 🛡️ Tratamento de Erros

Todos os erros seguem o padrão padronizado:

```json
{
  "message": "Descrição do erro"
}
```

Ou com detalhes de validação:

```json
{
  "message": "Erro de validação.",
  "errors": ["Campo obrigatório", "Valor inválido"]
}
```

### Códigos de Status Implementados:

- **200** - Sucesso (GET)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou dados inválidos
- **401** - Não autenticado
- **404** - Movimentação não encontrada
- **500** - Erro interno do servidor

---

## 🗄️ Banco de Dados

Utiliza os modelos já existentes no Prisma Schema:

```prisma
model MovimentacaoFinanceira {
  id           Int         @id @default(autoincrement())
  usuarioId    Int
  usuario      Usuario     @relation(fields: [usuarioId], references: [id])

  data         DateTime    @default(now())
  tipo         String       // venda, compra, entrada_financeira, ajuste, cancelamento_venda, reversao_entrada
  referenciaId Int?
  descricao    String
  valor        Decimal      @db.Decimal(10,2)
  entrada      Boolean      // true = entrada, false = saída
  saldoApos    Decimal?     @db.Decimal(10,2)  // Saldo acumulado após esta movimentação

  criadoEm     DateTime     @default(now())
}

model Configuracao {
  id           Int       @id @default(autoincrement())
  saldoInicial Decimal?  @db.Decimal(10,2)  // Saldo inicial do sistema
  mesAtual     Int?
  criadoEm     DateTime  @default(now())
}
```

---

## ✨ Padrões Seguidos

✅ TypeScript com tipos explícitos
✅ Async/Await para operações assincronas
✅ Prisma Client para acesso ao banco
✅ Funções puras no service layer
✅ Validação obrigatória em todas as rotas
✅ Sem retorno de dados sensíveis
✅ Nomes de pastas e arquivos padronizados
✅ Estrutura idêntica aos módulos existentes
✅ Cálculo de saldo sempre seguro e consistente

---

## 🧪 Como Testar

### Listar movimentações (extrato):

```bash
GET /movimentacoes?dataInicio=2025-02-01T00:00:00Z&dataFim=2025-02-28T23:59:59Z
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "tipo": "entrada_financeira",
    "referenciaId": null,
    "descricao": "Entrada Financeira (aporte)",
    "valor": 2000.0,
    "entrada": true,
    "data": "2025-02-01T10:00:00Z",
    "saldoApos": 2000.0,
    "usuarioId": 1,
    "criadoEm": "2025-02-01T10:00:00Z"
  },
  {
    "id": 2,
    "tipo": "compra",
    "referenciaId": 1,
    "descricao": "Compra #1",
    "valor": 500.0,
    "entrada": false,
    "data": "2025-02-02T10:00:00Z",
    "saldoApos": 1500.0,
    "usuarioId": 1,
    "criadoEm": "2025-02-02T10:00:00Z"
  },
  {
    "id": 3,
    "tipo": "venda",
    "referenciaId": 1,
    "descricao": "Venda #1",
    "valor": 800.0,
    "entrada": true,
    "data": "2025-02-03T10:00:00Z",
    "saldoApos": 2300.0,
    "usuarioId": 1,
    "criadoEm": "2025-02-03T10:00:00Z"
  }
]
```

### Obter movimentação específica:

```bash
GET /movimentacoes/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):** [Retorna movimento com detalhes do usuário]

### Obter saldo atual:

```bash
GET /movimentacoes/saldo-atual
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "saldoAtual": 2300.0
}
```

### Obter resumo para dashboard:

```bash
GET /movimentacoes/dashboard/resumo
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "totalEntradas": 2800.0,
  "totalSaidas": 500.0,
  "lucro": 2300.0,
  "entradasPorTipo": {
    "entrada_financeira": 2000.0,
    "venda": 800.0
  },
  "saidasPorTipo": {
    "compra": 500.0
  },
  "movimentacoesRecentes": [
    {
      "id": 3,
      "tipo": "venda",
      "descricao": "Venda #1",
      "valor": 800.0,
      "entrada": true,
      "data": "2025-02-03T10:00:00Z",
      "saldoApos": 2300.0
    }
  ],
  "saldoAtual": 2300.0
}
```

### Registrar ajuste manual:

```bash
POST /movimentacoes/ajuste
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "descricao": "Ajuste de caixa - entrada",
  "valor": 250.50,
  "entrada": true
}
```

**Resposta (201):**

```json
{
  "id": 10,
  "tipo": "ajuste",
  "referenciaId": null,
  "descricao": "Ajuste de caixa - entrada",
  "valor": 250.5,
  "entrada": true,
  "data": "2025-11-21T15:30:00Z",
  "saldoApos": 2550.5,
  "usuarioId": 1,
  "criadoEm": "2025-11-21T15:30:00Z"
}
```

---

## 📝 Observações Importantes

1. **Cálculo de Saldo**:

   - O saldo é sempre calculado a partir da última movimentação (saldoApos)
   - Se não houver movimentações, usa saldoInicial da tabela Configuracao
   - Fórmula: Se entrada → saldoAnterior + valor; Se saída → saldoAnterior - valor

2. **Extrato Cronológico**:

   - Listagem ordenada por data ascendente (do mais antigo para o mais recente)
   - Cada movimentação tem seu saldoApos para rastreabilidade

3. **Dashboard**:

   - Mostra 5 últimas movimentações
   - Totais separados por tipo
   - Lucro = totalEntradas - totalSaidas

4. **Integração com Outros Módulos**:

   - Vendas, Compras e Entradas Financeiras chamam `movimentacaoService.registrar()`
   - Nenhuma duplicação de dados
   - Todas as operações são transacionais

5. **Ajustes Manuais**:

   - Tipo sempre "ajuste"
   - Sem referenciaId
   - Usados para correções de saldo

6. **Autenticação**:

   - Todas as rotas requerem token JWT válido
   - Usuário vê apenas suas próprias movimentações

7. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 6 funções principais
- [x] Controller com 5 métodos públicos
- [x] Validators com 3 schemas Zod
- [x] Routes com 5 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Validação de valor > 0
- [x] Cálculo automático de saldoApos
- [x] Uso de saldoInicial da Configuracao
- [x] Listagem de movimentações com filtros
- [x] Cálculo de totais por tipo
- [x] Cálculo de lucro (entradas - saídas)
- [x] Dashboard com 5 últimas movimentações
- [x] Saldo atual acumulado
- [x] Ajustes manuais
- [x] Tratamento de erros padronizado
- [x] Ordenação por data ascendente
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Movimentações Financeiras implementado com sucesso! 🎉**

Com suporte completo a extrato financeiro, cálculo de saldo acumulado, dashboard e ajustes manuais integrados automaticamente com todos os módulos.

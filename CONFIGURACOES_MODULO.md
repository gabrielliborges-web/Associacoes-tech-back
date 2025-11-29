# ⚙️ Módulo de Configurações - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão do projeto:

```
src/
├── controllers/
│   └── configuracao.controller.ts       ✅ Controllers das rotas
├── docs/
│   └── configuracao.docs.ts             ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── configuracao.routes.ts           ✅ Definição das rotas HTTP
├── services/
│   └── configuracao.service.ts          ✅ Lógica de negócio
├── validators/
│   └── configuracao.schema.ts           ✅ Validação com Zod
└── app.ts                               ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/configuracao.service.ts`)

Implementadas as seguintes funções:

- **`ensureConfiguracaoExiste()`** - Garante que existe exatamente uma configuração
- **`getConfiguracao()`** - Obtém a configuração atual (ou cria com defaults)
- **`updateConfiguracao(dto)`** - Atualiza saldo inicial e/ou mês atual

#### Regras de Negócio Implementadas:

✅ Apenas 1 registro de configuração no banco
✅ Se não existir, criar com defaults:

- saldoInicial: 0
- mesAtual: mês atual
  ✅ Validar que saldoInicial ≥ 0
  ✅ Validar que mesAtual está entre 1 e 12
  ✅ Atualizar através de updateMany (mantém 1 registro)
  ✅ Não recalcular movimentações antigas
  ✅ Nova configuração influencia apenas saldos futuros
  ✅ Retorno com tipos corretos (Decimal → number)
  ✅ Async/Await para todas as operações
  ✅ Tratamento de erros com status HTTP apropriados

---

### 2️⃣ **Controller Layer** (`controllers/configuracao.controller.ts`)

Implementados os seguintes métodos públicos:

- **`get(req, res)`** - Handle GET /config
- **`update(req, res)`** - Handle PUT /config

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message }` ou `{ message, errors[] }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Chamadas diretas aos services
✅ Sem lógica de negócio no controller

---

### 3️⃣ **Validators** (`validators/configuracao.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-updateConfiguracaoSchema - // Para atualização
  emptySchema; // Para GET (sem parâmetros)
```

#### Validações:

✅ **SaldoInicial**: Número não-negativo (≥ 0), opcional
✅ **MêsAtual**: Inteiro entre 1 e 12, opcional
✅ Ambos os campos são opcionais (update parcial permitido)

---

### 4️⃣ **Routes** (`routes/configuracao.routes.ts`)

Rotas implementadas:

```
GET    /config              → get()    [Autenticado]
PUT    /config              → update() [Autenticado]
```

#### Segurança:

✅ Ambas as rotas protegidas com `requireAuth`
✅ Validação automática com schemas
✅ Sem parâmetros na URL

---

### 5️⃣ **Documentation** (`docs/configuracao.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema Configuracao (com exemplo)
✅ Schema UpdateConfiguracaoDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de request e response
✅ Explicação de impacto no extrato
✅ Códigos de resposta (200, 400, 401)
✅ Segurança com Bearer Token
✅ Regra de apenas 1 registro

---

## 🔄 Integração com MovimentacaoService

Quando calcular saldo, o MovimentacaoService utiliza:

```typescript
const configuracao = await configuracaoService.getConfiguracao();
// Use configuracao.saldoInicial como base
```

No cálculo de saldoApos:

- Se houver movimentações → usar última movimentação.saldoApos
- Se não houver → usar configuracao.saldoInicial

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import configuracaoRoutes from "./routes/configuracao.routes";

// ...

app.use("/config", configuracaoRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint  | Auth | Descrição                                 |
| ------ | --------- | ---- | ----------------------------------------- |
| GET    | `/config` | ✅   | Obtém configurações (cria se não existir) |
| PUT    | `/config` | ✅   | Atualiza saldo inicial e/ou mês           |

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
  "errors": ["Saldo inicial não pode ser negativo."]
}
```

### Códigos de Status Implementados:

- **200** - Sucesso (GET, PUT)
- **400** - Erro de validação ou dados inválidos
- **401** - Não autenticado
- **500** - Erro interno do servidor

### Exemplos de Erro:

**Saldo negativo:**

```json
{
  "message": "Erro de validação.",
  "errors": ["Saldo inicial não pode ser negativo."]
}
```

**Mês inválido:**

```json
{
  "message": "Erro de validação.",
  "errors": ["Mês deve estar entre 1 e 12."]
}
```

---

## 🗄️ Banco de Dados

Utiliza o modelo já existente no Prisma Schema:

```prisma
model Configuracao {
  id           Int       @id @default(autoincrement())
  saldoInicial Decimal?  @db.Decimal(10,2)
  mesAtual     Int?
  criadoEm     DateTime  @default(now())
}
```

**Garantia**: Apenas 1 registro sempre existirá na tabela

---

## ✨ Padrões Seguidos

✅ TypeScript com tipos explícitos
✅ Async/Await para operações assincronas
✅ Prisma Client para acesso ao banco
✅ Funções puras no service layer
✅ Validação obrigatória com Zod
✅ Sem retorno de dados sensíveis
✅ Nomes de pastas e arquivos padronizados
✅ Estrutura idêntica aos módulos existentes
✅ Princípio de uma única responsabilidade

---

## 🧪 Como Testar

### Obter configurações:

```bash
GET /config
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "saldoInicial": 2000.0,
  "mesAtual": 4,
  "criadoEm": "2025-04-01T00:00:00.000Z"
}
```

Se não existir configuração, cria automaticamente com defaults:

```json
{
  "saldoInicial": 0,
  "mesAtual": 11,
  "criadoEm": "2025-11-21T15:30:00Z"
}
```

### Atualizar apenas saldo inicial:

```bash
PUT /config
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "saldoInicial": 5000.00
}
```

**Resposta (200):**

```json
{
  "saldoInicial": 5000.0,
  "mesAtual": 4,
  "criadoEm": "2025-04-01T00:00:00.000Z"
}
```

### Atualizar apenas mês:

```bash
PUT /config
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "mesAtual": 5
}
```

**Resposta (200):**

```json
{
  "saldoInicial": 2000.0,
  "mesAtual": 5,
  "criadoEm": "2025-04-01T00:00:00.000Z"
}
```

### Atualizar ambos:

```bash
PUT /config
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "saldoInicial": 5000.00,
  "mesAtual": 5
}
```

**Resposta (200):**

```json
{
  "saldoInicial": 5000.0,
  "mesAtual": 5,
  "criadoEm": "2025-04-01T00:00:00.000Z"
}
```

### Erro - Saldo negativo:

```bash
PUT /config
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "saldoInicial": -100
}
```

**Resposta (400):**

```json
{
  "message": "Erro de validação.",
  "errors": ["Saldo inicial não pode ser negativo."]
}
```

### Erro - Mês inválido:

```bash
PUT /config
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "mesAtual": 13
}
```

**Resposta (400):**

```json
{
  "message": "Erro de validação.",
  "errors": ["Mês deve estar entre 1 e 12."]
}
```

---

## 📝 Observações Importantes

1. **Apenas 1 Registro**:

   - Garantido no banco através de updateMany
   - GET cria automaticamente se não existir
   - Não é possível ter múltiplas configurações

2. **Valores Padrão**:

   - saldoInicial: 0
   - mesAtual: mês atual do sistema
   - Criados automaticamente na primeira chamada

3. **Impacto no Extrato**:

   - Novo saldoInicial afeta apenas cálculos futuros
   - Movimentações antigas não são recalculadas
   - Garante integridade do histórico

4. **Validações**:

   - saldoInicial ≥ 0 (não pode ser negativo)
   - mesAtual entre 1 (Janeiro) e 12 (Dezembro)
   - Ambos os campos são opcionais (update parcial)

5. **Integração com MovimentacaoService**:

   - MovimentacaoService chama getConfiguracao() para saldoInicial
   - Cálculo de saldo é sempre consistente
   - Nova configuração impacta futuros cálculos

6. **Autenticação**:

   - Todas as rotas requerem token JWT válido
   - Qualquer usuário autenticado pode ver/editar configuração

7. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 3 funções principais
- [x] Controller com 2 métodos públicos
- [x] Validators com 2 schemas Zod
- [x] Routes com 2 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Validação de saldoInicial ≥ 0
- [x] Validação de mesAtual 1-12
- [x] Garantia de apenas 1 registro
- [x] Auto-criação com defaults
- [x] Update parcial suportado
- [x] Sem recálculo de movimentações antigas
- [x] Integração com MovimentacaoService
- [x] Tratamento de erros padronizado
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Configurações implementado com sucesso! 🎉**

Com suporte completo a gerenciamento de saldo inicial e configurações do sistema integrados automaticamente com todos os módulos financeiros.

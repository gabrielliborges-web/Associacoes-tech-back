# 📦 Módulo de Vendas - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão do projeto:

```
src/
├── controllers/
│   └── venda.controller.ts            ✅ Controllers das rotas
├── docs/
│   └── venda.docs.ts                  ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── venda.routes.ts                ✅ Definição das rotas HTTP
├── services/
│   └── venda.service.ts               ✅ Lógica de negócio
├── validators/
│   └── venda.schema.ts                ✅ Validação com Zod
└── app.ts                             ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/venda.service.ts`)

Implementadas as seguintes funções:

- **`listVendas(filters?)`** - Lista vendas com filtros opcionais
- **`getVendaById(id: number)`** - Obtém uma venda com todos seus itens
- **`createVenda(dto, usuarioId)`** - Cria nova venda com itens
- **`cancelVenda(id, usuarioId)`** - Cancela venda e reverte estoque
- **`validateVendaItems(itens[])`** - Valida itens da venda

#### Regras de Negócio Implementadas:

✅ Calcular total automaticamente (sum(quantidade × precoUnit))
✅ Validar todos os produtos antes de criar
✅ Verificar estoque suficiente antes de vender
✅ Atualizar estoque de cada produto (decrement) ao criar venda
✅ Criar movimentação financeira (entrada) ao criar venda
✅ Reverter estoque (increment) ao cancelar venda
✅ Criar movimentação financeira (saída) ao cancelar venda
✅ Usar transações para garantir consistência
✅ Validação de quantidade e preço (maiores que zero)
✅ Retorno sem campos desnecessários (select explícito)
✅ Async/Await para todas as operações
✅ Tratamento de erros com status HTTP apropriados
✅ Validação de produto ativo
✅ Verificação de permissão ao cancelar (apenas criador)

---

### 2️⃣ **Controller Layer** (`controllers/venda.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /vendas com filtros
- **`show(req, res)`** - Handle GET /vendas/:id
- **`create(req, res)`** - Handle POST /vendas
- **`cancel(req, res)`** - Handle POST /vendas/:id/cancelar

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message }` ou `{ message, errors[] }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Extração de usuarioId do token autenticado
✅ Filtros opcionais para listagem
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/venda.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-itemVendaSchema - // Item individual da venda
  createVendaSchema - // Para criação de venda
  cancelVendaSchema - // Para cancelamento de venda
  idParamSchema - // Para parâmetros ID
  listVendasSchema; // Para filtros de listagem
```

#### Validações:

✅ **FormaPagamento**: String obrigatória, máximo 100 caracteres
✅ **Observação**: String opcional, máximo 1000 caracteres
✅ **Data**: DateTime ISO 8601 opcional (padrão: now())
✅ **Itens**: Array obrigatório, mínimo 1 item

- **ProdutoId**: Número inteiro positivo obrigatório
- **Quantidade**: Número inteiro positivo obrigatório
- **PrecoUnit**: Número positivo obrigatório (preço na época da venda)
  ✅ **IDs**: Validação numérica em parâmetros de rota

---

### 4️⃣ **Routes** (`routes/venda.routes.ts`)

Rotas implementadas:

```
GET    /vendas                   → list()   [Autenticado]
GET    /vendas/:id               → show()   [Autenticado]
POST   /vendas                   → create() [Autenticado]
POST   /vendas/:id/cancelar      → cancel() [Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth`
✅ Validação automática com schemas
✅ Filtros opcionais na listagem
✅ Rota específica (:id/cancelar) antes de genérica (:id)

---

### 5️⃣ **Documentation** (`docs/venda.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema Venda (com exemplo)
✅ Schema ItemVenda (com exemplo)
✅ Schema CreateVendaDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de requisição simples e múltiplos itens
✅ Exemplos de response
✅ Códigos de resposta (200, 201, 400, 401, 403, 404)
✅ Segurança com Bearer Token
✅ Explicação de processos automáticos (estoque, movimentação)
✅ Descrição de reversão ao cancelar

---

## 🔄 Integração com Outras Funcionalidades

### Atualização de Estoque

Na criação da venda:

```typescript
await tx.produto.update({
  where: { id: item.produtoId },
  data: { estoque: { decrement: item.quantidade } },
});
```

No cancelamento (reversão):

```typescript
await tx.produto.update({
  where: { id: item.produtoId },
  data: { estoque: { increment: item.quantidade } },
});
```

### Movimentação Financeira

Na criação da venda (entrada):

```typescript
await tx.movimentacaoFinanceira.create({
  data: {
    usuarioId,
    tipo: "venda",
    referenciaId: venda.id,
    descricao: `Venda #${venda.id}`,
    valor: total,
    entrada: true, // Entrada de dinheiro
  },
});
```

No cancelamento (saída):

```typescript
await tx.movimentacaoFinanceira.create({
  data: {
    usuarioId,
    tipo: "cancelamento_venda",
    referenciaId: venda.id,
    descricao: `Cancelamento da venda #${venda.id}`,
    valor: total,
    entrada: false, // Saída de dinheiro (reversão)
  },
});
```

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import vendaRoutes from "./routes/venda.routes";

// ...

app.use("/vendas", vendaRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint               | Auth | Descrição                       |
| ------ | ---------------------- | ---- | ------------------------------- |
| GET    | `/vendas`              | ✅   | Lista vendas com filtros        |
| GET    | `/vendas/:id`          | ✅   | Obtém uma venda com itens       |
| POST   | `/vendas`              | ✅   | Cria venda com itens            |
| POST   | `/vendas/:id/cancelar` | ✅   | Cancela venda (reverte estoque) |

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

- **200** - Sucesso (GET, DELETE, POST cancelar)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou dados inválidos
- **401** - Não autenticado
- **403** - Sem permissão (tentando cancelar venda de outro usuário)
- **404** - Venda/Produto não encontrado
- **500** - Erro interno do servidor

### Exemplos de Erro:

**Estoque insuficiente:**

```json
{
  "message": "Estoque insuficiente do produto \"Notebook Dell\". Disponível: 5, solicitado: 10."
}
```

**Produto não encontrado:**

```json
{
  "message": "Produto com ID 999 não encontrado."
}
```

**Produto inativo:**

```json
{
  "message": "Produto \"Notebook Dell\" não está disponível."
}
```

**Sem permissão:**

```json
{
  "message": "Você não tem permissão para cancelar esta venda."
}
```

---

## 🗄️ Banco de Dados

Utiliza os modelos já existentes no Prisma Schema:

```prisma
model Venda {
  id             Int           @id @default(autoincrement())
  usuarioId      Int
  usuario        Usuario       @relation(fields: [usuarioId], references: [id])

  data           DateTime      @default(now())
  total          Decimal       @db.Decimal(10,2)
  formaPagamento String
  observacao     String?

  itens          ItemVenda[]
  criadoEm       DateTime      @default(now())
}

model ItemVenda {
  id         Int       @id @default(autoincrement())
  quantidade Int
  precoUnit  Decimal   @db.Decimal(10,2)

  produtoId  Int
  vendaId    Int

  produto    Produto   @relation(fields: [produtoId], references: [id])
  venda      Venda     @relation(fields: [vendaId], references: [id])
}

model MovimentacaoFinanceira {
  id           Int         @id @default(autoincrement())
  usuarioId    Int
  usuario      Usuario     @relation(fields: [usuarioId], references: [id])

  data         DateTime    @default(now())
  tipo         String       // venda, cancelamento_venda
  referenciaId Int?
  descricao    String
  valor        Decimal      @db.Decimal(10,2)
  entrada      Boolean      // true = entrada, false = saída
  saldoApos    Decimal?     @db.Decimal(10,2)

  criadoEm     DateTime     @default(now())
}
```

---

## ✨ Padrões Seguidos

✅ TypeScript com tipos explícitos
✅ Async/Await para operações assincronas
✅ Prisma Client para acesso ao banco
✅ Transações para garantir consistência
✅ Funções puras no service layer
✅ Validação obrigatória em todas as rotas
✅ Sem retorno de dados sensíveis
✅ Nomes de pastas e arquivos padronizados
✅ Estrutura idêntica aos módulos existentes (Categorias, Produtos, Compras)

---

## 🧪 Como Testar

### Criar venda com múltiplos itens:

```bash
POST /vendas
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "formaPagamento": "pix",
  "descricao": "Cliente fiel",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnit": 19.90
    },
    {
      "produtoId": 2,
      "quantidade": 1,
      "precoUnit": 39.90
    }
  ]
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "formaPagamento": "pix",
  "data": "2025-11-21T15:30:00Z",
  "total": 79.7,
  "descricao": "Cliente fiel",
  "usuarioId": 1,
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  "itens": [
    {
      "id": 1,
      "quantidade": 2,
      "precoUnit": 19.9,
      "produtoId": 1,
      "produto": {
        "id": 1,
        "nome": "Notebook Dell",
        "descricao": "Notebook potente",
        "estoque": 8
      }
    },
    {
      "id": 2,
      "quantidade": 1,
      "precoUnit": 39.9,
      "produtoId": 2,
      "produto": {
        "id": 2,
        "nome": "Monitor LG",
        "descricao": "Monitor 24 polegadas",
        "estoque": 4
      }
    }
  ],
  "criadoEm": "2025-11-21T15:30:00Z"
}
```

### Listar vendas com filtros:

```bash
GET /vendas?dataInicio=2025-11-01T00:00:00Z&dataFim=2025-11-30T23:59:59Z&formaPagamento=pix
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "formaPagamento": "pix",
    "data": "2025-11-21T15:30:00Z",
    "total": 79.7,
    "descricao": "Cliente fiel",
    "usuarioId": 1,
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com"
    },
    "criadoEm": "2025-11-21T15:30:00Z"
  }
]
```

### Obter venda específica:

```bash
GET /vendas/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):** [Retorna venda com todos os itens]

### Cancelar venda (reverte estoque):

```bash
POST /vendas/1/cancelar
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "message": "Venda cancelada e estoque revertido com sucesso.",
  "venda": {
    "id": 1,
    "formaPagamento": "pix",
    "data": "2025-11-21T15:30:00Z",
    "total": 79.7,
    "descricao": "Cliente fiel",
    "usuarioId": 1,
    "criadoEm": "2025-11-21T15:30:00Z"
  }
}
```

---

## 📝 Observações Importantes

1. **Total Automático**: Calculado na criação como `sum(quantidade × precoUnit)`

2. **Transações**: Todas as operações usam transações para garantir consistência

   - Se algo falhar, tudo é revertido

3. **Validação de Produtos**:

   - Produto deve existir
   - Produto deve estar ativo
   - Quantidade e preço devem ser maiores que zero
   - Estoque deve ser suficiente

4. **Estoque**:

   - Decrementado automaticamente ao criar venda
   - Incrementado automaticamente ao cancelar venda
   - Se estoque é insuficiente, venda é rejeitada

5. **Preço de Venda**:

   - Preço é enviado no request (precoUnit)
   - Permite flexibilidade para promoções
   - Armazenado com 2 casas decimais (Decimal 10,2)

6. **Movimentação Financeira**:

   - Criada automaticamente ao criar venda (tipo: "venda", entrada: true)
   - Criada automaticamente ao cancelar venda (tipo: "cancelamento_venda", entrada: false)

7. **Filtros de Listagem**:

   - `dataInicio`: Data inicial (ISO 8601)
   - `dataFim`: Data final (ISO 8601)
   - `formaPagamento`: Busca parcial case-insensitive

8. **Autenticação**:

   - Todas as rotas requerem token JWT válido
   - Usuário só pode cancelar suas próprias vendas

9. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 5 funções principais
- [x] Controller com 4 métodos públicos
- [x] Validators com 5 schemas Zod
- [x] Routes com 4 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Cálculo automático de total
- [x] Validação de itens
- [x] Atualização de estoque (decrement na criação)
- [x] Reversão de estoque (increment no cancelamento)
- [x] Movimentação financeira (entrada na criação)
- [x] Movimentação financeira (saída no cancelamento)
- [x] Transações para consistência
- [x] Tratamento de erros padronizado
- [x] Filtros de listagem (data, formaPagamento)
- [x] Verificação de estoque suficiente
- [x] Validação de produto ativo
- [x] Verificação de permissão no cancelamento
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Vendas implementado com sucesso! 🎉**

Com suporte completo a gerenciamento de estoque, movimentação financeira e cancelamento de vendas integrados automaticamente.

# 📦 Módulo de Compras - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão existente do projeto:

```
src/
├── controllers/
│   └── compra.controller.ts          ✅ Controllers das rotas
├── docs/
│   └── compra.docs.ts                ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── compra.routes.ts              ✅ Definição das rotas HTTP
├── services/
│   └── compra.service.ts             ✅ Lógica de negócio
├── validators/
│   └── compra.schema.ts              ✅ Validação com Zod
└── app.ts                            ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/compra.service.ts`)

Implementadas as seguintes funções:

- **`listCompras(filters?)`** - Lista compras com filtros opcionais
- **`getCompraById(id: number)`** - Obtém uma compra com todos seus itens
- **`createCompra(dto, usuarioId)`** - Cria nova compra com itens
- **`deleteCompra(id, usuarioId)`** - Deleta compra e reverte estoque
- **`validateCompraItems(itens[])`** - Valida itens da compra

#### Regras de Negócio Implementadas:

✅ Calcular total automaticamente (sum(custoUnit × quantidade))
✅ Validar todos os produtos antes de criar
✅ Verificar estoque disponível antes de reverter
✅ Atualizar estoque automaticamente ao criar compra
✅ Criar movimentação financeira (saída) ao criar compra
✅ Reverter estoque ao deletar compra
✅ Criar movimentação financeira (entrada) ao deletar compra
✅ Usar transações para garantir consistência
✅ Validação de quantidade e custo (maiores que zero)
✅ Retorno sem campos desnecessários (select explícito)
✅ Async/Await para todas as operações
✅ Tratamento de erros com status HTTP apropriados

---

### 2️⃣ **Controller Layer** (`controllers/compra.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /compras com filtros
- **`show(req, res)`** - Handle GET /compras/:id
- **`create(req, res)`** - Handle POST /compras
- **`delete_(req, res)`** - Handle DELETE /compras/:id

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Extração de usuarioId do token autenticado
✅ Filtros opcionais para listagem
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/compra.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-itemCompraSchema - // Item individual da compra
  createCompraSchema - // Para criação de compra
  idParamSchema; // Para parâmetros ID
```

#### Validações:

✅ **Fornecedor**: String opcional, máximo 150 caracteres
✅ **Data**: DateTime ISO 8601 opcional (padrão: now())
✅ **Observação**: String opcional, máximo 1000 caracteres
✅ **Itens**: Array obrigatório, mínimo 1 item

- **ProdutoId**: Número inteiro positivo obrigatório
- **Quantidade**: Número inteiro positivo obrigatório
- **CustoUnit**: Número positivo obrigatório
  ✅ **IDs**: Validação numérica em parâmetros de rota

---

### 4️⃣ **Routes** (`routes/compra.routes.ts`)

Rotas implementadas:

```
GET    /compras              → list()   [Autenticado]
GET    /compras/:id          → show()   [Autenticado]
POST   /compras              → create() [Autenticado]
DELETE /compras/:id          → delete_()[Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth`
✅ Validação automática com schemas
✅ Filtros opcionais na listagem

---

### 5️⃣ **Documentation** (`docs/compra.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema Compra (com exemplo)
✅ Schema ItemCompra (com exemplo)
✅ Schema CreateCompraDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de requisição e resposta
✅ Exemplos com múltiplos itens
✅ Códigos de resposta (200, 201, 400, 401, 404)
✅ Segurança com Bearer Token
✅ Explicação de processo automático (estoque, movimentação)

---

## 🔄 Integração com Outros Serviços

### Atualização de Estoque

Na criação da compra:

```typescript
await tx.produto.update({
  where: { id: item.produtoId },
  data: { estoque: { increment: item.quantidade } },
});
```

Na exclusão (reversão):

```typescript
await tx.produto.update({
  where: { id: item.produtoId },
  data: { estoque: { decrement: item.quantidade } },
});
```

### Movimentação Financeira

Na criação da compra (saída):

```typescript
await tx.movimentacaoFinanceira.create({
  usuarioId,
  tipo: "compra",
  referenciaId: compra.id,
  descricao: `Compra de produtos (#${compra.id})`,
  valor: total,
  entrada: false, // Saída de dinheiro
});
```

Na exclusão (entrada):

```typescript
await tx.movimentacaoFinanceira.create({
  usuarioId,
  tipo: "compra_cancelada",
  referenciaId: id,
  descricao: `Estorno/Cancelamento da compra (#${id})`,
  valor: total,
  entrada: true, // Entrada de dinheiro
});
```

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import compraRoutes from "./routes/compra.routes";

// ...

app.use("/compras", compraRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint       | Auth | Descrição                       |
| ------ | -------------- | ---- | ------------------------------- |
| GET    | `/compras`     | ✅   | Lista compras com filtros       |
| GET    | `/compras/:id` | ✅   | Obtém uma compra                |
| POST   | `/compras`     | ✅   | Cria compra com itens           |
| DELETE | `/compras/:id` | ✅   | Deleta compra (reverte estoque) |

---

## 🛡️ Tratamento de Erros

Todos os erros seguem o padrão padronizado:

```json
{
  "message": "Descrição do erro"
}
```

### Códigos de Status Implementados:

- **200** - Sucesso (GET, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou dados inválidos
- **401** - Não autenticado
- **404** - Compra/Produto não encontrado
- **500** - Erro interno do servidor

---

## 🗄️ Banco de Dados

Utiliza os modelos já existentes no Prisma Schema:

```prisma
model Compra {
  id         Int
  usuarioId  Int
  usuario    Usuario
  fornecedor String?
  data       DateTime
  total      Decimal
  descricao String?
  itens      ItemCompra[]
  criadoEm   DateTime
}

model ItemCompra {
  id        Int
  quantidade Int
  custoUnit Decimal
  produtoId Int
  compraId  Int
  produto   Produto
  compra    Compra
}

model MovimentacaoFinanceira {
  id        Int
  usuarioId Int
  data      DateTime
  tipo      String
  referenciaId Int?
  descricao String
  valor     Decimal
  entrada   Boolean
  criadoEm  DateTime
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
✅ Estrutura idêntica aos módulos existentes

---

## 🧪 Como Testar

### Criar compra com múltiplos itens:

```bash
POST /compras
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "fornecedor": "Fornecedor ABC LTDA",
  "data": "2025-11-21T10:00:00Z",
  "descricao": "Compra de estoque mensal",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 10,
      "custoUnit": 500.00
    },
    {
      "produtoId": 2,
      "quantidade": 5,
      "custoUnit": 750.00
    }
  ]
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "fornecedor": "Fornecedor ABC LTDA",
  "data": "2025-11-21T10:00:00Z",
  "total": 8750.0,
  "descricao": "Compra de estoque mensal",
  "usuarioId": 1,
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  "itens": [
    {
      "id": 1,
      "quantidade": 10,
      "custoUnit": 500.0,
      "produtoId": 1,
      "produto": {
        "id": 1,
        "nome": "Notebook Dell",
        "descricao": "..."
      }
    },
    {
      "id": 2,
      "quantidade": 5,
      "custoUnit": 750.0,
      "produtoId": 2,
      "produto": {
        "id": 2,
        "nome": "Monitor LG",
        "descricao": "..."
      }
    }
  ],
  "criadoEm": "2025-11-21T15:30:00Z"
}
```

### Listar compras com filtros:

```bash
GET /compras?dataInicio=2025-11-01T00:00:00Z&dataFim=2025-11-30T23:59:59Z&fornecedor=ABC
Authorization: Bearer {TOKEN}
```

### Obter compra específica:

```bash
GET /compras/1
Authorization: Bearer {TOKEN}
```

### Deletar compra (reverte estoque):

```bash
DELETE /compras/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "message": "Compra deletada e estoque revertido com sucesso."
}
```

---

## 📝 Observações Importantes

1. **Total Automático**: Calculado na criação como `sum(custoUnit × quantidade)`

2. **Transações**: Todas as operações usam transações para garantir consistência

   - Se algo falhar, tudo é revertido

3. **Validação de Produtos**:

   - Produto deve existir
   - Produto deve estar ativo
   - Quantidade e custo devem ser maiores que zero

4. **Estoque**:

   - Aumentado automaticamente ao criar compra
   - Decrementado automaticamente ao deletar compra
   - Se não houver estoque para reverter, operação falha

5. **Movimentação Financeira**:

   - Criada automaticamente ao criar compra (tipo: "compra", entrada: false)
   - Criada automaticamente ao deletar compra (tipo: "compra_cancelada", entrada: true)

6. **Filtros de Listagem**:

   - `dataInicio`: Data inicial (ISO 8601)
   - `dataFim`: Data final (ISO 8601)
   - `fornecedor`: Busca parcial case-insensitive

7. **Autenticação**: Todas as rotas requerem token JWT válido

8. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 5 funções principais
- [x] Controller com 4 métodos públicos
- [x] Validators com 3 schemas Zod
- [x] Routes com 4 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Cálculo automático de total
- [x] Validação de itens
- [x] Atualização de estoque na criação
- [x] Reversão de estoque na exclusão
- [x] Movimentação financeira (saída na criação)
- [x] Movimentação financeira (entrada na exclusão)
- [x] Transações para consistência
- [x] Tratamento de erros padronizado
- [x] Filtros de listagem (data, fornecedor)
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Compras implementado com sucesso! 🎉**

Com suporte completo a gerenciamento de estoque e movimentação financeira integrados automaticamente.

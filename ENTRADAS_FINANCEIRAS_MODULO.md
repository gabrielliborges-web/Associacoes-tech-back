# 💰 Módulo de Entradas Financeiras - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão do projeto:

```
src/
├── controllers/
│   └── entradaFinanceira.controller.ts    ✅ Controllers das rotas
├── docs/
│   └── entradaFinanceira.docs.ts          ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── entradaFinanceira.routes.ts        ✅ Definição das rotas HTTP
├── services/
│   └── entradaFinanceira.service.ts       ✅ Lógica de negócio
├── validators/
│   └── entradaFinanceira.schema.ts        ✅ Validação com Zod
└── app.ts                                 ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/entradaFinanceira.service.ts`)

Implementadas as seguintes funções:

- **`listEntradas(filters?)`** - Lista entradas com filtros opcionais
- **`getEntradaById(id: number)`** - Obtém uma entrada com detalhes
- **`createEntrada(dto, userId)`** - Cria nova entrada financeira
- **`updateEntrada(id, dto, userId)`** - Atualiza entrada existente
- **`deleteEntrada(id, userId)`** - Deleta entrada e registra reversão

#### Regras de Negócio Implementadas:

✅ Validar valor maior que zero
✅ Criar entrada financeira com tipo/valor/observação
✅ Criar movimentação financeira positiva (entrada) ao criar
✅ Permitir editar tipo/valor/observação/data
✅ Atualizar movimentação ao alterar valor
✅ Deletar entrada com reversão de movimentação
✅ Registrar movimentação de saída ao deletar
✅ Verificação de permissão (usuário dono)
✅ Transações para garantir consistência
✅ Retorno sem campos desnecessários (select explícito)
✅ Async/Await para todas as operações
✅ Tratamento de erros com status HTTP apropriados
✅ Ordenação por data descendente
✅ Filtros por tipo, data, usuário

---

### 2️⃣ **Controller Layer** (`controllers/entradaFinanceira.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /entradas com filtros
- **`show(req, res)`** - Handle GET /entradas/:id
- **`create(req, res)`** - Handle POST /entradas
- **`update(req, res)`** - Handle PUT /entradas/:id
- **`delete_(req, res)`** - Handle DELETE /entradas/:id

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message }` ou `{ message, errors[] }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Extração de usuarioId do token autenticado
✅ Filtros opcionais para listagem
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/entradaFinanceira.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-createEntradaFinanceiraSchema - // Para criação de entrada
  updateEntradaFinanceiraSchema - // Para atualização de entrada
  idParamSchema - // Para parâmetros ID
  listEntradasSchema; // Para filtros de listagem
```

#### Validações:

✅ **Tipo**: String obrigatória, mínimo 3 caracteres, máximo 100
✅ **Valor**: Número positivo obrigatório na criação, opcional na atualização
✅ **Observação**: String opcional, máximo 1000 caracteres
✅ **Data**: DateTime ISO 8601 opcional (padrão: now())
✅ **IDs**: Validação numérica em parâmetros de rota
✅ **Filtros**: Tipo, dataInicio, dataFim, usuarioId (todos opcionais)

---

### 4️⃣ **Routes** (`routes/entradaFinanceira.routes.ts`)

Rotas implementadas:

```
GET    /entradas                  → list()   [Autenticado]
GET    /entradas/:id              → show()   [Autenticado]
POST   /entradas                  → create() [Autenticado]
PUT    /entradas/:id              → update() [Autenticado]
DELETE /entradas/:id              → delete_()[Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth`
✅ Validação automática com schemas
✅ Filtros opcionais na listagem
✅ Verificação de permissão (usuário dono)

---

### 5️⃣ **Documentation** (`docs/entradaFinanceira.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema EntradaFinanceira (com exemplo)
✅ Schema CreateEntradaFinanceiraDTO
✅ Schema UpdateEntradaFinanceiraDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de request e response
✅ Exemplos com múltiplos tipos (aporte, reembolso, serviço)
✅ Códigos de resposta (200, 201, 400, 401, 403, 404)
✅ Segurança com Bearer Token
✅ Explicação de processos automáticos (movimentação)
✅ Descrição de reversão ao deletar

---

## 🔄 Integração com Outras Funcionalidades

### Movimentação Financeira

Na criação da entrada (entrada positiva):

```typescript
await tx.movimentacaoFinanceira.create({
  data: {
    usuarioId,
    tipo: "entrada_financeira",
    referenciaId: novaEntrada.id,
    descricao: `Entrada Financeira (${novaEntrada.tipo})`,
    valor: parseFloat(data.valor.toFixed(2)),
    entrada: true, // Entrada de dinheiro
  },
});
```

Na atualização do valor:

```typescript
await tx.movimentacaoFinanceira.updateMany({
  where: {
    referenciaId: id,
    tipo: "entrada_financeira",
  },
  data: {
    valor: parseFloat(data.valor.toFixed(2)),
  },
});
```

Na deleção (saída reversa):

```typescript
await tx.movimentacaoFinanceira.create({
  data: {
    usuarioId,
    tipo: "reversao_entrada",
    referenciaId: id,
    descricao: `Estorno de Entrada Financeira #${id}`,
    valor: parseFloat(entrada.valor.toString()),
    entrada: false, // Saída de dinheiro (reversão)
  },
});
```

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import entradaFinanceiraRoutes from "./routes/entradaFinanceira.routes";

// ...

app.use("/entradas", entradaFinanceiraRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint        | Auth | Descrição                     |
| ------ | --------------- | ---- | ----------------------------- |
| GET    | `/entradas`     | ✅   | Lista entradas com filtros    |
| GET    | `/entradas/:id` | ✅   | Obtém detalhes de uma entrada |
| POST   | `/entradas`     | ✅   | Cria nova entrada             |
| PUT    | `/entradas/:id` | ✅   | Atualiza entrada existente    |
| DELETE | `/entradas/:id` | ✅   | Deleta entrada (com reversão) |

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

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou dados inválidos
- **401** - Não autenticado
- **403** - Sem permissão (tentando editar/deletar entrada de outro usuário)
- **404** - Entrada não encontrada
- **500** - Erro interno do servidor

### Exemplos de Erro:

**Valor inválido:**

```json
{
  "message": "Erro de validação.",
  "errors": ["Valor deve ser maior que zero."]
}
```

**Entrada não encontrada:**

```json
{
  "message": "Entrada financeira não encontrada."
}
```

**Sem permissão:**

```json
{
  "message": "Você não tem permissão para editar esta entrada."
}
```

---

## 🗄️ Banco de Dados

Utiliza os modelos já existentes no Prisma Schema:

```prisma
model EntradaFinanceira {
  id         Int         @id @default(autoincrement())
  usuarioId  Int
  usuario    Usuario     @relation(fields: [usuarioId], references: [id])

  tipo       String
  valor      Decimal      @db.Decimal(10,2)
  data       DateTime     @default(now())
  observacao String?

  criadoEm   DateTime     @default(now())
}

model MovimentacaoFinanceira {
  id           Int         @id @default(autoincrement())
  usuarioId    Int
  usuario      Usuario     @relation(fields: [usuarioId], references: [id])

  data         DateTime    @default(now())
  tipo         String       // entrada_financeira, reversao_entrada
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
✅ Estrutura idêntica aos módulos existentes

---

## 🧪 Como Testar

### Criar entrada financeira:

```bash
POST /entradas
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "tipo": "aporte",
  "valor": 500.00,
  "descricao": "Aporte de capital",
  "data": "2025-02-01T10:00:00Z"
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "tipo": "aporte",
  "valor": 500.0,
  "data": "2025-02-01T10:00:00Z",
  "descricao": "Aporte de capital",
  "usuarioId": 1,
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  "criadoEm": "2025-11-21T15:30:00Z"
}
```

### Listar entradas com filtros:

```bash
GET /entradas?tipo=aporte&dataInicio=2025-02-01T00:00:00Z&dataFim=2025-02-28T23:59:59Z
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "tipo": "aporte",
    "valor": 500.0,
    "data": "2025-02-01T10:00:00Z",
    "descricao": "Aporte de capital",
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

### Obter entrada específica:

```bash
GET /entradas/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):** [Retorna entrada com detalhes]

### Atualizar entrada:

```bash
PUT /entradas/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "tipo": "reembolso",
  "valor": 750.00,
  "descricao": "Reembolso corrigido"
}
```

**Resposta (200):** [Retorna entrada atualizada]

### Deletar entrada (com reversão):

```bash
DELETE /entradas/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "message": "Entrada financeira deletada com sucesso.",
  "entrada": {
    "id": 1,
    "tipo": "aporte",
    "valor": 500.0,
    "data": "2025-02-01T10:00:00Z",
    "descricao": "Aporte de capital",
    "usuarioId": 1,
    "criadoEm": "2025-11-21T15:30:00Z"
  }
}
```

---

## 📝 Observações Importantes

1. **Valor Obrigatório**: Sempre deve ser maior que zero (na criação e atualização)

2. **Transações**: Todas as operações usam transações para garantir consistência

   - Se algo falhar, tudo é revertido

3. **Movimentação Automática**:

   - Criada na criação de entrada (tipo: "entrada_financeira", entrada: true)
   - Atualizada se valor for alterado
   - Criada reversa na deleção (tipo: "reversao_entrada", entrada: false)

4. **Filtros de Listagem**:

   - `tipo`: Busca parcial case-insensitive
   - `dataInicio`: Data inicial (ISO 8601)
   - `dataFim`: Data final (ISO 8601)
   - Resultados ordenados por data descending

5. **Autenticação**:

   - Todas as rotas requerem token JWT válido
   - Usuário só pode editar/deletar suas próprias entradas

6. **Edição de Valor**:

   - Se o valor for alterado, a movimentação associada é atualizada automaticamente
   - Mantém referência para rastreabilidade

7. **Deleção com Reversão**:

   - Não remove a movimentação original (auditoria)
   - Cria uma movimentação reversa (saída)

8. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 5 funções principais
- [x] Controller com 5 métodos públicos
- [x] Validators com 4 schemas Zod
- [x] Routes com 5 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Validação de valor > 0
- [x] Movimentação financeira na criação (entrada: true)
- [x] Movimentação financeira na deleção (entrada: false)
- [x] Transações para consistência
- [x] Tratamento de erros padronizado
- [x] Filtros de listagem (tipo, data)
- [x] Verificação de permissão
- [x] Atualização de movimentação ao editar
- [x] Ordenação por data descendente
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Entradas Financeiras implementado com sucesso! 🎉**

Com suporte completo a gerenciamento de entrada financeira, movimentação automática e edição/deleção com reversão.

# 📦 Módulo de Categorias - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão existente do projeto:

```
src/
├── controllers/
│   └── categoria.controller.ts       ✅ Controllers das rotas
├── docs/
│   └── categoria.docs.ts              ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── categoria.routes.ts            ✅ Definição das rotas HTTP
├── services/
│   └── categoria.service.ts           ✅ Lógica de negócio
├── validators/
│   └── categoria.schema.ts            ✅ Validação com Zod
└── app.ts                             ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/categoria.service.ts`)

Implementadas as seguintes funções:

- **`listCategorias()`** - Lista todas as categorias
- **`getCategoriaById(id: number)`** - Obtém uma categoria por ID
- **`createCategoria(dto)`** - Cria uma nova categoria
- **`updateCategoria(id: number, dto)`** - Atualiza uma categoria
- **`deleteCategoria(id: number)`** - Deleta uma categoria

#### Regras de Negócio Implementadas:

✅ Nome da categoria é único (case-insensitive)
✅ Validação de existência antes de atualizar/deletar
✅ Proteção contra exclusão de categoria com produtos vinculados
✅ Retorno sem campos desnecessários (select explícito)
✅ Async/Await para todas as operações
✅ Tratamento de erros com status HTTP apropriados

---

### 2️⃣ **Controller Layer** (`controllers/categoria.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /categorias
- **`show(req, res)`** - Handle GET /categorias/:id
- **`create(req, res)`** - Handle POST /categorias
- **`update(req, res)`** - Handle PUT /categorias/:id
- **`delete_(req, res)`** - Handle DELETE /categorias/:id

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de erros com JSON padronizado (`{ message, status }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/categoria.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-createCategoriaSchema - // Para criação
  updateCategoriaSchema - // Para atualização
  idParamSchema; // Para parâmetros ID
```

#### Validações:

✅ **Nome**: String obrigatória, mínimo 2, máximo 100 caracteres
✅ **Descrição**: String opcional, máximo 500 caracteres
✅ **Ativo**: Boolean opcional, padrão true
✅ **IDs**: Validação numérica em parâmetros de rota

---

### 4️⃣ **Routes** (`routes/categoria.routes.ts`)

Rotas implementadas:

```
GET    /categorias           → list()        [Público]
GET    /categorias/:id       → show()        [Público]
POST   /categorias           → create()      [Admin/SuperAdmin]
PUT    /categorias/:id       → update()      [Admin/SuperAdmin]
DELETE /categorias/:id       → delete_()     [Admin/SuperAdmin]
```

#### Segurança:

✅ GET (list/show) - Públicas (sem autenticação)
✅ POST/PUT/DELETE - Protegidas com `requireAuth` + `requireAdmin`
✅ Validação automática com schemas

---

### 5️⃣ **Documentation** (`docs/categoria.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema Categoria (com exemplo)
✅ Schema CreateCategoriaDTO
✅ Schema UpdateCategoriaDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de requisição e resposta
✅ Códigos de resposta (200, 201, 400, 401, 403, 404, 409)
✅ Segurança com Bearer Token

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import categoriaRoutes from "./routes/categoria.routes";

// ...

app.use("/categorias", categoriaRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint          | Autenticação | Descrição                 |
| ------ | ----------------- | ------------ | ------------------------- |
| GET    | `/categorias`     | ❌ Pública   | Lista todas as categorias |
| GET    | `/categorias/:id` | ❌ Pública   | Obtém uma categoria       |
| POST   | `/categorias`     | ✅ Admin     | Cria uma categoria        |
| PUT    | `/categorias/:id` | ✅ Admin     | Atualiza uma categoria    |
| DELETE | `/categorias/:id` | ✅ Admin     | Deleta uma categoria      |

---

## 🛡️ Tratamento de Erros

Todos os erros seguem o padrão padronizado:

```json
{
  "message": "Descrição do erro"
}
```

### Códigos de Status Implementados:

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação
- **401** - Não autenticado
- **403** - Sem permissão (privilégios insuficientes)
- **404** - Categoria não encontrada
- **409** - Conflito (nome duplicado, produtos vinculados)
- **500** - Erro interno do servidor

---

## 🗄️ Banco de Dados

Utiliza o modelo `Categoria` no Prisma Schema:

```prisma
model Categoria {
  id              Int        @id @default(autoincrement())
  nome            String
  descricao       String?
  ativo           Boolean    @default(true)
  produtos        Produto[]
  criadoEm        DateTime   @default(now())
  atualizadoEm    DateTime   @default(now()) @updatedAt
}
```

### Campos:

- **id**: Identificador único (autoincrement)
- **nome**: Nome da categoria (único, obrigatório)
- **descricao**: Descrição opcional
- **ativo**: Status da categoria (padrão: true)
- **criadoEm**: Timestamp de criação
- **atualizadoEm**: Timestamp da última atualização

---

## ✨ Padrões Seguidos

✅ TypeScript com tipos explícitos
✅ Async/Await para operações assincronas
✅ Prisma Client para acesso ao banco
✅ Funções puras no service layer
✅ Validação obrigatória em todas as rotas
✅ Sem retorno de dados sensíveis
✅ Nomes de pastas e arquivos padronizados
✅ Estrutura identica aos módulos existentes (users, auth, etc)

---

## 🧪 Como Testar

### Criar categoria (requer token de admin):

```bash
POST /categorias
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral",
  "ativo": true
}
```

### Listar categorias (público):

```bash
GET /categorias
```

### Obter categoria específica (público):

```bash
GET /categorias/1
```

### Atualizar categoria (requer token de admin):

```bash
PUT /categorias/1
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "nome": "Eletrônicos Premium",
  "descricao": "Produtos eletrônicos premium",
  "ativo": true
}
```

### Deletar categoria (requer token de admin):

```bash
DELETE /categorias/1
Authorization: Bearer <TOKEN_ADMIN>
```

---

## 📝 Observações Importantes

1. **Unicidade do Nome**: O nome é case-insensitive, ou seja, "Eletrônicos" e "ELETRÔNICOS" são considerados duplicados.

2. **Proteção ao Deletar**: Não é possível deletar uma categoria se houver produtos vinculados. Primeiro remova ou reatribua os produtos.

3. **Autenticação**: Endpoints de escrita (POST, PUT, DELETE) requerem token JWT de um usuário com role ADMIN ou SUPERADMIN.

4. **Swagger/OpenAPI**: A documentação está automaticamente disponível na rota `/api-docs` após inicializar o servidor.

5. **Validação**: Todos os inputs são validados com Zod antes de chegar ao service.

---

## ✅ Checklist de Implementação

- [x] Service com 5 funções principais
- [x] Controller com 5 métodos públicos
- [x] Validators com 3 schemas Zod
- [x] Routes com 5 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware e requireAdmin
- [x] Tratamento de erros padronizado
- [x] Validação de unicidade de nome
- [x] Proteção contra exclusão com produtos vinculados
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Categorias implementado com sucesso! 🎉**

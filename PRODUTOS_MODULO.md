# 📦 Módulo de Produtos - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão existente do projeto:

```
src/
├── controllers/
│   └── produto.controller.ts         ✅ Controllers das rotas
├── docs/
│   └── produto.docs.ts               ✅ Documentação Swagger/OpenAPI
├── middlewares/
│   └── upload.middleware.ts          ✅ Middleware para upload de imagens
├── routes/
│   └── produto.routes.ts             ✅ Definição das rotas HTTP
├── services/
│   └── produto.service.ts            ✅ Lógica de negócio
├── validators/
│   └── produto.schema.ts             ✅ Validação com Zod
└── app.ts                            ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/produto.service.ts`)

Implementadas as seguintes funções:

- **`listProdutos(filters?)`** - Lista produtos com filtros opcionais
- **`getProdutoById(id: number)`** - Obtém um produto por ID
- **`createProduto(dto, file?, usuarioId?)`** - Cria um novo produto
- **`updateProduto(id, dto, file?)`** - Atualiza um produto
- **`updateProdutoStatus(id, ativo)`** - Altera status do produto
- **`deleteProduto(id)`** - Deleta um produto (soft/hard delete)
- **`deleteImageFromS3(imageUrl)`** - Remove imagem do S3

#### Regras de Negócio Implementadas:

✅ Nome único por usuário (case-insensitive)
✅ Upload de imagem no S3 com chave segura
✅ Deleção automática de imagem antiga ao atualizar
✅ Proteção contra exclusão com vendas/compras vinculadas (soft delete)
✅ Validação de existência antes de atualizar/deletar
✅ Preços com conversão para Decimal
✅ Estoque gerenciado corretamente
✅ Retorno sem campos desnecessários (select explícito)
✅ Async/Await para todas as operações
✅ Tratamento de erros com status HTTP apropriados

---

### 2️⃣ **Controller Layer** (`controllers/produto.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /produtos com filtros
- **`show(req, res)`** - Handle GET /produtos/:id
- **`create(req, res)`** - Handle POST /produtos com upload
- **`update(req, res)`** - Handle PUT /produtos/:id com upload
- **`updateStatus(req, res)`** - Handle PUT /produtos/:id/status
- **`delete_(req, res)`** - Handle DELETE /produtos/:id

#### Recursos:

✅ Validação de schemas Zod em todas as rotas
✅ Tratamento de req.file (upload com multer)
✅ Tratamento de erros com JSON padronizado (`{ message }`)
✅ Diferenciação entre erros de validação (400) e erros de negócio
✅ Extração de usuarioId do token autenticado
✅ Chamadas diretas aos services

---

### 3️⃣ **Validators** (`validators/produto.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-createProdutoSchema - // Para criação
  updateProdutoSchema - // Para atualização
  changeStatusSchema - // Para alterar status
  idParamSchema - // Para parâmetros ID
  filtroListagemSchema; // Para filtros de busca
```

#### Validações:

✅ **Nome**: String obrigatória, mínimo 2, máximo 150 caracteres
✅ **Descrição**: String opcional, máximo 1000 caracteres
✅ **CategoriaId**: Número positivo opcional
✅ **PrecoVenda**: Número obrigatório, maior que zero
✅ **PrecoCompra**: Número opcional, maior que zero
✅ **PrecoPromocional**: Número opcional, maior que zero
✅ **EstoqueInicial**: Número não-negativo (padrão: 0)
✅ **Ativo**: Boolean (usado em changeStatusSchema)
✅ **IDs**: Validação numérica em parâmetros de rota
✅ **Filtros**: Suporte a busca por nome, categoria e status

---

### 4️⃣ **Routes** (`routes/produto.routes.ts`)

Rotas implementadas:

```
GET    /produtos              → list()         [Autenticado]
GET    /produtos/:id          → show()         [Autenticado]
POST   /produtos              → create()       [Autenticado]
PUT    /produtos/:id          → update()       [Autenticado]
PUT    /produtos/:id/status   → updateStatus() [Autenticado]
DELETE /produtos/:id          → delete_()      [Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth`
✅ Upload de imagem via multer (campo: "imagem")
✅ Validação automática com schemas

---

### 5️⃣ **Documentation** (`docs/produto.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schema Produto (com exemplo)
✅ Schema CreateProdutoDTO
✅ Schema UpdateProdutoDTO
✅ Schema ChangeStatusDTO
✅ Descrição detalhada de cada rota
✅ Exemplos de requisição e resposta
✅ Exemplos de upload (multipart/form-data)
✅ Códigos de resposta (200, 201, 400, 401, 404, 409)
✅ Segurança com Bearer Token
✅ Filtros de listagem documentados

---

### 6️⃣ **AWS S3 Integration**

Utiliza a configuração AWS existente do projeto:

✅ `uploadFileToS3(file, key)` - Upload seguro
✅ `deleteImageFromS3(imageUrl)` - Deleção com extração de chave
✅ `safeFileKey()` - Geração de chave segura com UUID
✅ Validação de arquivo antes de deletar

---

### 7️⃣ **Middleware de Upload** (`middlewares/upload.middleware.ts`)

Middleware configurado com:

✅ Armazenamento em memória
✅ Limite de 5MB por arquivo
✅ Validação de tipo (JPEG, PNG, WebP, GIF)
✅ Mensagem de erro clara para formatos inválidos

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import produtoRoutes from "./routes/produto.routes";

// ...

app.use("/produtos", produtoRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint               | Autenticação | Descrição                      |
| ------ | ---------------------- | ------------ | ------------------------------ |
| GET    | `/produtos`            | ✅ Requerida | Lista produtos com filtros     |
| GET    | `/produtos/:id`        | ✅ Requerida | Obtém um produto               |
| POST   | `/produtos`            | ✅ Requerida | Cria um produto com imagem     |
| PUT    | `/produtos/:id`        | ✅ Requerida | Atualiza um produto com imagem |
| PUT    | `/produtos/:id/status` | ✅ Requerida | Muda status (ativo/inativo)    |
| DELETE | `/produtos/:id`        | ✅ Requerida | Deleta um produto              |

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
- **400** - Erro de validação ou upload
- **401** - Não autenticado
- **404** - Produto não encontrado
- **409** - Conflito (nome duplicado)
- **500** - Erro interno do servidor

---

## 🗄️ Banco de Dados

Utiliza o modelo `Produto` já existente no Prisma Schema:

```prisma
model Produto {
  id               Int         @id @default(autoincrement())
  nome             String
  descricao        String?
  categoriaId      Int?
  categoria        Categoria?
  precoVenda       Decimal     @db.Decimal(10,2)
  precoCompra      Decimal?    @db.Decimal(10,2)
  precoPromocional Decimal?    @db.Decimal(10,2)
  estoque          Int         @default(0)
  ativo            Boolean     @default(true)
  imagem           String?
  usuarioId        Int?
  usuario          Usuario?
  vendasItens      ItemVenda[]
  comprasItens     ItemCompra[]
  criadoEm         DateTime    @default(now())
  atualizadoEm     DateTime    @updatedAt
}
```

---

## ✨ Padrões Seguidos

✅ TypeScript com tipos explícitos
✅ Async/Await para operações assincronas
✅ Prisma Client para acesso ao banco
✅ Funções puras no service layer
✅ Validação obrigatória em todas as rotas
✅ AWS S3 para gerenciamento de imagens
✅ Sem retorno de dados sensíveis
✅ Nomes de pastas e arquivos padronizados
✅ Estrutura idêntica aos módulos existentes

---

## 🧪 Como Testar

### Criar produto com imagem (multipart/form-data):

```bash
POST /produtos
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

nome: "Notebook Dell"
precoVenda: 2500.50
categoriaId: 1
estoqueInicial: 5
imagem: <arquivo>
```

### Listar produtos com filtros:

```bash
GET /produtos?nome=Notebook&categoriaId=1&ativo=true
Authorization: Bearer <TOKEN>
```

### Obter produto específico:

```bash
GET /produtos/1
Authorization: Bearer <TOKEN>
```

### Atualizar produto com nova imagem:

```bash
PUT /produtos/1
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

nome: "Notebook Dell Pro"
precoVenda: 2800.00
imagem: <arquivo novo>
```

### Alterar status do produto:

```bash
PUT /produtos/1/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "ativo": false
}
```

### Deletar produto:

```bash
DELETE /produtos/1
Authorization: Bearer <TOKEN>
```

---

## 📝 Observações Importantes

1. **Unicidade do Nome**: O nome é case-insensitive e único por usuário.

2. **Upload de Imagem**:

   - Campo do formulário: "imagem"
   - Tamanho máximo: 5MB
   - Formatos: JPEG, PNG, WebP, GIF
   - Salvo no S3 com chave segura (UUID)

3. **Deleção de Imagem**:

   - Automática ao deletar produto
   - Automática ao atualizar com nova imagem
   - Extrai chave seguramente da URL

4. **Soft vs Hard Delete**:

   - Com vendas/compras vinculadas: Soft delete (marca inativo)
   - Sem vinculações: Hard delete (remove completamente)

5. **Estoque**:

   - Definido apenas na criação via `estoqueInicial`
   - Não pode ser alterado via atualização de produto
   - Deve ser gerenciado via endpoint de movimentação de estoque

6. **Autenticação**: Todas as rotas requerem token JWT válido.

7. **Swagger/OpenAPI**: Documentação automática disponível em `/api-docs`.

8. **Filtros de Listagem**:
   - `nome`: Busca parcial (case-insensitive)
   - `categoriaId`: Filtra por categoria
   - `ativo`: Filtra por status (true/false)

---

## ✅ Checklist de Implementação

- [x] Service com 7 funções principais
- [x] Controller com 6 métodos públicos
- [x] Validators com 5 schemas Zod
- [x] Routes com 6 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Upload de imagem com multer
- [x] Integração AWS S3
- [x] Deleção de imagem do S3
- [x] Tratamento de erros padronizado
- [x] Validação de unicidade de nome por usuário
- [x] Proteção contra exclusão com vendas/compras
- [x] Soft/Hard delete implementado
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Produtos implementado com sucesso! 🎉**

Com suporte completo a upload e gerenciamento de imagens no AWS S3.

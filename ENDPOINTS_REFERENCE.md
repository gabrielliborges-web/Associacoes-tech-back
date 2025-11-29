# 📋 Resumo de Todos os Endpoints

## 🔐 Autenticação

| Método | Endpoint                   | Auth | Descrição                    |
| ------ | -------------------------- | ---- | ---------------------------- |
| POST   | `/auth/login`              | ❌   | Realizar login e obter token |
| POST   | `/auth/register`           | ❌   | Registrar novo usuário       |
| POST   | `/password-reset/request`  | ❌   | Solicitar reset de senha     |
| POST   | `/password-reset/validate` | ❌   | Validar código de reset      |
| POST   | `/password-reset/reset`    | ❌   | Redefinir senha              |

---

## 👥 Usuários

| Método | Endpoint             | Auth     | Descrição                           |
| ------ | -------------------- | -------- | ----------------------------------- |
| GET    | `/user`              | ✅       | Listar todos os usuários            |
| GET    | `/user/:id`          | ✅       | Obter usuário por ID                |
| GET    | `/user/profile`      | ✅       | Obter perfil do usuário autenticado |
| POST   | `/user`              | ✅ Admin | Criar novo usuário                  |
| PUT    | `/user/:id`          | ✅       | Atualizar usuário                   |
| PUT    | `/user/:id/theme`    | ✅       | Alterar tema do usuário             |
| PUT    | `/user/:id/password` | ✅       | Alterar senha do usuário            |
| DELETE | `/user/:id`          | ✅ Admin | Deletar usuário                     |

---

## 📂 Categorias

| Método | Endpoint          | Auth     | Descrição                  |
| ------ | ----------------- | -------- | -------------------------- |
| GET    | `/categorias`     | ❌       | Listar todas as categorias |
| GET    | `/categorias/:id` | ❌       | Obter categoria por ID     |
| POST   | `/categorias`     | ✅ Admin | Criar nova categoria       |
| PUT    | `/categorias/:id` | ✅ Admin | Atualizar categoria        |
| DELETE | `/categorias/:id` | ✅ Admin | Deletar categoria          |

---

## 🛍️ Produtos

| Método | Endpoint               | Auth | Descrição                            |
| ------ | ---------------------- | ---- | ------------------------------------ |
| GET    | `/produtos`            | ✅   | Listar produtos (com filtros)        |
| GET    | `/produtos/:id`        | ✅   | Obter produto por ID                 |
| POST   | `/produtos`            | ✅   | Criar produto (com upload de imagem) |
| PUT    | `/produtos/:id`        | ✅   | Atualizar produto (com novo upload)  |
| PUT    | `/produtos/:id/status` | ✅   | Alterar status (ativo/inativo)       |
| DELETE | `/produtos/:id`        | ✅   | Deletar produto                      |

---

## 🔑 Autenticação Requerida

✅ = Token JWT obrigatório  
❌ = Sem autenticação necessária

**Headers para requisições autenticadas:**

```
Authorization: Bearer {SEU_TOKEN_JWT}
```

---

## 📊 Tipos de Autenticação

### Sem Autenticação (❌)

- Listar categorias
- Obter categoria por ID
- Login
- Register
- Password Reset

### Com Autenticação (✅)

- Todas as rotas de produtos
- Todas as rotas de usuários (exceto login/register)

### Com Autenticação + Admin (✅ Admin)

- Criar categoria
- Atualizar categoria
- Deletar categoria
- Criar usuário
- Deletar usuário

---

## 🔄 Fluxo de Requisições Típico

```
1. POST /auth/login
   ↓ (recebe token)
2. GET /categorias (obter categorias disponíveis)
   ↓
3. POST /produtos (criar produto com categoria)
   ↓ (salva imagemUrl automaticamente no S3)
4. GET /produtos (listar produtos do usuário)
   ↓
5. PUT /produtos/:id (atualizar produto)
   ↓ (remove imagem antiga do S3, salva nova)
6. DELETE /produtos/:id (deletar produto)
   ↓ (remove imagem do S3)
```

---

## 📤 Formatos de Request/Response

### Formato JSON (Padrão)

```
Content-Type: application/json
```

**Exemplo:**

```json
{
  "nome": "Notebook",
  "precoVenda": 2500.0
}
```

### Formato Form Data (Para Upload)

```
Content-Type: multipart/form-data
```

**Exemplo (Insomnia):**

- nome: Notebook
- precoVenda: 2500.00
- imagem: [arquivo selecionado]

---

## ⚡ Quick Reference - Copie e Cole

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "senha": "Senha123"
  }'
```

### Listar Produtos

```bash
curl -X GET http://localhost:3000/produtos \
  -H "Authorization: Bearer {TOKEN}"
```

### Criar Produto

```bash
curl -X POST http://localhost:3000/produtos \
  -H "Authorization: Bearer {TOKEN}" \
  -F "nome=Notebook" \
  -F "precoVenda=2500" \
  -F "imagem=@/caminho/imagem.jpg"
```

### Deletar Produto

```bash
curl -X DELETE http://localhost:3000/produtos/1 \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🎯 Tabela Resumida

| Recurso    | Listar | Obter | Criar    | Atualizar | Deletar  |
| ---------- | ------ | ----- | -------- | --------- | -------- |
| Categorias | ❌     | ❌    | ✅ Admin | ✅ Admin  | ✅ Admin |
| Produtos   | ✅     | ✅    | ✅       | ✅        | ✅       |
| Usuários   | ✅     | ✅    | ✅ Admin | ✅        | ✅ Admin |

---

## 🚀 Endpoints por Feature

### Upload de Imagem

- `POST /produtos` (criar com imagem)
- `PUT /produtos/:id` (atualizar com nova imagem)

### Filtros

- `GET /produtos?nome=Notebook` (buscar por nome)
- `GET /produtos?categoriaId=1` (filtrar por categoria)
- `GET /produtos?ativo=true` (filtrar por status)

### Status

- `PUT /produtos/:id/status` (ativar/desativar produto)
- `PUT /user/:id/theme` (mudar tema do usuário)
- `PUT /user/:id/password` (alterar senha)

---

## 📌 Notas Importantes

1. **Token expira após:** Verificar no .env (geralmente 24h)
2. **Imagens S3:** Deletadas automaticamente ao trocar ou deletar produto
3. **Soft Delete:** Produto com vendas fica inativo, não deleta
4. **Validação:** Todos campos são validados pelo schema Zod
5. **Erro 401:** Significa token inválido ou expirado - faça login novamente

---

**Última atualização:** 21 de novembro de 2025

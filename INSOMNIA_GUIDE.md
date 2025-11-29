# 🧪 Guia Completo para Testar no Insomnia

## 📋 Índice

- [Autenticação](#autenticação)
- [Categorias](#categorias)
- [Produtos](#produtos)
- [Usuários](#usuários)

---

## 🔐 Autenticação

### 1. Login (Obter Token)

**Método:** `POST`  
**URL:** `http://localhost:3000/auth/login`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "senha": "Senha123"
}
```

**Resposta (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

💡 **Salve o token para usar em outras requisições!**

---

## 📂 CATEGORIAS

### 1. Listar Todas as Categorias

**Método:** `GET`  
**URL:** `http://localhost:3000/categorias`  
**Headers:** (Público, mas pode usar token)

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral",
    "criadoEm": "2025-11-21T10:30:00Z"
  },
  {
    "id": 2,
    "nome": "Livros",
    "descricao": null,
    "criadoEm": "2025-11-21T10:35:00Z"
  }
]
```

---

### 2. Obter Categoria por ID

**Método:** `GET`  
**URL:** `http://localhost:3000/categorias/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral",
  "criadoEm": "2025-11-21T10:30:00Z"
}
```

---

### 3. Criar Categoria (Admin)

**Método:** `POST`  
**URL:** `http://localhost:3000/categorias`  
**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "nome": "Smartphones",
  "descricao": "Telefones celulares e acessórios"
}
```

**Resposta (201):**

```json
{
  "id": 3,
  "nome": "Smartphones",
  "descricao": "Telefones celulares e acessórios",
  "criadoEm": "2025-11-21T14:00:00Z"
}
```

---

### 4. Atualizar Categoria (Admin)

**Método:** `PUT`  
**URL:** `http://localhost:3000/categorias/1`  
**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "nome": "Eletrônicos Premium",
  "descricao": "Produtos eletrônicos de alta qualidade"
}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "Eletrônicos Premium",
  "descricao": "Produtos eletrônicos de alta qualidade",
  "criadoEm": "2025-11-21T10:30:00Z"
}
```

---

### 5. Deletar Categoria (Admin)

**Método:** `DELETE`  
**URL:** `http://localhost:3000/categorias/1`  
**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Resposta (200):**

```json
{
  "message": "Categoria deletada com sucesso."
}
```

⚠️ **Erro se houver produtos vinculados:**

```json
{
  "message": "Não é possível deletar uma categoria que possui produtos vinculados."
}
```

---

## 🛍️ PRODUTOS

### 1. Listar Produtos

**Método:** `GET`  
**URL:** `http://localhost:3000/produtos`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Query Parameters (Opcionais):**

```
?nome=Notebook&categoriaId=1&ativo=true
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "nome": "Notebook Dell XPS 15",
    "descricao": "Notebook de última geração",
    "categoriaId": 1,
    "categoria": {
      "id": 1,
      "nome": "Eletrônicos"
    },
    "precoVenda": 2500.5,
    "precoCompra": 1800.0,
    "precoPromocional": 2200.0,
    "estoque": 5,
    "ativo": true,
    "imagem": "https://bucket.s3.region.amazonaws.com/usuarios/1/...",
    "usuarioId": 1,
    "criadoEm": "2025-11-21T10:00:00Z",
    "atualizadoEm": "2025-11-21T10:00:00Z"
  }
]
```

---

### 2. Obter Produto por ID

**Método:** `GET`  
**URL:** `http://localhost:3000/produtos/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "Notebook Dell XPS 15",
  "descricao": "Notebook de última geração",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nome": "Eletrônicos"
  },
  "precoVenda": 2500.5,
  "precoCompra": 1800.0,
  "precoPromocional": 2200.0,
  "estoque": 5,
  "ativo": true,
  "imagem": "https://bucket.s3.region.amazonaws.com/...",
  "usuarioId": 1,
  "criadoEm": "2025-11-21T10:00:00Z",
  "atualizadoEm": "2025-11-21T10:00:00Z"
}
```

---

### 3. Criar Produto com Imagem

**Método:** `POST`  
**URL:** `http://localhost:3000/produtos`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data
```

**Body (Form Data):**

| Campo            | Tipo   | Valor                      | Obrigatório        |
| ---------------- | ------ | -------------------------- | ------------------ |
| nome             | Text   | Notebook Dell              | ✅ Sim             |
| descricao        | Text   | Notebook de última geração | ❌ Não             |
| categoriaId      | Number | 1                          | ❌ Não             |
| precoVenda       | Number | 2500.50                    | ✅ Sim             |
| precoCompra      | Number | 1800.00                    | ❌ Não             |
| precoPromocional | Number | 2200.00                    | ❌ Não             |
| estoqueInicial   | Number | 5                          | ❌ Não (padrão: 0) |
| imagem           | File   | (selecione arquivo)        | ❌ Não             |

**Passo a passo no Insomnia:**

1. Selecione `multipart/form-data` como Content-Type
2. Preencha os campos de texto
3. Para o campo "imagem", selecione `File` no dropdown
4. Clique em "Choose Files" e selecione uma imagem (JPEG, PNG, WebP, GIF)
5. Envie a requisição

**Resposta (201):**

```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "descricao": "Notebook de última geração",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nome": "Eletrônicos"
  },
  "precoVenda": 2500.5,
  "precoCompra": 1800.0,
  "precoPromocional": 2200.0,
  "estoque": 5,
  "ativo": true,
  "imagem": "https://bucket.s3.region.amazonaws.com/usuarios/1/produtos/Notebook_Dell/cover/uuid-filename.jpg",
  "usuarioId": 1,
  "criadoEm": "2025-11-21T14:00:00Z",
  "atualizadoEm": "2025-11-21T14:00:00Z"
}
```

---

### 4. Atualizar Produto com Nova Imagem

**Método:** `PUT`  
**URL:** `http://localhost:3000/produtos/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data
```

**Body (Form Data):**

| Campo            | Tipo   | Valor             | Obrigatório |
| ---------------- | ------ | ----------------- | ----------- |
| nome             | Text   | Notebook Dell Pro | ❌ Não      |
| descricao        | Text   | Novo descrição    | ❌ Não      |
| categoriaId      | Number | 1                 | ❌ Não      |
| precoVenda       | Number | 2800.00           | ❌ Não      |
| precoCompra      | Number | 1900.00           | ❌ Não      |
| precoPromocional | Number | 2500.00           | ❌ Não      |
| imagem           | File   | (nova imagem)     | ❌ Não      |

💡 **Se enviar nova imagem:**

- A imagem antiga é automaticamente deletada do S3
- A nova imagem é salva

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "Notebook Dell Pro",
  "descricao": "Novo descrição",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nome": "Eletrônicos"
  },
  "precoVenda": 2800.0,
  "precoCompra": 1900.0,
  "precoPromocional": 2500.0,
  "estoque": 5,
  "ativo": true,
  "imagem": "https://bucket.s3.region.amazonaws.com/usuarios/1/produtos/Notebook_Dell_Pro/cover/uuid-filename.jpg",
  "usuarioId": 1,
  "criadoEm": "2025-11-21T14:00:00Z",
  "atualizadoEm": "2025-11-21T15:30:00Z"
}
```

---

### 5. Alterar Status do Produto (Ativo/Inativo)

**Método:** `PUT`  
**URL:** `http://localhost:3000/produtos/1/status`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "ativo": false
}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "descricao": "Notebook de última geração",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nome": "Eletrônicos"
  },
  "precoVenda": 2500.5,
  "precoCompra": 1800.0,
  "precoPromocional": 2200.0,
  "estoque": 5,
  "ativo": false,
  "imagem": "https://bucket.s3.region.amazonaws.com/...",
  "usuarioId": 1,
  "criadoEm": "2025-11-21T14:00:00Z",
  "atualizadoEm": "2025-11-21T15:30:00Z"
}
```

---

### 6. Deletar Produto

**Método:** `DELETE`  
**URL:** `http://localhost:3000/produtos/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200) - Sem vinculações (Hard Delete):**

```json
{
  "message": "Produto deletado com sucesso."
}
```

**Resposta (200) - Com vinculações (Soft Delete):**

```json
{
  "message": "Produto marcado como inativo (possuía vendas/compras vinculadas)."
}
```

---

## 👤 USUÁRIOS

### 1. Listar Usuários

**Método:** `GET`  
**URL:** `http://localhost:3000/user`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "USER",
    "theme": "DARK",
    "ativo": true,
    "criadoEm": "2025-11-21T10:00:00Z"
  }
]
```

---

### 2. Obter Usuário por ID

**Método:** `GET`  
**URL:** `http://localhost:3000/user/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "theme": "DARK",
  "ativo": true,
  "criadoEm": "2025-11-21T10:00:00Z"
}
```

---

### 3. Criar Usuário (Admin)

**Método:** `POST`  
**URL:** `http://localhost:3000/user`  
**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "senha": "Senha123",
  "role": "USER",
  "theme": "LIGHT",
  "ativo": true
}
```

**Resposta (201):**

```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "role": "USER",
  "theme": "LIGHT",
  "ativo": true,
  "criadoEm": "2025-11-21T14:00:00Z"
}
```

---

### 4. Atualizar Usuário

**Método:** `PUT`  
**URL:** `http://localhost:3000/user/1`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "nome": "João Silva Novo",
  "email": "joao.novo@example.com",
  "role": "ADMIN"
}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "João Silva Novo",
  "email": "joao.novo@example.com",
  "role": "ADMIN",
  "theme": "DARK",
  "ativo": true,
  "criadoEm": "2025-11-21T10:00:00Z"
}
```

---

### 5. Atualizar Tema do Usuário

**Método:** `PUT`  
**URL:** `http://localhost:3000/user/1/theme`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "theme": "LIGHT"
}
```

**Resposta (200):**

```json
{
  "message": "Tema atualizado com sucesso.",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "USER",
    "theme": "LIGHT",
    "ativo": true,
    "criadoEm": "2025-11-21T10:00:00Z"
  }
}
```

---

### 6. Atualizar Senha

**Método:** `PUT`  
**URL:** `http://localhost:3000/user/1/password`  
**Headers:**

```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "oldPassword": "SenhaAtual123",
  "newPassword": "NovaSenha456"
}
```

**Resposta (200):**

```json
{
  "message": "Senha atualizada com sucesso."
}
```

---

### 7. Deletar Usuário (Admin)

**Método:** `DELETE`  
**URL:** `http://localhost:3000/user/1`  
**Headers:**

```
Authorization: Bearer {TOKEN_ADMIN}
```

**Resposta (200):**

```json
{
  "message": "Usuário deletado com sucesso."
}
```

---

### 8. Obter Perfil do Usuário Autenticado

**Método:** `GET`  
**URL:** `http://localhost:3000/user/profile`  
**Headers:**

```
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "theme": "DARK",
  "ativo": true,
  "criadoEm": "2025-11-21T10:00:00Z"
}
```

---

## ⚙️ Configuração no Insomnia

### Passo 1: Criar um Environment

1. Clique em **"Manage Environments"** (engrenagem)
2. Clique em **"Create"**
3. Nomeie como `Development`
4. Adicione as variáveis:

```json
{
  "base_url": "http://localhost:3000",
  "token": "",
  "token_admin": ""
}
```

### Passo 2: Usar Variáveis nas Requisições

Substitua URLs assim:

```
{{base_url}}/produtos
```

E adicione header:

```
Authorization: Bearer {{token}}
```

### Passo 3: Salvar Token após Login

Na requisição de login, após receber resposta:

1. Vá à aba **"Tests"**
2. Adicione:

```javascript
const response = JSON.parse(responseBody);
pm.environment.set("token", response.token);
```

### Passo 4: Organizar em Pastas

Crie pasta na collection:

- 📂 Autenticação
- 📂 Categorias
- 📂 Produtos
- 📂 Usuários

---

## 🐛 Tratamento de Erros Comuns

### 401 - Não Autenticado

```json
{
  "error": "Token não fornecido."
}
```

**Solução:** Faça login e use o token recebido

### 403 - Sem Permissão

```json
{
  "error": "Acesso negado. Privilégios insuficientes."
}
```

**Solução:** Use token de admin para operações restritas

### 400 - Erro de Validação

```json
{
  "message": "Erro de validação.",
  "errors": ["O nome do produto deve ter pelo menos 2 caracteres."]
}
```

**Solução:** Verifique os dados enviados

### 409 - Conflito

```json
{
  "message": "Produto com esse nome já existe para este usuário."
}
```

**Solução:** Use um nome diferente

### 404 - Não Encontrado

```json
{
  "message": "Produto não encontrado."
}
```

**Solução:** Verifique o ID informado

---

## 📝 Dicas Importantes

✅ Sempre faça login primeiro para obter o token
✅ Guarde os IDs das categorias criadas para vincular com produtos
✅ Ao atualizar produto com imagem, a imagem anterior é deletada automaticamente
✅ Não é possível deletar categoria que tem produtos
✅ Soft delete ocorre quando produto tem vendas/compras vinculadas
✅ Use filtros para buscar produtos por nome ou categoria
✅ A senha deve ter: mínimo 6 caracteres, 1 maiúscula, 1 minúscula, 1 número

---

## 🚀 Fluxo Completo de Teste

1. **Login** → Obter token
2. **Criar Categoria** → Obter ID da categoria
3. **Criar Produto** com:
   - Nome único
   - Categoria criada (opcional)
   - Imagem (opcional)
4. **Listar Produtos** com filtros
5. **Atualizar Produto** com nova imagem
6. **Alterar Status** para inativo
7. **Deletar Produto**

---

**Tudo pronto para testar! 🧪**

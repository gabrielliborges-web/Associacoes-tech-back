# 💰 Módulo de Despesas - Documentação Completa

## ✅ Estrutura Implementada

Todos os arquivos foram criados seguindo exatamente o padrão do projeto:

```
src/
├── controllers/
│   └── despesa.controller.ts            ✅ Controllers das rotas
├── docs/
│   └── despesa.docs.ts                  ✅ Documentação Swagger/OpenAPI
├── routes/
│   └── despesa.routes.ts                ✅ Definição das rotas HTTP
├── services/
│   └── despesa.service.ts               ✅ Lógica de negócio
├── validators/
│   └── despesa.schema.ts                ✅ Validação com Zod
└── app.ts                               ✅ Integração das rotas
```

## 📋 Funcionalidades Implementadas

### 1️⃣ **Service Layer** (`services/despesa.service.ts`)

Implementadas as seguintes funções:

- **`listDespesas(userId, filters?)`** - Lista despesas com filtros opcionais
- **`getDespesaById(id, userId)`** - Obtém uma despesa específica
- **`createDespesa(dto, userId)`** - Cria nova despesa e registra movimentação
- **`updateDespesa(id, dto, userId)`** - Atualiza despesa existente
- **`deleteDespesa(id, userId)`** - Deleta despesa e reverte movimentação

#### Regras de Negócio Implementadas:

✅ Valor deve ser maior que zero  
✅ Título obrigatório (min 3 caracteres)  
✅ Tipo obrigatório  
✅ Ao criar → registra movimentação financeira (entrada=false, tipo="despesa")  
✅ Ao atualizar → atualiza movimentação relacionada e recalcula saldos  
✅ Ao deletar → remove movimentação e recalcula saldos posteriores  
✅ Filtros: por tipo, data inicial/final, valor mínimo/máximo  
✅ Validação de permissão (usuário só vê suas despesas)  
✅ Async/Await para todas as operações  
✅ Tratamento de erros com status HTTP apropriados  
✅ Integração automática com MovimentacaoFinanceiraService

---

### 2️⃣ **Controller Layer** (`controllers/despesa.controller.ts`)

Implementados os seguintes métodos públicos:

- **`list(req, res)`** - Handle GET /despesas com filtros opcionais
- **`show(req, res)`** - Handle GET /despesas/:id
- **`create(req, res)`** - Handle POST /despesas
- **`update(req, res)`** - Handle PUT /despesas/:id
- **`delete(req, res)`** - Handle DELETE /despesas/:id

#### Recursos:

✅ Validação de schemas Zod em todas as rotas  
✅ Tratamento de erros com JSON padronizado  
✅ Diferenciação entre erros de validação (400), permissão (403) e não encontrado (404)  
✅ Try/catch em todos os métodos  
✅ Extração de userId do token JWT automaticamente  
✅ Sem lógica de negócio no controller

---

### 3️⃣ **Validators** (`validators/despesa.schema.ts`)

Criados os seguintes schemas Zod:

```typescript
-createDespesaSchema - // Para criação
  updateDespesaSchema - // Para atualização
  idParamSchema - // Para parâmetros de rota
  filtrosListagemSchema - // Para query params
  emptySchema; // Para requisições sem body
```

#### Validações:

✅ **Título**: String, min 3, max 100 caracteres (obrigatório na criação)  
✅ **Tipo**: String, obrigatório na criação, max 50 caracteres  
✅ **Valor**: Número positivo, deve ser > 0 (obrigatório na criação)  
✅ **Observação**: String, max 500 caracteres, opcional  
✅ **Data**: ISO 8601 format, opcional  
✅ **Filtros**: tipo, dataInicio, dataFim, valorMinimo, valorMaximo  
✅ Todos os campos são opcionais na atualização (update parcial)  
✅ Auto-conversão de tipos (string para number)

---

### 4️⃣ **Routes** (`routes/despesa.routes.ts`)

Rotas implementadas:

```
GET    /despesas              → list()   [Autenticado]
GET    /despesas/:id          → show()   [Autenticado]
POST   /despesas              → create() [Autenticado]
PUT    /despesas/:id          → update() [Autenticado]
DELETE /despesas/:id          → delete() [Autenticado]
```

#### Segurança:

✅ Todas as rotas protegidas com `requireAuth` middleware  
✅ Validação automática com schemas  
✅ Sem acesso a despesas de outros usuários  
✅ Verificação de permissão em show/update/delete

---

### 5️⃣ **Documentation** (`docs/despesa.docs.ts`)

Documentação OpenAPI/Swagger completa com:

✅ Schemas Despesa e DespesaDTO  
✅ Descrição detalhada de cada rota  
✅ Exemplos de request e response para cada endpoint  
✅ Documentação de query parameters com filtros  
✅ Documentação de path parameters  
✅ Exemplos de erro (validação, permissão, não encontrado)  
✅ Códigos de resposta (200, 201, 400, 401, 403, 404)  
✅ Segurança com Bearer Token  
✅ Descrição de impactos nas movimentações financeiras

---

## 🔄 Integração com MovimentacaoFinanceira

Quando uma despesa é criada, atualizada ou deletada:

**Criação:**

```typescript
tipo = "despesa";
entrada = false;
descricao = `Despesa - ${despesa.titulo}`;
valor = despesa.valor;
data = despesa.data;
referenciaId = despesa.id;
```

**Atualização:**

- Encontra movimentação com referenciaId = despesa.id e tipo = "despesa"
- Atualiza valor, descricao e data
- Recalcula saldoApos de todas as movimentações posteriores

**Deleção:**

- Remove a movimentação financeira relacionada
- Recalcula saldoApos de todas as movimentações posteriores

---

## 🔌 Integração no App

O arquivo `app.ts` foi atualizado com:

```typescript
import despesaRoutes from "./routes/despesa.routes";

// ...

app.use("/despesas", despesaRoutes);
```

---

## 📊 Endpoints Resumidos

| Método | Endpoint        | Auth | Descrição                            |
| ------ | --------------- | ---- | ------------------------------------ |
| GET    | `/despesas`     | ✅   | Lista despesas com filtros opcionais |
| GET    | `/despesas/:id` | ✅   | Obtém uma despesa específica         |
| POST   | `/despesas`     | ✅   | Cria nova despesa                    |
| PUT    | `/despesas/:id` | ✅   | Atualiza despesa existente           |
| DELETE | `/despesas/:id` | ✅   | Deleta despesa                       |

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
  "errors": ["Campo 1 inválido", "Campo 2 inválido"]
}
```

### Códigos de Status Implementados:

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou regras de negócio
- **401** - Não autenticado
- **403** - Sem permissão (despesa de outro usuário)
- **404** - Despesa não encontrada
- **500** - Erro interno do servidor

### Exemplos de Erro:

**Valor negativo:**

```json
{
  "message": "Erro de validação.",
  "errors": ["Valor deve ser maior que zero"]
}
```

**Título muito curto:**

```json
{
  "message": "Erro de validação.",
  "errors": ["Título deve ter no mínimo 3 caracteres"]
}
```

**Não autenticado:**

```json
{
  "message": "Token não fornecido ou inválido"
}
```

**Sem permissão:**

```json
{
  "message": "Você não tem permissão para acessar esta despesa"
}
```

**Não encontrado:**

```json
{
  "message": "Despesa não encontrada"
}
```

---

## 🗄️ Banco de Dados

Utiliza o modelo já existente no Prisma Schema:

```prisma
model Despesa {
  id          Int        @id @default(autoincrement())
  usuarioId   Int
  usuario     Usuario    @relation(fields: [usuarioId], references: [id])

  titulo      String
  tipo        String
  descricao   String?
  valor       Decimal    @db.Decimal(10,2)
  data        DateTime   @default(now())

  observacao  String?

  criadoEm    DateTime   @default(now())
}
```

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
✅ Tratamento automático de movimentações financeiras

---

## 🧪 Como Testar

### Listar todas as despesas:

```bash
GET /despesas
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "titulo": "Aluguel do escritório",
    "tipo": "Aluguel",
    "valor": 2500.0,
    "descricao": "Pagamento de novembro",
    "data": "2025-11-21T10:30:00Z",
    "criadoEm": "2025-11-21T09:00:00Z"
  },
  {
    "id": 2,
    "titulo": "Energia elétrica",
    "tipo": "Utilidades",
    "valor": 850.5,
    "descricao": null,
    "data": "2025-11-15T14:20:00Z",
    "criadoEm": "2025-11-15T08:30:00Z"
  }
]
```

### Listar com filtros:

```bash
GET /despesas?tipo=Aluguel&valorMinimo=1000&valorMaximo=5000
Authorization: Bearer {TOKEN}
```

### Filtrar por data:

```bash
GET /despesas?dataInicio=2025-11-01T00:00:00Z&dataFim=2025-11-30T23:59:59Z
Authorization: Bearer {TOKEN}
```

### Obter despesa específica:

```bash
GET /despesas/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "id": 1,
  "titulo": "Aluguel do escritório",
  "tipo": "Aluguel",
  "valor": 2500.0,
  "descricao": "Pagamento de novembro",
  "data": "2025-11-21T10:30:00Z",
  "criadoEm": "2025-11-21T09:00:00Z"
}
```

### Criar nova despesa:

```bash
POST /despesas
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "titulo": "Aluguel do escritório",
  "tipo": "Aluguel",
  "valor": 2500.00,
  "descricao": "Pagamento de novembro"
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "titulo": "Aluguel do escritório",
  "tipo": "Aluguel",
  "valor": 2500.0,
  "descricao": "Pagamento de novembro",
  "data": "2025-11-21T09:00:00Z",
  "criadoEm": "2025-11-21T09:00:00Z"
}
```

**Também cria movimentação financeira:**

```json
{
  "id": 1,
  "tipo": "despesa",
  "entrada": false,
  "descricao": "Despesa - Aluguel do escritório",
  "valor": 2500.0,
  "data": "2025-11-21T09:00:00Z"
}
```

### Atualizar apenas título:

```bash
PUT /despesas/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "titulo": "Aluguel - Novo Escritório"
}
```

**Resposta (200):**

```json
{
  "id": 1,
  "titulo": "Aluguel - Novo Escritório",
  "tipo": "Aluguel",
  "valor": 2500.0,
  "descricao": "Pagamento de novembro",
  "data": "2025-11-21T10:30:00Z",
  "criadoEm": "2025-11-21T09:00:00Z"
}
```

### Atualizar valor e observação:

```bash
PUT /despesas/1
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "valor": 3000.00,
  "descricao": "Novo contrato com reajuste"
}
```

### Deletar despesa:

```bash
DELETE /despesas/1
Authorization: Bearer {TOKEN}
```

**Resposta (200):**

```json
{
  "message": "Despesa deletada com sucesso",
  "id": 1
}
```

**Também remove movimentação financeira relacionada**

### Erro - Valor negativo:

```bash
POST /despesas
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "titulo": "Aluguel",
  "tipo": "Aluguel",
  "valor": -100
}
```

**Resposta (400):**

```json
{
  "message": "Erro de validação.",
  "errors": ["Valor deve ser maior que zero"]
}
```

### Erro - Título muito curto:

```bash
POST /despesas
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "titulo": "Al",
  "tipo": "Aluguel",
  "valor": 2500
}
```

**Resposta (400):**

```json
{
  "message": "Erro de validação.",
  "errors": ["Título deve ter no mínimo 3 caracteres"]
}
```

### Erro - Sem autorização:

```bash
GET /despesas/999
```

**Resposta (401):**

```json
{
  "message": "Token não fornecido ou inválido"
}
```

### Erro - Despesa não encontrada:

```bash
GET /despesas/999
Authorization: Bearer {TOKEN}
```

**Resposta (404):**

```json
{
  "message": "Despesa não encontrada"
}
```

### Erro - Sem permissão (despesa de outro usuário):

```bash
GET /despesas/1
Authorization: Bearer {TOKEN_OUTRO_USUARIO}
```

**Resposta (403):**

```json
{
  "message": "Você não tem permissão para acessar esta despesa"
}
```

---

## 📝 Observações Importantes

1. **Movimentação Financeira Automática**:

   - Ao criar despesa → registra saída em MovimentacaoFinanceira
   - Ao atualizar → atualiza movimentação relacionada
   - Ao deletar → remove movimentação e recalcula saldos

2. **Filtros Opcionais**:

   - Todos os filtros são opcionais
   - Podem ser combinados
   - Data deve estar em ISO 8601 format
   - Valor pode ter até 2 casas decimais

3. **Permissões**:

   - Usuário só vê suas próprias despesas
   - Usuário só pode editar/deletar suas despesas
   - Sem permissão retorna 403

4. **Validações**:

   - Título: 3-100 caracteres
   - Tipo: obrigatório, max 50 caracteres
   - Valor: > 0
   - Observação: max 500 caracteres

5. **Update Parcial**:

   - Todos os campos são opcionais em PUT
   - Apenas campos fornecidos são atualizados
   - Campos não fornecidos mantêm valores anteriores

6. **Data**:

   - Se não fornecida, usa data/hora atual
   - Formato: ISO 8601 (2025-11-21T10:30:00Z)
   - Importante: UTC esperado

7. **Integração com Extrato**:

   - Despesa criada → MovimentacaoFinanceira com entrada=false
   - Aparece no extrato como "Despesa - {titulo}"
   - Afeta cálculo de saldo do período

8. **Documentação Swagger**: Disponível em `/api-docs`

---

## ✅ Checklist de Implementação

- [x] Service com 5 funções (list, get, create, update, delete)
- [x] Controller com 5 métodos públicos
- [x] Validators com 5 schemas Zod
- [x] Routes com 5 endpoints HTTP
- [x] Documentação Swagger completa
- [x] Integração no app.ts
- [x] Proteção com authMiddleware
- [x] Validação de título (min 3 caracteres)
- [x] Validação de tipo (obrigatório)
- [x] Validação de valor (> 0)
- [x] Filtros por tipo/data/valor
- [x] Update parcial suportado
- [x] Criação de movimentação financeira
- [x] Atualização de movimentação ao editar
- [x] Deleção de movimentação ao deletar
- [x] Recálculo de saldos posteriores
- [x] Tratamento de erros padronizado
- [x] Validação de permissão de usuário
- [x] Async/Await em todas operações
- [x] Prisma Client para BD
- [x] Sem retorno de dados sensíveis
- [x] Padrão consistente com módulos existentes

---

**Módulo de Despesas implementado com sucesso! 🎉**

Com suporte completo a CRUD, filtros, integração automática com movimentações financeiras e documentação OpenAPI/Swagger.

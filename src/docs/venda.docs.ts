/**
 * @swagger
 * tags:
 *   - name: Vendas
 *     description: Operações relacionadas a vendas de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Venda:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         formaPagamento:
 *           type: string
 *           example: "pix"
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T10:00:00Z"
 *         total:
 *           type: number
 *           format: decimal
 *           example: 79.70
 *         descricao:
 *           type: string
 *           example: "Cliente fiel"
 *         usuarioId:
 *           type: integer
 *           example: 1
 *         usuario:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T15:30:00Z"
 *
 *     ItemVenda:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quantidade:
 *           type: integer
 *           example: 2
 *         precoUnit:
 *           type: number
 *           format: decimal
 *           example: 19.90
 *         produtoId:
 *           type: integer
 *           example: 1
 *         produto:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nome:
 *               type: string
 *             descricao:
 *               type: string
 *             estoque:
 *               type: integer
 *
 *     CreateVendaDTO:
 *       type: object
 *       required:
 *         - formaPagamento
 *         - itens
 *       properties:
 *         formaPagamento:
 *           type: string
 *           description: "Forma de pagamento (ex: pix, dinheiro, cartao)"
 *           example: "pix"
 *         descricao:
 *           type: string
 *           description: "Observação opcional sobre a venda"
 *           example: "Cliente fiel"
 *         data:
 *           type: string
 *           format: date-time
 *           description: "Data da venda (opcional, padrão: agora)"
 *           example: "2025-11-21T10:00:00Z"
 *         itens:
 *           type: array
 *           minItems: 1
 *           description: "Itens da venda (mínimo 1)"
 *           items:
 *             type: object
 *             required:
 *               - produtoId
 *               - quantidade
 *               - precoUnit
 *             properties:
 *               produtoId:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 example: 2
 *               precoUnit:
 *                 type: number
 *                 format: decimal
 *                 description: "Preço unitário no momento da venda"
 *                 example: 19.90
 *
 *     CancelVendaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Venda cancelada e estoque revertido com sucesso."
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /vendas:
 *   get:
 *     summary: Lista todas as vendas
 *     description: Retorna uma lista de todas as vendas com filtros opcionais. Apenas vendas do usuário autenticado são retornadas.
 *     tags:
 *       - Vendas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: dataInicio
 *         in: query
 *         description: Data inicial da venda (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T00:00:00Z"
 *       - name: dataFim
 *         in: query
 *         description: Data final da venda (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-11-30T23:59:59Z"
 *       - name: formaPagamento
 *         in: query
 *         description: Forma de pagamento (busca parcial case-insensitive)
 *         schema:
 *           type: string
 *           example: "pix"
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venda'
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /vendas/{id}:
 *   get:
 *     summary: Obtém uma venda específica
 *     description: Retorna os detalhes de uma venda incluindo todos os seus itens e informações do produto.
 *     tags:
 *       - Vendas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da venda
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Venda obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 formaPagamento:
 *                   type: string
 *                   example: "pix"
 *                 data:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:00:00Z"
 *                 total:
 *                   type: number
 *                   format: decimal
 *                   example: 79.70
 *                 descricao:
 *                   type: string
 *                   example: "Cliente fiel"
 *                 usuarioId:
 *                   type: integer
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                 itens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ItemVenda'
 *                   example:
 *                     - id: 1
 *                       quantidade: 2
 *                       precoUnit: 19.90
 *                       produtoId: 1
 *                       produto:
 *                         id: 1
 *                         nome: "Notebook Dell"
 *                         descricao: "Notebook potente"
 *                         estoque: 8
 *                     - id: 2
 *                       quantidade: 1
 *                       precoUnit: 39.90
 *                       produtoId: 2
 *                       produto:
 *                         id: 2
 *                         nome: "Monitor LG"
 *                         descricao: "Monitor 24 polegadas"
 *                         estoque: 4
 *       400:
 *         description: Erro de validação (ID inválido)
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Venda não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /vendas:
 *   post:
 *     summary: Cria uma nova venda
 *     description: |
 *       Cria uma nova venda com múltiplos itens. Automaticamente:
 *       - Valida existência e disponibilidade dos produtos
 *       - Verifica estoque suficiente para cada item
 *       - Calcula o total da venda
 *       - Decrementa o estoque de cada produto
 *       - Registra movimentação financeira (entrada)
 *
 *       **Processo automático:**
 *       1. Validação de produtos e estoque
 *       2. Criação da Venda e ItemVenda[]
 *       3. Atualização de estoque (decrement)
 *       4. Criação de MovimentacaoFinanceira (entrada: true)
 *     tags:
 *       - Vendas
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVendaDTO'
 *           examples:
 *             simples:
 *               summary: Venda com um item
 *               value:
 *                 formaPagamento: "pix"
 *                 descricao: "Cliente fiel"
 *                 itens:
 *                   - produtoId: 1
 *                     quantidade: 2
 *                     precoUnit: 19.90
 *             multiplos:
 *               summary: Venda com múltiplos itens
 *               value:
 *                 formaPagamento: "cartao"
 *                 descricao: "Pedido corporativo"
 *                 data: "2025-11-21T10:00:00Z"
 *                 itens:
 *                   - produtoId: 1
 *                     quantidade: 2
 *                     precoUnit: 19.90
 *                   - produtoId: 2
 *                     quantidade: 1
 *                     precoUnit: 39.90
 *                   - produtoId: 3
 *                     quantidade: 5
 *                     precoUnit: 9.99
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 formaPagamento:
 *                   type: string
 *                   example: "pix"
 *                 data:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:00:00Z"
 *                 total:
 *                   type: number
 *                   format: decimal
 *                   example: 79.70
 *                   description: "Calculado automaticamente: sum(quantidade × precoUnit)"
 *                 descricao:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                 itens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ItemVenda'
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro de validação ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *             examples:
 *               estoque_insuficiente:
 *                 value:
 *                   message: "Estoque insuficiente do produto \"Notebook Dell\". Disponível: 5, solicitado: 10."
 *               produto_nao_encontrado:
 *                 value:
 *                   message: "Produto com ID 999 não encontrado."
 *               produto_inativo:
 *                 value:
 *                   message: "Produto \"Notebook Dell\" não está disponível."
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /vendas/{id}/cancelar:
 *   post:
 *     summary: Cancela uma venda
 *     description: |
 *       Cancela uma venda existente. Automaticamente:
 *       - Reverte o estoque de todos os itens (incrementa)
 *       - Registra movimentação financeira de reversão (saída)
 *       - Remove a venda do sistema
 *
 *       **Processo automático:**
 *       1. Verificação da venda
 *       2. Atualização de estoque (increment)
 *       3. Criação de MovimentacaoFinanceira reversa (entrada: false)
 *       4. Deleção da venda (cascade deleta ItemVenda)
 *     tags:
 *       - Vendas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da venda a cancelar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Venda cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venda cancelada e estoque revertido com sucesso."
 *                 venda:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     formaPagamento:
 *                       type: string
 *                       example: "pix"
 *                     data:
 *                       type: string
 *                       format: date-time
 *                     total:
 *                       type: number
 *                       format: decimal
 *                     descricao:
 *                       type: string
 *                     usuarioId:
 *                       type: integer
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para cancelar esta venda
 *       404:
 *         description: Venda não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

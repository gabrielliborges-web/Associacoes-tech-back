/**
 * @swagger
 * tags:
 *   - name: Entradas Financeiras
 *     description: Operações relacionadas a entradas financeiras do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EntradaFinanceira:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           example: "aporte"
 *         valor:
 *           type: number
 *           format: decimal
 *           example: 500.00
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-02-01T10:00:00Z"
 *         descricao:
 *           type: string
 *           example: "Aporte de capital"
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
 *     CreateEntradaFinanceiraDTO:
 *       type: object
 *       required:
 *         - tipo
 *         - valor
 *       properties:
 *         tipo:
 *           type: string
 *           description: "Tipo de entrada (ex: aporte, reembolso, serviço, outro)"
 *           example: "aporte"
 *         valor:
 *           type: number
 *           format: decimal
 *           description: "Valor da entrada (deve ser maior que zero)"
 *           example: 500.00
 *         descricao:
 *           type: string
 *           description: "Observação opcional"
 *           example: "Aporte de capital"
 *         data:
 *           type: string
 *           format: date-time
 *           description: "Data da entrada (opcional, padrão: agora)"
 *           example: "2025-02-01T10:00:00Z"
 *
 *     UpdateEntradaFinanceiraDTO:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *           description: "Tipo de entrada (opcional)"
 *           example: "reembolso"
 *         valor:
 *           type: number
 *           format: decimal
 *           description: "Valor da entrada (opcional, deve ser maior que zero)"
 *           example: 750.00
 *         descricao:
 *           type: string
 *           description: "Observação opcional"
 *           example: "Reembolso de despesa"
 *         data:
 *           type: string
 *           format: date-time
 *           description: "Data da entrada (opcional)"
 *           example: "2025-02-02T10:00:00Z"
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /entradas:
 *   get:
 *     summary: Lista todas as entradas financeiras
 *     description: Retorna uma lista de todas as entradas financeiras com filtros opcionais. Apenas entradas do usuário autenticado são retornadas.
 *     tags:
 *       - Entradas Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tipo
 *         in: query
 *         description: Tipo de entrada (busca parcial case-insensitive)
 *         schema:
 *           type: string
 *           example: "aporte"
 *       - name: dataInicio
 *         in: query
 *         description: Data inicial (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-02-01T00:00:00Z"
 *       - name: dataFim
 *         in: query
 *         description: Data final (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-02-28T23:59:59Z"
 *     responses:
 *       200:
 *         description: Lista de entradas financeiras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EntradaFinanceira'
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /entradas/{id}:
 *   get:
 *     summary: Obtém uma entrada financeira específica
 *     description: Retorna os detalhes de uma entrada financeira incluindo informações do usuário.
 *     tags:
 *       - Entradas Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da entrada financeira
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Entrada financeira obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntradaFinanceira'
 *       400:
 *         description: Erro de validação (ID inválido)
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Entrada financeira não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /entradas:
 *   post:
 *     summary: Cria uma nova entrada financeira
 *     description: |
 *       Cria uma nova entrada financeira. Automaticamente:
 *       - Valida o valor (deve ser maior que zero)
 *       - Cria a Entrada Financeira
 *       - Registra movimentação financeira (entrada positiva)
 *
 *       **Processo automático:**
 *       1. Validação de valor
 *       2. Criação da EntradaFinanceira
 *       3. Criação de MovimentacaoFinanceira (entrada: true)
 *     tags:
 *       - Entradas Financeiras
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEntradaFinanceiraDTO'
 *           examples:
 *             aporte:
 *               summary: Aporte de capital
 *               value:
 *                 tipo: "aporte"
 *                 valor: 500.00
 *                 descricao: "Aporte de capital"
 *                 data: "2025-02-01T10:00:00Z"
 *             reembolso:
 *               summary: Reembolso de despesa
 *               value:
 *                 tipo: "reembolso"
 *                 valor: 150.50
 *                 descricao: "Reembolso de combustível"
 *             servico:
 *               summary: Serviço prestado
 *               value:
 *                 tipo: "serviço"
 *                 valor: 1200.00
 *                 descricao: "Serviço de consultoria"
 *     responses:
 *       201:
 *         description: Entrada financeira criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntradaFinanceira'
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
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /entradas/{id}:
 *   put:
 *     summary: Atualiza uma entrada financeira
 *     description: |
 *       Atualiza os dados de uma entrada financeira existente. Se o valor for alterado, a movimentação associada é atualizada automaticamente.
 *     tags:
 *       - Entradas Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da entrada financeira
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEntradaFinanceiraDTO'
 *           examples:
 *             alterarValor:
 *               summary: Alterar valor
 *               value:
 *                 valor: 750.00
 *             alterarTipo:
 *               summary: Alterar tipo
 *               value:
 *                 tipo: "reembolso"
 *             alterardescricao:
 *               summary: Alterar observação
 *               value:
 *                 descricao: "Aporte corrigido"
 *     responses:
 *       200:
 *         description: Entrada financeira atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntradaFinanceira'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para editar esta entrada
 *       404:
 *         description: Entrada financeira não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /entradas/{id}:
 *   delete:
 *     summary: Deleta uma entrada financeira
 *     description: |
 *       Deleta uma entrada financeira existente. Automaticamente:
 *       - Remove a entrada do sistema
 *       - Registra uma movimentação de reversão (saída)
 *
 *       **Processo automático:**
 *       1. Verificação da entrada
 *       2. Criação de MovimentacaoFinanceira reversa (entrada: false)
 *       3. Deleção da entrada financeira
 *     tags:
 *       - Entradas Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da entrada a deletar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Entrada financeira deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entrada financeira deletada com sucesso."
 *                 entrada:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     tipo:
 *                       type: string
 *                     valor:
 *                       type: number
 *                     data:
 *                       type: string
 *                       format: date-time
 *                     descricao:
 *                       type: string
 *                     usuarioId:
 *                       type: integer
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para deletar esta entrada
 *       404:
 *         description: Entrada financeira não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

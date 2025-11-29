/**
 * @swagger
 * components:
 *   schemas:
 *     Despesa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Aluguel do escritório"
 *         tipo:
 *           type: string
 *           example: "Aluguel"
 *         valor:
 *           type: number
 *           format: decimal
 *           example: 2500.00
 *         descricao:
 *           type: string
 *           example: "Pagamento referente ao mês de novembro"
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T10:30:00Z"
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T09:00:00Z"
 *
 *     DespesaDTO:
 *       type: object
 *       required:
 *         - titulo
 *         - tipo
 *         - valor
 *       properties:
 *         titulo:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "Aluguel do escritório"
 *         tipo:
 *           type: string
 *           example: "Aluguel"
 *         valor:
 *           type: number
 *           format: decimal
 *           example: 2500.00
 *         descricao:
 *           type: string
 *           maxLength: 500
 *           example: "Pagamento do mês de novembro"
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T10:30:00Z"
 *
 * /despesas:
 *   get:
 *     summary: Lista todas as despesas do usuário
 *     description: |
 *       Retorna uma lista de todas as despesas do usuário autenticado.
 *       Permite filtrar por tipo, data, valor mínimo e máximo.
 *     tags:
 *       - Despesas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de despesa
 *         example: "Aluguel"
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtro (ISO 8601)
 *         example: "2025-11-01T00:00:00Z"
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtro (ISO 8601)
 *         example: "2025-11-30T23:59:59Z"
 *       - in: query
 *         name: valorMinimo
 *         schema:
 *           type: number
 *         description: Valor mínimo da despesa
 *         example: 1000
 *       - in: query
 *         name: valorMaximo
 *         schema:
 *           type: number
 *         description: Valor máximo da despesa
 *         example: 5000
 *     responses:
 *       200:
 *         description: Lista de despesas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Despesa'
 *             example:
 *               - id: 1
 *                 titulo: "Aluguel do escritório"
 *                 tipo: "Aluguel"
 *                 valor: 2500.00
 *                 descricao: "Pagamento de novembro"
 *                 data: "2025-11-21T10:30:00Z"
 *                 criadoEm: "2025-11-21T09:00:00Z"
 *               - id: 2
 *                 titulo: "Energia elétrica"
 *                 tipo: "Utilidades"
 *                 valor: 850.50
 *                 descricao: null
 *                 data: "2025-11-15T14:20:00Z"
 *                 criadoEm: "2025-11-15T08:30:00Z"
 *       400:
 *         description: Erro na validação dos filtros
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido ou inválido"
 *
 *   post:
 *     summary: Cria uma nova despesa
 *     description: |
 *       Cria uma nova despesa para o usuário autenticado.
 *       Também registra automaticamente uma movimentação financeira de saída.
 *     tags:
 *       - Despesas
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DespesaDTO'
 *           examples:
 *             basico:
 *               summary: Exemplo básico
 *               value:
 *                 titulo: "Aluguel do escritório"
 *                 tipo: "Aluguel"
 *                 valor: 2500.00
 *             completo:
 *               summary: Exemplo completo
 *               value:
 *                 titulo: "Aluguel do escritório"
 *                 tipo: "Aluguel"
 *                 valor: 2500.00
 *                 descricao: "Pagamento do mês de novembro"
 *                 data: "2025-11-21T10:30:00Z"
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Despesa'
 *             example:
 *               id: 1
 *               titulo: "Aluguel do escritório"
 *               tipo: "Aluguel"
 *               valor: 2500.00
 *               descricao: "Pagamento do mês de novembro"
 *               data: "2025-11-21T10:30:00Z"
 *               criadoEm: "2025-11-21T09:00:00Z"
 *       400:
 *         description: Erro de validação ou regra de negócio
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
 *               titleTooShort:
 *                 value:
 *                   message: "Erro de validação."
 *                   errors: ["Título deve ter no mínimo 3 caracteres"]
 *               negativoValue:
 *                 value:
 *                   message: "Erro de validação."
 *                   errors: ["Valor deve ser maior que zero"]
 *               required:
 *                 value:
 *                   message: "Erro de validação."
 *                   errors: ["Título é obrigatório", "Tipo é obrigatório"]
 *       401:
 *         description: Não autenticado
 *
 * /despesas/{id}:
 *   get:
 *     summary: Obtém uma despesa específica
 *     description: Retorna os detalhes de uma despesa pelo ID
 *     tags:
 *       - Despesas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da despesa
 *         example: 1
 *     responses:
 *       200:
 *         description: Despesa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Despesa'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para acessar esta despesa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Você não tem permissão para acessar esta despesa"
 *       404:
 *         description: Despesa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Despesa não encontrada"
 *
 *   put:
 *     summary: Atualiza uma despesa
 *     description: |
 *       Atualiza uma despesa existente.
 *       Todos os campos são opcionais (update parcial).
 *       Também atualiza a movimentação financeira relacionada se houver.
 *     tags:
 *       - Despesas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da despesa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DespesaDTO'
 *           examples:
 *             updateTitulo:
 *               summary: Atualizar apenas título
 *               value:
 *                 titulo: "Aluguel - Novo Escritório"
 *             updateValor:
 *               summary: Atualizar apenas valor
 *               value:
 *                 valor: 3000.00
 *             updateMultiplo:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 titulo: "Aluguel - Novo Escritório"
 *                 valor: 3000.00
 *                 descricao: "Novo contrato"
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Despesa'
 *       400:
 *         description: Erro de validação ou regra de negócio
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
 *       403:
 *         description: Sem permissão para atualizar esta despesa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Despesa não encontrada
 *
 *   delete:
 *     summary: Deleta uma despesa
 *     description: |
 *       Deleta uma despesa do sistema.
 *       Também remove a movimentação financeira relacionada e recalcula saldos.
 *     tags:
 *       - Despesas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da despesa
 *         example: 1
 *     responses:
 *       200:
 *         description: Despesa deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Despesa deletada com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para deletar esta despesa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Despesa não encontrada
 */

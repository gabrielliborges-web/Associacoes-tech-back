/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Lista todas as compras do usuário
 *     description: Retorna uma lista com todas as compras cadastradas pelo usuário autenticado, com filtros opcionais
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtro (ISO 8601)
 *         example: 2025-11-01T00:00:00Z
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtro (ISO 8601)
 *         example: 2025-11-30T23:59:59Z
 *       - in: query
 *         name: fornecedor
 *         schema:
 *           type: string
 *         description: Filtrar por nome do fornecedor (busca parcial)
 *         example: Fornecedor XYZ
 *     responses:
 *       200:
 *         description: Lista de compras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   fornecedor:
 *                     type: string
 *                     nullable: true
 *                     example: Fornecedor ABC
 *                   data:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-11-21T10:00:00Z
 *                   total:
 *                     type: number
 *                     example: 5000.00
 *                   descricao:
 *                     type: string
 *                     nullable: true
 *                   usuarioId:
 *                     type: number
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                   itens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         quantidade:
 *                           type: number
 *                         custoUnit:
 *                           type: number
 *                         produtoId:
 *                           type: number
 *                         produto:
 *                           type: object
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Obtém uma compra pelo ID
 *     description: Retorna os dados detalhados de uma compra específica com seus itens
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 fornecedor:
 *                   type: string
 *                   nullable: true
 *                   example: Fornecedor ABC
 *                 data:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-11-21T10:00:00Z
 *                 total:
 *                   type: number
 *                   example: 5000.00
 *                 descricao:
 *                   type: string
 *                   nullable: true
 *                 usuarioId:
 *                   type: number
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                 itens:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       quantidade:
 *                         type: number
 *                         example: 10
 *                       custoUnit:
 *                         type: number
 *                         example: 500.00
 *                       produtoId:
 *                         type: number
 *                       produto:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nome:
 *                             type: string
 *                           descricao:
 *                             type: string
 *                           estoque:
 *                             type: number
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Compra não encontrada
 */

/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Cria uma nova compra com itens
 *     description: >
 *       Registra uma nova compra no sistema com múltiplos itens.
 *       <br><br>
 *       Automaticamente:
 *       - Calcula o total (soma de custoUnit × quantidade)
 *       - Atualiza o estoque dos produtos
 *       - Cria uma movimentação financeira (saída de dinheiro)
 *       <br><br>
 *       Validações:
 *       - Todos os produtos devem existir e estar ativos
 *       - Quantidade e custo devem ser maiores que zero
 *       - Mínimo um item na compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itens
 *             properties:
 *               fornecedor:
 *                 type: string
 *                 maxLength: 150
 *                 example: Fornecedor ABC LTDA
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-21T10:00:00Z
 *               descricao:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Compra de estoque mensal
 *               itens:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - produtoId
 *                     - quantidade
 *                     - custoUnit
 *                   properties:
 *                     produtoId:
 *                       type: number
 *                       example: 1
 *                     quantidade:
 *                       type: number
 *                       example: 10
 *                     custoUnit:
 *                       type: number
 *                       example: 500.00
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 fornecedor:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   type: string
 *                   format: date-time
 *                 total:
 *                   type: number
 *                   example: 5000.00
 *                 descricao:
 *                   type: string
 *                 usuarioId:
 *                   type: number
 *                 usuario:
 *                   type: object
 *                 itens:
 *                   type: array
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
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Um dos produtos não foi encontrado
 */

/**
 * @swagger
 * /compras/{id}:
 *   delete:
 *     summary: Deleta uma compra e reverte o estoque
 *     description: >
 *       Remove uma compra do sistema.
 *       <br><br>
 *       Automaticamente:
 *       - Reverte o estoque dos produtos (subtrai as quantidades adicionadas)
 *       - Cria uma movimentação financeira reversa (entrada de dinheiro)
 *       - Deleta a compra e seus itens
 *       <br><br>
 *       **Validações importantes:**
 *       - Verifica se há estoque suficiente para reverter
 *       - Executa tudo em transação (tudo ou nada)
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra deletada e estoque revertido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra deletada e estoque revertido com sucesso.
 *       400:
 *         description: >
 *           ID inválido ou estoque insuficiente para reverter
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Compra não encontrada
 */

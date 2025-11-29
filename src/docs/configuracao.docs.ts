/**
 * @swagger
 * tags:
 *   - name: Configurações
 *     description: Operações relacionadas às configurações do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Configuracao:
 *       type: object
 *       properties:
 *         saldoInicial:
 *           type: number
 *           format: decimal
 *           example: 2000.00
 *           description: "Saldo inicial do sistema (padrão: 0)"
 *         mesAtual:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 4
 *           description: "Mês atual (1-12)"
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           example: "2025-04-01T00:00:00.000Z"
 *
 *     UpdateConfiguracaoDTO:
 *       type: object
 *       properties:
 *         saldoInicial:
 *           type: number
 *           format: decimal
 *           description: "Novo saldo inicial (deve ser ≥ 0)"
 *           example: 5000.00
 *         mesAtual:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: "Novo mês atual (1-12)"
 *           example: 5
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Obtém as configurações atuais
 *     description: |
 *       Retorna as configurações do sistema. Se não existirem, cria automaticamente com valores padrão:
 *       - saldoInicial: 0
 *       - mesAtual: mês atual
 *     tags:
 *       - Configurações
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuracao'
 *             example:
 *               saldoInicial: 2000.00
 *               mesAtual: 4
 *               criadoEm: "2025-04-01T00:00:00.000Z"
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /config:
 *   put:
 *     summary: Atualiza as configurações
 *     description: |
 *       Atualiza as configurações do sistema. Garantias:
 *       - Apenas uma linha de configuração existe no banco
 *       - saldoInicial não pode ser negativo
 *       - mesAtual deve estar entre 1 e 12
 *       - Movimentações antigas NÃO são recalculadas
 *       - Novo saldoInicial influencia apenas saldos futuros
 *     tags:
 *       - Configurações
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateConfiguracaoDTO'
 *           examples:
 *             saldoInicial:
 *               summary: Atualizar saldo inicial
 *               value:
 *                 saldoInicial: 5000.00
 *             mesAtual:
 *               summary: Atualizar mês atual
 *               value:
 *                 mesAtual: 5
 *             ambos:
 *               summary: Atualizar ambos
 *               value:
 *                 saldoInicial: 5000.00
 *                 mesAtual: 5
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuracao'
 *             example:
 *               saldoInicial: 5000.00
 *               mesAtual: 5
 *               criadoEm: "2025-04-01T00:00:00.000Z"
 *       400:
 *         description: Erro de validação
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
 *               saldoNegativo:
 *                 value:
 *                   message: "Erro de validação."
 *                   errors: ["Saldo inicial não pode ser negativo."]
 *               mesInvalido:
 *                 value:
 *                   message: "Erro de validação."
 *                   errors: ["Mês deve estar entre 1 e 12."]
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

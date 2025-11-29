/**
 * @swagger
 * tags:
 *   - name: Movimentações Financeiras
 *     description: Operações relacionadas ao extrato e movimentações financeiras completas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MovimentacaoFinanceira:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           description: "Tipo de movimentação (venda, compra, entrada_financeira, ajuste, cancelamento_venda, reversao_entrada)"
 *           example: "venda"
 *         referenciaId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: "ID da referência (Venda, Compra, EntradaFinanceira, etc)"
 *         descricao:
 *           type: string
 *           example: "Venda #1"
 *         valor:
 *           type: number
 *           format: decimal
 *           example: 150.00
 *         entrada:
 *           type: boolean
 *           example: true
 *           description: "true = entrada de dinheiro, false = saída"
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-11-21T10:00:00Z"
 *         saldoApos:
 *           type: number
 *           format: decimal
 *           example: 2150.00
 *           description: "Saldo acumulado após esta movimentação"
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
 *
 *     MovimentacaoDashboardResumo:
 *       type: object
 *       properties:
 *         totalEntradas:
 *           type: number
 *           format: decimal
 *           example: 2500.00
 *         totalSaidas:
 *           type: number
 *           format: decimal
 *           example: 1400.00
 *         lucro:
 *           type: number
 *           format: decimal
 *           example: 1100.00
 *         entradasPorTipo:
 *           type: object
 *           example:
 *             venda: 1800.00
 *             entrada_financeira: 700.00
 *         saidasPorTipo:
 *           type: object
 *           example:
 *             compra: 1400.00
 *         movimentacoesRecentes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               valor:
 *                 type: number
 *               entrada:
 *                 type: boolean
 *               data:
 *                 type: string
 *               saldoApos:
 *                 type: number
 *         saldoAtual:
 *           type: number
 *           format: decimal
 *           example: 2850.00
 *
 *     SaldoAtualResponse:
 *       type: object
 *       properties:
 *         saldoAtual:
 *           type: number
 *           format: decimal
 *           example: 2850.00
 *
 *     CreateAjusteDTO:
 *       type: object
 *       required:
 *         - descricao
 *         - valor
 *         - entrada
 *       properties:
 *         descricao:
 *           type: string
 *           description: "Descrição do ajuste"
 *           example: "Ajuste de caixa"
 *         valor:
 *           type: number
 *           format: decimal
 *           description: "Valor do ajuste (deve ser maior que zero)"
 *           example: 250.50
 *         entrada:
 *           type: boolean
 *           description: "true para entrada, false para saída"
 *           example: true
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /movimentacoes:
 *   get:
 *     summary: Lista todas as movimentações financeiras (extrato)
 *     description: Retorna o extrato completo de movimentações financeiras do usuário com saldoApos acumulado.
 *     tags:
 *       - Movimentações Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: dataInicio
 *         in: query
 *         description: Data inicial (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T00:00:00Z"
 *       - name: dataFim
 *         in: query
 *         description: Data final (ISO 8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-11-30T23:59:59Z"
 *       - name: tipo
 *         in: query
 *         description: Tipo de movimentação (busca parcial case-insensitive)
 *         schema:
 *           type: string
 *           example: "venda"
 *       - name: entrada
 *         in: query
 *         description: Filtrar por tipo de movimento (true=entrada, false=saída)
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *     responses:
 *       200:
 *         description: Lista de movimentações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovimentacaoFinanceira'
 *             example:
 *               - id: 1
 *                 tipo: "entrada_financeira"
 *                 referenciaId: null
 *                 descricao: "Entrada Financeira (aporte)"
 *                 valor: 2000.00
 *                 entrada: true
 *                 data: "2025-02-01T10:00:00Z"
 *                 saldoApos: 2000.00
 *                 usuarioId: 1
 *               - id: 2
 *                 tipo: "compra"
 *                 referenciaId: 1
 *                 descricao: "Compra #1"
 *                 valor: 500.00
 *                 entrada: false
 *                 data: "2025-02-02T10:00:00Z"
 *                 saldoApos: 1500.00
 *                 usuarioId: 1
 *               - id: 3
 *                 tipo: "venda"
 *                 referenciaId: 1
 *                 descricao: "Venda #1"
 *                 valor: 800.00
 *                 entrada: true
 *                 data: "2025-02-03T10:00:00Z"
 *                 saldoApos: 2300.00
 *                 usuarioId: 1
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /movimentacoes/{id}:
 *   get:
 *     summary: Obtém uma movimentação financeira específica
 *     description: Retorna os detalhes de uma movimentação incluindo usuário.
 *     tags:
 *       - Movimentações Financeiras
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da movimentação
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Movimentação obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimentacaoFinanceira'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Movimentação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /movimentacoes/saldo-atual:
 *   get:
 *     summary: Retorna o saldo atual do usuário
 *     description: |
 *       Retorna apenas o saldo acumulado do usuário, baseado em:
 *       - Última movimentação (saldoApos)
 *       - Ou saldoInicial da tabela Configuracao se não houver movimentações
 *     tags:
 *       - Movimentações Financeiras
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo atual retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaldoAtualResponse'
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /movimentacoes/dashboard/resumo:
 *   get:
 *     summary: Retorna resumo para dashboard financeiro
 *     description: |
 *       Retorna um resumo completo para exibição em dashboard:
 *       - Totais de entradas e saídas
 *       - Lucro (entradas - saídas)
 *       - Detalhamento por tipo
 *       - 5 últimas movimentações
 *       - Saldo atual acumulado
 *     tags:
 *       - Movimentações Financeiras
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo do dashboard retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimentacaoDashboardResumo'
 *             example:
 *               totalEntradas: 2500.00
 *               totalSaidas: 1400.00
 *               lucro: 1100.00
 *               entradasPorTipo:
 *                 venda: 1800.00
 *                 entrada_financeira: 700.00
 *               saidasPorTipo:
 *                 compra: 1400.00
 *               movimentacoesRecentes:
 *                 - id: 5
 *                   tipo: "venda"
 *                   descricao: "Venda #3"
 *                   valor: 250.00
 *                   entrada: true
 *                   data: "2025-11-21T15:00:00Z"
 *                   saldoApos: 2300.00
 *               saldoAtual: 2300.00
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /movimentacoes/ajuste:
 *   post:
 *     summary: Registra uma movimentação de ajuste manual
 *     description: |
 *       Cria uma movimentação manual de ajuste no extrato. Útil para:
 *       - Correções de saldo
 *       - Ajustes manuais
 *       - Transferências internas
 *       
 *       Automaticamente:
 *       - Calcula saldoApos
 *       - Vincula ao usuário autenticado
 *       - Tipo é sempre "ajuste"
 *     tags:
 *       - Movimentações Financeiras
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAjusteDTO'
 *           examples:
 *             entrada:
 *               summary: Ajuste de entrada
 *               value:
 *                 descricao: "Ajuste de caixa - entrada"
 *                 valor: 250.50
 *                 entrada: true
 *             saida:
 *               summary: Ajuste de saída
 *               value:
 *                 descricao: "Ajuste de caixa - saída"
 *                 valor: 100.00
 *                 entrada: false
 *     responses:
 *       201:
 *         description: Ajuste registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimentacaoFinanceira'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

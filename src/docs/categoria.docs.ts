/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna uma lista com todas as categorias cadastradas no sistema
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
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
 *                   nome:
 *                     type: string
 *                     example: Eletrônicos
 *                   descricao:
 *                     type: string
 *                     nullable: true
 *                     example: Produtos eletrônicos em geral
 *                   ativo:
 *                     type: boolean
 *                     example: true
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-21T10:30:00Z"
 *                   atualizadoEm:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-21T10:30:00Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtém uma categoria pelo ID
 *     description: Retorna os dados de uma categoria específica
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Eletrônicos
 *                 descricao:
 *                   type: string
 *                   nullable: true
 *                   example: Produtos eletrônicos em geral
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00Z"
 *                 atualizadoEm:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00Z"
 *       400:
 *         description: ID inválido
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
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria não encontrada.
 */

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Cria uma nova categoria (somente Admin/SuperAdmin)
 *     description: >
 *       Registra uma nova categoria no sistema com nome, descrição e status ativo.
 *       <br><br>
 *       Esta operação é restrita a usuários com role ADMIN ou SUPERADMIN.
 *       <br><br>
 *       Validações:
 *       - Nome é obrigatório e deve ter entre 2 e 100 caracteres
 *       - Nome deve ser único (case-insensitive)
 *       - Descrição é opcional e pode ter até 500 caracteres
 *       - Ativo é opcional (padrão: true)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Eletrônicos
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 example: Produtos eletrônicos em geral
 *               ativo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Eletrônicos
 *                 descricao:
 *                   type: string
 *                   nullable: true
 *                   example: Produtos eletrônicos em geral
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00Z"
 *                 atualizadoEm:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00Z"
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
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Acesso negado (privilégios insuficientes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Categoria com esse nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria com esse nome já existe.
 */

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria (somente Admin/SuperAdmin)
 *     description: >
 *       Atualiza os dados de uma categoria específica.
 *       <br><br>
 *       Esta operação é restrita a usuários com role ADMIN ou SUPERADMIN.
 *       <br><br>
 *       Validações:
 *       - Nome deve ter entre 2 e 100 caracteres (se fornecido)
 *       - Nome deve ser único (case-insensitive)
 *       - Descrição pode ter até 500 caracteres (se fornecida)
 *       - Ativo é opcional
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da categoria
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Eletrônicos Novos
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 example: Produtos eletrônicos novos com garantia
 *               ativo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Eletrônicos Novos
 *                 descricao:
 *                   type: string
 *                   nullable: true
 *                   example: Produtos eletrônicos novos com garantia
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                 atualizadoEm:
 *                   type: string
 *                   format: date-time
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
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Acesso negado (privilégios insuficientes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Categoria com esse nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Deleta uma categoria (somente Admin/SuperAdmin)
 *     description: >
 *       Remove uma categoria do sistema permanentemente.
 *       <br><br>
 *       Esta operação é restrita a usuários com role ADMIN ou SUPERADMIN.
 *       <br><br>
 *       **Restrição importante:** Não é possível deletar uma categoria que possui produtos vinculados.
 *       Remova os produtos ou os reatribua a outra categoria antes de deletar.
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria deletada com sucesso.
 *       400:
 *         description: ID inválido
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
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Acesso negado (privilégios insuficientes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria não encontrada.
 *       409:
 *         description: Não é possível deletar categoria com produtos vinculados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não é possível deletar uma categoria que possui produtos vinculados.
 */

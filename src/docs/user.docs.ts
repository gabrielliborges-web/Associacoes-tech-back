/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista com todos os usuários cadastrados no sistema
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                     example: Gabrielli Borges
 *                   email:
 *                     type: string
 *                     example: gabi@example.com
 *                   role:
 *                     type: string
 *                     enum: [USER, ADMIN, SUPERADMIN]
 *                     example: USER
 *                   theme:
 *                     type: string
 *                     enum: [LIGHT, DARK]
 *                     example: DARK
 *                   ativo:
 *                     type: boolean
 *                     example: true
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-21T10:30:00Z"
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     description: Retorna os dados de um usuário específico
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
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
 *                   example: Gabrielli Borges
 *                 email:
 *                   type: string
 *                   example: gabi@example.com
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, SUPERADMIN]
 *                   example: USER
 *                 theme:
 *                   type: string
 *                   enum: [LIGHT, DARK]
 *                   example: DARK
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuário não encontrado.
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário (somente Admin/SuperAdmin)
 *     description: >
 *       Registra um novo usuário no sistema com nome, e-mail, senha, role, tema e status.
 *       <br><br>
 *       Esta operação é restrita a usuários com role ADMIN ou SUPERADMIN.
 *       <br><br>
 *       A senha deve atender aos seguintes critérios:
 *       - Ter pelo menos 6 caracteres;
 *       - Conter pelo menos uma letra maiúscula;
 *       - Conter pelo menos uma letra minúscula;
 *       - Conter pelo menos um número.
 *       <br><br>
 *       Roles disponíveis:
 *       - **USER**: Usuário comum
 *       - **ADMIN**: Administrador (pode criar usuários)
 *       - **SUPERADMIN**: Super administrador (acesso total)
 *     tags: [Usuários]
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
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 example: João Silva Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.admin@example.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: Admin@123
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, SUPERADMIN]
 *                 default: USER
 *                 example: ADMIN
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK]
 *                 default: DARK
 *                 example: DARK
 *               ativo:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   example: João Silva Admin
 *                 email:
 *                   type: string
 *                   example: joao.admin@example.com
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, SUPERADMIN]
 *                   example: ADMIN
 *                 theme:
 *                   type: string
 *                   example: DARK
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
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
 *                 error:
 *                   type: string
 *       403:
 *         description: Acesso negado (privilégios insuficientes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Acesso negado. Privilégios insuficientes.
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: E-mail já cadastrado.
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: >
 *       Atualiza os dados de um usuário específico (requer autenticação).
 *       <br><br>
 *       Admins podem alterar role, status ativo e todos os dados.
 *       Usuários comuns podem alterar apenas seus próprios dados (exceto role).
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
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
 *                 minLength: 3
 *                 example: Gabrielli Borges Novo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: novo@example.com
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, SUPERADMIN]
 *                 example: ADMIN
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK]
 *                 example: LIGHT
 *               ativo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
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
 *                   example: Gabrielli Borges Novo
 *                 email:
 *                   type: string
 *                   example: novo@example.com
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, SUPERADMIN]
 *                   example: ADMIN
 *                 theme:
 *                   type: string
 *                   example: LIGHT
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: E-mail já cadastrado
 */

/**
 * @swagger
 * /user/{id}/theme:
 *   put:
 *     summary: Atualiza o tema do usuário
 *     description: Atualiza o tema (LIGHT ou DARK) do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK]
 *                 example: LIGHT
 *     responses:
 *       200:
 *         description: Tema atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tema atualizado com sucesso.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     theme:
 *                       type: string
 *                       example: LIGHT
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/{id}/password:
 *   put:
 *     summary: Atualiza a senha do usuário
 *     description: Atualiza a senha do usuário autenticado (requer senha atual correta)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: SenhaAntiga123
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: NovaSenha456
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha atualizada com sucesso.
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não fornecido, inválido ou senha atual incorreta
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deleta um usuário (somente Admin/SuperAdmin)
 *     description: >
 *       Remove um usuário do sistema permanentemente.
 *       <br><br>
 *       Esta operação é restrita a usuários com role ADMIN ou SUPERADMIN.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário deletado com sucesso.
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (privilégios insuficientes)
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     description: Retorna os dados do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil retornados com sucesso
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
 *                   example: Gabrielli Borges
 *                 email:
 *                   type: string
 *                   example: gabi@example.com
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, SUPERADMIN]
 *                   example: USER
 *                 theme:
 *                   type: string
 *                   enum: [LIGHT, DARK]
 *                   example: DARK
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Usuário não encontrado
 */

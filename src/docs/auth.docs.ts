/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação do sistema
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Cria um novo usuário
 *     description: >
 *       Registra um novo usuário no sistema com nome, e-mail, senha e tema opcional (LIGHT ou DARK).
 *       <br><br>
 *       A senha deve atender aos seguintes critérios:
 *       - Ter pelo menos 8 caracteres;
 *       - Conter pelo menos uma letra maiúscula;
 *       - Conter pelo menos uma letra minúscula;
 *       - Conter pelo menos um número;
 *       - Conter pelo menos um símbolo especial (@$!%*?&).
 *     tags: [Auth]
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
 *                 example: Gabrielli Borges
 *               email:
 *                 type: string
 *                 example: gabi@example.com
 *               senha:
 *                 type: string
 *                 example: Gabi@2025
 *               theme:
 *                 type: string
 *                 enum: [LIGHT, DARK]
 *                 default: DARK
 *                 example: DARK
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Gabrielli Borges
 *                     email:
 *                       type: string
 *                       example: gabi@example.com
 *                     theme:
 *                       type: string
 *                       example: DARK
 *                     criadoEm:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-21T10:30:00Z"
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *                   example: ["A senha deve conter pelo menos um número."]
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "E-mail já cadastrado."
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login de usuário
 *     description: >
 *       Faz login com e-mail e senha, retornando o token JWT e os dados do usuário.
 *       <br><br>
 *       A senha deve ter pelo menos 8 caracteres.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: gabi@example.com
 *               senha:
 *                 type: string
 *                 example: Gabi@2025
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Gabrielli Borges
 *                     email:
 *                       type: string
 *                       example: gabi@example.com
 *                     theme:
 *                       type: string
 *                       example: DARK
 *                     criadoEm:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-21T10:30:00Z"
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *                   example: ["E-mail inválido.", "Senha deve ter pelo menos 8 caracteres."]
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Senha incorreta.
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

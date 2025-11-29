/**
 * @swagger
 * tags:
 *   name: Password Reset
 *   description: Recuperação e redefinição de senha
 *
 * /password/send:
 *   post:
 *     summary: Envia um código de redefinição de senha para o e-mail informado
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *
 * /password/validate:
 *   get:
 *     summary: Valida o código de redefinição de senha
 *     tags: [Password Reset]
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Código válido
 *       403:
 *         description: Código inválido
 *       410:
 *         description: Código expirado
 *
 * /password/reset:
 *   post:
 *     summary: Redefine a senha do usuário após validação do código
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Código inválido ou já utilizado
 *       410:
 *         description: Código expirado
 */

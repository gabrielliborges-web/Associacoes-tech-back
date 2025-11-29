/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos do usuário
 *     description: Retorna uma lista com todos os produtos cadastrados pelo usuário autenticado, com filtros opcionais
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (busca parcial, case-insensitive)
 *         example: Notebook
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: number
 *         description: Filtrar por ID da categoria
 *         example: 1
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                     example: Notebook Dell
 *                   descricao:
 *                     type: string
 *                     nullable: true
 *                     example: Notebook de última geração
 *                   categoriaId:
 *                     type: number
 *                     nullable: true
 *                     example: 1
 *                   categoria:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nome:
 *                         type: string
 *                   precoVenda:
 *                     type: number
 *                     example: 2500.00
 *                   precoCompra:
 *                     type: number
 *                     nullable: true
 *                     example: 1800.00
 *                   precoPromocional:
 *                     type: number
 *                     nullable: true
 *                     example: 2200.00
 *                   estoque:
 *                     type: number
 *                     example: 5
 *                   ativo:
 *                     type: boolean
 *                     example: true
 *                   imagem:
 *                     type: string
 *                     nullable: true
 *                   usuarioId:
 *                     type: number
 *                   criadoEm:
 *                     type: string
 *                     format: date-time
 *                   atualizadoEm:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     description: Retorna os dados de um produto específico
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 categoriaId:
 *                   type: number
 *                   nullable: true
 *                 categoria:
 *                   type: object
 *                 precoVenda:
 *                   type: number
 *                 precoCompra:
 *                   type: number
 *                   nullable: true
 *                 precoPromocional:
 *                   type: number
 *                   nullable: true
 *                 estoque:
 *                   type: number
 *                 ativo:
 *                   type: boolean
 *                 imagem:
 *                   type: string
 *                   nullable: true
 *                 usuarioId:
 *                   type: number
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     description: >
 *       Registra um novo produto no sistema com dados obrigatórios e opcionais.
 *       <br><br>
 *       Campos obrigatórios:
 *       - **nome**: String, mínimo 2 caracteres
 *       - **precoVenda**: Número maior que zero
 *       <br><br>
 *       Campos opcionais:
 *       - **descricao**: String, máximo 1000 caracteres
 *       - **categoriaId**: ID da categoria
 *       - **precoCompra**: Número maior que zero
 *       - **precoPromocional**: Número maior que zero
 *       - **estoqueInicial**: Número não-negativo (padrão: 0)
 *       - **imagem**: Arquivo de imagem (multipart/form-data)
 *       <br><br>
 *       A imagem é enviada como arquivo separado no campo "imagem" e será armazenada no S3.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - precoVenda
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Notebook Dell XPS 15
 *               descricao:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Notebook de última geração com processador Intel
 *               categoriaId:
 *                 type: number
 *                 example: 1
 *               precoVenda:
 *                 type: number
 *                 example: 2500.50
 *               precoCompra:
 *                 type: number
 *                 example: 1800.00
 *               precoPromocional:
 *                 type: number
 *                 example: 2200.00
 *               estoqueInicial:
 *                 type: number
 *                 example: 5
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 categoriaId:
 *                   type: number
 *                 precoVenda:
 *                   type: number
 *                 precoCompra:
 *                   type: number
 *                 precoPromocional:
 *                   type: number
 *                 estoque:
 *                   type: number
 *                 ativo:
 *                   type: boolean
 *                   example: true
 *                 imagem:
 *                   type: string
 *                   nullable: true
 *                 usuarioId:
 *                   type: number
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro de validação ou upload
 *       401:
 *         description: Não autenticado
 *       409:
 *         description: Produto com esse nome já existe
 */

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     description: >
 *       Atualiza os dados de um produto específico.
 *       <br><br>
 *       Todos os campos são opcionais. Se uma nova imagem for enviada:
 *       - A imagem anterior será removida do S3
 *       - A nova imagem será salva
 *       <br><br>
 *       **Nota:** O estoque não pode ser alterado por aqui. Use outro endpoint específico.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Notebook Dell XPS 15 Pro
 *               descricao:
 *                 type: string
 *                 maxLength: 1000
 *               categoriaId:
 *                 type: number
 *               precoVenda:
 *                 type: number
 *               precoCompra:
 *                 type: number
 *               precoPromocional:
 *                 type: number
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Produto com esse nome já existe
 */

/**
 * @swagger
 * /produtos/{id}/status:
 *   put:
 *     summary: Atualiza o status de um produto (ativo/inativo)
 *     description: >
 *       Define se um produto está ativo ou inativo no sistema.
 *       <br><br>
 *       Um produto marcado como inativo não aparecerá nas listagens mas seus dados são preservados.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     description: >
 *       Remove um produto do sistema.
 *       <br><br>
 *       Comportamento:
 *       - Se o produto possui vendas ou compras vinculadas: é marcado como inativo (soft delete)
 *       - Se não possui vinculações: é removido completamente (hard delete)
 *       - A imagem no S3 é deletada se existir
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto deletado ou marcado como inativo com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Produto não encontrado
 */

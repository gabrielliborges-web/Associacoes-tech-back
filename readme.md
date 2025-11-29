# 🎬 Desafio Tech — Backend API

## 🧠 Visão Geral

Esta é a **API principal do sistema Desafio Tech**, desenvolvida em **Node.js + TypeScript** com **Express** e **Prisma ORM**, projetada para ser **modular, escalável e integrada à AWS**.  
Ela fornece todos os endpoints e serviços necessários para o frontend consumir dados de forma segura, performática e validada.

A aplicação implementa **arquitetura em camadas**, com **documentação via Swagger**, **integração AWS (S3, Lambda, EventBridge)** e **envio de e-mails com Nodemailer**, seguindo boas práticas RESTful, validações com Zod e autenticação via JWT.

---

### 🔗 Documentação da API

Acesse a documentação Swagger localmente após iniciar o servidor:

👉 **[http://localhost:4000/docs](http://localhost:4000/docs)**

---

### 💻 Requisitos

- Node.js **v20.19.0**
- PostgreSQL **≥ 14**
- Conta AWS (com permissões para Lambda, S3 e EventBridge)

## ⚙️ Tecnologias Principais

| Tecnologia          | Finalidade                                                                 |
| :------------------ | :------------------------------------------------------------------------- |
| **Node.js 20.19.0** | Ambiente de execução JavaScript moderno, leve e escalável.                 |
| **TypeScript**      | Tipagem estática e segurança em tempo de compilação.                       |
| **Express.js**      | Framework minimalista para rotas e controle HTTP.                          |
| **Prisma ORM**      | Camada de persistência com PostgreSQL, garantindo tipagem e produtividade. |
| **AWS Lambda**      | Execução de notificações e tarefas agendadas sem necessidade de servidor.  |
| **AWS S3**          | Armazenamento seguro de arquivos e imagens.                                |
| **AWS EventBridge** | Agendamento e orquestração de eventos (ex: notificações e lembretes).      |
| **Nodemailer**      | Envio de e-mails transacionais (recuperação de senha, alertas, etc.).      |
| **Swagger**         | Documentação interativa dos endpoints da API.                              |

---

## 🧱 Arquitetura e Filosofia

A arquitetura da API segue o padrão **Service Layer Pattern** com princípios de **Clean Architecture**, garantindo separação de responsabilidades, testabilidade e reuso de código.

A comunicação entre as camadas segue o fluxo:

src/
├── config/
│ ├── multer/ # Configuração de upload de arquivos
│ │ └── multerConfig.ts
│ ├── nodemailer/ # Configuração e serviços de e-mail
│ │ ├── nodemailer.ts
│ │ ├── awsConfig.ts # Credenciais e setup AWS
│ │ ├── awsScheduler.service.ts # Scheduler de notificações via AWS EventBridge
│ ├── env.ts # Variáveis de ambiente e validações
│ ├── prisma.ts # Instância Prisma ORM
│ ├── swagger.ts # Configuração da documentação Swagger
│
├── controllers/ # Controladores responsáveis pelas requisições
│
├── docs/ # Documentação dos endpoints (Swagger modular)
│ ├── auth.docs.ts
│ ├── movie.docs.ts
│ ├── passwordReset.docs.ts
│ ├── user.docs.ts
│
├── middlewares/ # Middlewares de autenticação, erros e logs
│
├── routes/ # Definição das rotas e agrupamentos de módulos
│
├── services/ # Lógica de negócio e acesso a dados
│
├── utils/ # Funções auxiliares (JWT, parsers, etc.)
│ ├── jwt.ts
│ ├── parseArray.ts
│
├── validators/ # Schemas e validações (Zod)
│ ├── auth.schema.ts
│ ├── movie.validator.ts
│
├── app.ts # Configuração principal do Express
├── index.ts # Ponto de entrada da aplicação
│
├── .env # Variáveis de ambiente
├── .env.example # Exemplo de variáveis obrigatórias
├── prisma/
│ ├── schema.prisma # Modelagem do banco de dados
│ └── migrations/ # Histórico de migrações
│
└── assets/

## 🧩 Padrões Aplicados

- **Camadas bem definidas:** cada responsabilidade isolada (Controller, Service, Validator, Middleware).
- **Modularização completa:** cada domínio (auth, movie, user) possui suas próprias rotas, controladores e documentação Swagger.
- **Validação de entrada:** utilizando **Zod** nos schemas da pasta `validators/`.
- **Documentação integrada:** cada módulo possui um arquivo `*.docs.ts` para fácil expansão no Swagger.
- **Segurança:** autenticação JWT, variáveis sensíveis isoladas no `.env`, e permissões por role (usuário/admin).
- **Boas práticas RESTful:** rotas semânticas, uso de status codes padronizados e respostas consistentes.
- **Integração AWS nativa:** upload de imagens (S3), notificações e automações (Lambda/EventBridge), e envio de e-mails (SES/Nodemailer).

---

## 📘 Documentação da API — Swagger

A API utiliza o **Swagger** para gerar uma documentação interativa e atualizada automaticamente com base nos arquivos localizados em `src/docs/`.  
Isso permite **visualizar, testar e explorar** todos os endpoints disponíveis de forma prática e intuitiva.

### ⚙️ Configuração

A configuração está definida em **`src/config/swagger.ts`**, utilizando `swagger-jsdoc` e `swagger-ui-express`

---

## 📦 Dependências e Scripts

Este projeto utiliza **Node.js v20.19.0**, com **Express**, **TypeScript** e **Prisma ORM** como base principal, além de integrações com **AWS S3**, **AWS EventBridge (Scheduler)**, **Redis**, e **Nodemailer** para envio de e-mails.

---

### 🧰 Scripts disponíveis

| Comando                | Descrição                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Executa o servidor em modo de desenvolvimento com **Nodemon** e **ts-node**, recarregando automaticamente a cada alteração. |
| `npm run build`        | Gera os arquivos compilados TypeScript em `dist/` e executa `prisma generate` antes do build.                               |
| `npm start`            | Inicia o servidor em produção a partir do código compilado (`dist/index.js`).                                               |
| `npm run autopush`     | Faz o commit e push automático das alterações para o branch `main`.                                                         |
| `npm run vercel-build` | Comando utilizado para build na **Vercel** (executa `npm run build`).                                                       |
| `npm run studio`       | Abre o **Prisma Studio**, interface visual para o banco de dados.                                                           |
| `npm run migrate`      | Executa migrações do Prisma e aplica alterações no schema.                                                                  |
| `npm test`             | Placeholder para testes automatizados.                                                                                      |

---

### 🧩 Dependências principais

| Pacote                                 | Descrição                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------- |
| **express**                            | Framework web rápido e minimalista para criação de APIs.                    |
| **prisma / @prisma/client**            | ORM para gerenciamento de banco de dados PostgreSQL.                        |
| **pg**                                 | Driver oficial PostgreSQL para Node.js.                                     |
| **zod**                                | Biblioteca de validação e tipagem de dados.                                 |
| **jsonwebtoken**                       | Autenticação via tokens JWT.                                                |
| **bcrypt**                             | Criptografia de senhas.                                                     |
| **cors**                               | Libera o acesso da API para diferentes origens (CORS).                      |
| **cookie-parser**                      | Faz o parsing de cookies HTTP.                                              |
| **multer / multer-s3**                 | Upload de arquivos locais e diretamente no AWS S3.                          |
| **nodemailer**                         | Envio de e-mails (SMTP).                                                    |
| **socket.io**                          | Comunicação em tempo real (WebSockets).                                     |
| **ioredis / bullmq**                   | Fila de processamento e cache em Redis.                                     |
| **@aws-sdk/client-s3**                 | Cliente AWS para upload e gerenciamento de arquivos.                        |
| **@aws-sdk/client-scheduler**          | Integração com o **AWS EventBridge Scheduler** para notificações agendadas. |
| **dotenv**                             | Leitura de variáveis de ambiente do arquivo `.env`.                         |
| **date-fns / dayjs**                   | Manipulação e formatação de datas.                                          |
| **axios**                              | Requisições HTTP.                                                           |
| **swagger-jsdoc / swagger-ui-express** | Geração e exibição da documentação da API com **Swagger**.                  |

---

### 🧪 Dependências de desenvolvimento

| Pacote                    | Descrição                                                          |
| ------------------------- | ------------------------------------------------------------------ |
| **typescript**            | Tipagem e compilação do código TypeScript.                         |
| **ts-node-dev / nodemon** | Executa e recarrega o servidor automaticamente no ambiente de dev. |
| **@types/\***             | Tipagens TypeScript para pacotes externos.                         |
| **prisma**                | CLI do Prisma para geração de tipos e execução de migrações.       |

---

## ⚙️ Variáveis de Ambiente (.env)

As variáveis abaixo devem ser configuradas no arquivo `.env` na raiz do projeto.  
Elas controlam conexões externas, autenticação, e integrações AWS / SMTP.

---

### 🌍 Configurações AWS

| Variável                  | Descrição                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **AWS_ACCESS_KEY_ID**     | Chave de acesso da conta AWS, usada para autenticação via SDK.                                                     |
| **AWS_SECRET_ACCESS_KEY** | Chave secreta associada à `AWS_ACCESS_KEY_ID`.                                                                     |
| **AWS_BUCKET_NAME**       | Nome do bucket S3 onde os arquivos (imagens, vídeos, etc.) são armazenados.                                        |
| **AWS_REGION**            | Região do bucket AWS (ex: `eu-north-1`).                                                                           |
| **LAMBDA_ARN**            | ARN (Amazon Resource Name) da função **AWS Lambda** usada para tarefas automatizadas, como notificações agendadas. |
| **SCHEDULER_ROLE_ARN**    | ARN do papel (IAM Role) que concede permissões para o **EventBridge Scheduler** executar a função Lambda.          |

Essas variáveis permitem o envio automático de notificações e o upload de arquivos diretamente para o **Amazon S3**.

---

### 🗄️ Banco de Dados

| Variável                                                            | Descrição                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **POSTGRES_URL**                                                    | String de conexão com o banco de dados **PostgreSQL**. Usada pelo **Prisma ORM**. Exemplo: |
| `postgresql://usuario:senha@host:porta/nome_do_banco?schema=public` |

---

### 🔐 Autenticação e Tokens

| Variável        | Descrição                                                             |
| --------------- | --------------------------------------------------------------------- |
| **JWT_SECRET**  | Chave secreta usada para assinar e validar tokens **JWT**.            |
| **RESET_TOKEN** | Token interno usado em processos de reset ou autenticação segura.     |
| **SECRETUSER**  | Identificador secreto usado para autenticação de usuários do sistema. |

---

### 📧 Configuração de E-mail (SMTP)

Essas variáveis são utilizadas pelo **Nodemailer** para envio de e-mails automáticos (ex: notificações, confirmações, lembretes).

| Variável        | Descrição                                                   |
| --------------- | ----------------------------------------------------------- |
| **SMTP_HOST**   | Servidor SMTP (ex: `smtp.gmail.com`).                       |
| **SMTP_PORT**   | Porta do servidor SMTP (ex: `465` para conexões seguras).   |
| **SMTP_SECURE** | Define se a conexão usa TLS/SSL (`true` ou `false`).        |
| **SMTP_USER**   | Endereço de e-mail ou usuário autenticado no servidor SMTP. |
| **SMTP_PASS**   | Senha ou App Password do e-mail remetente.                  |

---

### 🚀 Servidor

| Variável | Descrição                                                    |
| -------- | ------------------------------------------------------------ |
| **PORT** | Porta onde o servidor Express será iniciado. Padrão: `4000`. |

---

### 📝 Exemplo de `.env`

```env
AWS_ACCESS_KEY_ID=SEU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=SEU_SECRET_KEY
AWS_BUCKET_NAME=desafio-movie-back
AWS_REGION=eu-north-1
LAMBDA_ARN=arn:aws:lambda:eu-north-1:1234567890:function:SendEmailNotification
SCHEDULER_ROLE_ARN=arn:aws:iam::1234567890:role/SchedulerLambdaRole

POSTGRES_URL="postgresql://usuario:senha@host:5432/desafio_movie?schema=public"

JWT_SECRET="desafio-cubos-academy-back"
RESET_TOKEN="fs5f"
SECRETUSER="54dswsd...."

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app

PORT=4000
```

# ☁️ Automação de Notificações com AWS Lambda, EventBridge e Nodemailer

Este guia descreve o processo completo para configurar a automação de envio de e-mails via **AWS Lambda + EventBridge Scheduler**, utilizado no sistema **MovieApp**.

---

## 🧩 Estrutura geral

A automação é composta por:

- **AWS Lambda** → executa o envio do e-mail.
- **EventBridge Scheduler** → agenda a execução automática.
- **IAM Role** → define permissões de execução.
- **Nodemailer (SMTP)** → faz o envio do e-mail para o destinatário.

---

## 📁 Criação do diretório da Lambda

1. No seu projeto, crie uma pasta separada chamada **`aws-lambda`**.
2. Dentro dela, crie uma subpasta para a função, por exemplo:

/aws-lambda/sendNotification

3. Essa pasta conterá o código e as dependências da função Lambda.

---

## 🧱 Configuração local da função

1. Inicie um projeto Node.js com `npm init -y`.
2. Instale as dependências:

- **nodemailer**
- **dotenv**
- **typescript**

3. Gere o build TypeScript (`npx tsc`).
4. O resultado deve gerar a pasta `dist/`, com os arquivos prontos para deploy.
5. Coloque o index.js gerado na dist no src, junto aos outros.

---

## ⚙️ Variáveis de ambiente (.env)

Na pasta da Lambda, crie um arquivo `.env` com as credenciais SMTP:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seuemail@gmail.com

SMTP_PASS=sua-senha-de-aplicativo

Essas variáveis são usadas pelo **Nodemailer** para autenticar e enviar o e-mail.

---

## ☁️ Criação da Função Lambda na AWS

1. Acesse o **console da AWS** → **Lambda**.
2. Clique em **Criar função**.
3. Escolha:
   - **Criar do zero**
   - Nome: `sendNotification`
   - **Runtime:** Node.js 20.x
   - **Arquitetura:** x86_64
4. Clique em **Criar função**.
5. Após criada:

   - Vá na aba **Código** → **Fazer upload de arquivo ZIP**.
   - Faça upload do arquivo `.zip` contendo:
     - arquivo `index.js`
     - Pasta `node_modules/`
     - Arquivo `.env`
   - Clique em **Implantar**.

   - Repositório da função lambda:
     https://github.com/gabrielliborges-web/Desafio-Aws-Lambda/tree/main

---

## 🔐 Criação da Role (IAM)

1. Acesse o painel **IAM → Funções**.
2. Clique em **Criar função**.
3. Escolha:
   - **Serviço confiável:** EventBridge Scheduler
   - **Tipo de política:** Gerenciada pela AWS
4. Anexe as seguintes políticas:
   - `AmazonEventBridgeFullAccess`
   - `AWSLambdaRole`
5. Nomeie a função como:

eventbridge-lambda-invoke-role

6. Clique em **Criar função**.
7. Copie o **ARN da Role**, pois será usado na configuração do EventBridge e no backend.

---

## 🪄 Configuração do EventBridge Scheduler

1. Vá até **Amazon EventBridge → Scheduler → Criar cronograma**.
2. Configure:

- **Tipo:** Cronograma único.
- **Data e hora:** informe quando o evento deve ocorrer.
- **Fuso horário:** America/Bahia (ou conforme o servidor).

3. **Destino:**

- Tipo: Lambda.
- Função: `sendNotification`.
- **Role de execução:** selecione `eventbridge-lambda-invoke-role`.

4. Em **Carga útil (Payload)**, informe os dados do filme (em JSON).
5. Clique em **Avançar → Criar cronograma**.

---

## 🔧 Configuração do Backend

O backend utiliza o **AWS SDK** para criar automaticamente o cronograma no EventBridge quando um novo filme é cadastrado.

Adicione as seguintes variáveis no `.env` do backend:

```
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-north-1
LAMBDA_ARN=arn:aws:lambda:eu-north-1:XXXXXXXXXXXX:function:sendNotification
SCHEDULER_ROLE_ARN=arn:aws:iam::XXXXXXXXXXXX:role/eventbridge-lambda-invoke-role
```

Essas credenciais permitem que o backend crie o agendamento dinamicamente.

---

## 🧾 Logs e Monitoramento

1. Acesse **CloudWatch → Logs → /aws/lambda/sendNotification**.
2. Lá você pode verificar:
   - Logs de inicialização.
   - Eventos recebidos.
   - Confirmação de e-mails enviados.

---

## ✅ Funcionamento Final

1. Um novo filme é criado com uma data de lançamento futura.
2. O backend agenda automaticamente o evento no **EventBridge**.
3. No horário configurado, o **EventBridge invoca a Lambda**.
4. A **Lambda envia o e-mail** de notificação com os detalhes do filme via Nodemailer.
5. Tudo ocorre automaticamente, sem precisar manter o servidor ativo.

O backend agora conta com um módulo de notificações automáticas integradas via Socket.IO.

🔧 Como funciona

Sempre que um filme público e publicado é criado:

Uma entrada é salva na tabela Notification

Um evento newNotification é emitido via Socket.IO para todos os clientes conectados

🔌 Endpoints relacionados

Nenhum novo endpoint é necessário.
As notificações são entregues automaticamente via socket.

---

## 🧠 Dicas úteis

- Teste a Lambda diretamente pela AWS usando a aba **Testar** e um JSON de exemplo.
- Certifique-se de que o **fuso horário** usado no agendamento corresponde ao da sua aplicação.
- A **porta 465** indica conexão segura (SSL) no SMTP — usada pelo Gmail.
- Sempre que atualizar o código, gere novamente o `.zip` e **reimplante** na Lambda.

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para clonar, configurar e executar o backend localmente.

### 📥 1. Clonar o repositório

```bash
git clone https://github.com/gabrielliborges-web/desafio-tech-back.git

cd desafio-tech-back

npm install

cp .env.example .env

```

##### Veja Variáveis de Ambiente acima dessa seção

### 📥 2. Configurar o banco de dados

Certifique-se de ter um banco PostgreSQL em execução.
Atualize a variável POSTGRES_URL no .env com a string de conexão completa.

POSTGRES_URL="postgresql://usuario:senha@localhost:5432/desafio_movie?schema=public"

### 📥 3. Configurar o banco de dados

O Prisma ORM é responsável por criar as tabelas no banco de dados com base no schema definido em prisma/schema.prisma.

### 📥 4. Gerar as migrações iniciais:

```
npx prisma migrate dev --name init
npx prisma studio
npx prisma generate
```

### 🧾 Comandos úteis do Prisma

| Comando                              | Descrição                                                                                      |
| :----------------------------------- | :--------------------------------------------------------------------------------------------- |
| `npx prisma migrate dev --name init` | Cria e aplica uma nova migração.                                                               |
| `npx prisma generate`                | Gera o Prisma Client a partir do schema.                                                       |
| `npx prisma studio`                  | Abre o painel visual para inspecionar os dados do banco.                                       |
| `npx prisma db push`                 | Aplica as mudanças no schema diretamente sem criar uma migração (usado em ambientes de teste). |

### 📥 5. Rodar o servidor em modo de desenvolvimento:

```
npm run dev
```

O servidor será iniciado em:
👉 http://localhost:4000

### 🧑‍💻 Autor

**Gabrielli Borges**
Desenvolvedora Full Stack
📧 [github.com/gabrielliborges](https://github.com/gabrielliborges-web)

---

### 📄 Licença

Licenciado sob **ISC License**.

---

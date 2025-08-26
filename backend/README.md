<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

##DESAFIO
📝 **Task: Cadastro de Pacientes e Exames Médicos com Modalidades DICOM**

🎯 **Descrição**

Como usuário da plataforma médica,  
Quero registrar e consultar pacientes e seus exames de forma segura, consistente e com boa experiência de navegação,  
Para que eu tenha controle sobre o histórico clínico mesmo em situações de reenvio de requisição ou acessos simultâneos.

⸻

🔧 **Escopo da Task**

- Implementar endpoints REST para cadastro e consulta de pacientes e exames.
- Garantir idempotência no cadastro de exames.
- Criar estrutura segura para suportar requisições concorrentes.
- Implementar paginação para consultas.
- Integrar com front-end Angular.
- Criar componentes Angular para cadastro e listagem de pacientes e exames.
- Utilizar práticas RESTful, transações ACID e código modular.

⸻

✅ **Regras de Validações**

- O `documento` do paciente deve ser único.
- A `idempotencyKey` do exame deve garantir que requisições duplicadas não criem múltiplos registros.
- Não é permitido cadastrar exame para paciente inexistente.
- Campos obrigatórios devem ser validados (nome, data de nascimento, modalidade, etc).

⸻

📦 **Saída Esperada**

- Endpoints criados:
  - `POST /pacientes`
  - `GET /pacientes?page=x&pageSize=y`
  - `POST /exames`
  - `GET /exames?page=x&pageSize=y`
- Dados persistidos de forma segura e idempotente.
- Front-end com:
  - Listagem paginada de pacientes e exames.
  - Cadastro funcional via formulários.
  - UI amigável com mensagens de erro e loading.

⸻

🔥 **Critérios de Aceite**

- **Dado** que um paciente válido foi cadastrado,  
  **Quando** for enviado um novo exame com `idempotencyKey` única,  
  **Então** o exame deverá ser criado com sucesso.

- **Dado** que um exame com `idempotencyKey` já existe,  
  **Quando** for enviada uma nova requisição com os mesmos dados,  
  **Então** o sistema deverá retornar HTTP 200 com o mesmo exame, sem recriá-lo.

- **Dado** que múltiplas requisições simultâneas com mesma `idempotencyKey` são feitas,  
  **Quando** processadas,  
  **Então** apenas um exame deverá ser persistido.

- **Dado** que o front-end está carregando dados,  
  **Quando** houver erro de rede,  
  **Então** deve ser exibida mensagem de erro com botão "Tentar novamente".

⸻

👥 **Dependências**

- Banco de dados com suporte a transações (PostgreSQL, MySQL ou similar).
- Integração REST entre backend (Node.js/NestJS ou similar) e frontend (Angular).
- Validação de campos no front-end e back-end.
- Definição do enum de modalidades DICOM:
  - `CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA`

⸻

🧪 **Cenários de Teste**

| Cenário | Descrição | Resultado Esperado |
|--------|-----------|--------------------|
| 1 | Criar paciente com dados válidos | Paciente salvo com UUID único |
| 2 | Criar paciente com CPF já existente | Erro de validação 409 - duplicidade |
| 3 | Criar exame com paciente existente e idempotencyKey nova | HTTP 201 e exame salvo |
| 4 | Reenviar exame com mesma idempotencyKey | HTTP 200 e retorno do mesmo exame |
| 5 | Enviar múltiplas requisições simultâneas com mesma idempotencyKey | Apenas um exame persistido |
| 6 | Criar exame com paciente inexistente | Erro 400 - paciente não encontrado |
| 7 | Listar exames com paginação (10 por página) | Retorno paginado corretamente |
| 8 | Listar pacientes com paginação | Lista retornada corretamente |
| 9 | Frontend mostra loading durante chamada | Spinner visível enquanto carrega |
| 10 | Frontend exibe erro de rede e botão “Tentar novamente” | Mensagem visível e reenvio possível |
| 11 | Enviar exame com modalidade inválida | Erro 400 - enum inválido |
| 12 | Validação visual dos campos obrigatórios no formulário | Campos com feedback de erro |
| 13 | Cobertura mínima de 80% nos testes unitários e integração | Relatório de cobertura válido |

⸻

🧪 **Testes de Integração (Requisito Obrigatório)**

- Devem ser implementados utilizando ferramentas como:
  - `Supertest` ou `jest` com `NestJS TestingModule` (backend)
  - `TestBed`, `HttpClientTestingModule` (frontend Angular)
- Devem cobrir pelo menos:
  - Fluxo de criação completo (Paciente → Exame)
  - Validações de regra de negócio
  - Idempotência em requisições simultâneas
  - Respostas corretas de erro
  - Listagem paginada

⸻

✨ **Bônus para Diferenciação Técnica**

Os itens a seguir não são obrigatórios, mas serão **altamente valorizados**:

- 🐳 **Uso de Docker** para orquestração local:
  - Arquivo `docker-compose.yml` com banco e backend
  - Script de inicialização da aplicação
- 📜 **Integração com Swagger / OpenAPI**:
  - Documentação dos endpoints RESTful
  - Disponível via `/api/docs` ou equivalente
- ⚙️ **Pipeline CI Básico com GitHub Actions**:
  - Rodar testes automatizados
  - Validar lint ou build
- 📚 **Documentação Técnica**:
  - `README.md` com instruções para rodar o projeto localmente
  - Scripts de setup e uso da API
  - Seções com decisões de arquitetura

# 📋 MobileMed - Desafio Técnico II

Sistema de cadastro de pacientes e exames médicos com modalidades DICOM, desenvolvido com NestJS e PostgreSQL.

## 🚀 Configuração Rápida

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

#### Opção A: Usando Docker (Recomendado)

```bash
# Iniciar PostgreSQL
docker-compose up -d postgres

# Executar migrações
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

#### Opção B: Script Automatizado

```bash
# Executar script de setup completo
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=mobilemed_db
DB_SCHEMA=public

# Configurações da Aplicação
PORT=3000
NODE_ENV=development
```

### 4. Executar a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📊 Banco de Dados

### Estrutura

- **Pacientes**: Cadastro com validação de CPF único
- **Exames**: Cadastro com idempotência e validação de paciente
- **Índices**: Otimizados para consultas frequentes
- **Transações**: ACID para garantir consistência

### Migrações

```bash
# Gerar nova migração
npm run db:migrate:generate -- src/database/migrations/NomeDaMigracao

# Executar migrações
npm run db:migrate

# Reverter última migração
npm run db:migrate:revert
```

### Seed

```bash
# Popular banco com dados de exemplo
npm run db:seed
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 📚 Documentação da API

### Endpoints

#### Pacientes

- `POST /pacientes` - Criar paciente
- `GET /pacientes?page=1&pageSize=10` - Listar pacientes (paginado)
- `GET /pacientes/:id` - Buscar paciente por ID
- `PATCH /pacientes/:id` - Atualizar paciente

#### Exames

- `POST /exames` - Criar exame (com idempotência)
- `GET /exames?page=1&pageSize=10` - Listar exames (paginado)
- `GET /exames/:id` - Buscar exame por ID
- `PATCH /exames/:id` - Atualizar exame
- `DELETE /exames/:id` - Deletar exame

### Exemplos de Uso

Veja o arquivo `test/api.http` para exemplos completos de requisições.

## 🔧 Funcionalidades Implementadas

### ✅ Validação de Dados
- Validação completa de DTOs com class-validator
- Validação de formatos (CPF, telefone, email)
- Validação de enums (modalidades DICOM, sexo)
- Mensagens de erro em português

### ✅ Idempotência
- Campo `idempotencyKey` para exames
- Prevenção de duplicação em requisições simultâneas
- Retorno do registro existente em caso de chave duplicada

### ✅ Paginação
- Parâmetros `page` e `pageSize` em listagens
- Metadados de paginação (total, páginas, navegação)
- Ordenação por data de cadastro

### ✅ Banco de Dados
- PostgreSQL com configuração otimizada
- Migrações automáticas
- Índices únicos (CPF, idempotencyKey)
- Transações ACID
- Pool de conexões configurado

### ✅ Validações de Negócio
- CPF único por paciente
- Verificação de existência de paciente
- Validação de status ativo do paciente
- Tratamento de erros específicos

## 🐳 Docker

### Serviços Disponíveis

- **PostgreSQL**: Banco de dados principal
- **pgAdmin**: Interface web para gerenciar o banco

### Comandos Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Parar serviços
docker-compose down

# Limpar tudo (incluindo dados)
docker-compose down -v
```

## 📈 Monitoramento

### Logs
- Logs estruturados em desenvolvimento
- Configuração de níveis de log
- Rastreamento de requisições

### Performance
- Pool de conexões configurado
- Índices otimizados
- Queries monitoradas

## 🔒 Segurança

- Validação rigorosa de entrada
- Prevenção de SQL injection
- Transações ACID
- Índices únicos para integridade

## 🚀 Deploy

### Produção

1. Configure variáveis de ambiente para produção
2. Use `NODE_ENV=production`
3. Configure SSL para PostgreSQL
4. Execute migrações antes do deploy
5. Configure pool de conexões adequado

### Variáveis de Ambiente de Produção

```env
NODE_ENV=production
DB_HOST=your-production-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password
DB_DATABASE=your-database
DB_SCHEMA=public
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
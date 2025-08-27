# Desafio Técnico II – MobileMed

Solução full-stack composta por um **backend NestJS** e um **frontend Angular** que permite gerenciar *Pacientes* e *Exames* com modalidades DICOM por meio de uma interface web moderna e uma API REST bem estruturada.

---

## Índice
1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Pré-requisitos](#pré-requisitos)
4. [Primeiros Passos Rápidos](#primeiros-passos-rápidos)
5. [Backend](#backend)
   1. [Executando Localmente](#executando-o-backend-localmente)
   2. [Rodando Testes](#rodando-testes-do-backend)
   3. [Decisões de Design](#decisões-de-design-do-backend)
6. [Frontend](#frontend)
   1. [Executando Localmente](#executando-o-frontend-localmente)
   2. [Rodando Testes](#rodando-testes-do-frontend)
   3. [Decisões de Design](#decisões-de-design-do-frontend)
7. [Fluxo Dockerizado](#fluxo-dockerizado)
8. [Variáveis de Ambiente](#variáveis-de-ambiente)
9. [Referência de Scripts](#referência-de-scripts)

---

## Estrutura do Projeto

```text
mobilemed-desafio-tecnico-II/
├── backend/            # Serviço NestJS (API, regras de negócio, banco)
│   ├── src/
│   │   ├── pacientes/      # Pacientes (controllers, services, use-cases, entities)
│   │   ├── exames/         # Exames (controllers, services, use-cases, entities)
│   │   ├── common/         # Módulos compartilhados (paginação, transações, DTOs)
│   │   ├── config/         # Configurações (database.config.ts)
│   │   ├── app.module.ts   # Módulo raiz
│   │   └── main.ts         # Bootstrap da aplicação
│   ├── database/
│   │   ├── migrations/     # Migrações TypeORM versionadas
│   │   └── seeds/          # Script de seed inicial (pacientes de exemplo)
│   └── env.example         # Variáveis de ambiente padrão
├── frontend/           # Aplicação Angular (SPA)
│   └── src/
│       ├── app/
│       │   ├── components/        # Componentes de UI genéricos (layout, spinner, paginator)
│       │   ├── features/          # Fluxos de negócio completos (pacientes/, exames/)
│       │   ├── pages/             # Páginas de alto nível (dashboard)
│       │   ├── services/          # Facades HTTP (exames.ts, pacientes.ts)
│       │   └── shared/            # Pipes, directives, utilidades comuns
│       ├── environments/          # Variáveis por ambiente (apiBaseUrl)
│       ├── styles.scss            # Tailwind + estilos globais
│       └── main.ts               # Bootstrap da aplicação
├── docker-compose.yml  # Sobe o stack completo (API + DB + SPA)
└── README.md           # Você está aqui 📚
```

### Por que um Monorepo?
Manter ambos os serviços juntos simplifica o onboarding, a configuração de CI e permite a entrega coordenada de features em todo o stack.

---

## Stack Tecnológico

| Camada   | Tecnologia | Por quê? |
|----------|------------|----------|
| Backend  | [NestJS](https://nestjs.com/) + [TypeScript](https://www.typescriptlang.org/) | Framework Node escalável, opinativo e com DI poderoso. |
|          | [TypeORM](https://typeorm.io/) | ORM baseado em decorators, integrado ao NestJS. |
|          | PostgreSQL 15 | Banco relacional robusto e open-source. |
|          | Jest + Supertest | Testes unitários e e2e rápidos no ecossistema Node. |
| Frontend | [Angular](https://angular.io/) 17 + [Vite](https://vitejs.dev/) | Framework maduro com tooling sólido; Vite para HMR ultrarrápido. |
|          | [TailwindCSS](https://tailwindcss.com/) | CSS utilitário para desenvolvimento de UI ágil. |
|          | RxJS, Angular Router | Estado reativo e roteamento. |
| Ferramentas | Docker / Docker Compose | Setup completo com um único comando. |
|          | ESLint, Prettier | Qualidade de código consistente em todo o repositório. |

---

## Pré-requisitos

* **Node.js** ≥ 18.x (recomendado LTS)
* **npm** ≥ 9.x (ou **pnpm** / **yarn** caso prefira)
* **Docker** ≥ 24.x & **Docker Compose** plugin
* (Opcional) **psql** CLI para acesso direto ao banco

> Dica: a forma mais simples de começar é via Docker – veja [Primeiros Passos](#primeiros-passos-rápidos).

---

## Primeiros Passos Rápidos

```bash
# 1. Clone o repositório e entre na pasta
$ git clone https://github.com/seu-usuario/mobilemed-desafio-tecnico-II.git
$ cd mobilemed-desafio-tecnico-II

# 2. (Opcional) Copie os arquivos .env caso deseje customizar variáveis
$ cp backend/env.example backend/.env

#   • Para uso 100% via Docker este passo pode ser ignorado, pois o compose já referencia `backend/env.example` diretamente.

# 3. Suba tudo com Docker (API, DB, SPA)
$ docker compose up --build -d

# 4. Acesse o SPA (http://localhost:4200) – backend em http://localhost:3000
```

> As seções seguintes mostram como rodar **apenas** o backend ou o frontend localmente (útil para debug avançado), mas não são necessárias para uso/avaliação padrão.

O arquivo compose define os seguintes serviços:

Serviço | Imagem | Portas | Finalidade
--------|--------|--------|-----------
`postgres` | `postgres:15-alpine` | 5433→5432 | Banco de dados relacional
`backend` | build `./backend` (Node 18 + Nest) | 3000 | API REST
`frontend` | build `./frontend` (Nginx) | 4200→80 | SPA Angular compilada
`seed` | reutiliza imagem `backend` | — | Popula dados iniciais e encerra
`pgadmin` | `dpage/pgadmin4` | 8080→80 | UI de administração do Postgres

### Tarefas Comuns

* **Rebuild após mudança de dependências**
  ```bash
  docker compose build --no-cache backend frontend
  ```
* **Executar migrações manualmente**
  ```bash
  docker compose exec backend npm run db:migrate
  ```
* **Rodar seeds**
  ```bash
  docker compose run --rm seed
  ```
* **Acessar o banco via psql**
  ```bash
  docker compose exec postgres psql -U postgres mobilemed_db
  ```

---

## Backend

Localização: `backend/`

### Executando o Backend Localmente

```bash
# Entre na pasta backend
$ cd backend

# Instale dependências (apenas na primeira vez)
$ npm ci

# Suba o PostgreSQL em Docker (caso não tenha local)
$ docker compose -f ../docker-compose.yml up db -d

# Inicie o servidor de desenvolvimento com hot-reload
$ npm run start:dev
```

API disponível em `http://localhost:3000`. Documentação Swagger em `/api` quando em modo dev.

### Rodando Testes do Backend

```bash
# Testes unitários
$ npm run test

# Modo watch
$ npm run test:watch

# Testes end-to-end (Supertest + Nest factory)
$ npm run test:e2e
```

> Um container Postgres é criado automaticamente para o suite e2e (vide `test/jest-e2e.json`).

### Decisões de Design do Backend

* **Arquitetura Hexagonal / Clean** – Controllers → Use-Cases → Entidades de Domínio. Lógica de negócio isolada de detalhes NestJS.
* **Serviço Transacional** – `common/services/transaction.service.ts` garante operações ACID entre use-cases.
* **Validação & Transformação de DTOs** – Uso de `class-validator` & `class-transformer` para contratos confiáveis.
* **Soft Delete (parcial)** – A entidade `Paciente` já possui o campo `status` (`Ativo`/`Inativo`) atuando como exclusão lógica; 
* **Abstração de Paginação** – DTO genérico & wrappers para respostas consistentes.
* **Enum Modalidade DICOM** – Enum `Modalidade` contempla os 11 tipos requeridos (CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA) com validação em DTO.
* **Idempotência de Exames** – Chave `idempotencyKey` única + índice composto garante que requisições repetidas retornem o mesmo registro.

---

## Frontend

Localização: `frontend/`

### Executando o Frontend Localmente

```bash
# Entre na pasta frontend
$ cd frontend

# Instale dependências
$ npm ci

# Inicie o dev server (proxy /api → localhost:3000)
$ npm run dev
```

Acesse `http://localhost:4200` (porta padrão do Vite). Alterações recarregam automaticamente.

### Rodando Testes do Frontend

```bash
# Testes de componentes e unitários (Karma + Jasmine via Angular CLI)
$ npm run test

# Relatório de cobertura
$ npm run test -- --code-coverage
```

### Decisões de Design do Frontend

* **API de Componentes Standalone** – Novo modelo sem módulos do Angular, reduzindo boilerplate.
* **Componentes de Apresentação vs Feature** – Features orquestram dados / Apresentação cuida da UI.
* **TailwindCSS** – Dá controle preciso de design mantendo CSS enxuto.
* **HTTP Interceptors** – Spinner de loading, tratamento centralizado de erros e injeção de auth.
* **Serviços Facade** – Envolvem chamadas HTTP retornando `Observable`s tipados RxJS para composição.

---

## Fluxo Dockerizado

O `docker-compose.yml` na raiz orquestra todo o ambiente para desenvolvimento e pipelines CI.

Serviço | Imagem | Portas | Finalidade
--------|--------|--------|-----------
`db` | `postgres:15-alpine` | 5432 | Banco relacional com volume persistente
`api` | `node:18-alpine` + Nest | 3000 | Serviço backend
`web` | `nginx:alpine` | 80 → 4200 | Serve app Angular compilada

### Tarefas Comuns

* **Rebuild após mudar dependências**
  ```bash
  docker compose build --no-cache api web
  ```
* **Rodar migrações manualmente**
  ```bash
  docker compose exec api npm run typeorm migration:run
  ```
* **Inspecionar o DB**
  ```bash
  docker compose exec db psql -U postgres
  ```

---

## Variáveis de Ambiente

| Variável | Onde definir | Default | Descrição |
|----------|--------------|---------|-----------|
| `DB_HOST` | backend/env.example | `localhost` | Host do Postgres (ou `postgres` no Docker) |
| `DB_PORT` | backend/env.example | `5432` | Porta do Postgres |
| `DB_USERNAME` | backend/env.example | `postgres` | Usuário do banco |
| `DB_PASSWORD` | backend/env.example | `password` | Senha do banco |
| `DB_DATABASE` | backend/env.example | `mobilemed_db` | Nome do banco |
| `DB_SCHEMA` | backend/env.example | `public` | Schema padrão |
| `PORT` | backend/env.example | `3000` | Porta HTTP exposta pelo backend |
| `apiBaseUrl` | frontend/src/environments/environment.ts | `/api` | Rota base das requisições da SPA (proxy para o backend) |

---

## Referência de Scripts

Atalhos que encapsulam comandos complexos:

Backend (`backend/package.json`)
* `start:dev` – Servidor Nest com HMR
* `migration:generate` – Gera migração TypeORM a partir de alterações em entidades
* `seed:run` – Executa seed do banco (`src/database/seeds/seed.ts`)

Frontend (`frontend/package.json`)
* `dev` – Servidor Vite
* `build` – Bundle de produção
* `preview` – Preview local do build compilado

Raiz do repositório (`package.json`) *(futuro)*
* `lint` – Roda eslint no backend & frontend
* `test` – Executa todas as suites de testes

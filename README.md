# MobileMed - Desafio Técnico II

Sistema de gerenciamento de pacientes e exames médicos com backend em NestJS e frontend em Angular.

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas 3000, 4200, 5433 e 8080 disponíveis

### Execução Rápida
```bash
# Clone o repositório
git clone <repository-url>
cd mobilemed-desafio-tecnico-II

# Execute o projeto
docker compose up --build
```

### Acessos
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/swagger
- **PgAdmin**: http://localhost:8080
  - Email: admin@mobilemed.com
  - Senha: admin123
- **PostgreSQL**: localhost:5433
  - Database: mobilemed_db
  - Username: postgres
  - Password: password

## 🏗️ Arquitetura

### Backend (NestJS)
- **Porta**: 3000
- **Framework**: NestJS com TypeScript
- **Banco**: PostgreSQL com TypeORM
- **Documentação**: Swagger/OpenAPI

### Frontend (Angular)
- **Porta**: 4200
- **Framework**: Angular 20
- **UI**: Angular Material + Tailwind CSS
- **Proxy**: Configurado para API

### Banco de Dados
- **Porta**: 5433
- **Sistema**: PostgreSQL 15
- **Dados**: Seed automático com 5 pacientes e 10 exames

## 📋 Funcionalidades

### Pacientes
- Listagem de pacientes
- Cadastro de novos pacientes
- Edição de dados
- Exclusão de pacientes

### Exames
- Listagem de exames
- Cadastro de novos exames
- Edição de dados
- Exclusão de exames
- Filtros por modalidade

## 🔧 Comandos Úteis

```bash
# Iniciar todos os serviços
docker compose up

# Iniciar em background
docker compose up -d

# Parar todos os serviços
docker compose down

# Reconstruir imagens
docker compose up --build

# Ver logs
docker compose logs backend
docker compose logs frontend

# Acessar container
docker compose exec backend sh
docker compose exec postgres psql -U postgres -d mobilemed_db
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar processos usando as portas
   netstat -ano | findstr :3000
   netstat -ano | findstr :4200
   ```

2. **Erro de conexão com banco**
   ```bash
   # Aguardar inicialização do PostgreSQL
   docker compose logs postgres
   ```

3. **Build falha**
   ```bash
   # Limpar cache e reconstruir
   docker system prune -f
   docker compose up --build
   ```

## 📁 Estrutura do Projeto

```
mobilemed-desafio-tecnico-II/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── pacientes/      # Módulo de pacientes
│   │   ├── exames/         # Módulo de exames
│   │   ├── config/         # Configurações
│   │   └── database/       # Migrações e seeds
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/   # Módulos de features
│   │   │   ├── shared/     # Componentes compartilhados
│   │   │   └── services/   # Serviços
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml      # Orquestração
```

## 🔒 Variáveis de Ambiente

### Backend
```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=mobilemed_db
DB_SCHEMA=public
NODE_ENV=development
PORT=3000
```

## 📝 API Endpoints

### Pacientes
- `GET /pacientes` - Listar pacientes
- `POST /pacientes` - Criar paciente
- `GET /pacientes/:id` - Buscar paciente
- `PUT /pacientes/:id` - Atualizar paciente
- `DELETE /pacientes/:id` - Excluir paciente

### Exames
- `GET /exames` - Listar exames
- `POST /exames` - Criar exame
- `GET /exames/:id` - Buscar exame
- `PUT /exames/:id` - Atualizar exame
- `DELETE /exames/:id` - Excluir exame

## 🎯 Status do Projeto

✅ **Funcionalidades Implementadas**
- [x] CRUD de Pacientes
- [x] CRUD de Exames
- [x] API REST com Swagger
- [x] Frontend Angular responsivo
- [x] Banco PostgreSQL com TypeORM
- [x] Docker Compose completo
- [x] Seeds automáticos
- [x] Health checks
- [x] Documentação

## 📞 Suporte

Para dúvidas ou problemas, consulte:
1. Logs dos containers: `docker compose logs`
2. Documentação Swagger: http://localhost:3000/swagger
3. Issues do repositório

# GitHub Actions CI/CD Pipeline

Este diretório contém os workflows de CI/CD para o projeto MobileMed.

## Workflows Disponíveis

### 1. CI Pipeline (`ci.yml`)

Pipeline principal que executa em pushes e pull requests para as branches `main` e `develop`.

**Jobs incluídos:**

#### Backend Tests & Lint
- ✅ Executa linting com ESLint
- ✅ Roda testes unitários com Jest
- ✅ Roda testes e2e
- ✅ Valida build do projeto
- 🗄️ Usa PostgreSQL como serviço para testes

#### Frontend Tests & Build
- ✅ Roda testes com Karma/Jasmine
- ✅ Valida build do projeto Angular
- 🌐 Usa ChromeHeadless para testes

#### Docker Build Test
- ✅ Testa build das imagens Docker
- ✅ Valida docker-compose build
- 🔗 Depende dos jobs de teste anteriores

### 2. Code Quality Analysis (`code-quality.yml`)

Workflow adicional para análise de qualidade e segurança.

**Jobs incluídos:**

#### Code Quality & Coverage
- 📊 Gera relatórios de cobertura de testes
- 📤 Envia relatórios para Codecov
- 🔍 Analisa qualidade do código

#### Security Scan
- 🔒 Executa scan de vulnerabilidades com Trivy
- 📋 Envia resultados para GitHub Security tab

## Configuração

### Variáveis de Ambiente

O pipeline usa as seguintes variáveis de ambiente para testes:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=mobilemed_db_test
DB_SCHEMA=public
NODE_ENV=test
```

### Cache

O pipeline utiliza cache do npm para otimizar a instalação de dependências:
- Backend: `backend/package-lock.json`
- Frontend: `frontend/package-lock.json`

## Como Usar

1. **Push para main/develop**: Executa automaticamente o pipeline completo
2. **Pull Request**: Executa validações antes do merge
3. **Monitoramento**: Verifique a aba "Actions" no GitHub

## Troubleshooting

### Problemas Comuns

1. **Falha nos testes de banco de dados**
   - Verifique se o PostgreSQL está rodando corretamente
   - Confirme as variáveis de ambiente

2. **Falha no build do frontend**
   - Verifique se todas as dependências estão instaladas
   - Confirme a versão do Node.js (18.x)

3. **Falha no Docker build**
   - Verifique se os Dockerfiles estão corretos
   - Confirme se o docker-compose.yml está válido

### Logs e Debug

- Acesse a aba "Actions" no GitHub
- Clique no workflow específico
- Analise os logs de cada job para identificar problemas

## Melhorias Futuras

- [ ] Adicionar deploy automático para staging
- [ ] Implementar cache de dependências do Docker
- [ ] Adicionar testes de performance
- [ ] Configurar notificações para falhas
- [ ] Implementar análise de dependências com dependabot

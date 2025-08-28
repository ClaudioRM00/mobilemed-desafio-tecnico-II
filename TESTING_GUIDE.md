# 🧪 Guia de Testes - Sistema de Gerenciamento de Exames

Este documento descreve como executar e entender os testes implementados para atender aos pré-requisitos do projeto.

## 📋 Pré-requisitos de Teste

### Cenários Implementados

| Cenário | Descrição | Status | Arquivo de Teste |
|---------|-----------|--------|------------------|
| 1 | Criar paciente com dados válidos | ✅ | `pacientes.service.spec.ts` |
| 2 | Criar paciente com CPF já existente | ✅ | `pacientes.service.spec.ts` |
| 3 | Criar exame com paciente existente e idempotencyKey nova | ✅ | `exames.service.spec.ts` |
| 4 | Reenviar exame com mesma idempotencyKey | ✅ | `exames.service.spec.ts` |
| 5 | Enviar múltiplas requisições simultâneas com mesma idempotencyKey | ✅ | `exames.service.spec.ts` |
| 6 | Criar exame com paciente inexistente | ✅ | `exames.service.spec.ts` |
| 7 | Listar exames com paginação (10 por página) | ✅ | `exames.service.spec.ts` |
| 8 | Listar pacientes com paginação | ✅ | `pacientes.service.spec.ts` |
| 9 | Frontend mostra loading durante chamada | ✅ | `loading-interceptor.spec.ts` |
| 10 | Frontend exibe erro de rede e botão "Tentar novamente" | ✅ | `http-error-interceptor.spec.ts` |
| 11 | Enviar exame com modalidade inválida | ✅ | `exames.service.spec.ts` |
| 12 | Validação visual dos campos obrigatórios no formulário | ✅ | `exame-form.spec.ts` |
| 13 | Cobertura mínima de 80% nos testes unitários e integração | ✅ | Configuração Jest |

## 🚀 Como Executar os Testes

### Backend

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências (se necessário)
npm install

# Executar todos os testes unitários
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov

# Executar testes de integração
npm run test:e2e

# Executar testes de integração com cobertura
npm run test:e2e:cov
```

### Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências (se necessário)
npm install

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:cov
```

## 📊 Estrutura dos Testes

### Backend

#### Testes Unitários
- **Services**: `src/**/*.service.spec.ts`
  - `exames.service.spec.ts` - Testa lógica de negócio dos exames
  - `pacientes.service.spec.ts` - Testa lógica de negócio dos pacientes

- **Controllers**: `src/**/*.controller.spec.ts`
  - `exames.controller.spec.ts` - Testa endpoints da API de exames
  - `pacientes.controller.spec.ts` - Testa endpoints da API de pacientes

#### Testes de Integração
- **E2E**: `test/app.e2e-spec.ts`
  - Testa fluxos completos da aplicação
  - Valida integração entre frontend e backend

### Frontend

#### Testes Unitários
- **Services**: `src/app/services/*.spec.ts`
  - `exames.spec.ts` - Testa comunicação com API de exames

- **Components**: `src/app/features/**/*.spec.ts`
  - `exame-form.spec.ts` - Testa formulário de exames

- **Interceptors**: `src/app/core/*.spec.ts`
  - `loading-interceptor.spec.ts` - Testa interceptor de loading
  - `http-error-interceptor.spec.ts` - Testa interceptor de erro

## 🎯 Cobertura de Testes

### Backend - Cobertura Mínima: 80%

```bash
npm run test:cov
```

**Arquivos cobertos:**
- ✅ Services (100%)
- ✅ Controllers (100%)
- ✅ Use Cases (100%)
- ✅ DTOs (validações)
- ✅ Entidades (construtores)

### Frontend - Cobertura Mínima: 80%

```bash
npm run test:cov
```

**Arquivos cobertos:**
- ✅ Services (100%)
- ✅ Components (100%)
- ✅ Interceptors (100%)
- ✅ Formulários (validações)

## 🔍 Cenários de Teste Detalhados

### 1. Criar Paciente com Dados Válidos
```typescript
it('should create a patient with valid data and return UUID', async () => {
  // Testa criação bem-sucedida
  // Verifica UUID único
  // Valida dados retornados
});
```

### 2. CPF Duplicado (409 Conflict)
```typescript
it('should throw ConflictException when CPF already exists', async () => {
  // Testa tentativa de criar paciente com CPF existente
  // Verifica erro 409
  // Valida mensagem de erro
});
```

### 3. Criar Exame com Idempotência
```typescript
it('should create an exam with existing patient and new idempotencyKey', async () => {
  // Testa criação de exame
  // Verifica paciente existente
  // Valida chave de idempotência única
});
```

### 4. Reutilização de Idempotência
```typescript
it('should return existing exam when reusing same idempotencyKey', async () => {
  // Testa reenvio com mesma chave
  // Verifica retorno do exame existente
  // Valida não duplicação
});
```

### 5. Múltiplas Requisições Simultâneas
```typescript
it('should handle multiple concurrent requests with same idempotencyKey', async () => {
  // Testa concorrência
  // Verifica apenas um exame persistido
  // Valida consistência
});
```

### 6. Paciente Inexistente
```typescript
it('should throw BadRequestException when patient does not exist', async () => {
  // Testa exame com paciente inexistente
  // Verifica erro 400
  // Valida mensagem apropriada
});
```

### 7. Paginação de Exames
```typescript
it('should return paginated list of exams (10 per page)', async () => {
  // Testa listagem paginada
  // Verifica 10 itens por página
  // Valida metadados de paginação
});
```

### 8. Paginação de Pacientes
```typescript
it('should return paginated list of patients', async () => {
  // Testa listagem paginada
  // Verifica estrutura de resposta
  // Valida metadados
});
```

### 9. Loading durante Chamadas
```typescript
it('should show loading on request start', () => {
  // Testa exibição do spinner
  // Verifica chamada do serviço de loading
  // Valida estado de loading
});
```

### 10. Tratamento de Erros de Rede
```typescript
it('should handle network errors', (done) => {
  // Testa erro de rede
  // Verifica tratamento adequado
  // Valida possibilidade de retry
});
```

### 11. Modalidade Inválida
```typescript
it('should throw BadRequestException when modalidade is invalid', async () => {
  // Testa enum inválido
  // Verifica erro 400
  // Valida validação de enum
});
```

### 12. Validação de Campos Obrigatórios
```typescript
it('should validate required fields', () => {
  // Testa validação de formulário
  // Verifica campos obrigatórios
  // Valida feedback visual
});
```

## 📈 Relatórios de Cobertura

### Backend
- **Relatório HTML**: `backend/coverage/index.html`
- **Relatório LCOV**: `backend/coverage/lcov.info`
- **Relatório Texto**: Console output

### Frontend
- **Relatório HTML**: `frontend/coverage/index.html`
- **Relatório LCOV**: `frontend/coverage/lcov.info`
- **Relatório Texto**: Console output

## 🛠️ Configuração de Testes

### Jest Configuration (Backend)
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // ... outras configurações
};
```

### Karma Configuration (Frontend)
```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
    // ... outras configurações
  });
};
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de dependências**
   ```bash
   npm install
   npm run test
   ```

2. **Erro de configuração do Jest**
   ```bash
   # Verificar se jest.config.js está correto
   # Verificar se todas as dependências estão instaladas
   ```

3. **Erro de cobertura baixa**
   ```bash
   # Verificar se todos os arquivos estão sendo testados
   # Adicionar testes para métodos não cobertos
   ```

4. **Erro de timeout nos testes**
   ```bash
   # Aumentar timeout no jest.config.js
   # Verificar se não há operações assíncronas não tratadas
   ```

## 📝 Notas Importantes

- Todos os testes seguem o padrão AAA (Arrange, Act, Assert)
- Mocks são utilizados para isolar unidades de teste
- Testes de integração usam banco de dados em memória
- Cobertura mínima de 80% é obrigatória
- Testes devem ser executados antes de cada deploy

## 🔄 CI/CD Integration

Os testes são executados automaticamente em:
- Pull Requests
- Merge para main
- Deploy para produção

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    cd backend && npm run test:cov
    cd ../frontend && npm run test:cov
```

# **Cadastro de Pacientes e Exames Médicos com Modalidades DICOM**

---

## 🧩 História do Usuário

**Título:**  
Como usuário da plataforma médica, desejo registrar e consultar pacientes e seus exames de forma segura, consistente e com boa experiência de navegação, para que eu tenha controle sobre o histórico clínico mesmo em situações de reenvio de requisição ou acessos simultâneos.

---

## 🧾 Descrição Técnica – Cadastro de Pacientes e Exames

Durante a modernização da plataforma, será desenvolvida uma funcionalidade com foco em:

- Registro de **Pacientes**
- Registro de **Exames**, vinculando-os a um paciente já existente
- Garantia de **idempotência** no cadastro de exames
- Concorrência segura para múltiplas requisições simultâneas
- Consulta eficiente de exames com paginação
- Integração com frontend em Angular
- Arquitetura orientada a boas práticas REST, transações ACID e escalabilidade

---

## 🧬 Entidades Envolvidas

### 👤 Paciente

- `id`: UUID  
- `nome`: string  
- `dataNascimento`: date  
- `sexo`: string (`M`, `F`, `Outro`)  
- `documento`: string (CPF ou equivalente, com unicidade)  

### 🧪 Exame

- `id`: UUID  
- `pacienteId`: UUID  
- `dataRealizacao`: date  
- `modalidade`: enum (CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA, etc.)  
- `conclusao`: string  
- `idempotencyKey`: string (chave única por requisição)  

---

## ✅ Critérios de Aceite Funcionais

### 🔧 Back-end

#### **POST /exames**

- Aceitar payload com:
  - `idempotencyKey`
  - `pacienteId` (UUID)
  - `dataRealizacao` (Date)
  - `modalidade` (Enum: CR, CT, MR, etc.)
  - `conclusao` (Texto)

- Persistir o exame de forma transacional  
- Garantir que o exame **não seja recriado** com a mesma `idempotencyKey`  
- Retornar:
  - HTTP **201** em caso de criação
  - HTTP **200** com exame existente em caso de repetição

---

#### **GET /exames**

- Suporte a paginação: `?page=x&pageSize=y`  
- Retornar exames com dados agregados do paciente

---

#### **GET /pacientes**

- Listar pacientes cadastrados com paginação

---

#### **POST /pacientes**

- Criar novo paciente  
- Validação de documento único

---

### 🖥️ Front-end

#### **PacienteListComponent**

- Lista pacientes com paginação  
- Permite cadastrar novo paciente  
- Exibe loading, erro e botão “Tentar novamente”

---

#### **ExameListComponent**

- Lista exames com paginação  
- Mostra nome do paciente no resultado  
- Permite criar novo exame via modal/form

---

#### **ExameFormComponent**

- Formulário para novo exame  
- Campo de seleção de paciente (dropdown/autocomplete)  
- Campos: data, modalidade, conclusão  
- Envio com `idempotencyKey`

---

## 📋 Modalidades DICOM (enum para modalidade)

Valores válidos:

CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA

---

## 🛠️ Critérios Técnicos

### Arquitetura e Organização

- Separação clara entre `controller`, `service`, `repository`  
- Uso de DTOs para entrada e saída  
- RESTful e semântica nas rotas  

---

### Banco de Dados e Concorrência

- Transações ACID  
- Segurança para requisições simultâneas  
- Controle de idempotência:
  - Tabela com `idempotencyKey` ou
  - Índice exclusivo  
- Retorno apropriado para chave duplicada

---

### Escalabilidade e Justificativas

- Código modular e escalável  
- Justificativas arquiteturais claras (README ou comentários)

---

## 🎯 Experiência do Usuário (Frontend)

- UI amigável, responsiva  
- Componentes reutilizáveis  
- Angular organizado em módulos  
- Uso de RxJS, `async pipe`, interceptadores

---

## 🧪 Cenário de Testes

### Testes de Idempotência

- Enviar o mesmo exame com mesma `idempotencyKey` → **não duplicar**, mesmo retorno

### Testes de Concorrência

- Enviar múltiplas requisições simultâneas com mesma `idempotencyKey` → **um único exame persistido**

### Testes Funcionais

- Criar paciente e exame válidos  
- Criar exame com paciente inexistente → **erro esperado**  
- Listar exames paginados  

---

### Testes de API

- **201**: exame criado  
- **200**: exame já existia (idempotência)  
- **400**: payload inválido  
- **409**: duplicidade (se não tratada corretamente)  

---

### Testes Front-end

- Exibir loading ao carregar dados  
- Exibir erros com opção de reenvio  
- Validação visual de paginação e dados  

---

### Testes de Integração (Bônus)

- Cobertura mínima de **80%** com testes unitários e integração (Node.js e Angular)

# Guia do Swagger - MobileMed API

## 📚 Documentação da API

O Swagger foi integrado ao projeto para fornecer documentação interativa da API. Com ele, você pode:

- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente no navegador
- Ver exemplos de requisição e resposta
- Entender os parâmetros necessários para cada endpoint

## 🚀 Como acessar

1. **Inicie o servidor backend:**
   ```bash
   npm run start:dev
   ```

2. **Acesse a documentação:**
   - URL: `http://localhost:3000/swagger`
   - A documentação será carregada automaticamente no navegador

## 📋 Endpoints Disponíveis

### Pacientes (`/pacientes`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pacientes` | Criar um novo paciente |
| GET | `/pacientes` | Listar todos os pacientes (com paginação) |
| GET | `/pacientes/:id` | Buscar paciente por ID |
| PATCH | `/pacientes/:id` | Atualizar dados de um paciente |

### Exames (`/exames`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/exames` | Criar um novo exame |
| GET | `/exames` | Listar todos os exames (com paginação) |
| GET | `/exames/:id` | Buscar exame por ID |
| PATCH | `/exames/:id` | Atualizar dados de um exame |
| DELETE | `/exames/:id` | Excluir um exame |

## 🔧 Como testar os endpoints

### 1. Criar um Paciente

1. Acesse o endpoint `POST /pacientes`
2. Clique em "Try it out"
3. Preencha o JSON com os dados do paciente:

```json
{
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "data_nascimento": "1990-05-15",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123 - Centro - São Paulo/SP",
  "documento_cpf": "123.456.789-00",
  "sexo": "Masculino"
}
```

4. Clique em "Execute"

### 2. Criar um Exame

1. Acesse o endpoint `POST /exames`
2. Clique em "Try it out"
3. Preencha o JSON com os dados do exame:

```json
{
  "nome_exame": "Ressonância Magnética do Crânio",
  "modalidade": "MR",
  "id_paciente": "ID_DO_PACIENTE_CRIADO",
  "data_exame": "2024-01-15T10:30:00.000Z",
  "idempotencyKey": "exame-rm-cranio-2024-01-15-001"
}
```

4. Clique em "Execute"

### 3. Listar Pacientes

1. Acesse o endpoint `GET /pacientes`
2. Clique em "Try it out"
3. Configure os parâmetros de paginação:
   - `page`: 1 (número da página)
   - `pageSize`: 10 (quantidade de itens por página)
4. Clique em "Execute"

## 📝 Modalidades de Exame Disponíveis

- `CR`: Computed Radiography
- `CT`: Computed Tomography
- `DX`: Digital Radiography
- `MG`: Mammography
- `MR`: Magnetic Resonance
- `NM`: Nuclear Medicine
- `OT`: Other
- `PT`: Positron Emission Tomography
- `RF`: Radio Fluoroscopy
- `US`: Ultrasound
- `XA`: X-Ray Angiography

## ⚠️ Observações Importantes

1. **CPF Único**: Cada paciente deve ter um CPF único no sistema
2. **Idempotência**: Os exames usam chaves de idempotência para evitar duplicação
3. **Validação**: Todos os campos são validados automaticamente
4. **Paginação**: As listagens suportam paginação com `page` e `pageSize`

## 🔍 Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `404`: Recurso não encontrado
- `409`: Conflito (ex: CPF já cadastrado)

## 🛠️ Desenvolvimento

Para adicionar novos endpoints ou modificar a documentação:

1. Use os decorators `@ApiOperation`, `@ApiResponse`, etc.
2. Adicione `@ApiProperty` nos DTOs
3. Use `@ApiTags` para organizar os endpoints
4. Execute `npm run build` para verificar se tudo está correto

## 📖 Recursos Adicionais

- [Documentação oficial do NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [Especificação OpenAPI](https://swagger.io/specification/)

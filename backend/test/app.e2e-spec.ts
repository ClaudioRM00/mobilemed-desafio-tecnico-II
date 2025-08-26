import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente, Sexo, Status } from '../src/pacientes/entities/paciente.entity';
import { Exame, Modalidade } from '../src/exames/entities/exame.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'mobilemed_db_test',
          entities: [Paciente, Exame],
          synchronize: true,
          dropSchema: true, // Limpa o banco antes de cada teste
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Pacientes', () => {
    const validPaciente = {
      nome: 'João Silva',
      email: 'joao@email.com',
      data_nascimento: '1990-01-01',
      telefone: '(11) 99999-9999',
      endereco: 'Rua A, 123',
      documento_cpf: '123.456.789-00',
      sexo: Sexo.Masculino,
    };

    describe('POST /pacientes', () => {
      it('should create patient with valid data and return UUID (Cenário 1)', async () => {
        const response = await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPaciente)
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.nome).toBe(validPaciente.nome);
        expect(response.body.status).toBe(Status.Ativo);
        expect(response.body.data_cadastro).toBeDefined();
      });

      it('should return 409 when creating patient with existing CPF (Cenário 2)', async () => {
        // Primeiro, criar um paciente
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPaciente)
          .expect(201);

        // Tentar criar outro com o mesmo CPF
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPaciente)
          .expect(409);
      });

      it('should validate required fields', async () => {
        const invalidPaciente = {
          nome: 'João Silva',
          // email faltando
          data_nascimento: '1990-01-01',
          telefone: '(11) 99999-9999',
          endereco: 'Rua A, 123',
          documento_cpf: '123.456.789-00',
          sexo: Sexo.Masculino,
        };

        await request(app.getHttpServer())
          .post('/pacientes')
          .send(invalidPaciente)
          .expect(400);
      });
    });

    describe('GET /pacientes', () => {
      it('should return paginated list of patients (Cenário 8)', async () => {
        // Criar alguns pacientes
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPaciente);

        await request(app.getHttpServer())
          .post('/pacientes')
          .send({
            ...validPaciente,
            documento_cpf: '987.654.321-00',
            email: 'maria@email.com',
          });

        const response = await request(app.getHttpServer())
          .get('/pacientes?page=1&limit=10')
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(response.body.total).toBeDefined();
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(10);
        expect(response.body.data.length).toBeGreaterThan(0);
      });
    });

    describe('GET /pacientes/:id', () => {
      it('should return a patient by id', async () => {
        const createResponse = await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPaciente)
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/pacientes/${createResponse.body.id}`)
          .expect(200);

        expect(response.body.id).toBe(createResponse.body.id);
        expect(response.body.nome).toBe(validPaciente.nome);
      });

      it('should return 404 when patient not found', async () => {
        await request(app.getHttpServer())
          .get('/pacientes/non-existent-id')
          .expect(404);
      });
    });
  });

  describe('Exames', () => {
    let pacienteId: string;

    beforeEach(async () => {
      // Criar um paciente para usar nos testes
      const pacienteResponse = await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          nome: 'João Silva',
          email: 'joao@email.com',
          data_nascimento: '1990-01-01',
          telefone: '(11) 99999-9999',
          endereco: 'Rua A, 123',
          documento_cpf: '123.456.789-00',
          sexo: Sexo.Masculino,
        });

      pacienteId = pacienteResponse.body.id;
    });

    const validExame = {
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: '', // Será preenchido no beforeEach
      data_exame: '2024-01-15',
      idempotencyKey: 'unique-key-123',
    };

    describe('POST /exames', () => {
      it('should create exam with existing patient and new idempotencyKey (Cenário 3)', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        const response = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.nome_exame).toBe(examData.nome_exame);
        expect(response.body.modalidade).toBe(examData.modalidade);
        expect(response.body.id_paciente).toBe(pacienteId);
      });

      it('should return existing exam when reusing same idempotencyKey (Cenário 4)', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        // Primeira requisição
        const firstResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        // Segunda requisição com mesma idempotencyKey
        const secondResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(200);

        expect(secondResponse.body.id).toBe(firstResponse.body.id);
        expect(secondResponse.body.nome_exame).toBe(firstResponse.body.nome_exame);
      });

      it('should return 400 when patient does not exist (Cenário 6)', async () => {
        const examData = { ...validExame, id_paciente: 'non-existent-patient-id' };

        await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(400);
      });

      it('should return 400 when modalidade is invalid (Cenário 11)', async () => {
        const examData = {
          ...validExame,
          id_paciente: pacienteId,
          modalidade: 'INVALID',
        };

        await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(400);
      });

      it('should handle concurrent requests with same idempotencyKey (Cenário 5)', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        // Enviar múltiplas requisições simultâneas
        const promises = Array(5).fill(null).map(() =>
          request(app.getHttpServer())
            .post('/exames')
            .send(examData)
        );

        const responses = await Promise.all(promises);

        // Todas devem retornar sucesso
        responses.forEach(response => {
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(300);
        });

        // Verificar que apenas um exame foi criado
        const examesResponse = await request(app.getHttpServer())
          .get('/exames')
          .expect(200);

        const examesWithSameKey = examesResponse.body.data.filter(
          (exame: any) => exame.idempotencyKey === examData.idempotencyKey
        );

        expect(examesWithSameKey.length).toBe(1);
      });
    });

    describe('GET /exames', () => {
      it('should return paginated list of exams (Cenário 7)', async () => {
        // Criar alguns exames
        await request(app.getHttpServer())
          .post('/exames')
          .send({ ...validExame, id_paciente: pacienteId, idempotencyKey: 'key-1' });

        await request(app.getHttpServer())
          .post('/exames')
          .send({
            ...validExame,
            id_paciente: pacienteId,
            idempotencyKey: 'key-2',
            nome_exame: 'Tomografia',
            modalidade: Modalidade.CT,
          });

        const response = await request(app.getHttpServer())
          .get('/exames?page=1&limit=10')
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(response.body.total).toBeDefined();
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(10);
        expect(response.body.data.length).toBeGreaterThan(0);
      });
    });

    describe('GET /exames/:id', () => {
      it('should return an exam by id', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/exames/${createResponse.body.id}`)
          .expect(200);

        expect(response.body.id).toBe(createResponse.body.id);
        expect(response.body.nome_exame).toBe(examData.nome_exame);
      });

      it('should return 404 when exam not found', async () => {
        await request(app.getHttpServer())
          .get('/exames/non-existent-id')
          .expect(404);
      });
    });

    describe('PUT /exames/:id', () => {
      it('should update an exam successfully', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const updateData = {
          nome_exame: 'Tomografia Computadorizada Atualizada',
          modalidade: Modalidade.CT,
        };

        const response = await request(app.getHttpServer())
          .put(`/exames/${createResponse.body.id}`)
          .send(updateData)
          .expect(200);

        expect(response.body.nome_exame).toBe(updateData.nome_exame);
        expect(response.body.modalidade).toBe(updateData.modalidade);
      });
    });

    describe('DELETE /exames/:id', () => {
      it('should delete an exam successfully', async () => {
        const examData = { ...validExame, id_paciente: pacienteId };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/exames/${createResponse.body.id}`)
          .expect(200);

        // Verificar que foi deletado
        await request(app.getHttpServer())
          .get(`/exames/${createResponse.body.id}`)
          .expect(404);
      });
    });
  });

  describe('Validation', () => {
    it('should validate required fields in forms (Cenário 12)', async () => {
      // Testar validação de paciente
      const invalidPaciente = {
        nome: '', // Nome vazio
        email: 'invalid-email', // Email inválido
        data_nascimento: 'invalid-date', // Data inválida
        telefone: 'invalid-phone', // Telefone inválido
        endereco: '', // Endereço vazio
        documento_cpf: 'invalid-cpf', // CPF inválido
        sexo: 'Invalid', // Sexo inválido
      };

      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send(invalidPaciente)
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);
    });
  });
});

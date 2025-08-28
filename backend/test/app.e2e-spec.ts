import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Exame, Modalidade } from '../src/exames/entities/exame.entity';
import { Paciente, Sexo, Status } from '../src/pacientes/entities/paciente.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdPatientId: string;
  let createdExamId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Pacientes', () => {
    const validPatientData = {
      nome: 'João Silva',
      email: 'joao@email.com',
      data_nascimento: '1990-01-01',
      telefone: '(11) 99999-9999',
      endereco: 'Rua A, 123',
      documento_cpf: '123.456.789-00',
      sexo: Sexo.Masculino,
    };

    describe('POST /pacientes', () => {
      it('should create a patient with valid data and return UUID', async () => {
        const response = await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPatientData)
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.nome).toBe(validPatientData.nome);
        expect(response.body.status).toBe(Status.Ativo);
        
        createdPatientId = response.body.id;
      });

      it('should throw 409 error when CPF already exists', async () => {
        // Primeiro cria um paciente
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPatientData)
          .expect(201);

        // Tenta criar outro com o mesmo CPF
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPatientData)
          .expect(409);
      });

      it('should validate required fields', async () => {
        const invalidData = {
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
          .send(invalidData)
          .expect(400);
      });
    });

    describe('GET /pacientes', () => {
      it('should return paginated list of patients', async () => {
        // Primeiro cria um paciente
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPatientData)
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/pacientes?page=1&pageSize=10')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();
        expect(response.body.meta.total).toBeGreaterThan(0);
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.pageSize).toBe(10);
      });
    });

    describe('GET /pacientes/:id', () => {
      it('should return a patient by id', async () => {
        // Primeiro cria um paciente
        const createResponse = await request(app.getHttpServer())
          .post('/pacientes')
          .send(validPatientData)
          .expect(201);

        const patientId = createResponse.body.id;

        const response = await request(app.getHttpServer())
          .get(`/pacientes/${patientId}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(patientId);
        expect(response.body.nome).toBe(validPatientData.nome);
      });

      it('should return 404 when patient not found', async () => {
        await request(app.getHttpServer())
          .get('/pacientes/non-existent-id')
          .expect(404);
      });
    });
  });

  describe('Exames', () => {
    let patientId: string;

    beforeEach(async () => {
      // Criar um paciente para usar nos testes de exames
      const patientData = {
        nome: 'Maria Silva',
        email: 'maria@email.com',
        data_nascimento: '1985-05-15',
        telefone: '(11) 88888-8888',
        endereco: 'Rua B, 456',
        documento_cpf: '987.654.321-00',
        sexo: Sexo.Feminino,
      };

      const patientResponse = await request(app.getHttpServer())
        .post('/pacientes')
        .send(patientData)
        .expect(201);

      patientId = patientResponse.body.id;
    });

    const validExamData = (idempotencyKey: string) => ({
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: '', // Será preenchido no teste
      data_exame: '2024-01-15T10:00:00.000Z',
      idempotencyKey,
    });

    describe('POST /exames', () => {
      it('should create an exam with existing patient and new idempotencyKey', async () => {
        const examData = {
          ...validExamData('unique-key-123'),
          id_paciente: patientId,
        };

        const response = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.nome_exame).toBe(examData.nome_exame);
        expect(response.body.modalidade).toBe(examData.modalidade);
        expect(response.body.id_paciente).toBe(patientId);
        
        createdExamId = response.body.id;
      });

      it('should return existing exam when reusing same idempotencyKey', async () => {
        const examData = {
          ...validExamData('same-key-456'),
          id_paciente: patientId,
        };

        // Primeiro cria o exame
        const firstResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        // Tenta criar outro com a mesma chave de idempotência
        const secondResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(200);

        expect(secondResponse.body.id).toBe(firstResponse.body.id);
      });

      it('should throw 400 error when patient does not exist', async () => {
        const examData = {
          ...validExamData('invalid-patient-key'),
          id_paciente: 'non-existent-patient-id',
        };

        await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(400);
      });

      it('should throw 400 error when modalidade is invalid', async () => {
        const examData = {
          ...validExamData('invalid-modalidade-key'),
          id_paciente: patientId,
          modalidade: 'INVALID',
        };

        await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(400);
      });
    });

    describe('GET /exames', () => {
      it('should return paginated list of exams (10 per page)', async () => {
        // Primeiro cria um exame
        const examData = {
          ...validExamData('list-test-key'),
          id_paciente: patientId,
        };

        await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/exames?page=1&pageSize=10')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();
        expect(response.body.meta.total).toBeGreaterThan(0);
        expect(response.body.meta.page).toBe(1);
        expect(response.body.meta.pageSize).toBe(10);
      });
    });

    describe('GET /exames/:id', () => {
      it('should return an exam by id', async () => {
        // Primeiro cria um exame
        const examData = {
          ...validExamData('get-test-key'),
          id_paciente: patientId,
        };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const examId = createResponse.body.id;

        const response = await request(app.getHttpServer())
          .get(`/exames/${examId}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(examId);
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
        // Primeiro cria um exame
        const examData = {
          ...validExamData('update-test-key'),
          id_paciente: patientId,
        };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const examId = createResponse.body.id;

        const updateData = {
          nome_exame: 'Tomografia Computadorizada',
          modalidade: Modalidade.CT,
        };

        const response = await request(app.getHttpServer())
          .put(`/exames/${examId}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.nome_exame).toBe(updateData.nome_exame);
        expect(response.body.modalidade).toBe(updateData.modalidade);
      });

      it('should return 404 when updating non-existent exam', async () => {
        const updateData = {
          nome_exame: 'Tomografia Computadorizada',
          modalidade: Modalidade.CT,
        };

        await request(app.getHttpServer())
          .put('/exames/non-existent-id')
          .send(updateData)
          .expect(404);
      });
    });

    describe('DELETE /exames/:id', () => {
      it('should remove an exam successfully', async () => {
        // Primeiro cria um exame
        const examData = {
          ...validExamData('delete-test-key'),
          id_paciente: patientId,
        };

        const createResponse = await request(app.getHttpServer())
          .post('/exames')
          .send(examData)
          .expect(201);

        const examId = createResponse.body.id;

        await request(app.getHttpServer())
          .delete(`/exames/${examId}`)
          .expect(200);

        // Verifica se o exame foi realmente removido
        await request(app.getHttpServer())
          .get(`/exames/${examId}`)
          .expect(404);
      });

      it('should return 404 when removing non-existent exam', async () => {
        await request(app.getHttpServer())
          .delete('/exames/non-existent-id')
          .expect(404);
      });
    });
  });
});

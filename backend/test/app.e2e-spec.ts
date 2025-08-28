import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'mobilemed_test',
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('Idempotency Tests', () => {
    it('should handle multiple requests with same idempotencyKey', async () => {
      const idempotencyKey = 'test-idempotency-key-' + Date.now();
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'test-patient-id',
        data_exame: '2024-01-15T10:00:00.000Z',
        idempotencyKey,
      };

      // First request
      const response1 = await request(app.getHttpServer())
        .post('/exames')
        .send(examData)
        .expect(201);

      // Second request with same idempotencyKey
      const response2 = await request(app.getHttpServer())
        .post('/exames')
        .send(examData)
        .expect(200);

      // Both responses should be identical
      expect(response1.body.id).toBe(response2.body.id);
      expect(response1.body.idempotencyKey).toBe(idempotencyKey);
      expect(response2.body.idempotencyKey).toBe(idempotencyKey);
    });

    it('should handle concurrent requests with same idempotencyKey', async () => {
      const idempotencyKey = 'concurrent-test-' + Date.now();
      const examData = {
        nome_exame: 'Tomografia Computadorizada',
        modalidade: 'CT',
        id_paciente: 'test-patient-id',
        data_exame: '2024-01-15T10:00:00.000Z',
        idempotencyKey,
      };

      // Send multiple concurrent requests
      const promises = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/exames')
          .send(examData)
      );

      const responses = await Promise.all(promises);

      // All responses should have the same status (either 201 or 200)
      const statusCodes = responses.map(r => r.status);
      expect(statusCodes.every(code => code === 201 || code === 200)).toBe(true);

      // All successful responses should have the same exam ID
      const examIds = responses
        .filter(r => r.status === 200 || r.status === 201)
        .map(r => r.body.id);
      
      if (examIds.length > 0) {
        expect(examIds.every(id => id === examIds[0])).toBe(true);
      }
    });
  });

  describe('Pagination Tests', () => {
    it('should return paginated results', async () => {
      const response = await request(app.getHttpServer())
        .get('/exames?page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('pageSize');
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.pageSize).toBe(10);
    });

    it('should handle different page sizes', async () => {
      const response = await request(app.getHttpServer())
        .get('/exames?page=2&limit=5')
        .expect(200);

      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.pageSize).toBe(5);
    });
  });

  describe('Error Handling Tests', () => {
    it('should return 400 for invalid exam data', async () => {
      const invalidExamData = {
        nome_exame: 'Test Exam',
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/exames')
        .send(invalidExamData)
        .expect(400);
    });

    it('should return 404 for non-existent exam', async () => {
      await request(app.getHttpServer())
        .get('/exames/non-existent-id')
        .expect(404);
    });

    it('should return 404 for non-existent patient', async () => {
      await request(app.getHttpServer())
        .get('/pacientes/non-existent-id')
        .expect(404);
    });
  });
});

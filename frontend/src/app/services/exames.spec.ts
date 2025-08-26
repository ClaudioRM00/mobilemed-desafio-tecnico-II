import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExamesService } from './exames';
import { environment } from '../../environments/environment';

describe('ExamesService', () => {
  let service: ExamesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExamesService]
    });
    service = TestBed.inject(ExamesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExames', () => {
    it('should return paginated list of exams', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            nome_exame: 'Ressonância Magnética',
            modalidade: 'MR',
            id_paciente: 'patient-1',
            data_exame: '2024-01-15',
            idempotencyKey: 'unique-key-123',
            data_cadastro: '2024-01-01T00:00:00Z',
            data_atualizacao: '2024-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      service.getExames(1, 10).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames?page=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle network errors gracefully', () => {
      service.getExames(1, 10).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames?page=1&limit=10`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getExame', () => {
    it('should return an exam by id', () => {
      const mockExame = {
        id: '1',
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.getExame('1').subscribe(response => {
        expect(response).toEqual(mockExame);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExame);
    });

    it('should handle 404 error when exam not found', () => {
      service.getExame('999').subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createExame', () => {
    it('should create an exam with existing patient and new idempotencyKey (Cenário 3)', () => {
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123'
      };

      const mockResponse = {
        id: '1',
        ...examData,
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.createExame(examData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(examData);
      req.flush(mockResponse);
    });

    it('should return existing exam when reusing same idempotencyKey (Cenário 4)', () => {
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123'
      };

      const existingExam = {
        id: '1',
        ...examData,
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.createExame(examData).subscribe(response => {
        expect(response).toEqual(existingExam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames`);
      req.flush(existingExam);
    });

    it('should handle 400 error when patient does not exist (Cenário 6)', () => {
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'non-existent-patient',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123'
      };

      service.createExame(examData).subscribe({
        next: () => fail('should have failed with 400'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 400 error when modalidade is invalid (Cenário 11)', () => {
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'INVALID',
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123'
      };

      service.createExame(examData).subscribe({
        next: () => fail('should have failed with 400'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames`);
      req.flush(
        { message: ['Modalidade inválida'] },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle network errors and show retry button (Cenário 10)', () => {
      const examData = {
        nome_exame: 'Ressonância Magnética',
        modalidade: 'MR',
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123'
      };

      service.createExame(examData).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('updateExame', () => {
    it('should update an exam successfully', () => {
      const updateData = {
        nome_exame: 'Tomografia Computadorizada',
        modalidade: 'CT'
      };

      const mockResponse = {
        id: '1',
        ...updateData,
        id_paciente: 'patient-1',
        data_exame: '2024-01-15',
        idempotencyKey: 'unique-key-123',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.updateExame('1', updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteExame', () => {
    it('should delete an exam successfully', () => {
      service.deleteExame('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getExamesByPatient', () => {
    it('should return exams by patient id', () => {
      const mockExams = [
        {
          id: '1',
          nome_exame: 'Ressonância Magnética',
          modalidade: 'MR',
          id_paciente: 'patient-1',
          data_exame: '2024-01-15',
          idempotencyKey: 'unique-key-123',
          data_cadastro: '2024-01-01T00:00:00Z',
          data_atualizacao: '2024-01-01T00:00:00Z'
        }
      ];

      service.getExamesByPatient('patient-1').subscribe(response => {
        expect(response).toEqual(mockExams);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/exames?id_paciente=patient-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExams);
    });
  });
});

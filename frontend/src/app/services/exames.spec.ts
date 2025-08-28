import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExamesService, ExameDto } from './exames';
import { Modalidade } from '../shared/utils/modalidade.utils';

describe('ExamesService', () => {
  let service: ExamesService;
  let httpMock: HttpTestingController;

  const mockExame: ExameDto = {
    id: 'test-id',
    nome_exame: 'Ressonância Magnética',
    modalidade: 'MR' as Modalidade,
    id_paciente: 'patient-id',
    data_exame: '2024-01-15T10:00:00.000Z',
    idempotencyKey: 'test-key-123',
  };

  const mockPaginatedResponse = {
    data: [mockExame],
    meta: {
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExamesService],
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

  describe('list', () => {
    it('should return paginated list of exams', () => {
      service.list(1, 10).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
        expect(response.data.length).toBe(1);
        expect(response.meta.total).toBe(1);
      });

      const req = httpMock.expectOne('/api/exames?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should use default pagination parameters', () => {
      service.list().subscribe();

      const req = httpMock.expectOne('/api/exames?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('create', () => {
    it('should create an exam successfully', () => {
      const createDto: ExameDto = {
        nome_exame: 'Tomografia',
        modalidade: 'CT' as Modalidade,
        id_paciente: 'patient-id',
        data_exame: '2024-01-15T10:00:00.000Z',
        idempotencyKey: 'new-key-456',
      };

      service.create(createDto).subscribe(response => {
        expect(response).toEqual(mockExame);
      });

      const req = httpMock.expectOne('/api/exames');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockExame);
    });

    it('should handle creation errors', () => {
      const createDto: ExameDto = {
        nome_exame: 'Invalid Exam',
        modalidade: 'CT' as Modalidade,
        id_paciente: 'non-existent-patient',
        data_exame: '2024-01-15T10:00:00.000Z',
        idempotencyKey: 'error-key',
      };

      service.create(createDto).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('/api/exames');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getById', () => {
    it('should get an exam by id', () => {
      service.getById('test-id').subscribe(response => {
        expect(response).toEqual(mockExame);
      });

      const req = httpMock.expectOne('/api/exames/test-id');
      expect(req.request.method).toBe('GET');
      req.flush(mockExame);
    });

    it('should handle not found errors', () => {
      service.getById('non-existent-id').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('/api/exames/non-existent-id');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('update', () => {
    it('should update an exam successfully', () => {
      const updateDto = {
        nome_exame: 'Updated Exam',
        modalidade: 'US' as Modalidade,
      };

      const updatedExame = { ...mockExame, ...updateDto };

      service.update('test-id', updateDto).subscribe(response => {
        expect(response).toEqual(updatedExame);
      });

      const req = httpMock.expectOne('/api/exames/test-id');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush(updatedExame);
    });

    it('should handle update errors', () => {
      const updateDto = {
        modalidade: 'INVALID' as any,
      };

      service.update('test-id', updateDto).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('/api/exames/test-id');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });
});

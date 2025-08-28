import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacientesService, PacienteDto } from './pacientes';

describe('PacientesService', () => {
  let service: PacientesService;
  let httpMock: HttpTestingController;

  const mockPaciente: PacienteDto = {
    id: 'test-id',
    nome: 'João Silva',
    email: 'joao@email.com',
    data_nascimento: '1990-01-01',
    telefone: '(11) 99999-9999',
    endereco: 'Rua A, 123',
    documento_cpf: '123.456.789-00',
    sexo: 'Masculino',
    status: 'Ativo',
  };

  const mockPaginatedResponse = {
    data: [mockPaciente],
    meta: {
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacientesService],
    });

    service = TestBed.inject(PacientesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should return paginated list of patients', () => {
      service.list(1, 10).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
        expect(response.data.length).toBe(1);
        expect(response.meta.total).toBe(1);
      });

      const req = httpMock.expectOne('/api/pacientes?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should use default pagination parameters', () => {
      service.list().subscribe();

      const req = httpMock.expectOne('/api/pacientes?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should include search parameter when provided', () => {
      service.list(1, 10, 'João').subscribe();

      const req = httpMock.expectOne('/api/pacientes?page=1&pageSize=10&search=Jo%C3%A3o');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle different page and pageSize values', () => {
      service.list(2, 5).subscribe();

      const req = httpMock.expectOne('/api/pacientes?page=2&pageSize=5');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('create', () => {
    it('should create a patient successfully', () => {
      const createDto: PacienteDto = {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        data_nascimento: '1985-05-15',
        telefone: '(11) 88888-8888',
        endereco: 'Rua B, 456',
        documento_cpf: '987.654.321-00',
        sexo: 'Feminino',
        status: 'Ativo',
      };

      service.create(createDto).subscribe(response => {
        expect(response).toEqual(mockPaciente);
      });

      const req = httpMock.expectOne('/api/pacientes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockPaciente);
    });

    it('should handle creation errors', () => {
      const createDto: PacienteDto = {
        nome: 'Invalid Patient',
        email: 'invalid@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino',
        status: 'Ativo',
      };

      service.create(createDto).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('/api/pacientes');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getById', () => {
    it('should get a patient by id', () => {
      service.getById('test-id').subscribe(response => {
        expect(response).toEqual(mockPaciente);
      });

      const req = httpMock.expectOne('/api/pacientes/test-id');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaciente);
    });

    it('should handle not found errors', () => {
      service.getById('non-existent-id').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('/api/pacientes/non-existent-id');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('update', () => {
    it('should update a patient successfully', () => {
      const updateDto: PacienteDto = {
        nome: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino',
        status: 'Ativo',
      };

      const updatedPaciente = { ...mockPaciente, ...updateDto };

      service.update('test-id', updateDto).subscribe(response => {
        expect(response).toEqual(updatedPaciente);
      });

      const req = httpMock.expectOne('/api/pacientes/test-id');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateDto);
      req.flush(updatedPaciente);
    });

    it('should handle update errors', () => {
      const updateDto: PacienteDto = {
        nome: 'Invalid Name',
        email: 'invalid@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino',
        status: 'Ativo',
      };

      service.update('test-id', updateDto).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('/api/pacientes/test-id');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });
});

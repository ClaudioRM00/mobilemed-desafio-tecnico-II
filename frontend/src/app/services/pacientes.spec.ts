import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacientesService } from './pacientes';
import { environment } from '../../environments/environment';

describe('PacientesService', () => {
  let service: PacientesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacientesService]
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

  describe('getPacientes', () => {
    it('should return paginated list of patients', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            nome: 'João Silva',
            email: 'joao@email.com',
            data_nascimento: '1990-01-01',
            telefone: '(11) 99999-9999',
            endereco: 'Rua A, 123',
            documento_cpf: '123.456.789-00',
            sexo: 'Masculino',
            status: 'Ativo',
            data_cadastro: '2024-01-01T00:00:00Z',
            data_atualizacao: '2024-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      service.getPacientes(1, 10).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes?page=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle network errors gracefully', () => {
      service.getPacientes(1, 10).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes?page=1&limit=10`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getPaciente', () => {
    it('should return a patient by id', () => {
      const mockPaciente = {
        id: '1',
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.getPaciente('1').subscribe(response => {
        expect(response).toEqual(mockPaciente);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaciente);
    });

    it('should handle 404 error when patient not found', () => {
      service.getPaciente('999').subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPaciente', () => {
    it('should create a patient successfully', () => {
      const pacienteData = {
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino'
      };

      const mockResponse = {
        id: '1',
        ...pacienteData,
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.createPaciente(pacienteData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(pacienteData);
      req.flush(mockResponse);
    });

    it('should handle 409 error when CPF already exists', () => {
      const pacienteData = {
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino'
      };

      service.createPaciente(pacienteData).subscribe({
        next: () => fail('should have failed with 409'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });

    it('should handle validation errors (400)', () => {
      const invalidPacienteData = {
        nome: '',
        email: 'invalid-email',
        data_nascimento: 'invalid-date',
        telefone: 'invalid-phone',
        endereco: '',
        documento_cpf: 'invalid-cpf',
        sexo: 'Invalid'
      };

      service.createPaciente(invalidPacienteData).subscribe({
        next: () => fail('should have failed with 400'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes`);
      req.flush(
        { message: ['Nome é obrigatório', 'Email inválido'] },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('updatePaciente', () => {
    it('should update a patient successfully', () => {
      const updateData = {
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@email.com'
      };

      const mockResponse = {
        id: '1',
        ...updateData,
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino',
        status: 'Ativo',
        data_cadastro: '2024-01-01T00:00:00Z',
        data_atualizacao: '2024-01-01T00:00:00Z'
      };

      service.updatePaciente('1', updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deletePaciente', () => {
    it('should delete a patient successfully', () => {
      service.deletePaciente('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});

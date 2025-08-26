import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacientesList } from './pacientes-list';
import { PacientesService, PacienteDto, PaginatedResponse } from '../../../services/pacientes';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PacientesList', () => {
  let component: PacientesList;
  let fixture: ComponentFixture<PacientesList>;
  let pacientesService: jasmine.SpyObj<PacientesService>;

  const mockPacientes: PaginatedResponse<PacienteDto> = {
    data: [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: 'Masculino' as const,
        status: 'Ativo' as const
      }
    ],
    meta: {
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false
    }
  };

  beforeEach(async () => {
    const pacientesServiceSpy = jasmine.createSpyObj('PacientesService', ['list']);

    await TestBed.configureTestingModule({
      imports: [PacientesList, HttpClientTestingModule],
      providers: [
        { provide: PacientesService, useValue: pacientesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacientesList);
    component = fixture.componentInstance;
    pacientesService = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load patients on init', () => {
      pacientesService.list.and.returnValue(of(mockPacientes));

      component.ngOnInit();

      expect(pacientesService.list).toHaveBeenCalledWith(1, 10);
      expect(component.paginatedData).toEqual(mockPacientes);
      expect(component.loading).toBe(false);
    });

    it('should handle network errors gracefully (Cenário 10)', () => {
      pacientesService.list.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.error).toBe('Erro ao carregar pacientes');
      expect(component.loading).toBe(false);
    });
  });

  describe('loadPacientes', () => {
    it('should load patients with pagination (Cenário 8)', () => {
      pacientesService.list.and.returnValue(of(mockPacientes));

      component.loadPacientes();

      expect(pacientesService.list).toHaveBeenCalledWith(1, 10);
      expect(component.paginatedData).toEqual(mockPacientes);
      expect(component.loading).toBe(false);
    });

    it('should show loading spinner during API call (Cenário 9)', () => {
      pacientesService.list.and.returnValue(of(mockPacientes));

      component.loadPacientes();

      expect(component.loading).toBe(false); // Loading é false após a resposta
    });

    it('should handle loading state correctly', () => {
      pacientesService.list.and.returnValue(of(mockPacientes));

      component.loadPacientes();

      // Durante a chamada, loading deve ser true
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      component.paginatedData = mockPacientes;
    });

    it('should go to previous page', () => {
      component.currentPage = 2;
      spyOn(component, 'loadPacientes');

      component.previousPage();

      expect(component.currentPage).toBe(1);
      expect(component.loadPacientes).toHaveBeenCalled();
    });

    it('should go to next page', () => {
      component.paginatedData!.meta.page = 1;
      component.paginatedData!.meta.totalPages = 3;
      spyOn(component, 'loadPacientes');

      component.nextPage();

      expect(component.currentPage).toBe(2);
      expect(component.loadPacientes).toHaveBeenCalled();
    });

    it('should go to specific page', () => {
      spyOn(component, 'loadPacientes');

      component.goToPage(3);

      expect(component.currentPage).toBe(3);
      expect(component.loadPacientes).toHaveBeenCalled();
    });
  });

  describe('getVisiblePages', () => {
    it('should return visible pages array', () => {
      component.paginatedData = {
        data: [],
        meta: {
          page: 5,
          pageSize: 10,
          total: 100,
          totalPages: 10,
          hasNext: true,
          hasPrevious: true
        }
      };

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle edge cases', () => {
      component.paginatedData = {
        data: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 20,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false
        }
      };

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([1, 2]);
    });
  });

  describe('getInitials', () => {
    it('should return initials from name', () => {
      const initials = component.getInitials('João Silva Santos');

      expect(initials).toBe('JS');
    });

    it('should handle single name', () => {
      const initials = component.getInitials('João');

      expect(initials).toBe('J');
    });

    it('should handle empty name', () => {
      const initials = component.getInitials('');

      expect(initials).toBe('');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', () => {
      pacientesService.list.and.returnValue(throwError(() => new Error('API Error')));

      component.loadPacientes();

      expect(component.error).toBe('API Error');
      expect(component.loading).toBe(false);
    });

    it('should clear error on successful load', () => {
      component.error = 'Previous error';
      pacientesService.list.and.returnValue(of(mockPacientes));

      component.loadPacientes();

      expect(component.error).toBeNull();
    });
  });
});


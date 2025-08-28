import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PacientesList } from './pacientes-list';
import { PacientesService, PacienteDto, PaginatedResponse } from '../../../services/pacientes';

describe('PacientesList', () => {
  let component: PacientesList;
  let fixture: ComponentFixture<PacientesList>;
  let pacientesService: jasmine.SpyObj<PacientesService>;

  const mockPacienteDto: PacienteDto = {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    documento_cpf: '12345678901',
    telefone: '11999999999',
    data_nascimento: '1990-01-01',
    sexo: 'Masculino',
    endereco: 'Rua das Flores, 123',
    status: 'Ativo'
  };

  const mockPaginatedResponse: PaginatedResponse<PacienteDto> = {
    data: [mockPacienteDto],
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
      imports: [PacientesList, RouterTestingModule],
      providers: [
        { provide: PacientesService, useValue: pacientesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacientesList);
    component = fixture.componentInstance;
    pacientesService = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
    // Resetar mocks e estado antes de cada teste
    pacientesService.list.calls.reset();
    component.loading = false;
    component.error = null;
    component.paginatedData = null;
    component.currentPage = 1;
    component.pageSize = 10;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Math property', () => {
    expect(component.Math).toBe(Math);
  });

  describe('ngOnInit', () => {
    it('should call loadPacientes on init', () => {
      spyOn(component, 'loadPacientes');
      pacientesService.list.and.returnValue(of(mockPaginatedResponse));
      
      component.ngOnInit();
      
      expect(component.loadPacientes).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('loadPacientes', () => {
    it('should load pacientes successfully', fakeAsync(() => {
      pacientesService.list.and.returnValue(of(mockPaginatedResponse));
      
      component.loadPacientes();
      tick();
      fixture.detectChanges();
      
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
      expect(pacientesService.list).toHaveBeenCalledWith(1, 10);
      expect(component.paginatedData).toEqual(mockPaginatedResponse);
    }));

    it('should handle error when loading pacientes', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar pacientes';
      pacientesService.list.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.loadPacientes();
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe(errorMessage);
      expect(component.loading).toBe(false);
    }));

    it('should handle error without message', fakeAsync(() => {
      pacientesService.list.and.returnValue(throwError(() => ({})));
      
      component.loadPacientes();
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe('Erro ao carregar pacientes');
      expect(component.loading).toBe(false);
    }));
  });

  describe('pagination methods', () => {
    beforeEach(() => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 2,
          pageSize: 10,
          total: 20,
          totalPages: 3,
          hasNext: true,
          hasPrevious: true
        }
      };
      spyOn(component, 'loadPacientes');
    });

    it('should go to previous page', () => {
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadPacientes).toHaveBeenCalled();
    });

    it('should not go to previous page when on first page', () => {
      component.paginatedData!.meta.page = 1;
      
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadPacientes).not.toHaveBeenCalled();
    });

    it('should go to next page', () => {
      component.nextPage();
      
      expect(component.currentPage).toBe(3);
      expect(component.loadPacientes).toHaveBeenCalled();
    });

    it('should not go to next page when on last page', () => {
      component.paginatedData!.meta.page = 3;
      
      component.nextPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadPacientes).not.toHaveBeenCalled();
    });

    it('should go to specific page', () => {
      component.goToPage(3);
      
      expect(component.currentPage).toBe(3);
      expect(component.loadPacientes).toHaveBeenCalled();
    });
  });

  describe('getVisiblePages', () => {
    it('should return visible pages around current page', () => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 5,
          pageSize: 10,
          total: 100,
          totalPages: 10,
          hasNext: true,
          hasPrevious: true
        }
      };
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle first page', () => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 1,
          pageSize: 10,
          total: 100,
          totalPages: 10,
          hasNext: true,
          hasPrevious: false
        }
      };
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle last page', () => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 10,
          pageSize: 10,
          total: 100,
          totalPages: 10,
          hasNext: false,
          hasPrevious: true
        }
      };
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([8, 9, 10]);
    });

    it('should return empty array when no paginated data', () => {
      component.paginatedData = null;
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([]);
    });

    it('should handle single page', () => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 1,
          pageSize: 10,
          total: 5,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        }
      };
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([1]);
    });

    it('should handle two pages', () => {
      component.paginatedData = {
        ...mockPaginatedResponse,
        meta: {
          page: 1,
          pageSize: 10,
          total: 15,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false
        }
      };
      
      const result = component.getVisiblePages();
      
      expect(result).toEqual([1, 2]);
    });
  });

  describe('getInitials', () => {
    it('should return initials from name', () => {
      const result = component.getInitials('João Silva Santos');
      
      expect(result).toBe('JS');
    });

    it('should handle single name', () => {
      const result = component.getInitials('João');
      
      expect(result).toBe('J');
    });

    it('should handle empty name', () => {
      const result = component.getInitials('');
      
      expect(result).toBe('');
    });

    it('should handle name with multiple spaces', () => {
      const result = component.getInitials('João   Silva');
      
      expect(result).toBe('JS');
    });

    it('should handle name with special characters', () => {
      const result = component.getInitials('João-Maria Silva');
      
      expect(result).toBe('JS');
    });

    it('should handle name with numbers', () => {
      const result = component.getInitials('João Silva 123');
      
      expect(result).toBe('JS');
    });

    it('should handle very long name', () => {
      const result = component.getInitials('João Silva Santos Oliveira Costa');
      
      expect(result).toBe('JS');
    });

    it('should handle name with only spaces', () => {
      const result = component.getInitials('   ');
      
      expect(result).toBe('');
    });
  });

  describe('component state', () => {
    it('should initialize with default values', () => {
      expect(component.paginatedData).toBeNull();
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(10);
    });

    it('should update state when loading', fakeAsync(() => {
      pacientesService.list.and.returnValue(of(mockPaginatedResponse));
      
      component.loadPacientes();
      tick();
      fixture.detectChanges();
      
      expect(component.loading).toBe(false);
      expect(component.paginatedData).toEqual(mockPaginatedResponse);
    }));

    it('should update state when error occurs', () => {
      pacientesService.list.and.returnValue(throwError(() => new Error('Test error')));
      
      component.loadPacientes();
      
      // Simular resposta assíncrona
      fixture.detectChanges();
      
      expect(component.loading).toBe(false);
      expect(component.error).toBe('Test error');
    });
  });
});

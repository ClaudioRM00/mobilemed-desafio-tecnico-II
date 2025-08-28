import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ExamesList } from './exames-list';
import { ExamesService, ExameDto, PaginatedResponse } from '../../../services/exames';
import { PacientesService, PacienteDto } from '../../../services/pacientes';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ExamesList', () => {
  let component: ExamesList;
  let fixture: ComponentFixture<ExamesList>;
  let examesService: jasmine.SpyObj<ExamesService>;
  let pacientesService: jasmine.SpyObj<PacientesService>;

  const mockExameDto: ExameDto = {
    id: '1',
    id_paciente: 'paciente1',
    nome_exame: 'Tomografia do Tórax',
    modalidade: 'CT',
    data_exame: '2024-01-15T10:00:00Z',
    idempotencyKey: 'key123'
  };

  const mockPacienteDto: PacienteDto = {
    id: 'paciente1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    data_nascimento: '1990-01-01',
    endereco: 'Rua das Flores, 123',
    documento_cpf: '12345678901',
    sexo: 'Masculino',
    status: 'Ativo'
  };

  const mockPaginatedResponse: PaginatedResponse<ExameDto> = {
    data: [mockExameDto],
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
    const examesServiceSpy = jasmine.createSpyObj('ExamesService', ['list']);
    const pacientesServiceSpy = jasmine.createSpyObj('PacientesService', ['getById']);
    // Mock padrão para getById sempre retorna of(mockPacienteDto)
    pacientesServiceSpy.getById.and.returnValue(of(mockPacienteDto));

    await TestBed.configureTestingModule({
      imports: [ExamesList, RouterTestingModule],
      providers: [
        { provide: ExamesService, useValue: examesServiceSpy },
        { provide: PacientesService, useValue: pacientesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamesList);
    component = fixture.componentInstance;
    examesService = TestBed.inject(ExamesService) as jasmine.SpyObj<ExamesService>;
    pacientesService = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
    
    // Garantir que o mock está configurado antes do ngOnInit
    pacientesService.getById.and.returnValue(of(mockPacienteDto));
    
    // Evitar que o ngOnInit seja chamado automaticamente
    spyOn(component, 'ngOnInit');
  });

  beforeEach(() => {
    // Resetar mocks e estado antes de cada teste
    examesService.list.calls.reset();
    pacientesService.getById.calls.reset();
    pacientesService.getById.and.returnValue(of(mockPacienteDto));
    component.loading = false;
    component.error = null;
    component.paginatedData = null;
    component.currentPage = 1;
    component.pageSize = 10;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('loadExames', () => {
    it('should load exames successfully', fakeAsync(() => {
      examesService.list.and.returnValue(of(mockPaginatedResponse));
      spyOn(component, 'cleanPacientesCache');
      spyOn(component, 'loadPacientesData');
      
      component.loadExames();
      tick();
      fixture.detectChanges();
      
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
      expect(examesService.list).toHaveBeenCalledWith(1, 10);
      expect(component.paginatedData).toEqual(mockPaginatedResponse);
      expect(component.cleanPacientesCache).toHaveBeenCalled();
      expect(component.loadPacientesData).toHaveBeenCalled();
    }));

    it('should handle error when loading exames', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar exames';
      examesService.list.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.loadExames();
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe(errorMessage);
      expect(component.loading).toBe(false);
    }));

    it('should handle error without message', fakeAsync(() => {
      examesService.list.and.returnValue(throwError(() => ({})));
      
      component.loadExames();
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe('Erro ao carregar exames');
      expect(component.loading).toBe(false);
    }));
  });

  describe('cleanPacientesCache', () => {
    it('should clean unused pacientes from cache', () => {
      component.paginatedData = mockPaginatedResponse;
      component.pacientesCache = {
        'paciente1': mockPacienteDto,
        'paciente2': { ...mockPacienteDto, id: 'paciente2' }
      };
      component.pacientesLoading = {
        'paciente1': false,
        'paciente2': false
      };
      
      component.cleanPacientesCache();
      
      expect(component.pacientesCache['paciente1']).toBeDefined();
      expect(component.pacientesCache['paciente2']).toBeUndefined();
      expect(component.pacientesLoading['paciente1']).toBeDefined();
      expect(component.pacientesLoading['paciente2']).toBeUndefined();
    });

    it('should do nothing when paginatedData is null', () => {
      component.paginatedData = null;
      component.pacientesCache = { 'paciente1': mockPacienteDto };
      
      component.cleanPacientesCache();
      
      expect(component.pacientesCache['paciente1']).toBeDefined();
    });
  });

  describe('loadPacientesData', () => {
    it('should load pacientes data for exames', () => {
      component.paginatedData = mockPaginatedResponse;
      component.pacientesCache = {};
      component.pacientesLoading = {};
      spyOn(component, 'loadPaciente');
      
      component.loadPacientesData();
      
      expect(component.loadPaciente).toHaveBeenCalledWith('paciente1');
    });

    it('should not load paciente if already in cache', () => {
      component.paginatedData = mockPaginatedResponse;
      component.pacientesCache = { 'paciente1': mockPacienteDto };
      component.pacientesLoading = {};
      spyOn(component, 'loadPaciente');
      
      component.loadPacientesData();
      
      expect(component.loadPaciente).not.toHaveBeenCalled();
    });

    it('should not load paciente if already loading', () => {
      component.paginatedData = mockPaginatedResponse;
      component.pacientesCache = {};
      component.pacientesLoading = { 'paciente1': true };
      spyOn(component, 'loadPaciente');
      
      component.loadPacientesData();
      
      expect(component.loadPaciente).not.toHaveBeenCalled();
    });

    it('should do nothing when paginatedData is null', () => {
      component.paginatedData = null;
      spyOn(component, 'loadPaciente');
      
      component.loadPacientesData();
      
      expect(component.loadPaciente).not.toHaveBeenCalled();
    });
  });



  describe('getPacienteNome', () => {
    it('should return paciente name when in cache', () => {
      component.pacientesCache['paciente1'] = mockPacienteDto;
      
      const result = component.getPacienteNome('paciente1');
      
      expect(result).toBe('João Silva');
    });

    it('should return loading message when loading', () => {
      component.pacientesLoading['paciente1'] = true;
      
      const result = component.getPacienteNome('paciente1');
      
      expect(result).toBe('Carregando...');
    });

    it('should return ID when not in cache and not loading', () => {
      const result = component.getPacienteNome('paciente1');
      
      expect(result).toBe('ID: paciente1');
    });
  });

  describe('getPacienteStatus', () => {
    it('should return paciente status when in cache', () => {
      component.pacientesCache['paciente1'] = mockPacienteDto;
      
      const result = component.getPacienteStatus('paciente1');
      
      expect(result).toBe('Ativo');
    });

    it('should return null when not in cache', () => {
      const result = component.getPacienteStatus('paciente1');
      
      expect(result).toBeNull();
    });
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
      spyOn(component, 'loadExames');
    });

    it('should go to previous page', () => {
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadExames).toHaveBeenCalled();
    });

    it('should not go to previous page when on first page', () => {
      component.paginatedData!.meta.page = 1;
      
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadExames).not.toHaveBeenCalled();
    });

    it('should go to next page', () => {
      component.nextPage();
      
      expect(component.currentPage).toBe(3);
      expect(component.loadExames).toHaveBeenCalled();
    });

    it('should not go to next page when on last page', () => {
      component.paginatedData!.meta.page = 3;
      
      component.nextPage();
      
      expect(component.currentPage).toBe(1);
      expect(component.loadExames).not.toHaveBeenCalled();
    });

    it('should go to specific page', () => {
      component.goToPage(3);
      
      expect(component.currentPage).toBe(3);
      expect(component.loadExames).toHaveBeenCalled();
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
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = component.formatDate('2024-01-15T10:00:00Z');
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('getModalidadeLabel', () => {
    it('should return modalidade label', () => {
      const result = component.getModalidadeLabel('CT');
      
      expect(result).toBe('CT - Tomografia Computadorizada');
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
  });
});

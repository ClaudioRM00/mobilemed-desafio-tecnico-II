import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PacienteForm } from './paciente-form';
import { PacientesService, PacienteDto } from '../../../services/pacientes';
import { fakeAsync, tick } from '@angular/core/testing';
import { LocationStrategy } from '@angular/common';

describe('PacienteForm', () => {
  let component: PacienteForm;
  let fixture: ComponentFixture<PacienteForm>;
  let pacientesService: jasmine.SpyObj<PacientesService>;
  let router: Router;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockPacienteDto: PacienteDto = {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    documento_cpf: '12345678901',
    telefone: '11999999999',
    data_nascimento: '1990-01-01',
    sexo: 'Masculino', // Corrigido para valor do tipo
    endereco: 'Rua das Flores, 123',
    status: 'Ativo' // Corrigido para valor do tipo
  };

  beforeEach(async () => {
    const pacientesServiceSpy = jasmine.createSpyObj('PacientesService', ['getById', 'create', 'update']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({})
    });

    await TestBed.configureTestingModule({
      imports: [
        PacienteForm, 
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([
          { path: 'pacientes', component: class DummyComponent {} }
        ])
      ],
      providers: [
        { provide: PacientesService, useValue: pacientesServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LocationStrategy, useValue: { prepareExternalUrl: () => '' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteForm);
    component = fixture.componentInstance;
    pacientesService = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('documento_cpf')?.value).toBe('');
    expect(component.form.get('telefone')?.value).toBe('');
    expect(component.form.get('data_nascimento')?.value).toBe('');
    expect(component.form.get('sexo')?.value).toBe('');
    expect(component.form.get('endereco')?.value).toBe('');
    expect(component.form.get('status')?.value).toBe('Ativo');
  });

  it('should have required validators', () => {
    const nomeControl = component.form.get('nome');
    const emailControl = component.form.get('email');
    const documentoCpfControl = component.form.get('documento_cpf');
    const telefoneControl = component.form.get('telefone');
    const dataNascimentoControl = component.form.get('data_nascimento');
    const sexoControl = component.form.get('sexo');
    const enderecoControl = component.form.get('endereco');
    const statusControl = component.form.get('status');

    expect(nomeControl?.hasError('required')).toBe(true);
    expect(emailControl?.hasError('required')).toBe(true);
    expect(documentoCpfControl?.hasError('required')).toBe(true);
    expect(telefoneControl?.hasError('required')).toBe(true);
    expect(dataNascimentoControl?.hasError('required')).toBe(true);
    expect(sexoControl?.hasError('required')).toBe(true);
    expect(enderecoControl?.hasError('required')).toBe(true);
    expect(statusControl?.hasError('required')).toBe(false); // Tem valor padrão
  });

  it('should have CPF field enabled in create mode', () => {
    expect(component.form.get('documento_cpf')?.disabled).toBe(false);
  });

  it('should have email validator', () => {
    const emailControl = component.form.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  describe('ngOnInit', () => {
    it('should not load paciente when no id in params', () => {
      spyOn(component, 'loadPaciente');
      
      component.ngOnInit();
      
      expect(component.isEditMode).toBe(false);
      expect(component.pacienteId).toBeNull();
      expect(component.loadPaciente).not.toHaveBeenCalled();
    });

    it('should load paciente when id in params', () => {
      // Corrigir: criar novo TestBed antes de instanciar o componente
      const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
        params: of({ id: '1' })
      });
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [PacienteForm, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: PacientesService, useValue: pacientesService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: activatedRouteSpy }
        ]
      }).compileComponents();
      const newFixture = TestBed.createComponent(PacienteForm);
      const newComponent = newFixture.componentInstance;
      spyOn(newComponent, 'loadPaciente');
      newComponent.ngOnInit();
      expect(newComponent.isEditMode).toBe(true);
      expect(newComponent.pacienteId).toBe('1');
      expect(newComponent.loadPaciente).toHaveBeenCalledWith('1');
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

  describe('loadPaciente', () => {
    it('should load paciente successfully', fakeAsync(() => {
      pacientesService.getById.and.returnValue(of(mockPacienteDto));
      spyOn(console, 'log');
      
      component.loadPaciente('1');
      tick();
      fixture.detectChanges();
      
      expect(component.form.get('nome')?.value).toBe('João Silva');
      expect(component.form.get('email')?.value).toBe('joao@email.com');
      expect(component.form.get('documento_cpf')?.value).toBe('12345678901');
      expect(component.form.get('telefone')?.value).toBe('11999999999');
      expect(component.form.get('data_nascimento')?.value).toBe('1990-01-01');
      expect(component.form.get('sexo')?.value).toBe('Masculino');
      expect(component.form.get('endereco')?.value).toBe('Rua das Flores, 123');
      expect(component.form.get('status')?.value).toBe('Ativo');
      expect(component.loading).toBe(false);
      expect(console.log).toHaveBeenCalledWith('Paciente carregado:', mockPacienteDto);
    }));

    it('should handle date with time component', fakeAsync(() => {
      const pacienteWithTime = {
        ...mockPacienteDto,
        data_nascimento: '1990-01-01T00:00:00Z'
      };
      pacientesService.getById.and.returnValue(of(pacienteWithTime));
      
      component.loadPaciente('1');
      tick();
      fixture.detectChanges();
      
      expect(component.form.get('data_nascimento')?.value).toBe('1990-01-01');
    }));

    it('should handle error when loading paciente', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar paciente';
      pacientesService.getById.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.loadPaciente('1');
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe(errorMessage);
      expect(component.loading).toBe(false);
    }));

    it('should handle error without message', fakeAsync(() => {
      pacientesService.getById.and.returnValue(throwError(() => ({})));
      
      component.loadPaciente('1');
      tick();
      fixture.detectChanges();
      
      expect(component.error).toBe('Erro ao carregar paciente');
      expect(component.loading).toBe(false);
    }));

    it('should disable CPF field in edit mode', fakeAsync(() => {
      pacientesService.getById.and.returnValue(of(mockPacienteDto));
      component.isEditMode = true;
      
      component.loadPaciente('1');
      tick();
      fixture.detectChanges();
      
      expect(component.form.get('documento_cpf')?.disabled).toBe(true);
    }));
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Preencher formulário válido
      component.form.patchValue({
        nome: 'João Silva',
        email: 'joao@email.com',
        documento_cpf: '12345678901',
        telefone: '11999999999',
        data_nascimento: '1990-01-01',
        sexo: 'Masculino',
        endereco: 'Rua das Flores, 123',
        status: 'Ativo'
      });
    });

    it('should not submit when form is invalid', () => {
      component.form.get('nome')?.setValue('');
      spyOn(component.form, 'markAllAsTouched');
      
      component.onSubmit();
      
      expect(component.formSubmitted).toBe(true);
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(component.submitting).toBe(false);
    });

    it('should create paciente when not in edit mode', fakeAsync(() => {
      pacientesService.create.and.returnValue(of(mockPacienteDto));
      spyOn(console, 'log');
      spyOn(router, 'navigate');
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBeNull();
      expect(pacientesService.create).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Form value:', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/pacientes']);
    }));

    it('should update paciente when in edit mode', fakeAsync(() => {
      component.isEditMode = true;
      component.pacienteId = '1';
      pacientesService.update.and.returnValue(of(mockPacienteDto));
      spyOn(console, 'log');
      spyOn(router, 'navigate');
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBeNull();
      expect(pacientesService.update).toHaveBeenCalledWith('1', jasmine.any(Object));
      expect(console.log).toHaveBeenCalledWith('Form value:', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/pacientes']);
    }));

    it('should handle date conversion from DD/MM/YYYY format', fakeAsync(() => {
      component.form.get('data_nascimento')?.setValue('01/01/1990');
      pacientesService.create.and.returnValue(of(mockPacienteDto));
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(pacientesService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data_nascimento: '1990-01-01'
        })
      );
    }));

    it('should handle error when creating paciente', fakeAsync(() => {
      const errorMessage = 'Erro ao cadastrar paciente';
      pacientesService.create.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBe(errorMessage);
    }));

    it('should handle error when updating paciente', fakeAsync(() => {
      component.isEditMode = true;
      component.pacienteId = '1';
      const errorMessage = 'Erro ao atualizar paciente';
      pacientesService.update.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBe(errorMessage);
    }));

    it('should handle error without message when creating', fakeAsync(() => {
      pacientesService.create.and.returnValue(throwError(() => ({})));
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBe('Erro ao cadastrar paciente');
    }));

    it('should handle error without message when updating', fakeAsync(() => {
      component.isEditMode = true;
      component.pacienteId = '1';
      pacientesService.update.and.returnValue(throwError(() => ({})));
      
      component.onSubmit();
      tick();
      fixture.detectChanges();
      
      expect(component.submitting).toBe(false);
      expect(component.error).toBe('Erro ao atualizar paciente');
    }));
  });

  describe('form validation', () => {
    it('should be valid with all required fields', () => {
      component.form.patchValue({
        nome: 'João Silva',
        email: 'joao@email.com',
        documento_cpf: '12345678901',
        telefone: '11999999999',
        data_nascimento: '1990-01-01',
        sexo: 'Masculino',
        endereco: 'Rua das Flores, 123',
        status: 'Ativo'
      });
      
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid with missing required fields', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should be invalid with invalid email', () => {
      component.form.patchValue({
        nome: 'João Silva',
        email: 'invalid-email',
        documento_cpf: '12345678901',
        telefone: '11999999999',
        data_nascimento: '1990-01-01',
        sexo: 'Masculino',
        endereco: 'Rua das Flores, 123',
        status: 'Ativo'
      });
      
      expect(component.form.valid).toBe(false);
      expect(component.form.get('email')?.hasError('email')).toBe(true);
    });
  });
});

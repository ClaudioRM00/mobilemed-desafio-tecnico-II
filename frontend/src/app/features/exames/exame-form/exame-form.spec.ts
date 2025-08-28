import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Observable } from 'rxjs';
import { ExameForm } from './exame-form';
import { ExamesService } from '../../../services/exames';
import { PacientesService } from '../../../services/pacientes';
import { Modalidade } from '../../../shared/utils/modalidade.utils';

describe('ExameForm', () => {
  let component: ExameForm;
  let fixture: ComponentFixture<ExameForm>;
  let examesService: jasmine.SpyObj<ExamesService>;
  let pacientesService: jasmine.SpyObj<PacientesService>;

  const mockExame = {
    id: 'test-id',
    nome_exame: 'Ressonância Magnética',
    modalidade: 'MR' as Modalidade,
    id_paciente: 'patient-id',
    data_exame: '2024-01-15T10:00:00.000Z',
    idempotencyKey: 'test-key-123',
  };

  const mockPaciente = {
    id: 'patient-id',
    nome: 'João Silva',
    email: 'joao@email.com',
    documento_cpf: '123.456.789-00',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    data_nascimento: '1990-01-01',
    telefone: '(11) 99999-9999',
    endereco: 'Rua A, 123',
    sexo: 'Masculino' as any,
  };

  beforeEach(async () => {
    const examesServiceSpy = jasmine.createSpyObj('ExamesService', [
      'create', 'update', 'getById'
    ]);
    const pacientesServiceSpy = jasmine.createSpyObj('PacientesService', [
      'list', 'getById'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ExameForm
      ],
      providers: [
        { provide: ExamesService, useValue: examesServiceSpy },
        { provide: PacientesService, useValue: pacientesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExameForm);
    component = fixture.componentInstance;
    examesService = TestBed.inject(ExamesService) as jasmine.SpyObj<ExamesService>;
    pacientesService = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('nome_exame')?.value).toBe('');
    expect(component.form.get('modalidade')?.value).toBe('');
    expect(component.form.get('id_paciente')?.value).toBe('');
    expect(component.form.get('data_exame')?.value).toBe('');
    expect(component.form.get('idempotencyKey')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.form;
    
    expect(form.valid).toBeFalsy();
    expect(form.get('nome_exame')?.errors?.['required']).toBeTruthy();
    expect(form.get('modalidade')?.errors?.['required']).toBeTruthy();
    expect(form.get('id_paciente')?.errors?.['required']).toBeTruthy();
    expect(form.get('data_exame')?.errors?.['required']).toBeTruthy();
    expect(form.get('idempotencyKey')?.errors?.['required']).toBeTruthy();
  });

  it('should validate nome_exame minimum length', () => {
    const nomeExameControl = component.form.get('nome_exame');
    nomeExameControl?.setValue('ab');
    
    expect(nomeExameControl?.errors?.['minlength']).toBeTruthy();
    
    nomeExameControl?.setValue('Valid Name');
    expect(nomeExameControl?.errors).toBeNull();
  });

  it('should validate nome_exame maximum length', () => {
    const nomeExameControl = component.form.get('nome_exame');
    const longName = 'a'.repeat(101);
    nomeExameControl?.setValue(longName);
    
    expect(nomeExameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate idempotencyKey minimum length', () => {
    const idempotencyKeyControl = component.form.get('idempotencyKey');
    idempotencyKeyControl?.setValue('short');
    
    expect(idempotencyKeyControl?.errors?.['minlength']).toBeTruthy();
    
    idempotencyKeyControl?.setValue('valid-key-with-sufficient-length');
    expect(idempotencyKeyControl?.errors).toBeNull();
  });

  it('should generate idempotency key', () => {
    component.form.patchValue({
      nome_exame: 'Test Exam'
    });
    
    component.gerarChave();
    
    const generatedKey = component.form.get('idempotencyKey')?.value;
    expect(generatedKey).toContain('test-exam');
    expect(generatedKey).toMatch(/test-exam-\d+/);
  });

  it('should load exam data in edit mode', () => {
    examesService.getById.and.returnValue(of(mockExame));

    pacientesService.getById.and.returnValue(of(mockPaciente));

    component.isEditMode = true;
    component.exameId = 'test-id';
    component.loadExame('test-id');

    expect(examesService.getById).toHaveBeenCalledWith('test-id');
    expect(component.form.get('nome_exame')?.value).toBe(mockExame.nome_exame);
    expect(component.form.get('modalidade')?.value).toBe(mockExame.modalidade);
    expect(component.form.get('id_paciente')?.value).toBe(mockExame.id_paciente);
  });

  it('should handle exam loading error', () => {
    examesService.getById.and.returnValue(throwError(() => ({ message: 'Exam not found' })));

    component.isEditMode = true;
    component.exameId = 'test-id';
    component.loadExame('test-id');

    expect(component.error).toBe('Erro ao carregar exame');
  });

  it('should create exam successfully', () => {
    examesService.create.and.returnValue(of(mockExame));

    component.form.patchValue({
      nome_exame: 'Test Exam',
      modalidade: 'MR' as Modalidade,
      id_paciente: 'patient-id',
      data_exame: '2024-01-15T10:00',
      idempotencyKey: 'test-key-123',
    });

    component.onSubmit();

    expect(examesService.create).toHaveBeenCalled();
    expect(component.submitting).toBeFalse();
  });

  it('should update exam successfully', () => {
    examesService.update.and.returnValue(of(mockExame));

    component.isEditMode = true;
    component.exameId = 'test-id';
    component.form.patchValue({
      nome_exame: 'Updated Exam',
      modalidade: 'CT' as Modalidade,
      id_paciente: 'patient-id',
      data_exame: '2024-01-15T10:00',
      idempotencyKey: 'test-key-123',
    });

    component.onSubmit();

    expect(examesService.update).toHaveBeenCalledWith('test-id', jasmine.any(Object));
    expect(component.submitting).toBeFalse();
  });

  it('should handle form submission error', () => {
    examesService.create.and.returnValue(throwError(() => ({ message: 'Creation failed' })));

    component.form.patchValue({
      nome_exame: 'Test Exam',
      modalidade: 'MR' as Modalidade,
      id_paciente: 'patient-id',
      data_exame: '2024-01-15T10:00',
      idempotencyKey: 'test-key-123',
    });

    component.onSubmit();

    expect(component.error).toBe('Erro ao cadastrar exame');
    expect(component.submitting).toBeFalse();
  });

  it('should not submit invalid form', () => {
    component.formSubmitted = true;
    component.onSubmit();

    expect(examesService.create).not.toHaveBeenCalled();
    expect(examesService.update).not.toHaveBeenCalled();
  });

  it('should show loading state during submission', (done) => {
    // Criar um observable que não resolve imediatamente
    const delayedResponse = new Observable<typeof mockExame>(observer => {
      setTimeout(() => {
        observer.next(mockExame);
        observer.complete();
      }, 100);
    });
    
    examesService.create.and.returnValue(delayedResponse);

    component.form.patchValue({
      nome_exame: 'Test Exam',
      modalidade: 'MR' as Modalidade,
      id_paciente: 'patient-id',
      data_exame: '2024-01-15T10:00',
      idempotencyKey: 'test-key-123',
    });

    component.onSubmit();

    // Verificar que submitting é true imediatamente após onSubmit
    expect(component.submitting).toBeTrue();

    // Aguardar a conclusão da operação
    setTimeout(() => {
      expect(component.submitting).toBeFalse();
      done();
    }, 150);
  });
});

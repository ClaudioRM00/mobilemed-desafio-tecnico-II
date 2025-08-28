import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ExamesService, ExameDto } from '../../../services/exames';
import { PacientesService, PacienteDto } from '../../../services/pacientes';
import { MODALIDADES_LIST, getModalidadeLabel as getModalidadeLabelUtil, Modalidade } from '../../../shared/utils/modalidade.utils';

@Component({
  selector: 'app-exame-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './exame-form.html',
  styleUrls: ['./exame-form.scss']
})
export class ExameForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  modalidades: Modalidade[] = MODALIDADES_LIST;
  
  form: FormGroup;
  submitting = false;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  exameId: string | null = null;
  formSubmitted = false;
  
  // Propriedades para busca de pacientes
  allPacientes: PacienteDto[] = [];
  filteredPacientes: PacienteDto[] = [];
  pacientesLoading = false;
  showPacientesDropdown = false;
  selectedPaciente: PacienteDto | null = null;

  constructor(
    private fb: FormBuilder,
    private examesService: ExamesService,
    private pacientesService: PacientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome_exame: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      modalidade: ['', [Validators.required]],
      id_paciente: ['', [Validators.required]],
      data_exame: ['', [Validators.required]],
      idempotencyKey: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      pacienteSearch: [''], // Campo para busca
    });
  }

  ngOnInit() {
    console.log('Modalidades array:', this.modalidades);
    console.log('MODALIDADES_LIST:', MODALIDADES_LIST);
    
    // Teste direto da função
    console.log('Teste CR:', this.getModalidadeLabel('CR'));
    console.log('Teste CT:', this.getModalidadeLabel('CT'));
    console.log('Teste US:', this.getModalidadeLabel('US'));
    
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          this.exameId = id;
          this.loadExame(id);
        } else {
          // Gerar chave de idempotência automaticamente para novos exames
          this.gerarChave();
        }
      });

    // Configurar busca de pacientes
    this.setupPacienteSearch();

    // Adicionar listener para fechar dropdown ao clicar fora
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  loadExame(id: string) {
    this.loading = true;
    this.error = null;

    this.examesService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exame: ExameDto) => {
          // Converter a data para o formato correto para o input datetime-local
          let dataExame = exame.data_exame;
          if (dataExame && typeof dataExame === 'string') {
            // Se a data estiver no formato ISO, converter para o formato local
            if (dataExame.includes('T')) {
              // Remover os milissegundos e segundos se houver
              dataExame = dataExame.split('.')[0];
            }
          }
          
          this.form.patchValue({
            nome_exame: exame.nome_exame,
            modalidade: exame.modalidade,
            id_paciente: exame.id_paciente,
            data_exame: dataExame,
            idempotencyKey: exame.idempotencyKey
          });
          
          // Carregar dados do paciente se existir ID
          if (exame.id_paciente) {
            this.loadPacienteData(exame.id_paciente);
          }
          
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar exame';
          this.loading = false;
        }
      });
  }

  loadPacienteData(pacienteId: string) {
    this.pacientesService.getById(pacienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paciente: PacienteDto) => {
          this.selectedPaciente = paciente;
          this.form.patchValue({
            pacienteSearch: `${paciente.nome} (${paciente.documento_cpf})`
          });
        },
        error: (error) => {
          console.error('Erro ao carregar dados do paciente:', error);
        }
      });
  }

  gerarChave() {
    const base = this.form.get('nome_exame')?.value || 'exame';
    const key = `${base}-${Date.now()}`.replace(/\s+/g, '-').toLowerCase();
    this.form.patchValue({ idempotencyKey: key });
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    // Extrair apenas os campos necessários para o DTO, excluindo pacienteSearch
    const { pacienteSearch, ...formData } = this.form.value;
    
    // Converter a data para preservar o fuso horário local
    let dataExame = formData.data_exame;
    if (dataExame) {
      // Se a data estiver no formato YYYY-MM-DDTHH:mm, criar uma data UTC
      if (typeof dataExame === 'string' && dataExame.includes('T')) {
        // Extrair os componentes da data local
        const [datePart, timePart] = dataExame.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        
        // Criar uma data UTC com os componentes locais
        const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        dataExame = utcDate.toISOString();
      }
    }
    
    const exameData: ExameDto = {
      ...formData,
      data_exame: dataExame
    };

    if (this.isEditMode && this.exameId) {
      this.examesService.update(this.exameId, exameData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            this.router.navigate(['/exames']);
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.message || 'Erro ao atualizar exame';
          }
        });
    } else {
      this.examesService.create(exameData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            this.router.navigate(['/exames']);
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.message || 'Erro ao cadastrar exame';
          }
        });
    }
  }

  setupPacienteSearch() {
    // Carregar todos os pacientes no início
    this.loadAllPacientes();

    // Configurar busca local de pacientes
    this.form.get('pacienteSearch')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.filterPacientes(value);
      });
  }

  loadAllPacientes() {
    this.pacientesLoading = true;
    this.pacientesService.list(1, 100) // Buscar até 100 pacientes
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.allPacientes = response.data;
            this.filteredPacientes = response.data;
          } else {
            this.allPacientes = [];
            this.filteredPacientes = [];
          }
          this.pacientesLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar pacientes:', error);
          this.pacientesLoading = false;
          this.allPacientes = [];
          this.filteredPacientes = [];
        }
      });
  }

  filterPacientes(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 2) {
      this.showPacientesDropdown = false;
      return;
    }

    const filtered = this.allPacientes.filter(paciente => 
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.documento_cpf.includes(searchTerm) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredPacientes = filtered;
    this.showPacientesDropdown = filtered.length > 0;
  }

  onPacienteSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.selectedPaciente = null;
      this.form.patchValue({ id_paciente: '' });
      this.showPacientesDropdown = false;
    } else if (this.selectedPaciente) {
      // Se o usuário digitou algo diferente do paciente selecionado, limpar seleção
      const expectedValue = `${this.selectedPaciente.nome} (${this.selectedPaciente.documento_cpf})`;
      if (value !== expectedValue) {
        this.selectedPaciente = null;
        this.form.patchValue({ id_paciente: '' });
      }
    }
  }

  selectPaciente(paciente: PacienteDto) {
    this.selectedPaciente = paciente;
    this.form.patchValue({ 
      id_paciente: paciente.id,
      pacienteSearch: `${paciente.nome} (${paciente.documento_cpf})`
    });
    this.showPacientesDropdown = false;
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.paciente-search-container')) {
      this.showPacientesDropdown = false;
    }
  }

  getPacienteDisplayName(): string {
    if (this.selectedPaciente) {
      return `${this.selectedPaciente.nome} (${this.selectedPaciente.documento_cpf})`;
    }
    return '';
  }

  getModalidadeLabel(modalidade: string): string {
    console.log('getModalidadeLabel called with:', modalidade);
    const result = getModalidadeLabelUtil(modalidade);
    console.log('getModalidadeLabel result:', result);
    return result;
  }
}

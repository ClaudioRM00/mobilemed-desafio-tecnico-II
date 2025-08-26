import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PacientesService, PacienteDto } from '../../../services/pacientes';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.scss']
})

export class PacienteForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form: FormGroup;
  submitting = false;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  pacienteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      documento_cpf: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      endereco: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          this.pacienteId = id;
          this.loadPaciente(id);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPaciente(id: string) {
    this.loading = true;
    this.error = null;

    this.pacientesService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paciente: PacienteDto) => {
          console.log('Paciente carregado:', paciente);
          
          // Converter a data para o formato correto para o input date
          let dataNascimento = paciente.data_nascimento;
          if (dataNascimento && typeof dataNascimento === 'string') {
            // Se a data estiver no formato YYYY-MM-DD, manter como está
            if (dataNascimento.includes('-')) {
              dataNascimento = dataNascimento.split('T')[0]; // Remove a parte do tempo se houver
            }
          }
          
          this.form.patchValue({
            nome: paciente.nome,
            email: paciente.email,
            documento_cpf: paciente.documento_cpf,
            telefone: paciente.telefone,
            data_nascimento: dataNascimento,
            sexo: paciente.sexo,
            endereco: paciente.endereco
          });
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar paciente';
          this.loading = false;
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.form.value;
    console.log('Form value:', formValue);
    
    // Converter a data para o formato correto se necessário
    let dataNascimento = formValue.data_nascimento;
    if (dataNascimento && typeof dataNascimento === 'string') {
      // Se a data estiver no formato DD/MM/YYYY, converter para YYYY-MM-DD
      if (dataNascimento.includes('/')) {
        const [day, month, year] = dataNascimento.split('/');
        dataNascimento = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    const pacienteData: PacienteDto = {
      ...formValue,
      data_nascimento: dataNascimento
    };
    console.log('Dados sendo enviados para atualização:', pacienteData);

    if (this.isEditMode && this.pacienteId) {
      this.pacientesService.update(this.pacienteId, pacienteData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            this.router.navigate(['/pacientes']);
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.message || 'Erro ao atualizar paciente';
          }
        });
    } else {
      this.pacientesService.create(pacienteData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            this.router.navigate(['/pacientes']);
          },
          error: (error: any) => {
            this.submitting = false;
            this.error = error.message || 'Erro ao cadastrar paciente';
          }
        });
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExamesService, ExameDto, Modalidade } from '../../../services/exames';

@Component({
  selector: 'app-exame-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './exame-form.html',
  styleUrls: ['./exame-form.scss']
})
export class ExameForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  modalidades: Modalidade[] = ['CR','CT','DX','MG','MR','NM','OT','PT','RF','US','XA'];
  
  form: FormGroup;
  submitting = false;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  exameId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examesService: ExamesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome_exame: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      modalidade: ['', [Validators.required]],
      id_paciente: ['', [Validators.required]],
      data_exame: ['', [Validators.required]],
      idempotencyKey: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExame(id: string) {
    this.loading = true;
    this.error = null;

    this.examesService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exame: ExameDto) => {
          this.form.patchValue({
            nome_exame: exame.nome_exame,
            modalidade: exame.modalidade,
            id_paciente: exame.id_paciente,
            data_exame: exame.data_exame,
            idempotencyKey: exame.idempotencyKey
          });
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar exame';
          this.loading = false;
        }
      });
  }

  gerarChave() {
    const base = this.form.get('nome_exame')?.value || 'exame';
    const key = `${base}-${Date.now()}`.replace(/\s+/g, '-').toLowerCase();
    this.form.patchValue({ idempotencyKey: key });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const exameData: ExameDto = {
      ...this.form.value,
      data_exame: new Date(this.form.value.data_exame).toISOString()
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

  getModalidadeLabel(modalidade: string): string {
    const modalidades: { [key: string]: string } = {
      'CR': 'Radiografia Computadorizada',
      'CT': 'Tomografia Computadorizada',
      'DX': 'Radiografia Digital',
      'MG': 'Mamografia',
      'MR': 'Ressonância Magnética',
      'NM': 'Medicina Nuclear',
      'OT': 'Outros',
      'PT': 'Tomografia por Emissão',
      'RF': 'Fluoroscopia',
      'US': 'Ultrassonografia',
      'XA': 'Angiografia'
    };
    return modalidades[modalidade] || modalidade;
  }
}

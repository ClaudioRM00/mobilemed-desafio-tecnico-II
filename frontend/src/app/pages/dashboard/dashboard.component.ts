import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PacientesService, PaginatedResponse as PacientesPaginatedResponse, PacienteDto } from '../../services/pacientes';
import { ExamesService, PaginatedResponse as ExamesPaginatedResponse, ExameDto } from '../../services/exames';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  totalPacientes = 0;
  totalExames = 0;
  loadingPacientes = true;
  loadingExames = true;

  constructor(
    private pacientesService: PacientesService,
    private examesService: ExamesService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats() {
    // Carregar total de pacientes
    this.loadingPacientes = true;
    this.pacientesService.list(1, 1) // Buscar apenas 1 item para obter o total
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PacientesPaginatedResponse<PacienteDto>) => {
          this.totalPacientes = response.meta.total;
          this.loadingPacientes = false;
        },
        error: (error) => {
          console.error('Erro ao carregar total de pacientes:', error);
          this.loadingPacientes = false;
        }
      });

    // Carregar total de exames
    this.loadingExames = true;
    this.examesService.list(1, 1) // Buscar apenas 1 item para obter o total
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ExamesPaginatedResponse<ExameDto>) => {
          this.totalExames = response.meta.total;
          this.loadingExames = false;
        },
        error: (error) => {
          console.error('Erro ao carregar total de exames:', error);
          this.loadingExames = false;
        }
      });
  }
}

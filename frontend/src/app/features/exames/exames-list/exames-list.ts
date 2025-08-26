import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExamesService, ExameDto, PaginatedResponse } from '../../../services/exames';
import { PacientesService, PacienteDto } from '../../../services/pacientes';
import { getModalidadeLabel } from '../../../shared/utils/modalidade.utils';

@Component({
  selector: 'app-exames-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exames-list.html',
  styleUrls: ['./exames-list.scss']
})
export class ExamesList implements OnInit, OnDestroy {
  Math = Math;
  private destroy$ = new Subject<void>();

  paginatedData: PaginatedResponse<ExameDto> | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  
  // Cache para dados dos pacientes
  pacientesCache: { [key: string]: PacienteDto } = {};
  pacientesLoading: { [key: string]: boolean } = {};

  constructor(
    private examesService: ExamesService,
    private pacientesService: PacientesService
  ) {}

  ngOnInit() {
    this.loadExames();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExames() {
    this.loading = true;
    this.error = null;

    this.examesService.list(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: PaginatedResponse<ExameDto>) => {
          this.paginatedData = data;
          this.loading = false;
          
          // Limpar cache de pacientes não utilizados na página atual
          this.cleanPacientesCache();
          
          // Carregar dados dos pacientes para os exames
          this.loadPacientesData();
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar exames';
          this.loading = false;
        }
      });
  }

  cleanPacientesCache() {
    if (!this.paginatedData?.data) return;

    const currentPacienteIds = this.paginatedData.data.map(exame => exame.id_paciente);
    
    // Remover do cache pacientes que não estão na página atual
    Object.keys(this.pacientesCache).forEach(pacienteId => {
      if (!currentPacienteIds.includes(pacienteId)) {
        delete this.pacientesCache[pacienteId];
        delete this.pacientesLoading[pacienteId];
      }
    });
  }

  loadPacientesData() {
    if (!this.paginatedData?.data) return;

    this.paginatedData.data.forEach(exame => {
      if (exame.id_paciente && !this.pacientesCache[exame.id_paciente] && !this.pacientesLoading[exame.id_paciente]) {
        this.loadPaciente(exame.id_paciente);
      }
    });
  }

  loadPaciente(pacienteId: string) {
    if (this.pacientesLoading[pacienteId]) return;

    this.pacientesLoading[pacienteId] = true;

    this.pacientesService.getById(pacienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paciente: PacienteDto) => {
          this.pacientesCache[pacienteId] = paciente;
          this.pacientesLoading[pacienteId] = false;
        },
        error: (error: any) => {
          console.error(`Erro ao carregar paciente ${pacienteId}:`, error);
          this.pacientesLoading[pacienteId] = false;
        }
      });
  }

  getPacienteNome(pacienteId: string): string {
    const paciente = this.pacientesCache[pacienteId];
    if (paciente) {
      return paciente.nome;
    }
    
    if (this.pacientesLoading[pacienteId]) {
      return 'Carregando...';
    }
    
    return `ID: ${pacienteId}`;
  }

  getPacienteStatus(pacienteId: string): string | null {
    const paciente = this.pacientesCache[pacienteId];
    return paciente ? paciente.status : null;
  }

  previousPage() {
    if (this.paginatedData && this.paginatedData.meta.page > 1) {
      this.currentPage = this.paginatedData.meta.page - 1;
      this.loadExames();
    }
  }

  nextPage() {
    if (this.paginatedData && this.paginatedData.meta.page < this.paginatedData.meta.totalPages) {
      this.currentPage = this.paginatedData.meta.page + 1;
      this.loadExames();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadExames();
  }

  getVisiblePages(): number[] {
    if (!this.paginatedData) return [];

    const totalPages = this.paginatedData.meta.totalPages;
    const current = this.paginatedData.meta.page;
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getModalidadeLabel(modalidade: string): string {
    return getModalidadeLabel(modalidade);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

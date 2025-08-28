import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PacientesService, PacienteDto, PaginatedResponse } from '../../../services/pacientes';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pacientes-list.html'
})
export class PacientesList implements OnInit, OnDestroy {
  Math = Math;
  private destroy$ = new Subject<void>();

  paginatedData: PaginatedResponse<PacienteDto> | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;

  constructor(private pacientesService: PacientesService) {}

  ngOnInit() {
    this.loadPacientes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPacientes() {
    this.loading = true;
    this.error = null;

    this.pacientesService.list(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: PaginatedResponse<PacienteDto>) => {
          this.paginatedData = data;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar pacientes';
          this.loading = false;
        }
      });
  }

  previousPage() {
    if (this.paginatedData && this.paginatedData.meta.page > 1) {
      this.currentPage = this.paginatedData.meta.page - 1;
      this.loadPacientes();
    }
  }

  nextPage() {
    if (this.paginatedData && this.paginatedData.meta.page < this.paginatedData.meta.totalPages) {
      this.currentPage = this.paginatedData.meta.page + 1;
      this.loadPacientes();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPacientes();
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
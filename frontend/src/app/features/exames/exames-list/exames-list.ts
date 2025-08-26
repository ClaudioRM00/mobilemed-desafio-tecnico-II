import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExamesService, ExameDto, PaginatedResponse } from '../../../services/exames';

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

  constructor(private examesService: ExamesService) {}

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
        },
        error: (error: any) => {
          this.error = error.message || 'Erro ao carregar exames';
          this.loading = false;
        }
      });
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

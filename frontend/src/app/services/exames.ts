import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Modalidade = 'CR'|'CT'|'DX'|'MG'|'MR'|'NM'|'OT'|'PT'|'RF'|'US'|'XA';

export interface ExameDto {
  id?: string;
  nome_exame: string;
  modalidade: Modalidade;
  id_paciente: string;
  data_exame: string;
  idempotencyKey: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class ExamesService {
  private baseUrl = `${environment.apiBaseUrl}/exames`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 10): Observable<PaginatedResponse<ExameDto>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<ExameDto>>(this.baseUrl, { params });
  }

  create(dto: ExameDto): Observable<ExameDto> {
    return this.http.post<ExameDto>(this.baseUrl, dto);
  }

  getById(id: string): Observable<ExameDto> {
    return this.http.get<ExameDto>(`${this.baseUrl}/${id}`);
  }

  update(id: string, dto: Partial<ExameDto>): Observable<ExameDto> {
    return this.http.put<ExameDto>(`${this.baseUrl}/${id}`, dto);
  }
}

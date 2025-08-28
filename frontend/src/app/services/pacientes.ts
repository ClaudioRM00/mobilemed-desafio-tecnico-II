import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PacienteDto {
  id?: string;
  nome: string;
  email: string;
  data_nascimento: string;
  telefone: string;
  endereco: string;
  documento_cpf: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  status: 'Ativo' | 'Inativo';
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
export class PacientesService {
  private baseUrl = `${environment.apiBaseUrl}/pacientes`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 10, search?: string): Observable<PaginatedResponse<PacienteDto>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PaginatedResponse<PacienteDto>>(this.baseUrl, { params });
  }

  create(dto: PacienteDto): Observable<PacienteDto> {
    return this.http.post<PacienteDto>(this.baseUrl, dto);
  }

  getById(id: string): Observable<PacienteDto> {
    return this.http.get<PacienteDto>(`${this.baseUrl}/${id}`);
  }

  update(id: string, dto: PacienteDto): Observable<PacienteDto> {
    return this.http.patch<PacienteDto>(`${this.baseUrl}/${id}`, dto);
  }
}

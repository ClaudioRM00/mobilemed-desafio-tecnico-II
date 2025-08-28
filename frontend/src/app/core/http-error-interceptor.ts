import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        notify.error('Erro de rede. Verifique sua conexão.');
      } else if (error.status === 400 || error.status === 422) {
        notify.error('Dados inválidos. Verifique os campos.');
      } else if (error.status === 404) {
        notify.warn('Recurso não encontrado.');
      } else if (error.status === 409) {
        notify.warn('Conflito: dado duplicado ou regra de negócio.');
      } else {
        notify.error('Erro inesperado. Tente novamente.');
      }
      return throwError(() => error);
    })
  );
};

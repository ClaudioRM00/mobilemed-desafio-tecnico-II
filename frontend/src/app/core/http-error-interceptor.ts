import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        notify.erroRede();
      } else if (error.status === 400 || error.status === 422) {
        notify.dadosInvalidos();
      } else if (error.status === 404) {
        notify.recursoNaoEncontrado();
      } else if (error.status === 409) {
        notify.conflitoDuplicacao();
      } else {
        notify.erroInesperado();
      }
      return throwError(() => error);
    })
  );
};

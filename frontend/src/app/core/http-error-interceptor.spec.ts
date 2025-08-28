import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { httpErrorInterceptor } from './http-error-interceptor';

describe('httpErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle 400 Bad Request errors', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/exames');
    const mockHandler: HttpHandlerFn = () => {
      const error = new HttpErrorResponse({
        error: { message: 'Dados inválidos' },
        status: 400,
        statusText: 'Bad Request'
      });
      return throwError(() => error);
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error.message).toBe('Dados inválidos');
        done();
      }
    });
  });

  it('should handle 404 Not Found errors', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/exames/non-existent');
    const mockHandler: HttpHandlerFn = () => {
      const error = new HttpErrorResponse({
        error: { message: 'Exame não encontrado' },
        status: 404,
        statusText: 'Not Found'
      });
      return throwError(() => error);
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe('Exame não encontrado');
        done();
      }
    });
  });

  it('should handle 409 Conflict errors', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/pacientes');
    const mockHandler: HttpHandlerFn = () => {
      const error = new HttpErrorResponse({
        error: { message: 'CPF já cadastrado' },
        status: 409,
        statusText: 'Conflict'
      });
      return throwError(() => error);
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error) => {
        expect(error.status).toBe(409);
        expect(error.error.message).toBe('CPF já cadastrado');
        done();
      }
    });
  });

  it('should handle network errors', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockHandler: HttpHandlerFn = () => {
      const error = new HttpErrorResponse({
        error: new ErrorEvent('Network error'),
        status: 0,
        statusText: 'Unknown Error'
      });
      return throwError(() => error);
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error) => {
        expect(error.status).toBe(0);
        expect(error.statusText).toBe('Unknown Error');
        done();
      }
    });
  });

  it('should handle 500 Internal Server Error', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/exames');
    const mockHandler: HttpHandlerFn = () => {
      const error = new HttpErrorResponse({
        error: { message: 'Erro interno do servidor' },
        status: 500,
        statusText: 'Internal Server Error'
      });
      return throwError(() => error);
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error.message).toBe('Erro interno do servidor');
        done();
      }
    });
  });
});

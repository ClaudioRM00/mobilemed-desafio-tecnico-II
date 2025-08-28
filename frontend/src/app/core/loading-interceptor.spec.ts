import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { loadingInterceptor } from './loading-interceptor';
import { LoadingService } from './loading.service';

describe('loadingInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => loadingInterceptor(req, next));

  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['increment', 'decrement']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should show loading on request start', () => {
    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockHandler: HttpHandlerFn = () => of({} as HttpEvent<any>);

    interceptor(mockRequest, mockHandler);

    expect(loadingService.increment).toHaveBeenCalled();
  });

  it('should hide loading on request completion', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockHandler: HttpHandlerFn = () => {
      // Criar um observable que resolve após um delay
      return new Observable(observer => {
        setTimeout(() => {
          observer.next({} as HttpEvent<any>);
          observer.complete();
        }, 10);
      });
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => {
        // Aguardar um pouco mais para garantir que finalize foi chamado
        setTimeout(() => {
          expect(loadingService.decrement).toHaveBeenCalled();
          done();
        }, 20);
      },
      error: done.fail
    });
  });

  it('should hide loading on request error', (done) => {
    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockHandler: HttpHandlerFn = () => {
      // Criar um observable que falha após um delay
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Network error'));
        }, 10);
      });
    };

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('Should have errored'),
      error: () => {
        // Aguardar um pouco mais para garantir que finalize foi chamado
        setTimeout(() => {
          expect(loadingService.decrement).toHaveBeenCalled();
          done();
        }, 20);
      }
    });
  });

  it('should handle multiple concurrent requests', () => {
    const mockRequest1 = new HttpRequest('GET', '/api/test1');
    const mockRequest2 = new HttpRequest('GET', '/api/test2');
    const mockHandler: HttpHandlerFn = () => of({} as HttpEvent<any>);

    // Simular múltiplas requisições simultâneas
    interceptor(mockRequest1, mockHandler);
    interceptor(mockRequest2, mockHandler);

    expect(loadingService.increment).toHaveBeenCalledTimes(2);
  });

  it('should show loading spinner during API calls', () => {
    const mockRequest = new HttpRequest('GET', '/api/exames');
    const mockHandler: HttpHandlerFn = () => of({} as HttpEvent<any>);

    interceptor(mockRequest, mockHandler);

    expect(loadingService.increment).toHaveBeenCalled();
  });
});

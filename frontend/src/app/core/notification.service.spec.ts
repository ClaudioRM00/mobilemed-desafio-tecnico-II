import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'warning', 'error', 'info']);
    
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastService, useValue: toastServiceSpy }
      ],
    });
    service = TestBed.inject(NotificationService);
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call toastService.success with success message', () => {
    const message = 'Operation completed successfully';
    service.success(message);
    
    expect(toastService.success).toHaveBeenCalledWith('Sucesso!', message);
  });

  it('should call toastService.warning with warning message', () => {
    const message = 'Warning: Resource not found';
    service.warn(message);
    
    expect(toastService.warning).toHaveBeenCalledWith('Atenção!', message);
  });

  it('should call toastService.error with error message', () => {
    const message = 'Error: Something went wrong';
    service.error(message);
    
    expect(toastService.error).toHaveBeenCalledWith('Erro!', message);
  });

  it('should handle empty messages', () => {
    service.success('');
    service.warn('');
    service.error('');
    
    expect(toastService.success).toHaveBeenCalledWith('Sucesso!', '');
    expect(toastService.warning).toHaveBeenCalledWith('Atenção!', '');
    expect(toastService.error).toHaveBeenCalledWith('Erro!', '');
  });

  it('should handle special characters in messages', () => {
    const message = 'Special chars: !@#$%^&*()';
    service.success(message);
    service.warn(message);
    service.error(message);
    
    expect(toastService.success).toHaveBeenCalledWith('Sucesso!', message);
    expect(toastService.warning).toHaveBeenCalledWith('Atenção!', message);
    expect(toastService.error).toHaveBeenCalledWith('Erro!', message);
  });

  it('should handle multiple calls', () => {
    service.success('First message');
    service.warn('Second message');
    service.error('Third message');
    service.success('Fourth message');
    
    expect(toastService.success).toHaveBeenCalledTimes(2);
    expect(toastService.warning).toHaveBeenCalledTimes(1);
    expect(toastService.error).toHaveBeenCalledTimes(1);
  });
});

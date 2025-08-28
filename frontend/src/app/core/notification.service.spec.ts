import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    // Spy on console methods
    spyOn(console, 'log').and.stub();
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call console.log with success message', () => {
    const message = 'Operation completed successfully';
    service.success(message);
    
    expect(console.log).toHaveBeenCalledWith('SUCCESS:', message);
  });

  it('should call console.warn with warning message', () => {
    const message = 'Warning: Resource not found';
    service.warn(message);
    
    expect(console.warn).toHaveBeenCalledWith('WARN:', message);
  });

  it('should call console.error with error message', () => {
    const message = 'Error: Something went wrong';
    service.error(message);
    
    expect(console.error).toHaveBeenCalledWith('ERROR:', message);
  });

  it('should handle empty messages', () => {
    service.success('');
    service.warn('');
    service.error('');
    
    expect(console.log).toHaveBeenCalledWith('SUCCESS:', '');
    expect(console.warn).toHaveBeenCalledWith('WARN:', '');
    expect(console.error).toHaveBeenCalledWith('ERROR:', '');
  });

  it('should handle special characters in messages', () => {
    const message = 'Special chars: !@#$%^&*()';
    service.success(message);
    service.warn(message);
    service.error(message);
    
    expect(console.log).toHaveBeenCalledWith('SUCCESS:', message);
    expect(console.warn).toHaveBeenCalledWith('WARN:', message);
    expect(console.error).toHaveBeenCalledWith('ERROR:', message);
  });

  it('should handle multiple calls', () => {
    service.success('First message');
    service.warn('Second message');
    service.error('Third message');
    service.success('Fourth message');
    
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

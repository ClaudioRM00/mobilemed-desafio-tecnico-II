import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', (done) => {
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should set loading to true when increment is called', (done) => {
    service.increment();
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should set loading to false when decrement is called after increment', (done) => {
    service.increment();
    service.decrement();
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should maintain loading true with multiple increments', (done) => {
    service.increment();
    service.increment();
    service.increment();
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should set loading to false only when counter reaches zero', (done) => {
    service.increment();
    service.increment();
    service.decrement(); // counter = 1, still loading
    service.decrement(); // counter = 0, stop loading
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should not go below zero counter', (done) => {
    service.decrement(); // should not affect counter
    service.decrement(); // should not affect counter
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should handle multiple increment/decrement cycles', (done) => {
    service.increment();
    service.decrement();
    service.increment();
    service.increment();
    service.decrement();
    service.decrement();
    
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });
});

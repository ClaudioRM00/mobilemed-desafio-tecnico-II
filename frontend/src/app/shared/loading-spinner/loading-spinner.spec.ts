import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner';
import { LoadingService } from '../../core/loading.service';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      loading$: { subscribe: () => ({ unsubscribe: () => {} }) }
    });

    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject LoadingService', () => {
    expect(component.loading).toBe(loadingService);
  });

  it('should have loading service as public readonly', () => {
    expect(component.loading).toBeDefined();
    expect(typeof component.loading).toBe('object');
  });
});

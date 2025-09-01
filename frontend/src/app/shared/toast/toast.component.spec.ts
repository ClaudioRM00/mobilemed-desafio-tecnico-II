import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../core/toast.service';
import { of } from 'rxjs';
import { Toast } from '../../core/toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockToasts: Toast[] = [
    {
      id: '1',
      type: 'success',
      title: 'Sucesso',
      message: 'Operação realizada com sucesso'
    },
    {
      id: '2',
      type: 'error',
      title: 'Erro',
      message: 'Ocorreu um erro'
    }
  ];

  beforeEach(async () => {
    mockToastService = jasmine.createSpyObj('ToastService', ['remove'], {
      toasts$: of(mockToasts)
    });

    await TestBed.configureTestingModule({
      imports: [ToastComponent, NoopAnimationsModule],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with toasts from service', () => {
    expect(component.toasts).toEqual(mockToasts);
  });

  it('should call remove method on service when removeToast is called', () => {
    const toastId = '1';
    component.removeToast(toastId);
    expect(mockToastService.remove).toHaveBeenCalledWith(toastId);
  });

  it('should return correct CSS classes for different toast types', () => {
    expect(component.getToastClasses('success')).toContain('border-green-500 bg-green-50');
    expect(component.getToastClasses('error')).toContain('border-red-500 bg-red-50');
    expect(component.getToastClasses('warning')).toContain('border-yellow-500 bg-yellow-50');
    expect(component.getToastClasses('info')).toContain('border-blue-500 bg-blue-50');
  });

  it('should return base classes for unknown toast type', () => {
    const result = component.getToastClasses('unknown' as any);
    expect(result).toBe('border-l-4 shadow-lg');
  });

  it('should complete destroy$ subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});

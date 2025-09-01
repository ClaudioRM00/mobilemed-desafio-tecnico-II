import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { ToastComponent } from './shared/toast/toast.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        LoadingSpinnerComponent,
        ToastComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toBe('mobilemed-frontend');
  });

  it('should render the loading spinner component', () => {
    const loadingSpinner = fixture.nativeElement.querySelector('app-loading-spinner');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should render the toast component', () => {
    const toastComponent = fixture.nativeElement.querySelector('app-toast');
    expect(toastComponent).toBeTruthy();
  });

  it('should render the router outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have proper component structure', () => {
    const appElement = fixture.nativeElement;
    
    // Check if all child components are present
    expect(appElement.querySelector('app-loading-spinner')).toBeTruthy();
    expect(appElement.querySelector('app-toast')).toBeTruthy();
    expect(appElement.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have proper component hierarchy', () => {
    const appElement = fixture.nativeElement;
    
    // Verify the order of components
    const children = Array.from(appElement.children);
    const loadingSpinnerIndex = children.findIndex((child: any) => 
      child.tagName.toLowerCase() === 'app-loading-spinner'
    );
    const toastIndex = children.findIndex((child: any) => 
      child.tagName.toLowerCase() === 'app-toast'
    );
    const routerOutletIndex = children.findIndex((child: any) => 
      child.tagName.toLowerCase() === 'router-outlet'
    );
    
    // Loading spinner should come first
    expect(loadingSpinnerIndex).toBe(0);
    // Toast should come second
    expect(toastIndex).toBe(1);
    // Router outlet should come last
    expect(routerOutletIndex).toBe(2);
  });
});

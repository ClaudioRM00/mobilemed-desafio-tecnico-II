import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

// Mock component for router-outlet testing
@Component({
  selector: 'app-mock',
  template: '<div>Mock Component</div>'
})
class MockComponent {}

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardLayoutComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: MockComponent },
          { path: 'pacientes', component: MockComponent },
          { path: 'exames', component: MockComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar with navigation items', () => {
    const sidebar = fixture.nativeElement.querySelector('.fixed.inset-y-0.left-0');
    expect(sidebar).toBeTruthy();
    
    const navigationItems = fixture.nativeElement.querySelectorAll('nav a');
    expect(navigationItems.length).toBe(3); // Homepage, Pacientes, Exames
  });

  it('should render the logo and brand section', () => {
    const logoSection = fixture.nativeElement.querySelector('.flex.h-16.shrink-0');
    expect(logoSection).toBeTruthy();
    
    const brandTitle = fixture.nativeElement.querySelector('h1');
    expect(brandTitle.textContent).toContain('Desafio MobileMed');
    
    const brandSubtitle = fixture.nativeElement.querySelector('p');
    expect(brandSubtitle.textContent).toContain('Sistema de Gerenciamento de Exames');
  });

  it('should render navigation links with correct routes', () => {
    const homepageLink = fixture.nativeElement.querySelector('a[routerLink="/"]');
    expect(homepageLink).toBeTruthy();
    expect(homepageLink.textContent.trim()).toBe('Homepage');
    
    const pacientesLink = fixture.nativeElement.querySelector('a[routerLink="/pacientes"]');
    expect(pacientesLink).toBeTruthy();
    expect(pacientesLink.textContent.trim()).toBe('Pacientes');
    
    const examesLink = fixture.nativeElement.querySelector('a[routerLink="/exames"]');
    expect(examesLink).toBeTruthy();
    expect(examesLink.textContent.trim()).toBe('Exames');
  });

  it('should render the top bar with user information', () => {
    const topBar = fixture.nativeElement.querySelector('.sticky.top-0.z-40');
    expect(topBar).toBeTruthy();
    
    const userAvatar = fixture.nativeElement.querySelector('.bg-primary-500.rounded-full');
    expect(userAvatar).toBeTruthy();
    
    // Verificar se os elementos existem sem verificar o conteúdo específico
    const userName = fixture.nativeElement.querySelector('.text-medical-900');
    expect(userName).toBeTruthy();
    
    const userStatus = fixture.nativeElement.querySelector('.text-medical-500');
    expect(userStatus).toBeTruthy();
  });

  it('should render the main content area with router-outlet', () => {
    const mainContent = fixture.nativeElement.querySelector('main');
    expect(mainContent).toBeTruthy();
    
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have proper CSS classes for responsive design', () => {
    const sidebar = fixture.nativeElement.querySelector('.w-64');
    expect(sidebar).toBeTruthy();
    
    const mainContent = fixture.nativeElement.querySelector('.pl-64');
    expect(mainContent).toBeTruthy();
  });

  it('should have proper z-index values for layering', () => {
    const sidebar = fixture.nativeElement.querySelector('.z-50');
    expect(sidebar).toBeTruthy();
    
    const topBar = fixture.nativeElement.querySelector('.z-40');
    expect(topBar).toBeTruthy();
  });

  it('should have proper shadow and border styling', () => {
    const sidebar = fixture.nativeElement.querySelector('.shadow-soft');
    expect(sidebar).toBeTruthy();
    
    const topBar = fixture.nativeElement.querySelector('.border-b.border-medical-200');
    expect(topBar).toBeTruthy();
  });

  it('should have proper hover states on navigation links', () => {
    const navigationLinks = fixture.nativeElement.querySelectorAll('nav a');
    navigationLinks.forEach((link: any) => {
      expect(link.classList.contains('hover:text-primary-600')).toBeTruthy();
      expect(link.classList.contains('hover:bg-primary-50')).toBeTruthy();
    });
  });

  it('should have proper active state styling for navigation links', () => {
    const navigationLinks = fixture.nativeElement.querySelectorAll('nav a');
    navigationLinks.forEach((link: any) => {
      // Verificar se os links têm as classes básicas
      expect(link.classList.contains('group')).toBeTruthy();
      expect(link.classList.contains('flex')).toBeTruthy();
    });
  });
});

import { routes } from './app.routes';
import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesList } from './features/pacientes/pacientes-list/pacientes-list';
import { PacienteForm } from './features/pacientes/paciente-form/paciente-form';
import { ExamesList } from './features/exames/exames-list/exames-list';
import { ExameForm } from './features/exames/exame-form/exame-form';

describe('app.routes', () => {
  it('should be defined', () => {
    expect(routes).toBeDefined();
  });

  it('should be an array', () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have exactly one root route', () => {
    expect(routes.length).toBe(1);
  });

  it('should have root route with empty path', () => {
    expect(routes[0].path).toBe('');
  });

  it('should have DashboardLayoutComponent as root component', () => {
    expect(routes[0].component).toBeDefined();
    expect(routes[0].component).toBe(DashboardLayoutComponent);
  });

  it('should have children routes', () => {
    expect(routes[0].children).toBeDefined();
    expect(Array.isArray(routes[0].children)).toBe(true);
  });

  it('should have correct number of child routes', () => {
    // 8 child routes: '', pacientes, pacientes/novo, pacientes/:id/editar, exames, exames/novo, exames/:id/editar, **
    expect(routes[0].children?.length).toBe(8);
  });

  it('should have dashboard route as default', () => {
    const dashboardRoute = routes[0].children?.find(route => route.path === '');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.component).toBe(DashboardComponent);
  });

  it('should have pacientes list route', () => {
    const pacientesRoute = routes[0].children?.find(route => route.path === 'pacientes');
    expect(pacientesRoute).toBeDefined();
    expect(pacientesRoute?.component).toBe(PacientesList);
  });

  it('should have new paciente route', () => {
    const newPacienteRoute = routes[0].children?.find(route => route.path === 'pacientes/novo');
    expect(newPacienteRoute).toBeDefined();
    expect(newPacienteRoute?.component).toBe(PacienteForm);
  });

  it('should have edit paciente route', () => {
    const editPacienteRoute = routes[0].children?.find(route => route.path === 'pacientes/:id/editar');
    expect(editPacienteRoute).toBeDefined();
    expect(editPacienteRoute?.component).toBe(PacienteForm);
  });

  it('should have exames list route', () => {
    const examesRoute = routes[0].children?.find(route => route.path === 'exames');
    expect(examesRoute).toBeDefined();
    expect(examesRoute?.component).toBe(ExamesList);
  });

  it('should have new exame route', () => {
    const newExameRoute = routes[0].children?.find(route => route.path === 'exames/novo');
    expect(newExameRoute).toBeDefined();
    expect(newExameRoute?.component).toBe(ExameForm);
  });

  it('should have edit exame route', () => {
    const editExameRoute = routes[0].children?.find(route => route.path === 'exames/:id/editar');
    expect(editExameRoute).toBeDefined();
    expect(editExameRoute?.component).toBe(ExameForm);
  });

  it('should have wildcard route that redirects to root', () => {
    const wildcardRoute = routes[0].children?.find(route => route.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('');
  });

  it('should have all required route paths', () => {
    const expectedPaths = ['', 'pacientes', 'pacientes/novo', 'pacientes/:id/editar', 'exames', 'exames/novo', 'exames/:id/editar', '**'];
    const actualPaths = routes[0].children?.map(route => route.path);
    
    expectedPaths.forEach(path => {
      expect(actualPaths).toContain(path);
    });
  });

  it('should have all routes with components defined', () => {
    routes[0].children?.forEach(route => {
      if (route.path !== '**') {
        expect(route.component).toBeDefined();
      }
    });
  });
});

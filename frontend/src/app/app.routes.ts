import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PacientesList } from './features/pacientes/pacientes-list/pacientes-list';
import { PacienteForm } from './features/pacientes/paciente-form/paciente-form';
import { ExamesList } from './features/exames/exames-list/exames-list';
import { ExameForm } from './features/exames/exame-form/exame-form';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'pacientes', component: PacientesList },
      { path: 'pacientes/novo', component: PacienteForm },
      { path: 'pacientes/:id/editar', component: PacienteForm },
      { path: 'exames', component: ExamesList },
      { path: 'exames/novo', component: ExameForm },
      { path: '**', redirectTo: '' }
    ]
  }
];
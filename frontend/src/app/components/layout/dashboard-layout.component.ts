import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-medical-50">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-soft">
        <!-- Logo and Brand -->
        <div class="flex h-16 shrink-0 items-center px-6 border-b border-medical-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-medical-900">Desafio MobileMed</h1>
              <p class="text-sm text-medical-500">Sistema de Gerenciamento de Exames</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-1 flex-col px-6 py-6">
          <div class="flex flex-1 flex-col">
            <!-- Primary Navigation -->
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-wider text-medical-400 mb-3">Navegação Principal</p>
              <a
                routerLink="/"
                routerLinkActive="bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                [routerLinkActiveOptions]="{exact: true}"
                class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-medical-700 hover:text-primary-600 hover:bg-primary-50"
              >
                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Homepage
              </a>
              <a
                routerLink="/pacientes"
                routerLinkActive="bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-medical-700 hover:text-primary-600 hover:bg-primary-50"
              >
                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Pacientes
              </a>
              <a
                routerLink="/exames"
                routerLinkActive="bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-medical-700 hover:text-primary-600 hover:bg-primary-50"
              >
                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25V6.108" />
                </svg>
                Exames
              </a>
            </div>

            <!-- Secondary Navigation -->
            <div class="mt-8 space-y-1">
              <p class="text-xs font-semibold uppercase tracking-wider text-medical-400 mb-3">Configurações</p>
              <a
                routerLink="/settings"
                routerLinkActive="bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-medical-700 hover:text-primary-600 hover:bg-primary-50"
              >
                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ajustes do Sistema
              </a>
            </div>
          </div>

          <!-- User section -->
          <div class="mt-6 pt-6 border-t border-medical-200">
            <div class="flex items-center gap-3 px-2">
              
            </div>
          </div>
        </nav>
      </div>

      <!-- Main content -->
      <div class="pl-64">
        <!-- Top bar -->
        <div class="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-medical-200 bg-white px-4 shadow-soft sm:gap-x-6 sm:px-6 lg:px-8">
          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="flex flex-1 items-center">
              <div class="ml-auto flex items-center gap-3">
                <div class="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-white">DM</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-medical-900">Dr. Médico</p>
                <p class="text-xs text-medical-500 truncate">Sistema Online</p>
              </div>
              <div class="h-2 w-2 bg-success-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page content -->
        <main class="py-8">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {}

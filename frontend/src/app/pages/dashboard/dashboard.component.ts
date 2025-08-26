import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-medical-900">Homepage</h1>
        <p class="text-medical-600 mt-1">Visão geral do sistema médico</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <!-- Total Patients -->
        <div class="bg-white overflow-hidden shadow-card rounded-lg border border-medical-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-medical-500 truncate">Total de Pacientes</dt>
                  <dd class="text-lg font-medium text-medical-900">156</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-medical-50 px-5 py-3">
            <div class="text-sm">
              <a routerLink="/pacientes" class="font-medium text-primary-700 hover:text-primary-600">
                Ver todos os pacientes
              </a>
            </div>
          </div>
        </div>

        <!-- Total Exams -->
        <div class="bg-white overflow-hidden shadow-card rounded-lg border border-medical-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25V6.108" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-medical-500 truncate">Total de Exames</dt>
                  <dd class="text-lg font-medium text-medical-900">342</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-medical-50 px-5 py-3">
            <div class="text-sm">
              <a routerLink="/exames" class="font-medium text-primary-700 hover:text-primary-600">
                Ver todos os exames
              </a>
            </div>
          </div>
        </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow-card rounded-lg border border-medical-200">
        <div class="px-6 py-4 border-b border-medical-200">
          <h3 class="text-lg font-medium text-medical-900">Ações Rápidas</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a routerLink="/pacientes/novo" class="group relative rounded-lg border border-medical-300 bg-white p-6 hover:border-primary-500 hover:shadow-md transition-all duration-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-medical-900 group-hover:text-primary-600">Novo Paciente</h4>
                  <p class="text-sm text-medical-500">Cadastrar novo paciente</p>
                </div>
              </div>
            </a>

            <a routerLink="/exames/novo" class="group relative rounded-lg border border-medical-300 bg-white p-6 hover:border-primary-500 hover:shadow-md transition-all duration-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center group-hover:bg-success-600 transition-colors">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-medical-900 group-hover:text-success-600">Novo Exame</h4>
                  <p class="text-sm text-medical-500">Agendar novo exame</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow-card rounded-lg border border-medical-200">
        <div class="px-6 py-4 border-b border-medical-200">
          <h3 class="text-lg font-medium text-medical-900">Atividade Recente</h3>
        </div>
        <div class="p-6">
          <div class="flow-root">
            <ul class="-mb-8">
              <li>
                <div class="relative pb-8">
                  <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-medical-200" aria-hidden="true"></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-white">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-medical-500">Exame de sangue <span class="font-medium text-medical-900">concluído</span> para <span class="font-medium text-medical-900">Maria Silva</span></p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-medical-500">
                        <time>3 min atrás</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="relative pb-8">
                  <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-medical-200" aria-hidden="true"></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-medical-500">Novo paciente <span class="font-medium text-medical-900">João Santos</span> cadastrado</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-medical-500">
                        <time>1 hora atrás</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="relative pb-8">
                  <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-medical-200" aria-hidden="true"></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-warning-500 flex items-center justify-center ring-8 ring-white">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-medical-500">Exame de <span class="font-medium text-medical-900">ultrassom</span> agendado para <span class="font-medium text-medical-900">Ana Costa</span></p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-medical-500">
                        <time>2 horas atrás</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="relative">
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-white">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-medical-500">Exame de <span class="font-medium text-medical-900">raio-X</span> concluído para <span class="font-medium text-medical-900">Carlos Oliveira</span></p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-medical-500">
                        <time>3 horas atrás</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}

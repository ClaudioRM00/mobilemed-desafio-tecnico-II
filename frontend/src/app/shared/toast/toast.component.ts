import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastService, Toast } from '../../core/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm sm:max-w-md w-full px-4 sm:px-0">
      <div
        *ngFor="let toast of toasts"
        [@toastAnimation]
        class="w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden min-w-72 sm:min-w-80"
        [ngClass]="getToastClasses(toast.type)"
      >
        <div class="p-4 sm:p-5">
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="flex-shrink-0">
              <svg
                *ngIf="toast.type === 'success'"
                class="h-6 w-6 sm:h-7 sm:w-7 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                *ngIf="toast.type === 'error'"
                class="h-6 w-6 sm:h-7 sm:w-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <svg
                *ngIf="toast.type === 'warning'"
                class="h-6 w-6 sm:h-7 sm:w-7 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <svg
                *ngIf="toast.type === 'info'"
                class="h-6 w-6 sm:h-7 sm:w-7 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm sm:text-base font-semibold text-gray-900 leading-tight">{{ toast.title }}</p>
              <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">{{ toast.message }}</p>
            </div>
            <div class="flex-shrink-0">
              <button
                (click)="removeToast(toast.id)"
                class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <span class="sr-only">Fechar</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%) scale(0.95)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0) scale(1)'
      })),
      transition('void => *', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('300ms cubic-bezier(0.4, 0, 1, 1)')
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: string) {
    this.toastService.remove(id);
  }

  getToastClasses(type: 'success' | 'error' | 'warning' | 'info'): string {
    const baseClasses = 'border-l-4 shadow-lg';
    switch (type) {
      case 'success':
        return `${baseClasses} border-green-500 bg-green-50`;
      case 'error':
        return `${baseClasses} border-red-500 bg-red-50`;
      case 'warning':
        return `${baseClasses} border-yellow-500 bg-yellow-50`;
      case 'info':
        return `${baseClasses} border-blue-500 bg-blue-50`;
      default:
        return baseClasses;
    }
  }
}

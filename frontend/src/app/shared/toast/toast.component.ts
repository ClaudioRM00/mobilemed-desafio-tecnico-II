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
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
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

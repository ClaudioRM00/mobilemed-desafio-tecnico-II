import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  success(title: string, message?: string, duration: number = 5000) {
    this.show({
      type: 'success',
      title,
      message: message || title,
      duration
    });
  }

  error(title: string, message?: string, duration: number = 7000) {
    this.show({
      type: 'error',
      title,
      message: message || title,
      duration
    });
  }

  warning(title: string, message?: string, duration: number = 6000) {
    this.show({
      type: 'warning',
      title,
      message: message || title,
      duration
    });
  }

  info(title: string, message?: string, duration: number = 5000) {
    this.show({
      type: 'info',
      title,
      message: message || title,
      duration
    });
  }

  private show(toast: Omit<Toast, 'id'>) {
    const id = this.generateId();
    const newToast: Toast = { ...toast, id };
    
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration);
    }
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clear() {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

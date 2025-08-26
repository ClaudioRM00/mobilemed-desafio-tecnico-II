import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string) {
    // Trocar por snackbar/toast em UI real
    console.log('SUCCESS:', message);
  }
  warn(message: string) {
    console.warn('WARN:', message);
  }
  error(message: string) {
    console.error('ERROR:', message);
  }
}

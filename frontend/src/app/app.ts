import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, ToastComponent],
  template: `
    <app-loading-spinner></app-loading-spinner>
    <app-toast></app-toast>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'mobilemed-frontend';
}

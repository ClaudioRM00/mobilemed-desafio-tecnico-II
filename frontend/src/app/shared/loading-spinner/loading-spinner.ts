import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.scss']
})
export class LoadingSpinnerComponent {
  constructor(public readonly loading: LoadingService) {}
}

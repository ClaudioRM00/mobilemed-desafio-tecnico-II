import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.html',
  styleUrls: ['./paginator.scss']
})
export class PaginatorComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.page > 1) this.pageChange.emit(this.page - 1);
  }
  next() {
    if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
  }
}

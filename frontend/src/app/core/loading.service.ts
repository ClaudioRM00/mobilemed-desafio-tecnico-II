import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = 0;
  private subject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.subject.asObservable();

  increment() {
    this.counter++;
    if (this.counter === 1) this.subject.next(true);
  }

  decrement() {
    if (this.counter > 0) this.counter--;
    if (this.counter === 0) this.subject.next(false);
  }
}
